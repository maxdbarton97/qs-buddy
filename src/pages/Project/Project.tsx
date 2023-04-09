import { ReactNode, useState, useContext, useEffect } from "react";

import { PlotGroups, Summary, PlotCategories } from "./views";
import ProjectContext from "../../context/project";
import { useParams } from "react-router-dom";
import { IPlotCategorySchema, IProjectSchema } from "../../types";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_PROJECT, GET_SUMMARY } from "../../apollo/queries";
import { exportSummary } from "../../helpers";

export const Project = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [view, setView] = useState<ReactNode>();
  const { state, dispatch } = useContext(ProjectContext);
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error("Project ID not found.");

  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    project: IProjectSchema;
  }>(GET_PROJECT, { variables: { id } });

  const [getSummaryData] = useLazyQuery<{
    paginatedPlotCategories: {
      items: Array<IPlotCategorySchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_SUMMARY, { variables: { projectId: id } });

  if (queryError) throw queryError;

  useEffect(() => {
    if (data) dispatch({ type: "SET_DATA", payload: data.project });
  }, [dispatch, data]);

  useEffect(() => {
    setView(state.view);
  }, [state.view]);

  const onTabSelect = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case "Plot Groups":
        setView(<PlotGroups />);
        break;

      case "Plot Categories":
        setView(<PlotCategories />);
        break;

      default:
        setView(<Summary />);
    }
  };

  if (loading) return null;

  const onExport = async () => {
    const summary = await getSummaryData();
    exportSummary(summary.data?.paginatedPlotCategories.items || []);
  };

  return (
    <div className="page-container">
      <div className="tabs justify-center mt-2">
        <h2 className="mr-8 pb-1">{data?.project.client} </h2>
        <button
          onClick={() => onTabSelect("Summary")}
          className={`tab tab-bordered tab-lg ${
            activeTab === "Summary" ? "tab-active" : null
          }`}
        >
          Summary
        </button>

        <button
          onClick={() => onTabSelect("Plot Groups")}
          className={`tab tab-lg tab-bordered ${
            activeTab === "Plot Groups" ? "tab-active" : null
          }`}
        >
          Plot Groups
        </button>

        <button
          onClick={() => onTabSelect("Plot Categories")}
          className={`tab tab-lg tab-bordered ${
            activeTab === "Plot Categories" ? "tab-active" : null
          }`}
        >
          Plot Categories
        </button>

        {activeTab === "Summary" ? (
          <button
            onClick={onExport}
            className="btn btn-sm absolute right-0 mr-10 bg-success text-success-content border-0"
          >
            Export
          </button>
        ) : null}
      </div>

      {view}
    </div>
  );
};

export default Project;

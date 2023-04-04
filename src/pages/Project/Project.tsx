import { ReactNode, useState, useContext, useEffect } from "react";

import { PlotGroups, Summary, PlotCategories } from "./views";
import ProjectContext from "../../context/project";
import { useParams } from "react-router-dom";

export const Project = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [view, setView] = useState<ReactNode>();
  const { state, dispatch } = useContext(ProjectContext);
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error("Project ID not found.");

  useEffect(() => {
    dispatch({ type: "SET_ID", payload: id });
  }, [id, dispatch]);

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
  return (
    <div className="page-container">
      <div className="tabs justify-center mt-2">
        <h2 className="mr-8 pb-1">Matthew Homes</h2>
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
      </div>

      {view}
    </div>
  );
};

export default Project;

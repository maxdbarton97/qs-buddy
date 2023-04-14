import { useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PLOT_CATEGORIES, GET_PLOT_GROUPS } from "../../../apollo/queries";
import { IPlotCategorySchema, IPlotGroupSchema } from "../../../types";
import {
  CREATE_PLOT_GROUP,
  DELETE_PLOT_GROUP,
  EDIT_PLOT_GROUP,
} from "../../../apollo/mutations";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import ProjectContext from "../../../context/project";
import PlotGroup from "./PlotGroup";

export type PlotGroupForm = {
  name: string;
  plotCategoryId: string;
  plots: string;
};

const PlotGroups = () => {
  const {
    dispatch,
    state: {
      data: { id: projectId },
    },
  } = useContext(ProjectContext);

  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    paginatedPlotGroups: {
      items: Array<IPlotGroupSchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_PLOT_GROUPS, { variables: { projectId } });

  const {
    loading: categoriesLoading,
    data: categoriesData,
    error: categoriesQueryError,
  } = useQuery<{
    paginatedPlotCategories: {
      items: Array<IPlotCategorySchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_PLOT_CATEGORIES, { variables: { projectId } });

  const [modalData, setModalData] =
    useState<Omit<IPlotGroupSchema, "projectId">>();
  const [mutationType, setMutationType] = useState<"Create" | "Edit">("Create");
  const plotGroupModalRef = useRef<HTMLInputElement | null>(null);
  const plotGroupDeleteModalRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PlotGroupForm>();

  const [createFunction, { error: createError }] = useMutation<PlotGroupForm>(
    CREATE_PLOT_GROUP,
    {
      refetchQueries: [GET_PLOT_GROUPS],
    }
  );

  const [editFunction, { error: editError }] = useMutation<PlotGroupForm>(
    EDIT_PLOT_GROUP,
    {
      refetchQueries: [GET_PLOT_GROUPS],
    }
  );

  const [deleteFunction, { error: deleteError }] = useMutation<PlotGroupForm>(
    DELETE_PLOT_GROUP,
    {
      refetchQueries: [GET_PLOT_GROUPS],
    }
  );

  if (loading || categoriesLoading) return <p>Loading ...</p>;
  if (queryError || categoriesQueryError)
    throw queryError || categoriesQueryError;

  const onSubmit = async (data: PlotGroupForm) => {
    if (mutationType === "Create")
      await createFunction({ variables: { ...data, projectId } });
    if (mutationType === "Edit")
      await editFunction({ variables: { ...data, id: modalData?.id } });

    plotGroupModalRef.current?.click();
  };

  const onCreateOpen = () => {
    setMutationType("Create");
    reset();
  };

  const onEditOpen = (plotGroup: Omit<IPlotGroupSchema, "projectId">) => {
    setMutationType("Edit");
    setModalData(plotGroup);
    const { name, plotCategoryId, plots } = plotGroup;
    setValue("name", name);
    setValue("plotCategoryId", plotCategoryId);
    setValue("plots", plots);
  };

  const onDelete = async () => {
    await deleteFunction({ variables: { id: modalData?.id } });
    plotGroupDeleteModalRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-1 justify-between items-baseline mt-4">
        <h3>Plot Groups</h3>
        <label
          className="btn btn-sm"
          htmlFor="plot-group-modal"
          onClick={onCreateOpen}
        >
          Create Plot Group
        </label>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Plot Category</th>
              <th>Plots</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.paginatedPlotGroups.items?.map(
              ({ id, name, plotCategoryId, plotCategory, plots }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{plotCategory?.name}</td>
                  <td>{plots}</td>

                  <td className="flex gap-2 items-center justify-end">
                    <label
                      htmlFor="plot-group-modal"
                      className="btn btn-outline btn-xs"
                      onClick={() =>
                        dispatch({
                          type: "SET_VIEW",
                          payload: <PlotGroup id={id} />,
                        })
                      }
                    >
                      View
                    </label>

                    <label
                      htmlFor="plot-group-modal"
                      className="btn btn-xs"
                      onClick={() =>
                        onEditOpen({
                          id,
                          name,
                          plotCategoryId,
                          plots,
                        })
                      }
                    >
                      Edit
                    </label>

                    <label
                      htmlFor="delete-plot-group-modal"
                      className="btn btn-xs btn-error"
                      onClick={() =>
                        setModalData({
                          id,
                          name,
                          plotCategoryId,
                          plotCategory,
                          plots,
                        })
                      }
                    >
                      Delete
                    </label>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}

      <input
        ref={plotGroupModalRef}
        type="checkbox"
        id="plot-group-modal"
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{mutationType} Plot Group</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                {...register("name")}
                type="text"
                required
                placeholder="Enter Name"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Plot Category</span>
              </label>
              <select
                {...register("plotCategoryId")}
                defaultValue=""
                required
                className="select select-bordered w-full max-w-xs"
              >
                <option disabled>Select Plot Category</option>

                {categoriesData?.paginatedPlotCategories.items.map(
                  ({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Plots</span>
              </label>

              <input
                {...register("plots")}
                required
                placeholder="Enter Plots"
                className="input input-bordered w-full max-w-xs"
              />

              <span className="text-xs mt-1">
                Enter plots seperated by commas e.g 1, 2, 3...
              </span>
            </div>

            {errors ? (
              <span className="text-red-500 text-center">
                {Object.values(errors).map(({ message }) => (
                  <>
                    {message}
                    <br />
                  </>
                ))}
              </span>
            ) : null}

            {createError ? (
              <span className="text-red-500 text-center">
                {createError.message}
              </span>
            ) : null}

            {editError ? (
              <span className="text-red-500 text-center">
                {editError.message}
              </span>
            ) : null}

            <div className="modal-action">
              <label htmlFor="plot-group-modal" className="btn btn-ghost">
                Cancel
              </label>

              <label htmlFor="plot-group-modal">
                <button className="btn">Confirm</button>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}

      <input
        type="checkbox"
        id="delete-plot-group-modal"
        className="modal-toggle"
        ref={plotGroupDeleteModalRef}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Plot Group</h3>

          <p>Are you sure you would like to delete the following plot group?</p>
          <br />
          <p>
            Group Name: <b>{modalData?.name}</b>
          </p>
          <p>
            Plot Category: <b>{modalData?.plotCategory?.name}</b>
          </p>
          <p>
            Plots: <b>{modalData?.plots}</b>
          </p>

          <div className="modal-action">
            {deleteError ? (
              <span className="text-red-500 text-center">
                {deleteError.message}
              </span>
            ) : null}

            <div className="flex-1" />

            <label htmlFor="delete-plot-group-modal" className="btn btn-ghost">
              Cancel
            </label>

            <label className="btn btn-error" onClick={onDelete}>
              Delete
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlotGroups;

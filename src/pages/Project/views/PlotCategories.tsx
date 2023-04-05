import { useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PLOT_CATEGORIES } from "../../../apollo/queries";
import { IPlotCategorySchema } from "../../../types";
import {
  CREATE_PLOT_CATEGORY,
  DELETE_PLOT_CATEGORY,
  EDIT_PLOT_CATEGORY,
} from "../../../apollo/mutations";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import ProjectContext from "../../../context/project";

export type PlotCategoryForm = {
  name: string;
};

const PlotCategories = () => {
  const {
    state: { id: projectId },
  } = useContext(ProjectContext);

  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    paginatedPlotCategories: {
      items: Array<IPlotCategorySchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_PLOT_CATEGORIES, { variables: { projectId } });

  const [modalData, setModalData] =
    useState<Omit<IPlotCategorySchema, "projectId">>();
  const [mutationType, setMutationType] = useState<"Create" | "Edit">("Create");
  const plotCategoryModalRef = useRef<HTMLInputElement | null>(null);
  const plotCategoryDeleteModalRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PlotCategoryForm>();

  const [createFunction, { error: createError }] =
    useMutation<PlotCategoryForm>(CREATE_PLOT_CATEGORY, {
      refetchQueries: [GET_PLOT_CATEGORIES],
    });

  const [editFunction, { error: editError }] = useMutation<PlotCategoryForm>(
    EDIT_PLOT_CATEGORY,
    {
      refetchQueries: [GET_PLOT_CATEGORIES],
    }
  );

  const [deleteFunction, { error: deleteError }] =
    useMutation<PlotCategoryForm>(DELETE_PLOT_CATEGORY, {
      refetchQueries: [GET_PLOT_CATEGORIES],
    });

  if (loading) return <p>Loading ...</p>;
  if (queryError) throw queryError;

  const onSubmit = async (data: PlotCategoryForm) => {
    if (mutationType === "Create")
      await createFunction({ variables: { ...data, projectId } });
    if (mutationType === "Edit")
      await editFunction({ variables: { ...data, id: modalData?.id } });

    plotCategoryModalRef.current?.click();
  };

  const onCreateOpen = () => {
    setMutationType("Create");
    reset();
  };

  const onEditOpen = (plotCategory: Omit<IPlotCategorySchema, "projectId">) => {
    setMutationType("Edit");
    setModalData(plotCategory);
    const { name } = plotCategory;
    setValue("name", name);
  };

  const onDelete = async () => {
    await deleteFunction({ variables: { id: modalData?.id } });
    plotCategoryDeleteModalRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-1 justify-between items-baseline mt-4">
        <h3>Plot Categories</h3>
        <label
          className="btn btn-sm"
          htmlFor="plot-category-modal"
          onClick={onCreateOpen}
        >
          Create Plot Category
        </label>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.paginatedPlotCategories.items?.map(({ id, name }) => (
              <tr key={id}>
                <td>{name}</td>
                <td className="flex gap-2 items-center justify-end">
                  <label
                    htmlFor="plot-category-modal"
                    className="btn btn-xs"
                    onClick={() => onEditOpen({ id, name })}
                  >
                    Edit
                  </label>

                  <label
                    htmlFor="delete-plot-category-modal"
                    className="btn btn-xs btn-error"
                    onClick={() => setModalData({ id, name })}
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}

      <input
        ref={plotCategoryModalRef}
        type="checkbox"
        id="plot-category-modal"
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{mutationType} Plot Category</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                {...register("name")}
                type="text"
                required
                placeholder="Enter Category Name"
                className="input input-bordered w-full max-w-xs"
              />
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
              <label htmlFor="plot-category-modal" className="btn btn-ghost">
                Cancel
              </label>

              <label htmlFor="plot-category-modal">
                <button className="btn">Confirm</button>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}

      <input
        type="checkbox"
        id="delete-plot-category-modal"
        className="modal-toggle"
        ref={plotCategoryDeleteModalRef}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Plot Category</h3>

          <p>
            Are you sure you would like to delete the following plot category?
          </p>
          <br />
          <p>
            Category Name: <b>{modalData?.name}</b>
          </p>

          <div className="modal-action">
            {deleteError ? (
              <span className="text-red-500 text-center">
                {deleteError.message}
              </span>
            ) : null}

            <div className="flex-1" />

            <label
              htmlFor="delete-plot-category-modal"
              className="btn btn-ghost"
            >
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

export default PlotCategories;

import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_PROJECTS } from "../../apollo/queries";
import { IProjectSchema } from "../../types";
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  EDIT_PROJECT,
} from "../../apollo/mutations";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";

export type ProjectForm = {
  client: string;
  contract: string;
  address: string;
};

const Projects = () => {
  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    paginatedProjects: {
      items: Array<IProjectSchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_PROJECTS);

  const [modalData, setModalData] =
    useState<Omit<IProjectSchema, "sundriesPercentage">>();
  const [mutationType, setMutationType] = useState<"Create" | "Edit">("Create");
  const projectModalRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProjectForm>();

  const [createFunction, { error: createError }] = useMutation<ProjectForm>(
    CREATE_PROJECT,
    {
      refetchQueries: [GET_PROJECTS],
    }
  );

  const [editFunction, { error: editError }] = useMutation<ProjectForm>(
    EDIT_PROJECT,
    {
      refetchQueries: [GET_PROJECTS],
    }
  );

  const [deleteFunction, { error: deleteError }] = useMutation<ProjectForm>(
    DELETE_PROJECT,
    {
      refetchQueries: [GET_PROJECTS],
    }
  );

  if (loading) return <p>Loading ...</p>;
  if (queryError) throw queryError;

  const onSubmit = async (data: ProjectForm) => {
    if (mutationType === "Create") await createFunction({ variables: data });
    if (mutationType === "Edit")
      await editFunction({ variables: { ...data, id: modalData?.id } });

    projectModalRef.current?.click();
  };

  const onCreateOpen = () => {
    setMutationType("Create");
    reset();
  };

  const onEditOpen = (project: Omit<IProjectSchema, "sundriesPercentage">) => {
    setMutationType("Edit");
    setModalData(project);
    const { client, contract, address } = project;
    setValue("client", client);
    setValue("contract", contract);
    setValue("address", address);
  };

  return (
    <div className="page-container">
      <div className="flex flex-1 justify-between items-baseline mt-4">
        <h2>Projects</h2>
        <label
          className="btn btn-sm"
          htmlFor="project-modal"
          onClick={onCreateOpen}
        >
          Create Project
        </label>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="table table-compact w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Client</th>
              <th>Contract</th>
              <th>Address</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.paginatedProjects.items?.map(
              ({ id, client, contract, address }) => (
                <tr key={id}>
                  <td>{client}</td>
                  <td>{contract}</td>
                  <td>{address}</td>
                  <td className="flex gap-2 items-center justify-end">
                    <Link to={`/projects/${id}`}>
                      <button className="btn btn-ghost btn-xs">View</button>
                    </Link>

                    <label
                      htmlFor="project-modal"
                      className="btn btn-xs"
                      onClick={() =>
                        onEditOpen({ id, client, contract, address })
                      }
                    >
                      Edit
                    </label>

                    <label
                      htmlFor="delete-project-modal"
                      className="btn btn-xs btn-error"
                      onClick={() =>
                        setModalData({ id, client, contract, address })
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
        ref={projectModalRef}
        type="checkbox"
        id="project-modal"
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{mutationType} Project</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Client</span>
              </label>
              <input
                {...register("client")}
                type="text"
                required
                placeholder="Enter Client"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Contract</span>
              </label>
              <input
                {...register("contract")}
                type="text"
                required
                placeholder="Enter Contract"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                {...register("address")}
                required
                type="text"
                placeholder="Enter Address"
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
              <label htmlFor="project-modal" className="btn btn-ghost">
                Cancel
              </label>

              <label htmlFor="project-modal">
                <button className="btn">Confirm</button>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}

      <input
        type="checkbox"
        id="delete-project-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Project</h3>

          <p>Are you sure you would like to delete the following project?</p>
          <br />
          <p>
            Client: <b>{modalData?.client}</b>
          </p>
          <p>
            Contract: <b>{modalData?.contract}</b>
          </p>
          <p>
            Address: <b>{modalData?.address}</b>
          </p>

          {deleteError ? (
            <span className="text-red-500 text-center">
              {deleteError.message}
            </span>
          ) : null}

          <div className="modal-action">
            <label htmlFor="delete-project-modal" className="btn btn-ghost">
              Cancel
            </label>

            <label
              htmlFor="delete-project-modal"
              className="btn btn-error"
              onClick={() =>
                deleteFunction({ variables: { id: modalData?.id } })
              }
            >
              Delete
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

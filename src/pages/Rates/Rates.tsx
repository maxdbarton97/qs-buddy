import { useMutation, useQuery } from "@apollo/client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { CREATE_RATE, DELETE_RATE, EDIT_RATE } from "../../apollo/mutations";
import { GET_RATE_TYPES, GET_RATES } from "../../apollo/queries";
import { IRateSchema, IRateTypeSchema } from "../../types";

export type RateForm = {
  name: string;
  unitOfMeasurement: string;
  ratePerUnit: number;
  rateTypeId: string;
};

const Rates = () => {
  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    paginatedRates: {
      items: Array<IRateSchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_RATES);

  const {
    loading: rateTypesLoading,
    data: rateTypeData,
    error: rateTypeQueryError,
  } = useQuery<{
    paginatedRateTypes: {
      items: Array<IRateTypeSchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_RATE_TYPES);

  const [modalData, setModalData] = useState<Omit<IRateSchema, "rateTypeId">>();
  const [mutationType, setMutationType] = useState<"Create" | "Edit">("Create");
  const projectModalRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<RateForm>();

  const [createFunction, { error: createError }] = useMutation<RateForm>(
    CREATE_RATE,
    {
      refetchQueries: [GET_RATES],
    }
  );

  const [editFunction, { error: editError }] = useMutation<RateForm>(
    EDIT_RATE,
    {
      refetchQueries: [GET_RATES],
    }
  );

  const [deleteFunction, { error: deleteError }] = useMutation<RateForm>(
    DELETE_RATE,
    {
      refetchQueries: [GET_RATES],
    }
  );

  if (loading || rateTypesLoading) return <p>Loading ...</p>;
  if (queryError) throw queryError;
  if (rateTypeQueryError) throw rateTypeQueryError;

  const onSubmit = async (data: RateForm) => {
    data.ratePerUnit = Number(data.ratePerUnit);
    console.log(data);
    if (mutationType === "Create") await createFunction({ variables: data });
    if (mutationType === "Edit")
      await editFunction({ variables: { ...data, id: modalData?.id } });

    projectModalRef.current?.click();
  };

  const onCreateOpen = () => {
    setMutationType("Create");
    reset();
  };

  const onEditOpen = (project: Omit<IRateSchema, "rateTypeId">) => {
    setMutationType("Edit");
    setModalData(project);
    const { name, unitOfMeasurement, ratePerUnit, rateType } = project;
    setValue("name", name);
    setValue("unitOfMeasurement", unitOfMeasurement);
    setValue("ratePerUnit", ratePerUnit);
    setValue("rateTypeId", rateType?.id as string);
  };

  return (
    <div className="page-container">
      <div className="flex flex-1 justify-between items-baseline mt-4">
        <h2>Rates</h2>
        <label
          className="btn btn-sm"
          htmlFor="project-modal"
          onClick={onCreateOpen}
        >
          Create Rate
        </label>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit of Measurement</th>
              <th>Rate Per Unit</th>
              <th>Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.paginatedRates.items?.map(
              ({ id, name, unitOfMeasurement, ratePerUnit, rateType }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{unitOfMeasurement}</td>
                  <td>{ratePerUnit}</td>
                  <td>{rateType?.name}</td>
                  <td className="flex gap-2 items-center justify-end">
                    <label
                      htmlFor="project-modal"
                      className="btn btn-xs"
                      onClick={() =>
                        onEditOpen({
                          id,
                          name,
                          unitOfMeasurement,
                          ratePerUnit,
                          rateType,
                        })
                      }
                    >
                      Edit
                    </label>

                    <label
                      htmlFor="delete-project-modal"
                      className="btn btn-xs btn-error"
                      onClick={() =>
                        setModalData({
                          id,
                          name,
                          unitOfMeasurement,
                          ratePerUnit,
                          rateType,
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
        ref={projectModalRef}
        type="checkbox"
        id="project-modal"
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{mutationType} Rate</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Item Name</span>
              </label>
              <input
                {...register("name")}
                type="text"
                required
                placeholder="Enter Item Name"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Unit of Measurment</span>
              </label>
              <input
                {...register("unitOfMeasurement")}
                type="text"
                required
                placeholder="Enter Unit of Measurement"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Rate Per Unit</span>
              </label>
              <input
                {...register("ratePerUnit", {
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{2})$/,
                    message:
                      "Please enter a rate per unit to 2 decimal places.",
                  },
                })}
                required
                type="text"
                placeholder="Enter Rate Per Unit"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex gap-4 mt-4">
              {rateTypeData?.paginatedRateTypes.items.map(({ id, name }) => (
                <div className="form-control" key={id}>
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">{name}</span>
                    <input
                      {...register("rateTypeId")}
                      type="radio"
                      className="radio checked:bg-red-500"
                      value={id}
                    />
                  </label>
                </div>
              ))}
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
          <h3 className="font-bold text-lg">Delete Rate</h3>

          <p>Are you sure you would like to delete the following project?</p>
          <br />
          <p>
            Client: <b>{modalData?.name}</b>
          </p>
          <p>
            Contract: <b>{modalData?.unitOfMeasurement}</b>
          </p>
          <p>
            Address: <b>{modalData?.ratePerUnit}</b>
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

export default Rates;

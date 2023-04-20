import { useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  CREATE_PROJECT_RATE,
  EDIT_PROJECT_RATE,
} from "../../../apollo/mutations";
import { GET_PROJECT_RATES } from "../../../apollo/queries";
import ProjectContext from "../../../context/project";
import { currency } from "../../../helpers";
import { IProjectRateSchema } from "../../../types";

type ProjectRateForm = {
  costPerUnit: number;
};

type ProjectRateModalData = {
  id: string;
  projectRateId: string;
  name: string;
  costPerUnit: number;
};

const ProjectRates = () => {
  const {
    state: {
      data: { id: projectId },
    },
  } = useContext(ProjectContext);

  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    paginatedProjectRates: {
      items: Array<IProjectRateSchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_PROJECT_RATES, {
    variables: { projectId },
    fetchPolicy: "network-only",
  });

  const [modalData, setModalData] = useState<ProjectRateModalData>();

  const projectRateModalRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<ProjectRateForm>();

  const [createFunction, { error: createError }] = useMutation<ProjectRateForm>(
    CREATE_PROJECT_RATE,
    {
      refetchQueries: [GET_PROJECT_RATES],
    }
  );

  const [editFunction, { error: editError }] = useMutation<ProjectRateForm>(
    EDIT_PROJECT_RATE,
    {
      refetchQueries: [GET_PROJECT_RATES],
    }
  );

  if (loading) return <p>Loading ...</p>;
  if (queryError) throw queryError;

  // CHANGE

  const onSubmit = async (data: ProjectRateForm) => {
    data.costPerUnit = parseFloat(data.costPerUnit.toString());
    if (modalData?.projectRateId)
      await editFunction({
        variables: { ...data, id: modalData?.projectRateId },
      });
    else {
      await createFunction({
        variables: { ...data, rateId: modalData?.id, projectId },
      });
    }

    projectRateModalRef.current?.click();
  };

  const onChangeOpen = (data: ProjectRateModalData) => {
    setModalData(data);
    const { costPerUnit } = data;
    setValue("costPerUnit", costPerUnit);
  };

  return (
    <>
      <div className="flex flex-1 justify-between items-baseline mt-4">
        <h3>Project Rates</h3>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="table table-compact w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost Per Unit</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.paginatedProjectRates.items?.map(
              ({ id, projectRateId = "", name, costPerUnit }) => {
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>£{currency.format(costPerUnit)}</td>
                    <td className="flex gap-2 items-center justify-end">
                      <label
                        htmlFor="plot-category-modal"
                        className="btn btn-xs"
                        onClick={() =>
                          onChangeOpen({
                            id,
                            projectRateId,
                            name,
                            costPerUnit,
                          })
                        }
                      >
                        Change
                      </label>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}

      <input
        ref={projectRateModalRef}
        type="checkbox"
        id="plot-category-modal"
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit rate for {modalData?.name}</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Cost Per Unit</span>
              </label>
              <input
                {...register("costPerUnit", {
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{2})$/,
                    message:
                      "Please enter a cost per unit to 2 decimal places.",
                  },
                })}
                required
                type="text"
                placeholder="Enter Cost Per Unit"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            {errors ? (
              <span className="text-red-500 text-center">
                {Object.values(errors).map(({ message }, i) => (
                  <span key={`error-${i}`}>
                    {message}
                    <br />
                  </span>
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
    </>
  );
};

export default ProjectRates;

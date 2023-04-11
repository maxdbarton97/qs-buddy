import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_PROJECT } from "../../../apollo/mutations";
import { useForm } from "react-hook-form";
import ProjectContext from "../../../context/project";
import { IProjectSchema } from "../../../types";

export type SettingsForm = {
  sundriesPercentage: number;
};

const PlotCategories = () => {
  const {
    dispatch,
    state: { data },
  } = useContext(ProjectContext);

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsForm>({
    defaultValues: {
      sundriesPercentage: data.sundriesPercentage,
    },
  });

  const [editFunction, { error: editError }] =
    useMutation<IProjectSchema>(EDIT_PROJECT);

  const onSubmit = async (formData: SettingsForm) => {
    const sundriesPercentageAsFloat = parseFloat(
      formData.sundriesPercentage.toString()
    );

    const updatedProject = await editFunction({
      variables: { ...data, sundriesPercentage: sundriesPercentageAsFloat },
    });

    // update project context...
    dispatch({
      type: "SET_DATA",
      payload: updatedProject.data as IProjectSchema,
    });

    reset({ sundriesPercentage: sundriesPercentageAsFloat });
  };

  return (
    <>
      <div className="flex flex-1 justify-between items-baseline mt-4 mb-4">
        <h3>Settings</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Sundries Percentage</span>
          </label>
          <input
            {...register("sundriesPercentage", {
              required: true,
              pattern: {
                value: /^([1-9]\d?|0)(\.\d{1,2})?$/,
                message: "Invalid percentage value.",
              },
              validate: {
                max: (value) =>
                  parseFloat(value.toString()) <= 100 ||
                  "Value must be less than or equal to 100",
                min: (value) =>
                  parseFloat(value.toString()) >= 0 ||
                  "Value must be greater than or equal to 0",
              },
            })}
            required
            type="text"
            placeholder="Enter Sundries Percentage"
            className="input input-bordered w-full max-w-xs mb-1"
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

        {editError ? (
          <span className="text-red-500 text-center">{editError.message}</span>
        ) : null}

        <div className="modal-action justify-start mt-4">
          <label htmlFor="project-modal">
            <button className="btn btn-success btn-md" disabled={!isDirty}>
              Save
            </button>
          </label>
        </div>
      </form>
    </>
  );
};

export default PlotCategories;

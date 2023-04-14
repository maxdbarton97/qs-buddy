import { useMutation, useQuery } from "@apollo/client";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  CREATE_PLOT_GROUP_ITEM,
  DELETE_PLOT_GROUP_ITEM,
  EDIT_PLOT_GROUP_ITEM,
} from "../../../apollo/mutations";
import { GET_PLOT_GROUP, GET_RATES } from "../../../apollo/queries";
import ProjectContext from "../../../context/project";
import { currency, plotGroupTotal } from "../../../helpers";
import {
  IPlotGroupItemSchema,
  IPlotGroupSchema,
  IRateSchema,
} from "../../../types";
import PlotGroups from "./PlotGroups";

type PlotGroupProps = {
  id: string;
};

export type PlotGroupItemForm = {
  rateId: string;
  quantity: number;
};

// TODO: CRUD for plot group items - summary and project report afterwards!

const PlotGroup: FC<PlotGroupProps> = ({ id }) => {
  const {
    dispatch,
    state: {
      data: { sundriesPercentage },
    },
  } = useContext(ProjectContext);
  const [modalData, setModalData] =
    useState<Omit<IPlotGroupItemSchema, "rateId">>();
  const [mutationType, setMutationType] = useState<"Create" | "Edit">("Create");
  const plotGroupItemModalRef = useRef<HTMLInputElement | null>(null);
  const plotGroupItemDeleteModalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!id) dispatch({ type: "SET_VIEW", payload: <PlotGroups /> });
  }, [dispatch, id]);

  const {
    loading,
    data,
    error: queryError,
  } = useQuery<{
    plotGroup: IPlotGroupSchema;
  }>(GET_PLOT_GROUP, { variables: { id } });

  const {
    loading: ratesLoading,
    data: ratesData,
    error: ratesQueryError,
  } = useQuery<{
    paginatedRates: {
      items: Array<IRateSchema>;
      total: number;
      currentPage: number;
    };
  }>(GET_RATES);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PlotGroupItemForm>();

  const [createFunction, { error: createError }] =
    useMutation<PlotGroupItemForm>(CREATE_PLOT_GROUP_ITEM, {
      refetchQueries: [GET_PLOT_GROUP],
    });

  const [editFunction, { error: editError }] = useMutation<PlotGroupItemForm>(
    EDIT_PLOT_GROUP_ITEM,
    {
      refetchQueries: [GET_PLOT_GROUP],
    }
  );

  const [deleteFunction, { error: deleteError }] =
    useMutation<PlotGroupItemForm>(DELETE_PLOT_GROUP_ITEM, {
      refetchQueries: [GET_PLOT_GROUP],
    });

  if (loading || ratesLoading) return null;
  if (queryError) throw queryError;
  if (ratesQueryError) throw ratesQueryError;

  const onCreateOpen = () => {
    setMutationType("Create");
    reset();
  };

  const onEditOpen = (plotGroupItem: Omit<IPlotGroupItemSchema, "rateId">) => {
    setMutationType("Edit");
    setModalData(plotGroupItem);
    const { rate, quantity } = plotGroupItem;
    setValue("rateId", rate?.id as string);
    setValue("quantity", quantity);
  };

  const onSubmit = async (formData: PlotGroupItemForm) => {
    formData.quantity = Number(formData.quantity);
    if (mutationType === "Create")
      await createFunction({
        variables: { ...formData, plotGroupId: data?.plotGroup.id as string },
      });
    if (mutationType === "Edit")
      await editFunction({ variables: { ...formData, id: modalData?.id } });

    plotGroupItemModalRef.current?.click();
  };

  const total = plotGroupTotal(data?.plotGroup?.plotGroupItems || []);
  const onDelete = async () => {
    await deleteFunction({ variables: { id: modalData?.id } });
    plotGroupItemDeleteModalRef.current?.click();
  };

  return (
    <div className="flex flex-col mt-4">
      <div className="flex gap-4 items-center mb-4">
        <button
          className="btn btn-sm btn-outline w-fit"
          onClick={() =>
            dispatch({ type: "SET_VIEW", payload: <PlotGroups /> })
          }
        >
          {"< "}Back
        </button>
        <h4>
          Plot Group - {data?.plotGroup.name} ({data?.plotGroup.plots})
        </h4>
      </div>
      <div className="flex justify-between">
        <h3>Labour</h3>
        <label
          className="btn btn-sm"
          htmlFor="plot-group-item-modal"
          onClick={onCreateOpen}
        >
          Add Labour
        </label>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Total</th>

              <th />
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.plotGroup.plotGroupItems?.map(
              ({ id, quantity, rate, plotGroupId }) => (
                <tr key={id}>
                  <td>{rate?.name}</td>
                  <td>{quantity}</td>
                  <td>
                    £{currency.format((rate?.costPerUnit as number) * quantity)}
                  </td>
                  <th className="flex gap-2 items-center justify-end">
                    <label
                      className="btn btn-outline btn-xs"
                      htmlFor="plot-group-item-modal"
                      onClick={() =>
                        onEditOpen({
                          id,
                          rate,
                          quantity,
                          plotGroupId,
                        })
                      }
                    >
                      Edit
                    </label>

                    <label
                      htmlFor="delete-plot-group-item-modal"
                      className="btn btn-xs btn-error"
                      onClick={() =>
                        setModalData({
                          id,
                          rate,
                          quantity,
                          plotGroupId,
                        })
                      }
                    >
                      Delete
                    </label>
                  </th>
                </tr>
              )
            )}

            <tr>
              <td />
              <td className="bg-accent text-accent-content">Total</td>
              <td className="bg-accent text-accent-content">
                £{currency.format(total)}
              </td>
              <td />
            </tr>

            <tr>
              <td />
              <td className="bg-secondary text-secondary-content">
                Sundries ({sundriesPercentage}%)
              </td>
              {/* TODO: Make sundries a varaible in settings (saved in DB) */}
              <td className="bg-secondary text-secondary-content">
                £{currency.format(total * (sundriesPercentage / 100))}
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}

      <input
        ref={plotGroupItemModalRef}
        type="checkbox"
        id="plot-group-item-modal"
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{mutationType} Plot Group</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Labour</span>
              </label>
              <select
                {...register("rateId")}
                defaultValue=""
                required
                className="select select-bordered w-full max-w-xs"
              >
                <option disabled>Select Labour</option>

                {ratesData?.paginatedRates.items.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>

              <input
                {...register("quantity", { valueAsNumber: true })}
                required
                type="number"
                placeholder="Enter Quantity"
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
              <label htmlFor="plot-group-item-modal" className="btn btn-ghost">
                Cancel
              </label>

              <label htmlFor="plot-group-item-modal">
                <button className="btn">Confirm</button>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}

      <input
        type="checkbox"
        id="delete-plot-group-item-modal"
        className="modal-toggle"
        ref={plotGroupItemDeleteModalRef}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Plot Group</h3>

          <p>Are you sure you would like to delete the following plot group?</p>
          <br />
          <p>
            Labour: <b>{modalData?.rate?.name}</b>
          </p>
          <p>
            Quantity: <b>{modalData?.quantity}</b>
          </p>

          <div className="modal-action">
            {deleteError ? (
              <span className="text-red-500 text-center">
                {deleteError.message}
              </span>
            ) : null}

            <div className="flex-1" />

            <label
              htmlFor="delete-plot-group-item-modal"
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
    </div>
  );
};

export default PlotGroup;

import { useContext, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { GET_SUMMARY } from "../../../apollo/queries";
import { IPlotCategorySchema } from "../../../types";
import ProjectContext from "../../../context/project";
import {
  categoryTotal,
  categoryTotalBlocks,
  categoryTotalBricks,
  currency,
  grandTotal,
  grandTotalBricks,
  plotGroupTotal,
  totalBlocks,
  totalBricks,
} from "../../../helpers";

const Summary = () => {
  const {
    state: {
      data: { id },
    },
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
  }>(GET_SUMMARY, { variables: { projectId: id } });

  if (loading) return null;
  if (queryError) throw queryError;

  const total = grandTotal(data?.paginatedPlotCategories.items || []);
  const grandTotalBricksValue = grandTotalBricks(
    data?.paginatedPlotCategories.items || []
  );
  const grandTotalBlocksValue = grandTotalBricks(
    data?.paginatedPlotCategories.items || []
  );

  return (
    <div>
      <div className="overflow-x-auto mt-4 break-words">
        {data?.paginatedPlotCategories?.items.map(
          ({ id, name, plotGroups }) => {
            if (!plotGroups?.length) return null;
            const categoryTotalValue = categoryTotal(plotGroups);
            const categoryTotalBricksValue = categoryTotalBricks(plotGroups);
            const categoryTotalBlocksValue = categoryTotalBlocks(plotGroups);

            return (
              <Fragment key={id}>
                <h3>{name}</h3>
                <table className="table w-full mt-3 mb-4 table-fixed">
                  {/* head */}
                  <thead>
                    <tr>
                      <th className="w-1/3">Plot Group Name</th>
                      <th>Labour</th>
                      <th>Sundries</th>
                      <th>Bricks</th>
                      <th>Blocks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plotGroups?.map(
                      ({ id: pgId, name: plotGroupName, plotGroupItems }) => {
                        const total = plotGroupTotal(plotGroupItems || []);
                        const totalBricksValue = totalBricks(
                          plotGroupItems || []
                        );
                        const totalBlocksValue = totalBlocks(
                          plotGroupItems || []
                        );

                        return (
                          <tr key={pgId}>
                            <td width={400}>{plotGroupName}</td>
                            <td>£{currency.format(total)}</td>
                            <td>£{currency.format(total * 0.05)}</td>
                            <td>{totalBricksValue}</td>
                            <td>{totalBlocksValue}</td>
                          </tr>
                        );
                      }
                    )}

                    <tr className="border-2 border-base-300">
                      <td className="">Total</td>
                      <td className="">
                        £{currency.format(categoryTotalValue)}
                      </td>
                      <td className="">
                        £{currency.format(categoryTotalValue * 0.05)}
                      </td>

                      <td>{categoryTotalBricksValue}</td>
                      <td>{categoryTotalBlocksValue}</td>
                    </tr>
                  </tbody>
                </table>
              </Fragment>
            );
          }
        )}
      </div>
      <table className="table w-full mt-4 table-fixed">
        <thead>
          <tr>
            <th className="w-1/3">Grand Total</th>
            <th>Labour</th>
            <th>Sundries</th>
            <th>Bricks</th>

            <th>Blocks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>-</td>
            <td className="bg-neutral-600 text-neutral-content">
              £{currency.format(total)}
            </td>
            <td className="bg-neutral-600 text-neutral-content">
              £{currency.format(total * 0.05)}
            </td>

            <td className="bg-neutral-600 text-neutral-content">
              {grandTotalBricksValue}
            </td>
            <td className="bg-neutral-600 text-neutral-content">
              {grandTotalBlocksValue}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Summary;

import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { IPlotCategorySchema } from "../types";
import {
  grandTotal,
  grandTotalBlocks,
  grandTotalBricks,
  plotGroupTotal,
  totalBlocks,
  totalBricks,
} from "./totals";
import { currency } from "./intl-formats";

const sortByPlot = (_a: any, _b: any) => {
  let a = _a.PLOT;
  let b = _b.PLOT;

  if (a.includes("-")) {
    a = a.split("-")[0];
  }

  if (a.includes("/")) {
    a = a.split("/")[0];
  }

  if (b.includes("/")) {
    b = b.split("/")[0];
  }

  if (b.includes("-")) {
    b = b.split("-")[0];
  }
  return Number(a) - Number(b);
};

const exportSummary = async (plotCategoryData: IPlotCategorySchema[]) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtention = ".xlsx";

  // generate the data json

  const json: Record<string, Record<string, unknown>[]> = {};

  plotCategoryData.forEach((pc) => {
    json[pc.name] = [];

    pc.plotGroups?.forEach((pg) => {
      const total = plotGroupTotal(pg?.plotGroupItems || []);
      pg.plots.split(",").forEach((p) => {
        // push to array an remove spaces to help with sorting
        json[pc.name].push({
          PLOT: p.replaceAll(" ", ""),
          // Space between cells
          "": "",
          LABOUR: `£${currency.format(total)}`,
          SUNDRIES: `£${currency.format(total * 0.05)}`,
          " ": "",
          BRICKS: totalBricks(pg.plotGroupItems || []),
          BLOCKS: totalBlocks(pg.plotGroupItems || []),
        });
      });
    });

    // numerically sort the category plots
    json[pc.name] = json[pc.name].sort(sortByPlot);
    json[pc.name] = [
      {},
      { PLOT: pc.name, "": "", LABOUR: "", SUNDRIES: "" },
      {},
      ...json[pc.name],
    ];
  });

  const rows: any[] = [];
  Object.keys(json).forEach((k) => {
    rows.push(...json[k]);
  });

  // Add Totals

  rows.push(
    {},
    {
      PLOT: "TOTAL",
      LABOUR: `£${currency.format(grandTotal(plotCategoryData || []))}`,
      SUNDRIES: `£${currency.format(
        grandTotal(plotCategoryData || []) * 0.05
      )}`,
      BRICKS: grandTotalBricks(plotCategoryData || []),
      BLOCKS: grandTotalBlocks(plotCategoryData || []),
    }
  );

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, "test-summary" + fileExtention);
};

export default exportSummary;

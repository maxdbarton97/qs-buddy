import {
  IPlotCategorySchema,
  IPlotGroupItemSchema,
  IPlotGroupSchema,
} from "../types";

export const plotGroupTotal = (plotGroupItems: IPlotGroupItemSchema[]) => {
  return plotGroupItems.reduce((prev, { quantity, rate }) => {
    return prev + (rate?.ratePerUnit as number) * quantity;
  }, 0) as number;
};

export const categoryTotal = (plotGroups: IPlotGroupSchema[]) => {
  return plotGroups.reduce((prev, { plotGroupItems }) => {
    return prev + plotGroupTotal(plotGroupItems || []);
  }, 0) as number;
};

export const grandTotal = (categories: IPlotCategorySchema[]) => {
  return categories.reduce((prev, { plotGroups }) => {
    return prev + categoryTotal(plotGroups || []);
  }, 0) as number;
};

export const totalBricks = (plotGroupItems: IPlotGroupItemSchema[]) => {
  return plotGroupItems.reduce((prev, { quantity, rate }) => {
    if (rate?.rateType?.name === "Brick") {
      return prev + quantity;
    } else {
      return prev;
    }
  }, 0) as number;
};

export const totalBlocks = (plotGroupItems: IPlotGroupItemSchema[]) => {
  return plotGroupItems.reduce((prev, { quantity, rate }) => {
    if (rate?.rateType?.name === "Block") {
      return prev + quantity;
    } else {
      return prev;
    }
  }, 0) as number;
};

export const categoryTotalBricks = (plotGroups: IPlotGroupSchema[]) => {
  return plotGroups.reduce((prev, { plotGroupItems }) => {
    return prev + totalBricks(plotGroupItems || []);
  }, 0) as number;
};

export const categoryTotalBlocks = (plotGroups: IPlotGroupSchema[]) => {
  return plotGroups.reduce((prev, { plotGroupItems }) => {
    return prev + totalBlocks(plotGroupItems || []);
  }, 0) as number;
};

export const grandTotalBricks = (categories: IPlotCategorySchema[]) => {
  return categories.reduce((prev, { plotGroups }) => {
    return prev + categoryTotalBricks(plotGroups || []);
  }, 0) as number;
};

export const grandTotalBlocks = (categories: IPlotCategorySchema[]) => {
  return categories.reduce((prev, { plotGroups }) => {
    return prev + categoryTotalBricks(plotGroups || []);
  }, 0) as number;
};

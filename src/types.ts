import { ReactNode } from "react";

declare global {
  interface Window {
    environment: {
      isProd: () => boolean;
    };
  }
}

// REACT

export type ProjectState = {
  view: ReactNode;
  data: IProjectSchema;
};

export type ProjectAction =
  | { type: "SET_VIEW"; payload: ReactNode }
  | { type: "SET_DATA"; payload: IProjectSchema };

// API

export interface PaginatedItems<T> {
  total: number;
  items: T[];
  currentPage: number;
}

export interface IProjectSchema {
  id: string;
  client: string;
  contract: string;
  address: string;
  sundriesPercentage: number;
}

export interface IPlotCategorySchema {
  id: string;
  name: string;
  projectId: string;
  plotGroups?: IPlotGroupSchema[];
}

export interface IPlotGroupSchema {
  id: string;
  name: string;
  plotCategoryId: string;
  projectId: string;
  plots: string;
  plotCategory?: IPlotCategorySchema;
  plotGroupItems?: IPlotGroupItemSchema[];
}

export interface IRateTypeSchema {
  id: string;
  name: string;
}

export interface IRateSchema {
  id: string;
  name: string;
  unitOfMeasurement: string;
  rateTypeId: string;
  rateType?: IRateTypeSchema;
}

export interface IProjectRateSchema extends IRateSchema {
  id: string;
  projectRateId?: string;
  costPerUnit: number;
}

export interface IPlotGroupItemSchema {
  id: string;
  rateId: string;
  quantity: number;
  plotGroupId: string;
  rate?: IProjectRateSchema;
}

declare global {
  interface Window {
    IS_PROD: boolean;
  }
}

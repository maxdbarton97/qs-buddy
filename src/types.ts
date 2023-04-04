import { ReactNode } from "react";

// SCHEMAS

// REACT

export type ProjectState = {
  view: ReactNode;
  id: String;
};

export type ProjectAction =
  | { type: "SET_VIEW"; payload: ReactNode }
  | { type: "SET_ID"; payload: string };

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
  ratePerUnit: number;
  rateTypeId: string;
  rateType?: IRateTypeSchema;
}

export interface IPlotGroupItemSchema {
  id: string;
  rateId: string;
  quantity: number;
  plotGroupId: string;
  rate?: IRateSchema;
}

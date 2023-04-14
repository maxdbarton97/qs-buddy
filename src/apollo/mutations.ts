import { gql } from "@apollo/client";

// ===
// Projects
// ===

export const CREATE_PROJECT = gql`
  mutation createProject(
    $client: String!
    $contract: String!
    $address: String!
  ) {
    createProject(client: $client, contract: $contract, address: $address) {
      id
      client
      contract
      address
    }
  }
`;

export const EDIT_PROJECT = gql`
  mutation editProject(
    $id: String!
    $client: String!
    $contract: String!
    $address: String!
    $sundriesPercentage: Float
  ) {
    editProject(
      id: $id
      client: $client
      contract: $contract
      address: $address
      sundriesPercentage: $sundriesPercentage
    ) {
      id
      client
      contract
      address
      sundriesPercentage
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation deleteProject($id: String!) {
    deleteProject(id: $id) {
      id
      client
      contract
      address
    }
  }
`;

// ===
// Rates
// ===

export const CREATE_RATE = gql`
  mutation createRate(
    $name: String!
    $unitOfMeasurement: String!
    $rateTypeId: String!
  ) {
    createRate(
      name: $name
      unitOfMeasurement: $unitOfMeasurement
      rateTypeId: $rateTypeId
    ) {
      id
      name
      unitOfMeasurement
      rateTypeId
    }
  }
`;

export const EDIT_RATE = gql`
  mutation editRate(
    $id: String!
    $name: String!
    $unitOfMeasurement: String!
    $rateTypeId: String!
  ) {
    editRate(
      id: $id
      name: $name
      unitOfMeasurement: $unitOfMeasurement
      rateTypeId: $rateTypeId
    ) {
      id
      name
      unitOfMeasurement
      rateTypeId
    }
  }
`;

export const DELETE_RATE = gql`
  mutation deleteRate($id: String!) {
    deleteRate(id: $id) {
      id
      name
      unitOfMeasurement
      rateTypeId
    }
  }
`;

// ===
// Project Rates
// ===

export const CREATE_PROJECT_RATE = gql`
  mutation createProjectRate(
    $projectId: String!
    $rateId: String!
    $costPerUnit: Float!
  ) {
    createProjectRate(
      projectId: $projectId
      rateId: $rateId
      costPerUnit: $costPerUnit
    ) {
      id
      costPerUnit
    }
  }
`;

export const EDIT_PROJECT_RATE = gql`
  mutation editProjectRate($id: String!, $costPerUnit: Float!) {
    editProjectRate(id: $id, costPerUnit: $costPerUnit) {
      id
      costPerUnit
    }
  }
`;

// ===
// Plot Categories
// ===

export const CREATE_PLOT_CATEGORY = gql`
  mutation createPlotCategory($name: String!, $projectId: String!) {
    createPlotCategory(name: $name, projectId: $projectId) {
      id
      name
    }
  }
`;

export const EDIT_PLOT_CATEGORY = gql`
  mutation editPlotCategory($id: String!, $name: String!) {
    editPlotCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_PLOT_CATEGORY = gql`
  mutation deletePlotCategory($id: String!) {
    deletePlotCategory(id: $id) {
      id
      name
    }
  }
`;

// ===
// Plot Groups
// ===

export const CREATE_PLOT_GROUP = gql`
  mutation createPlotGroup(
    $name: String!
    $projectId: String!
    $plotCategoryId: String!
    $plots: String!
  ) {
    createPlotGroup(
      name: $name
      projectId: $projectId
      plotCategoryId: $plotCategoryId
      plots: $plots
    ) {
      id
      name
      projectId
      plotCategoryId
      plots
    }
  }
`;

export const EDIT_PLOT_GROUP = gql`
  mutation editPlotGroup(
    $id: String!
    $name: String!
    $plotCategoryId: String!
    $plots: String!
  ) {
    editPlotGroup(
      id: $id
      name: $name
      plotCategoryId: $plotCategoryId
      plots: $plots
    ) {
      id
      name
      projectId
      plotCategoryId
      plots
    }
  }
`;

export const DELETE_PLOT_GROUP = gql`
  mutation deletePlotGroup($id: String!) {
    deletePlotGroup(id: $id) {
      id
      name
      projectId
      plotCategoryId
      plots
    }
  }
`;

// ===
// Plot Group Items
// ===

export const CREATE_PLOT_GROUP_ITEM = gql`
  mutation createPlotGroupItem(
    $rateId: String!
    $plotGroupId: String!
    $quantity: Int!
  ) {
    createPlotGroupItem(
      rateId: $rateId
      plotGroupId: $plotGroupId
      quantity: $quantity
    ) {
      id
      rateId
      quantity
    }
  }
`;

export const EDIT_PLOT_GROUP_ITEM = gql`
  mutation editPlotGroupItem($id: String!, $rateId: String!, $quantity: Int!) {
    editPlotGroupItem(id: $id, rateId: $rateId, quantity: $quantity) {
      id
      rateId
      quantity
    }
  }
`;

export const DELETE_PLOT_GROUP_ITEM = gql`
  mutation deletePlotGroupItem($id: String!) {
    deletePlotGroupItem(id: $id) {
      id
      rateId
      quantity
    }
  }
`;

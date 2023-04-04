import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query {
    paginatedProjects {
      items {
        id
        client
        contract
        address
      }
    }
  }
`;

export const GET_RATES = gql`
  query {
    paginatedRates {
      items {
        id
        name
        unitOfMeasurement
        ratePerUnit
        rateType {
          id
          name
        }
      }
    }
  }
`;

export const GET_RATE_TYPES = gql`
  query {
    paginatedRateTypes {
      items {
        id
        name
      }
    }
  }
`;

export const GET_PLOT_CATEGORIES = gql`
  query paginatedPlotCategories($projectId: String!) {
    paginatedPlotCategories(projectId: $projectId) {
      items {
        id
        name
      }
    }
  }
`;

export const GET_PLOT_GROUPS = gql`
  query paginatedPlotGroups($projectId: String!) {
    paginatedPlotGroups(projectId: $projectId) {
      items {
        id
        name
        plotCategoryId
        plotCategory {
          id
          name
        }
        plots
      }
    }
  }
`;

export const GET_PLOT_GROUP = gql`
  query plotGroup($id: String!) {
    plotGroup(id: $id) {
      id
      name
      plotCategoryId
      plotCategory {
        id
        name
      }
      plots
      plotGroupItems {
        id
        rate {
          id
          name
          ratePerUnit
        }
        quantity
      }
    }
  }
`;

// ===
// Summary
// ===

export const GET_SUMMARY = gql`
  query summary($projectId: String!) {
    paginatedPlotCategories(projectId: $projectId) {
      items {
        id
        name
        plotGroups {
          id
          name
          plotGroupItems {
            id
            quantity
            rate {
              id
              ratePerUnit
              rateType {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

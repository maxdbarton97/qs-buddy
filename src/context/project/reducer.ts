/* eslint-disable no-param-reassign */

import { ProjectAction, ProjectState } from "../../types";

const appReducer = (state: ProjectState, { type, payload }: ProjectAction) => {
  switch (type) {
    case "SET_VIEW":
      state.view = payload;
      break;

    case "SET_DATA":
      state.data = payload;
      break;

    default:
      throw new Error(
        "The project reducer did not recognise your action type."
      );
  }

  return { ...state };
};

export default appReducer;

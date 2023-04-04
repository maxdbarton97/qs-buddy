import { createContext, createElement } from "react";
import { ProjectAction, ProjectState } from "../../types";
export default createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}>({
  state: {
    view: createElement("div"),
    id: "",
  },
  dispatch: () => null,
});

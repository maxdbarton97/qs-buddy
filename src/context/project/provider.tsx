import { useReducer, FC, ReactNode, useMemo } from "react";

import ProjectContext from "./context";
import projectReducer from "./reducer";
import { Summary } from "../../pages/Project/views";

type Props = {
  children: ReactNode;
};

const ProjectContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    view: <Summary />,
    id: "",
  });

  const values = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ProjectContext.Provider value={values}>{children}</ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

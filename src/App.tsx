import Header from "./components/Header";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Project, Projects, Rates } from "./pages";
import ProjectContextProvider from "./context/project/provider";

function App() {
  return (
    <Router>
      <div className="absolute inset-0 flex flex-col">
        <Header />

        <div className="page-container">
          <Routes>
            <Route path="/" Component={Projects} />
            <Route path="/rates" Component={Rates} />
            <Route path="/projects" Component={Projects} />
            <Route
              path="/projects/:id"
              element={
                <ProjectContextProvider>
                  <Project />
                </ProjectContextProvider>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

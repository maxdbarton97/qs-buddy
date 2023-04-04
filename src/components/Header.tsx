import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="navbar shadow">
      <div className="flex-1">
        <Link to="/">
          <div className="btn btn-ghost normal-case text-xl">QS Buddy</div>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="projects">Projects</Link>
          </li>

          <li>
            <Link to="rates">Rates</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;

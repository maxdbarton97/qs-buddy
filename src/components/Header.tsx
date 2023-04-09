import { ChangeEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "lofi");

  const onThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
    localStorage.setItem("theme", event.target.value);
  };

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="navbar shadow">
      <div className="flex-1">
        <Link to="/">
          <div className="btn btn-ghost normal-case text-xl">QS Buddy</div>
        </Link>

        <div className="h-8 w-[1px] bg-black mx-4" />
        <span>Theme</span>

        <select
          value={theme}
          onChange={onThemeChange}
          className="select select-bordered select-sm w-40 max-w-xs ml-2 self-center capitalize"
        >
          {themes.map((t) => (
            <option key={t} className="capitalize" value={t}>
              {t}
            </option>
          ))}
        </select>
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

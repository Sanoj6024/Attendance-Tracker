import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="px-3 py-1 rounded-md text-sm font-medium
                 bg-gray-200 dark:bg-gray-700
                 text-gray-800 dark:text-gray-200"
    >
      {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>
  );
};

export default DarkModeToggle;

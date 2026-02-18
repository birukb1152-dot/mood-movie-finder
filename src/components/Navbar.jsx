import { Link, NavLink } from "react-router-dom";
import { Film, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md border-b border-gray-700 bg-[#111827]/80 z-50">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex font-bold text-2xl items-center gap-2 text-white"
        >
          <Film className="text-blue-500" />
          MoodFlix
        </Link>

        <div className="hidden md:flex gap-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-500"
                : "text-white hover:text-gray-300 duration-300"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-500"
                : "text-white hover:text-gray-300 duration-300"
            }
          >
            Favorites
          </NavLink>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-gray-400"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-500"
                : "text-white hover:text-gray-300 duration-300"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-500"
                : "text-white hover:text-gray-300 duration-300"
            }
          >
            Favorites
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

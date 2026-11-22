import { NavLink, useNavigate } from "react-router-dom";
import { Film, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  const goHome = () => {
    closeMenu();
    navigate("/");
  };

  const linkStyle = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "text-blue-400 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-500 after:rounded-full"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111827]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
        {/* Gradient Brand Logo */}
        <button
          onClick={goHome}
          type="button"
          aria-label="Go to homepage"
          className="flex items-center gap-2.5 group"
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition duration-300">
            <Film size={21} className="text-white" />
          </span>

          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
            MoodFlix
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" end className={linkStyle}>
            Home
          </NavLink>

          <NavLink to="/favorites" className={linkStyle}>
            Favorites
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition duration-300"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 pb-4">
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold transition duration-300 ${
                isActive
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold transition duration-300 ${
                isActive
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            Favorites
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

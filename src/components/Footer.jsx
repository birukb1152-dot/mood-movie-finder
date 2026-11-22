import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#0B1120]">
      <div className="max-w-6xl mx-auto px-5 py-7">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg hover:text-blue-400 transition duration-300"
            >
              <Film size={21} className="text-blue-500" />
              MoodFlix
            </Link>

            <p className="text-sm text-slate-400">Find Your Movie Mood.</p>
          </div>

          {/* Navigation and attribution */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <nav className="flex items-center gap-6 text-sm">
              <Link
                to="/"
                className="text-slate-400 hover:text-slate-200 transition duration-300"
              >
                Home
              </Link>

              <Link
                to="/favorites"
                className="text-slate-400 hover:text-slate-200 transition duration-300"
              >
                Favorites
              </Link>
            </nav>

            <p className="text-xs text-slate-500 text-center md:text-right">
              Movie data provided by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 transition duration-300"
              >
                TMDb
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <p className="text-xs text-slate-500">
            © {currentYear} MoodFlix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

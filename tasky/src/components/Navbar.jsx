import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const controlBtn =
    "inline-flex items-center justify-center gap-2 rounded-2xl border transition-colors " +
    "border-[#DCD0C0] bg-[#EAE2D6] text-[#5D4E3A] hover:bg-[#DCD0C0] " +
    "dark:border-[#4A3F32] dark:bg-transparent dark:text-[#DCD0C0] dark:hover:bg-[#2B241C]";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#DCD0C0] bg-[#EAE2D6]/90 backdrop-blur transition-colors dark:border-[#4A3F32] dark:bg-[#211B14]/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 cursor-pointer"
          aria-label="Tasky home"
        >
          {/* Tasky logo — checkmark in a rounded square */}
          <svg
            id="tasky-new-logo"
            style={{ width: "24px", height: "24px" }}
            className="shrink-0 fill-none stroke-[#A38666]"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5.5" strokeWidth="2" />
            <path
              d="M8 12.5l2.75 2.75L16 9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-xl font-bold tracking-tight text-[#5D4E3A] dark:text-[#EAE2D6]">
            Tasky
          </span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link to="/profile" className="group flex items-center gap-2.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#DCD0C0] dark:ring-[#4A3F32]"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A38666] text-xs font-semibold text-[#F5F0E6] dark:bg-[#C9A886] dark:text-[#211B14]">
                {initials}
              </span>
            )}
            <span className="text-sm font-medium text-[#5D4E3A] transition-colors group-hover:text-[#A38666] dark:text-[#DCD0C0] dark:group-hover:text-[#C9A886]">
              {user?.name || "User"}
            </span>
          </Link>

          <button
            onClick={() => setIsDark((d) => !d)}
            aria-label="Toggle theme"
            className={`${controlBtn} h-9 w-9`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={logout}
            className="ml-4 inline-flex h-9 items-center gap-2 rounded-2xl border px-3.5 text-sm font-medium transition-colors border-[#DCD0C0] bg-[#EAE2D6] text-[#5D4E3A] hover:bg-[#DCD0C0] dark:border-[#A38666] dark:bg-transparent dark:text-[#DCD0C0] dark:hover:bg-[#A38666]/15"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="rounded-2xl p-2 text-[#5D4E3A] transition-colors hover:bg-[#DCD0C0] dark:text-[#DCD0C0] dark:hover:bg-[#2B241C] sm:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#DCD0C0] bg-[#EAE2D6] px-4 py-4 sm:hidden dark:border-[#4A3F32] dark:bg-[#211B14]">
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="mb-4 flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#DCD0C0] dark:ring-[#4A3F32]"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A38666] text-xs font-semibold text-[#F5F0E6] dark:bg-[#C9A886] dark:text-[#211B14]">
                {initials}
              </span>
            )}
            <span className="text-sm font-medium text-[#5D4E3A] dark:text-[#DCD0C0]">{user?.name || "User"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark((d) => !d)}
              aria-label="Toggle theme"
              className={`${controlBtn} h-10 w-10`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl border px-3.5 text-sm font-medium transition-colors border-[#DCD0C0] bg-[#EAE2D6] text-[#5D4E3A] hover:bg-[#DCD0C0] dark:border-[#A38666] dark:bg-transparent dark:text-[#DCD0C0] dark:hover:bg-[#A38666]/15"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

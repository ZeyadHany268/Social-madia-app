import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LogOut,
  Home,
  Bookmark,
  Bell,
  UserRound,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useContext } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenContext } from "../Context/TokenContext";
import { useUser } from "../Context/UserContext";
import { getUnreadCount } from "../api/notifications";
import { numberFrom } from "../api/parse";
import ThemeToggle from "./../Conpunant/Themetoggle";
import Avatar from "../Conpunant/Avatar";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/bookmarks", label: "Saved", icon: Bookmark },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function useUnreadCount() {
  const { token } = useContext(TokenContext);
  const { data } = useQuery({
    queryKey: ["unreadCount", token],
    queryFn: getUnreadCount,
    enabled: !!token,
    refetchInterval: 60_000,
    select: (res) => numberFrom(res, ["count", "unreadCount", "unread"]),
  });
  return data ?? 0;
}

export default function Navbar() {
  const { token, setToken } = useContext(TokenContext);
  const { user } = useUser();
  const unread = useUnreadCount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear(); // drop the previous user's cached data
    navigate("/login");
  }

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
        <div className="glass surface mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full pl-2 pr-2 shadow-[var(--shadow-pop)] sm:h-16 sm:pl-3">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="bg-brand-gradient grid h-10 w-10 place-items-center rounded-full text-white shadow-lg shadow-[var(--brand)]/30 transition-transform duration-200 group-hover:rotate-12">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-ink">
              Connect
            </span>
          </Link>

          {/* Desktop nav */}
          {token && (
            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label="Main"
            >
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-brand" : "text-muted hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-brand-soft"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <Icon className="h-[18px] w-[18px]" />
                        {label}
                        {to === "/notifications" && unread > 0 && (
                          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--like)] px-1.5 text-[11px] font-bold text-white">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {token ? (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:block"
                  aria-label="My profile"
                >
                  <Avatar src={user?.photo} name={user?.name} size={40} ring />
                </Link>

                <button
                  onClick={handleLogout}
                  className="icon-btn"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost !h-10 !border-transparent !bg-transparent max-sm:hidden"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>

                <Link
                  to="/signup"
                  className="btn-primary !h-10 !px-4 max-sm:hidden"
                >
                  <UserPlus className="h-4 w-4" />
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      {token && (
        <nav
          aria-label="Main"
          className="glass surface fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full p-1.5 shadow-[var(--shadow-pop)] md:hidden"
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              aria-label={label}
              className={({ isActive }) =>
                `relative grid h-12 w-16 place-items-center rounded-full transition-colors ${
                  isActive ? "bg-brand-soft text-brand" : "text-muted"
                }`
              }
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" />
                {to === "/notifications" && unread > 0 && (
                  <span className="badge absolute -top-3 left-3">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}

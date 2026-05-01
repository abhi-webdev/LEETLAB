import React from "react"
import { User, Code, LogOut, Trophy, Code2, LogIn, Bell, Zap, Menu, ChevronDown, X, CreditCard, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-4 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-navbar px-6 py-3 rounded-2xl pointer-events-auto transition-all duration-300 hover:shadow-primary/5">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/leetlab.svg"
              className="h-10 w-10 bg-primary/10 p-1.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className={`text-xl font-bold tracking-tight bg-clip-text text-transparent hidden sm:block ${theme === "light" ? "bg-gradient-to-r from-base-content via-primary to-base-content" : "bg-gradient-to-r from-white to-gray-400"}`}>
            Leetlab
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/problems"
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary ${isActive('/problems') ? 'nav-link-active' : 'text-base-content/60'}`}
          >
            <Code2 className="w-4 h-4" />
            Problems
          </Link>
          <Link
            to="/contests"
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary ${isActive('/contests') ? 'nav-link-active' : 'text-base-content/60'}`}
          >
            <Trophy className="w-4 h-4" />
            Contests
          </Link>
          <Link
            to="/pricing"
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary ${isActive('/pricing') ? 'nav-link-active' : 'text-base-content/60'}`}
          >
            <Zap className="w-4 h-4" />
            Pricing
          </Link>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm hover:bg-white/10 transition-all duration-300"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-500" />
            )}
          </button>

          {authUser && (
            <button className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary transition-colors hidden sm:flex">
              <Bell className="w-5 h-5" />
            </button>
          )}

          {authUser ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-transparent hover:border-primary/50 transition-all duration-300 p-0.5">
                <div className="w-9 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={
                      authUser?.image ||
                      `https://api.dicebear.com/9.x/adventurer/svg?seed=${authUser?.email}`
                    }
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
              </label>
              <div
                tabIndex={0}
                className="dropdown-content mt-3 z-[1] p-2 bg-base-100 border border-base-content/10 shadow-2xl rounded-2xl w-56 md:w-48 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="px-4 py-3 mb-2 border-b border-base-content/10">
                  <p className="text-sm font-bold text-base-content truncate">{authUser?.name}</p>
                  <p className="text-[10px] text-base-content/60 truncate">{authUser?.email}</p>
                </div>

                <ul className="menu menu-sm p-0 gap-1">
                  <li>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group">
                      <User className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                  </li>
                  <li className="md:hidden">
                    <Link to="/problems" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Code2 className="w-4 h-4 opacity-70" />
                      <span className="font-medium">Problems</span>
                    </Link>
                  </li>
                  <li className="md:hidden">
                    <Link to="/contests" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Trophy className="w-4 h-4 opacity-70" />
                      <span className="font-medium">Contests</span>
                    </Link>
                  </li>
                  <li className="md:hidden">
                    <Link to="/pricing" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Zap className="w-4 h-4 opacity-70" />
                      <span className="font-medium">Pricing</span>
                    </Link>
                  </li>

                  {authUser?.role === "ADMIN" && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <li>
                        <Link to="/add-problem" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                          <Code className="w-4 h-4 opacity-70" />
                          <span className="font-medium">Add Problem</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/create-contest" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                          <Trophy className="w-4 h-4 opacity-70" />
                          <span className="font-medium">Create Contest</span>
                        </Link>
                      </li>
                    </div>
                  )}

                  <li className="mt-2 pt-2 border-t border-white/10">
                    <LogoutButton className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-error/10 hover:text-error transition-all group">
                      <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className="font-medium">Logout</span>
                    </LogoutButton>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm h-10 rounded-xl px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
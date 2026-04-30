import React from "react"
import { User, Code, LogOut, Trophy, Code2, LogIn } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";



const Navbar = ()=>{

    const {authUser} = useAuthStore()

    return (
     <nav className="sticky top-0 z-50 w-full py-5 px-4 md:px-0">
      <div className="flex w-full justify-between mx-auto max-w-4xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-4 rounded-2xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/leetlab.svg" className="h-18 w-18 bg-primary/20 text-primary border-none px-2 py-2 rounded-full" />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
          Leetlab 
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link to="/problems" className="btn btn-ghost btn-sm gap-1 text-sm font-semibold hidden md:flex">
            <Code2 className="w-4 h-4" />
            Problems
          </Link>
          <Link to="/contests" className="btn btn-ghost btn-sm gap-1 text-sm font-semibold hidden md:flex">
            <Trophy className="w-4 h-4" />
            Contests
          </Link>

          {authUser ? (
            /* ── Logged-in: Avatar dropdown ── */
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row ">
                <div className="w-10 rounded-full ">
                  <img
                    src={
                      authUser?.image ||
                      `https://api.dicebear.com/9.x/adventurer/svg?seed=${authUser?.email}}`
                    }
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
              >
                <li>
                  <p className="text-base font-semibold">
                    {authUser?.name}
                  </p>
                  <hr className="border-gray-200/10" />
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/problems"
                    className="hover:bg-primary hover:text-white text-base font-semibold md:hidden"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Problems
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contests"
                    className="hover:bg-primary hover:text-white text-base font-semibold md:hidden"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Contests
                  </Link>
                </li>
                {authUser?.role === "ADMIN" && (
                  <>
                    <li>
                      <Link
                        to="/add-problem"
                        className="hover:bg-primary hover:text-white text-base font-semibold"
                      >
                        <Code className="w-4 h-4 mr-1" />
                        Add Problem
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/create-contest"
                        className="hover:bg-primary hover:text-white text-base font-semibold"
                      >
                        <Trophy className="w-4 h-4 mr-1" />
                        Create Contest
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <LogoutButton className="hover:bg-primary hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          ) : (
            /* ── Guest: Login / Sign Up buttons ── */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm gap-1 font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm font-semibold rounded-xl px-5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
    )
}


export default Navbar;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-600">
            E-Commerce
          </Link>

          {/* Right Action Items */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-9 w-9 bg-gray-100 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* Profile Icon / Avatar */}
                <Link
                  to="/profile"
                  title="View & Edit Profile"
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {getInitials(user?.name || "U")}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline-block pr-1">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1 rounded transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
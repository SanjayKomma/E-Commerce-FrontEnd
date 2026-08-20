import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-600">
            E-Commerce
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-indigo-600 transition">
              Products
            </Link>
            <Link to="/categories" className="hover:text-indigo-600 transition">
              Categories
            </Link>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-4">
            {loading ? (
              /* Skeleton placeholder while checking session to prevent flicker */
              <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-gray-600 hover:text-red-600 cursor-pointer"
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
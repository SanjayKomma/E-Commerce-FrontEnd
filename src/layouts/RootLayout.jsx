import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import { AuthProvider } from "../context/AuthContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
};

export default RootLayout;
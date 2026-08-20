import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./views/Home/HomePage";
import LoginPage from "./views/login/LoginPage";
import RegisterPage from "./views/login/RegisterPage";
import ProfilePage from "./views/profile/ProfilePage";
import ProtectedRoute from "./common/ProtectedRoute";
import ProductPage from "./components/products/ProductCard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: "products",
        element:<ProductPage />
      }
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
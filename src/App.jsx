import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./views/Home/HomePage";
import LoginPage from "./views/login/LoginPage";
import RegisterPage from "./views/login/RegisterPage";
import ProfilePage from "./views/profile/ProfilePage";
import ProtectedRoute from "./common/ProtectedRoute";
import ProductPage from "./components/products/ProductCard";
import { CartProvider } from "./context/CartContext";
import CartPage from "./views/cart/CartPage";
import ProductDetailPage from "./views/products/ProductDetailPage";
import CheckoutPage from "./views/checkout/CheckoutPage";
import OrderDetailPage from "./components/orders/OrderDetailPage";
import MyOrdersPage from "./components/orders/MyOrdersPage";
import ManageProductsPage from "./views/dashboard/ManageProductsPage";

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
      },
      {
        path: "cart",
        element:<CartPage />
      },
      {
        path: "products/:id",
        element:<ProductDetailPage />
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
      {
        path: "orders",
        element: <MyOrdersPage />,
      },
      {
        path: "dashboard/products",
        element:<ProtectedRoute allowedRoles={["admin", "seller"]}><ManageProductsPage /></ProtectedRoute>,
      }
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
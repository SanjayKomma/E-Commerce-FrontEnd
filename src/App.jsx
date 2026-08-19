import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./views/Home/HomePage";
import LoginPage from "./views/login/LoginPage";
import RootLayout from "./layouts/RootLayout";
import RegisterPage from "./views/login/RegisterPage";
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element : <LoginPage />,
      },
      {
        path: 'register',
        element : <RegisterPage />,
      }
    ],
  },
]);
const App = () => {
  return (
    <RouterProvider router={router} />
  )
};
export default App;
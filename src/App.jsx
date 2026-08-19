import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./views/Home/HomePage";
import LoginPage from "./views/login/LoginPage";
import RootLayout from "./layouts/RootLayout";
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
    ],
  },
]);
const App = () => {
  return (
    <RouterProvider router={router} />
  )
};
export default App;
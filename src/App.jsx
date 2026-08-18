import { BrowserRouter } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from "react";
const App = () => {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};
export default App;
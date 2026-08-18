import { Outlet } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"

const RootLayout = () => {
    return(
        <AuthProvider>
            <main>
                <Outlet />
            </main>
        </AuthProvider>
    );
};
export default RootLayout;
import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const checkAuth = async () => {
        try{
            const data = await authService.getProfile();
            setUser(data);
        }
        catch(error){
            setUser(null);
        }
        setLoading(false);
    };
    useEffect(()=>{
        checkAuth();
    }, []);
    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(user);
    };
    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data);
    };
    const logout = async () => {
        const data = await authService.logout();
        setUser(null);
    };
    return(
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}
import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const checkAuth = async () => {
        try{
            const data = await authService.getProfile();
            setUser(data.user);
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
    await authService.login(credentials);
    const profile = await authService.getProfile();
    setUser(profile.user || profile);
  };
    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data);
    };
    const logout = async () => {
        const data = await authService.logout();
        setUser(null);
    };
    const updateProfile = async (userData) => {
        const data = await authService.updateProfile(userData);
        const updatedUser = data.user || data;
        setUser(updatedUser);
        return updatedUser;
    }
    return(
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            register,
            logout,
            checkAuth,
            updateProfile
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
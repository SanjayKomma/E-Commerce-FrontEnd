import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if(error){
            setError("");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try{
            await login(formData);
            navigate('/');
        }
        catch(error){
            setError(error.response?.data?.message || "login failed please check your credentials");
        }
        setSubmitting(false);
    };
    return (
        <div>
            <h1>Sign in to your account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    <label>Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="......."
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >{showPassword ? 'Hide' : 'Show'}</button>
                    <button
                        type="submit"
                        disabled={submitting}
                    >{submitting ? 'signing in...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default LoginPage;
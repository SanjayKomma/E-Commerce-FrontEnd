import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign in to your account</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 pb-2">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 pt-2">Password</label>
                                <div className="relative pb-2 pt-2">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="......."
                                        className = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-16"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 text-xs font-semibold text-gray-500 hover:text-gray-700 pr-2"
                                    >{showPassword ? 'Hide' : 'Show'}</button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
                                >{submitting ? 'signing in...' : 'Login'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
}
export default LoginPage;
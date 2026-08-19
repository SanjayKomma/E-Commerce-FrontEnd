import {Link} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
const RegisterPage = () => {
        const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const {register} = useAuth();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if(error){
            setError("");
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if(formData.password !== formData.confirmPassword){
            setError("passwords do not match");
            return;
        }
        if(formData.password.length < 6){
            setError("password must be at least 6 characters");
            return;
        }
        setSubmitting(true);
        try{
            await register({
                name : formData.name.trim(),
                phone : formData.phone.trim() || null,
                email : formData.email.trim(),
                password : formData.password.trim()
            });
            navigate('/');
        }
        catch(error){
            setError(error.response?.data?.message || "registration failed please try again");
        }
        finally{
            setSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6">   
                <div className="flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign up to get started</h2>
                </div>
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="pb-1 block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="name"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                    <label className="pb-1 block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                    <label className="pb-1 block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="@example.com"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                    <label className="pb-1 block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3.5 flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-600 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <label className="pb-1 block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {submitting ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <p>
                    Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}
export default RegisterPage;
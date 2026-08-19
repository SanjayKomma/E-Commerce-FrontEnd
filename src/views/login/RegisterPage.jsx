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
        <div>
            <h2>Sign up to get started</h2>
            <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="name"
                />
                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="@example.com"
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <button
                    type="submit"

                >
                    {submitting ? 'creating...' : 'Sign Up'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    )
}
export default RegisterPage;
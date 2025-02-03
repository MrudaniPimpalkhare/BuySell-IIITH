import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function CompleteRegistration() {
    const [formData, setFormData] = useState({
        firstname: '',
        surname: '',
        age: '',
        contact: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('/complete-registration', formData, { withCredentials: true });

            if (res.data.success) {
                // Fetch the updated user profile
                const userRes = await axios.get('/profile', { withCredentials: true });
                setUser(userRes.data);
                navigate(userRes.redirect || '/');
            } else {
                console.error(res.data.error);
                setError(res.data.error , 'Registration failed.');
            }
        } catch (err) {
            console.error('Error completing registration:', err);
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
                <h2 className="text-3xl font-bold text-green-600 text-center mb-6">Complete Your Registration</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact Number"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Set Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}
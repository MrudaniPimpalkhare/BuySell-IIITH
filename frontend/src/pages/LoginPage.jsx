import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();

        if (!email.endsWith('iiit.ac.in')) {
            alert('Please enter a valid IIIT email');
            return;
        }

        // if (!executeRecaptcha) {
        //     alert('reCAPTCHA not yet available');
        //     return;
        // }

        setIsLoading(true);

        try {
            // Execute reCAPTCHA with action 'login'
            // const recaptchaToken = await executeRecaptcha('login');

            const res = await axios.post('/login', {email, password}, { withCredentials: true });

            if (res.data === 'passok') {
                const userRes = await axios.get('/profile', { withCredentials: true });
                setUser(userRes.data);
                navigate('/search-items');
            }
            else {
                alert('Invalid Credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed');
        } finally {
            setIsLoading(false);
        }
    }

    function handleCasLogin() {
        console.log('Redirecting to CAS login');
        console.log('Origin:', window.location.origin);
        const backendUrl = 'http://localhost:4000';
        const serviceUrl = encodeURIComponent(`${backendUrl}/api/cas/callback`);
        console.log('Service URL:', serviceUrl);
        window.location.href = `https://login.iiit.ac.in/cas/login?service=${serviceUrl}&renew=true`;
        console.log('Redirected to CAS login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Login</h2>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        className="w-full p-3 border border-brightBlue rounded-2xl focus:outline-none focus:ring-2 focus:ring-brightBlue"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="w-full p-3 border border-brightBlue rounded-2xl focus:outline-none focus:ring-2 focus:ring-brightBlue"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full py-3 bg-blue-600 text-white rounded-2xl hover:bg-lightBlue transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <button
                    onClick={handleCasLogin}
                    className="w-full py-3 bg-blue-400 text-white rounded-2xl hover:bg-blue-300 transition-all duration-300 mt-4"
                >
                    Login with CAS
                </button>
                <div className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-brightBlue underline">
                        Register now
                    </Link>
                </div>
            </div> 
        </div>
    );
}
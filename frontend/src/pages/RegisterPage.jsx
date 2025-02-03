import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';


export default function RegisterPage() {

    const [firstname, setFName] = useState('')
    const [surname, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState('')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const { executeRecaptcha } = useGoogleReCaptcha();

    async function registerUser(ev) {
        ev.preventDefault()

        if (!email.endsWith('@iiit.ac.in')) {
            alert('Please enter a valid IIIT email')
            return
        }
        try {
            const recaptchaToken = await executeRecaptcha('register');
            const res = await axios.post('http://localhost:4000/register', {
                firstname,
                surname,
                email,
                age,
                contact,
                password,
                recaptchaToken
            })
            console.log(res)
            alert('Registration successful, You can login now')
            window.location.href = '/login'
        } catch (error) {
            console.error('Error registering user:', error)
            alert('Registration failed')
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-500 to-blue-300">
            {/* Left Section */}
            <div className="flex flex-col justify-center items-center text-white md:w-1/2 p-8">
                <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
                <p className="text-xl mb-8 text-center">
                    Register to get started with your journey to excellence.
                </p>
                <div className="text-center text-sm md:text-md text-white/70 max-w-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam
                    nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                </div>
            </div>

            {/* Right Section */}
            <div className="flex justify-center items-center md:w-1/2 bg-white rounded-l-3xl shadow-xl">
                <div className="w-full max-w-lg p-8">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Create an Account</h2>
                    <form onSubmit={registerUser} className="space-y-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={firstname}
                            onChange={ev => setFName(ev.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={surname}
                            onChange={ev => setLName(ev.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={ev => setEmail(ev.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={age}
                            onChange={ev => setAge(ev.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Contact Number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={contact}
                            onChange={ev => setContact(ev.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account?{' '}
                        <Link className="text-blue-600 hover:underline" to="/login">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

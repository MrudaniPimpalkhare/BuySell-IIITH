import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function RegisterPage() {

    const [firstname, setFName] = useState('')
    const [surname, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState('')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')

    async function registerUser(ev) {
        ev.preventDefault()

        if (!email.endsWith('@iiit.ac.in')) {
            alert('Please enter a valid IIIT email')
            return
        }
        try {
            const res = await axios.post('http://localhost:4000/register', {
                firstname,
                surname,
                email,
                age,
                contact,
                password
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
        <div className="flex items-center justify-center bg-blue-180 min-h-screen">
            {/* Card Container */}
            <div className="flex w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
                {/* Left Section */}
                <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-blue-600 to-blue-400 text-white p-8 w-1/2">
                    <h1 className="text-4xl font-bold mb-4">Welcome</h1>
                    <p className="text-lg mb-6 text-center">
                        Register to get started with your journey to excellence.
                    </p>
                    <p className="text-center text-sm text-white/80 max-w-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center justify-center bg-gray-100 w-full md:w-1/2 p-8">
                    <div className="w-full max-w-md">
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
        </div>
    )
}

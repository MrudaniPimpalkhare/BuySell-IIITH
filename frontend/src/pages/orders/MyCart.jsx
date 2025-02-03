import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export default function MyCartPage() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get('/cart', { withCredentials: true });
                setCartItems(res.data);
                setLoading(false);
            } catch (err) {
                setMessage(err.response?.data?.error || 'Failed to fetch cart items.');
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const updateQuantity = async (itemId, quantity) => {
        try {
            await axios.put(
                '/cart/update',
                { itemId, quantity },
                { withCredentials: true }
            );

            setMessage('Cart updated successfully.');
            const res = await axios.get('/cart', { withCredentials: true });
            setCartItems(res.data);
        } catch (err) {
            console.log(err);
            setMessage(err.response?.data?.message || 'Failed to update cart.');
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`/cart/remove/${itemId}`, { withCredentials: true });

            setMessage('Item removed from cart.');
            const res = await axios.get('/cart', { withCredentials: true });
            setCartItems(res.data);
        } catch (err) {
            setMessage('Failed to remove item. Please try again.');
        }
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) {
            setMessage('Your cart is empty.');
            return;
        }

        setOrdering(true);
        setMessage('');

        try {
            const res = await axios.post('/order', {}, { withCredentials: true });
            if (res.data.success) {
                setMessage(`Order placed successfully! Your OTP is ${res.data.otp}. Please keep it safe.`);
                setCartItems([]);
            } else {
                setMessage('Failed to place order. Please try again.');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to place order.');
        } finally {
            setOrdering(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-lg">Loading cart...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const totalPrice = cartItems.reduce((total, cartItem) => {
        return total + cartItem.item.price * cartItem.quantity;
    }, 0);

    return (
        <div className="grid grid-cols-3 gap-6 p-8">
            {/* Cart Items Section */}
            <div className="col-span-2 bg-gray-50 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold p-6 border-b border-gray-200">Shopping Cart</h1>
                {message && <div className="p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>}
                {cartItems.length === 0 ? (
                    <p className="p-6 text-gray-500">Your cart is empty.</p>
                ) : (
                    <div className="overflow-y-auto max-h-[60vh]">
                        <table className="w-full text-left">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Item</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Price</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Quantity</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Total</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((cartItem) => (
                                    <tr key={cartItem.item._id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-3">
                                            <Link
                                                to={`/items/${cartItem.item._id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {cartItem.item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                Seller: {cartItem.item.user_id.firstname} {cartItem.item.user_id.surname}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">₹{cartItem.item.price.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={cartItem.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(cartItem.item._id, parseInt(e.target.value))
                                                }
                                                className="w-16 p-2 border rounded-lg text-center"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => removeItem(cartItem.item._id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Items:</span>
                    <span className="text-gray-800">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                </div>
                <div className="flex justify-between items-center font-bold text-lg mb-6">
                    <span>Total Price:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <button
                    onClick={placeOrder}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg transition"
                    disabled={ordering}
                >
                    {ordering ? 'Placing Order...' : 'Checkout'}
                </button>
            </div>
        </div>
    );
}

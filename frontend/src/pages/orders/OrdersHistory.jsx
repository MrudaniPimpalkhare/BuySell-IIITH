import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { set } from 'mongoose';

export default function OrdersHistory() {
    const { user } = useContext(UserContext); // Access current user
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [soldOrders, setSoldOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [regeneratingOtp, setRegeneratingOtp] = useState({});

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const [pendingRes, completedRes, soldRes] = await Promise.all([
                    axios.get('/orders/pending', { withCredentials: true }),
                    axios.get('/orders/completed', { withCredentials: true }),
                    axios.get('/orders/sold', { withCredentials: true })
                ]);
                setPendingOrders(pendingRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setCompletedOrders(completedRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setSoldOrders(soldRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders.');
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);
    

    const regenerateOtp = async (orderId) => {
        const confirmRegenerate = window.confirm('Are you sure you want to regenerate the OTP for this order?');
        if (!confirmRegenerate) return;

        setRegeneratingOtp((prev) => ({ ...prev, [orderId]: true }));
        setMessage('');

        try {
            const res = await axios.post(`/order/regenerate-otp/${orderId}`, {}, { withCredentials: true });
            if (res.data.success) {
                setMessage(`OTP regenerated successfully for Order ID: ${orderId}., your new OTP is ${res.data.otp}`);
                // Fetch pending orders again to update the OTP status
                const pendingRes = await axios.get('/orders/pending', { withCredentials: true });
                setPendingOrders(pendingRes.data);
            } else {
                if(res.data.error){
                    setMessage(res.data.error);
                }else if(res.data.message){
                    setMessage(res.data.message);
                }
                else{
                    setMessage(`Failed to regenerate OTP for Order.`);
                }

            }
        } catch (err) {
            console.error('Error regenerating OTP:', err);
            setMessage(err.response?.data?.error || `Failed to regenerate OTP for Order ID: ${orderId}.`);
        } finally {
            setRegeneratingOtp((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Orders History</h1>
            <div className="mb-7">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`mr-4 pb-2 focus:outline-none ${
                            activeTab === 'pending'
                                ? 'border-b-2 border-blue-300 text-blue-500'
                                : 'text-gray-600 hover:text-blue-500'
                        }`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Orders
                    </button>
                    <button
                        className={`mr-4 pb-2 focus:outline-none ${
                            activeTab === 'bought'
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-600 hover:text-blue-500'
                        }`}
                        onClick={() => setActiveTab('bought')}
                    >
                        Items Bought
                    </button>
                    <button
                        className={`mr-4 pb-2 focus:outline-none ${
                            activeTab === 'sold'
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-600 hover:text-blue-500'
                        }`}
                        onClick={() => setActiveTab('sold')}
                    >
                        Items Sold
                    </button>
                </div>
            </div>

            {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

            {/* Tab Content */}
            {activeTab === 'pending' && (
                <div>
                    {pendingOrders.length === 0 ? (
                        <p className="text-lg text-gray-600">You have no pending orders.</p>
                    ) : (
                        <div className="space-y-6 py-4">
                            {pendingOrders.map((order, index) => (
                                <div
                                    key={order._id}
                                    className={`border rounded-lg p-6 shadow-md ${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                >
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-semibold text-blue-600">Order ID: {order._id}</h2>
                                        <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-lg">
                                            <span className="font-semibold">Total Price:</span>{' '}
                                            <span className="text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                                        </p>
                                        <p className="text-lg">
                                            <span className="font-semibold">Status:</span>{' '}
                                            <span className="text-red-500 font-semibold">Pending</span>
                                        </p>
                                    </div>
                                    <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-md">
                                        <thead>
                                            <tr className="bg-blue-100 text-blue-800">
                                                <th className="px-4 py-2 text-left">Item</th>
                                                <th className="px-4 py-2 text-left">Price</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Subtotal</th>
                                                <th className="px-4 py-2 text-left">Seller</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((orderItem) => (
                                                <tr
                                                    key={orderItem.item._id}
                                                    className="even:bg-gray-50 odd:bg-white border-b"
                                                >
                                                    <td className="px-4 py-2">
                                                        <Link
                                                            to={`/items/${orderItem.item._id}`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            {orderItem.item.name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-2">₹{orderItem.item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-2">{orderItem.quantity}</td>
                                                    <td className="px-4 py-2">₹{(orderItem.item.price * orderItem.quantity).toFixed(2)}</td>
                                                    <td className="px-4 py-2">
                                                        {orderItem.seller.firstname} {orderItem.seller.surname}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {!order.isCompleted && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => regenerateOtp(order._id)}
                                                className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
                                                    regeneratingOtp[order._id] ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                disabled={regeneratingOtp[order._id]}
                                            >
                                                {regeneratingOtp[order._id] ? 'Regenerating OTP...' : 'Regenerate OTP'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'bought' && (
                <div>
                    {completedOrders.length === 0 ? (
                        <p className="text-lg text-gray-600">You have no completed orders.</p>
                    ) : (
                        <div className="space-y-6">
                            {completedOrders.map((order, index) => (
                                <div
                                    key={order._id}
                                    className={`border rounded-lg p-6 shadow-md ${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                >
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-semibold text-blue-600">Order ID: {order._id}</h2>
                                        <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-lg">
                                            <span className="font-semibold">Total Price:</span>{' '}
                                            <span className="text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                                        </p>
                                        <p className="text-lg">
                                            <span className="font-semibold">Status:</span>{' '}
                                            <span className="text-green-500 font-semibold">Completed</span>
                                        </p>
                                    </div>
                                    <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-md">
                                        <thead>
                                            <tr className="bg-blue-100 text-blue-800">
                                                <th className="px-4 py-2 text-left">Item</th>
                                                <th className="px-4 py-2 text-left">Price</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Subtotal</th>
                                                <th className="px-4 py-2 text-left">Seller</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((orderItem) => (
                                                <tr
                                                    key={orderItem.item._id}
                                                    className="even:bg-gray-50 odd:bg-white border-b"
                                                >
                                                    <td className="px-4 py-2">
                                                        <Link
                                                            to={`/items/${orderItem.item._id}`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            {orderItem.item.name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-2">₹{orderItem.item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-2">{orderItem.quantity}</td>
                                                    <td className="px-4 py-2">₹{(orderItem.item.price * orderItem.quantity).toFixed(2)}</td>
                                                    <td className="px-4 py-2">
                                                        {orderItem.seller.firstname} {orderItem.seller.surname}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'sold' && (
                <div>
                    {soldOrders.length === 0 ? (
                        <p className="text-lg text-gray-600">You have not sold any items yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {soldOrders.map((order, index) => (
                                <div
                                    key={order._id}
                                    className={`border rounded-lg p-6 shadow-md ${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                >
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-semibold text-blue-600">Order ID: {order._id}</h2>
                                        <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">Buyer: {order.buyer.firstname} {order.buyer.surname}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-lg">
                                            <span className="font-semibold">Total Price:</span>{' '}
                                            <span className="text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                                        </p>
                                        <p className="text-lg">
                                            <span className="font-semibold">Status:</span>{' '}
                                            <span
                                                className={`${
                                                    order.isCompleted ? 'text-green-500' : 'text-red-500'
                                                } font-semibold`}
                                            >
                                                {order.isCompleted ? 'Completed' : 'Pending'}
                                            </span>
                                        </p>
                                    </div>
                                    <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-md">
                                        <thead>
                                            <tr className="bg-blue-100 text-blue-800">
                                                <th className="px-4 py-2 text-left">Item</th>
                                                <th className="px-4 py-2 text-left">Price</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items
                                                .filter((orderItem) => orderItem.seller._id.toString() === user._id)
                                                .map((orderItem) => (
                                                    <tr
                                                        key={orderItem.item._id}
                                                        className="even:bg-gray-50 odd:bg-white border-b"
                                                    >
                                                        <td className="px-4 py-2">
                                                            <Link
                                                                to={`/items/${orderItem.item._id}`}
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                {orderItem.item.name}
                                                            </Link>
                                                        </td>
                                                        <td className="px-4 py-2">₹{orderItem.item.price.toFixed(2)}</td>
                                                        <td className="px-4 py-2">{orderItem.quantity}</td>
                                                        <td className="px-4 py-2">₹{(orderItem.item.price * orderItem.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
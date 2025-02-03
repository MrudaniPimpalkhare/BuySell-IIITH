import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext'; // Adjust the path as needed

export default function DeliverItems() {
    const { user } = useContext(UserContext); // Access current user
    const [deliverOrders, setDeliverOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otpInput, setOtpInput] = useState({});
    const [message, setMessage] = useState('');

    console.log("user",user); // Log the current user object

    useEffect(() => {
        const fetchDeliverItems = async () => {
            try {
                const res = await axios.get('/deliver-items', { withCredentials: true });
                setDeliverOrders(res.data);
                console.log("deliver",res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch deliver items.');
                setLoading(false);
            }
        };

        fetchDeliverItems();
    }, []);

    const handleOtpChange = (orderId, value) => {
        setOtpInput(prev => ({
            ...prev,
            [orderId]: value
        }));
    };

    const completeOrder = async (orderId) => {
        const otp = otpInput[orderId];
        if (!otp) {
            setMessage('Please enter the OTP.');
            return;
        }

        try {
            const res = await axios.post(`/order/complete/${orderId}`, { otp }, { withCredentials: true });
            if (res.data.success) {
                setMessage(`Order ${orderId} completed successfully.`);
                // Refresh deliver items
                const updatedRes = await axios.get('/deliver-items', { withCredentials: true });
                setDeliverOrders(updatedRes.data);
            } else {
                setMessage(`Failed to complete order ${orderId}.`);
            }
        } catch (err) {
            console.error('Error completing order:', err);
            setMessage(err.response?.data?.error || `Failed to complete order ${orderId}.`);
        }
    };

    if (loading) return <div className="p-4">Loading deliver items...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Deliver Items</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            {deliverOrders.length === 0 ? (
                <p>No items to deliver.</p>
            ) : (
                <div className="space-y-4">
                    {deliverOrders.map(order => (
                        <div key={order._id} className="border p-4 rounded">
                            <h2 className="text-2xl font-semibold mb-2">Order ID: {order._id}</h2>
                            <p className="mb-2">Buyer: {order.buyer.firstname} {order.buyer.surname}</p>
                            <p className="mb-2">Total Price: ₹{order.totalPrice.toFixed(2)}</p>
                            <p className="mb-2">Status: {order.isCompleted ? 'Completed' : 'Pending'}</p>
                            <table className="w-full table-auto mt-2">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Item</th>
                                        <th className="px-4 py-2">Price</th>
                                        <th className="px-4 py-2">Quantity</th>
                                        <th className="px-4 py-2">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items
                                        .filter(item => item.seller.toString() === user._id.toString())
                                        .map(orderItem => (
                                            <tr key={orderItem.item._id} className="border-b">
                                                <td className="px-4 py-2">
                                                    <Link to={`/items/${orderItem.item._id}`} className="text-blue-500 hover:underline">
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

                            {!order.isCompleted && (
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP to Complete Order"
                                        value={otpInput[order._id] || ''}
                                        onChange={(e) => handleOtpChange(order._id, e.target.value)}
                                        className="p-2 border rounded mr-2"
                                    />
                                    <button
                                        onClick={() => completeOrder(order._id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Complete Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
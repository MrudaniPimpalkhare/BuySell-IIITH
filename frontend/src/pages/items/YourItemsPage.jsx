import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing Font Awesome Icons
import { UserContext } from '../../UserContext';

export default function YourItemsPage() {
    const { user } = useContext(UserContext);
    console.log(user);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserItems = async () => {
            try {
                const response = await axios.get('/my-items');
                setItems(response.data);
            } catch (err) {
                console.error('Error fetching user items:', err);
                navigate('/login');
                setError('Failed to fetch your items');
            } finally {
                setLoading(false);
            }
        };

        fetchUserItems();
    }, [navigate]);

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`/items/${itemId}`);
                setItems(prevItems => prevItems.filter(item => item._id !== itemId));
            } catch (err) {
                console.error('Error deleting item:', err);
                alert('Failed to delete item');
            }
        }
    };

    const handleEdit = (itemId) => {
        navigate(`/edit-item/${itemId}`);
    };

    if (loading) return <div className="p-4">Loading your items...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4 relative bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Items</h1>
            
            {/* Add Item Button */}
            <button
                onClick={() => navigate('/add-item')}
                className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                title="Add Item"
            >
                + Add Item
            </button>

            {/* Items Table */}
            {items.length === 0 ? (
                <div className="text-gray-600">No items added yet.</div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white border-collapse border border-gray-300">
                        <thead className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-white sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-4 border-b border-gray-300">Name</th>
                                <th className="py-3 px-4 border-b border-gray-300">Price</th>
                                <th className="py-3 px-4 border-b border-gray-300">Quantity</th>
                                <th className="py-3 px-4 border-b border-gray-300">Added By</th>
                                <th className="py-3 px-4 border-b border-gray-300">Actions</th> {/* New Column */}
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {items.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
                                >
                                    <td className="py-3 px-4 border-b border-gray-300 ">
                                        {item.name}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-300 ">
                                        ₹{item.price.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-300 ">
                                        {item.quantity}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-300 ">
                                        {item.user_id.firstname} {item.user_id.surname}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-300 text-center">
                                        {/* Edit Icon */}
                                        <button
                                            onClick={() => handleEdit(item._id)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                            title="Edit Item"
                                        >
                                            <FaEdit />
                                        </button>
                                        {/* Delete Icon */}
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete Item"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
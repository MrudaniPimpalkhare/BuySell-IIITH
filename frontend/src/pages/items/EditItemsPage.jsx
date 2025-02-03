import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditItemsPage() {
    const { id } = useParams(); // Get item ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: 'Electronics' // Default category
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const categories = ['Electronics', 'Clothing', 'Furniture', 'Books','Food' ,'Other']; // Define allowed categories

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`/items/${id}`, { withCredentials: true });
                setFormData({
                    name: response.data.name,
                    price: response.data.price,
                    quantity: response.data.quantity,
                    category: response.data.category
                });
            } catch (err) {
                console.error('Error fetching item:', err);
                setError('Failed to load item details');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const { name, price, quantity, category } = formData;

        // Basic validation
        if (!name || !price || !quantity || !category) {
            setError('All fields are required.');
            return;
        }

        if (isNaN(price) || isNaN(quantity)) {
            setError('Price and Quantity must be numbers.');
            return;
        }

        try {
            await axios.put(`/items/${id}`, {
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                category
            }, { withCredentials: true });

            setSuccessMessage('Item updated successfully!');
            // Redirect back to Your Items Page after a short delay
            setTimeout(() => navigate('/my-items'), 2000);
        } catch (err) {
            console.error('Error updating item:', err);
            setError('Failed to update item.');
        }
    };

    if (loading) return <div className="p-4">Loading item details...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
                {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <form onSubmit={handleUpdateItem} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Item Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                        step="0.01"
                        min="0"
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                        min="0"
                    />
                    {/* Category Dropdown */}
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {/* allow to edit password */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Update Item
                    </button>
                </form>
            </div>
        </div>
    );
}
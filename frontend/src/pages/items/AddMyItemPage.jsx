import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddMyItemPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: 'Electronics' // Default category
    });
    const [formError, setFormError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const categories = ['Electronics', 'Clothing', 'Furniture', 'Books', 'Food','Other']; // Define allowed categories

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);

        const { name, price, quantity, category } = formData;

        // Basic validation
        if (!name || !price || !quantity || !category) {
            setFormError('All fields are required.');
            return;
        }

        if (isNaN(price) || isNaN(quantity)) {
            setFormError('Price and Quantity must be numbers.');
            return;
        }

        try {
            await axios.post('/items', {
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                category
            }, { withCredentials: true });
            
            setSuccessMessage('Item added successfully!');
            // Redirect back to Your Items Page after a short delay
            setTimeout(() => navigate('/my-items'), 2000);
        } catch (err) {
            console.error('Error adding item:', err);
            setFormError('Failed to add item.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-blue-200">
            {/* Card Container */}
            <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-3xl font-semibold text-blue-900 text-center mb-8">Add New Item</h1>
                {formError && <div className="text-red-500 text-center mb-4">{formError}</div>}
                {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
                
                <form onSubmit={handleAddItem} className="space-y-6">
                    {/* Input Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Item Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            min="0"
                        />
                    </div>
                    {/* Category Dropdown */}
                    <div>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
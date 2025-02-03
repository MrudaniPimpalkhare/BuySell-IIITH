import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export default function ItemsPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [ratingMessage, setRatingMessage] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`/items/${id}`, { withCredentials: true });
                setItem(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch item details.');
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const addToCart = async () => {
        try {
            await axios.post('http://localhost:4000/cart/add', {
                itemId: item._id,
                quantity: 1
            }, { withCredentials: true });

            setCartMessage('Item added to cart successfully!');
        } catch (err) {
            setCartMessage('Failed to add item to cart. Please try again.');
        }
    };

    const rateItem = async () => {
        try {
            await axios.post(`/items/${id}/rate`, {
                rating
            }, { withCredentials: true });

            setRatingMessage('Item rated successfully!');
        } catch (err) {
            setRatingMessage('Failed to rate item. Please try again.');
        }
    };

    if (loading) return <div className="p-10 text-center text-base">Loading item details...</div>;
    if (error) return <div className="p-10 text-center text-red-500 text-base">{error}</div>;
    if (!item) return <div className="p-10 text-center text-base">Item not found.</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#E9F1FA]">
            <div className="w-1/2 p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-semibold text-[#0077B6] mb-5">{item.name}</h1>
                
                <div className="bg-[#F8FAFC] p-5 rounded-lg mb-5 shadow-sm text-base text-gray-700">
                    <p><span className="font-medium">Price:</span> ₹{item.price.toFixed(2)}</p>
                    <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    <p><span className="font-medium">Category:</span> {item.category}</p>
                    <p>
                        <span className="font-medium">Added By:</span> {item.user_id.firstname} {item.user_id.surname}
                    </p>
                </div>

                <button
                    onClick={addToCart}
                    className="w-full py-3 bg-[#00ABE4] text-white text-base font-medium rounded-lg hover:bg-[#48CAE4] transition"
                >
                    Add to Cart
                </button>

                {cartMessage && <p className="mt-2 text-center text-green-600 text-sm">{cartMessage}</p>}

                {/* Star Rating System */}
                <div className="mt-6 p-5 bg-[#F8FAFC] rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Rate this item</h2>
                    
                    <div className="flex space-x-2 justify-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`w-6 h-6 cursor-pointer transition ${
                                    (hover || rating) >= star ? 'text-[#FFC107]' : 'text-gray-400'
                                }`}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    <button
                        onClick={rateItem}
                        className="w-full py-3 bg-[#0077B6] text-white text-base font-medium rounded-lg hover:bg-[#005F99] transition"
                    >
                        Submit Rating
                    </button>

                    {ratingMessage && <p className="mt-2 text-center text-green-600 text-sm">{ratingMessage}</p>}
                </div>
            </div>
        </div>
    );
}

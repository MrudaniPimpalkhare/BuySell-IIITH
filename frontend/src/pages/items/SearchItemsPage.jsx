import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SearchItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/items", { withCredentials: true });
        setItems(response.data);
        setFilteredItems(response.data);

        const uniqueCategories = [
          ...new Set(response.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        const uniqueOwners = [
          ...new Set(
            response.data.map(
              (item) => `${item.user_id.firstname} ${item.user_id.surname}`
            )
          ),
        ];
        setOwners(uniqueOwners);
      } catch (err) {
        setError("Failed to fetch items");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filterItems = () => {
    let results = items;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      results = results.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    if (selectedOwner !== "") {
      results = results.filter(
        (item) =>
          `${item.user_id.firstname} ${item.user_id.surname}` === selectedOwner
      );
    }

    if (priceRange.min || priceRange.max !== Infinity) {
      results = results.filter(
        (item) => item.price >= priceRange.min && item.price <= priceRange.max
      );
    }

    if (sortOrder === "asc") {
      results = results.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      results = results.sort((a, b) => b.price - a.price);
    }

    setFilteredItems(results);
  };

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategories, selectedOwner, sortOrder, priceRange]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : Infinity,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex p-6 bg-gradient-to-b from-[#CAF0F8] to-[#EAF6F8] min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-1/4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="form-checkbox text-[#0077B6]"
                  />
                  <span>{category}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Owner</h3>
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Owners</option>
            {owners.map((owner, index) => (
              <option key={index} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={priceRange.min === Infinity ? "" : priceRange.min}
              onChange={handlePriceChange}
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={priceRange.max === Infinity ? "" : priceRange.max}
              onChange={handlePriceChange}
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Sort by Price</h3>
          <button
            onClick={toggleSortOrder}
            className="w-full py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#48CAE4] transition"
          >
            {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
          </button>
        </div>

        <br></br>

        <div className="mb-4 relative">
          {/* Heroicons Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077B6]"
          />
        </div>


      </aside>


      {/* Items Grid */}
      <main className="w-3/4 pl-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-[#0077B6]">
                {item.name}
              </h3>
              <p className="text-gray-600">₹{item.price}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-sm text-gray-500">
                {item.user_id.firstname} {item.user_id.surname}
              </p>
              <Link
                to={`/items/${item._id}`}
                className="text-[#0077B6] hover:underline mt-2 block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

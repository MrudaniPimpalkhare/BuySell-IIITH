import React, { useState, useContext, useEffect, createContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import { use } from 'react';
import Logo from './components/Logo';


function SearchLink() {
  return (
    <Link
      to="/search-items"
      className="text-black hover:font-bold hover:text-blue-600 transition"
    >
      Search Items
    </Link>);
};


function MyItemsLink() {
  return (
    <Link
      to="/my-items"
      className="text-black hover:font-bold hover:text-blue-600 transition"
    >
      My Items
    </Link>)
};

function DeliverItemsLink() {
  return (
    <Link
      to="/deliveritems"
      className="text-black hover:font-bold hover:text-blue-600 transition"
    >
      Deliver Items
    </Link>)
}

function OrderHistoryLink() {
  return (
    <Link
      to="/orderhistory"
      className="text-black hover:font-bold hover:text-blue-600 transition"
    >
      Order History
    </Link>)
}

function Cart() {
  return (
    <Link
      to="/cart"
      className="text-black hover:font-bold hover:text-blue-600 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    </Link>
  )
}

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Logout Function
  async function logout() {
    try {
      console.log('logging out');
      await axios.post('/logout');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Error logging out');
    }
  }

  // need to show user's name if it exsits as soon as the page loads
  
  return (
    <header className="bg-blue-100 text-white py-3 px-6 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Logo />
        {/* Navigation Section */}
        <div className="flex items-center gap-6">
          {user && (
            <>
              {/* Navbar Links */}
              <SearchLink />
              <MyItemsLink />

              <DeliverItemsLink />
              <OrderHistoryLink />
              {/* Cart Icon */}
              <Cart/>


              {/* Profile Section */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 bg-white text-black hover:bg-gray-100 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      to="/"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Home
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <Link
            to={user ? '/profile' : '/login'}
            className="bg-gray-800 text-white rounded-full border border-gray-500 p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          {!!user && <div className="font-medium text-black">{user.firstname}</div>}

        </div>
      </div>
    </header>
  );
}

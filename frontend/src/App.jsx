import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import IndexPage from './pages/IndexPage'
import axios from 'axios'
import './App.css';     
import { UserContextProvider } from './UserContext'
import { useEffect } from 'react'
import ProtectedRoute from './pages/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
// import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import SearchItemsPage from './pages/items/SearchItemsPage'
import YourItemsPage from './pages/items/YourItemsPage'
import AddMyItemPage from './pages/items/AddMyItemPage'
// import ProtectedRoute from './pages/ProtectedRoute'
import EditItemsPage from './pages/items/EditItemsPage'
import DeliverItems from './pages/orders/DeliverItems'
import OrdersHistory from './pages/orders/OrdersHistory'
import ItemsPage from './pages/items/ItemsPage'
import MyCartPage from './pages/orders/MyCart'
import CompleteRegistration from './pages/CompleteRegistration'
import ChatPage from './pages/chatbot/ChatPage'

axios.defaults.baseURL = 'http://localhost:4000'
// allow axios to send cookies to the server
axios.defaults.withCredentials = true

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editprofile"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/complete-registration" 
              element={
              <ProtectedRoute>
              <CompleteRegistration />
            </ProtectedRoute>} />
            <Route
              path="/items/:id"
              element={
                <ProtectedRoute>
                  <ItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-item/:id"
              element={
                <ProtectedRoute>
                  <EditItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <MyCartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deliveritems"
              element={
                <ProtectedRoute>
                  <DeliverItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrdersHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-items"
              element={
                <ProtectedRoute>
                  <SearchItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-items"
              element={
                <ProtectedRoute>
                  <YourItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-item"
              element={
                <ProtectedRoute>
                  <AddMyItemPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  )
}

export default App

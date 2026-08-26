import React, { useContext, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Nav from './component/Nav'
import { userDataContext } from './context/UserContext'
import About from './pages/About'
import Collections from './pages/Collections'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound'
import Ai from './component/Ai'
import LoginModal from './component/LoginModal'

function AdminRedirect() {
  React.useEffect(() => {
    const adminUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://shopx-admin.vercel.app')
    window.location.href = adminUrl
  }, [])
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3'>
      <div className='w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
      <p className='text-sm text-gray-500 font-medium'>Redirecting to Admin Panel...</p>
    </div>
  )
}

function ProtectedRoute({ children, userData, loading, onLoginClick }) {
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center pt-[70px] bg-white'>
        <div className='w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }
  if (!userData) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  let { userData, loading } = useContext(userDataContext)
  let [showLoginModal, setShowLoginModal] = useState(false)
  let [modalMode, setModalMode] = useState("login") // "login" | "signup"

  const openModal = (mode = "login") => {
    setModalMode(mode)
    setShowLoginModal(true)
  }

  return (
    <>
      <ToastContainer />
      <Nav onLoginClick={() => openModal("login")} />
      {showLoginModal && <LoginModal defaultMode={modalMode} onClose={() => setShowLoginModal(false)} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Navigate to="/" replace />} />
        <Route path='/login' element={<Navigate to="/" replace />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collections />} />
        <Route path='/collections' element={<Collections />} />
        <Route path='/product' element={<Product />} />
        <Route path='/products' element={<Product />} />
        <Route path='/productdetail/:productId' element={<ProductDetail />} />
        <Route path='/product/:productId' element={<ProductDetail />} />
        
        {/* Protected routes that persist on page refresh */}
        <Route path='/cart' element={
          <ProtectedRoute userData={userData} loading={loading} onLoginClick={() => openModal("login")}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path='/placeorder' element={
          <ProtectedRoute userData={userData} loading={loading} onLoginClick={() => openModal("login")}>
            <PlaceOrder />
          </ProtectedRoute>
        } />
        <Route path='/place-order' element={
          <ProtectedRoute userData={userData} loading={loading} onLoginClick={() => openModal("login")}>
            <PlaceOrder />
          </ProtectedRoute>
        } />
        <Route path='/order' element={
          <ProtectedRoute userData={userData} loading={loading} onLoginClick={() => openModal("login")}>
            <Order />
          </ProtectedRoute>
        } />
        <Route path='/orders' element={
          <ProtectedRoute userData={userData} loading={loading} onLoginClick={() => openModal("login")}>
            <Order />
          </ProtectedRoute>
        } />

        {/* Admin Portal Redirect */}
        <Route path='/admin' element={<AdminRedirect />} />
        <Route path='/admin/*' element={<AdminRedirect />} />

        {/* 404 Fallback */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Ai />
    </>
  )
}

export default App

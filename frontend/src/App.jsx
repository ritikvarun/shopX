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

function App() {
  let { userData } = useContext(userDataContext)
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
        <Route path='/signup' element={<Navigate to="/" replace />} />
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collections />} />
        <Route path='/product' element={<Product />} />
        <Route path='/productdetail/:productId' element={<ProductDetail />} />
        <Route path='/cart' element={userData ? <Cart /> : <Home />} />
        <Route path='/placeorder' element={userData ? <PlaceOrder /> : <Home />} />
        <Route path='/order' element={userData ? <Order /> : <Home />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Ai />
    </>
  )
}

export default App

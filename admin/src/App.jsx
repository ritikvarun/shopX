import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Returns from './pages/Returns'
import Banners from './pages/Banners'
import Login from './pages/Login'
import { adminDataContext } from './context/AdminContext'
  import { ToastContainer, toast } from 'react-toastify';

function App() {
  let { adminData, loading } = useContext(adminDataContext)
  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className='w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-gray-50 gap-[12px]'>
          <div className='w-[36px] h-[36px] border-4 border-black border-t-transparent rounded-full animate-spin'></div>
          <span className='text-[13px] font-semibold text-gray-500'>Loading Admin Panel...</span>
        </div>
      ) : !adminData ? (
        <Login />
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add' element={<Add />} />
          <Route path='/lists' element={<Lists />} />
          <Route path='/list' element={<Lists />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/order' element={<Orders />} />
          <Route path='/returns' element={<Returns />} />
          <Route path='/return' element={<Returns />} />
          <Route path='/banners' element={<Banners />} />
          <Route path='/banner' element={<Banners />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Home />} />
        </Routes>
      )}
    </>
  )
}

export default App

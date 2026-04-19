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
  let {adminData} = useContext(adminDataContext)
  return (

    <>
      <ToastContainer />
    {!adminData ? <Login/> : <>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/lists' element={<Lists/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/returns' element={<Returns/>}/>
        <Route path='/banners' element={<Banners/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      </>
      }
    </>
  )
}

export default App

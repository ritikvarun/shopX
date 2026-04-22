import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState, useContext, useEffect } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'

function Home() {
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const { serverUrl } = useContext(authDataContext)

    const fetchCounts = async () => {
        try {
            const products = await axios.get(`${serverUrl}/api/product/list`, {}, { withCredentials: true })
            setTotalProducts(products.data.length)
            const orders = await axios.post(`${serverUrl}/api/order/list`, {}, { withCredentials: true })
            setTotalOrders(orders.data.length)
        } catch (err) {
            console.error("Failed to fetch counts", err)
        }
    }

    useEffect(() => {
        fetchCounts()
    }, [])

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gray-50'>
            <Nav />
            <Sidebar />

            <div className='md:ml-[220px] pt-[64px] pb-[100px] md:pb-[32px] p-[16px] md:p-[32px]'>
                {/* Page header */}
                <div className='mb-[32px]'>
                    <h1 className='text-[26px] font-bold text-gray-900'>Dashboard</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>Welcome back, Admin 👋</p>
                </div>

                {/* Stat cards */}
                <div className='flex flex-wrap gap-[20px]'>
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[28px] flex items-center gap-[20px] min-w-[240px]'>
                        <div className='w-[52px] h-[52px] bg-gray-100 rounded-xl flex items-center justify-center'>
                            <FiShoppingBag className='w-[24px] h-[24px] text-gray-700' />
                        </div>
                        <div>
                            <p className='text-[13px] text-gray-400 font-medium'>Total Products</p>
                            <p className='text-[34px] font-bold text-gray-900 leading-tight'>{totalProducts}</p>
                        </div>
                    </div>

                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[28px] flex items-center gap-[20px] min-w-[240px]'>
                        <div className='w-[52px] h-[52px] bg-gray-100 rounded-xl flex items-center justify-center'>
                            <FiPackage className='w-[24px] h-[24px] text-gray-700' />
                        </div>
                        <div>
                            <p className='text-[13px] text-gray-400 font-medium'>Total Orders</p>
                            <p className='text-[34px] font-bold text-gray-900 leading-tight'>{totalOrders}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

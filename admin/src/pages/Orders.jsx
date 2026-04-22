import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiPackage } from 'react-icons/fi'

function Orders() {
    let [orders, setOrders] = useState([])
    let { serverUrl } = useContext(authDataContext)

    const fetchAllOrders = async () => {
        try {
            const result = await axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true })
            setOrders(result.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    const statusHandler = async (e, orderId) => {
        try {
            const result = await axios.post(serverUrl + '/api/order/status', { orderId, status: e.target.value }, { withCredentials: true })
            if (result.data) await fetchAllOrders()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { fetchAllOrders() }, [])

    const statusColors = {
        'Order Placed': 'bg-blue-50 text-blue-600 border-blue-100',
        'Packing': 'bg-yellow-50 text-yellow-600 border-yellow-100',
        'Shipped': 'bg-purple-50 text-purple-600 border-purple-100',
        'Out for delivery': 'bg-orange-50 text-orange-600 border-orange-100',
        'Delivered': 'bg-green-50 text-green-600 border-green-100',
    }

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gray-50'>
            <Nav />
            <Sidebar />

            <div className='md:ml-[220px] pt-[64px] pb-[100px] md:pb-[32px] p-[16px] md:p-[32px]'>
                <div className='mb-[28px]'>
                    <h1 className='text-[26px] font-bold text-gray-900'>All Orders</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>{orders.length} orders total</p>
                </div>

                {orders.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-200 p-[40px] text-center text-gray-400 text-[15px]'>
                        No orders yet.
                    </div>
                ) : (
                    <div className='flex flex-col gap-[14px]'>
                        {orders.map((order, index) => (
                            <div key={index} className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[20px] grid grid-cols-1 lg:grid-cols-[44px_1fr_200px_130px_160px] gap-[16px] items-start lg:items-center'>

                                {/* Icon */}
                                <div className='w-[44px] h-[44px] bg-gray-100 rounded-xl flex items-center justify-center'>
                                    <FiPackage className='w-[20px] h-[20px] text-gray-600' />
                                </div>

                                {/* Items */}
                                <div>
                                    <div className='flex flex-col gap-[2px] mb-[8px]'>
                                        {order.items.map((item, i) => (
                                            <p key={i} className='text-[13px] font-medium text-gray-800'>
                                                {item.name} <span className='text-gray-400'>×{item.quantity}</span>
                                                <span className='ml-[6px] text-[11px] bg-gray-100 px-[6px] py-[2px] rounded-full text-gray-500'>{item.size}</span>
                                            </p>
                                        ))}
                                    </div>
                                    <p className='text-[12px] text-gray-400'>
                                        {order.address.firstName} {order.address.lastName} · {order.address.city}, {order.address.state}
                                    </p>
                                    <p className='text-[12px] text-gray-400'>{order.address.phone}</p>
                                </div>

                                {/* Order info */}
                                <div className='flex flex-col gap-[4px]'>
                                    <p className='text-[13px] text-gray-500'><span className='font-medium text-gray-700'>Items:</span> {order.items.length}</p>
                                    <p className='text-[13px] text-gray-500'><span className='font-medium text-gray-700'>Method:</span> {order.paymentMethod}</p>
                                    <p className='text-[13px] text-gray-500'>
                                        <span className='font-medium text-gray-700'>Payment:</span>{' '}
                                        <span className={order.payment ? 'text-green-600' : 'text-red-500'}>
                                            {order.payment ? '✓ Done' : '⏳ Pending'}
                                        </span>
                                    </p>
                                    <p className='text-[13px] text-gray-400'>{new Date(order.date).toLocaleDateString()}</p>
                                </div>

                                {/* Amount */}
                                <p className='text-[18px] font-bold text-gray-900'>₹{order.amount}</p>

                                {/* Status & Actions */}
                                <div className='flex flex-col gap-[8px]'>
                                    <select
                                        value={order.status}
                                        onChange={(e) => statusHandler(e, order._id)}
                                        className={`h-[38px] px-[12px] rounded-xl text-[13px] font-semibold border outline-none cursor-pointer transition-all
                                            ${statusColors[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
                                    >
                                        <option value="Order Placed">Order Placed</option>
                                        <option value="Packing">Packing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                    <button 
                                        onClick={() => window.open(serverUrl + "/api/order/invoice/" + order._id, "_blank")}
                                        className='h-[34px] bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-bold rounded-xl transition-all'
                                    >
                                        ⬇ Download Bill
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders

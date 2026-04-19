import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import axios from 'axios'
import { FiPackage } from 'react-icons/fi'
import { TbArrowBackUp } from 'react-icons/tb'
import { toast } from 'react-toastify'
import Footer from '../component/Footer'

const statusColors = {
    'Order Placed':   'bg-blue-50 text-blue-600',
    'Packing':        'bg-yellow-50 text-yellow-600',
    'Shipped':        'bg-purple-50 text-purple-600',
    'Out for delivery': 'bg-orange-50 text-orange-600',
    'Delivered':      'bg-green-50 text-green-600',
}

const RETURN_REASONS = [
    'Wrong size / fit',
    'Defective / damaged product',
    'Wrong item delivered',
    'Product not as described',
    'Changed my mind',
    'Other',
]

function Order() {
    let { currency } = useContext(shopDataContext)
    let { serverUrl } = useContext(authDataContext)
    const [orderData, setOrderData] = useState([])
    const [userReturns, setUserReturns] = useState([])
    const [returnModal, setReturnModal] = useState(null) // { orderId, item }
    const [returnReason, setReturnReason] = useState('')
    const [returnNote, setReturnNote] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [actionType, setActionType] = useState('Refund') // 'Refund' or 'Replace'
    
    // Refund details state
    const [refundMethod, setRefundMethod] = useState('UPI') // 'UPI' or 'Bank'
    const [upiId, setUpiId] = useState('')
    const [bankAccount, setBankAccount] = useState('')
    const [bankIfsc, setBankIfsc] = useState('')
    const [bankName, setBankName] = useState('')
    const loadOrderData = async () => {
        try {
            const result = await axios.post(serverUrl + '/api/order/userorder', {}, { withCredentials: true })
            if (result.data && result.data.length > 0) {
                let allItems = []
                result.data.map(order => {
                    order.items.map(item => {
                        item['status'] = order.status
                        item['orderId'] = order._id || order.id
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date
                        allItems.push(item)
                    })
                })
                setOrderData(allItems.reverse())
            } else {
                setOrderData([])
            }
        } catch (error) {
            console.log("loadOrderData error:", error.response?.data || error.message)
        }
    }

    const loadUserReturns = async () => {
        try {
            const { data } = await axios.get(serverUrl + '/api/return/my', { withCredentials: true })
            setUserReturns(data)
        } catch (err) {
            console.log(err)
        }
    }

    const submitReturn = async () => {
        if (!returnReason) return toast.error('Please select a reason')
        if (actionType === 'Refund') {
            if (refundMethod === 'UPI' && !upiId) return toast.error('Please enter your UPI ID')
            if (refundMethod === 'Bank' && (!bankAccount || !bankIfsc || !bankName)) return toast.error('Please fill all Bank details')
        }

        setSubmitting(true)
        
        const refundDetails = refundMethod === 'UPI' 
            ? { upiId } 
            : { accountNo: bankAccount, ifsc: bankIfsc, accountName: bankName }
        try {
            await axios.post(serverUrl + '/api/return/request', {
                orderId: returnModal.orderId,
                itemId: returnModal.item._id,
                itemName: returnModal.item.name,
                itemImage: returnModal.item.image1,
                itemPrice: returnModal.item.price,
                itemSize: returnModal.item.size,
                reason: returnReason,
                description: returnNote,
                actionType,
                refundMethod: actionType === 'Refund' ? refundMethod : undefined,
                refundDetails: actionType === 'Refund' ? refundDetails : undefined
            }, { withCredentials: true })
            toast.success('Return request submitted! Check your email.')
            setReturnModal(null)
            setReturnReason('')
            setReturnNote('')
            setUpiId('')
            setBankAccount('')
            setBankIfsc('')
            setBankName('')
            loadUserReturns()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit return')
        }
        setSubmitting(false)
    }

    const getReturnStatus = (orderId, itemId) => {
        return userReturns.find(r => r.orderId === orderId && r.itemId === itemId)
    }

    const handleDownloadInvoice = (orderId) => {
        window.open(serverUrl + "/api/order/invoice/" + orderId, "_blank")
    }

    useEffect(() => { loadOrderData(); loadUserReturns() }, [])

    return (
        <div className='w-full min-h-screen bg-gray-50 pt-[90px] pb-[100px]'>
            <div className='max-w-[900px] mx-auto px-[20px]'>

                <div className='mb-[32px]'>
                    <h1 className='text-[26px] md:text-[32px] font-bold text-gray-900'>My Orders</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>{orderData.length} order{orderData.length !== 1 ? 's' : ''}</p>
                </div>

                {orderData.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-[80px] gap-[16px] bg-white rounded-2xl border border-gray-200'>
                        <div className='w-[72px] h-[72px] bg-gray-100 rounded-full flex items-center justify-center'>
                            <FiPackage className='w-[32px] h-[32px] text-gray-400' />
                        </div>
                        <p className='text-[16px] font-semibold text-gray-600'>No orders yet</p>
                        <p className='text-[13px] text-gray-400'>Your order history will appear here</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-[14px]'>
                        {orderData.map((item, index) => {
                            const returnInfo = getReturnStatus(item.orderId, item._id)
                            const canReturn = item.status === 'Delivered' && !returnInfo

                            return (
                                <div key={index} className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[16px] md:p-[20px]'>
                                    <div className='flex flex-col sm:flex-row gap-[16px]'>
                                        <img src={item.image1} alt={item.name}
                                            className='w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-xl object-cover flex-shrink-0 border border-gray-100'
                                        />
                                        <div className='flex-1 flex flex-col sm:flex-row gap-[12px] sm:gap-0 justify-between'>
                                            <div className='flex flex-col gap-[6px]'>
                                                <p className='text-[15px] font-semibold text-gray-900 leading-snug'>{item.name}</p>
                                                <div className='flex flex-wrap items-center gap-[8px]'>
                                                    <span className='text-[14px] font-bold text-gray-800'>{currency} {item.price}</span>
                                                    <span className='text-[12px] bg-gray-100 text-gray-500 px-[8px] py-[2px] rounded-full'>×{item.quantity}</span>
                                                    <span className='text-[12px] bg-gray-100 text-gray-500 px-[8px] py-[2px] rounded-full'>{item.size}</span>
                                                </div>
                                                <div className='flex flex-wrap gap-[12px] mt-[4px]'>
                                                    <span className='text-[12px] text-gray-400'>
                                                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span className='text-[12px] text-gray-400'>{item.paymentMethod}</span>
                                                    <span className={`text-[12px] font-semibold ${item.payment ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {item.payment ? '✓ Paid' : '⏳ Pending'}
                                                    </span>
                                                </div>

                                                {/* Return status badge */}
                                                {returnInfo && (
                                                    <span className={`w-fit text-[11px] font-semibold px-[8px] py-[3px] rounded-full mt-[4px] border
                                                        ${returnInfo.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200'
                                                        : returnInfo.status === 'Rejected' ? 'bg-red-50 text-red-500 border-red-200'
                                                        : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                                                        ↩ Return: {returnInfo.status}
                                                    </span>
                                                )}
                                            </div>

                                            <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-[10px]'>
                                                <span className={`text-[12px] font-semibold px-[10px] py-[4px] rounded-full ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    ● {item.status}
                                                </span>
                                                <div className='flex items-center gap-[8px]'>
                                                    <button
                                                        onClick={() => handleDownloadInvoice(item.orderId)}
                                                        className='text-[12px] font-semibold text-black bg-gray-100 border border-gray-200 px-[14px] py-[6px] rounded-full hover:bg-gray-200 transition-all whitespace-nowrap'
                                                    >
                                                        ⬇ Bill
                                                    </button>
                                                    <button
                                                        onClick={loadOrderData}
                                                        className='text-[12px] font-semibold text-gray-600 border border-gray-200 px-[14px] py-[6px] rounded-full hover:bg-gray-50 transition-all whitespace-nowrap'
                                                    >
                                                        Track Order
                                                    </button>
                                                </div>

                                                {/* Return button — only for delivered orders */}
                                                {canReturn && (
                                                    <button
                                                        onClick={() => setReturnModal({ orderId: item.orderId, item })}
                                                        className='flex items-center gap-[5px] text-[12px] font-semibold text-orange-600 border border-orange-200 bg-orange-50 px-[14px] py-[6px] rounded-full hover:bg-orange-100 transition-all whitespace-nowrap'
                                                    >
                                                        <TbArrowBackUp size={13} /> Return / Replace
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Return Modal ── */}
            {returnModal && (
                <div className='fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]'>
                    <div className='bg-white rounded-2xl shadow-xl w-full max-w-[420px] max-h-[90vh] flex flex-col overflow-hidden'>
                        <div className='flex items-center justify-between px-[20px] py-[16px] border-b border-gray-100 flex-shrink-0'>
                            <h2 className='text-[16px] font-bold text-gray-900'>Request Return</h2>
                            <button onClick={() => setReturnModal(null)} className='text-gray-400 hover:text-gray-700 text-xl font-bold'>×</button>
                        </div>
                        
                        <div className='px-[20px] py-[16px] flex flex-col gap-[14px] overflow-y-auto no-scrollbar'>
                            {/* Item preview */}
                            <div className='flex items-center gap-[12px] bg-gray-50 rounded-xl p-[12px]'>
                                <img src={returnModal.item.image1} alt="" className='w-[52px] h-[52px] rounded-lg object-cover' />
                                <div>
                                    <p className='text-[14px] font-semibold text-gray-900'>{returnModal.item.name}</p>
                                    <p className='text-[12px] text-gray-400'>Size: {returnModal.item.size} · ₹{returnModal.item.price}</p>
                                </div>
                            </div>

                            {/* Reason select */}
                            <div>
                                <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[8px] block'>Return Reason *</label>
                                <div className='flex flex-col gap-[6px]'>
                                    {RETURN_REASONS.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setReturnReason(r)}
                                            className={`text-left text-[12px] md:text-[13px] px-[12px] py-[7px] md:py-[8px] rounded-xl border transition-all
                                                ${returnReason === r ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Optional note */}
                            <div>
                                <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>Additional Details (optional)</label>
                                <textarea
                                    placeholder='Describe the issue in more detail...'
                                    value={returnNote}
                                    onChange={(e) => setReturnNote(e.target.value)}
                                    rows={2}
                                    className='w-full rounded-xl border border-gray-200 px-[12px] py-[8px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 resize-none'
                                />
                            </div>

                            {/* Action Type */}
                            <div>
                                <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>What would you like? *</label>
                                <div className='flex gap-[8px]'>
                                    <button 
                                        onClick={() => setActionType('Refund')}
                                        className={`flex-1 py-[7px] text-[12px] font-medium rounded-xl border transition-all ${actionType === 'Refund' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >Refund</button>
                                    <button 
                                        onClick={() => setActionType('Replace')}
                                        className={`flex-1 py-[7px] text-[12px] font-medium rounded-xl border transition-all ${actionType === 'Replace' ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >Replace</button>
                                </div>
                            </div>

                            {/* Refund Details */}
                            {actionType === 'Refund' && (
                                <div>
                                    <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[8px] block'>Refund Method *</label>
                                <div className='flex gap-[10px] mb-[12px]'>
                                    <button 
                                        onClick={() => setRefundMethod('UPI')}
                                        className={`flex-1 py-[7px] text-[12px] rounded-xl border transition-all ${refundMethod === 'UPI' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}
                                    >UPI</button>
                                    <button 
                                        onClick={() => setRefundMethod('Bank')}
                                        className={`flex-1 py-[7px] text-[12px] rounded-xl border transition-all ${refundMethod === 'Bank' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}
                                    >Bank Transfer</button>
                                </div>
                                
                                {refundMethod === 'UPI' ? (
                                    <input 
                                        type="text" 
                                        placeholder="Enter your UPI ID (e.g. 9876543210@paytm)"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className='w-full rounded-xl border border-gray-200 px-[12px] h-[36px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200'
                                    />
                                ) : (
                                    <div className='flex flex-col gap-[6px]'>
                                        <input 
                                            type="text" 
                                            placeholder="Account Holder Name"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            className='w-full rounded-xl border border-gray-200 px-[12px] h-[36px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200'
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Account Number"
                                            value={bankAccount}
                                            onChange={(e) => setBankAccount(e.target.value)}
                                            className='w-full rounded-xl border border-gray-200 px-[12px] h-[36px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200'
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="IFSC Code"
                                            value={bankIfsc}
                                            onChange={(e) => setBankIfsc(e.target.value)}
                                            className='w-full rounded-xl border border-gray-200 px-[12px] h-[36px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200'
                                        />
                                    </div>
                                )}
                            </div>
                            )}

                            <div className='p-[12px] bg-amber-50 rounded-xl'>
                                <p className='text-[12px] text-amber-700'>
                                    📦 Keep the item ready for pickup. {actionType === 'Refund' ? 'Refund processed in 5-7 business days after approval.' : 'Replacement will be shipped after pickup.'}
                                </p>
                            </div>
                        </div>
                        <div className='px-[20px] py-[16px] border-t border-gray-100 flex gap-[10px] flex-shrink-0'>
                            <button
                                onClick={() => setReturnModal(null)}
                                className='flex-1 h-[42px] rounded-xl border border-gray-200 text-gray-600 font-semibold text-[13px] hover:bg-gray-50 transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReturn}
                                disabled={submitting || !returnReason}
                                className='flex-1 h-[42px] rounded-xl bg-black text-white font-semibold text-[13px] hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {submitting ? 'Submitting...' : `Request ${actionType}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Order

import React, { useContext, useState } from 'react'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import Footer from '../component/Footer'
import { MdLocationOn, MdPayment } from 'react-icons/md'

function PlaceOrder() {
    const [method, setMethod] = useState('cod')
    const navigate = useNavigate()
    const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext)
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        street: '', city: '',
        pinCode: '', phone: ''
    })

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
                if (data.success || data.message) {
                    navigate("/order"); setCartItem({})
                    toast.success("Payment Successful")
                } else {
                    toast.error("Payment Verification Failed")
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            let orderItems = []
            for (const items in cartItem) {
                for (const item in cartItem[items]) {
                    if (cartItem[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(p => p._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItem[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }
            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }
            switch (method) {
                case 'cod': {
                    const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
                    if (result.data.success || result.data.message) {
                        setCartItem({}); toast.success("Order Placed!")
                        navigate("/order")
                    } else {
                        toast.error("Order placement error")
                    }
                    break
                }
                case 'razorpay': {
                    try {
                        const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true })
                        if (resultRazorpay.data) initPay(resultRazorpay.data)
                        else toast.error("Razorpay initialization failed")
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Razorpay initialization failed")
                    }
                    break
                }
                default: break
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Order placement failed")
        }
        setLoading(false)
    }

    const inputClass = 'w-full h-[46px] rounded-xl px-[14px] text-gray-800 text-[14px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 border border-gray-200 transition-all'

    return (
        <div className='w-full min-h-screen bg-gray-50 pt-[90px] pb-[100px]'>
            <div className='max-w-[1100px] mx-auto px-[20px]'>

                {/* Page heading */}
                <div className='mb-[32px]'>
                    <h1 className='text-[26px] md:text-[32px] font-bold text-gray-900'>Checkout</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>Fill in your delivery details to complete your order</p>
                </div>

                <form onSubmit={onSubmitHandler}>
                    <div className='flex flex-col lg:flex-row gap-[24px] items-start'>

                        {/* ── Left: Delivery form ── */}
                        <div className='flex-1 flex flex-col gap-[20px]'>

                            {/* Delivery Info Card */}
                            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                                <div className='flex items-center gap-[10px] px-[24px] py-[16px] border-b border-gray-100'>
                                    <MdLocationOn className='text-gray-600 w-[18px] h-[18px]' />
                                    <h2 className='text-[15px] font-bold text-gray-900'>Delivery Information</h2>
                                </div>
                                <div className='px-[24px] py-[20px] flex flex-col gap-[14px]'>
                                    {/* First + Last name */}
                                    <div className='flex gap-[12px]'>
                                        <div className='flex-1'>
                                            <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>First Name</label>
                                            <input type="text" placeholder='Enter first name' className={inputClass} required onChange={onChangeHandler} name='firstName' value={formData.firstName} />
                                        </div>
                                        <div className='flex-1'>
                                            <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>Last Name</label>
                                            <input type="text" placeholder='Enter last name' className={inputClass} required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>Email</label>
                                        <input type="email" placeholder='Enter email address' className={inputClass} required onChange={onChangeHandler} name='email' value={formData.email} />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>Phone</label>
                                        <input type="text" placeholder='Enter phone number' className={inputClass} required onChange={onChangeHandler} name='phone' value={formData.phone} />
                                    </div>

                                    {/* Street */}
                                    <div>
                                        <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>Street Address</label>
                                        <input type="text" placeholder='Enter street address' className={inputClass} required onChange={onChangeHandler} name='street' value={formData.street} />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>City</label>
                                        <input type="text" placeholder='Enter city' className={inputClass} required onChange={onChangeHandler} name='city' value={formData.city} />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <label className='text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[6px] block'>Pincode</label>
                                        <input type="text" placeholder='Enter pincode' className={inputClass} required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Summary + Payment ── */}
                        <div className='w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-[16px] lg:sticky lg:top-[90px]'>

                            {/* Cart total */}
                            <CartTotal />

                            {/* Payment method */}
                            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                                <div className='flex items-center gap-[10px] px-[24px] py-[16px] border-b border-gray-100'>
                                    <MdPayment className='text-gray-600 w-[18px] h-[18px]' />
                                    <h2 className='text-[15px] font-bold text-gray-900'>Payment Method</h2>
                                </div>
                                <div className='px-[20px] py-[16px] flex flex-col gap-[10px]'>

                                    {/* Razorpay */}
                                    <button
                                        type='button'
                                        onClick={() => setMethod('razorpay')}
                                        className={`w-full h-[52px] rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all
                                            ${method === 'razorpay' ? 'border-black' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <img src={razorpay} className='h-[32px] object-contain' alt="Razorpay" />
                                    </button>

                                    {/* COD */}
                                    <button
                                        type='button'
                                        onClick={() => setMethod('cod')}
                                        className={`w-full h-[52px] rounded-xl border-2 flex items-center justify-center gap-[8px] text-[13px] font-bold transition-all
                                            ${method === 'cod' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <span className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${method === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                                            {method === 'cod' && <span className='w-[8px] h-[8px] bg-black rounded-full' />}
                                        </span>
                                        Cash on Delivery
                                    </button>
                                </div>
                            </div>

                            {/* Place order button */}
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full h-[52px] bg-black text-white font-bold text-[15px] rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? <Loading /> : 'Place Order →'}
                            </button>

                            <p className='text-[12px] text-gray-400 text-center'>
                                By placing your order, you agree to our Terms & Conditions and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default PlaceOrder

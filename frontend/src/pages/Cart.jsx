import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri"
import { FiShoppingCart } from 'react-icons/fi'
import CartTotal from '../component/CartTotal'
import Footer from '../component/Footer'

function Cart() {
    const { products, currency, cartItem, updateQuantity } = useContext(shopDataContext)
    const [cartData, setCartData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const tempData = []
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    tempData.push({ _id: items, size: item, quantity: cartItem[items][item] })
                }
            }
        }
        setCartData(tempData)
    }, [cartItem])

    return (
        <div className='w-full min-h-screen bg-gray-50 pt-[90px] pb-[100px]'>
            <div className='max-w-[1100px] mx-auto px-[20px]'>

                {/* Page heading */}
                <div className='mb-[32px]'>
                    <h1 className='text-[26px] md:text-[32px] font-bold text-gray-900'>Your Cart</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>{cartData.length} item{cartData.length !== 1 ? 's' : ''}</p>
                </div>

                {cartData.length === 0 ? (
                    /* Empty cart */
                    <div className='flex flex-col items-center justify-center py-[80px] gap-[16px]'>
                        <div className='w-[72px] h-[72px] bg-gray-100 rounded-full flex items-center justify-center'>
                            <FiShoppingCart className='w-[32px] h-[32px] text-gray-400' />
                        </div>
                        <p className='text-[16px] font-semibold text-gray-600'>Your cart is empty</p>
                        <p className='text-[13px] text-gray-400'>Add items to your cart to continue shopping</p>
                        <button
                            onClick={() => navigate('/collection')}
                            className='mt-[8px] px-[24px] py-[11px] bg-black text-white rounded-full font-semibold text-[13px] hover:bg-gray-800 transition-all'
                        >
                            Browse Collections
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col lg:flex-row gap-[24px] items-start'>

                        {/* Cart items */}
                        <div className='flex-1 flex flex-col gap-[12px]'>
                            {cartData.map((item, index) => {
                                const productData = products.find(p => p._id === item._id)
                                if (!productData) return null
                                return (
                                    <div key={index} className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[16px] md:p-[20px]'>
                                        <div className='flex gap-[14px] md:gap-[20px] items-center'>
                                            {/* Image */}
                                            <img
                                                src={productData.image1}
                                                alt={productData.name}
                                                className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-xl object-cover flex-shrink-0 border border-gray-100'
                                            />

                                            {/* Info */}
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-[14px] md:text-[16px] font-semibold text-gray-900 truncate'>{productData.name}</p>
                                                <div className='flex items-center gap-[10px] mt-[6px] flex-wrap'>
                                                    <span className='text-[14px] font-bold text-gray-800'>{currency} {productData.price}</span>
                                                    <span className='text-[12px] bg-gray-100 text-gray-500 px-[8px] py-[2px] rounded-full font-medium'>{item.size}</span>
                                                </div>
                                            </div>

                                            {/* Qty + Delete */}
                                            <div className='flex items-center gap-[10px] flex-shrink-0'>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    defaultValue={item.quantity}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value)
                                                        if (val > 0) updateQuantity(item._id, item.size, val)
                                                    }}
                                                    className='w-[52px] h-[38px] text-center border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-gray-200'
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.size, 0)}
                                                    className='w-[38px] h-[38px] flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-gray-200'
                                                >
                                                    <RiDeleteBin6Line size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Summary sidebar */}
                        <div className='w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-[14px] lg:sticky lg:top-[90px]'>
                            <CartTotal />
                            <button
                                onClick={() => cartData.length > 0 && navigate("/placeorder")}
                                className='w-full h-[50px] bg-black text-white font-semibold text-[15px] rounded-xl hover:bg-gray-800 transition-all'
                            >
                                Proceed to Checkout →
                            </button>
                            <button
                                onClick={() => navigate('/collection')}
                                className='w-full h-[46px] text-gray-600 font-medium text-[14px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-all'
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Cart

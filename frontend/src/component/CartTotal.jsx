import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'

function CartTotal() {
    const { currency, delivery_fee, getCartAmount } = useContext(shopDataContext)
    const subtotal = getCartAmount()
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee

    return (
        <div className='w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
            <div className='px-[24px] py-[16px] border-b border-gray-100'>
                <h3 className='text-[15px] font-bold text-gray-900'>Order Summary</h3>
            </div>
            <div className='px-[24px] py-[20px] flex flex-col gap-[14px]'>
                <div className='flex justify-between text-[14px]'>
                    <span className='text-gray-500'>Subtotal</span>
                    <span className='font-semibold text-gray-800'>{currency} {subtotal}.00</span>
                </div>
                <div className='flex justify-between text-[14px]'>
                    <span className='text-gray-500'>Shipping</span>
                    <span className='font-semibold text-gray-800'>{currency} {delivery_fee}</span>
                </div>
                <div className='border-t border-gray-100 pt-[14px] flex justify-between text-[15px]'>
                    <span className='font-bold text-gray-900'>Total</span>
                    <span className='font-bold text-gray-900'>{currency} {total}</span>
                </div>
            </div>
        </div>
    )
}

export default CartTotal

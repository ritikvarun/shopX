import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({ name, image, id, price }) {
    let { currency } = useContext(shopDataContext)
    let navigate = useNavigate()
    return (
        <div
            className='w-full h-full bg-white rounded-2xl overflow-hidden cursor-pointer group border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col'
            onClick={() => navigate(`/productdetail/${id}`)}
        >
            <div className='w-full aspect-[3/4] overflow-hidden bg-gray-50'>
                <img
                    src={image}
                    alt={name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
            </div>
            <div className='p-[14px] flex-1'>
                <p className='text-gray-800 text-[14px] font-semibold leading-snug line-clamp-2'>{name}</p>
                <p className='text-gray-500 text-[13px] mt-[4px] font-medium'>{currency} {price}</p>
            </div>
        </div>
    )
}

export default Card

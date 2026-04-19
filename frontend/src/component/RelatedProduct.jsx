import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function RelatedProduct({ category, subCategory, currentProductId }) {
    let { products } = useContext(shopDataContext)
    let [related, setRelated] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            let filtered = products
                .filter(item => item.category === category)
                .filter(item => item.subCategory === subCategory)
                .filter(item => item._id !== currentProductId)
                .slice(0, 4)
            setRelated(filtered)
        }
    }, [products, category, subCategory, currentProductId])

    if (related.length === 0) return null

    return (
        <div className='mt-[60px] mb-[40px]'>
            <div className='flex flex-col items-start mb-[28px]'>
                <h2 className='text-[22px] font-bold text-gray-900'>You May Also Like</h2>
                <div className='w-[50px] h-[3px] bg-black rounded-full mt-[8px]'></div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[20px]'>
                {related.map((item, index) => (
                    <Card key={index} id={item._id} name={item.name} price={item.price} image={item.image1} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProduct

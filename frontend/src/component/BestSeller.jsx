import React, { useContext, useEffect, useState, useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
    let { products } = useContext(shopDataContext)
    let [bestSeller, setBestSeller] = useState([])
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef
            current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        let filterProduct = products.filter((item) => item.bestseller)
        setBestSeller(filterProduct.slice(0, 16)) // Show up to 16 best sellers (2 rows of 8)
    }, [products])

    return (
        <section className='w-full bg-gray-50 py-[60px] px-[20px]'>
            <div className='max-w-[1200px] mx-auto'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-[20px] gap-[14px]'>
                    <div className='text-center sm:text-left flex flex-col items-center sm:items-start'>
                        <Title text1={"BEST"} text2={"SELLER"} color='text-gray-800' color2='text-black' />
                        <p className='text-gray-500 text-[14px] max-w-[480px] -mt-2'>
                            Tried, Tested, Loved – Discover Our All-Time Best Sellers.
                        </p>
                    </div>
                    {/* Navigation Buttons */}
                    <div className='hidden sm:flex gap-[12px]'>
                        <button onClick={() => scroll('left')} className='w-[44px] h-[44px] rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all text-gray-700'>
                            <FiChevronLeft size={22} />
                        </button>
                        <button onClick={() => scroll('right')} className='w-[44px] h-[44px] rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all text-gray-700'>
                            <FiChevronRight size={22} />
                        </button>
                    </div>
                </div>

                {/* 2-Row Horizontal Scroll Container */}
                <div ref={scrollRef} className='grid grid-rows-2 grid-flow-col auto-cols-max overflow-x-auto gap-[20px] pb-[20px] snap-x snap-mandatory no-scrollbar'>
                    {bestSeller.map((item, index) => (
                        <div key={index} className='w-[160px] sm:w-[200px] lg:w-[260px] snap-start'>
                            <Card name={item.name} id={item._id} price={item.price} image={item.image1} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BestSeller

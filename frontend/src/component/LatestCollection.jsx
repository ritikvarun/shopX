import React from 'react'
import Title from '../component/Title'
import Card from './Card'
import { useContext, useEffect, useState, useRef } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function LatestCollection() {
    let { products } = useContext(shopDataContext)
    let [latestProducts, setLatestProducts] = useState([])
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef
            current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        setLatestProducts(products.slice(0, 20)) // Increased to 20 to fill 2 rows well
    }, [products])

    return (
        <section className='w-full bg-white py-[60px] px-[20px]'>
            <div className='max-w-[1200px] mx-auto'>
                <div className='flex items-center justify-between mb-[20px]'>
                    <div className='text-left'>
                        <Title text1={"LATEST"} text2={"COLLECTIONS"} color='text-gray-800' color2='text-black' />
                        <p className='text-gray-500 text-[14px] max-w-[480px] -mt-2'>
                            Step Into Style – New Collection Dropping This Season!
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
                <div ref={scrollRef} className='grid grid-rows-2 grid-flow-col overflow-x-auto gap-[20px] pb-[20px] snap-x snap-mandatory no-scrollbar'>
                    {latestProducts.map((item, index) => (
                        <div key={index} className='w-[160px] sm:w-[200px] lg:w-[260px] snap-start'>
                            <Card name={item.name} image={item.image1} id={item._id} price={item.price} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default LatestCollection

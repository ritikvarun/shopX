import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import back1 from "../assets/1.jpg"
import back2 from "../assets/7.jpg"
import back3 from "../assets/3.jpeg"
import back4 from "../assets/6.jpeg"

const slides = [back2, back1, back3, back4]

const captions = [
    { tag: "Limited Offer", heading: "30% OFF This Season", sub: "Shop the trendiest styles at unbeatable prices" },
    { tag: "New Arrivals", heading: "Bold Fashion Awaits", sub: "Discover our freshest collection — just dropped" },
    { tag: "Top Picks", heading: "Best of ShopX", sub: "Explore what everyone's loving right now" },
    { tag: "Sale Live", heading: "Your Perfect Fit", sub: "Fashion for every style, every size, every mood" },
]

function Backgound({ heroCount }) {
    const { settings } = useContext(shopDataContext)
    
    // Fallback to static images if dynamic settings are not yet loaded or missing
    const dynamicSlides = [
        settings?.homeBanner1 || back2,
        settings?.homeBanner2 || back1,
        settings?.homeBanner3 || back3,
        settings?.homeBanner4 || back4
    ]

    const slide = dynamicSlides[heroCount] || dynamicSlides[0]
    const caption = captions[heroCount] || captions[0]

    return (
        <div className='relative w-full h-full overflow-hidden'>
            {/* Image */}
            <img
                key={heroCount}
                src={slide}
                alt=""
                className='w-full h-full object-cover'
                style={{ animation: 'fadeSlide 0.7s ease' }}
            />
            {/* Dark overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent' />

            {/* Caption */}
            <div className='absolute inset-0 flex flex-col justify-center pl-[6%] pr-[10%]'>
                <span className='inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-widest px-[12px] py-[5px] rounded-full w-fit mb-[14px]'>
                    {caption.tag}
                </span>
                <h1 className='text-white font-bold leading-tight'
                    style={{ fontSize: 'clamp(22px, 4vw, 58px)' }}>
                    {caption.heading}
                </h1>
                <p className='text-white/80 mt-[10px] max-w-[420px]'
                    style={{ fontSize: 'clamp(12px, 1.6vw, 20px)' }}>
                    {caption.sub}
                </p>
                <button
                    className='mt-[22px] w-fit px-[28px] py-[12px] bg-white text-black font-semibold rounded-full text-[14px] hover:bg-gray-100 transition-all duration-200'
                    onClick={() => window.location.href = '/collection'}
                >
                    Shop Now →
                </button>
            </div>

            <style>{`
                @keyframes fadeSlide {
                    from { opacity: 0; transform: scale(1.04); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    )
}

export default Backgound

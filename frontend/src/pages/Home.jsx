import React, { useEffect, useState } from 'react'
import Backgound from '../component/Backgound'
import LatestCollection from '../component/LatestCollection'
import BestSeller from '../component/BestSeller'
import OurPolicy from '../component/OurPolicy'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'

function Home() {
    const heroData = [
        { tag: "Limited Offer", heading: "30% OFF This Season", sub: "Shop the trendiest styles at unbeatable prices" },
        { tag: "New Arrivals", heading: "Bold Fashion Awaits", sub: "Discover our freshest collection — just dropped" },
        { tag: "Top Picks", heading: "Best of ShopX", sub: "Explore what everyone's loving right now" },
        { tag: "Sale Live", heading: "Your Perfect Fit", sub: "Fashion for every style, every size, every mood" },
    ]

    let [heroCount, setHeroCount] = useState(0)

    useEffect(() => {
        let interval = setInterval(() => {
            setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1))
        }, 3500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='overflow-x-hidden relative top-[70px]'>
            {/* Hero Slider */}
            <div className='w-full h-[55vh] md:h-[75vh] lg:h-[92vh] bg-gray-100 relative'>
                <Backgound heroCount={heroCount} />
                {/* Slide dots */}
                <div className='absolute bottom-[24px] left-1/2 -translate-x-1/2 flex gap-[8px] z-10'>
                    {[0, 1, 2, 3].map((i) => (
                        <button
                            key={i}
                            onClick={() => setHeroCount(i)}
                            className={`rounded-full transition-all duration-300 ${heroCount === i ? 'w-[24px] h-[8px] bg-white' : 'w-[8px] h-[8px] bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewLetterBox />
            <Footer />
        </div>
    )
}

export default Home

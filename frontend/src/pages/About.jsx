import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import about from '../assets/about.jpg'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'
import { RiShieldCheckLine } from 'react-icons/ri'
import { MdOutlineLocalShipping } from 'react-icons/md'
import { BiSupport } from 'react-icons/bi'

const features = [
    {
        icon: <RiShieldCheckLine className='w-[28px] h-[28px] text-gray-800' />,
        title: "Quality Assurance",
        desc: "We guarantee quality through strict checks, reliable sourcing, and a commitment to customer satisfaction."
    },
    {
        icon: <MdOutlineLocalShipping className='w-[28px] h-[28px] text-gray-800' />,
        title: "Convenience",
        desc: "Shop easily with fast delivery, simple navigation, secure checkout, and everything in one place."
    },
    {
        icon: <BiSupport className='w-[28px] h-[28px] text-gray-800' />,
        title: "Exceptional Support",
        desc: "Our dedicated support team ensures quick responses and a smooth shopping experience every time."
    }
]

function About() {
    const { settings } = useContext(shopDataContext)
    const aboutImage = settings?.aboutBanner || about

    return (
        <div className='w-full min-h-[100vh] bg-white pt-[90px]'>

            {/* Hero section */}
            <div className='max-w-[1100px] mx-auto px-[24px] py-[60px] flex flex-col lg:flex-row gap-[60px] items-center'>
                <div className='lg:w-1/2 w-full'>
                    <img src={aboutImage} alt="About ShopX" className='w-full rounded-2xl shadow-lg object-cover' />
                </div>
                <div className='lg:w-1/2 w-full flex flex-col gap-[20px]'>
                    <div>
                        <span className='text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-[12px] py-[5px] rounded-full'>About Us</span>
                        <h1 className='text-[28px] md:text-[36px] font-bold text-gray-900 mt-[14px] leading-tight'>
                            The Story Behind <span className='text-gray-600'>ShopX</span>
                        </h1>
                    </div>
                    <p className='text-gray-500 text-[14px] leading-relaxed'>
                        ShopX was born for smart, seamless shopping — created to deliver quality products, trending styles, and everyday essentials in one place. With reliable service, fast delivery, and great value, ShopX makes your online shopping experience simple, satisfying, and stress-free.
                    </p>
                    <p className='text-gray-500 text-[14px] leading-relaxed'>
                        Built for modern shoppers — combining style, convenience, and affordability. Whether it's fashion, essentials, or trends, we bring everything you need to one trusted platform with easy returns and a customer-first experience.
                    </p>
                    <div className='border-l-4 border-black pl-[16px]'>
                        <h3 className='text-gray-900 font-bold text-[16px] mb-[6px]'>Our Mission</h3>
                        <p className='text-gray-500 text-[14px] leading-relaxed'>
                            To redefine online shopping by delivering quality, affordability, and convenience — connecting customers with trusted products that save time, add value, and fit every lifestyle.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className='bg-gray-50 py-[60px] px-[24px]'>
                <div className='max-w-[1100px] mx-auto'>
                    <div className='text-center mb-[40px]'>
                        <h2 className='text-[26px] md:text-[34px] font-bold text-gray-900'>Why <span>Choose Us</span></h2>
                        <div className='w-[50px] h-[3px] bg-black rounded-full mt-[8px] mx-auto'></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-[20px]'>
                        {features.map((f, i) => (
                            <div key={i} className='bg-white rounded-2xl border border-gray-200 p-[28px] flex flex-col gap-[12px] hover:shadow-md transition-shadow'>
                                <div className='w-[52px] h-[52px] bg-gray-100 rounded-xl flex items-center justify-center'>
                                    {f.icon}
                                </div>
                                <h3 className='font-bold text-gray-900 text-[15px]'>{f.title}</h3>
                                <p className='text-gray-500 text-[13px] leading-relaxed'>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <NewLetterBox />
            <Footer />
        </div>
    )
}

export default About

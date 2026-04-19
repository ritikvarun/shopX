import React from 'react'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

const policies = [
    {
        icon: <RiExchangeFundsLine className='w-[32px] h-[32px] text-gray-800' />,
        title: "Easy Exchange Policy",
        desc: "Exchange Made Easy – Quick, Simple, and Customer-Friendly Process."
    },
    {
        icon: <TbRosetteDiscountCheckFilled className='w-[32px] h-[32px] text-gray-800' />,
        title: "7 Days Return Policy",
        desc: "Shop with Confidence – 7 Days Easy Return Guarantee."
    },
    {
        icon: <BiSupport className='w-[32px] h-[32px] text-gray-800' />,
        title: "Best Customer Support",
        desc: "Trusted Support – Your Satisfaction Is Our Priority."
    }
]

function OurPolicy() {
    return (
        <section className='w-full bg-gray-50 py-[70px] px-[20px]'>
            <div className='max-w-[1100px] mx-auto'>
                <div className='text-center mb-[50px]'>
                    <div className='flex flex-col items-center'>
                        <h2 className='text-[28px] md:text-[36px] font-bold text-gray-900'>Our <span className='text-gray-800'>Policy</span></h2>
                        <div className='w-[50px] h-[3px] bg-black rounded-full mt-[8px] mb-[14px]'></div>
                        <p className='text-gray-500 text-[14px] max-w-[500px]'>Customer-Friendly Policies – Committed to Your Satisfaction and Safety.</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-[24px]'>
                    {policies.map((p, i) => (
                        <div key={i} className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px] flex flex-col items-center text-center gap-[14px] hover:shadow-md transition-shadow duration-300'>
                            <div className='w-[64px] h-[64px] bg-gray-100 rounded-2xl flex items-center justify-center'>
                                {p.icon}
                            </div>
                            <h3 className='font-bold text-gray-900 text-[16px]'>{p.title}</h3>
                            <p className='text-gray-500 text-[13px] leading-relaxed'>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OurPolicy

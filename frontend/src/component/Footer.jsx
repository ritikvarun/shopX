import React from 'react'
import logo from "../assets/shopX.png"
import { useNavigate } from 'react-router-dom'

function Footer() {
    let navigate = useNavigate()
    return (
        <footer className='w-full bg-white border-t border-gray-200 mb-[88px] md:mb-0'>
            <div className='max-w-[1100px] mx-auto px-[24px] py-[48px] grid grid-cols-1 md:grid-cols-3 gap-[40px]'>

                {/* Brand */}
                <div className='flex flex-col gap-[14px]'>
                    <img src={logo} alt="ShopX" className='w-[110px]' onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                    <p className='text-gray-500 text-[13px] leading-relaxed max-w-[280px]'>
                        ShopX is your all-in-one online shopping destination — quality products, unbeatable deals, and fast delivery, every day.
                    </p>
                </div>

                {/* Company */}
                <div className='flex flex-col gap-[14px]'>
                    <h4 className='text-gray-900 font-bold text-[14px] uppercase tracking-wider'>Company</h4>
                    <ul className='flex flex-col gap-[10px]'>
                        {[
                            { label: 'Home', path: '/' },
                            { label: 'About Us', path: '/about' },
                            { label: 'Collections', path: '/collection' },
                            { label: 'Privacy Policy', path: '/' },
                        ].map((l) => (
                            <li
                                key={l.label}
                                className='text-gray-500 text-[13px] cursor-pointer hover:text-gray-900 transition-colors'
                                onClick={() => navigate(l.path)}
                            >
                                {l.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className='flex flex-col gap-[14px]'>
                    <h4 className='text-gray-900 font-bold text-[14px] uppercase tracking-wider'>Get In Touch</h4>
                    <ul className='flex flex-col gap-[10px]'>
                        {[
                            '+91-9876543210',
                            'contact@shopx.com',
                            '12345 MG Road, Bangalore',
                        ].map((t) => (
                            <li key={t} className='text-gray-500 text-[13px]'>{t}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className='border-t border-gray-100 py-[16px] text-center text-gray-400 text-[12px]'>
                © 2026 ShopX. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer

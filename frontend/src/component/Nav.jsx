import React, { useContext, useState } from 'react'
import logo from '../assets/shopX.png'
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5"
import { FaCircleUser } from "react-icons/fa6"
import { MdOutlineShoppingCart, MdContacts } from "react-icons/md"
import { IoMdHome } from "react-icons/io"
import { HiOutlineCollection } from "react-icons/hi"
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/authContext'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

function Nav({ onLoginClick }) {
    const { getCurrentUser, userData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)
    const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext)
    const [showProfile, setShowProfile] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            getCurrentUser()
        } catch (error) {
            console.log(error)
        }
    }

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Collections', path: '/collection' },
        { label: 'About', path: '/about' },
    ]

    const cartCount = getCartCount()

    return (
        <>
            {/* ── Top Navbar ── */}
            <div className='w-full h-[70px] bg-white border-b border-gray-200 z-[30] fixed top-0 left-0 right-0 flex items-center justify-between px-[20px] md:px-[40px]'>

                {/* Logo */}
                <img
                    src={logo}
                    alt="ShopX"
                    className='w-[110px] md:w-[130px] cursor-pointer'
                    onClick={() => navigate("/")}
                />

                {/* Desktop nav links */}
                <ul className='hidden md:flex items-center gap-[6px]'>
                    {navLinks.map(link => {
                        const isActive = location.pathname === link.path
                        return (
                            <li
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`text-[14px] font-semibold px-[16px] py-[8px] rounded-full cursor-pointer transition-all
                                    ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {link.label}
                            </li>
                        )
                    })}
                </ul>

                {/* Right icons */}
                <div className='flex items-center gap-[14px]'>
                    {/* Search icon */}
                    {!showSearch
                        ? <IoSearchCircleOutline className='w-[34px] h-[34px] text-gray-700 cursor-pointer hover:text-black transition-all' onClick={() => { setShowSearch(true); navigate("/collection") }} />
                        : <IoSearchCircleSharp className='w-[34px] h-[34px] text-black cursor-pointer' onClick={() => setShowSearch(false)} />
                    }

                    {/* Desktop: Login button or Avatar */}
                    {!userData ? (
                        <button
                            onClick={onLoginClick}
                            className='hidden md:flex items-center bg-black text-white text-[13px] font-semibold px-[18px] py-[8px] rounded-full hover:bg-gray-800 transition-all'
                        >
                            Login
                        </button>
                    ) : (
                        <div
                            className='w-[34px] h-[34px] bg-black text-white rounded-full flex items-center justify-center cursor-pointer text-[14px] font-bold flex-shrink-0'
                            onClick={() => setShowProfile(p => !p)}
                        >
                            {userData?.name?.slice(0, 1)?.toUpperCase()}
                        </div>
                    )}

                    {/* Cart - desktop only */}
                    <div className='relative hidden md:block cursor-pointer' onClick={() => navigate("/cart")}>
                        <MdOutlineShoppingCart className='w-[28px] h-[28px] text-gray-700 hover:text-black transition-all' />
                        {cartCount > 0 && (
                            <span className='absolute -top-[6px] -right-[6px] w-[16px] h-[16px] bg-black text-white rounded-full text-[9px] font-bold flex items-center justify-center'>
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Expandable Search bar ── */}
            {showSearch && (
                <div className='w-full h-[70px] bg-white border-b border-gray-200 fixed top-[70px] left-0 right-0 flex items-center justify-center z-[50] shadow-sm'>
                    <input
                        type="text"
                        className='w-[90%] md:w-[50%] h-[44px] bg-gray-50 rounded-full px-[20px] text-gray-800 text-[14px] border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400'
                        placeholder='Search products...'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        autoFocus
                    />
                </div>
            )}

            {/* ── Profile dropdown ── */}
            {showProfile && (
                <div className='fixed top-[76px] right-[16px] md:right-[40px] w-[220px] bg-white border border-gray-200 rounded-2xl z-[40] shadow-xl py-[8px]'>
                    <ul className='flex flex-col text-[14px] text-black'>
                        {userData && (
                            <>
                                <li className='px-[16px] py-[10px] text-gray-400 text-[12px] border-b border-gray-100'>
                                    👋 Hi, {userData?.name}
                                </li>
                                <li className='px-[16px] py-[11px] hover:bg-gray-50 cursor-pointer rounded-lg mx-[4px]' onClick={() => { navigate("/order"); setShowProfile(false) }}>
                                    My Orders
                                </li>
                                <li className='px-[16px] py-[11px] hover:bg-gray-50 cursor-pointer rounded-lg mx-[4px]' onClick={() => { navigate("/about"); setShowProfile(false) }}>
                                    About
                                </li>
                                <li className='px-[16px] py-[11px] hover:bg-red-50 text-red-500 cursor-pointer rounded-lg mx-[4px] mt-[4px] border-t border-gray-100' onClick={() => { handleLogout(); setShowProfile(false) }}>
                                    Log Out
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}

            {/* ── Mobile bottom navigation (Ultra-Modern Glass Pill) ── */}
            <div className={`fixed bottom-[24px] left-[20px] right-[20px] h-[68px] flex items-center justify-around bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full md:hidden z-[60] transition-transform duration-500 ease-in-out ${location.pathname.startsWith('/product/') ? 'translate-y-[150%]' : 'translate-y-0'}`}>
                {[
                    { icon: <IoMdHome className='w-[24px] h-[24px]' />, label: 'Home', path: '/' },
                    { icon: <HiOutlineCollection className='w-[24px] h-[24px]' />, label: 'Shop', path: '/collection' },
                ].map(item => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center relative active:scale-90 transition-all duration-300 ${isActive ? 'text-black scale-[1.15] -translate-y-1' : 'text-gray-400'}`}
                        >
                            {item.icon}
                            {isActive && <div className='absolute -bottom-[10px] w-[5px] h-[5px] bg-black rounded-full'></div>}
                        </button>
                    )
                })}

                {!userData ? (
                    <button
                        onClick={onLoginClick}
                        className='flex flex-col items-center justify-center relative active:scale-90 transition-all duration-300 text-gray-400'
                    >
                        <FaCircleUser className='w-[24px] h-[24px]' />
                    </button>
                ) : (
                    <div className='relative'>
                        <button
                            onClick={() => navigate("/cart")}
                            className={`flex flex-col items-center justify-center relative active:scale-90 transition-all duration-300 ${location.pathname === '/cart' ? 'text-black scale-[1.15] -translate-y-1' : 'text-gray-400'}`}
                        >
                            <MdOutlineShoppingCart className='w-[24px] h-[24px]' />
                            {location.pathname === '/cart' && <div className='absolute -bottom-[10px] w-[5px] h-[5px] bg-black rounded-full'></div>}
                        </button>
                        {cartCount > 0 && (
                            <span className={`absolute -top-[6px] -right-[6px] w-[18px] h-[18px] bg-black text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white transition-all ${location.pathname === '/cart' ? 'scale-110 -translate-y-1 -right-[8px]' : ''}`}>
                                {cartCount}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default Nav

import React, { useState, useContext, useEffect } from 'react'
import { IoEyeOutline, IoEye, IoClose } from "react-icons/io5";
import { authDataContext } from '../context/authContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { toast } from 'react-toastify';
import Loading from './Loading';
import Logo from '../assets/shopX.png'
import google from '../assets/google.png'

function LoginModal({ onClose, defaultMode = "login" }) {
    let [show, setShow] = useState(false)
    let [mode, setMode] = useState(defaultMode) // "login" | "signup"

    // Login fields
    let [loginEmail, setLoginEmail] = useState("")
    let [loginPassword, setLoginPassword] = useState("")

    // Signup fields
    let [name, setName] = useState("")
    let [signupEmail, setSignupEmail] = useState("")
    let [signupPassword, setSignupPassword] = useState("")

    let { serverUrl } = useContext(authDataContext)
    let { getCurrentUser } = useContext(userDataContext)
    let [loading, setLoading] = useState(false)

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [onClose])

    // Switch mode — reset fields & show state
    const switchMode = (newMode) => {
        setMode(newMode)
        setShow(false)
        setLoginEmail(""); setLoginPassword("")
        setName(""); setSignupEmail(""); setSignupPassword("")
    }

    // --- LOGIN ---
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!loginEmail || !loginPassword) {
            toast.error("Email aur password zaroori hain")
            setLoading(false); return
        }
        try {
            await axios.post(serverUrl + '/api/auth/login', { email: loginEmail, password: loginPassword }, { withCredentials: true })
            toast.success("Login successful! 🎉")
            getCurrentUser()
            onClose()
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed")
        }
        setLoading(false)
    }

    // --- SIGNUP ---
    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!name || !signupEmail || !signupPassword) {
            toast.error("Saare fields zaroori hain")
            setLoading(false); return
        }
        if (signupPassword.length < 8) {
            toast.error("Password kam se kam 8 characters ka hona chahiye")
            setLoading(false); return
        }
        try {
            await axios.post(serverUrl + '/api/auth/registration', { name, email: signupEmail, password: signupPassword }, { withCredentials: true })
            toast.success("Account ban gaya! 🎉")
            getCurrentUser()
            onClose()
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed")
        }
        setLoading(false)
    }

    // --- GOOGLE ---
    const googleAuth = async () => {
        setLoading(true)
        try {
            const response = await signInWithPopup(auth, provider)
            let user = response.user
            await axios.post(serverUrl + "/api/auth/googlelogin",
                { name: user.displayName, email: user.email },
                { withCredentials: true }
            )
            toast.success("Google Login Successful 🎉")
            getCurrentUser()
            onClose()
        } catch (error) {
            toast.error("Google Login Failed")
        }
        setLoading(false)
    }

    const isLogin = mode === "login"

    return (
        <div
            className='fixed inset-0 z-[999] flex items-center justify-center'
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div
                className='relative w-[92%] max-w-[440px] rounded-2xl overflow-hidden shadow-2xl bg-white'
                style={{ border: '1px solid #e5e7eb', animation: 'modalIn 0.25s ease' }}
            >
                <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.93) translateY(18px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0); }
                    }
                `}</style>

                {/* Close */}
                <button
                    onClick={onClose}
                    className='absolute top-[14px] right-[14px] w-[32px] h-[32px] rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10'
                >
                    <IoClose size={20} />
                </button>

                {/* Header */}
                <div className='flex flex-col items-center pt-[28px] pb-[4px] gap-[5px]'>
                    <img src={Logo} alt="ShopX" className='w-[42px]' />
                    <h2 className='text-gray-900 text-[21px] font-bold tracking-tight'>
                        {isLogin ? "Welcome to ShopX" : "Create Your Account"}
                    </h2>
                    <p className='text-gray-500 text-[13px]'>
                        {isLogin ? "Login to continue shopping" : "ShopX pe signup karo, shopping enjoy karo"}
                    </p>
                </div>

                {/* Tab toggle */}
                <div className='flex mx-[28px] mt-[18px] mb-[4px] rounded-xl overflow-hidden border border-gray-200'>
                    <button
                        onClick={() => switchMode("login")}
                        className={`flex-1 py-[9px] text-[13px] font-semibold transition-all ${isLogin ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchMode("signup")}
                        className={`flex-1 py-[9px] text-[13px] font-semibold transition-all ${!isLogin ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                        Create Account
                    </button>
                </div>

                <div className='px-[28px] pb-[26px] pt-[16px]'>
                    {/* Google */}
                    <button
                        type='button'
                        onClick={googleAuth}
                        className='w-full h-[44px] rounded-xl flex items-center justify-center gap-[10px] text-gray-700 text-[14px] font-medium mb-[16px] transition-all hover:bg-gray-100 bg-gray-50'
                        style={{ border: '1px solid #e5e7eb' }}
                    >
                        <img src={google} alt="" className='w-[18px]' />
                        {isLogin ? "Continue with Google" : "Sign up with Google"}
                    </button>

                    {/* Divider */}
                    <div className='flex items-center gap-[10px] mb-[16px]'>
                        <div className='flex-1 h-[1px] bg-gray-200'></div>
                        <span className='text-gray-400 text-[12px]'>OR</span>
                        <div className='flex-1 h-[1px] bg-gray-200'></div>
                    </div>

                    {/* LOGIN FORM */}
                    {isLogin && (
                        <form onSubmit={handleLogin} className='flex flex-col gap-[12px]'>
                            <input
                                type="email"
                                placeholder='Email address'
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className='w-full h-[46px] rounded-xl px-[16px] text-gray-800 text-[14px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50'
                                style={{ border: '1px solid #e5e7eb' }}
                                required
                            />
                            <div className='relative'>
                                <input
                                    type={show ? "text" : "password"}
                                    placeholder='Password'
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className='w-full h-[46px] rounded-xl px-[16px] pr-[46px] text-gray-800 text-[14px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50'
                                    style={{ border: '1px solid #e5e7eb' }}
                                    required
                                />
                                <button type='button' onClick={() => setShow(p => !p)}
                                    className='absolute right-[14px] top-[50%] translate-y-[-50%] text-gray-400 hover:text-gray-700'>
                                    {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
                                </button>
                            </div>
                            <button type='submit'
                                className='w-full h-[46px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center mt-[2px] bg-black hover:bg-gray-800 transition-all'>
                                {loading ? <Loading /> : "Login"}
                            </button>
                        </form>
                    )}

                    {/* SIGNUP FORM */}
                    {!isLogin && (
                        <form onSubmit={handleSignup} className='flex flex-col gap-[12px]'>
                            <input
                                type="text"
                                placeholder='Full Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='w-full h-[46px] rounded-xl px-[16px] text-gray-800 text-[14px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50'
                                style={{ border: '1px solid #e5e7eb' }}
                                required
                            />
                            <input
                                type="email"
                                placeholder='Email address'
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className='w-full h-[46px] rounded-xl px-[16px] text-gray-800 text-[14px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50'
                                style={{ border: '1px solid #e5e7eb' }}
                                required
                            />
                            <div className='relative'>
                                <input
                                    type={show ? "text" : "password"}
                                    placeholder='Password (min. 8 characters)'
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    className='w-full h-[46px] rounded-xl px-[16px] pr-[46px] text-gray-800 text-[14px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50'
                                    style={{ border: '1px solid #e5e7eb' }}
                                    required
                                />
                                <button type='button' onClick={() => setShow(p => !p)}
                                    className='absolute right-[14px] top-[50%] translate-y-[-50%] text-gray-400 hover:text-gray-700'>
                                    {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
                                </button>
                            </div>
                            <button type='submit'
                                className='w-full h-[46px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center mt-[2px] bg-black hover:bg-gray-800 transition-all'>
                                {loading ? <Loading /> : "Create Account"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LoginModal

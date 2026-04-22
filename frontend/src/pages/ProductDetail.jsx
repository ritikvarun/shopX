import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { FaStar, FaStarHalfAlt } from "react-icons/fa"
import { MdLocalShipping, MdAssignmentReturn } from "react-icons/md"
import { RiShieldCheckLine } from "react-icons/ri"
import RelatedProduct from '../component/RelatedProduct'
import Loading from '../component/Loading'
import Footer from '../component/Footer'

import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function ProductDetail() {
    let { productId } = useParams()
    let { serverUrl } = useContext(authDataContext)
    let { products, currency, addtoCart, loading } = useContext(shopDataContext)
    let [productData, setProductData] = useState(false)
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [myRating, setMyRating] = useState(5)
    const [myComment, setMyComment] = useState('')
    const [image, setImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    const [size, setSize] = useState('')
    const [activeTab, setActiveTab] = useState('description')

    const fetchProductData = () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item)
                setImage1(item.image1); setImage2(item.image2)
                setImage3(item.image3); setImage4(item.image4)
                setImage(item.image1)
            }
        })
    }

    const fetchReviews = async () => {
        try {
            const res = await axios.get(serverUrl + "/api/review/" + productId)
            setReviews(res.data.reviews)
            setAverageRating(res.data.averageRating)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { 
        fetchProductData()
        fetchReviews()
    }, [productId, products])

    const submitReview = async (e) => {
        e.preventDefault()
        try {
            await axios.post(serverUrl + "/api/review/add", {
                productId,
                rating: myRating,
                comment: myComment
            }, { withCredentials: true })
            toast.success("Review submitted properly!")
            setMyComment('')
            fetchReviews()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review")
        }
    }

    if (!productData) return <div className='opacity-0' />

    const thumbnails = [image1, image2, image3, image4]

    return (
        <div className='min-h-screen bg-white pt-[60px] pb-[100px] md:pt-[90px] md:pb-0'>
            <div className='max-w-[1200px] mx-auto px-[20px] md:px-[24px] py-[20px] md:py-[40px]'>

                {/* Top: Images + Details */}
                <div className='flex flex-col lg:flex-row gap-[32px] md:gap-[48px]'>

                    {/* ── Image Gallery ── */}
                    <div className='lg:w-[55%] flex flex-col-reverse lg:flex-row gap-[14px] -mx-[20px] md:mx-0'>
                        {/* Thumbnails */}
                        <div className='flex lg:flex-col gap-[10px] overflow-x-auto lg:overflow-visible px-[20px] md:px-0 no-scrollbar'>
                            {thumbnails.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImage(img)}
                                    className={`flex-shrink-0 w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-[16px] overflow-hidden border-2 transition-all active:scale-95
                                        ${image === img ? 'border-black' : 'border-transparent hover:border-gray-400'}`}
                                >
                                    <img src={img} alt="" className='w-full h-full object-cover' />
                                </button>
                            ))}
                        </div>
                        {/* Main image */}
                        <div className='flex-1 md:rounded-3xl overflow-hidden bg-gray-50 border-b md:border border-gray-100'>
                            <img
                                src={image}
                                alt={productData.name}
                                className='w-full h-[480px] md:h-[520px] object-cover'
                                style={{ transition: 'opacity 0.2s' }}
                            />
                        </div>
                    </div>

                    {/* ── Product Info ── */}
                    <div className='lg:w-[45%] flex flex-col gap-[20px]'>
                        {/* Category badge */}
                        <span className='w-fit text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100/80 px-[14px] py-[6px] rounded-full'>
                            {productData.category}
                        </span>

                        {/* Name */}
                        <h1 className='text-[28px] md:text-[34px] font-black text-gray-900 leading-[1.1] tracking-tight'>
                            {productData.name}
                        </h1>

                        {/* Stars */}
                        <div className='flex items-center gap-[8px]'>
                            <div className='flex'>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`text-[16px] ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <span className='text-gray-400 text-[13px]'>({reviews.length} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className='flex items-baseline gap-[8px]'>
                            <span className='text-[30px] font-bold text-gray-900'>{currency} {productData.price}</span>
                        </div>

                        {/* Description */}
                        <p className='text-gray-500 text-[14px] leading-relaxed border-t border-gray-100 pt-[16px]'>
                            {productData.description}
                        </p>

                        {/* Size selector */}
                        <div>
                            <p className='text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-[10px]'>Select Size</p>
                            <div className='flex flex-wrap gap-[8px]'>
                                {productData.sizes.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSize(s)}
                                        className={`w-[52px] h-[46px] rounded-xl text-[14px] font-semibold border-2 transition-all
                                            ${s === size ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add to cart */}
                        <button
                            onClick={() => addtoCart(productData._id, size)}
                            disabled={!size || loading}
                            className='w-full h-[52px] rounded-xl bg-black text-white font-semibold text-[15px] flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-[4px]'
                        >
                            {loading ? <Loading /> : size ? 'Add to Cart' : 'Select a Size'}
                        </button>

                        {/* Trust badges */}
                        <div className='grid grid-cols-3 gap-[12px] border-t border-gray-100 pt-[20px]'>
                            {[
                                { icon: <RiShieldCheckLine className='w-[18px] h-[18px]' />, label: '100% Original' },
                                { icon: <MdLocalShipping className='w-[18px] h-[18px]' />, label: 'Cash on Delivery' },
                                { icon: <MdAssignmentReturn className='w-[18px] h-[18px]' />, label: '7-Day Returns' },
                            ].map((b, i) => (
                                <div key={i} className='flex flex-col items-center gap-[6px] text-center bg-gray-50 rounded-xl p-[12px]'>
                                    <div className='text-gray-700'>{b.icon}</div>
                                    <span className='text-[11px] font-semibold text-gray-500'>{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tabs: Description / Reviews ── */}
                <div className='mt-[60px]'>
                    <div className='flex gap-0 border-b border-gray-200 mb-[24px]'>
                        {['description', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-[24px] py-[12px] text-[14px] font-semibold capitalize transition-all border-b-2
                                    ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                            >
                                {tab === 'reviews' ? `Reviews (${reviews.length})` : 'Description'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' && (
                        <div className='bg-gray-50 rounded-2xl border border-gray-200 p-[28px]'>
                            <p className='text-gray-600 text-[14px] leading-relaxed'>
                                Upgrade your wardrobe with this stylish slim-fit cotton shirt. Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style. Easy to maintain and perfect for any occasion — a must-have essential for those who value both fashion and function.
                            </p>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className='flex flex-col md:flex-row gap-[40px]'>
                            {/* Reviews List */}
                            <div className='md:w-1/2 flex flex-col gap-[16px]'>
                                {reviews.length === 0 ? (
                                    <div className='bg-gray-50 rounded-2xl border border-gray-200 p-[28px] text-gray-400 text-[14px] text-center'>
                                        No reviews yet. Be the first to review this product!
                                    </div>
                                ) : (
                                    reviews.map((r, i) => (
                                        <div key={i} className='bg-white rounded-xl border border-gray-200 p-[20px] shadow-sm'>
                                            <div className='flex items-center justify-between mb-[10px]'>
                                                <span className='font-bold text-gray-800 text-[14px]'>{r.userId?.name || "Verified Buyer"}</span>
                                                <div className='flex'>
                                                    {[...Array(5)].map((_, idx) => (
                                                        <FaStar key={idx} className={`text-[12px] ${idx < r.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className='text-gray-600 text-[13px]'>{r.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Review Form */}
                            <div className='md:w-1/2 bg-gray-50 rounded-2xl border border-gray-200 p-[28px]'>
                                <h3 className='text-[16px] font-bold text-gray-900 mb-[16px]'>Write a Review</h3>
                                <form onSubmit={submitReview} className='flex flex-col gap-[16px]'>
                                    <div>
                                        <label className='text-[13px] font-semibold text-gray-700 block mb-[8px]'>Rating out of 5</label>
                                        <div className='flex gap-[8px]'>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <FaStar 
                                                    key={star} 
                                                    onClick={() => setMyRating(star)}
                                                    className={`cursor-pointer text-[24px] ${star <= myRating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-[13px] font-semibold text-gray-700 block mb-[8px]'>Your Experience</label>
                                        <textarea 
                                            required
                                            value={myComment} 
                                            onChange={(e) => setMyComment(e.target.value)}
                                            placeholder='Tell others what you think about this product...'
                                            className='w-full h-[100px] rounded-xl border border-gray-200 p-[14px] text-[14px] resize-none focus:outline-none focus:border-black'
                                        />
                                    </div>
                                    <button type='submit' className='bg-black text-white rounded-xl py-[12px] font-semibold text-[14px] hover:bg-gray-800'>
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Related Products ── */}
                <RelatedProduct
                    category={productData.category}
                    subCategory={productData.subCategory}
                    currentProductId={productData._id}
                />
            </div>

            <Footer />

            {/* ── Sticky Mobile Buy Bar ── */}
            <div className='fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-t border-gray-200 px-[20px] py-[16px] pb-[34px] flex items-center justify-between md:hidden z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'>
                <div className='flex flex-col'>
                    <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-[2px] leading-none'>Total Price</span>
                    <span className='text-[22px] font-black text-gray-900 leading-none'>{currency} {productData.price}</span>
                </div>
                <button
                    onClick={() => addtoCart(productData._id, size)}
                    disabled={!size || loading}
                    className='h-[50px] bg-black text-white px-[32px] rounded-full font-bold text-[14px] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.2)]'
                >
                    {loading ? <Loading /> : size ? 'Add to Cart' : 'Select Size'}
                </button>
            </div>
        </div>
    )
}

export default ProductDetail

import React, { useContext, useEffect, useState } from 'react'
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi"
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import Card from '../component/Card'
import Footer from '../component/Footer'

const CATEGORIES = ['Men', 'Women', 'Kids', 'Unisex']
const SUB_CATEGORIES = ['TopWear', 'BottomWear', 'WinterWear', 'Shoes', 'Accessories']

function Collections() {
    const [showFilter, setShowFilter] = useState(false)
    const { products, search, showSearch } = useContext(shopDataContext)
    const [filterProduct, setFilterProduct] = useState([])
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [sortType, setSortType] = useState("relevant")

    const toggleCategory = (val) => {
        setCategory(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])
    }
    const toggleSubCategory = (val) => {
        setSubCategory(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])
    }

    const applyFilter = () => {
        let copy = products.slice()
        if (showSearch && search) copy = copy.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        if (category.length > 0) copy = copy.filter(i => category.includes(i.category))
        if (subCategory.length > 0) copy = copy.filter(i => subCategory.includes(i.subCategory))
        setFilterProduct(copy)
    }

    const sortProducts = () => {
        let copy = filterProduct.slice()
        if (sortType === 'low-high') setFilterProduct(copy.sort((a, b) => a.price - b.price))
        else if (sortType === 'high-low') setFilterProduct(copy.sort((a, b) => b.price - a.price))
        else applyFilter()
    }

    useEffect(() => { sortProducts() }, [sortType])
    useEffect(() => { setFilterProduct(products) }, [products])
    useEffect(() => { applyFilter() }, [category, subCategory, search, showSearch])

    const FilterPanel = () => (
        <div className='flex flex-col gap-[20px]'>
            {/* Category */}
            <div>
                <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-[10px]'>Category</p>
                <div className='flex flex-col gap-[8px]'>
                    {CATEGORIES.map(cat => (
                        <label key={cat} className='flex items-center gap-[10px] cursor-pointer'>
                            <input
                                type="checkbox"
                                checked={category.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                                className='w-[16px] h-[16px] accent-black cursor-pointer'
                            />
                            <span className='text-[14px] text-gray-700 select-none'>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sub category */}
            <div>
                <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-[10px]'>Sub-Category</p>
                <div className='flex flex-col gap-[8px]'>
                    {SUB_CATEGORIES.map(sub => (
                        <label key={sub} className='flex items-center gap-[10px] cursor-pointer'>
                            <input
                                type="checkbox"
                                checked={subCategory.includes(sub)}
                                onChange={() => toggleSubCategory(sub)}
                                className='w-[16px] h-[16px] accent-black cursor-pointer'
                            />
                            <span className='text-[14px] text-gray-700 select-none'>{sub}</span>
                        </label>
                    ))}
                </div>
            </div>

            {(category.length > 0 || subCategory.length > 0) && (
                <button
                    onClick={() => { setCategory([]); setSubCategory([]) }}
                    className='text-[12px] font-semibold text-red-500 hover:underline text-left'
                >
                    Clear all filters
                </button>
            )}
        </div>
    )

    return (
        <div className='w-full min-h-screen bg-gray-50 pt-[70px] pb-[100px]'>

            {/* ── Mobile: filter bar ── */}
            <div className='lg:hidden flex items-center justify-between px-[16px] py-[12px] bg-white border-b border-gray-200 sticky top-[70px] z-[20]'>
                <span className='text-[13px] font-bold text-gray-700 uppercase tracking-wide'>
                    {filterProduct.length} Products
                </span>
                <button
                    onClick={() => setShowFilter(p => !p)}
                    className='flex items-center gap-[6px] text-[13px] font-semibold bg-gray-100 text-gray-700 px-[14px] py-[7px] rounded-full'
                >
                    {showFilter ? <FiX size={14} /> : <FiFilter size={14} />}
                    {showFilter ? 'Close' : 'Filter'}
                </button>
            </div>

            {/* ── Mobile: filter dropdown panel ── */}
            {showFilter && (
                <div className='lg:hidden bg-white border-b border-gray-200 px-[20px] py-[20px]'>
                    <FilterPanel />
                </div>
            )}

            {/* ── Main layout (desktop: sidebar + grid) ── */}
            <div className='max-w-[1300px] mx-auto px-[16px] md:px-[24px]'>
                <div className='flex gap-[28px] items-start'>

                    {/* Desktop Sidebar */}
                    <aside className='hidden lg:block w-[220px] flex-shrink-0 sticky top-[86px] bg-white rounded-2xl border border-gray-200 shadow-sm p-[24px] mt-[24px]'>
                        <p className='text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-[20px]'>Filters</p>
                        <FilterPanel />
                    </aside>

                    {/* Product grid */}
                    <div className='flex-1 min-w-0 mt-[24px]'>

                        {/* Sort header */}
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px] mb-[20px]'>
                            <div>
                                <Title text1={"ALL"} text2={"COLLECTIONS"} color='text-gray-800' color2='text-black' />
                                <p className='text-[13px] text-gray-400 -mt-2 hidden lg:block'>{filterProduct.length} products</p>
                            </div>
                            <div className='relative w-full sm:w-auto'>
                                <select
                                    className='w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-xl px-[14px] py-[9px] pr-[32px] text-[13px] font-medium text-gray-700 outline-none cursor-pointer shadow-sm hover:border-gray-400 transition-all'
                                    onChange={(e) => setSortType(e.target.value)}
                                >
                                    <option value="relevant">Sort: Relevant</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>
                                <FiChevronDown className='absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={14} />
                            </div>
                        </div>

                        {/* Grid */}
                        {filterProduct.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-[80px] text-gray-400 bg-white rounded-2xl border border-gray-200'>
                                <p className='text-[15px] font-medium'>No products found</p>
                                <p className='text-[13px] mt-[4px]'>Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] md:gap-[18px] justify-items-center'>
                                {filterProduct.map((item, index) => (
                                    <Card key={index} id={item._id} name={item.name} price={item.price} image={item.image1} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Collections
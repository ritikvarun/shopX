import { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'

export function ProductCardSkeleton() {
    return (
        <div aria-hidden='true' className='w-full h-full rounded-2xl overflow-hidden border border-gray-100 bg-white'>
            <div className='aspect-[3/4] bg-gray-200 motion-safe:animate-pulse' />
            <div className='p-[14px] flex flex-col items-center gap-[8px] motion-safe:animate-pulse'>
                <div className='h-[16px] w-4/5 rounded bg-gray-200' />
                <div className='h-[16px] w-3/5 rounded bg-gray-200' />
                <div className='h-[14px] w-1/3 rounded bg-gray-200' />
            </div>
        </div>
    )
}

export default function ProductLoadingState({ horizontal = false, detail = false }) {
    const { productsError, getProducts } = useContext(shopDataContext)

    if (productsError) {
        return (
            <div role='alert' className='w-full py-[60px] px-[20px] text-center rounded-2xl border border-gray-200 bg-white'>
                <p className='text-gray-600 text-[14px]'>{productsError}</p>
                <button onClick={getProducts} className='mt-[16px] rounded-xl bg-black text-white px-[24px] py-[10px] text-[14px] font-semibold'>Try again</button>
            </div>
        )
    }

    return (
        <div role='status' aria-label='Loading products' aria-busy='true'>
            <span className='sr-only'>Loading products...</span>
            {detail ? (
                <div aria-hidden='true' className='flex flex-col lg:flex-row gap-[32px] md:gap-[48px] motion-safe:animate-pulse'>
                    <div className='lg:w-[55%] h-[480px] md:h-[520px] rounded-3xl bg-gray-200' />
                    <div className='lg:w-[45%] flex flex-col gap-[24px]'>
                        <div className='h-[24px] w-1/4 rounded-full bg-gray-200' />
                        <div className='h-[40px] w-4/5 rounded bg-gray-200' />
                        <div className='h-[20px] w-1/3 rounded bg-gray-200' />
                        <div className='h-[36px] w-1/3 rounded bg-gray-200' />
                        <div className='h-[80px] w-full rounded-xl bg-gray-200' />
                        <div className='flex gap-[8px]'>
                            {Array.from({ length: 4 }, (_, i) => <div key={i} className='w-[52px] h-[46px] rounded-xl bg-gray-200' />)}
                        </div>
                        <div className='h-[52px] w-full rounded-xl bg-gray-200' />
                    </div>
                </div>
            ) : (
                <div className={horizontal
                    ? 'grid grid-rows-2 grid-flow-col auto-cols-max overflow-x-auto gap-[20px] pb-[20px] no-scrollbar'
                    : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] md:gap-[18px]'}>
                    {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className={horizontal ? 'w-[160px] sm:w-[200px] lg:w-[260px]' : 'w-full'}>
                            <ProductCardSkeleton />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

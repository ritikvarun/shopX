import React from 'react'

function NewLetterBox() {
    return (
        <section className='w-full bg-black py-[70px] px-[20px]'>
            <div className='max-w-[620px] mx-auto flex flex-col items-center text-center gap-[14px]'>
                <span className='text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-white/10 px-[14px] py-[5px] rounded-full'>Newsletter</span>
                <h2 className='text-white font-bold text-[26px] md:text-[34px] leading-tight'>
                    Subscribe & Get <span className='text-gray-300'>20% Off</span>
                </h2>
                <p className='text-gray-400 text-[14px]'>
                    Exclusive savings, special deals, and early access to new collections — straight to your inbox.
                </p>
                <form
                    className='flex w-full max-w-[500px] mt-[10px] gap-0 rounded-full overflow-hidden border border-white/10'
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="email"
                        placeholder='Enter your email address'
                        className='flex-1 h-[50px] bg-white/10 text-white placeholder-gray-500 px-[20px] text-[14px] outline-none'
                        required
                    />
                    <button
                        type='submit'
                        className='h-[50px] px-[24px] bg-white text-black font-semibold text-[14px] hover:bg-gray-100 transition-all whitespace-nowrap'
                    >
                        Subscribe
                    </button>
                </form>
                <p className='text-gray-600 text-[12px]'>No spam. Unsubscribe anytime.</p>
            </div>
        </section>
    )
}

export default NewLetterBox

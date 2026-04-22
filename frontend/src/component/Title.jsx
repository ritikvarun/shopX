import React from 'react'

function Title({ text1, text2, color = 'text-gray-800', color2 = 'text-black' }) {
  return (
    <div className='flex flex-col items-center mb-6'>
      <div className='inline-flex gap-2 items-center text-center text-[28px] md:text-[36px] font-bold tracking-tight'>
        <p className={color}>{text1} <span className={color2}>{text2}</span></p>
      </div>
      <div className='w-[60px] h-[3px] bg-black rounded-full mt-[8px]'></div>
    </div>
  )
}

export default Title

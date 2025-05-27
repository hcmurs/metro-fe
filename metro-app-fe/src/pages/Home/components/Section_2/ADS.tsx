import React from 'react'

export default function ADS() {
    return (
        <div className='flex flex-col gap-15'>
            <div className='text-5xl text-slate-800'>
                Ads Services
            </div>
            <div className='flex flex-col'>
                <p>
                    "Metro HCMR – di chuyển nhanh, không kẹt xe.
                </p>
                <p>
                    An toàn, tiết kiệm, kết nối thành phố thông minh."
                </p>
            </div>
            <div>
                <button className='bg-slate-800 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-[#0097a7] transition-colors duration-300'>
                    Read more
                </button>
            </div>
        </div>
    )
}

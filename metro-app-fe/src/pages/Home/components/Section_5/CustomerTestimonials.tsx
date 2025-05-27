// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';

// const testimonials = [
//     {
//         id: 1,
//         name: 'CONTENT',
//         role: 'And web page',
//         message:
//             "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
//         image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
//     },
//     {
//         id: 2,
//         name: 'CONTENT',
//         role: 'And web page',
//         message:
//             "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
//         image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
//     },
//     {
//         id: 3,
//         name: 'CONTENT',
//         role: 'And web page',
//         message:
//             "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
//         image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
//     }, {
//         id: 4,
//         name: 'CONTENT',
//         role: 'And web page',
//         message:
//             "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
//         image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
//     },


//     // Add more testimonial objects here if needed
// ];

// export default function CustomerTestimonials() {
//     return (
//         <div className="w-full py-20 px-5 lg:px-20 relative">
//             <h2 className="text-center text-5xl font-bold mb-10">WHAT IS SAYS OUR CUSTOMERS</h2>
//             <div className='bg-[#E0FDFD] h-95 w-80 absolute top-39 left-60 -z-10 pl-6'>
//                 <div className='h-85 border-l-2 absolute top-5'>

//                 </div>
//             </div>
//             <div className="relative">
//                 <Swiper
//                     modules={[Pagination]}
//                     pagination={{
//                         clickable: true,
//                         type: 'bullets',
//                     }}
//                     spaceBetween={30}
//                     slidesPerView={1}
//                     className='w-250'
//                 >
//                     {testimonials.map((item) => (
//                         <SwiperSlide key={item.id} className='p-5'>
//                             <div className="bg-white rounded-lg shadow-[0_5px_20px_rgba(0,0,0,0.3)] p-8 lg:p-12 w-242">
//                                 <p className="text-gray-800 mb-8 leading-relaxed">{item.message}</p>
//                                 <div className="flex items-center gap-6">
//                                     <img
//                                         src={item.image}
//                                         alt={item.name}
//                                         className="w-20 h-20 object-cover rounded shadow"
//                                     />
//                                     <div>
//                                         <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
//                                         <p className="text-teal-500 text-sm">{item.role}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </div>
//     );
// }
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { EffectCards } from 'swiper/modules';
import 'swiper/css/effect-cards';


const testimonials = [
    {
        id: 1,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    },
    {
        id: 2,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    },
    {
        id: 3,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    }, {
        id: 4,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    },


    // Add more testimonial objects here if needed
];

export default function CustomerTestimonials() {
    return (
        <div className="w-full py-20 px-5 lg:px-20 relative">
            <h2 className="text-center text-5xl font-bold mb-10">WHAT IS SAYS OUR CUSTOMERS</h2>
            <div className='bg-[#E0FDFD] h-95 w-80 absolute top-39 left-60 -z-10 pl-6'>
                <div className='h-85 border-l-2 absolute top-5'>

                </div>
            </div>
            <div className="relative">
                <Swiper
                    modules={[EffectCards]}
                    effect="cards"
                    grabCursor={true}
                    className="w-250 max-w-full"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id} className='p-5'>
                            <div className="bg-white rounded-2xl p-8 lg:p-12 w-242 shadow-[5px_5px_10px_rgba(0,0,0,0.2)]">
                                <p className="text-gray-800 mb-8 leading-relaxed">{item.message}</p>
                                <div className="flex items-center gap-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded shadow"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                                        <p className="text-teal-500 text-sm">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

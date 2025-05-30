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


];

export default function CustomerTestimonials() {
    return (
        <div className="w-full py-10 xs:py-14 sm:py-20 px-4 sm:px-8 lg:px-20 relative">
            <h2 className="text-center text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold mb-10">
                WHAT IS SAYS OUR CUSTOMERS
            </h2>

            <div className="bg-[#E0FDFD] h-[380px] w-[300px] absolute top-10 left-10 md:top-20 md:left-40 -z-10 hidden md:block">
                <div className="h-[85%] absolute top-5 left-6"></div>
            </div>

            <div className="relative flex justify-center">
                <Swiper
                    modules={[EffectCards]}
                    effect="cards"
                    grabCursor={true}
                    className="w-[90%] sm:w-[80%] md:w-[600px] lg:w-[700px] xl:w-[900px]"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id} className="p-2">
                            <div className="bg-white rounded-2xl p-5 xs:p-6 md:p-8 lg:p-10 shadow-[5px_5px_10px_rgba(0,0,0,0.2)]">
                                <p className="text-gray-800 mb-6 leading-relaxed text-sm xs:text-base md:text-lg">
                                    {item.message}
                                </p>
                                <div className="flex items-center gap-4 mt-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 xs:w-20 xs:h-20 object-cover rounded shadow"
                                    />
                                    <div>
                                        <h3 className="font-bold text-base xs:text-lg text-slate-900">
                                            {item.name}
                                        </h3>
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

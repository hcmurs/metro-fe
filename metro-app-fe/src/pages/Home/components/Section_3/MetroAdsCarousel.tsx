import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const metroBlogs = [
    {
        id: 1,
        title: 'How Metro Systems Improve Urban Life',
        description: 'Discover how subways reduce traffic and pollution in modern cities.',
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    },
    {
        id: 2,
        title: 'Top 5 Metro Stations with Stunning Architecture',
        description: 'A visual tour of the world’s most beautiful underground stations.',
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    },
    {
        id: 3,
        title: 'Metro Etiquette: What You Should and Shouldn’t Do',
        description: 'Tips for respectful and smooth metro travel.',
        image: 'https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg',
    },
];

export default function MetroBlogCarousel() {
    return (
        <div className="">
            <h2 className="text-center text-3xl font-bold mb-8">LATEST METRO BLOGS</h2>
            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={30}
                slidesPerView={3}
                className="px-10"
                breakpoints={{
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {metroBlogs.map((blog, index) => (
                    <SwiperSlide key={blog.id} className='pb-10'>
                        <div className="flex flex-col h-full bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden pb-10">
                            <div className="relative">
                                <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
                                <span className="absolute top-0 left-0 bg-slate-700 text-white text-sm px-3 py-1 font-bold">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="flex flex-col flex-grow justify-between p-4 gap-5">
                                <div className='h-20'>
                                    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                                    <p className="text-gray-600 text-sm">{blog.description}</p>
                                </div>
                                <div className="mt-4 text-center">
                                    <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-cyan-600">
                                        Read Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                ))}
            </Swiper>
        </div>
    );
}

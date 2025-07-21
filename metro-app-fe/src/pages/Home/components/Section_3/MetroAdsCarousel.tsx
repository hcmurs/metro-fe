import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import useBlogs from '../../../../queries/useBlogs';
import { useNavigate } from 'react-router-dom';

export default function MetroBlogCarousel() {
    const { data, isLoading, error } = useBlogs(0, 30);
    const nav = useNavigate();

    const handleBlogDetail = (id: number) => {
        nav(`/blogs/${id}`);
    };

    const SkeletonCard = () => (
        <div className="animate-pulse flex flex-col h-full bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden pb-10">
            <div className="bg-gray-300 w-full h-64" />
            <div className="flex flex-col flex-grow justify-between p-4 gap-4">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="mt-4 w-1/2 h-10 bg-gray-300 rounded mx-auto" />
            </div>
        </div>
    );

    return (
        <div className="">
            <h2 className="text-center text-3xl font-bold mb-8">BLOG MỚI TRONG METRO</h2>
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
                {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <SwiperSlide key={idx} className="pb-10">
                            <SkeletonCard />
                        </SwiperSlide>
                    ))
                    : data?.content?.map((blog, index) => (
                        <SwiperSlide key={blog.id} className="pb-10">
                            <div className="flex flex-col h-full bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden pb-10">
                                <div className="relative">
                                    <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
                                    <span className="absolute top-0 left-0 bg-slate-700 text-white text-sm px-3 py-1 font-bold">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex flex-col flex-grow justify-between p-4 gap-4">
                                    <div className="h-24">
                                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 px-2">
                                        <span>{blog.readTime}</span>
                                        <span>{blog.comments} bình luận</span>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button onClick={() => handleBlogDetail(blog.id)} className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded hover:bg-cyan-600">
                                            Đọc ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
            {!isLoading && error && (
                <p className="text-center text-red-500 mt-6">Error loading blogs. Please try again.</p>
            )}
        </div>
    );
}

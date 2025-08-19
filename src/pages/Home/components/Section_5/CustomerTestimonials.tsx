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
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
    },
    {
        id: 2,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
    },
    {
        id: 3,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
    }, {
        id: 4,
        name: 'CONTENT',
        role: 'And web page',
        message:
            "has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors",
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
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

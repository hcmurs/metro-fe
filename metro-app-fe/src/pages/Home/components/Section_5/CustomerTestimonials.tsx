import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { EffectCards } from 'swiper/modules';
import 'swiper/css/effect-cards';


const testimonials = [
     {
    id: 1,
    name: 'BẢN ĐỒ TUYẾN',
    role: 'Thông tin tuyến số 1',
    message:
      "Tuyến Metro số 1 nối từ Bến Thành đến Suối Tiên, đi qua nhiều khu vực trung tâm. Đây là tuyến đầu tiên được đưa vào vận hành thử nghiệm và dự kiến sẽ chính thức khai thác vào cuối năm.",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
  },
  {
    id: 2,
    name: 'TRẠM DỪNG CHÍNH',
    role: 'Các trạm trọng điểm',
    message:
      "Các trạm chính trên tuyến bao gồm Bến Thành, Nhà hát Thành Phố, Thảo Điền, và Khu Công nghệ cao. Các trạm được xây dựng hiện đại với hệ thống bảng thông tin điện tử và kiểm soát vé tự động.",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
  },
  {
    id: 3,
    name: 'THỜI GIAN HOẠT ĐỘNG',
    role: 'Lịch trình metro',
    message:
      "Tuyến Metro dự kiến hoạt động từ 5:00 sáng đến 10:00 tối hàng ngày, với tần suất 10 phút/chuyến vào giờ cao điểm và 15 phút/chuyến vào các khung giờ còn lại.",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
  },
  {
    id: 4,
    name: 'GIÁ VÉ VÀ THANH TOÁN',
    role: 'Thông tin giá vé',
    message:
      "Hệ thống metro áp dụng vé điện tử thông minh. Giá vé dao động từ 8.000 đến 15.000 đồng tùy theo quãng đường di chuyển. Người dùng có thể thanh toán qua thẻ NFC hoặc ứng dụng di động.",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSES4eTrtAPwwSze75ZKBkYNMs2nq6efGWgZvuLzfOsbg8qqEms8TULSJUtjkRRXvvvscs&usqp=CAU',
  }


];

export default function CustomerTestimonials() {
    return (
        <div className="w-full py-10 xs:py-14 sm:py-20 px-4 sm:px-8 lg:px-20 relative">
            <h2 className="text-center text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold mb-10">
                KHÁCH HÀNG CỦA CHÚNG TÔI NÓI GÌ
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

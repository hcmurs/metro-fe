import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Bạn thay thế ảnh dưới bằng ảnh thật (import hoặc dùng URL)
const images = [
  "https://png.pngtree.com/png-vector/20191214/ourmid/pngtree-vector-illustration-of-white-metro-train-png-image_2074332.jpg",
  "https://png.pngtree.com/png-vector/20191214/ourmid/pngtree-vector-illustration-of-white-metro-train-png-image_2074332.jpg",
  "https://png.pngtree.com/png-vector/20191214/ourmid/pngtree-vector-illustration-of-white-metro-train-png-image_2074332.jpg",
];

export default function Carousel() {
  return (
    <div className="w-170 mx-auto mt-10">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        className="rounded-md"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-150 object-contain mx-auto"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

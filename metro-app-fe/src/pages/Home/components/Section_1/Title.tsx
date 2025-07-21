import { motion } from "framer-motion";
export default function Title() {
  return (
    <div className="">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col gap-5"
      >
        <div className="xl:text-6xl lg:flex lg:justify-start lg:items-start lg:text-4xl sm:text-6xl text-4xl xl:w-full font-bold text-slate-800 flex flex-col justify-center items-center">
          <p>Metro HCMR</p>
          <p>Trải nghiệm tuyệt vời!</p>
        </div>
        <div className="xl:text-2xl lg:text-xl text-slate-600 lg:flex lg:justify-start lg:items-start flex flex-col justify-center items-center">
          <p>Bắt đầu hành trình thông minh</p>
          <p>Metro HCMR đưa bạn đến đó nhanh hơn.</p>
        </div>
        <div className="flex justify-center lg:justify-start">
          <button className="bg-slate-800 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-[#0097a7] transition-colors duration-300">
            Bắt đầu ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
}

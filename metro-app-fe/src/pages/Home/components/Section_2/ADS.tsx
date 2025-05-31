export default function ADS() {
  return (
    <div className="flex flex-col gap-15 w-full justify-center items-center">
      <div className="text-5xl text-slate-800">Ads Services</div>
      <div className="flex flex-col">
        <p>"Metro HCMR – di chuyển nhanh, không kẹt xe.</p>
        <p>An toàn, tiết kiệm, kết nối thành phố thông minh."</p>
      </div>
      <div>
        <button className="bg-[#cbfffa] text-slate-800 cursor-pointer px-6 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors duration-300">
          READ MORE
        </button>
      </div>
    </div>
  );
}

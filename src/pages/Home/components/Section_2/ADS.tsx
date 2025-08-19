export default function ADS() {
  return (
    <div className="flex flex-col gap-7 w-full lg:h-140 justify-center items-center rounded-2xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.7)] bg-white"
      style={{ fontFamily: '"Century Gothic", sans-serif' }}
    >
      <div className="text-5xl text-slate-800 text-center">Ads Services</div>
      <img className="rounded-2xl " src="https://images2.thanhnien.vn/528068263637045248/2024/4/16/nha-ga-metro-minh-hoa-5-1713255488461498663736.jpg"></img>
      <div className="flex flex-col">
        <p className="lg:text-[20px] lg:text-start text-3xl text-center">Metro HCMR - move quickly, no traffic jams</p>
        <p className="lg:text-[20px] lg:text-start text-3xl text-center">Safe, economical, smart city connection</p>
      </div>
      <div>
        <button className="bg-[#cbfffa] text-slate-800 cursor-pointer px-6 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors duration-300">
          READ MORE
        </button>
      </div>
    </div>
  );
}

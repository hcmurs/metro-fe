export default function AboutUsMetro() {
  return (
    <div className="w-full h-[700px] flex flex-col lg:flex-row items-center justify-between pb-30">
      <div className="lg:w-1/2 w-full mb-10 lg:mb-0 bg-[#e0fdfd] h-full flex flex-col justify-center px-30 items-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-4">ABOUT US</h2>
        <p className="text-gray-700 text-lg mb-8 max-w-md">
          ARE YOU READY FOR THE POSTING YOUR ADS
        </p>
        <div className="flex gap-4">
          <button className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-600">Get Started</button>
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Buy Now</button>
        </div>
      </div>

      <div className="lg:w-1/2 w-full flex justify-center">
        <img
          src="https://inkythuatso.com/uploads/images/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-19.jpg"
          alt="Metro Ad Rating"
          className="max-w-md w-full h-auto"
        />
      </div>
    </div>
  );
}

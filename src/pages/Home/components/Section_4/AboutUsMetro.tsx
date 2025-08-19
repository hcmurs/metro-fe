export default function AboutUsMetro() {
  return (
    <div className="w-full h-[700px] flex flex-col lg:flex-row items-center justify-between pb-10 lg:mb-0 mb-10">
      <div className="lg:w-1/2 w-full mb-10 lg:mb-0 bg-[#D4FCEE] h-full flex flex-col justify-center px-30 py-10 items-center lg:rounded-l-2xl lg:rounded-none rounded-2xl">
        <h2 className="text-5xl font-bold text-slate-900 mb-4 text-center">ABOUT US</h2>
        <p className="text-gray-700 text-lg mb-8 max-w-md text-center">
          Ready to Advertise with Metro HCMR? <br/> Bring your brand to the future of urban mobility.
        </p>
        <div className="flex gap-4">
          <button className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-600">Get Started</button>
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Advertise Now</button>
        </div>
      </div>

      <div className="lg:w-1/2 w-full lg:h-full md:h-120 flex justify-center">
        <img
          src="https://en.vcci.com.vn/hm_content/uploads/247-news/WEB-image-gallery-1-5633-1586768901.jpg"
          alt="Metro Ad Rating"
          className="object-cover lg:rounded-r-2xl lg:rounded-none rounded-2xl"
        />
      </div>
    </div>
  );
}

import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <div className="bg-[#234047] text-white py-16 px-4 sm:px-10 lg:px-20 ">
      <div className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
        HCM METRO
      </div>

      {/* Grid 4 cột */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14 text-sm mb-20">
        <div>
          <h3 className="text-lg font-bold mb-4">Metro Services</h3>
          <ul className="space-y-2">
            <li>Home</li>
            <li>Stations Map</li>
            <li>Fare Calculator</li>
            <li>Buy Tickets</li>
            <li>Timetable</li>
            <li>Support</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Explore Lines</h3>
          <ul className="space-y-2">
            <li>Line 1: Bến Thành – Suối Tiên</li>
            <li>Line 2: Bến Thành – Tham Lương</li>
            <li>Line 3: Tân Kiên – Bến Thành</li>
            <li>Line 4: Thạnh Xuân – Hiệp Phước</li>
            <li>Future Extensions</li>
            <li>Station Guide</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Customer Care</h3>
          <div className="flex items-center gap-3 mb-3">
            <Phone className="bg-white text-[#234047] p-1 rounded-full" size={24} />
            <span>1900 999 888</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="bg-white text-[#234047] p-1 rounded-full" size={24} />
            <span>support@metrohcm.vn</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
          <p className="mb-4">Stay updated on metro news and schedules</p>
          <div className="flex gap-3 flex-wrap">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <div key={i} className="bg-white text-[#234047] w-10 h-10 flex items-center justify-center rounded-full">
                <Icon size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email subscribe */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
        <input
          type="email"
          placeholder="YOUR EMAIL FOR METRO UPDATES"
          className="rounded-full px-6 py-3 w-full md:w-[500px] lg:w-[800px] text-black bg-white"
        />
        <button className="bg-orange-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-orange-700 w-full md:w-auto">
          SUBSCRIBE
        </button>
      </div>

      <p className="text-center text-xs sm:text-sm text-white">
        © 2025 HCM Metro. All Rights Reserved. Operated by Metro Transit Authority
      </p>
    </div>
  );
}

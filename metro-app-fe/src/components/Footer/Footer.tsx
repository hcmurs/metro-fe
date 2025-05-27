import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#234047] text-white py-22 px-5 lg:px-20 h-150">
      <div className="text-center text-4xl font-bold mb-10">HCM METRO</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm mb-20">
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
          <div className="flex gap-3">
            <div className="bg-white text-[#234047] w-10 h-10 flex items-center justify-center rounded-full">
              <Facebook size={20} />
            </div>
            <div className="bg-white text-[#234047] w-10 h-10 flex items-center justify-center rounded-full">
              <Twitter size={20} />
            </div>
            <div className="bg-white text-[#234047] w-10 h-10 flex items-center justify-center rounded-full">
              <Linkedin size={20} />
            </div>
            <div className="bg-white text-[#234047] w-10 h-10 flex items-center justify-center rounded-full">
              <Instagram size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center mt-10 gap-4">
        <input
          type="email"
          placeholder="YOUR EMAIL FOR METRO UPDATES"
          className="rounded-full px-6 py-3 w-full lg:w-[600px] text-white bg-[#234047] border border-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="bg-orange-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-orange-700">
          SUBSCRIBE
        </button>
      </div>

      <p className="text-center text-sm mt-10 text-white">
        © 2025 HCM Metro. All Rights Reserved. Operated by Metro Transit Authority
      </p>
    </footer>
  );
}

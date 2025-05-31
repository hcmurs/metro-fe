import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white relative z-50">
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 py-4">
        <div
          className="text-2xl font-bold text-slate-800 hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          METRO
        </div>

        {/* Menu for large screen */}
        <nav className="hidden lg:flex gap-6 text-sm font-medium text-slate-800">
          <a href="/">HOME</a>
          <a href="#">ABOUT</a>
          <a href="#">PRICING PLANS</a>
          <a href="#">SHOP</a>
          <a href="#">SERVICES</a>
          <a href="news">BLOG</a>
          <a href="#">CONTACT</a>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button className="bg-[#e6fffd] text-slate-800 px-4 py-1 rounded-md text-sm font-semibold">
            BUY NOW
          </button>
          <a href="#" className="text-sm text-slate-800">
            LOGIN
          </a>
          <Search className="w-4 h-4 text-slate-800 cursor-pointer" />
        </div>

        {/* Hamburger menu for mobile */}
        <div className="lg:hidden">
          <button
            className="text-slate-800 text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Dropdown Menu on small screens */}
      {isOpen && (
        <div className="flex flex-col items-start px-8 pb-4 gap-3 lg:hidden animate-fade-down">
          <a href="/" className="text-sm font-medium text-slate-800">
            HOME
          </a>
          <a href="#" className="text-sm font-medium text-slate-800">
            ABOUT
          </a>
          <a href="#" className="text-sm font-medium text-slate-800">
            PRICING PLANS
          </a>
          <a href="#" className="text-sm font-medium text-slate-800">
            SHOP
          </a>
          <a href="#" className="text-sm font-medium text-slate-800">
            SERVICES
          </a>
          <a href="news" className="text-sm font-medium text-slate-800">
            BLOG
          </a>
          <a href="#" className="text-sm font-medium text-slate-800">
            CONTACT
          </a>

          <div className="flex gap-4 items-center pt-2">
            <button className="bg-[#e6fffd] text-slate-800 px-4 py-1 rounded-md text-sm font-semibold">
              BUY NOW
            </button>
            <a href="#" className="text-sm text-slate-800">
              LOGIN
            </a>
            <Search className="w-4 h-4 text-slate-800 cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}

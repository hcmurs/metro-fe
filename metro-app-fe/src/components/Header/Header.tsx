import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-8 py-4 relative z-100 bg-white">
      <div
        className="text-2xl font-bold text-slate-800 hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        METRO
      </div>
      <nav className="flex gap-6 text-sm font-medium text-slate-800">
        <a href="/">HOME</a>
        <a href="#">ABOUT</a>
        <a href="#">PRICING PLANS</a>
        <a href="#">SHOP</a>
        <a href="#">SERVICES</a>
        <a href="news">BLOG</a>
        <a href="#">CONTACT</a>
      </nav>
      <div className="flex items-center gap-4">
        <button className="bg-[#e6fffd] text-slate-800 px-4 py-1 rounded-md text-sm font-semibold">
          BUY NOW
        </button>
        <a href="/login" className="text-sm text-slate-800">
          LOGIN
        </a>
        <Search className="w-4 h-4 text-slate-800 cursor-pointer" />
      </div>
    </div>
  );
}

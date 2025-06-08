import { LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <div className="sticky top-0 bg-white shadow-sm z-50">
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
          <a onClick={() => navigate("/blogs")} className="cursor-pointer">
            BLOG
          </a>
          <a href="#">CONTACT</a>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button className="bg-[#e6fffd] text-slate-800 px-4 py-1 rounded-md text-sm font-semibold">
            BUY NOW
          </button>
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <div
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-down">
                  <div className="px-4 py-2 text-sm text-slate-700 border-b border-gray-100">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <a
                    href="#"
                    className="px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="text-sm text-slate-800 hover:underline">
              LOGIN
            </a>
          )}
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
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <div
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-down">
                    <div className="px-4 py-2 text-sm text-slate-700 border-b border-gray-100">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <a
                      href="#"
                      className="px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-sm text-slate-800 hover:underline"
              >
                LOGIN
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

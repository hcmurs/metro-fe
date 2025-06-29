import { LogOut, User, Ticket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FE_PATH } from "../../constants/path";

export default function Header() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isAuthenticated, contextUser: user, contextLogout: logout } = useAuth();

  // Navigation items configuration
  const navigationItems = [
    { label: "HOME", path: FE_PATH.HOME },
    { label: "BUY TICKETS", path: FE_PATH.BUY_TICKET },
    { label: "METRO MAP", path: FE_PATH.METRO_MAP },
    { label: "BLOG", path: "/blogs" },
    { label: "ABOUT", path: "#" }
  ];

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
        <nav className="hidden lg:flex gap-6 text-sm font-medium text-slate-800 items-center">
          {navigationItems.map((item) => (
            <a 
              key={item.label}
              onClick={() => navigate(item.path)} 
              className="cursor-pointer hover:text-green-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        
        </nav>

        <div className="hidden lg:flex items-center gap-4">
        
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
                    <p className="text-xs text-gray-500 break-words">{user?.email}</p>
                  </div>
                  <a
                    href="#"
                    className="px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                     <a
                      onClick={() => navigate(FE_PATH.MY_TICKETS)}
                      className="px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      My Tickets
                    </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center cursor-pointer"
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
          {navigationItems.map((item) => (
            <a 
              key={item.label}
              onClick={() => navigate(item.path)} 
              className="text-sm font-medium text-slate-800 cursor-pointer hover:text-green-600 transition-colors"
            >
              {item.label}
            </a>
          ))}

          <div className="flex gap-4 items-center pt-2">
            <a 
              onClick={() => navigate(FE_PATH.BUY_TICKET)}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
            >
              BUY TICKETS
            </a>
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
                      <p className="text-xs text-gray-500 break-words">{user?.email}</p>
                    </div>
                    <a
                      onClick={() => navigate("#")}
                      className="px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                onClick={() => navigate(FE_PATH.LOGIN)}
                className="text-sm text-slate-800 hover:underline cursor-pointer"
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

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
      <div className="text-2xl font-semibold text-gray-800 w-1/5 flex items-center">
        Metro Management
      </div>

      <div className="flex-1 px-6 ww-4/5">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border rounded-md text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-500 absolute top-2.5 right-3" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
        </div>

        <div className="flex items-center gap-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS79bKDKktxtrYpKZy7bram5zhg9suqAb_Yjg&s"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-800">Admin</span>
        </div>
      </div>
    </header>
  );
}

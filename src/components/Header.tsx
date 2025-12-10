import { Search, User, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-gray-800/90 backdrop-blur-md shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
      <div className="text-2xl font-bold">📊 Crypto Dashboard</div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Chercher..."
            className="pl-10 pr-4 py-2 rounded-xl bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-700/50 transition">
          <User className="w-5 h-5"/>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-700/50 transition">
          <Settings className="w-5 h-5"/>
        </button>
      </div>
    </header>
  );
}

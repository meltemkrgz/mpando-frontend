import React from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown,
  Plus,
  Menu
} from 'lucide-react';

function Navbar({ title = "Genel Bakış", toggleMobileMenu }) {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* SOL KISIM: Hamburger (mobil) + Başlık */}
        <div className="flex items-center gap-2">
          {/* Mobil hamburger açma düğmesi */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">
              {title}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 hidden md:block">
              25 Şubat 2026, Çarşamba
            </p>
          </div>
        </div>

        {/* ORTA/SAĞ KISIM: Aksiyonlar */}
        <div className="flex items-center gap-2 md:gap-4">
          

          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

          {/* İkon Butonlar */}
          <div className="flex items-center gap-1">
            
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            </button>

            <button className="hidden md:block p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {/* Kullanıcı Profili & Hızlı Ekleme */}
          <div className="flex items-center gap-3">
            {/* Hızlı Ekle Butonu (Mobil uyumlu) */}
            <button className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-900/10">
              <Plus className="w-4 h-4 md:mr-1.5" />
              <span className="hidden md:inline">Yeni</span>
            </button>

            {/* Profil Dropdown */}
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Anthony" 
                alt="User" 
                className="w-8 h-8 rounded-full bg-slate-200 ring-2 ring-white shadow-sm object-cover"
              />
              <span className="hidden md:block text-sm font-semibold text-slate-700">Anthony</span>
              <ChevronDown className="hidden md:block w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
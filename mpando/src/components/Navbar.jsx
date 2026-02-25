import React, { useState, useRef, useEffect } from 'react';
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
  // ÖNEMLİ DÜZELTME: useState ve useRef her zaman fonksiyon bileşeninin İÇİNDE olmalıdır.
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Sayfanın boşluğuna tıklanınca menüyü kapatma işlemi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* SAĞ KISIM: Bildirim, Yeni Butonu ve Profil */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-1">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-900/10">
              <Plus className="w-4 h-4 md:mr-1.5" />
              <span className="hidden md:inline">Yeni</span>
            </button>

            {/* ---- PROFIL KISMI BAŞLANGICI ---- */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              >
                <img 
                  src="/profile.png" 
                  alt="User" 
                  className="w-8 h-8 rounded-full bg-slate-200 ring-2 ring-white shadow-sm object-cover"
                />
                <span className="hidden md:block text-sm font-semibold text-slate-700">Mike J.</span>
                <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* AÇILAN DROPDOWN MENÜSÜ */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-medium text-slate-900">Hesabım</p>
                    <p className="text-xs text-slate-500 truncate">mike@example.com</p>
                  </div>

                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    Profil
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    Ayarlar
                  </button>

                  <div className="h-px bg-slate-100 my-1"></div>

                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
            {/* ---- PROFIL KISMI SONU ---- */}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
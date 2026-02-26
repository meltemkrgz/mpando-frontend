import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown,
  Plus,
  Menu,
  Sun,
  Moon
} from 'lucide-react';

function Navbar({ title = "Genel Bakış", toggleMobileMenu }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileDropdownRef = useRef(null);
  const { user, logout } = useAuth();

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
        <div className="flex items-center gap-2">
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
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center bg-slate-100/80 p-0.5 rounded-full border border-slate-200/60 shadow-inner hidden sm:flex">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  !isDarkMode 
                    ? 'bg-white text-amber-500 shadow-sm ring-1 ring-slate-200/50' 
                    : 'text-slate-400 hover:text-slate-500'
                }`}
                title="Aydınlık Tema"
              >
                <Sun className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsDarkMode(true)}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-white text-indigo-500 shadow-sm ring-1 ring-slate-200/50' 
                    : 'text-slate-400 hover:text-slate-500'
                }`}
                title="Karanlık Tema"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            </button>
          </div>

          <div className="flex items-center gap-3">
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
                <span className="hidden md:block text-sm font-semibold text-slate-700">{user.full_name}</span>
                <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-medium text-slate-900">Hesabım</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    Profil
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    Ayarlar
                  </button>

                  <div className="h-px bg-slate-100 my-1"></div>

                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
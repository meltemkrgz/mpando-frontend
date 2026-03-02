import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  ChevronDown,
  Menu,
  X,
  Trash2,
  CheckCircle,
  User
} from 'lucide-react';

// Örnek Bildirim Verileri (Modal için genişletildi)
const initialMockNotifications = [
  { 
    id: 1, 
    title: "Yeni Ödeme Alındı", 
    text: "Ahmet Yılmaz tarafından AKSU Rezidans A Blok 12 Nolu daire için 50.000₺ tutarında peşinat ödemesi sisteme girildi.", 
    sender: "Finans Departmanı",
    time: "5 dk önce", 
    unread: true 
  },
  { 
    id: 2, 
    title: "Satış Onayı", 
    text: "A Blok 12 Nolu dairenin satışı yönetici tarafından onaylanmıştır. Sözleşme sürecine geçebilirsiniz.", 
    sender: "Sistem",
    time: "1 saat önce", 
    unread: true 
  },
  { 
    id: 3, 
    title: "Yeni Stok Talebi", 
    text: "Şantiye alanından yeni bir malzeme talebi oluşturuldu: Çimento (100 Torba). Lütfen satın alma birimini bilgilendirin.", 
    sender: "Şantiye Şefi",
    time: "3 saat önce", 
    unread: false 
  },
  { 
    id: 4, 
    title: "Proje Güncellemesi", 
    text: "Dolunay Yaşam Merkezi projesinin teslim tarihi güncellenmiştir. Detayları proje sayfasından inceleyebilirsiniz.", 
    sender: "Proje Yöneticisi",
    time: "1 gün önce", 
    unread: false 
  },
];

function Navbar({ title = "Genel Bakış", toggleMobileMenu }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Bildirim State'leri
  const [notifications, setNotifications] = useState(initialMockNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bildirime tıklandığında modalı aç
  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    setIsModalOpen(true);
    setIsNotificationsOpen(false); // Modalı açarken dropdown'ı kapat
  };

  // Bildirimi Sil
  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  // Okundu Olarak İşaretle
  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full md:sticky md:left-auto z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
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
              {/* BİLDİRİMLER (Dropdown) */}
              <div className="relative" ref={notificationsDropdownRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative p-2 rounded-lg transition-colors group ${isNotificationsOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                  )}
                </button>

                {/* Bildirim Dropdown İçeriği */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-800">Bildirimler</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {unreadCount} Yeni
                        </span>
                      )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleNotificationClick(notif)}
                            className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-none ${notif.unread ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <p className={`text-sm truncate ${notif.unread ? 'text-slate-800 font-bold' : 'text-slate-700 font-medium'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap pt-0.5">{notif.time}</span>
                            </div>
                            <p className={`text-xs mt-1 line-clamp-2 ${notif.unread ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                              {notif.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-slate-500">
                          Hiç bildiriminiz yok.
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-2 px-4 pb-1">
                      <button 
                        onClick={() => window.location.href = '/messages'}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Tüm mesajları göster
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* PROFİL */}
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
                  <span className="hidden md:block text-sm font-semibold text-slate-700">{user?.full_name}</span>
                  <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-900">Hesabım</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
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

      {/* BİLDİRİM DETAY MODALI */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100 scale-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Başlık */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">{selectedNotification.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal İçerik */}
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/30 p-4 rounded-xl border border-blue-50">
                {selectedNotification.text}
              </p>
              
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{selectedNotification.sender}</span>
                </div>
                <span>{selectedNotification.time}</span>
              </div>
            </div>

            {/* Modal Aksiyon Butonları */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteNotification(selectedNotification.id)}
                className="flex flex-1 items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                <Trash2 size={16} /> Sil
              </button>
              
              <button
                onClick={() => handleMarkAsRead(selectedNotification.id)}
                disabled={!selectedNotification.unread}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  selectedNotification.unread 
                    ? 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100' 
                    : 'text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed'
                }`}
              >
                <CheckCircle size={16} />
                {selectedNotification.unread ? 'Okundu İşaretle' : 'Okundu'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
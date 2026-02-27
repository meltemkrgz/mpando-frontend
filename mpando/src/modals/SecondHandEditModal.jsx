import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Building2,
  MapPin,
  User,
  Phone,
  Tag,
  Banknote,
  Home,
  Info,
  Calendar
} from 'lucide-react';

export default function SecondHandEditModal({ isOpen, data, onClose, onSave }) {
  // Başlangıç state'i boş, veri gelince useEffect ile dolacak
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    type: 'Daire',
    price: '',
    block: '',
    flat: '',
    ownerName: '',
    ownerPhone: '',
    agentName: '',
    status: 'Aktif',
    notes: '',
    createdAt: ''
  });

  // Modal açıldığında veya data değiştiğinde state'i güncelle
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        // Eğer data içinde olmayan alanlar varsa varsayılan değerleri korumak için:
        notes: data.notes || '',
        agentName: data.agentName || '',
        ownerPhone: data.ownerPhone || '',
        ownerName: data.ownerName || '',
        price: data.price || '',
        location: data.location || ''
      });
    }
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasyon
    if (!formData.projectName || !formData.price) {
      alert("Proje adı ve Fiyat alanları zorunludur.");
      return;
    }
    // Veriyi üst bileşene gönder
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">İlanı Düzenle</h2>
            <p className="text-xs text-slate-500 mt-0.5">
               #{1000 + (data?.id || 0)} numaralı ilanı güncelliyorsunuz.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Form Body --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="edit-listing-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bölüm 1: Mülk Temel Bilgileri */}
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Home size={14} /> Mülk Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Proje Adı */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Proje / Apartman Adı</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Emlak Tipi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Emlak Tipi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Tag size={16} />
                    </div>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700"
                    >
                      <option value="Daire">Daire</option>
                      <option value="Villa">Villa</option>
                      <option value="Arsa">Arsa</option>
                      <option value="İşyeri">İşyeri</option>
                      <option value="Müstakil">Müstakil</option>
                    </select>
                  </div>
                </div>

                {/* Fiyat */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Fiyat</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Banknote size={16} />
                    </div>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Konum */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Konum</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Blok */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Blok</label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                  />
                </div>

                {/* Daire No */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Kapı No</label>
                  <input
                    type="text"
                    name="flat"
                    value={formData.flat}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                  />
                </div>

              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Bölüm 2: İletişim ve Durum */}
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> İletişim & Durum
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Mülk Sahibi Adı */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Mülk Sahibi Adı</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Mülk Sahibi Telefon */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Mülk Sahibi Telefon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Danışman */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">İlgili Danışman</label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                  />
                </div>

                {/* İlan Durumu */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">İlan Durumu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Info size={16} />
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 cursor-pointer"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Opsiyonlu">Opsiyonlu</option>
                      <option value="Pasif">Pasif</option>
                      <option value="Satıldı">Satıldı</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Bölüm 3: Bilgi ve Notlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Oluşturma Tarihi (Salt Okunur) */}
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Eklenme Tarihi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="text"
                      disabled
                      value={formData.createdAt}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Notlar</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>

          </form>
        </div>

        {/* --- Footer --- */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="edit-listing-form"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Save size={16} />
            Değişiklikleri Kaydet
          </button>
        </div>

      </div>
    </div>
  );
}
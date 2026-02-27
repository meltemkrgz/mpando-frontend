import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

export default function NewSecondHandModal({ isOpen, onClose, onAdd }) {
  const initialData = {
    projectName: '',
    location: '',
    type: 'Daire', // Varsayılan
    price: '',
    block: '',
    flat: '',
    ownerName: '',
    ownerPhone: '',
    agentName: '', // Normalde giriş yapan kullanıcı otomatik gelir ama manuel giriş bıraktık
    status: 'Aktif',
    notes: ''
  };

  const [formData, setFormData] = useState(initialData);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basit doğrulama
    if (!formData.projectName || !formData.price) {
      alert("Lütfen en azından Proje Adı ve Fiyat alanlarını doldurun.");
      return;
    }
    
    // Parent bileşene veriyi gönder
    onAdd(formData);
    
    // Formu temizle ve kapat
    setFormData(initialData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Yeni İlan Ekle</h2>
            <p className="text-xs text-slate-500 mt-0.5">Portföye yeni bir 2. el gayrimenkul ekleyin.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Form Body (Scrollable) --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="new-listing-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bölüm 1: Mülk Temel Bilgileri */}
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Home size={14} /> Mülk Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Proje Adı */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Proje / Apartman Adı <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="Örn: Güneş Sitesi"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
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
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 appearance-none cursor-pointer"
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
                  <label className="text-sm font-medium text-slate-700">Fiyat <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Banknote size={16} />
                    </div>
                    <input
                      type="text" // Number yerine text kullanıyoruz ki "TL" vb yazılabilsin veya formatlı girilsin
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Örn: 5.250.000"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Konum */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Konum / Bölge</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Örn: Kadıköy, İstanbul"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Blok */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Blok / Ada</label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    placeholder="A Blok"
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                  />
                </div>

                {/* Daire No */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Kapı / Parsel No</label>
                  <input
                    type="text"
                    name="flat"
                    value={formData.flat}
                    onChange={handleChange}
                    placeholder="No: 5"
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
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
                      placeholder="Ad Soyad"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
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
                      placeholder="+90 555 000 00 00"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                 {/* Ekleyen Danışman */}
                 <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">İlgili Danışman</label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleChange}
                    placeholder="Danışman Adı"
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
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
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Opsiyonlu">Opsiyonlu</option>
                      <option value="Pasif">Pasif</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Bölüm 3: Notlar */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Notlar / Açıklama</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="İlan ile ilgili özel notlar..."
                className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400 resize-none"
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
            İptal
          </button>
          <button
            type="submit"
            form="new-listing-form"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Save size={16} />
            Kaydet
          </button>
        </div>

      </div>
    </div>
  );
}
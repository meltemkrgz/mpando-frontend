import React from 'react';
import {
  X,
  Save,
  Building2,
  User,
  Home,
  Banknote,
  Calendar,
  FileText,
  Tag,
  Link,
  ChevronDown
} from 'lucide-react';

export default function NewSaleModal({
  isOpen,
  formData,
  onClose,
  onChange,
  onAdd,
  customers = [],
  projects = []
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Yeni Satış Ekle</h2>
            <p className="text-xs text-slate-500 mt-0.5">Sisteme yeni bir satış veya teklif kaydı oluşturun.</p>
          </div>
          <button 
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Form Body (Scrollable) --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form 
            id="new-sale-form" 
            onSubmit={(e) => { e.preventDefault(); onAdd(); }} 
            className="space-y-6"
          >
            
            {/* Bölüm 1: Müşteri & Proje Bilgileri */}
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> Müşteri & Proje Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Müşteri Seçimi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Müşteri Seçimi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <select
                      name="musteri_id"
                      value={formData.musteri_id || ''}
                      onChange={onChange}
                      required
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seçiniz</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>ID: ({c.id}) - {c.full_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Proje Seçimi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Proje Seçimi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 size={16} />
                    </div>
                    <select
                      name="proje_id"
                      value={formData.proje_id || ''}
                      onChange={onChange}
                      required
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seçiniz</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>ID: ({p.id}) - {p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* İlgilenilen Daire / Blok */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">İlgilenilen Daire / Blok</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Home size={16} />
                    </div>
                    <input
                      type="text"
                      name="interested_product"
                      value={formData.interested_product || ''}
                      onChange={onChange}
                      placeholder="Örn: A Blok, Daire 12"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Bütçe Aralığı */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Bütçe Aralığı</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Banknote size={16} />
                    </div>
                    <input
                      type="text"
                      name="budget_range"
                      value={formData.budget_range || ''}
                      onChange={onChange}
                      placeholder="Örn: 3M - 5M TL"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Verilen Teklif */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Verilen Teklif (₺)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Banknote size={16} />
                    </div>
                    <input
                      type="number"
                      name="offered_price"
                      value={formData.offered_price || ''}
                      onChange={onChange}
                      placeholder="Örn: 4500000"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Bölüm 2: Satış & Sözleşme Detayları */}
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={14} /> Satış & Sözleşme Detayları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Satış Tarihi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Satış Tarihi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="date"
                      name="sale_date"
                      value={formData.sale_date || ''}
                      onChange={onChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Satış Durumu */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Satış Durumu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Tag size={16} />
                    </div>
                    <select
                      name="sale_status"
                      value={formData.sale_status || 'Beklemede'}
                      onChange={onChange}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Beklemede">Beklemede</option>
                      <option value="Satıldı">Satıldı</option>
                      <option value="İptal">İptal</option>
                      <option value="Reddedildi">Reddedildi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sözleşme No */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Sözleşme No</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileText size={16} />
                    </div>
                    <input
                      type="text"
                      name="contract_no"
                      value={formData.contract_no || ''}
                      onChange={onChange}
                      placeholder="Örn: S-2023-001"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Sözleşme Dosya URL */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Sözleşme Dosya URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Link size={16} />
                    </div>
                    <input
                      type="text"
                      name="contract_url"
                      placeholder="https://..."
                      value={formData.contract_url || ''}
                      onChange={onChange}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Bölüm 3: Notlar */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Notlar / Açıklama</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={onChange}
                rows="3"
                placeholder="Satış veya görüşme ile ilgili eklemek istedikleriniz..."
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
            form="new-sale-form"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Save size={16} />
            Satışı Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
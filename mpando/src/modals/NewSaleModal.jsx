import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const NewSaleModal = ({ 
  isOpen, 
  formData,
  onClose, 
  onChange, 
  onAdd
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              Yeni Satış Ekle
            </h3>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Müşteri Bilgileri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Müşteri Adı Soyadı
                </label>
                <input 
                  type="text" 
                  name="customerName" 
                  value={formData.customerName || ''} 
                  onChange={onChange} 
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefon Numarası
                </label>
                <input 
                  type="text" 
                  name="customerPhone" 
                  value={formData.customerPhone || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
            </div>

            {/* Proje Bilgileri */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Proje Adı
              </label>
              <input 
                type="text" 
                name="projectName" 
                value={formData.projectName || ''} 
                onChange={onChange} 
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Blok
                </label>
                <input 
                  type="text" 
                  name="block" 
                  value={formData.block || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Daire No
                </label>
                <input 
                  type="text" 
                  name="flat" 
                  value={formData.flat || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
            </div>

            {/* Bütçe ve Teklif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bütçe Aralığı
                </label>
                <input 
                  type="text" 
                  name="budgetRange" 
                  placeholder="Örn: 2M - 3M ₺"
                  value={formData.budgetRange || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Verilen Teklif
                </label>
                <input 
                  type="text" 
                  name="offerAmount" 
                  placeholder="Örn: 2.500.000 ₺"
                  value={formData.offerAmount || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
            </div>

            {/* Tarih ve Sözleşme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Satış Tarihi
                </label>
                <input 
                  type="date" 
                  name="saleDate" 
                  value={formData.saleDate || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sözleşme No
                </label>
                <input 
                  type="text" 
                  name="contractNo" 
                  value={formData.contractNo || ''} 
                  onChange={onChange} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                />
              </div>
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Satış Durumu
              </label>
              <div className="relative"> 
                <select 
                  name="status" 
                  value={formData.status || 'Beklemede'} 
                  onChange={onChange} 
                  className="w-full appearance-none border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                >
                  <option value="Beklemede">Beklemede</option>
                  <option value="Satıldı">Satıldı</option>
                  <option value="Reddedildi">Reddedildi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Notlar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notlar
              </label>
              <textarea 
                rows="3" 
                name="notes" 
                value={formData.notes || ''} 
                onChange={onChange} 
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm resize-none"
              ></textarea>
            </div>

          </div>
          
          <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-all"
            >
              Satışı Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSaleModal;
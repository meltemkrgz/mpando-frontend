import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const SaleEditModal = ({
  isOpen,
  saleData,
  onClose,
  onChange,
  onSave,
  customers = [],
  projects = []
}) => {
  // Modal açık değilse veya düzenlenecek veri yoksa hiçbir şey render etme
  if (!isOpen || !saleData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              Satış Kaydını Düzenle
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* İçerik / Form Alanları */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Müşteri Seçimi
                </label>
                <div className="relative">
                  <select
                    name="musteri_id"
                    value={saleData.musteri_id || ''}
                    onChange={onChange}
                    required
                    className="w-full appearance-none border border-slate-200 rounded-lg p-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                  >
                    <option value="" disabled>Seçiniz</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>ID: ({c.id}) - {c.full_name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Proje Seçimi
                </label>
                <div className="relative">
                  <select
                    name="proje_id"
                    value={saleData.proje_id || ''}
                    onChange={onChange}
                    required
                    className="w-full appearance-none border border-slate-200 rounded-lg p-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                  >
                    <option value="" disabled>Seçiniz</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>ID: ({p.id}) - {p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                İlgilenilen Daire / Blok
              </label>
              <input
                type="text"
                name="interested_product"
                value={saleData.interested_product || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bütçe Aralığı
                </label>
                <input
                  type="text"
                  name="budget_range"
                  value={saleData.budget_range || ''}
                  onChange={onChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Verilen Teklif (₺)
                </label>
                <input
                  type="number"
                  name="offered_price"
                  value={saleData.offered_price || ''}
                  onChange={onChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Satış Tarihi
                </label>
                <input
                  type="date"
                  name="sale_date"
                  value={saleData.sale_date ? saleData.sale_date.substring(0, 10) : ''}
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
                  name="contract_no"
                  value={saleData.contract_no || ''}
                  onChange={onChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Satış Durumu
              </label>
              <div className="relative">
                <select
                  name="sale_status"
                  value={saleData.sale_status || 'Beklemede'}
                  onChange={onChange}
                  className="w-full appearance-none border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                >
                  <option value="Beklemede">Beklemede</option>
                  <option value="Satıldı">Satıldı</option>
                  <option value="İptal">İptal</option>
                  <option value="Reddedildi">Reddedildi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sözleşme Dosya URL
              </label>
              <input
                type="text"
                name="contract_url"
                placeholder="https://..."
                value={saleData.contract_url || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notlar
              </label>
              <textarea
                rows="3"
                name="notes"
                value={saleData.notes || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm resize-none"
              ></textarea>
            </div>

          </div>

          {/* Footer (Aksiyon Butonları) */}
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
              Değişiklikleri Kaydet
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SaleEditModal;
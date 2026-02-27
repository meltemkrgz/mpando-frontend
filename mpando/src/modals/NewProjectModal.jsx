import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const NewProjectModal = ({
  isOpen,
  formData,
  contractors,
  onClose,
  onChange,
  onAdd
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              Yeni Proje Ekle
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Proje Adı
              </label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adres
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ünite
              </label>
              <input
                type="number"
                name="unit"
                value={formData.unit || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Açıklama
              </label>
              <textarea
                rows="3"
                name="description"
                value={formData.description || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Müteahhit
              </label>
              <div className="relative">
                <select
                  name="contractor_id"
                  value={formData.contractor_id || ''}
                  onChange={onChange}
                  className="w-full appearance-none border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                >
                  <option value="">Seçiniz</option>
                  {(contractors || []).map(c => (
                    <option key={c.id} value={c.id}>{c.full_name || c.name || c.email}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            {formData.status === 'Tamamlandı' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={onChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Durumu
              </label>
              <div className="relative"> {/* Select için ChevronDown ikonu ekledim */}
                <select
                  name="status"
                  value={formData.status || 'Devam Ediyor'}
                  onChange={onChange}
                  className="w-full appearance-none border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                >
                  <option>Devam Ediyor</option>
                  <option>Planlanıyor</option>
                  <option>Gecikmede</option>
                  <option>Bitiyor</option>
                  <option>Tamamlandı</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
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
              Projeyi Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
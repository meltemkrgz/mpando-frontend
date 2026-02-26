import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const mockCompanies = [
  { id: 1, name: 'AKSU İnşaat' },
  { id: 2, name: 'Dolunay A.Ş.' },
  { id: 3, name: 'İŞHAN Grup' },
  { id: 4, name: 'İSKAMALL Holding' },
  { id: 5, name: 'Yeni Vizyon Ltd.' },
];

const mockEmployees = [
  { id: 101, fullName: 'Ali Yılmaz' },
  { id: 102, fullName: 'Ahmet Korkmaz' },
  { id: 103, fullName: 'Ayşe Demir' },
  { id: 104, fullName: 'Veli Can' },
];

function CustomerEditModal({ isOpen, customerData, onClose, onChange, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Müşteriyi Düzenle</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Adı Soyadı</label>
              <input
                type="text"
                name="customer_full_name"
                value={customerData?.customer_full_name || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Şirket Adı</label>
              <select
                name="company_id"
                value={customerData?.company_id || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              >
                <option value="">Seçiniz</option>
                {mockCompanies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sorumlu Çalışan</label>
              <select
                name="employee_id"
                value={customerData?.employee_id || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              >
                <option value="">Seçiniz</option>
                {mockEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.fullName}</option>
                ))}
              </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">TC Kimlik No</label>
              <input
                type="text"
                name="identity_number"
                value={customerData?.identity_number || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefon Numarası</label>
              <input
                type="tel"
                name="phone"
                value={customerData?.phone || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
              <input
                type="email"
                name="email"
                value={customerData?.email || ''}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
              <textarea
                name="address"
                value={customerData?.address || ''}
                onChange={onChange}
                rows="3"
                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
              ></textarea>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">İptal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-all">Müşteriyi Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerEditModal;
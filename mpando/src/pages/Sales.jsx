import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SaleEditModal from '../modals/SaleEditModal'; 
import NewSaleModal from '../modals/NewSaleModal'; 
import { useAuth } from '../context/AuthContext';
// import { api } from '../api/client'; // Eğer API kullanacaksanız yorum satırını kaldırın
import {
  Plus,
  Trash2,
  CheckSquare,
  Pencil,
  Columns,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Building2,
  Banknote
} from 'lucide-react';

// --- Satış Durumu Renk ve İkonları ---
const getStatusClasses = (status) => {
  switch (status) {
    case 'Satıldı': return 'bg-green-50 text-green-700 border-green-200 text-[10px] font-bold px-2 py-1';
    case 'Beklemede': return 'bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] font-bold px-2 py-1';
    case 'Reddedildi': return 'bg-red-50 text-red-700 border-red-200 text-[10px] font-bold px-2 py-1';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-bold px-2 py-1';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Satıldı': return <CheckCircle2 size={14} />;
    case 'Beklemede': return <Clock size={14} />;
    case 'Reddedildi': return <XCircle size={14} />;
    default: return null;
  }
};

// --- Örnek Veriler ---
const initialSalesList = [
  { 
    id: 1, 
    customerName: 'Ahmet Yılmaz', 
    customerPhone: '+90 532 123 45 67', 
    projectName: 'AKSU Rezidans', 
    block: 'A', 
    flat: '12', 
    status: 'Satıldı', 
    budgetRange: '3.000.000₺ - 4.500.000₺', 
    notes: 'Peşinat ödendi, kredi süreci tamamlandı.', 
    offerAmount: '4.200.000₺', 
    saleDate: '15.03.2024', 
    contractNo: 'S-2024-001', 
    createdAt: '01.03.2024' 
  },
  { 
    id: 2, 
    customerName: 'Ayşe Demir', 
    customerPhone: '+90 555 987 65 43', 
    projectName: 'Dolunay Yaşam Merkezi', 
    block: 'B', 
    flat: '8', 
    status: 'Beklemede', 
    budgetRange: '5.000.000₺ - 6.000.000₺', 
    notes: 'Eşinin kararını bekliyor, haftaya dönüş yapacak.', 
    offerAmount: '5.800.000₺', 
    saleDate: '-', 
    contractNo: '-', 
    createdAt: '10.04.2024' 
  },
  { 
    id: 3, 
    customerName: 'Mehmet Kaya', 
    customerPhone: '+90 530 456 78 90', 
    projectName: 'İŞHAN Rezidans', 
    block: 'C', 
    flat: '22', 
    status: 'Reddedildi', 
    budgetRange: '2.000.000₺ - 2.500.000₺', 
    notes: 'Bütçeyi aştığı için vazgeçti.', 
    offerAmount: '3.100.000₺', 
    saleDate: '-', 
    contractNo: '-', 
    createdAt: '05.02.2024' 
  },
];

const initialNewSaleData = { 
  customerName: '', customerPhone: '', projectName: '', block: '', flat: '', 
  status: 'Beklemede', budgetRange: '', notes: '', offerAmount: '', saleDate: '', contractNo: '' 
};

// İsteğe bağlı (açılır/kapanır) sütunlar
const optionalColumns = [
  { key: 'offerAmount', label: 'Verilen Teklif' },
  { key: 'saleDate', label: 'Satış Tarihi' },
  { key: 'contractNo', label: 'Sözleşme No' },
  { key: 'createdAt', label: 'Oluşturma Tarihi' },
];

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">{action}</div>
    </div>
  );
}

function Sales() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sales, setSales] = useState(initialSalesList); 
  const [selectedSales, setSelectedSales] = useState([]);
  const { user } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSaleData, setNewSaleData] = useState(initialNewSaleData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSaleForEdit, setSelectedSaleForEdit] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const columnDropdownRef = useRef(null);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Hepsi');
  const filterDropdownRef = useRef(null);

  const allStatusOptions = ['Hepsi', 'Satıldı', 'Beklemede', 'Reddedildi'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target)) {
        setIsColumnDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const handleSelectSale = (id) => {
    setSelectedSales(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const currentSalesIds = filteredSales.map(s => s.id);
    if (selectedSales.length === currentSalesIds.length && selectedSales.every(id => currentSalesIds.includes(id))) {
      setSelectedSales([]);
    } else {
      setSelectedSales(currentSalesIds);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`${selectedSales.length} satış kaydını silmek istediğinize emin misiniz?`)) {
      setSales(prev => prev.filter(s => !selectedSales.includes(s.id)));
      setSelectedSales([]);
    }
  };

  const toggleColumnVisibility = (key) => {
    setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // Yeni Satış Modal İşlemleri
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => { setIsAddModalOpen(false); setNewSaleData(initialNewSaleData); };

  const handleNewSaleChange = (e) => {
    const { name, value } = e.target;
    setNewSaleData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewSale = () => {
    if (!newSaleData.customerName || !newSaleData.projectName) { 
      alert('Müşteri Adı ve Proje alanları zorunludur.'); return; 
    }
    const newSale = {
      id: Date.now(),
      ...newSaleData,
      createdAt: new Date().toLocaleDateString('tr-TR'),
    };
    setSales([newSale, ...sales]);
    closeAddModal();
  };

  // Düzenleme Modal İşlemleri
  const openEditModal = (sale) => { setSelectedSaleForEdit(sale); setEditFormData({ ...sale }); setIsEditModalOpen(true); };
  const closeEditModal = () => { setIsEditModalOpen(false); setTimeout(() => { setSelectedSaleForEdit(null); setEditFormData(null); }, 300); };
  
  const handleEditFormChange = (e) => { 
    const { name, value } = e.target; 
    setEditFormData(prev => ({ ...prev, [name]: value })); 
  };
  
  const handleUpdateSale = () => {
    if (!editFormData.customerName) { alert('Müşteri Adı boş bırakılamaz.'); return; }
    setSales(prev => prev.map(s => s.id === selectedSaleForEdit.id ? { ...s, ...editFormData } : s));
    closeEditModal();
  };

  const toggleFilterDropdown = () => setIsFilterDropdownOpen(prev => !prev);
  const handleFilterChange = (status) => {
    setSelectedStatusFilter(status);
    setIsFilterDropdownOpen(false);
    setSelectedSales([]);
  };

  const filteredSales = selectedStatusFilter === 'Hepsi'
    ? sales
    : sales.filter(sale => sale.status === selectedStatusFilter);

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0 relative">
        <Navbar title="Satışlar" toggleMobileMenu={toggleMobileMenu} />

        <div className="px-4 sm:px-6 md:px-8 pb-12 pt-4 space-y-8">
          <SectionHeader
            title="Satış Kayıtları"
            action={
              <>
                {/* Durum Filtresi */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={toggleFilterDropdown}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Filter size={14} />
                    {selectedStatusFilter !== 'Hepsi' && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {selectedStatusFilter}
                      </span>
                    )}
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-in fade-in-25">
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-400 px-2 pt-1 pb-2">Duruma Göre Filtrele</p>
                        {allStatusOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => handleFilterChange(option)}
                            className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm ${selectedStatusFilter === option ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                          >
                            <span>{option}</span>
                            {selectedStatusFilter === option && <CheckCircle2 size={16} className="text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sütun Görünürlüğü (Kullanıcının bahsettiği filtreler) */}
                <div className="relative" ref={columnDropdownRef}>
                  <button
                    onClick={() => setIsColumnDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Columns size={14} /> Sütunlar
                  </button>
                  {isColumnDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-in fade-in-25">
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-400 px-2 pt-1 pb-2">Gösterilecek Sütunlar</p>
                        {optionalColumns.map(col => (
                          <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={visibleColumns.includes(col.key)} 
                              onChange={() => toggleColumnVisibility(col.key)} 
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" 
                            />
                            <span className="text-sm text-slate-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={openAddModal} className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm px-3 py-1.5 rounded-lg transition-colors">
                  <Plus size={14} /> Yeni Satış
                </button>
              </>
            }
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* Seçim Aksiyon Çubuğu */}
            {selectedSales.length > 0 && (
              <div className="flex flex-wrap items-center justify-between border border-slate-200 p-3 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="flex items-center justify-center bg-blue-600 text-white w-6 h-6 rounded-full text-xs font-bold">{selectedSales.length}</span>
                  <span className="text-sm font-medium text-slate-700">kayıt seçildi</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <button onClick={handleSelectAll} className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
                    <CheckSquare size={16} />
                    <span className="hidden sm:inline">{selectedSales.length === filteredSales.length ? 'Seçimi Temizle' : 'Tümünü Seç'}</span>
                  </button>
                  <div className="w-px h-5 bg-slate-300"></div>
                  <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} /> <span>Sil</span>
                  </button>
                </div>
              </div>
            )}

            {/* Satışlar Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pl-2 w-10"></th>
                    <th className="pb-3 px-4">Müşteri Bilgileri</th>
                    <th className="pb-3 px-4">Daire Bilgileri</th>
                    <th className="pb-3 px-4">Durum</th>
                    <th className="pb-3 px-4">Bütçe Aralığı</th>
                    <th className="pb-3 px-4">Notlar</th>
                    {visibleColumns.includes('offerAmount') && <th className="pb-3 px-4">Verilen Teklif</th>}
                    {visibleColumns.includes('saleDate') && <th className="pb-3 px-4">Satış Tarihi</th>}
                    {visibleColumns.includes('contractNo') && <th className="pb-3 px-4">Sözleşme No</th>}
                    {visibleColumns.includes('createdAt') && <th className="pb-3 px-4">Oluşturma Tarihi</th>}
                    <th className="pb-3 px-4 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-500">
                        {selectedStatusFilter === 'Hepsi' ? 'Gösterilecek satış kaydı bulunamadı.' : `"${selectedStatusFilter}" durumunda kayıt bulunamadı.`}
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map(sale => (
                      <tr key={sale.id} className={`group transition-colors border-b border-slate-50 last:border-none ${selectedSales.includes(sale.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                        <td className="py-4 pl-2 align-top pt-5">
                          <input 
                            type="checkbox" 
                            checked={selectedSales.includes(sale.id)} 
                            onChange={() => handleSelectSale(sale.id)} 
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" 
                          />
                        </td>
                        
                        {/* Müşteri Bilgileri */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-700">{sale.customerName}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Phone size={12} /> {sale.customerPhone}
                            </span>
                          </div>
                        </td>

                        {/* Daire Bilgileri */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-700 flex items-center gap-1.5">
                              <Building2 size={14} className="text-blue-500" /> {sale.projectName}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block w-max">
                              Blok: <strong className="text-slate-700">{sale.block}</strong> | Daire: <strong className="text-slate-700">{sale.flat}</strong>
                            </span>
                          </div>
                        </td>

                        {/* Satış Durumu */}
                        <td className="py-4 px-4 align-top pt-5">
                          <span className={`inline-flex items-center gap-1 border rounded-full ${getStatusClasses(sale.status)}`}>
                            {getStatusIcon(sale.status)} {sale.status}
                          </span>
                        </td>

                        {/* Bütçe Aralığı */}
                        <td className="py-4 px-4 align-top pt-5">
                          <span className="flex items-center gap-1.5 text-slate-600 font-medium bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-xs w-max">
                            <Banknote size={14} className="text-emerald-500"/> {sale.budgetRange}
                          </span>
                        </td>

                        {/* Notlar */}
                        <td className="py-4 px-4 align-top pt-5 text-slate-500 max-w-[200px] truncate" title={sale.notes}>
                          {sale.notes || '-'}
                        </td>

                        {/* İsteğe Bağlı Sütunlar */}
                        {visibleColumns.includes('offerAmount') && <td className="py-4 px-4 align-top pt-5 text-slate-700 font-medium">{sale.offerAmount}</td>}
                        {visibleColumns.includes('saleDate') && <td className="py-4 px-4 align-top pt-5 text-slate-500">{sale.saleDate}</td>}
                        {visibleColumns.includes('contractNo') && <td className="py-4 px-4 align-top pt-5 text-slate-500">{sale.contractNo}</td>}
                        {visibleColumns.includes('createdAt') && <td className="py-4 px-4 align-top pt-5 text-slate-500">{sale.createdAt}</td>}
                        
                        {/* İşlemler */}
                        <td className="py-4 px-4 text-center align-top pt-4">
                          <button onClick={() => openEditModal(sale)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
                            <Pencil size={14} /> Düzenle
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- MODALLAR --- */}
        <SaleEditModal
          isOpen={isEditModalOpen}
          saleData={editFormData}
          onClose={closeEditModal}
          onChange={handleEditFormChange}
          onSave={handleUpdateSale}
        />

        <NewSaleModal
          isOpen={isAddModalOpen}
          formData={newSaleData}
          onClose={closeAddModal}
          onChange={handleNewSaleChange}
          onAdd={handleAddNewSale}
        />

      </main>
    </div>
  );
}

export default Sales;
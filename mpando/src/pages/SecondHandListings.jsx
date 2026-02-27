import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SecondHandEditModal from '../modals/SecondHandEditModal'; 
import NewSecondHandModal from '../modals/NewSecondHandModal ';
import { useAuth } from '../context/AuthContext';
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
  Home,
  MapPin,
  User,
  Tag
} from 'lucide-react';

// --- Durum Renk ve İkonları ---
const getStatusClasses = (status) => {
  switch (status) {
    case 'Aktif': return 'bg-green-50 text-green-700 border-green-200 text-[10px] font-bold px-2 py-1';
    case 'Opsiyonlu': return 'bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] font-bold px-2 py-1';
    case 'Pasif': return 'bg-gray-50 text-gray-700 border-gray-200 text-[10px] font-bold px-2 py-1';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-bold px-2 py-1';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Aktif': return <CheckCircle2 size={14} />;
    case 'Opsiyonlu': return <Clock size={14} />;
    case 'Pasif': return <XCircle size={14} />;
    default: return null;
  }
};

// --- Emlak Tipi İkonları ---
const getTypeIcon = (type) => {
  switch (type) {
    case 'Daire': return <Building2 size={14} className="text-blue-500" />;
    case 'Villa': return <Home size={14} className="text-purple-500" />;
    case 'Arsa': return <MapPin size={14} className="text-emerald-500" />;
    default: return <Tag size={14} className="text-slate-500" />;
  }
};

// --- Örnek Veriler ---
const initialListings = [
  { 
    id: 1, 
    projectName: 'Güneş Sitesi 3. Etap', 
    location: 'Kadıköy, İstanbul',
    agentName: 'Canan Yılmaz', 
    block: 'C Blok', 
    flat: 'No: 4', 
    ownerName: 'Ali Vural', 
    ownerPhone: '+90 532 111 22 33',
    status: 'Aktif', 
    type: 'Daire',
    price: '5.250.000₺',
    createdAt: '01.03.2024' 
  },
  { 
    id: 2, 
    projectName: 'Deniz Manzaralı Müstakil', 
    location: 'Bodrum, Muğla',
    agentName: 'Burak Demir', 
    block: '-', 
    flat: 'No: 12', 
    ownerName: 'Ayşe Kaya', 
    ownerPhone: '+90 555 444 55 66',
    status: 'Opsiyonlu', 
    type: 'Villa',
    price: '18.000.000₺',
    createdAt: '15.02.2024' 
  },
  { 
    id: 3, 
    projectName: 'Merkezde Ticari İmarlı', 
    location: 'Çankaya, Ankara',
    agentName: 'Mehmet Öztürk', 
    block: 'Ada 101', 
    flat: 'Parsel 5', 
    ownerName: 'Şirket Envanteri', 
    ownerPhone: '-',
    status: 'Pasif', 
    type: 'Arsa',
    price: '9.500.000₺',
    createdAt: '10.01.2024' 
  },
];

const initialNewListingData = { 
  projectName: '', location: '', agentName: '', block: '', flat: '', 
  ownerName: '', ownerPhone: '', status: 'Aktif', type: 'Daire', price: ''
};

// İsteğe bağlı sütunlar (Referanstaki yapıya uygun)
const optionalColumns = [
  { key: 'price', label: 'Fiyat' },
  { key: 'createdAt', label: 'Eklenme Tarihi' },
  { key: 'location', label: 'Konum Detayı' },
];

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">{action}</div>
    </div>
  );
}

function SecondHandListings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listings, setListings] = useState(initialListings); 
  const [selectedListings, setSelectedListings] = useState([]);
  const { user } = useAuth();

  // Modal State'leri
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newListingData, setNewListingData] = useState(initialNewListingData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState(null);

  // Filtre ve Sütun State'leri
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(['price']); // Varsayılan açık opsiyonel sütun
  const columnDropdownRef = useRef(null);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Hepsi');
  const filterDropdownRef = useRef(null);

  const allStatusOptions = ['Hepsi', 'Aktif', 'Opsiyonlu', 'Pasif'];

  // Dışarı tıklama kontrolü (Dropdownlar için)
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

  const handleAddListing = (formData) => {
    const newListing = {
      id: Date.now(), // Benzersiz ID
      createdAt: new Date().toLocaleDateString('tr-TR'),
      ...formData
    };

    setListings([newListing, ...listings]); // Listeye ekle
    setIsAddModalOpen(false); // Modalı kapat
  };

  const handleUpdateListing = (updatedData) => {
  setListings((prevListings) =>
    prevListings.map((item) =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    )
  );
  setIsEditModalOpen(false); // Modalı kapat
  setSelectedListingForEdit(null); // Seçili veriyi temizle
  };

  // Seçim İşlemleri
  const handleSelectListing = (id) => {
    setSelectedListings(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const currentListingIds = filteredListings.map(s => s.id);
    if (selectedListings.length === currentListingIds.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(currentListingIds);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`${selectedListings.length} ilanı silmek istediğinize emin misiniz?`)) {
      setListings(prev => prev.filter(s => !selectedListings.includes(s.id)));
      setSelectedListings([]);
    }
  };

  const toggleColumnVisibility = (key) => {
    setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // Filtreleme
  const toggleFilterDropdown = () => setIsFilterDropdownOpen(prev => !prev);
  const handleFilterChange = (status) => {
    setSelectedStatusFilter(status);
    setIsFilterDropdownOpen(false);
    setSelectedListings([]);
  };

  const filteredListings = selectedStatusFilter === 'Hepsi'
    ? listings
    : listings.filter(listing => listing.status === selectedStatusFilter);

  // Modal Açma/Kapama (Mock Fonksiyonlar)
  const openAddModal = () => setIsAddModalOpen(true);
  const openEditModal = (listing) => { setSelectedListingForEdit(listing); setIsEditModalOpen(true); };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0 relative">
        <Navbar title="2. El Portföy" toggleMobileMenu={toggleMobileMenu} />

        <div className="px-4 sm:px-6 md:px-8 pb-12 pt-4 space-y-8">
          <SectionHeader
            title="2. El Emlak Listesi"
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

                {/* Sütun Görünürlüğü */}
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
                  <Plus size={14} /> İlan Ekle
                </button>
              </>
            }
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* Seçim Aksiyon Çubuğu */}
            {selectedListings.length > 0 && (
              <div className="flex flex-wrap items-center justify-between border border-slate-200 p-3 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="flex items-center justify-center bg-blue-600 text-white w-6 h-6 rounded-full text-xs font-bold">{selectedListings.length}</span>
                  <span className="text-sm font-medium text-slate-700">ilan seçildi</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <button onClick={handleSelectAll} className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
                    <CheckSquare size={16} />
                    <span className="hidden sm:inline">{selectedListings.length === filteredListings.length ? 'Seçimi Temizle' : 'Tümünü Seç'}</span>
                  </button>
                  <div className="w-px h-5 bg-slate-300"></div>
                  <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} /> <span>Sil</span>
                  </button>
                </div>
              </div>
            )}

            {/* İlanlar Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pl-2 w-10"></th>
                    <th className="pb-3 px-4">Proje</th>
                    <th className="pb-3 px-4">Ekleyen</th>
                    <th className="pb-3 px-4">Blok / Bölüm No</th>
                    <th className="pb-3 px-4">Ev Sahibi</th>
                    <th className="pb-3 px-4">Durum</th>
                    <th className="pb-3 px-4">Tip</th>
                    {visibleColumns.includes('price') && <th className="pb-3 px-4">Fiyat</th>}
                    {visibleColumns.includes('location') && <th className="pb-3 px-4">Konum</th>}
                    {visibleColumns.includes('createdAt') && <th className="pb-3 px-4">Eklenme Tarihi</th>}
                    <th className="pb-3 px-4 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-500">
                        Kayıt bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map(item => (
                      <tr key={item.id} className={`group transition-colors border-b border-slate-50 last:border-none ${selectedListings.includes(item.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                        {/* Checkbox */}
                        <td className="py-4 pl-2 align-top pt-5">
                          <input 
                            type="checkbox" 
                            checked={selectedListings.includes(item.id)} 
                            onChange={() => handleSelectListing(item.id)} 
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" 
                          />
                        </td>
                        
                        {/* Proje Bilgisi */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-700">{item.projectName}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                               İlan No: #{1000 + item.id}
                            </span>
                          </div>
                        </td>

                        {/* Ekleyen (Agent) */}
                        <td className="py-4 px-4 align-top pt-5">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <User size={14} className="text-slate-400"/> {item.agentName}
                            </span>
                        </td>

                        {/* Blok / Bölüm */}
                        <td className="py-4 px-4 align-top pt-5">
                          <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block w-max border border-slate-200">
                             {item.block} / {item.flat}
                          </span>
                        </td>

                        {/* Ev Sahibi */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-700 font-medium">{item.ownerName}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Phone size={12} /> {item.ownerPhone}
                            </span>
                          </div>
                        </td>

                        {/* Durum */}
                        <td className="py-4 px-4 align-top pt-5">
                          <span className={`inline-flex items-center gap-1 border rounded-full ${getStatusClasses(item.status)}`}>
                            {getStatusIcon(item.status)} {item.status}
                          </span>
                        </td>

                        {/* Tip */}
                        <td className="py-4 px-4 align-top pt-5">
                          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                            {getTypeIcon(item.type)} {item.type}
                          </span>
                        </td>

                        {/* İsteğe Bağlı Sütunlar */}
                        {visibleColumns.includes('price') && (
                            <td className="py-4 px-4 align-top pt-5 font-bold text-slate-700">
                                {item.price}
                            </td>
                        )}
                        {visibleColumns.includes('location') && (
                            <td className="py-4 px-4 align-top pt-5 text-slate-500">
                                {item.location}
                            </td>
                        )}
                        {visibleColumns.includes('createdAt') && (
                            <td className="py-4 px-4 align-top pt-5 text-slate-500">
                                {item.createdAt}
                            </td>
                        )}
                        
                        {/* İşlemler */}
                        <td className="py-4 px-4 text-center align-top pt-4">
                          <button onClick={() => openEditModal(item)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
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
        <SecondHandEditModal
          isOpen={isEditModalOpen}
          data={selectedListingForEdit}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateListing}
        />
        <NewSecondHandModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddListing}
        />
      </main>
    </div>
  );
}

export default SecondHandListings;
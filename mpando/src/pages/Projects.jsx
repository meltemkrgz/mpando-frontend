import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  Pencil, 
  X, 
  ChevronDown, 
  Columns,
  Clock,      
  AlertCircle, 
  Hourglass,   
  CheckCircle,
  Filter      // Yeni eklendi: Filter ikonu
} from 'lucide-react';

// Yardımcı fonksiyonlar (Component dışında tanımlanabilir)
const getStatusClasses = (status) => {
  switch (status) {
    case 'Devam Ediyor':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Gecikmede':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Bitiyor': // Yakın zamanda bitecek durumlar için
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Tamamlandı':
      return 'bg-green-50 text-green-700 border-green-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Devam Ediyor':
      return <Clock size={14} />; // Devam eden projeler için saat ikonu
    case 'Gecikmede':
      return <AlertCircle size={14} />; // Gecikmeli projeler için uyarı ikonu
    case 'Bitiyor':
      return <Hourglass size={14} />; // Bitiyor durumundaki projeler için kum saati ikonu
    case 'Tamamlandı':
      return <CheckCircle size={14} />; // Tamamlanmış projeler için onay ikonu
    default:
      return null; // Tanımlanmayan durumlar için ikon yok
  }
};

const initialProjectList = [
  { 
    id: 1, 
    company: 'ABC İnşaat', 
    unit: '18', 
    address: 'İstanbul, Maslak', 
    status: 'Devam Ediyor', 
    created_at: '01.01.2024', 
    created_by: 'Ali Yılmaz', 
    description: 'Maslak bölgesinde lüks konut projesi.', 
    startDate: '2023-01-10', 
    endDate: '2024-12-31', 
    contractor: 'Ali Yılmaz' 
  },
  { 
    id: 2, 
    company: 'XYZ Yapı', 
    unit: '32', 
    address: 'Ankara, Çankaya', 
    status: 'Gecikmede', 
    created_at: '15.03.2024', 
    created_by: 'Ahmet Korkmaz', 
    description: 'Çankaya\'da ofis ve AVM kompleksi.', 
    startDate: '2022-02-01', 
    endDate: '2024-06-01', 
    contractor: 'Ahmet Korkmaz' 
  },
  { 
    id: 3, 
    company: 'LMN Proje', 
    unit: '14', 
    address: 'İzmir, Alsancak', 
    status: 'Bitiyor', 
    created_at: '10.02.2024', 
    created_by: 'Ali Yılmaz', 
    description: 'Alsancak sahil şeridinde butik otel.', 
    startDate: '2023-05-15', 
    endDate: '2024-08-15', 
    contractor: 'Ali Yılmaz' 
  },
  { 
    id: 4, 
    company: 'TGR Konut', 
    unit: '6', 
    address: 'Antalya, Lara', 
    status: 'Tamamlandı', 
    created_at: '20.06.2023', 
    created_by: 'Ayşe Demir', 
    description: 'Lara plajına yakın villa projesi.', 
    startDate: '2022-03-01', 
    endDate: '2023-05-20', 
    contractor: 'Veli Can' 
  },
];

const initialNewProjectData = {
  company: '', 
  unit: '', 
  address: '', 
  status: 'Devam Ediyor',
  description: '', 
  startDate: '', 
  endDate: '', 
  contractor: ''
};

const optionalColumns = [
  { key: 'description', label: 'Açıklama' },
  { key: 'startDate', label: 'Başlangıç Tarihi' },
  { key: 'endDate', label: 'Bitiş Tarihi' },
  { key: 'contractor', label: 'Müteahhit' },
];

// Bileşenleri ayırmak kod okunabilirliğini artırır.
function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <div className="flex items-center gap-2">
        {action}
      </div>
    </div>
  );
}

function Projects() {
  // --- STATE YÖNETİMİ ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjectList);
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  // Modallar için state'ler
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState(initialNewProjectData);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  // Sütun görünürlüğü için state'ler
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]); 
  const dropdownRef = useRef(null); 

  // --- EFFECT'LER ---
  useEffect(() => {
    // Dropdown menüsü dışına tıklandığında kapatma
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsColumnDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  // --- HANDLER FONKSİYONLARI ---

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Proje Seçim İşlemleri
  const handleSelectProject = (id) => { 
    setSelectedProjects(prev => 
      prev.includes(id) 
        ? prev.filter(projId => projId !== id) 
        : [...prev, id]
    ); 
  };

  const handleSelectAll = () => { 
    if (selectedProjects.length === projects.length) { 
      setSelectedProjects([]); 
    } else { 
      setSelectedProjects(projects.map((proj) => proj.id)); 
    } 
  };

  const handleDeleteSelected = () => { 
    if (window.confirm(`${selectedProjects.length} projeyi silmek istediğinize emin misiniz?`)) { 
      setProjects(projects.filter((proj) => !selectedProjects.includes(proj.id))); 
      setSelectedProjects([]); 
    } 
  };
  
  // Sütun Görünürlüğü
  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };
  
  // Yeni Proje Ekleme Modalı
  const openAddModal = () => setIsAddModalOpen(true);
  
  const closeAddModal = () => { 
    setIsAddModalOpen(false); 
    setNewProjectData(initialNewProjectData); // Modal kapanınca formu sıfırla
  };

  const handleNewProjectChange = (e) => { 
    const { name, value } = e.target; 
    setNewProjectData(prevData => ({ 
      ...prevData, 
      [name]: value, 
    })); 
  };

  const handleAddNewProject = () => {
    if (!newProjectData.company || !newProjectData.unit) { 
      alert('Proje Adı ve Ünite alanları zorunludur.'); 
      return; 
    }
    const newProject = { 
      id: Date.now(), 
      ...newProjectData, 
      created_at: new Date().toLocaleDateString('tr-TR'), 
      created_by: 'Mevcut Kullanıcı' 
    };
    setProjects([newProject, ...projects]);
    closeAddModal();
  };

  // Proje Düzenleme Modalı
  const openEditModal = (project) => {
    setSelectedProjectForEdit(project);
    setEditFormData({ ...project }); // Düzenlenecek projenin verilerini form state'ine kopyala
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setSelectedProjectForEdit(null);
      setEditFormData(null); // State'i temizle
    }, 300); // Animasyonun bitmesi için küçük bir gecikme
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProject = () => {
    if (!editFormData.company) {
      alert('Proje Adı boş bırakılamaz.');
      return;
    }
    // Ana proje listesini güncelle
    setProjects(prevProjects =>
      prevProjects.map(proj =>
        proj.id === selectedProjectForEdit.id ? { ...proj, ...editFormData } : proj
      )
    );
    closeEditModal();
  };

  // Filtre butonu için placeholder handler
  const handleOpenFilter = () => {
    alert('Filtreleme özelliği henüz geliştirilme aşamasındadır.');
    // Burada bir filtreleme modalı açabilir veya filtreleme UI'ını gösterebilirsiniz.
  };


  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        closeMobileMenu={() => setIsMobileMenuOpen(false)} 
      />
      
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0 relative">
        <Navbar 
          title="Projeler" 
          toggleMobileMenu={toggleMobileMenu} 
        />

        <div className="px-8 pb-12 pt-4 space-y-8">
          <SectionHeader
            title="Proje Listesi"
            action={
              <>
                {/* YENİ EKLENEN FİLTRE BUTONU */}
                <button 
                  onClick={handleOpenFilter} 
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Filter size={14} /> Filtrele
                </button>
                <div 
                  className="relative" 
                  ref={dropdownRef}
                >
                  <button 
                    onClick={() => setIsColumnDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Columns size={14} /> Sütunlar
                  </button>
                  {isColumnDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-in fade-in-25">
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-400 px-2 pt-1 pb-2">
                          Sütunları Göster
                        </p>
                        {optionalColumns.map(col => (
                          <label 
                            key={col.key} 
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                          >
                            <input 
                              type="checkbox"
                              checked={visibleColumns.includes(col.key)}
                              onChange={() => toggleColumnVisibility(col.key)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                            />
                            <span className="text-sm text-slate-700">
                              {col.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={openAddModal} 
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Yeni Proje
                </button>
              </>
            }
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {selectedProjects.length > 0 && (
                <div className="flex items-center justify-between border border-slate-200 p-3 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center bg-blue-600 text-white w-6 h-6 rounded-full text-xs font-bold">
                        {selectedProjects.length}
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        proje seçildi
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <button 
                        onClick={handleSelectAll} 
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg"
                      >
                        <CheckSquare size={16} />
                        <span className="hidden sm:inline">
                          {selectedProjects.length === projects.length ? 'Seçimi Temizle' : 'Tümünü Seç'}
                        </span>
                      </button>
                      <div className="w-px h-5 bg-slate-300"></div>
                      <button 
                        onClick={handleDeleteSelected} 
                        className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Sil</span>
                      </button>
                    </div>
                </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pl-2 w-10"></th>
                    <th className="pb-3">Proje Adı</th>
                    <th className="pb-3">Durum</th>
                    <th className="pb-3">Ünite</th>
                    {visibleColumns.includes('description') && <th className="pb-3">Açıklama</th>}
                    {visibleColumns.includes('startDate') && <th className="pb-3">Başlangıç Tarihi</th>}
                    {visibleColumns.includes('endDate') && <th className="pb-3">Bitiş Tarihi</th>}
                    {visibleColumns.includes('contractor') && <th className="pb-3">Müteahhit</th>}
                    <th className="pb-3">Oluşturan</th>
                    <th className="pb-3">Oluşturulma Tarihi</th>
                    <th className="pb-3 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {projects.length === 0 ? (
                    <tr>
                      <td 
                        colSpan={7 + visibleColumns.length} 
                        className="py-8 text-center text-slate-500"
                      >
                        Gösterilecek proje bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    projects.map((proj) => (
                      <tr 
                        key={proj.id} 
                        className={`group transition-colors border-b border-slate-50 last:border-none ${selectedProjects.includes(proj.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                      >
                        <td className="py-4 pl-2">
                          <input 
                            type="checkbox" 
                            checked={selectedProjects.includes(proj.id)} 
                            onChange={() => handleSelectProject(proj.id)} 
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                          />
                        </td>
                        <td className="py-4 font-medium text-slate-700">
                          {proj.company}
                        </td>
                        <td className="py-4 text-slate-700">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClasses(proj.status)}`}>
                            {getStatusIcon(proj.status)} {proj.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-700">
                          {proj.unit}
                        </td>
                        {visibleColumns.includes('description') && 
                          <td 
                            className="py-4 text-slate-500 max-w-xs truncate" 
                            title={proj.description}
                          >
                            {proj.description}
                          </td>
                        }
                        {visibleColumns.includes('startDate') && 
                          <td className="py-4 text-slate-500">
                            {proj.startDate}
                          </td>
                        }
                        {visibleColumns.includes('endDate') && 
                          <td className="py-4 text-slate-500">
                            {proj.endDate}
                          </td>
                        }
                        {visibleColumns.includes('contractor') && 
                          <td className="py-4 text-slate-500">
                            {proj.contractor}
                          </td>
                        }
                        <td className="py-4 text-slate-500">
                          {proj.created_by}
                        </td>
                        <td className="py-4 text-slate-500">
                          {proj.created_at}
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => openEditModal(proj)} 
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all shadow-sm"
                          >
                            <Pencil size={14} />
                            Düzenle
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

        {/* --- DÜZENLEME MODALI --- */}
        {isEditModalOpen && editFormData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateProject(); }}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">
                    Projeyi Düzenle
                  </h3>
                  <button 
                    type="button" 
                    onClick={closeEditModal} 
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
                      value={editFormData.company} 
                      onChange={handleEditFormChange} 
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
                      value={editFormData.address} 
                      onChange={handleEditFormChange} 
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
                      value={editFormData.unit} 
                      onChange={handleEditFormChange} 
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
                      value={editFormData.description} 
                      onChange={handleEditFormChange} 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={editFormData.startDate} 
                      onChange={handleEditFormChange} 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={editFormData.endDate} 
                      onChange={handleEditFormChange} 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Müteahhit
                    </label>
                    <input 
                      type="text" 
                      name="contractor" 
                      value={editFormData.contractor} 
                      onChange={handleEditFormChange} 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Durumu
                    </label>
                    <div className="relative">
                      <select 
                        name="status" 
                        value={editFormData.status} 
                        onChange={handleEditFormChange} 
                        className="w-full appearance-none border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                      >
                        <option>Devam Ediyor</option>
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
                    onClick={closeEditModal} 
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
        )}

        {/* --- YENİ PROJE EKLEME MODALI --- */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">
                  Yeni Proje Ekle
                </h3>
                <button 
                  onClick={closeAddModal} 
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddNewProject(); }}>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label 
                      htmlFor="company" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Proje Adı
                    </label>
                    <input 
                      id="company" 
                      name="company" 
                      type="text" 
                      value={newProjectData.company} 
                      onChange={handleNewProjectChange} 
                      placeholder="Örn: ABC İnşaat" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="address" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Adres
                    </label>
                    <input 
                      id="address" 
                      name="address" 
                      type="text" 
                      value={newProjectData.address} 
                      onChange={handleNewProjectChange} 
                      placeholder="Örn: İstanbul, Maslak" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="unit" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Ünite Sayısı
                    </label>
                    <input 
                      id="unit" 
                      name="unit" 
                      type="number" 
                      value={newProjectData.unit} 
                      onChange={handleNewProjectChange} 
                      placeholder="Örn: 24" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="description" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Açıklama
                    </label>
                    <textarea 
                      id="description" 
                      name="description" 
                      rows="3" 
                      value={newProjectData.description} 
                      onChange={handleNewProjectChange} 
                      placeholder="Proje hakkında kısa açıklama..." 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label 
                      htmlFor="startDate" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Başlangıç Tarihi
                    </label>
                    <input 
                      id="startDate" 
                      name="startDate" 
                      type="date" 
                      value={newProjectData.startDate} 
                      onChange={handleNewProjectChange} 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="endDate" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Bitiş Tarihi
                    </label>
                    <input 
                      id="endDate" 
                      name="endDate" 
                      type="date" 
                      value={newProjectData.endDate} 
                      onChange={handleNewProjectChange} 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="contractor" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Müteahhit
                    </label>
                    <input 
                      id="contractor" 
                      name="contractor" 
                      type="text" 
                      value={newProjectData.contractor} 
                      onChange={handleNewProjectChange} 
                      placeholder="Müteahhit firma veya kişi" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor="status" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Durumu
                    </label>
                    <div className="relative">
                      <select 
                        id="status" 
                        name="status" 
                        value={newProjectData.status} 
                        onChange={handleNewProjectChange} 
                        className="w-full appearance-none border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                      >
                        <option>Devam Ediyor</option>
                        <option>Gecikmede</option>
                        <option>Bitiyor</option>
                        <option>Tamamlandı</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-5 border-t border-blue-100 bg-blue-50">
                  <button 
                    type="button" 
                    onClick={closeAddModal} 
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
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
        )}
      </main>
    </div>
  );
}

export default Projects;
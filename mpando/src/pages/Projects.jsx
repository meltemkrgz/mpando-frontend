import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProjectEditModal from '../modals/ProjectEditModal';
import NewProjectModal from '../modals/NewProjectModal'; // Yeni import
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Trash2,
  CheckSquare,
  Pencil,
  Columns,
  Clock,
  AlertCircle,
  Hourglass,
  CheckCircle,
  Filter
} from 'lucide-react';

const getStatusClasses = (status) => {
  switch (status) {
    case 'Devam Ediyor': return 'bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold px-2 py-1';
    case 'Gecikmede': return 'bg-red-50 text-red-700 border-red-200 text-[10px] font-bold px-2 py-1';
    case 'Bitiyor': return 'bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] font-bold px-2 py-1';
    case 'Tamamlandı': return 'bg-green-50 text-green-700 border-green-200 text-[10px] font-bold px-2 py-1';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-bold px-2 py-1';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Devam Ediyor': return <Clock size={14} />;
    case 'Gecikmede': return <AlertCircle size={14} />;
    case 'Bitiyor': return <Hourglass size={14} />;
    case 'Tamamlandı': return <CheckCircle size={14} />;
    default: return null;
  }
};

const getProgressBarColor = (status) => {
  switch (status) {
    case 'Devam Ediyor': return 'bg-blue-600';
    case 'Planlanıyor': return 'bg-purple-500';
    case 'Gecikmede': return 'bg-red-500';
    case 'Bitiyor': return 'bg-yellow-500'; // Bitiyor için sarı
    case 'Tamamlandı': return 'bg-green-600';
    default: return 'bg-slate-500';
  }
};

// --- Örnek Projeler ---
const initialProjectList = [
  { id: 1, company: 'AKSU', unit: '18', address: '', status: 'Devam Ediyor', created_at: '01.01.2024', created_by: 'Ali Yılmaz', description: '', startDate: '2023-01-10', endDate: '2024-12-31', contractor: 'Ali Yılmaz' },
  { id: 2, company: 'Dolunay Yaşam Merkezi', unit: '32', address: '', status: 'Gecikmede', created_at: '15.03.2024', created_by: 'Ahmet Korkmaz', description: '', startDate: '2022-02-01', endDate: '2024-06-01', contractor: 'Ahmet Korkmaz' },
  { id: 3, company: 'İŞHAN Rezidans', unit: '14', address: '', status: 'Bitiyor', created_at: '10.02.2024', created_by: 'Ali Yılmaz', description: '', startDate: '2023-05-15', endDate: '2024-08-15', contractor: 'Ali Yılmaz' },
  { id: 4, company: 'İSKAMALL Yaşam Merkezi ', unit: '6', address: '', status: 'Tamamlandı', created_at: '20.06.2023', created_by: 'Ayşe Demir', description: '', startDate: '2022-03-01', endDate: '2023-05-20', contractor: 'Veli Can' },
];

const initialNewProjectData = { company: '', unit: '', address: '', status: 'Devam Ediyor', description: '', startDate: '', endDate: '', contractor: '' };

const optionalColumns = [
  { key: 'description', label: 'Açıklama' },
  { key: 'startDate', label: 'Başlangıç Tarihi' },
  { key: 'endDate', label: 'Bitiş Tarihi' },
  { key: 'contractor', label: 'Müteahhit' },
  { key: 'created_at', label: 'Oluşturulma Tarihi' },
];

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">{action}</div>
    </div>
  );
}

function Projects() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const { user } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState(initialNewProjectData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const columnDropdownRef = useRef(null);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Hepsi');
  const filterDropdownRef = useRef(null);

  const allStatusOptions = ['Hepsi', ...new Set(projects.map(p => p.status))];

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

  // Projeleri API'den Çekme
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user && user.company_id) {
          const data = await api.get('/projects');
          const filteredData = (data || []).filter(p => String(p.contractor_id) === String(user.company_id));

          const mappedProjects = filteredData.map(p => {
            let mappedStatus = 'Devam Ediyor';
            const rawStatus = String(p.status || '').toUpperCase();

            if (rawStatus === 'IN_PROGRESS' || p.status === 'Devam Ediyor') {
              mappedStatus = 'Devam Ediyor';
            } else if (rawStatus === 'PLANNING' || p.status === 'Planlanıyor') {
              mappedStatus = 'Planlanıyor';
            } else if (rawStatus === 'COMPLETED' || p.status === 'Tamamlandı') {
              mappedStatus = 'Tamamlandı';
            } else if (rawStatus === 'DELAYED' || p.status === 'Gecikmede') {
              mappedStatus = 'Gecikmede';
            } else if (p.status === 'Bitiyor') {
              mappedStatus = 'Bitiyor';
            }

            return {
              id: p.id,
              company: p.name || p.project_name || p.title || 'İsimsiz Proje',
              unit: p.total_units !== undefined && p.total_units !== null ? p.total_units : (p.unit_count !== undefined && p.unit_count !== null ? p.unit_count : '-'),
              address: p.address || p.location || '',
              status: mappedStatus,
              progress: p.progress !== undefined && p.progress !== null
                ? p.progress
                : (mappedStatus === 'Planlanıyor' ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 50) + 30),
              created_at: p.created_at ? p.created_at.split('T')[0] : 'Belirtilmedi',
              created_by: p.creator_name || (p.users ? p.users.email : 'Sistem'),
              description: p.description || '',
              startDate: p.start_date || p.start || '',
              endDate: p.end_date || p.end || '',
              contractor: p.companies?.name || 'Şirket Personeli',
            };
          });
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error("Projeler sayfası API hatası: ", err);
      }
    };
    fetchProjects();
  }, [user]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const handleSelectProject = (id) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const currentProjectIds = filteredProjects.map(p => p.id);
    if (selectedProjects.length === currentProjectIds.length && selectedProjects.every(id => currentProjectIds.includes(id))) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(currentProjectIds);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`${selectedProjects.length} projeyi silmek istediğinize emin misiniz?`)) {
      setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));
      setSelectedProjects([]);
    }
  };

  const toggleColumnVisibility = (key) => {
    setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => { setIsAddModalOpen(false); setNewProjectData(initialNewProjectData); };

  const handleNewProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewProject = () => {
    if (!newProjectData.company || !newProjectData.unit) { alert('Proje Adı ve Ünite alanları zorunludur.'); return; }
    const newProject = {
      id: Date.now(),
      ...newProjectData,
      created_at: new Date().toLocaleDateString('tr-TR'),
      created_by: 'Mevcut Kullanıcı' // Bu değeri dinamik olarak alın
    };
    setProjects([newProject, ...projects]);
    closeAddModal();
  };

  const openEditModal = (project) => { setSelectedProjectForEdit(project); setEditFormData({ ...project }); setIsEditModalOpen(true); };
  const closeEditModal = () => { setIsEditModalOpen(false); setTimeout(() => { setSelectedProjectForEdit(null); setEditFormData(null); }, 300); };
  const handleEditFormChange = (e) => { const { name, value } = e.target; setEditFormData(prev => ({ ...prev, [name]: value })); };
  const handleUpdateProject = () => {
    if (!editFormData.company) { alert('Proje Adı boş bırakılamaz.'); return; }
    setProjects(prev => prev.map(p => p.id === selectedProjectForEdit.id ? { ...p, ...editFormData } : p));
    closeEditModal();
  };

  const toggleFilterDropdown = () => setIsFilterDropdownOpen(prev => !prev);
  const handleFilterChange = (status) => {
    setSelectedStatusFilter(status);
    setIsFilterDropdownOpen(false);
    setSelectedProjects([]);
  };

  const filteredProjects = selectedStatusFilter === 'Hepsi'
    ? projects
    : projects.filter(proj => proj.status === selectedStatusFilter);

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0 relative">
        <Navbar title="Projeler" toggleMobileMenu={toggleMobileMenu} />

        <div className="px-4 sm:px-6 md:px-8 pb-12 pt-4 space-y-8">
          <SectionHeader
            title="Proje Listesi"
            action={
              <>
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
                            {selectedStatusFilter === option && <CheckCircle size={16} className="text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={columnDropdownRef}>
                  <button
                    onClick={() => setIsColumnDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Columns size={14} />
                  </button>
                  {isColumnDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-in fade-in-25">
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-400 px-2 pt-1 pb-2">Sütunları Göster</p>
                        {optionalColumns.map(col => (
                          <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" checked={visibleColumns.includes(col.key)} onChange={() => toggleColumnVisibility(col.key)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" />
                            <span className="text-sm text-slate-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={openAddModal} className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm px-3 py-1.5 rounded-lg transition-colors">
                  <Plus size={14} /> Yeni Proje
                </button>
              </>
            }
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {selectedProjects.length > 0 && (
              <div className="flex flex-wrap items-center justify-between border border-slate-200 p-3 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="flex items-center justify-center bg-blue-600 text-white w-6 h-6 rounded-full text-xs font-bold">{selectedProjects.length}</span>
                  <span className="text-sm font-medium text-slate-700">proje seçildi</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <button onClick={handleSelectAll} className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
                    <CheckSquare size={16} />
                    <span className="hidden sm:inline">{selectedProjects.length === filteredProjects.length ? 'Seçimi Temizle' : 'Tümünü Seç'}</span>
                  </button>
                  <div className="w-px h-5 bg-slate-300"></div>
                  <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} /> <span>Sil</span>
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pl-2 w-10"></th>
                    <th className="pb-3 px-4">Proje Adı</th>
                    <th className="pb-3 px-4">Durum</th>
                    <th className="pb-3 px-4 min-w-[150px]">İlerleme</th>
                    <th className="pb-3 px-4">Ünite</th>
                    {visibleColumns.includes('description') && <th className="pb-3 px-4">Açıklama</th>}
                    {visibleColumns.includes('startDate') && <th className="pb-3 px-4">Başlangıç Tarihi</th>}
                    {visibleColumns.includes('endDate') && <th className="pb-3 px-4">Bitiş Tarihi</th>}
                    {visibleColumns.includes('contractor') && <th className="pb-3 px-4">Müteahhit</th>}
                    <th className="pb-3 px-4">Oluşturan</th>
                    {visibleColumns.includes('created_at') && <th className="pb-3 px-4">Oluşturulma Tarihi</th>}
                    <th className="pb-3 px-4 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6 + visibleColumns.length} className="py-8 text-center text-slate-500">
                        {selectedStatusFilter === 'Hepsi' ? 'Gösterilecek proje bulunamadı.' : `"${selectedStatusFilter}" durumunda proje bulunamadı.`}
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map(proj => (
                      <tr key={proj.id} className={`group transition-colors border-b border-slate-50 last:border-none ${selectedProjects.includes(proj.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                        <td className="py-4 pl-2">
                          <input type="checkbox" checked={selectedProjects.includes(proj.id)} onChange={() => handleSelectProject(proj.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" />
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-700">{proj.company}</td>
                        <td className="py-4 px-4 text-slate-700">
                          <span className={`inline-flex items-center gap-1 border rounded-full ${getStatusClasses(proj.status)}`}>
                            {getStatusIcon(proj.status)} {proj.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex-1">
                              <div
                                className={`h-1.5 rounded-full ${getProgressBarColor(proj.status)}`}
                                style={{ width: `${proj.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-slate-500 w-8">
                              %{proj.progress}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-700">{proj.unit}</td>
                        {visibleColumns.includes('description') && <td className="py-4 px-4 text-slate-500 max-w-xs truncate" title={proj.description}>{proj.description}</td>}
                        {visibleColumns.includes('startDate') && <td className="py-4 px-4 text-slate-500">{proj.startDate}</td>}
                        {visibleColumns.includes('endDate') && <td className="py-4 px-4 text-slate-500">{proj.endDate}</td>}
                        {visibleColumns.includes('contractor') && <td className="py-4 px-4 text-slate-500">{proj.contractor}</td>}
                        <td className="py-4 px-4 text-slate-500">{proj.created_by}</td>
                        {visibleColumns.includes('created_at') && <td className="py-4 px-4 text-slate-500">{proj.created_at}</td>}
                        <td className="py-4 px-4 text-center">
                          <button onClick={() => openEditModal(proj)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
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

        <ProjectEditModal
          isOpen={isEditModalOpen}
          projectData={editFormData}
          onClose={closeEditModal}
          onChange={handleEditFormChange}
          onSave={handleUpdateProject}
        />

        <NewProjectModal
          isOpen={isAddModalOpen}
          formData={newProjectData}
          onClose={closeAddModal}
          onChange={handleNewProjectChange}
          onAdd={handleAddNewProject}
        />
      </main>
    </div>
  );
}

export default Projects;
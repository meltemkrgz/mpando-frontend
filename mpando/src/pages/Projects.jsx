import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  Filter,
  Search,
  Briefcase,
  Hash,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';

const getStatusClasses = (status) => {
  switch (status) {
    case 'Devam Ediyor': return 'bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold px-2 py-1';
    case 'Planlanıyor': return 'bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-bold px-2 py-1';
    case 'Gecikmede': return 'bg-red-50 text-red-700 border-red-200 text-[10px] font-bold px-2 py-1';
    case 'Bitiyor': return 'bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] font-bold px-2 py-1';
    case 'Tamamlandı': return 'bg-green-50 text-green-700 border-green-200 text-[10px] font-bold px-2 py-1';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-bold px-2 py-1';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Devam Ediyor': return <Clock size={14} />;
    case 'Planlanıyor': return <Hourglass size={14} />;
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
    case 'Bitiyor': return 'bg-yellow-500';
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

const initialNewProjectData = {
  company: '',
  unit: '',
  address: '',
  status: 'Devam Ediyor',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  contractor: '',
  contractor_id: ''
};

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
  const [siteEngineers, setSiteEngineers] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (user && user.company_id) {
        // Müteahhitleri (Site Engineers) Çekme
        try {
          const usersData = await api.get('/users');
          // Giriş yapan kullanıcının şirketindeki SITE_ENGINEER rolündekileri filtrele
          const engineers = (usersData || []).filter(u =>
            String(u.company_id) === String(user.company_id) &&
            u.role === 'SITE_ENGINEER'
          );
          setSiteEngineers(engineers);
        } catch (uErr) {
          console.error("Kullanıcılar çekilemedi:", uErr);
        }

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
            progress: mappedStatus === 'Tamamlandı' ? 100
              : (p.progress !== undefined && p.progress !== null
                ? p.progress
                : (mappedStatus === 'Planlanıyor' ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 50) + 30)),
            created_at: p.created_at || 'Belirtilmedi',
            created_by: p.creator_name && p.creator_name !== 'Admin' ? p.creator_name : (p.users?.email ? p.users.email.split('@')[0] : 'Sistem Yöneticisi'),
            description: p.description || '',
            startDate: (() => {
              const raw = p.start_date || p.start || p.created_at;
              if (!raw || raw === '-') return '';
              if (raw.includes('.')) {
                const parts = raw.split('.');
                if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
              return raw.split('T')[0];
            })(),
            endDate: (() => {
              const raw = p.end_date || p.end;
              if (!raw || raw === '-') return '';
              if (String(raw).includes('.')) {
                const parts = raw.split('.');
                if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
              return String(raw).split('T')[0];
            })(),
            contractor: p.users?.full_name || p.users?.name || p.creator_name || 'Atanmamış',
            contractor_id: p.created_by
          };
        });
        setProjects(mappedProjects);
      }
    } catch (err) {
      console.error("Projeler sayfası API hatası: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Projeleri API'den Çekme
  useEffect(() => {
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

  const handleDeleteSelected = async () => {
    if (window.confirm(`${selectedProjects.length} projeyi silmek istediğinize emin misiniz?`)) {
      try {
        await Promise.all(selectedProjects.map(id => api.delete(`/projects/${id}`)));
        setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));
        setSelectedProjects([]);
      } catch (err) {
        console.error("Proje silme hatası:", err);
        alert("Projeler silinirken bir hata oluştu.");
      }
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

  const handleAddNewProject = async () => {
    if (!newProjectData.company || !newProjectData.unit) { alert('Proje Adı ve Ünite alanları zorunludur.'); return; }
    try {
      const status = newProjectData.status;
      let progress = 0;
      if (status === 'Tamamlandı') progress = 100;
      else if (status === 'Devam Ediyor') progress = 10;
      else if (status === 'Planlanıyor') progress = 0;
      else if (status === 'Gecikmede') progress = 5;

      const createData = {
        name: newProjectData.company,
        address: newProjectData.address,
        unit_count: 1, // unit field is used for display, backend expects unit_count
        status: status === 'Devam Ediyor' ? 'IN_PROGRESS' :
          status === 'Tamamlandı' ? 'COMPLETED' :
            status === 'Planlanıyor' ? 'PLANNING' :
              status === 'Gecikmede' ? 'DELAYED' : 'IN_PROGRESS',
        description: newProjectData.description,
        end_date: newProjectData.endDate || null,
        created_by: newProjectData.contractor_id || user.id,
        contractor_id: user.company_id
      };

      await api.post('/projects', createData);
      await fetchProjects();
      closeAddModal();
    } catch (err) {
      console.error("Proje oluşturma hatası:", err);
      alert("Proje oluşturulurken bir hata oluştu: " + err.message);
    }
  };

  const openEditModal = (project) => { setSelectedProjectForEdit(project); setEditFormData({ ...project }); setIsEditModalOpen(true); };
  const closeEditModal = () => { setIsEditModalOpen(false); setTimeout(() => { setSelectedProjectForEdit(null); setEditFormData(null); }, 300); };
  const handleEditFormChange = (e) => { const { name, value } = e.target; setEditFormData(prev => ({ ...prev, [name]: value })); };
  const handleUpdateProject = async () => {
    if (!editFormData.company) { alert('Proje Adı boş bırakılamaz.'); return; }
    try {
      const status = editFormData.status;

      const updateData = {
        name: editFormData.company,
        address: editFormData.address,
        status: status === 'Devam Ediyor' ? 'IN_PROGRESS' :
          status === 'Tamamlandı' ? 'COMPLETED' :
            status === 'Planlanıyor' ? 'PLANNING' :
              status === 'Gecikmede' ? 'DELAYED' :
                status === 'Bitiyor' ? 'FINISHING' : 'IN_PROGRESS',
        description: editFormData.description,
        end_date: editFormData.endDate || null,
        created_by: editFormData.contractor_id || null
      };

      await api.put(`/projects/${selectedProjectForEdit.id}`, updateData);
      await fetchProjects(); // Backend'den güncel veriyi çekerek senkronize olalım
      closeEditModal();
    } catch (err) {
      console.error("Proje güncelleme hatası:", err);
      alert("Proje güncellenirken bir hata oluştu: " + err.message);
    }
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

          <div className="space-y-6">
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

            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse shadow-sm">
                      <div className="flex justify-between mb-4">
                        <div className="h-6 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-6 bg-slate-50 rounded-full w-20"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-50 rounded w-5/6"></div>
                        <div className="h-8 bg-slate-100 rounded-xl w-full mt-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p>{selectedStatusFilter === 'Hepsi' ? 'Gösterilecek proje bulunamadı.' : `"${selectedStatusFilter}" durumunda proje bulunamadı.`}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => navigate(`/projects/${proj.id}`)}
                      className={`relative group bg-white rounded-2xl border transition-all p-6 cursor-pointer ${selectedProjects.includes(proj.id) ? 'border-blue-500 ring-2 ring-blue-500/10 bg-blue-50/10' : 'border-slate-200 hover:border-blue-200 hover:shadow-md'}`}
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(proj.id)}
                          onChange={() => handleSelectProject(proj.id)}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="flex justify-between items-start mb-4 pl-8">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1" title={proj.company}>
                            {proj.company}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium">#{proj.id}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${getStatusClasses(proj.status)}`}>
                          {getStatusIcon(proj.status)} {proj.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">İlerleme</span>
                            <span className="text-blue-600">%{proj.progress}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(proj.status)}`}
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <div className="p-1.5 bg-slate-50 rounded-lg"><Hash size={14} className="text-slate-400" /></div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ünite</p>
                              <p className="text-xs font-semibold">{proj.unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <div className="p-1.5 bg-slate-50 rounded-lg"><Users size={14} className="text-slate-400" /></div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sorumlu</p>
                              <p className="text-xs font-semibold truncate max-w-[80px]" title={proj.contractor}>{proj.contractor}</p>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Info Area */}
                        <div className="space-y-2 pt-2 border-t border-slate-50">
                          {proj.address && (
                            <div className="flex items-start gap-2 text-slate-500">
                              <MapPin size={14} className="mt-0.5 shrink-0" />
                              <p className="text-xs line-clamp-1" title={proj.address}>{proj.address}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={14} className="shrink-0" />
                            <p className="text-[11px] font-medium">Bitiş: {proj.endDate || '-'}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(proj); }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100"
                          >
                            <Pencil size={15} /> Düzenle
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <ProjectEditModal
          isOpen={isEditModalOpen}
          projectData={editFormData}
          contractors={siteEngineers}
          onClose={closeEditModal}
          onChange={handleEditFormChange}
          onSave={handleUpdateProject}
        />

        <NewProjectModal
          isOpen={isAddModalOpen}
          formData={newProjectData}
          contractors={siteEngineers}
          onClose={closeAddModal}
          onChange={handleNewProjectChange}
          onAdd={handleAddNewProject}
        />
      </main>
    </div>
  );
}

export default Projects;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProjectEditModal from '../modals/ProjectEditModal';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Users,
    Hash,
    Briefcase,
    FileText,
    Clock,
    AlertCircle,
    Building2,
    Layers,
    Home,
    Maximize,
    ChevronDown,
    ChevronUp,
    Pencil
} from 'lucide-react';

const getStatusClasses = (status) => {
    switch (status) {
        case 'IN_PROGRESS':
        case 'Devam Ediyor': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'PLANNING':
        case 'Planlanıyor': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'DELAYED':
        case 'Gecikmede': return 'bg-red-50 text-red-700 border-red-200';
        case 'FINISHING':
        case 'Bitiyor': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'COMPLETED':
        case 'Tamamlandı': return 'bg-green-50 text-green-700 border-green-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
};

const mapStatusToTurkish = (status) => {
    switch (status) {
        case 'IN_PROGRESS': return 'Devam Ediyor';
        case 'PLANNING': return 'Planlanıyor';
        case 'DELAYED': return 'Gecikmede';
        case 'FINISHING': return 'Bitiyor';
        case 'COMPLETED': return 'Tamamlandı';
        default: return status || 'Belirsiz';
    }
};

const getProgressBarColor = (status) => {
    switch (status) {
        case 'IN_PROGRESS':
        case 'Devam Ediyor': return 'bg-blue-600';
        case 'PLANNING':
        case 'Planlanıyor': return 'bg-purple-500';
        case 'DELAYED':
        case 'Gecikmede': return 'bg-red-500';
        case 'FINISHING':
        case 'Bitiyor': return 'bg-yellow-500';
        case 'COMPLETED':
        case 'Tamamlandı': return 'bg-green-600';
        default: return 'bg-slate-500';
    }
};

const ProjectStructure = ({ blocks }) => {
    const [expandedBlocks, setExpandedBlocks] = useState({});

    if (!blocks || blocks.length === 0) return null;

    const toggleBlock = (blockId) => {
        setExpandedBlocks(prev => ({
            ...prev,
            [blockId]: !prev[blockId]
        }));
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                Proje Yapısı (Bloklar ve Üniteler)
            </h2>
            <div className="space-y-4">
                {blocks.map(block => {
                    const isExpanded = !!expandedBlocks[block.id];
                    return (
                        <div key={block.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all duration-200">
                            <div
                                className="bg-slate-50 p-4 font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleBlock(block.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <Building2 size={18} className="text-slate-500" />
                                    {block.name}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                                        {block.floor_count} Kat
                                    </span>
                                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="p-4 bg-white space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {(block.floors || []).map(floor => (
                                        <div key={floor.id} className="ml-2 md:ml-4 border-l-2 border-slate-100 pl-4 py-2">
                                            <div className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
                                                <Layers size={16} className="text-blue-500" />
                                                {floor.floor_number}. Kat <span className="text-xs text-slate-400 font-normal ml-2">(Yükseklik: {floor.height_cm}cm)</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(floor.units || []).map(unit => (
                                                    <div key={unit.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                        <div className="font-semibold text-sm text-slate-800 flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <Home size={14} className="text-orange-500" />
                                                                {unit.unit_number}
                                                            </div>
                                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold shadow-sm">
                                                                {unit.unit_type}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1.5 mt-3">
                                                            {(unit.rooms || []).map(room => (
                                                                <div key={room.id} className="flex items-center justify-between text-xs text-slate-600 bg-white rounded border border-slate-100 px-2 py-1.5 shadow-sm">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Maximize size={12} className="text-slate-400" />
                                                                        {room.name}
                                                                    </div>
                                                                    <div className="flex items-center gap-3 font-medium text-slate-500">
                                                                        <span title="Alan">{room.area_m2} m²</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [siteEngineers, setSiteEngineers] = useState([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    const fetchProjectDetails = async () => {
        setLoading(true);
        try {
            // Müteahhitleri (Site Engineers) Çekme
            try {
                const usersData = await api.get('/users');
                const engineers = (usersData || []).filter(u =>
                    String(u.company_id) === String(user.company_id) &&
                    u.role === 'SITE_ENGINEER'
                );
                setSiteEngineers(engineers);
            } catch (uErr) {
                console.error("Kullanıcılar çekilemedi:", uErr);
            }

            const data = await api.get(`/projects/${id}`);
            setProject(data);
        } catch (err) {
            console.error("Proje detayları alınırken hata:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && id) {
            fetchProjectDetails();
        }
    }, [id, user]);

    const openEditModal = () => {
        // Modalın beklediği formatta veriyi hazırla
        const initialData = {
            company: project.name || project.project_name || '',
            address: project.address || '',
            unit: project.unit_count || 0,
            description: project.description || '',
            contractor_id: project.created_by || '',
            startDate: (() => {
                const raw = project.start_date || project.created_at;
                if (!raw) return '';
                if (String(raw).includes('.')) {
                    const parts = raw.split('.');
                    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return String(raw).split('T')[0];
            })(),
            endDate: (() => {
                const raw = project.end_date;
                if (!raw) return '';
                if (String(raw).includes('.')) {
                    const parts = raw.split('.');
                    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return String(raw).split('T')[0];
            })(),
            status: mapStatusToTurkish(project.status)
        };
        setEditFormData(initialData);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditFormData(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

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

            await api.put(`/projects/${id}`, updateData);
            await fetchProjectDetails(); // Sayfayı yenile
            closeEditModal();
        } catch (err) {
            console.error("Proje güncelleme hatası:", err);
            alert("Proje güncellenirken bir hata oluştu: " + err.message);
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const displayStatus = mapStatusToTurkish(project?.status);

    // Progress Logic
    let progress = project?.progress;
    if (typeof progress === 'undefined' || progress === null) {
        if (displayStatus === 'Tamamlandı') progress = 100;
        else if (displayStatus === 'Planlanıyor') progress = 0;
        else progress = 50; // default for unknown
    }

    return (
        <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />

            <main className="flex-1 overflow-y-auto h-screen md:pt-0">
                <Navbar title="Proje Detayları" toggleMobileMenu={toggleMobileMenu} />

                <div className="px-4 sm:px-8 pb-12 pt-3">
                    {/* Geri Butonu */}
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium text-sm"
                    >
                        <ArrowLeft size={16} /> Projelere Dön
                    </button>

                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 h-48"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 h-64"></div>
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 h-64"></div>
                            </div>
                        </div>
                    ) : !project ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Proje Bulunamadı</h3>
                            <p className="text-slate-500 mb-6">Aradığınız proje silinmiş veya erişim yetkiniz olmayabilir.</p>
                            <button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                                Listeye Dön
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                            {/* Header Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                                {/* Status bar top */}
                                <div className={`h-2 w-full ${getProgressBarColor(displayStatus)}`}></div>

                                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                            <h1 className="text-2xl md:text-3xl font-black text-slate-900">{project.name || project.project_name || 'İsimsiz Proje'}</h1>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(displayStatus)}`}>
                                                    {displayStatus}
                                                </span>
                                                <button
                                                    onClick={openEditModal}
                                                    className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                    title="Projeyi Düzenle"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-3 font-medium">
                                            <MapPin size={16} className="text-slate-400" />
                                            {project.address || project.location || 'Adres belirtilmemiş'}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100 w-full md:w-64">
                                        <div className="flex justify-between text-sm font-semibold mb-2">
                                            <span className="text-slate-600">İlerleme Durumu</span>
                                            <span className="text-blue-600">%{progress}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(displayStatus)}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <ProjectStructure blocks={project.blocks} />
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Main Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <FileText size={20} className="text-blue-600" />
                                            Proje Detayları
                                        </h2>

                                        <div className="prose prose-sm md:prose-base text-slate-600 max-w-none">
                                            {project.description ? (
                                                <p className="whitespace-pre-wrap">{project.description}</p>
                                            ) : (
                                                <p className="italic text-slate-400">Açıklama bulunmuyor.</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Başlangıç Tarihi</p>
                                                    <p className="font-semibold text-slate-800">
                                                        {project.start_date || project.created_at ? new Date(project.start_date || project.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belirtilmedi'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bitiş Tarihi</p>
                                                    <p className="font-semibold text-slate-800">
                                                        {project.end_date ? new Date(project.end_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belirtilmedi'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Info */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                        <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                                            <Briefcase size={18} className="text-blue-600" />
                                            Genel Bakış
                                        </h3>

                                        <ul className="space-y-4">
                                            <li className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                                    <Hash size={16} /> <span>Ünite Sayısı</span>
                                                </div>
                                                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                                                    {project.total_units ?? project.unit_count ?? '-'}
                                                </span>
                                            </li>
                                            <li className="flex flex-col gap-2 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                                    <Users size={16} /> <span>Proje Sorumlusu</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                        {(project.creator_name || project.users?.full_name || project.users?.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">
                                                        {project.creator_name || project.users?.full_name || project.users?.name || 'Sistem Yöneticisi'}
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {project.dwg_file_url && (
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-sm p-6 text-white text-center">
                                            <FileText size={32} className="mx-auto mb-3 opacity-90" />
                                            <h3 className="font-bold text-lg mb-1">Teknik Çizimler</h3>
                                            <p className="text-blue-100 text-sm mb-4">Bu projenin DWG/CAD dosyalarını indirebilirsiniz.</p>
                                            <a
                                                href={project.dwg_file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block w-full py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                                            >
                                                Dosyayı Görüntüle / İndir
                                            </a>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <ProjectEditModal
                    isOpen={isEditModalOpen}
                    projectData={editFormData}
                    contractors={siteEngineers}
                    onClose={closeEditModal}
                    onChange={handleEditFormChange}
                    onSave={handleUpdateProject}
                />
            </main>
        </div>
    );
}

export default ProjectDetails;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft,
    Building2,
    Layers,
    Home,
    Maximize,
    AlertCircle,
    Eye
} from 'lucide-react';


const getUnitStatusDetails = (status) => {
    switch (String(status).toUpperCase()) {
        case 'SOLD':
        case 'SATILDI':
            return { label: 'Satıldı', classes: 'bg-red-50 text-red-700 border-red-200' };
        case 'RESERVED':
        case 'REZERVE':
            return { label: 'Rezerve', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
        case 'AVAILABLE':
        case 'SATILIK':
        case 'MÜSAİT':
        default:
            return { label: 'Satılık', classes: 'bg-green-50 text-green-700 border-green-200' };
    }
};

function BlockDetails() {
    const { projectId, blockId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [block, setBlock] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);

    const openFloorModal = (floor) => {
        setSelectedFloor(floor);
        setIsFloorModalOpen(true);
    };

    const closeFloorModal = () => {
        setIsFloorModalOpen(false);
        setTimeout(() => setSelectedFloor(null), 300);
    };

    useEffect(() => {
        const fetchBlockDetails = async () => {
            setLoading(true);
            try {
                // First get project to find the block
                const projectData = await api.get(`/projects/${projectId}`);
                setProject(projectData);

                if (projectData && projectData.blocks) {
                    const foundBlock = projectData.blocks.find(b => String(b.id) === String(blockId));
                    setBlock(foundBlock);
                }
            } catch (err) {
                console.error("Blok detayları alınırken hata:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user && projectId && blockId) {
            fetchBlockDetails();
        }
    }, [projectId, blockId, user]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />

            <main className="flex-1 overflow-y-auto h-screen md:pt-0">
                <Navbar title={block ? `${block.name} Detayı` : "Blok Detayı"} toggleMobileMenu={toggleMobileMenu} />

                <div className="px-4 sm:px-8 pb-12 pt-3">
                    <button
                        onClick={() => navigate(`/projects/${projectId}`)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium text-sm"
                    >
                        <ArrowLeft size={16} /> Proje Detayına Dön
                    </button>

                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 h-32"></div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 h-64"></div>
                        </div>
                    ) : !block ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Blok Bulunamadı</h3>
                            <p className="text-slate-500 mb-6">Aradığınız blok silinmiş veya bulunamıyor olabilir.</p>
                            <button onClick={() => navigate(`/projects/${projectId}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                                Projeye Dön
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* Header */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building2 size={32} className="text-blue-600" />
                                        <h1 className="text-2xl md:text-3xl font-black text-slate-900">{block.name}</h1>
                                    </div>
                                    <p className="text-slate-500 font-medium">Proje: {project?.name || project?.project_name}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center min-w-[100px]">
                                        <span className="text-2xl font-bold">{block.floor_count}</span>
                                        <span className="text-xs font-semibold uppercase tracking-wider">Kat</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floors & Units */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                    <Layers size={20} className="text-blue-600" />
                                    Kat ve Daire Detayları
                                </h2>

                                <div className="space-y-8">
                                    {[...(block.floors || [])].sort((a, b) => b.floor_number - a.floor_number).map(floor => {
                                        return (
                                            <div key={floor.id} className="relative pl-6 md:pl-8 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-slate-100 before:rounded-full">
                                                <div
                                                    className="group font-bold text-slate-800 flex items-center justify-between mb-4 bg-white py-4 px-4 z-10 cursor-pointer hover:bg-blue-50/50 hover:shadow-sm transition-all rounded-2xl border border-transparent hover:border-blue-100"
                                                    onClick={() => openFloorModal(floor)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center absolute -left-[1.25rem] md:-left-[1.75rem] border-4 border-[#F5F5F7] shadow-md group-hover:scale-110 transition-transform">
                                                            {floor.floor_number}
                                                        </div>
                                                        <div className="ml-4">
                                                            <h4 className="text-slate-800 font-black text-lg">{floor.floor_number}. Kat</h4>
                                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                                                {(floor.units || []).length} Ünite Mevcut
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 font-bold text-sm">
                                                        Detayları Gör <Eye size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {(block.floors || []).length === 0 && (
                                        <div className="bg-slate-50 border border-slate-100 border-dashed rounded-xl p-8 text-center text-slate-500">
                                            Bu blokta henüz kat tanımlanmamış.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <FloorDetailsModal
                    isOpen={isFloorModalOpen}
                    onClose={closeFloorModal}
                    floor={selectedFloor}
                    blockName={block?.name}
                />
            </main>
        </div>
    );
}

export default BlockDetails;

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
    ChevronDown,
    ChevronUp,
    MoreVertical,
    Edit2,
    Trash2
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
    const [expandedFloors, setExpandedFloors] = useState({});
    const [expandedUnits, setExpandedUnits] = useState({});
    const [activeFloorMenu, setActiveFloorMenu] = useState(null);

    // Dropdown dışında bir yere tıklandığında menüyü kapat
    useEffect(() => {
        const handleClickOutside = () => setActiveFloorMenu(null);
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleFloor = (floorId) => {
        setExpandedFloors(prev => ({
            ...prev,
            [floorId]: !prev[floorId]
        }));
    };

    const toggleUnit = (unitId) => {
        setExpandedUnits(prev => ({
            ...prev,
            [unitId]: !prev[unitId]
        }));
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
                                    {[...(block.floors || [])].sort((a, b) => a.floor_number - b.floor_number).map(floor => {
                                        const isExpanded = !!expandedFloors[floor.id];
                                        const isMenuOpen = activeFloorMenu === floor.id;
                                        return (
                                            <div key={floor.id} className="relative pl-6 md:pl-8 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-slate-100 before:rounded-full">
                                                <div
                                                    className="font-bold text-slate-800 flex items-center justify-between mb-4 sticky top-0 bg-white py-2 z-10 cursor-pointer hover:bg-slate-50 transition-colors rounded-lg pr-4 group"
                                                >
                                                    <div className="flex items-center gap-3 flex-1" onClick={() => toggleFloor(floor.id)}>
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center absolute -left-[1.15rem] md:-left-[1.65rem] border-4 border-white shadow-sm">
                                                            {floor.floor_number}
                                                        </div>
                                                        <span className="text-sm font-bold ml-2">Kat {floor.floor_number}</span>
                                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                                            {(floor.units || []).length} Ünite
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* Kat İşlem Dropdown */}
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveFloorMenu(isMenuOpen ? null : floor.id);
                                                                }}
                                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                                            >
                                                                <MoreVertical size={18} />
                                                            </button>

                                                            {isMenuOpen && (
                                                                <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                                                        <Edit2 size={14} /> Düzenle
                                                                    </button>
                                                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                                                        <Trash2 size={14} /> Sil
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="text-slate-300 w-px h-4 bg-slate-200 mx-1"></div>

                                                        <div className="text-slate-400" onClick={() => toggleFloor(floor.id)}>
                                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        </div>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                        {[...(floor.units || [])].sort((a, b) => String(a.unit_number).localeCompare(String(b.unit_number), undefined, { numeric: true })).map(unit => {
                                                            const statusDetails = getUnitStatusDetails(unit.sales_status || 'AVAILABLE');
                                                            const isUnitExpanded = !!expandedUnits[unit.id];
                                                            return (
                                                                <div key={unit.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all h-fit">
                                                                    <div
                                                                        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                                                        onClick={() => toggleUnit(unit.id)}
                                                                    >
                                                                        <div className="font-bold text-base text-slate-800 flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                <Home size={18} className="text-orange-500" />
                                                                                {String(unit.unit_number).trim().match(/^Daire/i) ? unit.unit_number : `Daire ${unit.unit_number}`}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {isUnitExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusDetails.classes}`}>
                                                                                {statusDetails.label}
                                                                            </span>
                                                                            <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-bold border border-orange-100">
                                                                                {unit.unit_type}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {isUnitExpanded && (
                                                                        <div className="p-4 pt-0 space-y-2 border-t border-slate-100 bg-slate-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
                                                                            <div className="pt-3 space-y-2">
                                                                                {(unit.rooms || []).length === 0 ? (
                                                                                    <p className="text-xs text-slate-400 italic text-center py-2">Oda tanımlanmamış</p>
                                                                                ) : (
                                                                                    (unit.rooms || []).map(room => (
                                                                                        <div key={room.id} className="flex items-center justify-between text-sm text-slate-600 bg-white rounded-lg px-3 py-2 border border-slate-100 shadow-sm">
                                                                                            <div className="flex items-center gap-2 font-medium">
                                                                                                <Maximize size={14} className="text-slate-400" />
                                                                                                {room.name}
                                                                                            </div>
                                                                                            <div className="font-bold text-slate-700">
                                                                                                {room.area_m2} m²
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                )}
                                                                                {(unit.rooms || []).length > 0 && (
                                                                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 text-xs font-bold text-slate-800">
                                                                                        <span>Toplam Alan:</span>
                                                                                        <span className="text-blue-600">
                                                                                            {(unit.rooms || []).reduce((acc, curr) => acc + (Number(curr.area_m2) || 0), 0)} m²
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        {(floor.units || []).length === 0 && (
                                                            <div className="col-span-full bg-slate-50 border border-slate-100 border-dashed rounded-xl p-6 text-center text-slate-400 text-sm">
                                                                Bu kata ait daire bulunmamaktadır.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
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
            </main>
        </div>
    );
}

export default BlockDetails;

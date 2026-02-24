import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Plus } from 'lucide-react';

// örnek proje verileri
const projectList = [
  { id: 1, company: 'ABC İnşaat', name: 'Merkez Ofis İnşaatı', address: 'İstanbul, Maslak', status: 'Devam Ediyor', created: '01.01.2024' },
  { id: 2, company: 'XYZ Yapı', name: 'Vadi Konutları B Blok', address: 'Ankara, Çankaya', status: 'Gecikmede', created: '15.03.2024' },
  { id: 3, company: 'LMN Proje', name: 'Sahil Depo Yenileme', address: 'İzmir, Alsancak', status: 'Bitiyor', created: '10.02.2024' },
];

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

function Projects() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0">
        <Navbar title="Projeler" toggleMobileMenu={toggleMobileMenu} />

        <div className="px-8 pb-12 pt-4 space-y-8">
          <SectionHeader
            title="Proje Listesi"
            action={
              <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
                <Plus size={14} /> Yeni Proje
              </button>
            }
          />

          {/* Data table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                  <th className="pb-3 pl-2">Proje Şirketi</th>
                  <th className="pb-3">Adı</th>
                  <th className="pb-3">Adresi</th>
                  <th className="pb-3">Durumu</th>
                  <th className="pb-3">Oluşturulma</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {projectList.map((proj) => (
                  <tr key={proj.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 font-medium text-slate-700 border-b border-slate-50 group-last:border-none">
                      {proj.company}
                    </td>
                    <td className="py-4 text-slate-700 border-b border-slate-50 group-last:border-none">
                      {proj.name}
                    </td>
                    <td className="py-4 text-slate-500 border-b border-slate-50 group-last:border-none">
                      {proj.address}
                    </td>
                    <td className="py-4 text-slate-700 border-b border-slate-50 group-last:border-none">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        proj.status === 'Gecikmede' ? 'bg-red-50 text-red-700 border-red-100' :
                        proj.status === 'Bitiyor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 border-b border-slate-50 group-last:border-none">
                      {proj.created}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Projects;
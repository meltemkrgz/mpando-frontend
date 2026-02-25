import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie 
} from 'recharts';
import { 
  Plus, FileText, Users, Package, ArrowUpRight, ArrowDownRight, 
  AlertTriangle, CheckCircle, Clock, MoreHorizontal, DollarSign, Briefcase 
} from 'lucide-react';


const financialData = [
  { name: 'Oca', income: 40000, expense: 24000 },
  { name: 'Şub', income: 30000, expense: 13980 },
  { name: 'Mar', income: 20000, expense: 58000 },
  { name: 'Nis', income: 27800, expense: 39080 },
  { name: 'May', income: 18900, expense: 48000 },
  { name: 'Haz', income: 23900, expense: 38000 },
  { name: 'Tem', income: 34900, expense: 43000 },
];

const projects = [
  { id: 1, name: 'AKSU', location: 'Konum Belirtilmemiş', progress: 75, start: '01.01.2024', end: '30.09.2024', status: 'Devam Ediyor' },
  { id: 2, name: 'Dolunay Yaşam Merkezi', location: 'Konum Belirtilmemiş', progress: 32, start: '15.03.2024', end: '15.03.2025', status: 'Gecikmede' },
  { id: 3, name: 'İŞHAN Rezidans', location: 'Konum Belirtilmemiş', progress: 90, start: '10.02.2024', end: '01.06.2024', status: 'Bitiyor' },
];

const stockData = [
  { name: 'Çimento', value: 400, color: '#3b82f6' }, // blue-500
  { name: 'Demir', value: 300, color: '#64748b' },   // slate-500
  { name: 'Tuğla', value: 300, color: '#f59e0b' },   // amber-500
  { name: 'Boya', value: 200, color: '#ef4444' },    // red-500
];

const materials = [
  { name: 'C30 Beton', offers: 4, bestPrice: '₺2,450', status: 'Teklif Bekleniyor' },
  { name: 'Ø12 İnşaat Demiri', offers: 6, bestPrice: '₺18,200', status: 'Onaylandı' },
  { name: 'Yalıtım Malzemesi', offers: 2, bestPrice: '₺45,000', status: 'İnceleniyor' },
];

const activities = [
  { id: 1, type: 'project', title: 'Yeni Proje Oluşturuldu', desc: 'Vadi Konutları C Blok sisteme eklendi.', time: '2 saat önce', icon: <Briefcase size={16} /> },
  { id: 2, type: 'payment', title: 'Ödeme Yapıldı', desc: 'ABC Beton A.Ş. ödemesi tamamlandı.', time: '5 saat önce', icon: <DollarSign size={16} /> },
  { id: 3, type: 'material', title: 'Malzeme Teslimi', desc: 'Merkez Ofis şantiyesine çimento girişi.', time: '1 gün önce', icon: <Package size={16} /> },
];

const payments = [
  { recipient: 'Kuzey Yapı Ltd.', amount: '₺124,500', date: '24 May', status: 'Ödendi' },
  { recipient: 'Ege Tesisat', amount: '₺45,200', date: '23 May', status: 'Bekliyor' },
  { recipient: 'Mavi Nakliyat', amount: '₺12,000', date: '22 May', status: 'Ödendi' },
];

// --- COMPONENTS ---

function StatCard({ title, value, subtext, trend, trendUp, icon, alert }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${alert ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {subtext && <span className="text-xs text-slate-400 mb-1">{subtext}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      {/* Sidebar Sabit Kalıyor */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen md:pt-0">
        {/* Top Header & Actions */}
        <Navbar title="Dashboard" toggleMobileMenu={toggleMobileMenu} />

        <div className="px-8 pb-12 pt-3 space-y-8">
          
          {/* 1. SECTION: SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Aktif Projeler" 
              value="8" 
              subtext="Toplam 12 proje"
              icon={<Briefcase size={20} />} 
              trend="+2" 
              trendUp={true} 
            />
            <StatCard 
              title="Toplam Gelir" 
              value="₺2.4M" 
              subtext="Bu ay"
              icon={<DollarSign size={20} />} 
              trend="%12" 
              trendUp={true} 
            />
            <StatCard 
              title="Toplam Gider" 
              value="₺850K" 
              subtext="Bu ay"
              icon={<ArrowDownRight size={20} />} 
              trend="%5" 
              trendUp={false} 
            />
            <StatCard 
              title="Kritik Stok" 
              value="3" 
              subtext="Ürün tükenmek üzere"
              icon={<AlertTriangle size={20} />} 
              alert={true}
            />
          </div>

          {/* 2. SECTION: PROJECTS & CASH FLOW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Project List */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <SectionHeader 
                title="Proje Durumları" 
                action={<button className="text-blue-600 text-sm font-medium hover:underline">Tümü</button>} 
              />
              <div className="space-y-5 overflow-y-auto pr-2 max-h-[300px] scrollbar-hide">
                {projects.map((project) => (
                  <div key={project.id} className="group p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{project.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{project.location}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        project.status === 'Gecikmede' ? 'bg-red-50 text-red-600 border-red-100' : 
                        project.status === 'Bitiyor' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          project.status === 'Gecikmede' ? 'bg-red-500' : 'bg-blue-600'
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>{project.start}</span>
                      <span>%{project.progress}</span>
                      <span>{project.end}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <SectionHeader title="Nakit Akışı Analizi" />
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₺${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="income" name="Gelir" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" name="Gider" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 3. SECTION: MATERIALS & STOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Material Purchase Panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <SectionHeader 
                title="Malzeme Satın AlmaTalepleri" 
                action={
                  <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
                    <Plus size={14} /> Yeni Talep
                  </button>
                }
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                      <th className="pb-3 pl-2">MALZEME</th>
                      <th className="pb-3">TEKLİF ADEDİ</th>
                      <th className="pb-3">EN İYİ FİYAT</th>
                      <th className="pb-3 text-right pr-2">DURUM</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {materials.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 pl-2 font-medium text-slate-700 border-b border-slate-50 group-last:border-none">
                          {item.name}
                        </td>
                        <td className="py-4 text-slate-500 border-b border-slate-50 group-last:border-none">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">
                            {item.offers} Teklif
                          </span>
                        </td>
                        <td className="py-4 text-slate-700 font-semibold border-b border-slate-50 group-last:border-none">
                          {item.bestPrice}
                        </td>
                        <td className="py-4 pr-2 text-right border-b border-slate-50 group-last:border-none">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            item.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            item.status === 'Teklif Bekleniyor' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Onaylandı' ? 'bg-emerald-500' :
                              item.status === 'Teklif Bekleniyor' ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`}></span>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stock Chart */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center relative">
              <div className="w-full flex justify-between items-center absolute top-6 px-6">
                <h2 className="text-lg font-bold text-slate-800">Stok Durumu</h2>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
              </div>
              
              <div className="w-full h-[220px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#1e293b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 w-full px-4">
                {stockData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="flex-1">{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. SECTION: TIMELINE & PAYMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <SectionHeader title="Son Aktiviteler" />
              <div className="relative pl-2">
                {/* Dikey Çizgi */}
                <div className="absolute left-[19px] top-2 bottom-4 w-[1px] bg-slate-100"></div>
                
                <div className="space-y-6">
                  {activities.map((act) => (
                    <div key={act.id} className="relative flex gap-4 group">
                      <div className="relative z-10 w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                        {act.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                          <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">{act.time}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <SectionHeader 
                title="Son Ödemeler" 
                action={<button className="text-blue-600 text-sm font-medium hover:underline">Tümünü Gör</button>}
              />
              <div className="space-y-3">
                {payments.map((pay, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{pay.recipient}</p>
                        <p className="text-xs text-slate-400">{pay.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">{pay.amount}</p>
                      <span className={`text-[10px] font-medium ${
                        pay.status === 'Ödendi' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {pay.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-2 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                  <Plus size={16} />
                  Yeni Ödeme Ekle
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
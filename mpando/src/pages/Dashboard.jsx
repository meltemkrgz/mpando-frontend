import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from "../context/AuthContext";
import { api } from '../api/client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import {
  Plus, FileText, Users, Package, ArrowUpRight, ArrowDownRight,
  AlertTriangle, CheckCircle, Clock, MoreHorizontal, DollarSign, Briefcase,
  // projects.jsx'ten gelen ikonlar:
  AlertCircle, Hourglass // CheckCircle zaten var
} from 'lucide-react';


const defaultFinancialData = [
  { name: 'Oca', income: 0, expense: 0 },
  { name: 'Şub', income: 0, expense: 0 },
  { name: 'Mar', income: 0, expense: 0 },
  { name: 'Nis', income: 0, expense: 0 },
  { name: 'May', income: 0, expense: 0 },
  { name: 'Haz', income: 0, expense: 0 },
  { name: 'Tem', income: 0, expense: 0 },
  { name: 'Ağu', income: 0, expense: 0 },
  { name: 'Eyl', income: 0, expense: 0 },
  { name: 'Eki', income: 0, expense: 0 },
  { name: 'Kas', income: 0, expense: 0 },
  { name: 'Ara', income: 0, expense: 0 },
];



const defaultStockData = [];

const STOCK_COLORS = ['#3b82f6', '#64748b', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

const materials = [];

const defaultActivities = [];

const defaultPayments = [];


// --- Yardımcı Fonksiyonlar (projects.jsx'ten kopyalandı) ---
const getStatusClasses = (status) => {
  switch (status) {
    case 'Devam Ediyor': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Planlanıyor': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Gecikmede': return 'bg-red-50 text-red-700 border-red-200';
    case 'Bitiyor': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Tamamlandı': return 'bg-green-50 text-green-700 border-green-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Devam Ediyor': return <Clock size={14} />;
    case 'Planlanıyor': return <Briefcase size={14} />;
    case 'Gecikmede': return <AlertCircle size={14} />;
    case 'Bitiyor': return <Hourglass size={14} />;
    case 'Tamamlandı': return <CheckCircle size={14} />;
    default: return null;
  }
};

// İlerleme çubuğu için renk belirleyici fonksiyon
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
  const [projects, setProjects] = useState([]);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [financialData, setFinancialData] = useState(defaultFinancialData);
  const [recentPayments, setRecentPayments] = useState(defaultPayments);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [criticalStockCount, setCriticalStockCount] = useState(0);
  const [stockDataState, setStockDataState] = useState(defaultStockData);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [recentActivities, setRecentActivities] = useState(defaultActivities);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const { user } = useAuth();

  // Format para birimi
  const formatCurrency = (value) => {
    if (value >= 1000000) return `₺${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₺${(value / 1000).toFixed(1)}K`;
    return `₺${value}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user && user.company_id) {
          // Bütün projeleri çekiyoruz
          const data = await api.get('/projects');

          // Company_id'ye göre filtreleme yapıyoruz ("bana göre listele, kanka 8 tane yok 6 tane var o şirkete ait")
          const filteredData = (data || []).filter(p => String(p.contractor_id) === String(user.company_id));

          // users tablosundan aynı şirketteki (company_id) kişileri bir kerede çekelim,
          // bunu finans(created_by) ve satın alma(requested_by) kayıtlarını filtrelemek için kullanacağız.
          let validUserIds = [];
          try {
            const usersData = await api.get('/users');
            validUserIds = (usersData || [])
              .filter(u => String(u.company_id) === String(user.company_id))
              .map(u => String(u.id));
          } catch (uErr) {
            console.error("Users data couldn't form for mapping:", uErr);
          }

          // Finansal hareketleri çekip Nakit Akışı grafiğine yerleştiriyoruz
          try {
            const transData = await api.get('/finance/transactions');
            // 'created_by' id'sinin company_id'mizdeki validUserIds ile eşleşmesi
            const myTrans = (transData || []).filter(t =>
              validUserIds.length > 0 ? validUserIds.includes(String(t.created_by)) : String(t.created_by) === String(user.id)
            );

            const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            const monthlyData = monthNames.map(name => ({ name, income: 0, expense: 0 }));

            myTrans.forEach(t => {
              const amount = Number(t.amount) || 0;
              const dateStr = t.transaction_date || t.created_at;
              if (!dateStr) return; // Tarih yoksa atla

              const date = new Date(dateStr);
              if (isNaN(date.getTime())) return;

              const monthIndex = date.getMonth();

              // Backend şimdilik TYPE göndermediği için geçici olarak (description'a göre) ayırıyoruz
              // Mesela Capital Injection vs Gelir olsun, diğerleri Expense
              const description = String(t.description || '').toLowerCase();
              const isIncome = description.includes('capital') || description.includes('injection') || description.includes('gelir');

              if (isIncome) {
                monthlyData[monthIndex].income += amount;
              } else {
                monthlyData[monthIndex].expense += amount;
              }
            });

            // Genel toplam gelir ve gideri hesapla
            const tIncome = myTrans
              .filter(t => (t.description || '').toLowerCase().includes('capital') || (t.description || '').toLowerCase().includes('injection') || (t.description || '').toLowerCase().includes('gelir'))
              .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

            const tExpense = myTrans
              .filter(t => !((t.description || '').toLowerCase().includes('capital') || (t.description || '').toLowerCase().includes('injection') || (t.description || '').toLowerCase().includes('gelir')))
              .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

            setTotalIncome(tIncome);
            setTotalExpense(tExpense);

            setFinancialData(monthlyData);
          } catch (err) {
            console.error("Finansal veriler çekilemedi: ", err);
          }

          // Son Ödemeleri (Recent Payments) Özel API'den çekiyoruz
          try {
            const recentData = await api.get('/finance/transactions/recent');

            // Kullanıcı IDsine göre filtreleme
            const myRecentTrans = (recentData || []).filter(t =>
              validUserIds.length > 0 ? validUserIds.includes(String(t.created_by)) : String(t.created_by) === String(user.id)
            );

            const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            const mappedPayments = myRecentTrans.map(e => {
              const eDate = new Date(e.transaction_date || e.created_at || Date.now());

              let mappedType = 'İşlem';
              if (e.payment_type === 'CASH') mappedType = 'Nakit';
              else if (e.payment_type === 'WIRE') mappedType = 'Havale/EFT';
              else if (e.payment_type === 'CREDIT_CARD') mappedType = 'Kredi Kartı';
              else if (e.payment_type === 'CHECK') mappedType = 'Çek';

              return {
                recipient: e.description || e.title || 'Belirtilmedi',
                amount: `₺${Number(e.amount).toLocaleString('tr-TR')}`,
                date: `${eDate.getDate()} ${monthNames[eDate.getMonth()]}`,
                status: mappedType
              };
            });

            setRecentPayments(mappedPayments.length > 0 ? mappedPayments.slice(0, 4) : []);
          } catch (rErr) {
            console.error("Son ödemeler çekilemedi: ", rErr);
          }

          // Stok verisini çekme ve 'Kritik Stok' bilgisini hesaplama (100 altı miktar)
          try {
            const stockDataRes = await api.get('/inventory/stocks');
            const myStocks = (stockDataRes || []).filter(s =>
              String(s.company_id) === String(user.company_id)
            );

            // Quantity adedi 100 den az olanları bul
            const criticals = myStocks.filter(s => (Number(s.quantity) || 0) < 100);
            setCriticalStockCount(criticals.length);

            // Pie chart için verileri mapple
            if (myStocks.length > 0) {
              const mappedStocks = myStocks.map((s, idx) => {
                const matName = s.materials_catalog?.name || s.material_name || s.name || `Ürün ${idx + 1}`;
                return {
                  name: matName,
                  value: Number(s.quantity) || 0,
                  color: STOCK_COLORS[idx % STOCK_COLORS.length]
                };
              });
              setStockDataState(mappedStocks.slice(0, 10)); // Grafiğin çok kalabalık olmaması için ilk 10'u gösterelim
            }
          } catch (stockErr) {
            console.error("Stok verileri çekilemedi: ", stockErr);
          }

          // Satın Alma Taleplerini (Purchase Requests) çekiyoruz
          try {
            const prData = await api.get('/inventory/purchase-requests');
            // Yalnızca bizim company_id'mize bağlı (validUserIds) kişilerin 'requested_by' taleplerini alıyoruz
            const myPrs = (prData || []).filter(pr =>
              validUserIds.length > 0 ? validUserIds.includes(String(pr.requested_by)) : String(pr.requested_by) === String(user.id)
            );

            const mappedPrs = myPrs.map(pr => {
              const projectName = pr.projects?.name || 'Bilinmeyen Proje';
              const matName = pr.materials_catalog?.name || pr.material_name || `Malzeme #${pr.material_id}`;

              // Status mapping
              let mappedStatus = 'Bekliyor';
              const rawStat = String(pr.status || '').toUpperCase();
              if (rawStat === 'APPROVED') mappedStatus = 'Onaylandı';
              else if (rawStat === 'REJECTED') mappedStatus = 'Reddedildi';
              else if (rawStat === 'PENDING') mappedStatus = 'Teklif Bekleniyor';
              else if (rawStat === 'COMPLETED') mappedStatus = 'Tamamlandı';

              return {
                id: pr.id,
                name: matName,
                projectName,
                quantity: pr.required_quantity || pr.quantity || 0,
                status: mappedStatus
              };
            });
            setPurchaseRequests(mappedPrs.slice(0, 5)); // En son 5 isteği gösterelim
          } catch (prErr) {
            console.error("Satın alma talepleri çekilemedi: ", prErr);
          }

          // Son Aktiviteleri Çekiyoruz (Activities)
          try {
            const actData = await api.get('/activities');

            const myActs = (actData || []).filter(a => {
              if (a.company_id) return String(a.company_id) === String(user.company_id);
              if (a.user_id || a.created_by) return validUserIds.length > 0 ? validUserIds.includes(String(a.user_id || a.created_by)) : String(a.user_id || a.created_by) === String(user.id);
              return true;
            });

            const calculateTimeAgo = (dateStr) => {
              if (!dateStr) return 'Bilinmiyor';
              const date = new Date(dateStr);
              if (isNaN(date.getTime())) return 'Bilinmiyor';
              const diffMs = new Date() - date;
              const diffMins = Math.floor(diffMs / 60000);
              if (diffMins < 60) return `${Math.max(diffMins, 1)} dk önce`;
              const diffHours = Math.floor(diffMins / 60);
              if (diffHours < 24) return `${diffHours} saat önce`;
              return `${Math.floor(diffHours / 24)} gün önce`;
            };

            const mappedActs = myActs.map(a => {
              const actType = String(a.type || a.action || 'system').toLowerCase();
              let icon = <CheckCircle size={16} />;

              if (actType.includes('project')) icon = <Briefcase size={16} />;
              else if (actType.includes('pay') || actType.includes('financ') || actType.includes('income') || actType.includes('expense')) icon = <DollarSign size={16} />;
              else if (actType.includes('material') || actType.includes('stock') || actType.includes('inventory') || actType.includes('buy')) icon = <Package size={16} />;
              else if (actType.includes('user') || actType.includes('auth')) icon = <Users size={16} />;

              return {
                id: a.id || Math.random(),
                title: a.title || a.action || 'Sistem Aktivitesi',
                desc: a.description || a.details || 'Ayrıntı belirtilmedi.',
                time: calculateTimeAgo(a.created_at || a.timestamp),
                icon: icon,
                rawDate: new Date(a.created_at || a.timestamp || 0)
              };
            });

            // En yeniler en üstte olacak şekilde tarih sıralaması yapıyoruz
            mappedActs.sort((a, b) => b.rawDate - a.rawDate);
            setRecentActivities(mappedActs.slice(0, 6)); // ilk 6
          } catch (actErr) {
            console.error("Aktiviteler çekilemedi: ", actErr);
          }

          // Gelen veriyi frontend'in eski statik yapısına oturtarak bozulan kısımları (özellikle %'lik kısım) düzeltiyoruz
          const mappedProjects = filteredData.map(p => {
            let mappedStatus = 'Bilinmiyor';
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
              ...p,
              name: p.name || p.project_name || p.title || 'İsimsiz Proje',
              location: p.location || p.address || 'Konum Belirtilmemiş',
              // API'de progress (ilerleme) alanı henüz yoksa, çubuk boş ve bozuk görünmesin diye 30-80 arası rastgele rakam girilir.
              // PLANNING aşamasındaki projeler için bar %10-%20 gibi daha düşük doluluk oranında başlasın
              progress: p.progress !== undefined && p.progress !== null
                ? p.progress
                : (mappedStatus === 'Planlanıyor' ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 50) + 30),
              start: p.start || p.start_date || (p.created_at ? p.created_at.split('T')[0] : 'Belirtilmedi'),
              end: p.end || p.end_date || 'Belirtilmedi',
              status: mappedStatus
            };
          });

          setProjects(mappedProjects);

          // Sadece Devam Edenleri say
          const active = mappedProjects.filter(p => p.status === 'Devam Ediyor');
          setActiveProjectsCount(active.length);
        }
      } catch (error) {
        console.error("Projeler çekilirken hata:", error);
      }
    };

    fetchProjects();
  }, [user]);

  console.log("Authenticated User:", user);

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
              value={activeProjectsCount.toString()}
              subtext={`Toplam ${projects.length} proje`}
              icon={<Briefcase size={20} />}
              trend="+2"
              trendUp={true}
            />
            <StatCard
              title="Toplam Gelir"
              value={totalIncome > 0 ? formatCurrency(totalIncome) : "₺0"}
              subtext="Toplam"
              icon={<DollarSign size={20} />}
              trend="%0"
              trendUp={true}
            />
            <StatCard
              title="Toplam Gider"
              value={totalExpense > 0 ? formatCurrency(totalExpense) : "₺0"}
              subtext="Toplam"
              icon={<ArrowDownRight size={20} />}
              trend="%0"
              trendUp={false}
            />
            <StatCard
              title="Kritik Stok"
              value={criticalStockCount.toString()}
              subtext="Ürün tükenmek üzere"
              icon={<AlertTriangle size={20} />}
              alert={true}
            />
          </div>

          {/* 2. SECTION: PROJECTS & CASH FLOW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Project List (BURASI GÜNCELLENDİ) */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <SectionHeader
                title="Proje Durumları"
                action={<button onClick={() => window.location.href = '/projects'} className="text-blue-600 text-sm font-medium hover:underline">Tümü</button>}
              />
              <div className="space-y-5 overflow-y-auto pr-2 max-h-[300px] scrollbar-hide">
                {projects.map((project) => (
                  <div key={project.id} className="group p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{project.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{project.location}</p>
                      </div>
                      {/* STATÜS BİLGİSİ: projects.jsx'teki gibi */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClasses(project.status)}`}>
                        {getStatusIcon(project.status)} {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                      {/* İLERLEME ÇUBUĞU RENGİ: projects.jsx'teki gibi */}
                      <div
                        className={`h-1.5 rounded-full ${getProgressBarColor(project.status)}`}
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
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₺${value / 1000}k`} />
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
                      <th className="pb-3">PROJE</th>
                      <th className="pb-3">MİKTAR</th>
                      <th className="pb-3 text-right pr-2">DURUM</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {purchaseRequests.length > 0 ? purchaseRequests.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 pl-2 font-medium text-slate-700 border-b border-slate-50 group-last:border-none">
                          {item.name}
                        </td>
                        <td className="py-4 text-slate-500 border-b border-slate-50 group-last:border-none">
                          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                            {item.projectName}
                          </span>
                        </td>
                        <td className="py-4 text-slate-700 font-semibold border-b border-slate-50 group-last:border-none">
                          {item.quantity}
                        </td>
                        <td className="py-4 pr-2 text-right border-b border-slate-50 group-last:border-none">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'Onaylandı' || item.status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            item.status === 'Teklif Bekleniyor' || item.status === 'Bekliyor' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              item.status === 'Reddedildi' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                'bg-slate-50 text-slate-600 border-slate-100'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Onaylandı' || item.status === 'Tamamlandı' ? 'bg-emerald-500' :
                              item.status === 'Teklif Bekleniyor' || item.status === 'Bekliyor' ? 'bg-amber-500' :
                                item.status === 'Reddedildi' ? 'bg-rose-500' :
                                  'bg-slate-400'
                              }`}></span>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="py-6 text-center text-sm text-slate-400">Henüz talep kaydı bulunmamaktadır.</td>
                      </tr>
                    )}
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
                      data={stockDataState}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stockDataState.map((entry, index) => (
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
                {stockDataState.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="flex-1 truncate" title={item.name}>{item.name}</span>
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
                  {recentActivities.length > 0 ? recentActivities.map((act) => (
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
                  )) : (
                    <div className="text-sm text-slate-400 py-4 text-center">Hiç aktivite bulunmuyor.</div>
                  )}
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
                {recentPayments.length > 0 ? recentPayments.map((pay, idx) => (
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
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {pay.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-400 py-4 text-center">Henüz ödeme kaydı bulunmuyor.</div>
                )}

                <button className="w-full mt-2 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                  <Plus size={16} />
                  Yeni Ödeme Ekle
                </button>
              </div>
            </div >

          </div >

        </div >
      </main >
    </div >
  );
}

export default Dashboard;
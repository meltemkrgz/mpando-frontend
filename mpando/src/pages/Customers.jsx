import React, { useState, useRef, useEffect, useMemo } from 'react'; // useMemo import edildi
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CustomerEditModal from '../modals/CostumerEditModal';
import { useAuth } from "../context/AuthContext";
import { api } from '../api/client';
import {
  Plus,
  Trash2,
  CheckSquare,
  Pencil,
  X,
  Columns,
  Filter,
  CheckCircle
} from 'lucide-react';

// --- Yardımcı Fonksiyonlar ---
const getCompanyNameById = (companyId, companies) => {
  const company = (companies || []).find(c => String(c.id) === String(companyId));
  return company ? company.name : 'Bilinmiyor';
};

const getEmployeeNameById = (employeeId, employees) => {
  const employee = (employees || []).find(e => String(e.id) === String(employeeId));
  return employee ? (employee.full_name || employee.name) : 'Bilinmiyor';
};

const initialCustomerList = [
  {
    id: 1,
    company_id: 1,
    employee_id: 101,
    customer_full_name: 'Ayşe Kaya',
    identity_number: '12345678901',
    phone: '5321234567',
    email: 'ayse.kaya@example.com',
    address: '',
    created_at: '01.01.2024',
    is_deleted: false,
  },
  {
    id: 2,
    company_id: 2,
    employee_id: 102,
    customer_full_name: 'Mehmet Demir',
    identity_number: '98765432109',
    phone: '5439876543',
    email: 'mehmet.demir@example.com',
    address: '',
    created_at: '15.03.2024',
    is_deleted: false,
  },
  {
    id: 3,
    company_id: 1,
    employee_id: 101,
    customer_full_name: 'Zeynep Aksoy',
    identity_number: '11223344556',
    phone: '5541122334',
    email: 'zeynep.aksoy@example.com',
    address: '',
    created_at: '10.02.2024',
    is_deleted: false,
  },
  {
    id: 4,
    company_id: 3,
    employee_id: 103,
    customer_full_name: 'Can Yılmaz',
    identity_number: '66778899001',
    phone: '5056677889',
    email: 'can.yilmaz@example.com',
    address: '',
    created_at: '20.06.2023',
    is_deleted: true,
  },
  {
    id: 5,
    company_id: 4,
    employee_id: 104,
    customer_full_name: 'Elif Kaya',
    identity_number: '10293847561',
    phone: '5061234567',
    email: 'elif.kaya@example.com',
    address: '',
    created_at: '05.04.2024',
    is_deleted: false,
  },
];

const initialNewCustomerData = {
  company_id: '',
  employee_id: '',
  full_name: '',
  identity_number: '',
  phone: '',
  email: '',
  address: '',
  is_deleted: false,
};

const optionalColumns = [
  { key: 'identity_number', label: 'Kimlik No' },
  { key: 'email', label: 'E-posta' },
  { key: 'address', label: 'Adres' },
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

function Customers() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const { user } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState(initialNewCustomerData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const columnDropdownRef = useRef(null);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedFilterOption, setSelectedFilterOption] = useState('Varolan Kayıtlar'); // Varsayılan: Varolan Kayıtlar
  const [loading, setLoading] = useState(true);
  const filterDropdownRef = useRef(null);

  const customerFilterOptions = ['Tümü', 'Varolan Kayıtlar', 'Silinmiş Kayıtlar'];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user && user.company_id) {
        const [customersData, companiesData, usersData] = await Promise.all([
          api.get('/customers'),
          api.get('/companies'),
          api.get('/users')
        ]);

        console.log("Fetched Customers Raw Data:", customersData);

        // Filter companies and users for the current company
        const filteredCompanies = (companiesData || []).filter(c => String(c.contractor_id) === String(user.company_id) || String(c.id) === String(user.company_id));
        const filteredEmployees = (usersData || []).filter(u => String(u.company_id) === String(user.company_id));

        setCompanies(filteredCompanies);
        setEmployees(filteredEmployees);

        const mappedCustomers = (customersData || [])
          .filter(c => String(c.contractor_id) === String(user.company_id) || String(c.company_id) === String(user.company_id)) // Daha geniş filtreleme
          .map(c => ({
            id: c.id,
            company_id: c.company_id,
            employee_id: c.employee_id,
            company_name: c.companies?.name || getCompanyNameById(c.company_id, filteredCompanies),
            employee_name: c.users?.full_name || c.users?.name || getEmployeeNameById(c.employee_id, filteredEmployees),
            full_name: c.full_name || c.customer_full_name || 'Bilinmiyor',
            identity_number: c.identity_number || '-',
            phone: c.phone || '-',
            email: c.email || '-',
            address: [c.district, c.city, c.address].filter(Boolean).join(', ') || '-',
            created_at: c.created_at ? new Date(c.created_at).toLocaleDateString('tr-TR') : '-',
            is_deleted: !!c.deleted_at || c.is_deleted || false
          }));

        setCustomers(mappedCustomers);
      }
    } catch (error) {
      console.error("Customers data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

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
  }, [columnDropdownRef, filterDropdownRef]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const handleSelectCustomer = (id) => {
    setSelectedCustomers(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const filteredCustomers = useMemo(() => {
    switch (selectedFilterOption) {
      case 'Tümü':
        return customers;
      case 'Varolan Kayıtlar':
        return customers.filter(c => !c.is_deleted);
      case 'Silinmiş Kayıtlar':
        return customers.filter(c => c.is_deleted);
      default:
        return customers.filter(c => !c.is_deleted); // Varsayılan olarak silinmemişleri göster //
    }
  }, [customers, selectedFilterOption]);

  const handleSelectAll = () => {
    const currentCustomerIds = filteredCustomers.map(c => c.id);
    if (selectedCustomers.length === currentCustomerIds.length && selectedCustomers.every(id => currentCustomerIds.includes(id))) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentCustomerIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`${selectedCustomers.length} müşteriyi silinmiş olarak işaretlemek istediğinize emin misiniz?`)) {
      try {
        await Promise.all(selectedCustomers.map(id =>
          api.put(`/customers/${id}`, { is_deleted: true })
        ));
        await fetchData();
        setSelectedCustomers([]);
      } catch (err) {
        console.error("Silme hatası:", err);
        alert("Silme işlemi sırasında hata oluştu.");
      }
    }
  };

  const toggleColumnVisibility = (key) => {
    setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => { setIsAddModalOpen(false); setNewCustomerData(initialNewCustomerData); };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    const processedValue = (name === 'company_id' || name === 'employee_id') ? (value ? parseInt(value) : '') : value;
    setNewCustomerData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAddNewCustomer = async () => {
    if (!newCustomerData.full_name || !newCustomerData.phone) {
      alert('Müşteri Adı Soyadı ve Telefon alanları zorunludur.');
      return;
    }
    if (!newCustomerData.company_id || !newCustomerData.employee_id) {
      alert('Şirket Adı ve Sorumlu Çalışan alanları zorunludur.');
      return;
    }

    try {
      const createData = {
        ...newCustomerData,
        contractor_id: user.company_id,
        is_deleted: false
      };
      await api.post('/customers', createData);
      await fetchData();
      closeAddModal();
    } catch (err) {
      console.error("Müşteri ekleme hatası:", err);
      alert("Müşteri eklenirken hata oluştu.");
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomerForEdit(customer);
    setEditFormData({ ...customer });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => { setIsEditModalOpen(false); setTimeout(() => { setSelectedCustomerForEdit(null); setEditFormData(null); }, 300); };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const processedValue = (name === 'company_id' || name === 'employee_id') ? (value ? parseInt(value) : '') : value;
    setEditFormData(prev => ({ ...prev, [name]: processedValue }));
  };
  const handleUpdateCustomer = async () => {
    if (!editFormData.full_name || !editFormData.phone) {
      alert('Müşteri Adı Soyadı ve Telefon alanları boş bırakılamaz.');
      return;
    }
    if (!editFormData.company_id || !editFormData.employee_id) {
      alert('Şirket Adı ve Sorumlu Çalışan alanları boş bırakılamaz.');
      return;
    }

    try {
      const updateData = {
        company_id: editFormData.company_id,
        employee_id: editFormData.employee_id,
        full_name: editFormData.full_name,
        identity_number: editFormData.identity_number,
        phone: editFormData.phone,
        email: editFormData.email,
        address: editFormData.address
      };
      await api.put(`/customers/${selectedCustomerForEdit.id}`, updateData);
      await fetchData();
      closeEditModal();
    } catch (err) {
      console.error("Müşteri güncelleme hatası:", err);
      alert("Güncelleme sırasında hata oluştu.");
    }
  };

  const toggleFilterDropdown = () => setIsFilterDropdownOpen(prev => !prev);
  const handleFilterChange = (option) => {
    setSelectedFilterOption(option);
    setIsFilterDropdownOpen(false);
    setSelectedCustomers([]);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0 relative">
        <Navbar title="Müşteriler" toggleMobileMenu={toggleMobileMenu} />

        <div className="px-4 sm:px-6 md:px-8 pb-12 pt-4 space-y-8">
          <SectionHeader
            title="Müşteri Listesi"
            action={
              <>
                {/* Filtreleme Dropdown'ı */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={toggleFilterDropdown}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Filter size={14} />
                    {selectedFilterOption !== 'Tümü' && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {selectedFilterOption}
                      </span>
                    )}
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-in fade-in-25">
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-400 px-2 pt-1 pb-2">Duruma Göre Filtrele</p>
                        {customerFilterOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => handleFilterChange(option)}
                            className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm ${selectedFilterOption === option ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                          >
                            <span>{option}</span>
                            {selectedFilterOption === option && <CheckCircle size={16} className="text-blue-600" />}
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
                  <Plus size={14} /> Yeni Müşteri
                </button>
              </>
            }
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {selectedCustomers.length > 0 && (
              <div className="flex flex-wrap items-center justify-between border border-slate-200 p-3 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="flex items-center justify-center bg-blue-600 text-white w-6 h-6 rounded-full text-xs font-bold">{selectedCustomers.length}</span>
                  <span className="text-sm font-medium text-slate-700">müşteri seçildi</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <button onClick={handleSelectAll} className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
                    <CheckSquare size={16} />
                    <span className="hidden sm:inline">{selectedCustomers.length === filteredCustomers.length ? 'Seçimi Temizle' : 'Tümünü Seç'}</span>
                  </button>
                  <div className="w-px h-5 bg-slate-300"></div>
                  <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} /> <span>Silinmiş Yap</span>
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pl-2 w-10"></th>
                    <th className="pb-3 px-4">Şirket Adı</th>
                    <th className="pb-3 px-4">Sorumlu Çalışan</th>
                    <th className="pb-3 px-4">Müşteri Adı Soyadı</th>
                    <th className="pb-3 px-4">Telefon</th>
                    {visibleColumns.includes('identity_number') && <th className="pb-3 px-4">Kimlik No</th>}
                    {visibleColumns.includes('email') && <th className="pb-3 px-4">E-posta</th>}
                    {visibleColumns.includes('address') && <th className="pb-3 px-4">Adres</th>}
                    {visibleColumns.includes('created_at') && <th className="pb-3 px-4">Oluşturulma Tarihi</th>}
                    <th className="pb-3 px-4 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-slate-50">
                        <td className="py-4 pl-2"><div className="w-4 h-4 bg-slate-100 rounded"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-50 rounded w-32"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-50 rounded w-28"></div></td>
                        <td className="py-4 px-4 text-center"><div className="h-8 bg-slate-50 rounded-lg w-16 mx-auto"></div></td>
                      </tr>
                    ))
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6 + visibleColumns.length} className="py-8 text-center text-slate-500">
                        {selectedFilterOption === 'Tümü' ? 'Gösterilecek müşteri bulunamadı.' : `"${selectedFilterOption}" kayıtlarda müşteri bulunamadı.`}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(customer => (
                      <tr key={customer.id} className={`group transition-colors border-b border-slate-50 last:border-none ${selectedCustomers.includes(customer.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'} ${customer.is_deleted ? 'opacity-60 italic text-slate-500' : ''}`}>
                        <td className="py-4 pl-2">
                          <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => handleSelectCustomer(customer.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" />
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-700">{customer.company_name}</td>
                        <td className="py-4 px-4 text-slate-700">{customer.employee_name}</td>
                        <td className="py-4 px-4 text-slate-700">{customer.full_name}</td>
                        <td className="py-4 px-4 text-slate-700">{customer.phone}</td>
                        {visibleColumns.includes('identity_number') && <td className="py-4 px-4 text-slate-500">{customer.identity_number}</td>}
                        {visibleColumns.includes('email') && <td className="py-4 px-4 text-slate-500">{customer.email}</td>}
                        {visibleColumns.includes('address') && <td className="py-4 px-4 text-slate-500 max-w-xs truncate" title={customer.address}>{customer.address}</td>}
                        {visibleColumns.includes('created_at') && <td className="py-4 px-4 text-slate-500">{customer.created_at}</td>}
                        <td className="py-4 px-4 text-center">
                          <button onClick={() => openEditModal(customer)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
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

        <CustomerEditModal
          isOpen={isEditModalOpen}
          customerData={editFormData}
          onClose={closeEditModal}
          onChange={handleEditFormChange}
          onSave={handleUpdateCustomer}
          companies={companies}
          employees={employees}
        />

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Yeni Müşteri Ekle</h3>
                <button onClick={closeAddModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddNewCustomer(); }}>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Adı Soyadı</label>
                    <input type="text" name="full_name" value={newCustomerData.full_name} onChange={handleNewCustomerChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Şirket Adı</label>
                    <select
                      name="company_id"
                      value={newCustomerData.company_id}
                      onChange={handleNewCustomerChange}
                      className="w-full border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                    >
                      <option value="">Seçiniz</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sorumlu Çalışan</label>
                    <select
                      name="employee_id"
                      value={newCustomerData.employee_id}
                      onChange={handleNewCustomerChange}
                      className="w-full border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm bg-white cursor-pointer"
                    >
                      <option value="">Seçiniz</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.full_name || employee.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">TC Kimlik No</label>
                    <input type="text" name="identity_number" value={newCustomerData.identity_number} onChange={handleNewCustomerChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefon Numarası</label>
                    <input type="tel" name="phone" value={newCustomerData.phone} onChange={handleNewCustomerChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                    <input type="email" name="email" value={newCustomerData.email} onChange={handleNewCustomerChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
                    <textarea name="address" value={newCustomerData.address} onChange={handleNewCustomerChange} rows="3" className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-sm"></textarea>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
                  <button type="button" onClick={closeAddModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">İptal</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-all">Müşteriyi Ekle</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Customers;
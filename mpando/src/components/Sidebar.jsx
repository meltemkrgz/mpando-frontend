import React, { useState } from 'react';

// İkonlar aynı kaldı, ancak stillendirmede renkleri CSS class'ları ile yöneteceğiz.
const icons = {
  Dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Projects: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  AI: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  QuantityTakeoff: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Inventory: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  PurchaseRequests: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Suppliers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Subcontractors: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  SiteReports: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Personnel: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Accounting: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0-8V6m0 12v-2m0 0V8m-7 4h14M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Contracts: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  ),
  Invoices: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  Settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Help: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Menu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Search: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
};

const navigationGroups = [
  {
    title: 'MAIN MENU',
    items: [
      { name: 'Dashboard', icon: icons.Dashboard, isActive: true },
      { name: 'Projects', icon: icons.Projects, href: "/projects" },
      { name: 'AI Project Analysis', icon: icons.AI },
      { name: 'Quantity Takeoff', icon: icons.QuantityTakeoff },
      { name: 'Inventory', icon: icons.Inventory },
      { name: 'Purchase Requests', icon: icons.PurchaseRequests },
    ]
  },
  {
    title: 'PEOPLE & SITES',
    items: [
      { name: 'Suppliers', icon: icons.Suppliers },
      { name: 'Subcontractors', icon: icons.Subcontractors },
      { name: 'Site Reports', icon: icons.SiteReports },
      { name: 'Personnel', icon: icons.Personnel },
    ]
  },
  {
    title: 'FINANCE & LEGAL',
    items: [
      { name: 'Accounting', icon: icons.Accounting },
      { name: 'Contracts', icon: icons.Contracts },
      { name: 'Invoices', icon: icons.Invoices },
      { name: 'AI Planning', icon: icons.AI },
    ]
  }
];

export default function AppleStyleSidebar({ isMobileMenuOpen, closeMobileMenu }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleDesktopCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // width helper: mobile always 280px, but on md screens shrink when collapsed
  const sidebarWidthClass = isSidebarCollapsed ? 'w-[280px] md:w-20' : 'w-[280px] md:w-[280px]';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-45 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Component */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${sidebarWidthClass}
          bg-white/70 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]
          transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) 
          md:relative md:translate-x-0 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header Section */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-6'} h-16 mb-2`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 text-white flex items-center justify-center font-bold shadow-lg shadow-slate-900/20 transition-all duration-300 ${isSidebarCollapsed ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm'}`}>
              M
            </div>
            {!isSidebarCollapsed && (
              <span className="text-slate-900 font-bold text-lg tracking-tight">MPANDO</span>
            )}
          </div>
          
          <button 
            className="md:hidden p-1 text-slate-400 hover:text-slate-800 transition-colors"
            onClick={closeMobileMenu}
          >
            {icons.Close}
          </button>
          
          {!isSidebarCollapsed && (
          <button 
            className="hidden md:block p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
            onClick={toggleDesktopCollapse}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          )}

           {isSidebarCollapsed && (
            <button 
              className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-500 shadow-sm hover:text-slate-900 hover:scale-110 transition-all"
              onClick={toggleDesktopCollapse}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
           )}
        </div>

        {/* Search & Project Selector (Hidden if collapsed) */}
        {!isSidebarCollapsed && (
          <div className="px-5 pb-6 space-y-3">
             {/* Search Bar - macOS Style */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600">
                {icons.Search}
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 border-transparent focus:bg-white border focus:border-blue-400/50 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
              />
            </div>

            {/* Project Dropdown */}
            <div className="group relative bg-white border border-slate-200/80 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Project</p>
                   <p className="text-sm font-semibold text-slate-800 truncate">Headquarters Build</p>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                  {icons.ChevronDown}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-hide mask-image-b-fade">
          <nav className="space-y-6 pb-6">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {!isSidebarCollapsed && (
                  <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">
                    {group.title}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`
                          group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-out
                          ${item.isActive 
                            ? 'bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-slate-200 font-medium' 
                            : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                          } 
                          ${isSidebarCollapsed ? 'justify-center px-0 py-3' : ''}
                        `}
                        title={isSidebarCollapsed ? item.name : undefined}
                      >
                        <span className={`
                          transition-transform duration-200 group-hover:scale-105
                          ${item.isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                        `}>
                          {item.icon}
                        </span>
                        {!isSidebarCollapsed && <span className="text-[13.5px]">{item.name}</span>}
                        
                        {/* Active Indicator Dot (Optional Apple Touch) */}
                        {/* {item.isActive && !isSidebarCollapsed && (
                           <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        )} */}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto bg-white/40 backdrop-blur-xl border-t border-slate-200/60 p-3">
          <ul className="space-y-1 mb-3">
            <li>
              <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <span className="group-hover:text-slate-600">{icons.Settings}</span>
                {!isSidebarCollapsed && <span className="text-sm">Settings</span>}
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                 <span className="group-hover:text-slate-600">{icons.Help}</span>
                {!isSidebarCollapsed && <span className="text-sm">Support</span>}
              </a>
            </li>
          </ul>

          {/* User Profile - Card Style */}
          <div className={`flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
                <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Anthony" 
                    alt="User" 
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">Anthony M.</p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
            )}
             {!isSidebarCollapsed && (
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
             )}
          </div>
        </div>
      </aside>
    </>
  );
}
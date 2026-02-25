import React from 'react'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
function Customers() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans text-slate-800">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0"> </main>
      <Navbar title="Müşteriler" toggleMobileMenu={toggleMobileMenu} />
    </div>
  )
}

export default Customers

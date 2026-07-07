import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Package, Users } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Triage from './pages/Triage';
import Inventory from './pages/Inventory';
import Attendance from './pages/Attendance';

function NavItem({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
      }`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen z-20">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-primary-600 tracking-tight">Sanjeevani</h2>
            <p className="text-sm text-gray-500 mt-1">PHC Smart Dashboard</p>
          </div>
          <nav className="p-4 flex flex-col gap-2">
            <NavItem to="/" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to="/triage" icon={Stethoscope}>Patient Triage</NavItem>
            <NavItem to="/inventory" icon={Package}>Pharmacy Inventory</NavItem>
            <NavItem to="/attendance" icon={Users}>Staff Attendance</NavItem>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-64 flex flex-col min-h-screen">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-800">PHC Operations Center</h1>
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              Dr. A
            </div>
          </header>
          
          <div className="p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/triage" element={<Triage />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

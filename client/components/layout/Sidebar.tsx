import React from 'react';
import { LayoutDashboard, Users, Briefcase, Settings, PieChart, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
      active 
        ? 'bg-brand-50 text-brand-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className={`h-4 w-4 ${active ? 'text-brand-600' : 'text-gray-500'}`} />
    {label}
  </Link>
);

export const Sidebar: React.FC = () => {
    const location = useLocation(); // In a real router setup
    // Using simple logic for demo since we might simulate router
    const currentPath = location ? location.pathname : '/crm';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 z-10 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xl">
            <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                W
            </div>
            WorkHub
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</p>
            <NavItem icon={LayoutDashboard} label="Dashboard" to="/" active={currentPath === '/'} />
            <NavItem icon={Users} label="CRM & Leads" to="/crm" active={currentPath === '/crm'} />
            <NavItem icon={Briefcase} label="Companies" to="/companies" active={currentPath === '/companies'} />
        </div>

        <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Analytics</p>
            <NavItem icon={PieChart} label="Reports" to="/reports" active={false} />
            <NavItem icon={Layers} label="Pipelines" to="/pipelines" active={false} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <NavItem icon={Settings} label="Settings" to="/settings" active={false} />
      </div>
    </aside>
  );
};
import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Search Bar - Global */}
      <div className="relative w-96 hidden md:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Global Search (Deals, Contacts, Companies)..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:block">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{user?.role?.replace('ROLE_', '')}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                {user?.name?.charAt(0)}
            </div>
            <button 
                onClick={logout}
                className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
            >
                <LogOut className="h-4 w-4" />
            </button>
        </div>
      </div>
    </header>
  );
};
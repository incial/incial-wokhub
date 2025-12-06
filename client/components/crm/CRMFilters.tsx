import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import { FilterState } from '../../types';

interface CRMFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onRefresh: () => void;
}

export const CRMFilters: React.FC<CRMFiltersProps> = ({ filters, setFilters, onRefresh }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
      setFilters({
          status: '',
          assignedTo: '',
          search: '',
          dateRangeStart: '',
          dateRangeEnd: ''
      });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      
      {/* Left: Inputs */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 w-full sm:w-64 transition-colors"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="lead">Lead</option>
          <option value="on progress">On Progress</option>
          <option value="Quote Sent">Quote Sent</option>
          <option value="onboarded">Onboarded</option>
          <option value="drop">Drop</option>
        </select>

        <select
          value={filters.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <option value="">All Assignees</option>
          <option value="Vallapata">Vallapata</option>
          <option value="John Doe">John Doe</option>
        </select>
        
        {hasFilters && (
            <button 
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
                <X className="h-3 w-3" /> Clear
            </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <span className="text-xs font-semibold uppercase tracking-wide">Next Follow Up:</span>
            <input 
                type="date" 
                className="bg-transparent focus:outline-none text-gray-700"
                value={filters.dateRangeStart}
                onChange={(e) => handleChange('dateRangeStart', e.target.value)}
            />
        </div>
      </div>
    </div>
  );
};
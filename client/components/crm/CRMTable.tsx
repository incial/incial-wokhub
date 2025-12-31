
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CRMEntry, CRMStatus } from '../../types';
import { getStatusStyles, formatDate, getFollowUpColor, getWorkTypeStyles } from '../../utils';
import { Phone, Mail, Eye, Trash2, ChevronDown, Check, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { PremiumLogo } from '../ui/PremiumLogo';

interface CRMTableProps {
  data: CRMEntry[];
  isLoading: boolean;
  userAvatarMap?: Record<string, string>;
  onView: (entry: CRMEntry) => void;
  onDelete: (id: number) => void;
  onStatusChange: (entry: CRMEntry, newStatus: CRMStatus) => void;
}

const UserAvatar = ({ name, url }: { name: string; url?: string }) => {
    const initials = name ? name.charAt(0).toUpperCase() : '?';
    
    if (url) {
        return (
            <img 
                src={url} 
                alt={name} 
                referrerPolicy="no-referrer"
                className="h-6 w-6 rounded-lg object-cover border border-gray-200 shadow-sm bg-white" 
                title={name}
            />
        );
    }

    return (
        <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-gray-100 to-gray-50 text-[10px] flex items-center justify-center text-gray-600 font-bold border border-gray-200 shadow-sm" title={name}>
            {initials}
        </div>
    );
};

const StatusDropdown = ({ entry, onStatusChange }: { entry: CRMEntry; onStatusChange: (e: CRMEntry, s: CRMStatus) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    
    const options: CRMStatus[] = [
        'lead', 
        'on progress', 
        'Quote Sent', 
        'onboarded', 
        'completed', 
        'drop'
    ];

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                // Check if click is inside the portal menu (we'll give it an ID)
                const menu = document.getElementById(`status-menu-${entry.id}`);
                if (menu && menu.contains(event.target as Node)) return;
                setIsOpen(false);
            }
        };

        if (isOpen) {
            updateCoords();
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, entry.id]);

    const formatStatus = (s: string) => {
        if (s === 'Quote Sent') return 'Quote Sent';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const menu = isOpen && createPortal(
        <div 
            id={`status-menu-${entry.id}`}
            className="fixed z-[9999] w-40 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5"
            style={{ 
                top: coords.top,
                left: coords.left
            }}
        >
            <div className="p-1.5">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            onStatusChange(entry, opt); 
                            setIsOpen(false); 
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg text-left transition-colors capitalize ${
                            entry.status === opt 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        {formatStatus(opt)}
                        {entry.status === opt && <Check className="h-3 w-3 text-indigo-600 ml-auto" />}
                    </button>
                ))}
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <button 
                ref={triggerRef}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black border shadow-sm transition-all hover:opacity-90 active:scale-95 capitalize whitespace-nowrap ${getStatusStyles(entry.status)}`}
            >
                {formatStatus(entry.status)}
                <ChevronDown className={`h-3 w-3 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {menu}
        </>
    );
};

const ScopeOverflowDropdown = ({ items }: { items: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.getElementById(`scope-menu-${items.join('')}`);
            if (isOpen && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                if (menu && menu.contains(event.target as Node)) return;
                setIsOpen(false);
            }
        };

        if (isOpen) {
            updateCoords();
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, items]);

    const menu = isOpen && createPortal(
        <div 
            id={`scope-menu-${items.join('')}`}
            className="fixed z-[9999] min-w-[140px] max-w-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5"
            style={{ top: coords.top, left: coords.left }}
        >
            <div className="flex flex-col gap-1.5">
                {items.map((label, idx) => (
                    <span key={idx} className={`${getWorkTypeStyles(label)} w-full text-center`}>
                        {label}
                    </span>
                ))}
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <button
                ref={triggerRef}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="px-2.5 py-1 text-[9px] font-black text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 flex items-center justify-center transition-colors hover:border-gray-200"
            >
                +{items.length}
            </button>
            {menu}
        </>
    );
};

export const CRMTable: React.FC<CRMTableProps> = ({ data, isLoading, userAvatarMap, onView, onDelete, onStatusChange }) => {
  if (isLoading) {
    return (
      <div className="p-32 text-center flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-gray-100 border-t-brand-600 mb-4"></div>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest animate-pulse">Loading Pipeline...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-b-[3rem]">
        <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <User className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-gray-900 font-bold text-lg">No records found</h3>
        <p className="text-gray-500 mt-1 text-sm">Try adjusting your filters or create a new deal.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar bg-white min-h-[500px] pb-32">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-white border-b border-gray-100">
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-white z-20 w-72 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Company / Contact</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Scope</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row) => {
            const workList = (row.work || []).map((w: any) => typeof w === 'object' ? w.name : w).filter(Boolean);
            const visibleWork = workList.slice(0, 2);
            const hiddenWork = workList.slice(2);

            return (
                <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50/50 transition-colors border-r border-transparent group-hover:border-gray-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:shadow-none">
                    <div className="flex items-center gap-4">
                    <PremiumLogo 
                        src={row.companyImageUrl} 
                        alt={row.company} 
                        fallback={<div className="h-full w-full flex items-center justify-center text-xs font-black text-gray-400 bg-gray-50">{(row.company || 'U').charAt(0).toUpperCase()}</div>}
                        containerClassName="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                        <button onClick={() => onView(row)} className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors text-left truncate tracking-tight">
                            {row.company || 'No Company'}
                        </button>
                        <span className="text-xs font-medium text-gray-500 truncate max-w-[140px]">{row.contactName || 'No Contact'}</span>
                        
                        <div className="flex gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                            <a href={`tel:${row.phone}`} className="p-1 rounded-md hover:bg-white text-gray-400 hover:text-brand-600 transition-colors" title={row.phone}><Phone className="h-3 w-3" /></a>
                            <a href={`mailto:${row.email}`} className="p-1 rounded-md hover:bg-white text-gray-400 hover:text-brand-600 transition-colors" title={row.email}><Mail className="h-3 w-3" /></a>
                        </div>
                    </div>
                    </div>
                </td>

                <td className="px-6 py-4">
                    <StatusDropdown entry={row} onStatusChange={onStatusChange} />
                </td>

                <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px] items-center">
                        {visibleWork.map((label: string) => (
                            <span key={label} className={getWorkTypeStyles(label)}>{label}</span>
                        ))}
                        {hiddenWork.length > 0 && (
                            <ScopeOverflowDropdown items={hiddenWork} />
                        )}
                        {workList.length === 0 && <span className="text-gray-300 text-[9px] font-bold">-</span>}
                    </div>
                </td>

                <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <Calendar className={`h-3 w-3 ${getFollowUpColor(row.nextFollowUp).includes('red') ? 'text-red-500' : 'text-gray-400'}`} />
                            <span className={`text-xs font-bold ${getFollowUpColor(row.nextFollowUp)}`}>
                                {formatDate(row.nextFollowUp)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 pl-0.5">
                            <Clock className="h-3 w-3 text-gray-300" />
                            <span className="text-[10px] text-gray-400 font-medium">Last: {formatDate(row.lastContact)}</span>
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <UserAvatar name={row.assignedTo} url={userAvatarMap?.[row.assignedTo]} />
                        <span className="text-xs font-bold text-gray-700">{row.assignedTo || 'Unassigned'}</span>
                    </div>
                </td>

                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => onView(row)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View Details">
                            <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDelete(row.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
                </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

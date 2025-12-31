
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Link as LinkIcon, AlignLeft, Video, Maximize2, Minimize2, Trash2, History } from 'lucide-react';
import { Meeting, MeetingStatus, User } from '../../types';
import { CustomSelect } from '../ui/CustomSelect';
import { UserSelect } from '../ui/UserSelect';
import { formatDateTime } from '../../utils';
import { usersApi } from '../../services/api';

interface MeetingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Meeting>) => void;
  onDelete?: (id: number) => void;
  initialData?: Meeting;
}

const STATUSES: MeetingStatus[] = ['Scheduled', 'Completed', 'Cancelled', 'Postponed'];

export const MeetingForm: React.FC<MeetingFormProps> = ({ isOpen, onClose, onSubmit, onDelete, initialData }) => {
  const [formData, setFormData] = useState<Partial<Meeting>>({});
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
        usersApi.getAll().then(setUsers);
        if (initialData) {
            const date = new Date(initialData.dateTime);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const dtStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
            setFormData({ ...initialData, dateTime: dtStr });
        } else {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            setFormData({
            title: '', status: 'Scheduled', meetingLink: '', notes: '',
            assignedTo: 'Unassigned', assigneeId: undefined,
            dateTime: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
            });
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleUserChange = (userId: number, userName: string) => {
      setFormData(prev => ({ ...prev, assigneeId: userId, assignedTo: userName }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full max-w-lg max-h-[100vh] sm:max-h-[90vh] overflow-hidden flex flex-col border border-white/60" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-100 bg-white/40">
            <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                {initialData ? 'Update Session' : 'Strategic Sync'}
            </h2>
            <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all">
                <X className="h-6 w-6" />
            </button>
        </div>

        <div className="p-6 lg:p-8 pb-20 overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); onClose(); }} className="space-y-6 lg:space-y-8 animate-premium">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Session Agenda</label>
                    <input type="text" required className="w-full px-6 py-3.5 lg:py-4 bg-white border border-gray-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-inner" 
                        value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Session Objective" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Timeline</label>
                        <input type="datetime-local" required className="w-full px-5 py-3.5 lg:py-4 bg-white border border-gray-200 rounded-3xl text-xs font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-inner"
                            value={formData.dateTime || ''} onChange={e => setFormData({...formData, dateTime: e.target.value})} />
                    </div>
                    <CustomSelect label="Session Status" value={formData.status || 'Scheduled'} onChange={(val) => setFormData({...formData, status: val as MeetingStatus})} options={STATUSES.map(s => ({ label: s, value: s }))} />
                </div>

                <div>
                    <UserSelect label="Organizer / Assignee" value={formData.assigneeId || formData.assignedTo || 'Unassigned'} onChange={handleUserChange} users={users} />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Communication Channel (URL)</label>
                    <input type="text" className="w-full px-6 py-3.5 lg:py-4 bg-white border border-gray-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-inner"
                        placeholder="Zoom / Meet / Teams" value={formData.meetingLink || ''} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
                </div>

                {formData.lastUpdatedBy && (
                    <div className="flex items-center justify-end pt-4 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <History className="h-3 w-3 mr-2" />
                        <span>Last updated by <span className="text-indigo-600">{formData.lastUpdatedBy}</span> on {formatDateTime(formData.lastUpdatedAt || '')}</span>
                    </div>
                )}

                <div className="flex justify-between items-center pt-6 lg:pt-8 border-t border-gray-100">
                    {initialData?.id && onDelete ? (
                        <button type="button" onClick={() => onDelete(initialData.id)} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700">Purge Sync</button>
                    ) : <div></div>}
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="text-[10px] lg:text-[11px] font-black text-slate-500 uppercase tracking-widest">Discard</button>
                        <button type="submit" className="px-6 lg:px-8 py-3 lg:py-4 text-[10px] lg:text-[11px] font-black text-white bg-slate-950 hover:bg-slate-900 rounded-2xl shadow-2xl active:scale-95 transition-all">Schedule</button>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

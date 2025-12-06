import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { CRMEntry } from '../../types';

interface CRMFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CRMEntry>) => void;
  initialData?: CRMEntry;
}

export const CRMForm: React.FC<CRMFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<CRMEntry>>({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    status: 'lead',
    assignedTo: 'Vallapata',
    dealValue: 0,
    tags: [],
    work: [],
    nextFollowUp: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
        // Reset
        setFormData({
            company: '',
            contactName: '',
            email: '',
            phone: '',
            status: 'lead',
            assignedTo: 'Vallapata',
            dealValue: 0,
            tags: [],
            work: [],
            nextFollowUp: new Date().toISOString().split('T')[0],
        });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleArrayInput = (field: 'tags' | 'work' | 'leadSources', value: string) => {
      // Simple comma separated parser for demo
      setFormData(prev => ({...prev, [field]: value.split(',').map(s => s.trim())}));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Deal' : 'New CRM Entry'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Info */}
            <div className="space-y-4">
               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</h3>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                 <input required type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                   value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                 <input required type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                   value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
               </div>
            </div>

            {/* Deal Info */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Info</h3>
                <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value (₹)</label>
                 <input type="number" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                   value={formData.dealValue} onChange={e => setFormData({...formData, dealValue: Number(e.target.value)})} />
               </div>
               <div className="grid grid-cols-2 gap-2">
                   <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                            value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="lead">Lead</option>
                            <option value="on progress">On Progress</option>
                            <option value="Quote Sent">Quote Sent</option>
                            <option value="onboarded">Onboarded</option>
                            <option value="drop">Drop</option>
                        </select>
                   </div>
                   <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                             value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                        >
                            <option value="Vallapata">Vallapata</option>
                            <option value="John Doe">John Doe</option>
                        </select>
                   </div>
               </div>
               <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow Up</label>
                    <input type="date" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                        value={formData.nextFollowUp} onChange={e => setFormData({...formData, nextFollowUp: e.target.value})} />
               </div>
            </div>
          </div>
          
          <div className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                 <textarea className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none h-20"
                    value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                 ></textarea>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input type="text" placeholder="VIP, Urgent..." className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                        value={formData.tags?.join(', ')} onChange={e => handleArrayInput('tags', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work (comma separated)</label>
                    <input type="text" placeholder="Branding, Web..." className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                        value={formData.work?.join(', ')} onChange={e => handleArrayInput('work', e.target.value)} />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
             <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">Cancel</button>
             <button type="submit" className="px-4 py-2 text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors font-medium flex items-center gap-2">
                 <Save className="h-4 w-4" /> Save Record
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
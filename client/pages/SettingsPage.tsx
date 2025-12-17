import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
    User, Bell, Shield, CreditCard, Layers, 
    Save, Check, Smartphone, Mail, Globe, 
    Slack, Github, ToggleLeft, ToggleRight, 
    Loader2, Camera, LogOut, Laptop, CheckCircle2,
    AlertCircle, Download, Plus
} from 'lucide-react';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-4 focus:ring-brand-500/10 ${enabled ? 'bg-brand-600' : 'bg-gray-200'}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
);

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    // Mock States
    const [notifications, setNotifications] = useState({
        emailLeads: true,
        emailTasks: true,
        pushMentions: true,
        pushReminders: false,
        marketing: false
    });

    const [security, setSecurity] = useState({
        twoFactor: false,
    });

    const [integrations, setIntegrations] = useState({
        slack: true,
        google: true,
        github: false
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            showToast("Settings saved successfully", "success");
        }, 800);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: User, desc: 'Profile & personal details' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Manage your alerts' },
        { id: 'security', label: 'Security', icon: Shield, desc: 'Password & 2FA' },
        { id: 'integrations', label: 'Integrations', icon: Layers, desc: 'Connected apps' },
        { id: 'billing', label: 'Billing', icon: CreditCard, desc: 'Plan & invoices' },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-80px)]">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Settings</h1>

                        <div className="flex flex-col lg:flex-row gap-8">
                            
                            {/* Sidebar Navigation */}
                            <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 group ${
                                            activeTab === tab.id 
                                            ? 'bg-white shadow-lg shadow-brand-900/5 ring-1 ring-black/5' 
                                            : 'hover:bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        <div className={`p-2.5 rounded-xl transition-colors ${
                                            activeTab === tab.id 
                                            ? 'bg-brand-600 text-white' 
                                            : 'bg-gray-100 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-600'
                                        }`}>
                                            <tab.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className={`block font-bold text-sm ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {tab.label}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {tab.desc}
                                            </span>
                                        </div>
                                        {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 min-h-[600px]">
                                
                                {/* GENERAL TAB */}
                                {activeTab === 'general' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                            <p className="text-gray-500 text-sm mt-1">Update your photo and personal details here.</p>
                                        </div>

                                        <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                                            <div className="relative group cursor-pointer">
                                                {user?.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="Profile" className="h-24 w-24 rounded-3xl object-cover ring-4 ring-gray-50" />
                                                ) : (
                                                    <div className="h-24 w-24 rounded-3xl bg-brand-50 flex items-center justify-center text-brand-600 text-2xl font-bold ring-4 ring-gray-50">
                                                        {user?.name?.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                                    Change Photo
                                                </button>
                                                <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">First Name</label>
                                                <input type="text" defaultValue={user?.name?.split(' ')[0]} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Last Name</label>
                                                <input type="text" defaultValue={user?.name?.split(' ').slice(1).join(' ')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                                                    <input type="email" defaultValue={user?.email} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bio / Role Description</label>
                                                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none" placeholder="Tell us a little about yourself..." defaultValue="Senior Project Manager handling enterprise clients." />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* NOTIFICATIONS TAB */}
                                {activeTab === 'notifications' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                                            <p className="text-gray-500 text-sm mt-1">Choose how you want to be notified.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Mail className="h-4 w-4" /> Email Alerts
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">New Leads</p>
                                                            <p className="text-xs text-gray-500">Get notified when a new lead is assigned.</p>
                                                        </div>
                                                        <Toggle enabled={notifications.emailLeads} onChange={() => setNotifications(prev => ({ ...prev, emailLeads: !prev.emailLeads }))} />
                                                    </div>
                                                    <div className="h-px bg-gray-200/50" />
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Task Assignments</p>
                                                            <p className="text-xs text-gray-500">When someone assigns you a task.</p>
                                                        </div>
                                                        <Toggle enabled={notifications.emailTasks} onChange={() => setNotifications(prev => ({ ...prev, emailTasks: !prev.emailTasks }))} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Smartphone className="h-4 w-4" /> Push Notifications
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Mentions</p>
                                                            <p className="text-xs text-gray-500">Notify when someone mentions you in comments.</p>
                                                        </div>
                                                        <Toggle enabled={notifications.pushMentions} onChange={() => setNotifications(prev => ({ ...prev, pushMentions: !prev.pushMentions }))} />
                                                    </div>
                                                    <div className="h-px bg-gray-200/50" />
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Reminders</p>
                                                            <p className="text-xs text-gray-500">Daily summaries and due date alerts.</p>
                                                        </div>
                                                        <Toggle enabled={notifications.pushReminders} onChange={() => setNotifications(prev => ({ ...prev, pushReminders: !prev.pushReminders }))} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SECURITY TAB */}
                                {activeTab === 'security' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Security & Login</h2>
                                            <p className="text-gray-500 text-sm mt-1">Manage your password and security preferences.</p>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-sm font-bold text-gray-900 mb-4">Change Password</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="password" placeholder="Current Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
                                                    <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
                                                </div>
                                                <div className="flex justify-end mt-2">
                                                    <button onClick={handleSave} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
                                                        Update Password
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                                            <div>
                                                <h3 className="font-bold text-indigo-900">Two-Factor Authentication</h3>
                                                <p className="text-xs text-indigo-600/80 mt-1 max-w-sm">Add an extra layer of security to your account by requiring a code when logging in.</p>
                                            </div>
                                            <Toggle enabled={security.twoFactor} onChange={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))} />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-4">Active Sessions</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-lg text-gray-400 border border-gray-200">
                                                            <Laptop className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">MacBook Pro <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-2">Current</span></p>
                                                            <p className="text-xs text-gray-500">Kerala, India • Chrome</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-lg text-gray-400 border border-gray-200">
                                                            <Smartphone className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">iPhone 13</p>
                                                            <p className="text-xs text-gray-500">Kerala, India • App</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-xs font-bold text-red-500 hover:text-red-700">Revoke</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* INTEGRATIONS TAB */}
                                {activeTab === 'integrations' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Integrations</h2>
                                            <p className="text-gray-500 text-sm mt-1">Supercharge your workflow with connected apps.</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-brand-200 transition-all hover:shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-[#4A154B] rounded-xl flex items-center justify-center text-white">
                                                        <Slack className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">Slack</h3>
                                                        <p className="text-xs text-gray-500">Send notifications to channels.</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setIntegrations(prev => ({...prev, slack: !prev.slack}))}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${integrations.slack ? 'bg-white border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200' : 'bg-brand-600 border-transparent text-white hover:bg-brand-700'}`}
                                                >
                                                    {integrations.slack ? 'Disconnect' : 'Connect'}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-brand-200 transition-all hover:shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                                        <Globe className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">Google Drive</h3>
                                                        <p className="text-xs text-gray-500">Sync project assets automatically.</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setIntegrations(prev => ({...prev, google: !prev.google}))}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${integrations.google ? 'bg-white border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200' : 'bg-brand-600 border-transparent text-white hover:bg-brand-700'}`}
                                                >
                                                    {integrations.google ? 'Disconnect' : 'Connect'}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-brand-200 transition-all hover:shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                                                        <Github className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">GitHub</h3>
                                                        <p className="text-xs text-gray-500">Link commits to tasks.</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setIntegrations(prev => ({...prev, github: !prev.github}))}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${integrations.github ? 'bg-white border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200' : 'bg-brand-600 border-transparent text-white hover:bg-brand-700'}`}
                                                >
                                                    {integrations.github ? 'Disconnect' : 'Connect'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* BILLING TAB */}
                                {activeTab === 'billing' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Plan & Billing</h2>
                                            <p className="text-gray-500 text-sm mt-1">Manage your subscription and payment methods.</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-medium text-gray-300">Current Plan</span>
                                                        <span className="px-2 py-0.5 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                                            Pro
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl font-bold mb-1">$29<span className="text-lg font-normal text-gray-400">/mo</span></h3>
                                                    <p className="text-xs text-gray-400">Next billing date: October 15, 2025</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="px-5 py-2.5 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors">
                                                        Upgrade Plan
                                                    </button>
                                                    <button className="px-5 py-2.5 bg-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-4">Payment Methods</h3>
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                                <div className="h-10 w-14 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <div className="w-6 h-4 bg-gray-400 rounded-sm"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900">Visa ending in 4242</p>
                                                    <p className="text-xs text-gray-500">Expiry 12/2028</p>
                                                </div>
                                                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">Default</span>
                                            </div>
                                            <button className="mt-3 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                                                <Plus className="h-3 w-3" /> Add new card
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-4">Invoice History</h3>
                                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                                {[
                                                    { date: 'Sep 15, 2025', amount: '$29.00', status: 'Paid' },
                                                    { date: 'Aug 15, 2025', amount: '$29.00', status: 'Paid' },
                                                    { date: 'Jul 15, 2025', amount: '$29.00', status: 'Paid' }
                                                ].map((invoice, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Invoice #{2025001 + i}</p>
                                                            <p className="text-xs text-gray-500">{invoice.date}</p>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                                                <CheckCircle2 className="h-3 w-3" /> {invoice.status}
                                                            </span>
                                                            <button className="text-gray-400 hover:text-gray-600">
                                                                <Download className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Save Bar (Floating) */}
                        <div className="fixed bottom-6 right-6 z-40">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { tasksApi } from '../services/api';
import { Task } from '../types';
import { Trophy, CheckCircle, Clock, AlertCircle, BarChart2, TrendingUp, Medal } from 'lucide-react';

interface UserStats {
  name: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number; // Not Started
  completionRate: number;
}

export const AdminPerformancePage: React.FC = () => {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      setIsLoading(true);
      try {
        const tasks = await tasksApi.getAll();
        
        // Group by User
        const userMap: Record<string, Task[]> = {};
        
        tasks.forEach(task => {
            const assignee = task.assignedTo || 'Unassigned';
            if (!userMap[assignee]) userMap[assignee] = [];
            userMap[assignee].push(task);
        });

        // Calculate Stats
        const calculatedStats: UserStats[] = Object.keys(userMap).map(user => {
            const userTasks = userMap[user];
            const total = userTasks.length;
            const completed = userTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
            const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
            const pending = userTasks.filter(t => t.status === 'Not Started').length;
            
            return {
                name: user,
                total,
                completed,
                inProgress,
                pending,
                completionRate: total > 0 ? (completed / total) * 100 : 0
            };
        });

        // Sort by Completed count descending
        calculatedStats.sort((a, b) => b.completed - a.completed);

        setStats(calculatedStats);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCalculate();
  }, []);

  const topPerformers = stats.slice(0, 3);
  const getRankStyle = (index: number) => {
      if (index === 0) return 'bg-yellow-50 border-yellow-200 text-yellow-700 ring-yellow-500/20'; // Gold
      if (index === 1) return 'bg-gray-100 border-gray-200 text-gray-700 ring-gray-500/20'; // Silver
      if (index === 2) return 'bg-orange-50 border-orange-200 text-orange-700 ring-orange-500/20'; // Bronze
      return 'bg-white border-gray-100 text-gray-600';
  };

  const getTrophyColor = (index: number) => {
      if (index === 0) return 'text-yellow-500';
      if (index === 1) return 'text-gray-400';
      if (index === 2) return 'text-orange-500';
      return 'text-gray-300';
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-80px)]">
           <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <BarChart2 className="h-8 w-8 text-brand-600" /> Team Performance
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Analytics on task completion and individual user productivity.</p>
           </div>

           {isLoading ? (
             <div className="animate-pulse space-y-6">
                 <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
                 <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
             </div>
           ) : (
             <>
                {/* Top Performers Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {topPerformers.map((user, index) => (
                        <div key={user.name} className={`relative p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300 ${getRankStyle(index)}`}>
                            {index < 3 && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-md border border-gray-100">
                                    <Trophy className={`h-6 w-6 ${getTrophyColor(index)}`} />
                                </div>
                            )}
                            <div className="mt-4 mb-2">
                                <div className="h-16 w-16 rounded-full bg-white border-4 border-opacity-20 border-current flex items-center justify-center text-2xl font-bold shadow-sm mx-auto">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{user.name}</h3>
                            <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mb-4">Rank #{index + 1}</p>
                            
                            <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                                <div className="bg-white/60 p-2 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs font-bold opacity-60 uppercase">Done</p>
                                    <p className="text-lg font-bold">{user.completed}</p>
                                </div>
                                <div className="bg-white/60 p-2 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs font-bold opacity-60 uppercase">Rate</p>
                                    <p className="text-lg font-bold">{user.completionRate.toFixed(0)}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Stats Table */}
                <div className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">Detailed Breakdown</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Completed
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> In Progress
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div> Not Started
                            </span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-8 py-4">User</th>
                                    <th className="px-8 py-4 text-center">Tasks Assigned</th>
                                    <th className="px-8 py-4 text-center">Completed</th>
                                    <th className="px-8 py-4 text-center">Pending</th>
                                    <th className="px-8 py-4 w-1/3">Completion Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.map((user) => (
                                    <tr key={user.name} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-700">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center font-medium text-gray-600">{user.total}</td>
                                        <td className="px-8 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-100">
                                                <CheckCircle className="h-3 w-3" /> {user.completed}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-center text-gray-500">
                                            {user.pending + user.inProgress}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${user.completionRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 w-10 text-right">{user.completionRate.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </>
           )}

        </main>
      </div>
    </div>
  );
};

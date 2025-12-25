
import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen mesh-bg relative flex items-center justify-center p-6 overflow-hidden">
      <div className="glass-canvas" />
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-2xl p-12 md:p-20 text-center max-w-2xl w-full relative overflow-hidden group">
        
        <div className="relative z-10 flex flex-col items-center">
            
            <div className="mb-10 relative">
                <div className="h-32 w-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white/50 rotate-6 group-hover:rotate-12 transition-transform duration-700">
                    <Ghost className="h-14 w-14 text-slate-300" />
                </div>
                <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-white/20 -rotate-12 group-hover:-rotate-6 transition-transform duration-700 delay-100">
                    <span className="text-3xl font-black text-white">?</span>
                </div>
            </div>

            <h1 className="text-9xl font-black text-slate-900 tracking-tighter leading-none mb-2 drop-shadow-sm opacity-90">404</h1>
            
            <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <span className="text-xs font-black text-rose-500 uppercase tracking-[0.4em]">Signal Lost</span>
            </div>

            <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-md mb-12">
                The operational node you are looking for has been moved, deleted, or does not exist in this sector.
            </p>

            <Link 
                to="/" 
                className="px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 group/btn hover:bg-slate-900"
            >
                <Home className="h-4 w-4 text-indigo-400 group-hover/btn:scale-110 transition-transform" />
                Return to Base
            </Link>
        </div>
      </div>
    </div>
  );
};

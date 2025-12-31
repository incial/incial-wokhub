
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Loader2, ArrowLeft, Mail, KeyRound, AlertCircle, ShieldCheck, RefreshCw, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

type Step = 'email' | 'reset';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await authApi.forgotPassword({ email });
      setStep('reset');
      showToast("OTP sent to your email", 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check the email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
        setError("Please enter the OTP code");
        return;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Send OTP and new password in one go to verify and update
      await authApi.changePassword({ email, newPassword: password, otp });
      showToast("Password reset successfully. Please login.", 'success');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg relative flex items-center justify-center p-6 overflow-hidden font-sans">
      <div className="glass-canvas" />
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-2xl p-8 md:p-12 max-w-lg w-full relative overflow-hidden group animate-premium">
        
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-10">
            <Link to="/login" className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 text-slate-400 hover:text-slate-900 transition-all shadow-sm group/back">
                <ArrowLeft className="h-5 w-5 group-hover/back:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-2xl border border-white/60 shadow-sm">
                <img src="/logo.png" alt="Incial" className="h-6 w-6 object-contain" />
                <span className="font-black text-slate-900 tracking-tight text-lg">Incial</span>
            </div>
        </div>

        {/* Title Section */}
        <div className="mb-10 text-center">
            <div className="mx-auto h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-xl border border-white/50 rotate-3 group-hover:rotate-6 transition-transform duration-700">
                {step === 'email' ? (
                    <Mail className="h-8 w-8 text-brand-500" />
                ) : (
                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                )}
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">
                {step === 'email' ? 'Forgot Password?' : 'Secure Account'}
            </h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                {step === 'email' 
                    ? 'Enter your registered email address. We will send a secure OTP to reset your access key.'
                    : `Code sent to ${email}. Enter the OTP below to establish a new password.`
                }
            </p>
        </div>

        {error && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 flex items-center gap-3 animate-in slide-in-from-top-2 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
            </div>
        )}

        {/* Step 1: Email Form */}
        {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <div className="relative group/input">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
                            placeholder="name@company.com"
                            required
                            autoFocus
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl active:scale-[0.98] group/btn"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <>
                            Send OTP Code <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        )}

        {/* Step 2: OTP & Reset Form Combined */}
        {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* OTP Input */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Verification Code</label>
                    <div className="relative group/input">
                        <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                        <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} // Digits only
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-lg font-black tracking-[0.5em] text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
                            placeholder="000000"
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>
                </div>

                <div className="h-px bg-slate-200/60 my-4"></div>

                {/* Password Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
                                placeholder="Min 8 characters"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <div className="relative group/input">
                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
                                placeholder="Re-enter password"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl active:scale-[0.98] mt-4"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Access Key'}
                </button>

                <div className="text-center flex flex-col gap-3 pt-2">
                    <button type="button" onClick={() => handleEmailSubmit({ preventDefault: () => {} } as any)} className="text-[10px] font-black text-brand-600 hover:text-brand-700 flex items-center justify-center gap-2 transition-colors uppercase tracking-widest">
                        <RefreshCw className="h-3 w-3" /> Resend OTP Code
                    </button>
                    <button type="button" onClick={() => setStep('email')} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                        Change email address
                    </button>
                </div>
            </form>
        )}

      </div>
    </div>
  );
};

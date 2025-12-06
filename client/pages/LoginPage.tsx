import React, { useState } from 'react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('demo@workhub.com');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.login(email, password);
      login(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-brand-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">W</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your CRM dashboard</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
             <p>Use <b>demo@workhub.com</b> / <b>demo</b> to login.</p>
        </div>
      </div>
    </div>
  );
};
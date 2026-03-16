import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        
        const res = await axios.post('http://localhost:8000/login', params);
        setToken(res.data.access_token);
        localStorage.setItem('ecotrack_token', res.data.access_token);
        toast.success('Welcome back to EcoTrack!', {
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        });
      } else {
        await axios.post('http://localhost:8000/register', {
          email,
          password,
          company_name: companyName
        });
        setIsLogin(true);
        toast.success('Registration successful! Please login.', {
          duration: 5000,
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        });
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "An error occurred";
      setError(msg);
      toast.error(msg, {
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1e293b] rounded-2xl shadow-xl border border-slate-700">
        <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                EcoTrack SaaS
            </h1>
            <p className="text-slate-400">
                {isLogin ? 'Sign in to your enterprise account' : 'Register your company'}
            </p>
        </div>

        {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                {error}
            </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Acme Corp"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                type="button"
            >
                {isLogin ? 'Register' : 'Sign In'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

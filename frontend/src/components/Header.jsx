import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

const Header = ({ title, subtitle, setActiveTab, handleLogout }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{title || "Enterprise Stats"}</h2>
        <p className="text-slate-400 mt-1">{subtitle || "Real-time sustainability metrics for your organization."}</p>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search report..." className="bg-[#1e293b] border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-64 transition-all" />
        </div>
        <div className="flex gap-2">
            <button className="p-2 bg-[#1e293b] border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors relative">
                <Bell size={20} className="text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#1e293b]"></span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className="p-2 bg-[#1e293b] border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors title='Profile'"
            >
                <User size={20} className="text-slate-400" />
            </button>
            {handleLogout && (
              <button 
                onClick={handleLogout}
                className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Logout"
              >
                  <LogOut size={20} />
              </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;

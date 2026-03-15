import React from 'react';
import { LayoutDashboard, Activity, Package, Settings, Leaf } from 'lucide-react';

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Leaf className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">EcoTrack</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem 
          icon={<LayoutDashboard size={20}/>} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <NavItem 
          icon={<Activity size={20}/>} 
          label="Analytics" 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')} 
        />
        <NavItem 
          icon={<Package size={20}/>} 
          label="Inventory" 
          active={activeTab === 'inventory'} 
          onClick={() => setActiveTab('inventory')} 
        />
        <NavItem 
          icon={<Settings size={20}/>} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#0f172a] rounded-2xl p-4 border border-slate-700">
          <p className="text-xs text-slate-500 font-medium mb-2 uppercase">Pro Plan</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-3">
            <div className="bg-emerald-500 h-full w-2/3 rounded-full"></div>
          </div>
          <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

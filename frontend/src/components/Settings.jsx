import React from 'react';
import { Settings as SettingsIcon, Bell, Lock, Eye, Globe } from 'lucide-react';

const SettingRow = ({ icon, title, description, action }) => (
  <div className="flex items-center justify-between p-6 bg-[#1e293b] border border-slate-700/50 rounded-2xl transition-all hover:border-slate-600">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-slate-400 text-xs">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

const Toggle = ({ checked }) => (
  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-700'}`}>
    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
  </div>
);

const Settings = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingRow 
          icon={<Bell size={20} />}
          title="Push Notifications"
          description="Receive real-time alerts on environmental threshold breaches."
          action={<Toggle checked={true} />}
        />
        <SettingRow 
          icon={<Lock size={20} />}
          title="Two-Factor Auth"
          description="Secure your account with multi-layered authentication."
          action={<button className="px-4 py-1.5 bg-[#0f172a] text-slate-200 text-xs font-bold rounded-lg border border-slate-700 hover:bg-slate-800">Enable</button>}
        />
        <SettingRow 
          icon={<Eye size={20} />}
          title="Data Visibility"
          description="Control which regions can view your organization's metrics."
          action={<button className="px-4 py-1.5 bg-[#0f172a] text-slate-200 text-xs font-bold rounded-lg border border-slate-700 hover:bg-slate-800">Configure</button>}
        />
        <SettingRow 
          icon={<Globe size={20} />}
          title="Regional Settings"
          description="Set your timezone and preferred metric units."
          action={<span className="text-xs text-slate-500 font-mono">UTC+3 (Metric)</span>}
        />
      </div>

      <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-2xl border border-emerald-500/20 mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">System Calibration</h3>
            <p className="text-slate-400 text-sm">Force reload sensor indices and clear local telemetry cache.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
          Run Maintenance
        </button>
      </div>
    </div>
  );
};

export default Settings;

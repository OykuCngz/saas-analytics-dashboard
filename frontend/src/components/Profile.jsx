import React from 'react';
import { User, Mail, Shield, Bell, Camera } from 'lucide-react';

const Profile = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 bg-slate-800 rounded-2xl border-4 border-[#1e293b] flex items-center justify-center overflow-hidden shadow-2xl">
              <User size={48} className="text-slate-400" />
            </div>
            <button className="absolute bottom-0 left-20 p-2 bg-emerald-500 rounded-lg text-white shadow-lg hover:bg-emerald-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Alex Johnson</h3>
                <p className="text-slate-400 text-sm">Enterprise Administrator</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                  <Mail className="text-emerald-400" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Email Address</p>
                    <p className="text-slate-200">alex.j@ecotrack.io</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                  <Shield className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Role & Permissions</p>
                    <p className="text-slate-200">Full System Access</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 self-start">
              <h4 className="text-sm font-bold text-white uppercase mb-4 tracking-wider text-emerald-500">Account Statistics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Reports Generated</span>
                  <span className="text-white font-mono">1,284</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Active Sensors</span>
                  <span className="text-white font-mono">42</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Carbon Saved</span>
                  <span className="text-emerald-400 font-mono">12.5 Tons</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 flex justify-end gap-4">
            <button className="px-6 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">Discard</button>
            <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all">Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

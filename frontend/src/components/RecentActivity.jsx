import React from 'react';
import { ExternalLink, MoreVertical } from 'lucide-react';

const RecentActivity = ({ data }) => {
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl overflow-hidden mt-8 transition-all hover:border-slate-600">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Recent Sustainability Events</h3>
        <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors">
          View all <ExternalLink size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Metric Name</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Time</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-slate-200 font-medium">{item.metric_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-900 text-slate-400 rounded-md text-[10px] font-bold border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">{item.value}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-slate-300 text-sm">Verified</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;

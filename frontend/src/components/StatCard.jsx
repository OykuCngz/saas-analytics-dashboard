import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, category, trend = "+12.5%" }) => {
  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg group hover:border-emerald-500/50 transition-all cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
          <Activity size={20} className="text-slate-400 group-hover:text-emerald-400" />
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-slate-800 rounded-full text-slate-400 uppercase tracking-widest border border-slate-700">
            {category}
        </span>
      </div>
      <h4 className="text-slate-400 font-medium text-sm mb-1">{title}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
          {trend}
        </div>
      </div>
      <div className="mt-4 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
        <div className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse-soft w-full`}></div>
      </div>

    </div>
  );
};

export default StatCard;

import React, { useState, useEffect } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';

const RecentActivity = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const size = 5;

  const fetchActivity = async () => {
    setLoading(true);
    const token = localStorage.getItem('ecotrack_token');
    try {
      let url = `http://localhost:8000/recent-activity?page=${page}&size=${size}`;
      if (startDate) url += `&start_date=${startDate}T00:00:00`;
      if (endDate) url += `&end_date=${endDate}T23:59:59`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching paginated data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [page, startDate, endDate]);

  const totalPages = Math.ceil(total / size);

  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl overflow-hidden mt-8 transition-all hover:border-slate-600">
      <div className="p-4 md:p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h3 className="text-lg font-semibold text-white">Advanced Activity Logs</h3>
            <p className="text-xs text-slate-400 mt-1">Showing real-time paginated organization data</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-slate-700 flex-1 md:flex-none">
            <Filter size={14} className="text-slate-400" />
            <input 
                type="date" 
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="bg-transparent text-sm text-slate-300 outline-none w-full md:w-auto custom-calendar-icon" 
            />
            <span className="text-slate-500">-</span>
            <input 
                type="date" 
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="bg-transparent text-sm text-slate-300 outline-none w-full md:w-auto custom-calendar-icon" 
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative min-h-[50px]">
        {loading && (
          <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Metric Name</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.length === 0 && !loading && (
                <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                        No records found for the selected dates.
                    </td>
                </tr>
            )}
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-slate-200 font-medium">{item.metric_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-900 text-slate-400 rounded-md text-[10px] font-bold border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">{item.value.toFixed(1)}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
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

      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/20">
        <div className="text-sm text-slate-400">
          Showing <span className="font-medium text-slate-200">{items.length > 0 ? (page - 1) * size + 1 : 0}</span> to <span className="font-medium text-slate-200">{Math.min(page * size, total)}</span> of <span className="font-medium text-slate-200">{total}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 px-3 bg-[#1e293b] border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => (
               <button 
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-700'}`}
               >
                 {i + 1}
               </button>
            ))}
          </div>

          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || totalPages === 0}
            className="p-1 px-3 bg-[#1e293b] border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
             Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;

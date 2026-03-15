import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Login from './components/Login';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('ecotrack_token'));

  const handleLogout = () => {
    localStorage.removeItem('ecotrack_token');
    setToken(null);
  };

  useEffect(() => {
    if (!token) {
        setLoading(false);
        return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
            handleLogout();
            return;
        }
        console.error("Using mock data as backend is unreachable");
        setData([
          { metric_name: "Carbon Offset", value: 450.5, category: "Environment", timestamp: "2024-03-12T10:00:00" },
          { metric_name: "Energy Saved", value: 1200.0, category: "Logistics", timestamp: "2024-03-12T11:00:00" },
          { metric_name: "Water Recovered", value: 85.2, category: "Resources", timestamp: "2024-03-12T12:00:00" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.map((item, idx) => (
                <StatCard 
                    key={idx} 
                    title={item.metric_name} 
                    value={item.value} 
                    category={item.category} 
                    trend={idx % 2 === 0 ? "+14.2%" : "-2.5%"}
                />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl transition-all hover:border-slate-600">
                <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Resource Efficiency
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="metric_name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#10b981' }}
                        cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl transition-all hover:border-slate-600">
                <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Sustainability Trend
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(str) => new Date(str).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#06b6d4" 
                        strokeWidth={4} 
                        dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4, stroke: '#1e293b' }} 
                        activeDot={{ r: 6, strokeWidth: 0 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Activity Table */}
            <RecentActivity data={data} />
          </>
        );
    }
  };

  const getHeaderInfo = () => {
    switch(activeTab) {
      case 'profile':
        return { title: "User Profile", subtitle: "Manage your personal information and account settings." };
      case 'settings':
        return { title: "System Settings", subtitle: "Configure organization-wide preferences and security." };
      default:
        return { title: "Enterprise Stats", subtitle: "Real-time sustainability metrics for your organization." };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0f172a] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading EcoTrack...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return <Login setToken={setToken} />;
  }

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <Header 
          title={headerInfo.title} 
          subtitle={headerInfo.subtitle} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout}
        />

        {renderContent()}

        {/* Footer info */}
        <footer className="mt-12 text-center text-slate-500 text-sm border-t border-slate-800 pt-8">
            <p>© 2024 EcoTrack Enterprise • Made for Sustainability</p>
        </footer>
      </main>
    </div>
  );
};

export default App;

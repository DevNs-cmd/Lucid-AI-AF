"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { 
  LayoutDashboard, BarChart2, Users, Settings, FileText, 
  Search, Bell, TrendingUp, TrendingDown, Clock, MousePointerClick, UserCircle, Menu
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- DATA INITIALIZATION ---
const summaryStats = { visitsToday: 1245, activeUsers: 87, avgSession: '3m 42s', conversionRate: '2.1%' };

const usageChartData = [
  { name: 'Oct 1', sessions: 800 }, { name: 'Oct 2', sessions: 812 }, { name: 'Oct 3', sessions: 850 },
  { name: 'Oct 4', sessions: 910 }, { name: 'Oct 5', sessions: 905 }, { name: 'Oct 6', sessions: 930 },
  { name: 'Oct 7', sessions: 955 }, { name: 'Oct 8', sessions: 970 }, { name: 'Oct 9', sessions: 990 },
  { name: 'Oct 10', sessions: 1010 }, { name: 'Oct 11', sessions: 1035 }, { name: 'Oct 12', sessions: 1060 },
  { name: 'Oct 13', sessions: 1055 }, { name: 'Oct 14', sessions: 1080 }, { name: 'Oct 15', sessions: 1105 },
  { name: 'Oct 16', sessions: 1130 }, { name: 'Oct 17', sessions: 1125 }, { name: 'Oct 18', sessions: 1150 },
  { name: 'Oct 19', sessions: 1175 }, { name: 'Oct 20', sessions: 1200 }, { name: 'Oct 21', sessions: 1195 },
  { name: 'Oct 22', sessions: 1220 }, { name: 'Oct 23', sessions: 1245 },
];

const platformBreakdown = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 32 },
  { name: 'Tablet', value: 3 },
];
const COLORS = ['#8b5cf6', '#3b82f6', '#f43f5e'];

const topPages = [
  { page: '/dashboard', visits: 450, change: '+12%', positive: true },
  { page: '/analytics', visits: 310, change: '+8%', positive: true },
  { page: '/settings', visits: 150, change: '-2%', positive: false }
];

const recentActivity = [
  { user: 'Admin Jane', action: 'Created User', target: 'John Doe', time: '5m ago', avatar: 'AJ', color: 'bg-emerald-500' },
  { user: 'Editor Bob', action: 'Published Post', target: 'Q3 Report', time: '12m ago', avatar: 'EB', color: 'bg-blue-500' }
];

const calendarState = {
  currentMonth: 'October 2023',
  today: 26,
  highlightedDates: [5, 12, 19, 26],
  events: [
    { date: 28, title: 'Team Sync (10 AM)' },
    { date: 31, title: 'Halloween Office Party' },
    { date: 2, month: 'Nov', title: 'Project Alpha Launch' }
  ]
};

// --- COMPONENTS ---

function SidebarCalendar() {
  const [visualMonth, setVisualMonth] = useState(calendarState.currentMonth);
  // Generate a mock 31 day month grid
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mt-6">
      <div className="flex justify-between items-center mb-4">
        <button className="text-white/50 hover:text-white">&lt;</button>
        <span className="text-sm font-bold text-white">{visualMonth}</span>
        <button className="text-white/50 hover:text-white">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] text-white/40 font-medium">{d}</div>
        ))}
        {/* Empty slots for start of month (assuming starts on a Sunday for demo) */}
        {days.map(day => {
          const isToday = day === calendarState.today;
          const isHighlighted = calendarState.highlightedDates.includes(day);
          return (
            <div 
              key={day} 
              className={`text-xs w-6 h-6 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-colors
                ${isToday ? 'bg-glow-primary text-white font-bold shadow-glow' : 
                  isHighlighted ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:bg-white/10'}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="space-y-3 pt-3 border-t border-white/10">
        <h4 className="text-xs text-white/50 uppercase tracking-widest font-bold">Upcoming</h4>
        {calendarState.events.map((evt, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="bg-white/10 rounded px-2 py-1 text-center min-w-[36px]">
              <div className="text-[10px] text-glow-primary font-bold uppercase leading-none">{evt.month || 'Oct'}</div>
              <div className="text-sm font-black text-white leading-tight">{evt.date}</div>
            </div>
            <div className="text-xs text-white/80 font-medium leading-snug">{evt.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AntigravityAdminPanel() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-ink flex font-body">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#121217] border-r border-white/5 hidden md:flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="w-6 h-6 rounded bg-glow-primary flex items-center justify-center mr-3 shadow-glow">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-display font-bold text-white tracking-wide">LUCID AI Panel</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-glow-primary/10 text-glow-primary font-medium">
            <LayoutDashboard size={18} /> Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <BarChart2 size={18} /> Analytics
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Users size={18} /> Users
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <FileText size={18} /> Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Settings size={18} /> Settings
          </a>

          <SidebarCalendar />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
              SJ
            </div>
            <div>
              <div className="text-sm font-bold text-white">System Admin</div>
              <div className="text-xs text-white/40">admin@lucid.ai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="h-16 bg-[#121217]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white/50 hover:text-white"><Menu /></button>
            <h1 className="text-lg font-display font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input 
                type="text" 
                placeholder="Search dashboard..." 
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-glow-primary focus:ring-1 focus:ring-glow-primary w-64 transition-all"
              />
            </div>
            <button className="relative text-white/50 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-[#121217]" />
            </button>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-xs text-white/50 hover:text-white border-white/10 h-8 px-3">
                Exit Admin
              </Button>
            </Link>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
          
          {/* Row 1: Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-white/70"><Users size={20} /></div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> +12.5%
                </div>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">Visits Today</h3>
              <div className="text-3xl font-display font-bold text-white">{summaryStats.visitsToday.toLocaleString()}</div>
            </div>
            {/* Stat 2 */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-white/70"><UserCircle size={20} /></div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> +5.2%
                </div>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">Active Users</h3>
              <div className="text-3xl font-display font-bold text-white">{summaryStats.activeUsers}</div>
            </div>
            {/* Stat 3 */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-white/70"><Clock size={20} /></div>
                <div className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-400/10 px-2 py-1 rounded-full">
                  <TrendingDown size={12} /> -1.1%
                </div>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">Avg Session</h3>
              <div className="text-3xl font-display font-bold text-white">{summaryStats.avgSession}</div>
            </div>
            {/* Stat 4 */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-white/70"><MousePointerClick size={20} /></div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> +0.4%
                </div>
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-1">Conversion Rate</h3>
              <div className="text-3xl font-display font-bold text-white">{summaryStats.conversionRate}</div>
            </div>
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Usage Trend */}
            <div className="lg:col-span-2 bg-[#121217] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display font-bold text-white text-lg">Website Usage Trend</h2>
                  <p className="text-white/40 text-xs">Sessions over the selected timeframe</p>
                </div>
                <select 
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                  value={timeframe}
                  onChange={e => setTimeframe(e.target.value)}
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121217', borderColor: '#ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="sessions" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="font-display font-bold text-white text-lg">Platform Breakdown</h2>
                <p className="text-white/40 text-xs">User devices over last 30 days</p>
              </div>
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {platformBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121217', borderColor: '#ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-2xl font-bold text-white">100%</span>
                  <span className="text-xs text-white/40">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Pages */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6">
              <h2 className="font-display font-bold text-white text-lg mb-4">Top Pages</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-3 text-xs uppercase tracking-widest text-white/40 font-medium">Page URL</th>
                      <th className="py-3 text-xs uppercase tracking-widest text-white/40 font-medium">Visits</th>
                      <th className="py-3 text-xs uppercase tracking-widest text-white/40 font-medium">% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 text-sm text-white">{row.page}</td>
                        <td className="py-4 text-sm text-white font-medium">{row.visits}</td>
                        <td className="py-4 text-sm">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${row.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {row.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {row.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#121217] border border-white/5 rounded-2xl p-6 flex flex-col">
              <h2 className="font-display font-bold text-white text-lg mb-4">Recent Activity</h2>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg ${act.color}`}>
                      {act.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">
                        <span className="font-bold text-white">{act.user}</span> {act.action} <span className="font-medium text-glow-primary">{act.target}</span>
                      </p>
                      <span className="text-xs text-white/40">{act.time}</span>
                    </div>
                  </div>
                ))}
                {/* Extra dummy items for scrolling */}
                <div className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-purple-500">
                    SJ
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/80"><span className="font-bold text-white">System Admin</span> Exported Data <span className="font-medium text-glow-primary">Analytics CSV</span></p>
                    <span className="text-xs text-white/40">1h ago</span>
                  </div>
                </div>
                <div className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-orange-500">
                    SA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/80"><span className="font-bold text-white">System Automator</span> Triggered Backup <span className="font-medium text-glow-primary">DB Snapshot</span></p>
                    <span className="text-xs text-white/40">3h ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

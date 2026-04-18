import React, { useEffect, useState } from 'react';
import { TrendingUp, Eye, MessageCircle, Monitor } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

const PAGE_LABELS = {
  '/': 'Home',
  '/projects': 'Projects',
  '/expertise': 'Expertise',
  '/process': 'Process',
  '/contact': 'Contact',
};

function BarChart({ data, maxValue }) {
  return (
    <div className="space-y-3">
      {data.map(item => {
        const pct = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="flex justify-between text-xs font-bold text-mn-primary mb-1">
              <span className="uppercase tracking-widest text-mn-tertiary/60">{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="h-2 bg-mn-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-mn-primary rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniCalendar({ days }) {
  const max = Math.max(...days.map(d => parseInt(d.count)), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {days.map(d => {
        const pct = (parseInt(d.count) / max) * 100;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full bg-mn-primary/20 rounded-t-sm group-hover:bg-mn-primary transition-all"
              style={{ height: `${Math.max(pct, 8)}%` }}
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-mn-primary text-white text-[9px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-10">
              {new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}: {d.count} views
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [waStats, setWaStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [sRes, wRes] = await Promise.all([
      fetch(`${API_URL}/analytics/stats`),
      fetch(`${API_URL}/wa/stats`),
    ]);
    const s = await sRes.json();
    const w = await wRes.json();
    setStats(s);
    setWaStats(w);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin" />
    </div>
  );

  const pageData = (stats?.by_page || []).map(p => ({
    label: PAGE_LABELS[p.page] || p.page,
    count: parseInt(p.count),
  }));
  const maxPage = Math.max(...pageData.map(d => d.count), 1);

  const projData = (stats?.by_project || []).map(p => ({
    label: p.project_title,
    count: parseInt(p.count),
  }));
  const maxProj = Math.max(...projData.map(d => d.count), 1);

  const waSourceData = (waStats?.by_source || []).map(s => ({
    label: s.source,
    count: parseInt(s.count),
  }));
  const maxWa = Math.max(...waSourceData.map(d => d.count), 1);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-mn-primary italic tracking-tighter uppercase">
          Visitor <span className="text-mn-on-primary-container">Analytics</span>
        </h2>
        <p className="text-mn-tertiary/60 mt-1">Statistik real-time pengunjung dan WhatsApp leads.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Page Views', value: stats?.total_views || 0, icon: Eye, color: 'bg-blue-500' },
          { label: 'WA Leads', value: waStats?.total || 0, icon: MessageCircle, color: 'bg-emerald-500' },
          { label: 'Pages Tracked', value: (stats?.by_page || []).length, icon: Monitor, color: 'bg-mn-primary' },
          { label: 'Projects Viewed', value: (stats?.by_project || []).length, icon: TrendingUp, color: 'bg-amber-500' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-mn-primary/5 rounded-[2rem] p-6">
            <div className={`w-10 h-10 ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/50">{s.label}</p>
            <p className="text-4xl font-black italic text-mn-primary mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Views per day */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-black text-mn-primary italic uppercase mb-6">Views - Last 7 Days</h3>
          {stats?.last_7_days?.length > 0 ? (
            <MiniCalendar days={stats.last_7_days} />
          ) : (
            <p className="text-mn-tertiary/40 font-bold text-center py-8">Belum ada data views.</p>
          )}
        </div>

        {/* WA Leads by source */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-black text-mn-primary italic uppercase mb-6">WA Leads by Source</h3>
          {waSourceData.length > 0 ? (
            <BarChart data={waSourceData} maxValue={maxWa} />
          ) : (
            <p className="text-mn-tertiary/40 font-bold text-center py-8">Belum ada leads. Tombol WhatsApp belum diklik.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Page Views */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-black text-mn-primary italic uppercase mb-6">Views by Page</h3>
          {pageData.length > 0 ? (
            <BarChart data={pageData} maxValue={maxPage} />
          ) : (
            <p className="text-mn-tertiary/40 font-bold text-center py-8">Belum ada data per halaman.</p>
          )}
        </div>

        {/* Project views */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-black text-mn-primary italic uppercase mb-6">Top Viewed Projects</h3>
          {projData.length > 0 ? (
            <BarChart data={projData} maxValue={maxProj} />
          ) : (
            <p className="text-mn-tertiary/40 font-bold text-center py-8">Belum ada data views project.</p>
          )}
        </div>
      </div>
    </div>
  );
}

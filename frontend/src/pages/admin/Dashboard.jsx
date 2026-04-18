import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ProjectManagement from './ProjectManagement';
import TestimonialManagement from './TestimonialManagement';
import UserManagement from './UserManagement';
import MediaLibrary from './MediaLibrary';
import AnalyticsDashboard from './AnalyticsDashboard';
import {
  Activity,
  Archive,
  BarChart3,
  FolderKanban,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { buildProjectSearchText, mapProjectRow } from '../../lib/projects';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { profile } = useAuth();

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const [projectsRes, profilesRes] = await Promise.all([
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/profiles`),
        ]);

        if (!projectsRes.ok || !profilesRes.ok) throw new Error('Gagal mengambil data sistem');

        const projectRows = await projectsRes.json();
        const profileRows = await profilesRes.json();

        setProjects((projectRows || []).map(mapProjectRow));
        setProfiles(profileRows || []);
      } catch (error) {
        console.error('Dashboard sync error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  const stats = useMemo(() => {
    const published = projects.filter((item) => item.status?.toLowerCase() === 'published').length;
    const drafts = projects.filter((item) => item.status?.toLowerCase() === 'draft').length;
    const archived = projects.filter((item) => item.status?.toLowerCase() === 'archived').length;
    const categories = new Set(projects.map((item) => item.category).filter(Boolean)).size;

    return [
      {
        label: 'Projects',
        value: projects.length,
        icon: FolderKanban,
        trend: published >= drafts ? 'up' : 'down',
        trendValue: `${published} live`,
        color: 'bg-mn-primary',
      },
      {
        label: 'Published',
        value: published,
        icon: Activity,
        trend: published > 0 ? 'up' : 'down',
        trendValue: `${drafts} draft`,
        color: 'bg-emerald-500',
      },
      {
        label: 'Team Profiles',
        value: profiles.length,
        icon: Users,
        trend: profiles.length > 0 ? 'up' : 'down',
        trendValue: `${categories} category`,
        color: 'bg-blue-500',
      },
      {
        label: 'Archived',
        value: archived,
        icon: Archive,
        trend: archived > 0 ? 'down' : 'up',
        trendValue: `${categories} lanes`,
        color: 'bg-amber-500',
      },
    ];
  }, [profiles.length, projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects.slice(0, 6);

    return projects
      .filter((project) => buildProjectSearchText(project).includes(query))
      .slice(0, 6);
  }, [projects, search]);

  const categoryBreakdown = useMemo(() => {
    const counts = projects.reduce((accumulator, project) => {
      const key = project.category || 'Uncategorized';
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [projects]);

  const recentProfiles = profiles.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-mn-surface font-manrope">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-grow ml-72 p-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-mn-primary uppercase tracking-tighter italic">
              System <span className="text-mn-on-primary-container">Overview</span>
            </h1>
            <p className="text-mn-tertiary/60 font-medium">Have a good day at work, {profile?.first_name || 'Admin'}.</p>
          </div>

          <div className="relative group max-w-xl w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mn-tertiary/40 group-focus-within:text-mn-primary transition-colors" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder="Search project title, stack, deliverable..."
              className="bg-white border border-mn-primary/5 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mn-primary/10 transition-all w-full"
            />
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-10">
                <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black text-mn-primary uppercase italic tracking-tight">Recent Project Activity</h3>
                      <p className="text-sm text-mn-tertiary/50 mt-1">Project yang paling baru diubah atau cocok dengan pencarian.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-mn-surface transition-all border border-transparent hover:border-mn-primary/5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-mn-surface flex items-center justify-center font-black text-mn-primary">
                            {project.title.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-mn-primary leading-none mb-1">{project.title}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-mn-tertiary/40">
                              {project.category} • {project.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-mn-primary">#{project.sort_order}</p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-mn-tertiary/40">
                            {project.featured ? 'Featured' : project.project_type}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-3xl bg-mn-surface p-8 text-sm font-bold text-mn-tertiary/50">
                        Tidak ada hasil untuk pencarian saat ini.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-mn-primary-container rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <h4 className="text-lg font-black uppercase italic mb-6">Category Breakdown</h4>
                    <div className="space-y-4">
                      {categoryBreakdown.length > 0 ? categoryBreakdown.map(([category, count]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/70">
                            <span>{category}</span>
                            <span>{count}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${Math.max((count / projects.length) * 100, 10)}%` }}></div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-white/70">Belum ada data category.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck className="text-mn-primary" size={20} />
                      <h4 className="text-lg font-black uppercase italic text-mn-primary">Recent Team Access</h4>
                    </div>
                    <div className="space-y-4">
                      {recentProfiles.length > 0 ? recentProfiles.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-2xl bg-mn-surface px-4 py-3">
                          <div>
                            <p className="text-sm font-bold text-mn-primary">
                              {[member.first_name, member.last_name].filter(Boolean).join(' ') || member.email}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-mn-tertiary/40">{member.email}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-mn-primary">
                            {member.role}
                          </span>
                        </div>
                      )) : (
                        <div className="rounded-2xl bg-mn-surface px-4 py-5 text-sm font-bold text-mn-tertiary/50">
                          Belum ada profile yang tercatat.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'projects' ? (
          <ProjectManagement />
        ) : activeTab === 'users' ? (
          <UserManagement />
        ) : activeTab === 'testimonials' ? (
          <TestimonialManagement />
        ) : activeTab === 'media' ? (
          <MediaLibrary />
        ) : activeTab === 'analytics' ? (
          <AnalyticsDashboard />
        ) : (
          <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black uppercase italic text-mn-primary">Settings</h2>
            <div className="mt-8 grid gap-4">
              {[
                'Admin access mengikuti role di tabel profiles dan session Supabase.',
                'Halaman publik hanya menampilkan project dengan status published.',
                'Featured, sort order, deliverables, live URL, dan gallery sekarang disinkronkan penuh.',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-mn-surface px-5 py-4 text-sm font-bold text-mn-primary">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

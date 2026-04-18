import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase/client';

const WA_NUMBER = '6281234567890';
const API_URL = 'http://localhost:5001/api';

const trackWA = async (source, projectTitle) => {
  try {
    await fetch(`${API_URL}/wa/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, project_title: projectTitle }),
    });
  } catch (_) {}
};

import {
  ChevronRight,
  ExternalLink,
  Search,
  Shield,
  X,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  buildProjectSearchText,
  DEFAULT_PROJECT_IMAGE,
  mapProjectRow,
} from './lib/projects';
import SEO from './components/SEO';

const ProjectModal = ({ project, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!project) return null;

  const rawImages = [project.image_url, ...(project.gallery || [])].filter(Boolean);
  const allImages = rawImages.length > 0 ? Array.from(new Set(rawImages)) : [DEFAULT_PROJECT_IMAGE];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % allImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": project.title,
    "description": project.description,
    "image": project.image_url || DEFAULT_PROJECT_IMAGE,
    "datePublished": project.published_at || project.created_at,
    "dateModified": project.created_at,
    "author": {
      "@type": "Organization",
      "name": "TripleVibe"
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <SEO 
        title={`${project.title} | TripleVibe Portfolio`} 
        description={project.description} 
        image={project.image_url || DEFAULT_PROJECT_IMAGE} 
        jsonLd={jsonLd}
        type="article"
      />
      <div className="absolute inset-0 bg-mn-primary/40 backdrop-blur-xl" onClick={onClose}></div>

      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-mn-surface hover:bg-mn-primary hover:text-white rounded-2xl transition-all z-20"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-64 md:h-96 lg:h-full relative overflow-hidden bg-mn-surface group">
            <img
              src={allImages[currentSlide]}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-700"
            />

            {allImages.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevSlide} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-mn-primary transition-all">
                    <ChevronRight size={24} className="rotate-180" />
                  </button>
                  <button onClick={nextSlide} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-mn-primary transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/40'}`}></div>
                  ))}
                </div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-mn-primary/20 to-transparent pointer-events-none"></div>
          </div>

          <div className="p-8 md:p-16">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-block px-4 py-1 bg-mn-primary/5 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-mn-primary">{project.category}</span>
              </div>
              {project.featured && (
                <div className="inline-block px-4 py-1 bg-amber-100 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Featured</span>
                </div>
              )}
            </div>

            <h2 className="text-4xl font-black text-mn-primary tracking-tighter uppercase italic mb-6 leading-none">
              {project.title}
            </h2>

            <p className="text-mn-secondary text-lg leading-relaxed mb-10">{project.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <Shield className="text-mn-primary" size={20} />
                <div>
                  <p className="font-black text-[10px] uppercase tracking-widest text-mn-tertiary/40">Type</p>
                  <p className="text-sm font-bold text-mn-primary">{project.project_type || 'Custom Product'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="text-mn-primary" size={20} />
                <div>
                  <p className="font-black text-[10px] uppercase tracking-widest text-mn-tertiary/40">Status</p>
                  <p className="text-sm font-bold text-mn-primary capitalize">{project.status}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-mn-primary">Key Deliverables</h4>
              {(project.deliverables?.length ? project.deliverables : ['Discovery', 'Engineering', 'Release Support']).map((item) => (
                <div key={item} className="flex items-center gap-3 text-mn-secondary text-sm">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-mn-surface rounded-xl text-[10px] font-black uppercase tracking-widest text-mn-tertiary/40 border border-mn-primary/5">
                  {tag}
                </span>
              ))}
            </div>

            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWA('project-live-url', project.title)}
                className="w-full py-5 bg-mn-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:-translate-y-1 transition-all shadow-xl shadow-mn-primary/20"
              >
                Visit Live Project <ExternalLink size={18} />
              </a>
            ) : (
              <button
                onClick={() => { trackWA('project-wa-consult', project.title); window.open(`https://wa.me/${WA_NUMBER}?text=Halo%20TripleVibe%2C%20saya%20tertarik%20dengan%20project%20${encodeURIComponent(project.title)}%20yang%20saya%20lihat%20di%20portofolio!`, '_blank'); }}
                className="w-full py-5 bg-mn-primary/5 border-2 border-mn-primary text-mn-primary rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-mn-primary hover:text-white transition-all"
              >
                Tanya via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onOpen }) => (
  <div className="group bg-white border border-mn-primary/5 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500">
    <div className="aspect-[16/10] overflow-hidden bg-mn-surface relative">
      <img src={project.image_url || DEFAULT_PROJECT_IMAGE} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute top-6 left-6 flex gap-2">
        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-mn-primary">{project.category}</span>
        </div>
        {project.featured && (
          <div className="px-4 py-2 bg-amber-100 backdrop-blur-md rounded-2xl shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Featured</span>
          </div>
        )}
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-xl font-black text-mn-primary tracking-tight uppercase italic mb-4">{project.title}</h3>
      <p className="text-mn-secondary text-sm leading-relaxed mb-8 line-clamp-3">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <span key={tag} className="text-[8px] font-black bg-mn-surface text-mn-tertiary/60 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-mn-primary/5">{tag}</span>
        ))}
      </div>

      <button
        onClick={() => onOpen(project)}
        className="w-full py-4 bg-mn-surface group-hover:bg-mn-primary rounded-2xl flex items-center justify-center gap-2 transition-all duration-500"
      >
        <span className="text-xs font-black uppercase tracking-widest text-mn-tertiary/60 group-hover:text-white transition-colors">View Deep Details</span>
        <ChevronRight size={16} className="text-mn-tertiary/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </button>
    </div>
  </div>
);

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Gagal mengambil data project');
        
        const data = await response.json();
        // Hanya tampilkan project yang statusnya published
        const publishedProjects = (data || [])
          .filter(project => project.status === 'published')
          .map(mapProjectRow);
          
        setProjects(publishedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Project portfolio belum bisa dimuat.');
      }

      setLoading(false);
    };

    fetchProjects();
  }, []);

  const categories = useMemo(
    () => ['all', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === 'all' || project.category === category;
      const matchesSearch = !searchValue || buildProjectSearchText(project).includes(searchValue);
      return matchesCategory && matchesSearch;
    });
  }, [projects, category, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mn-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-mn-surface min-h-screen pt-32 pb-20 px-8 selection:bg-mn-primary selection:text-white">
      {!selectedProject && (
        <SEO 
          title="Portfolio | TripleVibe" 
          description="Eksplorasi proyek yang sudah published, terkurasi berdasarkan kategori, dan siap dilihat detail implementasinya." 
        />
      )}
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-4 py-1.5 bg-mn-primary/5 rounded-full mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mn-primary">Portfolio Archive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-mn-primary italic tracking-tighter uppercase leading-none">
            Architectural <span className="text-mn-on-primary-container">Engineering.</span>
          </h1>
          <p className="text-mn-secondary mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Eksplorasi proyek yang sudah published, terkurasi berdasarkan kategori, dan siap dilihat detail implementasinya.
          </p>
        </header>

        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mn-tertiary/40" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari project, kategori, atau stack..."
              className="w-full rounded-2xl border border-mn-primary/5 bg-white pl-12 pr-4 py-4 outline-none transition-all focus:ring-2 focus:ring-mn-primary/10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
                  category === item ? 'bg-mn-primary text-white' : 'bg-white text-mn-tertiary/60 border border-mn-primary/5'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-5 text-sm font-bold text-red-600">
            {error}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project, index) => (
              <div key={project.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                <ProjectCard project={project} onOpen={setSelectedProject} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-mn-primary/20">
            <p className="text-mn-tertiary/40 font-bold uppercase tracking-widest text-sm">
              Tidak ada project yang cocok dengan filter saat ini.
            </p>
          </div>
        )}
      </div>

      <ProjectModal key={selectedProject?.id || 'empty'} project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Star,
  ExternalLink,
} from 'lucide-react';
import {
  extractStoragePath,
  getProjectStatusLabel,
  mapProjectRow,
  normalizeProjectPayload,
  slugifyProjectTitle,
} from '../../lib/projects';

const EMPTY_FORM = {
  title: '',
  slug: '',
  category: '',
  description: '',
  tags: '',
  image_url: '',
  gallery: [],
  deliverables: '',
  project_type: 'web',
  live_url: '',
  status: 'draft',
  featured: false,
  sort_order: 0,
};

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState(EMPTY_FORM);

  const API_URL = 'http://localhost:5001/api';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setProjects((data || []).map(mapProjectRow));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setFeedback({ type: 'error', message: 'Daftar project gagal dimuat.' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter((project) => project.status === 'published').length,
    drafts: projects.filter((project) => project.status === 'draft').length,
    archived: projects.filter((project) => project.status === 'archived').length,
  }), [projects]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(EMPTY_FORM);
  };

  const setField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleTitleChange = (value) => {
    setFormData((current) => ({
      ...current,
      title: value,
      slug: editingProject ? current.slug : slugifyProjectTitle(value),
    }));
  };

  const handleFileUpload = async (event, type = 'thumbnail') => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Gagal mengunggah gambar');
      const data = await response.json();

      setFormData((current) => ({
        ...current,
        image_url: type === 'thumbnail' ? data.url : current.image_url,
        gallery: type === 'gallery' ? [...current.gallery, data.url] : current.gallery,
      }));

      setFeedback({ type: 'success', message: 'Gambar berhasil diunggah dari lokal.' });
    } catch (error) {
      setFeedback({ type: 'error', message: `Upload gagal: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((current) => ({
      ...current,
      gallery: current.gallery.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Judul project wajib diisi.';
    if (!formData.category.trim()) return 'Kategori project wajib diisi.';
    if (!formData.description.trim()) return 'Deskripsi project wajib diisi.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setFeedback({ type: 'error', message: validationMessage });
      return;
    }

    setSaving(true);
    const projectData = normalizeProjectPayload(formData, editingProject);

    try {
      const url = editingProject 
        ? `${API_URL}/projects/${editingProject.id}`
        : `${API_URL}/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Gagal menyimpan project');

      setFeedback({ 
        type: 'success', 
        message: editingProject ? 'Project berhasil diperbarui.' : 'Project berhasil dibuat.' 
      });
      closeModal();
      await fetchProjects();
    } catch (error) {
      setFeedback({ type: 'error', message: `Project gagal disimpan: ${error.message}` });
    }

    setSaving(false);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Hapus project "${project.title}"?`)) return;

    try {
      const response = await fetch(`${API_URL}/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Gagal menghapus project');

      setFeedback({ type: 'success', message: 'Project berhasil dihapus.' });
      await fetchProjects();
    } catch (error) {
      setFeedback({ type: 'error', message: `Project gagal dihapus: ${error.message}` });
    }
  };

  const openNewModal = () => {
    setEditingProject(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description,
      tags: project.tags.join(', '),
      image_url: project.image_url,
      gallery: project.gallery || [],
      deliverables: project.deliverables.join(', '),
      project_type: project.project_type,
      live_url: project.live_url,
      status: project.status,
      featured: project.featured,
      sort_order: project.sort_order,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { label: 'Total Projects', value: stats.total },
          { label: 'Published', value: stats.published },
          { label: 'Drafts', value: stats.drafts },
          { label: 'Archived', value: stats.archived },
        ].map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-mn-primary/5 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-mn-tertiary/50">{item.label}</p>
            <p className="mt-3 text-3xl font-black italic tracking-tight text-mn-primary">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-mn-primary italic tracking-tighter uppercase leading-none">
            Project <span className="text-mn-on-primary-container">Management</span>
          </h2>
          <p className="text-mn-tertiary/60 mt-2">Kelola status publish, urutan tampil, live link, gallery, dan metadata project dari satu tempat.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-mn-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      {feedback.message && (
        <div className={`mb-6 rounded-2xl px-5 py-4 text-sm font-bold ${feedback.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {feedback.message}
        </div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8 flex gap-6 hover:shadow-xl transition-all group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-mn-surface flex-shrink-0">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-mn-tertiary/20">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <div>
                    <h3 className="text-xl font-black text-mn-primary uppercase italic tracking-tight">{project.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-mn-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-mn-primary">
                        {project.category}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${
                        project.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : project.status === 'archived'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {getProjectStatusLabel(project.status)}
                      </span>
                      {project.featured && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-amber-700 flex items-center gap-1">
                          <Star size={12} /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="p-2 text-mn-tertiary/40 hover:text-mn-primary transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button onClick={() => openEditModal(project)} className="p-2 text-mn-tertiary/40 hover:text-mn-primary transition-colors"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(project)} className="p-2 text-mn-tertiary/40 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
                <p className="text-sm text-mn-secondary line-clamp-2 mr-10">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[8px] font-black bg-mn-surface text-mn-tertiary/60 px-2 py-1 rounded-lg uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-2 text-center py-20 bg-mn-surface rounded-[3rem] border border-dashed border-mn-primary/20">
              <p className="text-mn-tertiary/40 font-bold">No projects found. Add your first project.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-mn-primary/20 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-mn-primary uppercase italic tracking-tighter mb-8">
              {editingProject ? 'Edit' : 'New'} <span className="text-mn-on-primary-container">Project</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Project Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Slug</label>
                  <input
                    required
                    value={formData.slug}
                    onChange={(event) => setField('slug', slugifyProjectTitle(event.target.value))}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Category</label>
                  <input
                    required
                    value={formData.category}
                    onChange={(event) => setField('category', event.target.value)}
                    placeholder="e.g. FinTech"
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(event) => setField('status', event.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Project Type</label>
                  <select
                    value={formData.project_type}
                    onChange={(event) => setField('project_type', event.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="brand">Brand</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Live URL</label>
                  <input
                    value={formData.live_url}
                    onChange={(event) => setField('live_url', event.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(event) => setField('sort_order', Number(event.target.value))}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-mn-surface px-5 py-4">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(event) => setField('featured', event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-bold text-mn-primary">Tandai sebagai featured project</span>
              </label>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(event) => setField('description', event.target.value)}
                  rows="4"
                  className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Thumbnail Image</label>
                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <input
                        value={formData.image_url}
                        onChange={(event) => setField('image_url', event.target.value)}
                        className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                      />
                    </div>
                    <label className="flex items-center justify-center bg-mn-primary text-white px-6 rounded-2xl cursor-pointer hover:bg-mn-on-primary-container transition-all">
                      <input type="file" className="hidden" accept="image/*" onChange={(event) => handleFileUpload(event, 'thumbnail')} disabled={uploading} />
                      <ImageIcon size={20} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Project Gallery</label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {formData.gallery.map((url, index) => (
                      <div key={url} className="aspect-square rounded-2xl overflow-hidden relative group">
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-mn-primary/10 flex flex-col items-center justify-center text-mn-tertiary/20 hover:border-mn-primary/40 hover:text-mn-primary cursor-pointer transition-all">
                      <input type="file" className="hidden" multiple accept="image/*" onChange={(event) => handleFileUpload(event, 'gallery')} disabled={uploading} />
                      <Plus size={24} />
                      <span className="text-[8px] font-black uppercase mt-1">Add More</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Tags (comma separated)</label>
                  <input
                    value={formData.tags}
                    onChange={(event) => setField('tags', event.target.value)}
                    placeholder="React, Node.js, AWS"
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Deliverables (comma separated)</label>
                  <input
                    value={formData.deliverables}
                    onChange={(event) => setField('deliverables', event.target.value)}
                    placeholder="Design System, API, Deployment"
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-mn-primary/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-grow py-4 border border-mn-primary/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-mn-tertiary/40 hover:bg-red-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-grow py-4 bg-mn-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;

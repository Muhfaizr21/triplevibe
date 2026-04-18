import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Star, User } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

const EMPTY = {
  client_name: '',
  client_title: '',
  client_avatar_url: '',
  message: '',
  rating: 5,
  is_featured: false,
  sort_order: 0,
};

export default function TestimonialManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [feedback, setFeedback] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/testimonials`);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setEditing(null); setForm(EMPTY); setIsModalOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ ...t }); setIsModalOpen(true); };
  const close = () => { setIsModalOpen(false); setEditing(null); setForm(EMPTY); };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    setField('client_avatar_url', data.url);
    setUploading(false);
  };

  const save = async (e) => {
    e.preventDefault();
    const url = editing ? `${API_URL}/testimonials/${editing.id}` : `${API_URL}/testimonials`;
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setFeedback('Saved!'); close(); load(); }
    else setFeedback('Error saving');
    setTimeout(() => setFeedback(''), 3000);
  };

  const del = async (id) => {
    if (!window.confirm('Hapus testimoni ini?')) return;
    await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-mn-primary italic tracking-tighter uppercase">
            Testimonial <span className="text-mn-on-primary-container">Management</span>
          </h2>
          <p className="text-mn-tertiary/60 mt-1">Kelola ulasan dan testimoni dari klien TripleVibe.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-mn-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {feedback && (
        <div className="mb-4 rounded-2xl px-5 py-4 text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{feedback}</div>
      )}

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map(t => (
            <div key={t.id} className="bg-white border border-mn-primary/5 rounded-[2rem] p-8 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {t.client_avatar_url ? (
                    <img src={t.client_avatar_url} alt={t.client_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-mn-surface flex items-center justify-center">
                      <User size={20} className="text-mn-tertiary/40" />
                    </div>
                  )}
                  <div>
                    <p className="font-black text-mn-primary">{t.client_name}</p>
                    <p className="text-xs text-mn-tertiary/50 uppercase tracking-widest">{t.client_title}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {t.is_featured && <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Featured</span>}
                  <button onClick={() => openEdit(t)} className="p-2 text-mn-tertiary/40 hover:text-mn-primary transition-colors"><Edit3 size={16} /></button>
                  <button onClick={() => del(t.id)} className="p-2 text-mn-tertiary/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-mn-tertiary/20'} />)}
              </div>
              <p className="text-sm text-mn-secondary leading-relaxed italic">"{t.message}"</p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-2 text-center py-16 bg-mn-surface rounded-[3rem] border border-dashed border-mn-primary/20">
              <p className="text-mn-tertiary/40 font-bold">Belum ada testimoni. Tambahkan yang pertama!</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-mn-primary/20 backdrop-blur-sm" onClick={close} />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 p-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-500">
            <h3 className="text-2xl font-black text-mn-primary italic uppercase tracking-tighter mb-8">
              {editing ? 'Edit' : 'New'} <span className="text-mn-on-primary-container">Testimonial</span>
            </h3>
            <form onSubmit={save} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Client Name *</label>
                  <input required value={form.client_name} onChange={e => setField('client_name', e.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Title / Position</label>
                  <input value={form.client_title} onChange={e => setField('client_title', e.target.value)}
                    placeholder="CEO at Startup" className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Avatar Photo</label>
                <div className="flex gap-3 items-center">
                  {form.client_avatar_url && <img src={form.client_avatar_url} className="w-12 h-12 rounded-full object-cover" />}
                  <label className="flex-grow flex items-center justify-center gap-2 border-2 border-dashed border-mn-primary/10 rounded-2xl py-3 cursor-pointer hover:border-mn-primary/40 transition-all text-sm text-mn-tertiary/50 font-bold">
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                    {uploading ? 'Uploading...' : '+ Upload Avatar'}
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Message *</label>
                <textarea required value={form.message} onChange={e => setField('message', e.target.value)} rows="4"
                  className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={e => setField('rating', Number(e.target.value))}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setField('sort_order', Number(e.target.value))}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none" />
                </div>
                <label className="flex items-center gap-2 bg-mn-surface rounded-2xl px-4 py-3 cursor-pointer mt-[1.1rem]">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setField('is_featured', e.target.checked)} className="h-4 w-4" />
                  <span className="text-xs font-bold text-mn-primary">Featured</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={close} className="flex-1 py-4 border border-mn-primary/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-mn-tertiary/40 hover:bg-red-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-mn-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all">
                  {editing ? 'Save Changes' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

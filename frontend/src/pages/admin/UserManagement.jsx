import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Shield } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';
const ROLE_OPTIONS = ['superadmin', 'admin', 'editor', 'viewer'];
const ROLE_COLORS = {
  superadmin: 'bg-red-100 text-red-700',
  admin: 'bg-mn-primary/10 text-mn-primary',
  editor: 'bg-blue-100 text-blue-700',
  viewer: 'bg-slate-100 text-slate-600',
};

const EMPTY = { email: '', password: '', first_name: '', last_name: '', role: 'viewer' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/profiles`);
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setEditing(null); setForm(EMPTY); setIsModalOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u, password: '' }); setIsModalOpen(true); };
  const close = () => { setIsModalOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    const url = editing ? `${API_URL}/users/${editing.id}` : `${API_URL}/users`;
    const method = editing ? 'PUT' : 'POST';
    const body = editing
      ? { role: form.role, first_name: form.first_name, last_name: form.last_name }
      : form;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      setFeedback({ type: 'success', msg: editing ? 'User updated!' : 'User created!' });
      close(); load();
    } else {
      const err = await res.json();
      setFeedback({ type: 'error', msg: err.message || 'Error saving user' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const del = async (u) => {
    if (!window.confirm(`Hapus user "${u.email}"?`)) return;
    await fetch(`${API_URL}/users/${u.id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-mn-primary italic tracking-tighter uppercase">
            User <span className="text-mn-on-primary-container">Management</span>
          </h2>
          <p className="text-mn-tertiary/60 mt-1">Kelola akses, peran, dan akun tim TripleVibe.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-mn-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all">
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { role: 'superadmin', desc: 'Full access + settings' },
          { role: 'admin', desc: 'Manage projects & users' },
          { role: 'editor', desc: 'Add/edit projects only' },
          { role: 'viewer', desc: 'View private projects' },
        ].map(r => (
          <div key={r.role} className="flex items-center gap-2 bg-white border border-mn-primary/5 rounded-2xl px-4 py-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ROLE_COLORS[r.role]}`}>{r.role}</span>
            <span className="text-xs text-mn-tertiary/50">{r.desc}</span>
          </div>
        ))}
      </div>

      {feedback.msg && (
        <div className={`mb-4 rounded-2xl px-5 py-4 text-sm font-bold ${feedback.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {feedback.msg}
        </div>
      )}

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="bg-white border border-mn-primary/5 rounded-[2rem] p-6 flex items-center justify-between hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-mn-surface flex items-center justify-center font-black text-mn-primary text-lg">
                  {(u.first_name?.[0] || u.email[0]).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-mn-primary">{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</p>
                  <p className="text-sm text-mn-tertiary/50">{u.email}</p>
                  <p className="text-[10px] text-mn-tertiary/30 mt-0.5">Joined {new Date(u.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'}`}>
                  {u.role}
                </span>
                <button onClick={() => openEdit(u)} className="p-2 text-mn-tertiary/40 hover:text-mn-primary transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => del(u)} className="p-2 text-mn-tertiary/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-mn-primary/20 backdrop-blur-sm" onClick={close} />
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-500">
            <h3 className="text-2xl font-black text-mn-primary italic uppercase tracking-tighter mb-8">
              {editing ? 'Edit' : 'New'} <span className="text-mn-on-primary-container">User</span>
            </h3>
            <form onSubmit={save} className="space-y-5">
              {!editing && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setField('email', e.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10" />
                </div>
              )}
              {!editing && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Password *</label>
                  <input type="password" required value={form.password} onChange={e => setField('password', e.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">First Name</label>
                  <input value={form.first_name} onChange={e => setField('first_name', e.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Last Name</label>
                  <input value={form.last_name} onChange={e => setField('last_name', e.target.value)}
                    className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">Role</label>
                <select value={form.role} onChange={e => setField('role', e.target.value)}
                  className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10">
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={close} className="flex-1 py-4 border border-mn-primary/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-mn-tertiary/40 hover:bg-red-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-mn-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all">
                  {editing ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

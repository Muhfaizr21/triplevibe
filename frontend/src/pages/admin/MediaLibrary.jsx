import React, { useEffect, useState } from 'react';
import { Trash2, ExternalLink, Image as ImageIcon, FolderOpen } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/media`);
    const data = await res.json();
    setFiles(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const del = async (filename) => {
    if (!window.confirm(`Hapus file "${filename}"?`)) return;
    setDeleting(filename);
    const res = await fetch(`${API_URL}/media/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    if (res.ok) { setFeedback('File dihapus.'); setSelected(null); load(); }
    else setFeedback('Gagal menghapus file.');
    setDeleting(null);
    setTimeout(() => setFeedback(''), 3000);
  };

  const copy = (url) => {
    navigator.clipboard.writeText(url);
    setFeedback('URL disalin ke clipboard!');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-mn-primary italic tracking-tighter uppercase">
            Media <span className="text-mn-on-primary-container">Library</span>
          </h2>
          <p className="text-mn-tertiary/60 mt-1">{files.length} file tersimpan. Klik gambar untuk salin URL atau hapus.</p>
        </div>
        <div className="text-sm font-bold text-mn-tertiary/40 flex items-center gap-2">
          <FolderOpen size={18} /> backend/uploads/
        </div>
      </div>

      {feedback && (
        <div className="mb-4 rounded-2xl px-5 py-4 text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-mn-primary/10 border-t-mn-primary rounded-full animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 bg-mn-surface rounded-[3rem] border border-dashed border-mn-primary/20">
          <ImageIcon size={48} className="mx-auto text-mn-tertiary/20 mb-4" />
          <p className="text-mn-tertiary/40 font-bold">Belum ada media. Upload gambar lewat form project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map(f => (
            <div
              key={f.filename}
              onClick={() => setSelected(selected?.filename === f.filename ? null : f)}
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-mn-surface cursor-pointer transition-all border-2 ${selected?.filename === f.filename ? 'border-mn-primary shadow-xl' : 'border-transparent hover:border-mn-primary/30'}`}
            >
              <img src={f.url} alt={f.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-mn-primary/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-white text-[10px] font-black uppercase tracking-widest text-center line-clamp-2">{f.filename}</p>
                <p className="text-white/60 text-[9px]">{formatBytes(f.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex gap-6 items-start">
              <img src={selected.url} alt={selected.filename} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <p className="font-black text-mn-primary truncate">{selected.filename}</p>
                <p className="text-xs text-mn-tertiary/50 mt-1">{formatBytes(selected.size)}</p>
                <p className="text-xs text-mn-tertiary/40">{new Date(selected.created_at).toLocaleString('id-ID')}</p>
                <input
                  readOnly value={selected.url}
                  className="mt-3 w-full text-[10px] bg-mn-surface rounded-xl px-3 py-2 font-mono text-mn-primary/60 truncate cursor-pointer"
                  onClick={() => copy(selected.url)}
                  title="Klik untuk salin URL"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => copy(selected.url)} className="flex-1 py-3 bg-mn-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">
                Salin URL
              </button>
              <a href={selected.url} target="_blank" rel="noreferrer" className="p-3 bg-mn-surface text-mn-primary rounded-2xl hover:bg-mn-primary hover:text-white transition-all">
                <ExternalLink size={18} />
              </a>
              <button onClick={() => del(selected.filename)} disabled={deleting === selected.filename}
                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

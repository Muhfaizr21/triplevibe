import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const API_URL = 'http://localhost:5001/api';

export default function SiteContent() {
  const { settings, reloadSettings } = useSite();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFeedback('Pengaturan berhasil disimpan!');
        reloadSettings();
      } else {
        setFeedback('Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      setFeedback('Error system.');
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const InputField = ({ label, keyName, isTextArea = false }) => (
    <div className="space-y-1 mb-5">
      <label className="text-[10px] font-black uppercase tracking-widest text-mn-tertiary/60 ml-2">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          value={formData[keyName] || ''}
          onChange={(e) => handleChange(keyName, e.target.value)}
          rows={3}
          className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10 resize-none"
        />
      ) : (
        <input
          type="text"
          value={formData[keyName] || ''}
          onChange={(e) => handleChange(keyName, e.target.value)}
          className="w-full bg-mn-surface border border-mn-primary/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-mn-primary/10"
        />
      )}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-mn-primary italic tracking-tighter uppercase">
            Site <span className="text-mn-on-primary-container">Content</span>
          </h2>
          <p className="text-mn-tertiary/60 mt-1">Ubah teks dan konten statis website secara dinamis (CMS).</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-mn-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {feedback && (
        <div className="mb-6 rounded-2xl px-5 py-4 text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {feedback}
        </div>
      )}

      <div className="space-y-8">
        {/* HOMEPAGE */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-mn-primary uppercase italic mb-6 border-b border-mn-primary/5 pb-4">
            Homepage Content
          </h3>
          <InputField label="Hero Title" keyName="home_hero_title" />
          <InputField label="Hero Subtitle" keyName="home_hero_subtitle" isTextArea />
        </div>

        {/* EXPERTISE */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-mn-primary uppercase italic mb-6 border-b border-mn-primary/5 pb-4">
            Expertise Page Content
          </h3>
          <InputField label="Hero Title" keyName="expertise_hero_title" isTextArea />
          <InputField label="Hero Subtitle" keyName="expertise_hero_subtitle" isTextArea />
        </div>

        {/* PROCESS */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-mn-primary uppercase italic mb-6 border-b border-mn-primary/5 pb-4">
            Process Page Content
          </h3>
          <InputField label="Hero Title" keyName="process_hero_title" />
          <InputField label="Hero Subtitle" keyName="process_hero_subtitle" isTextArea />
        </div>

        {/* GLOBAL CONTACT */}
        <div className="bg-white border border-mn-primary/5 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-mn-primary uppercase italic mb-6 border-b border-mn-primary/5 pb-4">
            Global Contact & Links
          </h3>
          <div className="grid md:grid-cols-2 gap-x-6">
            <InputField label="WhatsApp Number (e.g. 62812...)" keyName="site_whatsapp" />
            <InputField label="Contact Email" keyName="site_email" />
          </div>
          <InputField label="Office Address" keyName="site_address" />
        </div>
      </div>
    </div>
  );
}

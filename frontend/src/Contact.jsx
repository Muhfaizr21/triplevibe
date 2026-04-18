import React from 'react';
import { ArrowRight, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { useSite } from './context/SiteContext';
import SEO from './components/SEO';




export default function Contact({ onPageChange }) {
  const { settings } = useSite();
  
  const contactLinks = [
    {
      label: 'WhatsApp',
      value: settings.site_whatsapp || '6281234567890',
      href: `https://wa.me/${settings.site_whatsapp || '6281234567890'}`,
      icon: MessageCircle,
    },
    {
      label: 'Email',
      value: settings.site_email || 'hello@triplevibe.com',
      href: `mailto:${settings.site_email || 'hello@triplevibe.com'}`,
      icon: Mail,
    },
    {
      label: 'Office',
      value: settings.site_address || 'Jakarta, Indonesia',
      href: '#',
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-mn-surface pt-32 pb-20 px-8">
      <SEO 
        title="Contact | TripleVibe" 
        description="Hubungi tim engineering kami untuk konsultasi project, audit bug, atau pembuatan MVP." 
      />
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="bg-white border border-mn-primary/5 rounded-[3rem] p-10 md:p-14 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-mn-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-mn-primary">
            TripleVibe Contact Desk
          </div>
          <h1 className="mt-6 text-5xl font-black uppercase italic tracking-tighter text-mn-primary leading-none">
            Mari Tutup Scope,
            <span className="block text-mn-on-primary-container">Bukan Cuma Diskusi.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mn-secondary">
            {`Kirim kebutuhan Anda ke ${settings.site_email || 'hello@triplevibe.com'} atau WhatsApp kami untuk audit bug, pembuatan MVP, atau perapihan arsitektur aplikasi.`}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {contactLinks.map(({ label, value, href, icon }) => {
              const Icon = icon;

              return (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="rounded-[2rem] border border-mn-primary/5 bg-mn-surface p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon className="text-mn-primary" size={22} />
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-mn-tertiary/50">{label}</p>
                <p className="mt-2 text-sm font-bold text-mn-primary">{value}</p>
              </a>
              );
            })}
          </div>
        </section>

        <aside className="rounded-[3rem] bg-mn-primary p-10 text-white shadow-2xl shadow-mn-primary/15">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">How We Work</p>
          <div className="mt-8 space-y-6">
            {[
              'Anda kirim konteks project, problem, dan target release.',
              'Kami breakdown prioritas teknis, risiko, dan estimasi pengerjaan.',
              'Eksekusi dimulai dengan milestone yang bisa diverifikasi.',
            ].map((item, index) => (
              <div key={item} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-black">
                  0{index + 1}
                </div>
                <p className="text-sm leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/70">Butuh lihat hasil kerja dulu?</p>
            <button
              onClick={() => onPageChange('projects')}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.25em] text-mn-primary transition-all hover:-translate-y-1"
            >
              Lihat Portfolio
              <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

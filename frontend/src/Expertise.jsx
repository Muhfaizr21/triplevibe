import React from 'react';

const Hero = () => (
  <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
    <div className="max-w-2xl">
      <span className="text-xs uppercase tracking-[0.2em] text-mn-on-surface-variant font-bold mb-4 block">Our Specialization</span>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-mn-primary leading-none">
        Arsitektur Digital<br />Tanpa Kompromi.
      </h1>
      <p className="mt-8 text-xl text-mn-on-surface-variant font-medium leading-relaxed max-w-xl">
        Kami membangun solusi perangkat lunak dengan presisi teknik sipil. Dari infrastruktur cloud hingga antarmuka mobile, setiap baris kode adalah fondasi masa depan bisnis Anda.
      </p>
    </div>
    <div className="hidden md:block w-32 h-1 bg-mn-primary mb-6"></div>
  </header>
);

const ExpertiseGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div className="md:col-span-8 bg-mn-surface-container-lowest p-10 rounded-xl shadow-sm group hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between min-h-[400px]">
      <div>
        <div className="flex justify-between items-start mb-12">
          <span className="material-symbols-outlined text-4xl text-mn-primary">terminal</span>
          <span className="text-sm font-bold tracking-widest text-mn-on-surface-variant uppercase bg-mn-surface-container px-3 py-1 rounded">Web Engineering</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-mn-primary mb-4">Pengembangan Web Skala Enterprise</h2>
        <p className="text-mn-on-surface-variant leading-relaxed max-w-lg mb-8">
          Membangun ekosistem web yang reaktif, aman, dan berkinerja tinggi menggunakan stack modern yang dioptimalkan untuk kecepatan dan skalabilitas.
        </p>
        <div className="flex flex-wrap gap-3">
          {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(tech => (
            <span key={tech} className="px-4 py-2 bg-mn-surface-container-low rounded-lg text-sm font-bold text-mn-primary">{tech}</span>
          ))}
        </div>
      </div>
    </div>

    <div className="md:col-span-4 bg-mn-primary-container p-10 rounded-xl text-white flex flex-col justify-between group overflow-hidden relative">
      <div className="relative z-10">
        <span className="material-symbols-outlined text-4xl mb-8">smartphone</span>
        <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight">Mobile Application</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Pengalaman native yang mulus di iOS dan Android dengan satu basis kode atau optimasi platform-spesifik.
        </p>
        <ul className="space-y-3 font-semibold">
          {['Flutter Framework', 'Swift UI (Native iOS)', 'Kotlin (Native Android)'].map(item => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
    </div>

    <div className="md:col-span-6 bg-mn-surface-container-low p-10 rounded-xl flex flex-col justify-between">
      <div>
        <span className="material-symbols-outlined text-4xl text-mn-primary mb-8">cloud_done</span>
        <h2 className="text-3xl font-bold tracking-tight text-mn-primary mb-4">Infrastruktur Cloud & DevOps</h2>
        <p className="text-mn-on-surface-variant leading-relaxed mb-8">
          Otomasi infrastruktur yang memastikan aplikasi Anda selalu aktif, aman, dan dapat menangani lonjakan trafik tanpa hambatan.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-mn-primary/50 rounded-lg shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Provider</p>
          <p className="font-bold text-mn-primary dark:text-white">AWS / Google Cloud</p>
        </div>
        <div className="p-4 bg-white dark:bg-mn-primary/50 rounded-lg shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Orchestration</p>
          <p className="font-bold text-mn-primary dark:text-white">Kubernetes / Docker</p>
        </div>
      </div>
    </div>

    <div className="md:col-span-6 bg-mn-surface-container-lowest border border-mn-outline-variant/15 p-10 rounded-xl flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1">
        <span className="material-symbols-outlined text-4xl text-mn-primary mb-6">database</span>
        <h2 className="text-3xl font-bold tracking-tight text-mn-primary mb-4">Manajemen Data Modern</h2>
        <p className="text-mn-on-surface-variant leading-relaxed">
          Arsitektur data yang dirancang untuk integritas, kecepatan kueri, dan skalabilitas masif menggunakan teknologi SQL dan NoSQL.
        </p>
      </div>
      <div className="flex-1 w-full aspect-square bg-slate-100 rounded-lg overflow-hidden grayscale contrast-125">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSMbU7gSuW5_V0N6ROu-WVUkv8Ns8Qx0RPINE27QgUL08hHt8ADbiAyquA_6Xajya8BqsZat_mUV-Nt2pg3jgPBx681Du1FOX0ZrhKeMwkeFDZZUXnIPHcv8QyRGk17iNUHbDT5PWY1yQyKdr3cxdaxuapjDEfHQdGL8Ffymj8-SCEDOnpg2hfqvTmZryylZYtqYH8JeCU9XwCK84N4UYvvkeAejw4hsB5v94r0p5Na0VDBiZMAaQSjABOiWUva3qJ1f0WuCvh_W0C" 
          alt="Server Architecture" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
);

const TechStack = () => (
  <section className="mt-32">
    <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-slate-400 mb-12 text-center">Teknologi Inti Kami</h3>
    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
      {[
        { icon: 'deployed_code', label: 'Kubernetes' },
        { icon: 'storage', label: 'PostgreSQL' },
        { icon: 'bolt', label: 'Next.js' },
        { icon: 'security', label: 'OAuth 2.0' },
        { icon: 'api', label: 'GraphQL' }
      ].map(tech => (
        <div key={tech.label} className="flex items-center gap-2 font-bold text-xl dark:text-white">
          <span className="material-symbols-outlined">{tech.icon}</span> {tech.label}
        </div>
      ))}
    </div>
  </section>
);

const CTA = () => (
  <section className="mt-40 bg-mn-primary rounded-2xl p-12 md:p-20 relative overflow-hidden">
    <div className="relative z-10 max-w-2xl">
      <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight mb-8">Siap Membangun Monolit Digital Anda?</h2>
      <p className="text-xl text-slate-400 mb-10 leading-relaxed">Konsultasikan kebutuhan teknis Anda dengan tim engineering kami untuk strategi implementasi yang tepat sasaran.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-8 py-4 bg-white text-mn-primary font-bold rounded-lg hover:bg-slate-100 transition-colors">Mulai Proyek</button>
        <button className="px-8 py-4 border border-white/20 text-white font-bold rounded-lg hover:bg-mn-primary/10 transition-colors">Lihat Studi Kasus</button>
      </div>
    </div>
    <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 flex flex-col justify-around text-[120px] lg:text-[200px] font-black pointer-events-none select-none text-white">
      <div className="translate-x-1/2">DEV</div>
      <div className="translate-x-1/4">MONO</div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full pt-20 pb-10 px-8 bg-blue-950 dark:bg-black text-white mt-24">
    <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
      <div className="text-lg font-bold text-white uppercase tracking-tighter">DevMonolith</div>
      <div className="flex flex-wrap justify-center gap-8 text-sm font-manrope tracking-wide">
        {['Privacy Policy', 'Terms of Service', 'Github', 'LinkedIn'].map(link => (
          <a key={link} className="text-slate-400 hover:text-white transition-colors" href="#">{link}</a>
        ))}
      </div>
      <p className="text-slate-400 text-sm font-manrope tracking-wide">© 2024 DevMonolith Architectural Engineering. All rights reserved.</p>
    </div>
  </footer>
);

export default function Expertise() {
  return (
    <div className="bg-mn-surface text-mn-on-background antialiased selection:bg-mn-primary-container selection:text-white font-manrope">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <Hero />
        <ExpertiseGrid />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';

const Hero = ({ onPageChange }) => (
  <header className="relative min-h-screen flex items-center pt-24 overflow-hidden">
    <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 z-10">
        <div className="inline-flex items-center gap-2 bg-mn-surface-container-high px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-mn-primary animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-mn-primary">High-End Engineering Solution</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-mn-primary leading-[1.1] mb-8">
          Solusi Software <br /> <span className="text-mn-on-primary-container">Engineering</span> Profesional.
        </h1>
        <p className="text-lg text-mn-secondary max-w-xl leading-relaxed mb-10">
          Kami menghadirkan keahlian teknis tingkat tinggi untuk membangun sistem yang skalabel, aman, dan efisien. Dari arsitektur hingga implementasi kode.
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => onPageChange('contact')} className="bg-mn-primary-container text-white px-10 py-4 rounded-xl font-bold shadow-2xl hover:bg-mn-primary transition-all">Mulai Konsultasi</button>
          <button onClick={() => onPageChange('projects')} className="bg-white border border-mn-outline-variant/30 text-mn-primary px-10 py-4 rounded-xl font-bold hover:bg-mn-surface-container-low transition-all">Lihat Portofolio</button>
        </div>
      </div>
      <div className="lg:col-span-5 relative">
        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,31,63,0.1)]">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-XSrQEScEwXPQzNHed9xCo8e-1SrLmIlJxzUet8h3IbFcCFz_0crM8KWBlEThrhHtY9CJz1B4XbRBi6k9hlPt2ibscfTPhhU33Iv7kVkmOU45FU_SXPW3av7glVMq2Z_p9E2AU4FoLXqro2__2nidZ93vpiheR4_NIZ18DRL-1YLKVUEWzrJIf8BamEI9UJGmhYK_IOFwKJbTT9BZ8ZJeJ7Zr4A-82-p2Hz3uvStq6QkE4ljXZPCYMbxnMP8QtsNG1XI9l0D9H0aO" 
            alt="Modern minimalist workspace"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-mn-primary/40 to-transparent"></div>
        </div>
        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-[200px]">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="material-symbols-outlined text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            ))}
          </div>
          <p className="text-xs font-bold text-mn-primary dark:text-white">Trusted by 500+ Engineers & Students</p>
        </div>
      </div>
    </div>
  </header>
);

const Services = ({ onPageChange }) => (
  <section className="py-32 bg-mn-surface-container-low">
    <div className="max-w-7xl mx-auto px-8">
      <div className="mb-20 text-center lg:text-left">
        <h2 className="text-4xl font-black text-mn-primary tracking-tight mb-4">Layanan Eksklusif Kami</h2>
        <p className="text-mn-secondary max-w-lg">Pendekatan modular untuk setiap tantangan rekayasa perangkat lunak.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onPageChange('expertise')}
          className="md:col-span-2 bg-white dark:bg-mn-primary/50 rounded-3xl p-10 flex flex-col justify-between group hover:shadow-2xl transition-all border border-white/10 cursor-pointer"
        >
          <div>
            <div className="w-14 h-14 bg-mn-surface-container rounded-2xl flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-mn-primary text-3xl">terminal</span>
            </div>
            <h3 className="text-2xl font-bold text-mn-primary dark:text-white mb-4">Pengembangan Web & Mobile</h3>
            <p className="text-mn-secondary leading-relaxed max-w-md">Membangun aplikasi performa tinggi dengan React, Flutter, dan arsitektur Cloud-Native yang modern.</p>
          </div>
          <div className="mt-12 flex items-center gap-4 text-mn-primary dark:text-white">
            <span className="text-sm font-bold uppercase tracking-widest">Detail Layanan</span>
            <div className="h-[1px] flex-grow bg-mn-outline-variant/30"></div>
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </div>
        </div>
        <div className="bg-mn-primary-container rounded-3xl p-10 flex flex-col text-white shadow-2xl">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-white text-3xl">bug_report</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">Penyelesaian Bug</h3>
          <p className="text-slate-300 leading-relaxed text-sm">Audit kode mendalam dan perbaikan bug kritikal secara efisien tanpa merusak struktur sistem yang ada.</p>
        </div>
        <div 
          onClick={() => onPageChange('expertise')}
          className="bg-white dark:bg-mn-primary/50 rounded-3xl p-10 flex flex-col border border-white/10 group hover:shadow-2xl transition-all cursor-pointer"
        >
          <div className="w-14 h-14 bg-mn-surface-container rounded-2xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-mn-primary text-3xl">psychology</span>
          </div>
          <h3 className="text-2xl font-bold text-mn-primary dark:text-white mb-4">Konsultasi Project</h3>
          <p className="text-mn-secondary leading-relaxed text-sm">Bimbingan teknis untuk skripsi, project akhir, atau MVP startup dengan standar industri global.</p>
        </div>
        <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
          <img 
            className="absolute inset-0 w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtBMHErCa5H8ivMrFcvhuirZhv77EgcnNIfGk9sMLD9Tt8UfAd0CaGUM5gIKytYMD7iulpV6M4SW8EnekD2jUujj2OIYRHbzp-gEYHRo09di6HoUkeGz_KXy_6wX9NQnKP6S1BM8FqZu_84f9BokRBDQCtymZnedDoo50-XK7wJ5dvnzsBa9oAE-AXLQxl-D7xUpEWsuUWE4PAq01L75oRbWbxK0FZpOMLFiuPB-ppRfjL6TcdxDldneaupSiCfomcjHF9MIRQr1yM" 
            alt="Software Engineering Pro"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-mn-primary via-mn-primary/80 to-transparent p-10 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-white mb-4">TripleVibe Pro</h3>
            <p className="text-slate-200 max-w-xs mb-8">Tingkatkan skala bisnis Anda bersama tim engineer ahli kami. Inovasi tiada henti dengan hasil presisi tinggi.</p>
            <button onClick={() => onPageChange('contact')} className="bg-white text-mn-primary w-fit px-8 py-3 rounded-full font-bold text-sm">Join The Vibe</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CaseStudy = () => (
  <section className="py-32 bg-white dark:bg-mn-primary overflow-hidden">
    <div className="max-w-7xl mx-auto px-8">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-mn-primary dark:text-white/60 mb-6 block">Featured Case Study</span>
          <h2 className="text-4xl lg:text-5xl font-black text-mn-primary dark:text-white tracking-tight leading-tight mb-8">FinTech Mobile App: Keamanan & Skalabilitas.</h2>
          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-mn-surface dark:bg-white/5 rounded-2xl border-l-4 border-mn-primary">
              <span className="material-symbols-outlined text-mn-primary dark:text-white">lock</span>
              <div>
                <h4 className="font-bold text-mn-primary dark:text-white">Data Integrity</h4>
                <p className="text-sm text-mn-secondary dark:text-slate-400">Implementasi enkripsi end-to-end untuk transaksi finansial yang aman.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-mn-surface dark:bg-white/5 rounded-2xl">
              <span className="material-symbols-outlined text-mn-primary dark:text-white">speed</span>
              <div>
                <h4 className="font-bold text-mn-primary dark:text-white">Microservices Architecture</h4>
                <p className="text-sm text-mn-secondary dark:text-slate-400">Optimasi load balancer untuk menangani jutaan request per detik.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,31,63,0.15)]">
            <img 
              className="w-full aspect-[4/5] object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMCMAcZAFDKoKM8Gjd9Vr1vCWqdv4kdVIlKFoW-oFOA2IH6EMe8h-datVxQA2vjATOYkX8Tt9GYoIBpCmVaCx9DLoNuWcS-ENGO3BZMlBpHlUGLneIJfacd0NeBLvL8ZapSQFRUBYxvXQS9g82tGQdljkGDxS4ZeRK1OjWrWS8_HWKSKhXGZy8g6ZjDRRrM0f4VHgYJPwHHbYYfffp_HzVqIJaaVI6SNWGDe5mGeOFcMZfHuVizuOlkLYhkc5YA4SmiO_sobTi9jxh" 
              alt="Fintech App"
            />
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-mn-primary-container rounded-full blur-[100px] opacity-10"></div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonial = () => (
  <section className="py-32 bg-mn-surface dark:bg-slate-900/50">
    <div className="max-w-4xl mx-auto px-8 text-center">
      <span className="material-symbols-outlined text-6xl text-mn-outline-variant/40 mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
      <blockquote className="text-3xl md:text-4xl font-light italic text-mn-primary dark:text-white leading-tight mb-12">
        "Kerja sama dengan TripleVibe benar-benar luar biasa. Arsitektur sistem e-commerce kami menjadi jauh lebih modern, cepat, dan stabil. Mereka benar-benar membawa 'vibe' baru ke dalam tim teknis kami!"
      </blockquote>
      <div className="flex items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZONHzWJvND7Q35kx1YB5TIXLWFgEGap7rJMD-t7K_o1VbCatetlOKz2LSpU-M86i7a2FBfbW6NU9IyWuQaaB1yMLwFbVtUWDlsNGz-WaTp1K0FYelex2aJn3wpsRm5-0l7Tnc_fqoKPA3TpcqFTlhTXu8-7ySudfHQYqzDGa9qb2BI-G8dkjADlX4Qw_uvhI7hDy9LYsnNEqG_J8laq7q9UIK6QaR1Q2SopNsx47KPDEg6EjKMSi_OlyW-u63IMA7oxeCCZnb-GOX" 
            alt="Raka Ardiansyah"
          />
        </div>
        <div className="text-left">
          <div className="font-bold text-mn-primary dark:text-white">Raka Ardiansyah</div>
          <div className="text-xs text-mn-secondary uppercase tracking-widest">IT Student, Jakarta</div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = ({ onPageChange }) => (
  <section className="py-24 bg-white dark:bg-mn-primary">
    <div className="max-w-7xl mx-auto px-8">
      <div className="bg-mn-primary-container rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
        </div>
        <div className="relative z-10 text-white">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-8">Siap Memulai Proyek Anda?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg">Konsultasikan kebutuhan teknis Anda secara gratis hari ini. Kami siap menghadirkan solusi monolith yang kokoh.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={() => onPageChange('contact')} className="bg-white text-mn-primary px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all">Hubungi via WhatsApp</button>
            <button onClick={() => onPageChange('projects')} className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-12 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">Pelajari Harga</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ onPageChange }) => (
  <footer className="bg-slate-50 dark:bg-slate-900/50 w-full py-20 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div className="max-w-xs">
          <div className="text-3xl font-black italic tracking-tighter text-[#001F3F] dark:text-white mb-6 uppercase">
            Triple<span className="text-mn-on-surface-variant">Vibe</span>
          </div>
          <p className="font-manrope text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Partner strategis pengembangan aplikasi dagang dan solusi digital untuk membawa bisnis Anda ke level berikutnya.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="font-bold text-mn-primary dark:text-white uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onPageChange('home')} className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Services</button></li>
              <li><button onClick={() => onPageChange('expertise')} className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Expertise</button></li>
              <li><button onClick={() => onPageChange('projects')} className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Projects</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-mn-primary dark:text-white uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-2">
              <li><button className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Privacy Policy</button></li>
              <li><button className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Terms of Service</button></li>
              <li><button className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-mn-primary dark:text-white uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onPageChange('contact')} className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Contact Us</button></li>
              <li><button onClick={() => onPageChange('contact')} className="text-sm text-slate-500 hover:text-mn-primary transition-colors">Email</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-mn-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-manrope text-sm text-slate-500 dark:text-slate-400">© 2024 TripleVibe Studios. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-mn-primary transition-colors">language</span>
          <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-mn-primary transition-colors">share</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home({ onPageChange }) {
  return (
    <div className="bg-mn-surface text-mn-on-surface selection:bg-mn-primary-container selection:text-white font-manrope">
      <Hero onPageChange={onPageChange} />
      <Services onPageChange={onPageChange} />
      <CaseStudy />
      <Testimonial />
      <CTA onPageChange={onPageChange} />
      <Footer onPageChange={onPageChange} />
    </div>
  );
}

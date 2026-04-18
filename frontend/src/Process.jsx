import React from 'react';

const Hero = () => (
  <section className="max-w-7xl mx-auto px-8 mb-32 flex flex-col md:flex-row gap-16 items-end pt-32">
    <div className="md:w-3/5">
      <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-mn-on-primary-container mb-4 block">Metodologi Kami</span>
      <h1 className="text-[3.5rem] font-black leading-[1.1] tracking-tighter text-mn-primary mb-8">Arsitektur Alur Kerja yang Presisi.</h1>
      <p className="text-lg text-mn-on-surface-variant leading-relaxed max-w-xl">
        Kami tidak sekadar membangun kode; kami merancang ekosistem digital. Setiap langkah dalam proses kami diatur dengan ketelitian teknis untuk memastikan hasil akhir yang monumental dan tahan lama.
      </p>
    </div>
    <div className="md:w-2/5 aspect-[4/3] bg-mn-surface-container-high rounded-xl overflow-hidden relative group">
      <img 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPIETNrlC5b3aQrQTxcxHwpWKQnI4X-mLd79TGoc0IIynPB1qV6qHRqHSrEDo_3EXLAh-rte5vg1XBcrSy4kKhia73PAw3MsXXBkWp46Ztc1t77DdqcCgn1qQ7DW0DhYbg51Aj4yWmtvEnMK-hPwC2Xv2h2bPF2spBtEPaeijv-frg0VUclQr68nQhcZUGkvxzb9nz-PGjYDmhrPajqgXK7dk0qXAJzPjaXdM2_VaWu3Ne8d0xyrFdiR-K9ffSzKaZLfjtimHqMGNy" 
        alt="Architectural conceptualization" 
        className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-mn-primary/20 mix-blend-multiply"></div>
    </div>
  </section>
);

const ProcessStep = ({ number, icon, title, category, description, items, alignRight, borderSide }) => (
  <div className={`relative flex flex-col items-center gap-12 group ${alignRight ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
    <div className={`md:w-1/2 hidden md:block ${alignRight ? 'text-left' : 'text-right'}`}>
      <span className="text-7xl font-black text-mn-surface-container-high group-hover:text-mn-primary-container/10 transition-colors duration-500">{number}</span>
    </div>
    <div className="z-10 w-16 h-16 rounded-full bg-mn-primary-container flex items-center justify-center text-white shadow-xl shadow-mn-primary/20">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="md:w-1/2">
      <div className={`bg-mn-surface-container-lowest p-10 rounded-xl shadow-[0_30px_60px_rgb(0,6,19,0.05)] border-${borderSide}-4 border-mn-primary-container ${alignRight ? 'text-right' : ''}`}>
        <span className="text-[0.7rem] font-bold tracking-widest text-mn-on-primary-container uppercase mb-2 block">{category}</span>
        <h3 className="text-2xl font-bold text-mn-primary mb-4">{title}</h3>
        <p className="text-mn-on-surface-variant leading-relaxed mb-6">{description}</p>
        <ul className={`space-y-2 flex flex-col ${alignRight ? 'items-end' : ''}`}>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm font-medium text-mn-primary">
              {!alignRight && <span className="w-1.5 h-1.5 rounded-full bg-mn-primary"></span>}
              {item}
              {alignRight && <span className="w-1.5 h-1.5 rounded-full bg-mn-primary"></span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const ProcessDiagram = () => (
  <section className="max-w-7xl mx-auto px-8 relative pb-32">
    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-mn-outline-variant/30 -translate-x-1/2 hidden md:block"></div>
    <div className="space-y-32">
      <ProcessStep 
        number="01" icon="chat_bubble" category="Inisiasi" title="Konsultasi & Penemuan" 
        description="Memahami visi bisnis Anda adalah prioritas pertama. Kami melakukan deep-dive teknis untuk mengidentifikasi tantangan inti."
        items={['Stakeholder Interviews', 'Audit Teknis Awal']} borderSide="l"
      />
      <ProcessStep 
        number="02" icon="architecture" category="Strategi" title="Perencanaan & Blueprint" 
        description="Kami merancang cetak biru arsitektural yang mencakup stack teknologi, struktur database, dan User Experience yang intuitif."
        items={['Product Roadmap', 'System Architecture Design']} alignRight borderSide="r"
      />
      <ProcessStep 
        number="03" icon="terminal" category="Eksekusi" title="Pengembangan Agile" 
        description="Menggunakan metodologi Agile, tim engineer kami membangun solusi Anda dalam sprint yang terukur dan transparan."
        items={['Sprint: Bimonthly Updates', 'CI/CD: Modern Pipeline']} borderSide="l"
      />
      <ProcessStep 
        number="04" icon="verified" category="Validasi" title="Testing & QA Ketat" 
        description="Setiap modul melewati pengujian otomatis dan manual yang ketat. Kami memastikan skalabilitas dan keamanan optimal."
        items={['Penetration Testing', 'User Acceptance Testing (UAT)']} alignRight borderSide="r"
      />
      <ProcessStep 
        number="05" icon="auto_awesome" category="Finalisasi" title="Penyerahan & Support" 
        description="Proses tidak berakhir saat peluncuran. Kami menyerahkan dokumentasi lengkap dan menyediakan dukungan pasca-rilis."
        items={['Dokumentasi Lengkap', 'Paket Pemeliharaan']} borderSide="l"
      />
    </div>
  </section>
);

const InfrastructureGrid = () => (
  <section className="max-w-7xl mx-auto px-8 mt-48">
    <div className="mb-12">
      <h2 className="text-4xl font-black tracking-tight text-mn-primary">Infrastruktur Teknologi</h2>
      <p className="text-mn-on-surface-variant mt-2">Dukungan alat kelas dunia untuk hasil kelas dunia.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[auto] md:h-[600px]">
      <div className="md:col-span-2 md:row-span-2 bg-mn-primary text-white p-12 rounded-xl flex flex-col justify-between overflow-hidden relative min-h-[300px]">
        <div className="z-10">
          <h4 className="text-3xl font-bold mb-4">Scalable Cloud Architecture</h4>
          <p className="opacity-70 leading-relaxed">Membangun di atas AWS dan Azure untuk reliabilitas 99.99%.</p>
        </div>
        <div className="absolute bottom-[-10%] right-[-10%] opacity-10">
          <span className="material-symbols-outlined text-[10rem] md:text-[20rem]">cloud</span>
        </div>
      </div>
      <div className="bg-mn-surface-container-low p-8 rounded-xl flex flex-col justify-center items-center gap-4 text-center">
        <span className="material-symbols-outlined text-4xl text-mn-primary">shield</span>
        <span className="font-bold text-mn-primary">Cyber Security First</span>
      </div>
      <div className="bg-mn-surface-container-low p-8 rounded-xl flex flex-col justify-center items-center gap-4 text-center">
        <span className="material-symbols-outlined text-4xl text-mn-primary">speed</span>
        <span className="font-bold text-mn-primary">High Performance</span>
      </div>
      <div className="md:col-span-2 bg-mn-surface-container-highest p-8 rounded-xl flex items-center justify-between group">
        <div>
          <h4 className="text-xl font-bold text-mn-primary">Analisis Data Real-time</h4>
          <p className="text-sm text-mn-on-surface-variant">Monitoring setiap detik operasional.</p>
        </div>
        <span className="material-symbols-outlined text-5xl opacity-20 group-hover:opacity-100 transition-opacity">monitoring</span>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="max-w-5xl mx-auto px-8 mt-48 text-center bg-mn-surface-container-low py-20 rounded-3xl border border-mn-outline-variant/10">
    <h2 className="text-4xl font-black tracking-tight text-mn-primary mb-6">Siap Memulai Transformasi?</h2>
    <p className="text-lg text-mn-on-surface-variant mb-10 max-w-2xl mx-auto">
      Diskusikan proyek Anda dengan tim engineering kami hari ini dan lihat bagaimana proses terstruktur kami membawa ide Anda menjadi kenyataan.
    </p>
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <button className="bg-mn-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:shadow-2xl hover:shadow-mn-primary/30 active:scale-95">Jadwalkan Konsultasi Gratis</button>
      <button className="bg-white text-mn-primary border border-mn-primary/10 px-10 py-4 rounded-full font-bold transition-all hover:bg-slate-50 active:scale-95">Pelajari Expertise Kami</button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full pt-20 pb-10 px-8 bg-blue-950 text-white mt-48">
    <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
      <div className="text-lg font-bold text-white uppercase tracking-widest">DevMonolith</div>
      <div className="flex gap-8">
        {['Privacy Policy', 'Terms of Service', 'Github', 'LinkedIn'].map(link => (
          <a key={link} className="text-slate-400 hover:text-white transition-colors text-sm tracking-wide" href="#">{link}</a>
        ))}
      </div>
      <p className="text-slate-400 text-sm font-manrope tracking-wide">© 2024 DevMonolith Architectural Engineering. All rights reserved.</p>
    </div>
  </footer>
);

export default function Process() {
  return (
    <div className="bg-mn-surface text-mn-on-background font-manrope">
      <main className="pb-24">
        <Hero />
        <ProcessDiagram />
        <InfrastructureGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

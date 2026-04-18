import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const trackAndOpenWA = async (source = 'navbar', waNumber = '6281234567890') => {
  try {
    await fetch('http://localhost:5001/api/wa/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
    });
  } catch (_) {}
  window.open(`https://wa.me/${waNumber}?text=Halo%20TripleVibe%2C%20saya%20ingin%20konsultasi%20project!`, '_blank');
};

const Navbar = ({ currentPage, onPageChange }) => {
  const { user, isAdmin, signOut } = useAuth();
  const { isDark, toggle } = useTheme();
  const { settings } = useSite();
  const waNumber = settings.site_whatsapp || '6281234567890';

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Expertise', id: 'expertise' },
    { name: 'Projects', id: 'projects' },
    { name: 'Process', id: 'process' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    onPageChange('home');
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl rounded-full px-8 py-4 z-50 bg-mn-surface/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex justify-between items-center transition-all border border-white/10">
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onPageChange('home')}
      >
        <img src="/triple.jpg" alt="TripleVibe Logo" className="h-[2.5em] w-auto rounded-[0.8em] shadow-md shadow-black/10 border border-white/20 object-cover" />
        <span className="text-[1.3rem] font-black tracking-tighter text-mn-primary uppercase italic hidden sm:block leading-none mt-1">
          Triple<span className="text-mn-on-surface-variant">Vibe</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onPageChange(link.id)}
            className={`font-manrope text-xs font-bold uppercase tracking-widest transition-all duration-300 relative py-1 ${
              currentPage === link.id
                ? 'text-mn-primary'
                : 'text-mn-tertiary hover:text-white'
            }`}
          >
            {link.name}
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => onPageChange('superadmin')}
            className={`font-manrope text-xs font-bold uppercase tracking-widest transition-all duration-300 py-1 ${
              currentPage === 'superadmin' ? 'text-mn-primary' : 'text-mn-tertiary hover:text-white'
            }`}
          >
            Dashboard
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="p-2 text-mn-tertiary hover:text-mn-primary transition-all rounded-xl hover:bg-white/5"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-white/60 text-xs font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <User size={14} className="text-mn-primary" />
              {user.email.split('@')[0]}
            </div>
            <button 
              onClick={handleSignOut}
              className="text-mn-tertiary hover:text-red-400 transition-all p-2"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => onPageChange('login')}
              className="hidden lg:block text-mn-tertiary hover:text-white transition-all font-black text-xs uppercase tracking-widest"
            >
              Log In
            </button>
            <button
              onClick={() => trackAndOpenWA('navbar-contact-btn', waNumber)}
              className="bg-mn-primary text-white px-7 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-mn-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Contact
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

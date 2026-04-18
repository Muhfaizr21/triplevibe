import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  HelpCircle,
  LogOut,
  MessageSquareQuote,
  ImageIcon,
  Menu,
  X,
  LayoutTemplate
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const NavItem = ({ icon, label, active, onClick }) => {
  const Icon = icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-mn-primary text-white shadow-lg shadow-mn-primary/20' 
          : 'text-mn-tertiary/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
      <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
};

const Sidebar = ({ activeTab, onTabChange }) => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'site-content', label: 'Site Content', icon: LayoutTemplate },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (id) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 right-6 z-[60] bg-mn-primary text-white p-3 rounded-2xl shadow-xl shadow-mn-primary/20"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-mn-primary/20 backdrop-blur-sm z-[70] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`w-72 h-screen flex flex-col bg-mn-surface border-r border-mn-primary/5 p-6 fixed left-0 top-0 z-[80] transition-transform duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 px-4">
          <div className="flex items-center gap-3">
            <img src="/triple.jpg" alt="TripleVibe" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <h2 className="text-xl font-black italic tracking-tighter text-mn-primary uppercase leading-none">
                Triple<span className="text-mn-on-primary-container">Vibe</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-mn-tertiary/40 mt-1">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-mn-tertiary hover:text-mn-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item) => (
            <NavItem 
              key={item.id}
              {...item}
              active={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-mn-primary/5 space-y-2">
          <NavItem icon={HelpCircle} label="Support" active={false} />
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

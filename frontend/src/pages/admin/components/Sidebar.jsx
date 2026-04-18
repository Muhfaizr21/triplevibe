import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  HelpCircle,
  LogOut 
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

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 h-screen flex flex-col bg-mn-surface border-r border-mn-primary/5 p-6 fixed left-0 top-0">
      <div className="mb-10 px-4">
        <h2 className="text-2xl font-black italic tracking-tighter text-mn-primary uppercase">
          Triple<span className="text-mn-on-primary-container">Vibe</span>
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-mn-tertiary/40 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <NavItem 
            key={item.id}
            {...item}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
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
  );
};

export default Sidebar;

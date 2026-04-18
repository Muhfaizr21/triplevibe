import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, icon, trend, trendValue, color }) => {
  const Icon = icon;

  return (
    <div className="bg-white border border-mn-primary/5 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-mn-primary/5 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-black ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-mn-tertiary/40 text-[10px] font-black uppercase tracking-widest leading-none">{label}</p>
        <h3 className="text-3xl font-black text-mn-primary mt-1 italic tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;

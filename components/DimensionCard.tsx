import React from 'react';
import { BiasDimension } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DimensionCardProps {
  dimension: BiasDimension;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ dimension }) => {
  const color = CATEGORY_COLORS[dimension.slug] || '#cbd5e1';
  
  // Determine text color based on score severity (keep readable on dark)
  // Low score = good (green/neutral), High = warning
  let scoreColorClass = 'text-emerald-400';
  if (dimension.score >= 30) scoreColorClass = 'text-yellow-400';
  if (dimension.score >= 60) scoreColorClass = 'text-red-400';

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-slate-300 text-sm uppercase tracking-wide">{dimension.name}</h4>
        <span className={`font-bold text-lg ${scoreColorClass}`}>{dimension.score}/100</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
        <div 
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${dimension.score}%`, backgroundColor: color }}
        />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {dimension.description}
      </p>
    </div>
  );
};

export default DimensionCard;

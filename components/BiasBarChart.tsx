import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BiasDimension } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface BiasBarChartProps {
  dimensions: BiasDimension[];
}

const BiasBarChart: React.FC<BiasBarChartProps> = ({ dimensions }) => {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dimensions} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="slug" 
            type="category" 
            width={80} 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickFormatter={(val) => val.split('_')[0]}
          />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
            {dimensions.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.slug] || '#fff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiasBarChart;
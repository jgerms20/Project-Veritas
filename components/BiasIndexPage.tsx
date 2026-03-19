
import React, { useState } from 'react';
import { ArrowLeft, Search, Loader2, Globe, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { SAMPLE_INDEX_DATA } from '../constants';
import { searchEntityForIndex } from '../services/geminiService';
import { BiasIndexEntry } from '../types';

interface BiasIndexPageProps {
  onBack: () => void;
}

const BiasIndexPage: React.FC<BiasIndexPageProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState(SAMPLE_INDEX_DATA);
  const [sortField, setSortField] = useState<keyof BiasIndexEntry>('avgScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    // Check if already exists
    const existing = data.find(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (existing) return; // Or scroll to it

    setIsSearching(true);
    try {
      const newEntry = await searchEntityForIndex(searchTerm);
      setData(prev => [newEntry, ...prev]);
      setSearchTerm('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSort = (field: keyof BiasIndexEntry) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 min-h-screen">
       <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Command
      </button>

      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-serif font-black text-slate-100 mb-6 tracking-tight">Bias Index.</h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Live aggregated linguistic patterns.
            <span className="text-indigo-400 ml-2">Infinite Search Enabled.</span>
          </p>
        </div>

        {/* Infinite Search Bar */}
        <div className="w-full md:w-96 relative">
          <input 
            type="text" 
            placeholder="Analyze any outlet (e.g. 'Vox')" 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-slate-200 focus:border-indigo-500 outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isSearching}
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
          {isSearching && <Loader2 className="absolute right-3 top-3.5 w-5 h-5 text-indigo-500 animate-spin" />}
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 max-h-[70vh] flex flex-col">
        <div className="overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/90 backdrop-blur sticky top-0 z-10 text-slate-200 uppercase tracking-wider font-bold text-xs border-b border-white/5">
              <tr>
                <th 
                  className="px-8 py-5 cursor-pointer hover:text-indigo-400 transition-colors select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">Entity {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                </th>
                <th className="px-8 py-5">Type</th>
                <th 
                  className="px-8 py-5 text-center cursor-pointer hover:text-indigo-400 transition-colors select-none"
                  onClick={() => handleSort('avgScore')}
                >
                  <div className="flex items-center justify-center gap-2">Bias Score {sortField === 'avgScore' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                </th>
                <th className="px-8 py-5">Classification</th>
                <th className="px-8 py-5 text-right">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {sortedData.map((entry) => {
                let scoreColor = 'text-sky-400';
                if (entry.avgScore >= 25) scoreColor = 'text-emerald-400';
                if (entry.avgScore >= 50) scoreColor = 'text-amber-400';
                if (entry.avgScore >= 80) scoreColor = 'text-rose-500';

                return (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <div className="font-bold font-sans text-slate-200 text-base">{entry.name}</div>
                      {entry.description && <div className="text-xs text-slate-500 mt-1 font-sans opacity-0 group-hover:opacity-100 transition-opacity">{entry.description}</div>}
                    </td>
                    <td className="px-8 py-5">{entry.type}</td>
                    <td className={`px-8 py-5 text-center font-bold text-lg ${scoreColor}`}>
                      {entry.avgScore.toFixed(1)}%
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs">
                        {entry.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       {entry.url ? (
                         <a 
                           href={entry.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                           title="Visit Homepage"
                         >
                            <ExternalLink className="w-4 h-4" />
                         </a>
                       ) : (
                         <span className="opacity-20">-</span>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4 text-xs text-slate-500 justify-end items-center">
        <Globe className="w-3 h-3" />
        <span>Data augmented by Google Search Grounding</span>
      </div>
    </div>
  );
};

export default BiasIndexPage;

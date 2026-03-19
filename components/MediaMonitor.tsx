
import React, { useEffect, useState } from 'react';
import { fetchMediaNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { Radio, ExternalLink, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const MediaMonitor: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const items = await fetchMediaNews();
      setNews(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 300000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'negative') return 'text-rose-400';
    if (sentiment === 'positive') return 'text-emerald-400';
    return 'text-sky-300';
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'negative') return <AlertTriangle className="w-3 h-3" />;
    if (sentiment === 'positive') return <CheckCircle className="w-3 h-3" />;
    return <Info className="w-3 h-3" />;
  };

  return (
    <div className="fixed bottom-0 w-full z-40 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center h-10 overflow-hidden relative">
        {/* Label */}
        <div className="bg-slate-900 px-4 h-full flex items-center gap-2 border-r border-slate-800 z-10 shrink-0">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">Live Wire</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-grow overflow-hidden relative h-full flex items-center group">
          {loading && news.length === 0 ? (
             <span className="text-xs text-slate-500 mono px-4">Connecting to global media monitoring nodes...</span>
          ) : (
            <div className="animate-ticker flex whitespace-nowrap gap-12 px-4 group-hover:pause-animation">
               {news.map((item, i) => (
                 <a 
                   key={i} 
                   href={item.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`flex items-center gap-2 text-xs transition-colors hover:bg-white/5 py-1 px-2 rounded ${getSentimentColor(item.sentiment)} cursor-pointer z-50`}
                 >
                   {getSentimentIcon(item.sentiment)}
                   <span className="font-bold text-slate-200">{item.source}:</span>
                   <span className="opacity-90">{item.title}</span>
                   <ExternalLink className="w-3 h-3 opacity-50 ml-1" />
                 </a>
               ))}
               {/* Duplicate for infinite loop illusion */}
               {news.map((item, i) => (
                 <a 
                   key={`dup-${i}`} 
                   href={item.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`flex items-center gap-2 text-xs transition-colors hover:bg-white/5 py-1 px-2 rounded ${getSentimentColor(item.sentiment)} cursor-pointer z-50`}
                 >
                   {getSentimentIcon(item.sentiment)}
                   <span className="font-bold text-slate-200">{item.source}:</span>
                   <span className="opacity-90">{item.title}</span>
                   <ExternalLink className="w-3 h-3 opacity-50 ml-1" />
                 </a>
               ))}
            </div>
          )}
        </div>

        {/* Legend/Controls */}
        <div className="hidden md:flex bg-slate-900 px-4 h-full items-center gap-4 border-l border-slate-800 z-10 shrink-0 text-[10px] text-slate-500 font-mono">
           <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Alert</div>
           <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-sky-300" /> General News</div>
           <button onClick={loadNews}><RefreshCw className={`w-3 h-3 hover:text-white ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 80s linear infinite;
        }
        .group:hover .animate-ticker {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MediaMonitor;

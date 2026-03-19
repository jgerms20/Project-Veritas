
import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Activity, ArrowRight, Loader2, Globe, RefreshCw } from 'lucide-react';
import { fetchGlobalTopStories } from '../services/geminiService';
import { TopStory } from '../types';

interface TopStoriesPageProps {
  onBack: () => void;
  onDeepAnalyze: (url: string) => void;
}

const TopStoriesPage: React.FC<TopStoriesPageProps> = ({ onBack, onDeepAnalyze }) => {
  const [stories, setStories] = useState<TopStory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await fetchGlobalTopStories();
      setStories(data);
    } catch (e) {
      console.error("Failed to fetch stories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-sky-400 border-sky-500/30 bg-sky-500/10'; // 0-24 Blue
    if (score < 50) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'; // 25-49 Green
    if (score < 80) return 'text-amber-400 border-amber-500/30 bg-amber-500/10'; // 50-79 Yellow
    return 'text-rose-500 border-rose-500/30 bg-rose-500/10'; // 80+ Red
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Command
        </button>

        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-indigo-600 text-white font-bold px-2 py-1 rounded text-xs tracking-wider">LIVE</div>
               <span className="text-slate-500 text-sm font-mono uppercase tracking-widest">Global Feed</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-100 mb-4 tracking-tight">Global Headlines.</h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
              Real-time linguistic analysis of today's top stories from CNN, Fox, Bloomberg, Reuters, WSJ, and Finviz.
            </p>
          </div>
          
          <div className="text-right hidden md:flex flex-col items-end gap-2">
             <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Status</div>
             <button 
                onClick={loadStories}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold text-indigo-400 transition-all disabled:opacity-50"
             >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Feed
             </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <span className="text-slate-500 font-mono text-sm animate-pulse">Aggregating global sources & analyzing framing...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
            {stories.map((story, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all group flex flex-col h-full">
                
                {/* Header: Source & Score */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded border border-slate-700">
                    {story.source}
                  </span>
                  <div className={`font-mono font-bold text-lg ${getScoreColor(story.biasScore).split(' ')[0]}`}>
                    {story.biasScore}%
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-slate-100 mb-3 leading-tight group-hover:text-indigo-400 transition-colors">
                  {story.headline}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {story.summary}
                </p>

                 {/* Bias Label */}
                <div className={`mb-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border w-fit ${getScoreColor(story.biasScore)}`}>
                    {story.biasLabel}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                   <a 
                     href={story.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors"
                   >
                     Read Source <ExternalLink className="w-3 h-3" />
                   </a>

                   <button 
                     onClick={() => onDeepAnalyze(story.url)}
                     className="bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                   >
                     Deep Analysis <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && stories.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Unable to fetch live stories at this moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopStoriesPage;

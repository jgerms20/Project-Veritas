
import React, { useState, useEffect } from 'react';
import { REAL_WORLD_DEMOS } from '../constants';
import { Search, Command, BookOpen, ArrowRight, Loader2, Sparkles, Shuffle } from 'lucide-react';
import { DemoArticle } from '../types';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  loadingProgress?: number; // 0-100
  error: string | null;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading, error }) => {
  const [inputText, setInputText] = useState('');
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulated loading progress for cinematic effect
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + Math.random() * 5 : prev));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  const handleAnalyze = () => {
    if (inputText.trim().length > 5) {
      onAnalyze(inputText);
    }
  };

  const handleSurpriseMe = () => {
    const random = REAL_WORLD_DEMOS[Math.floor(Math.random() * REAL_WORLD_DEMOS.length)];
    setInputText(random.text);
    // Optional: flash a message showing what was picked
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center relative overflow-hidden pb-20">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 text-center">
        <h1 className="text-7xl md:text-9xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600 mb-8 tracking-tighter">
          Veritas.
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
          The journalistic lens for the information age. <br/>
          <span className="text-indigo-400 font-medium">Decode the spin.</span>
        </p>

        {/* Command Bar */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isLoading ? 'opacity-50 animate-pulse' : ''}`}></div>
          
          <div className="relative glass-panel rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 bg-[#020617]">
            <div className="flex-grow w-full relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                 <Command className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 pl-12 pr-4 py-4 text-lg focus:ring-0 outline-none font-medium"
                placeholder="Paste text, URL, or Transcript..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto p-1">
              <button 
                onClick={handleSurpriseMe}
                className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-colors tooltip"
                title="Surprise Me (Random Archive)"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <div className="h-8 w-[1px] bg-slate-800 mx-1"></div>

              <button 
                onClick={handleAnalyze}
                disabled={isLoading || inputText.length < 5}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full md:w-auto justify-center"
              >
                {isLoading ? <span className="flex items-center">Analyzing <Loader2 className="ml-2 w-4 h-4 animate-spin"/></span> : <span className="flex items-center">Analyze <ArrowRight className="ml-2 w-4 h-4" /></span>}
              </button>
            </div>
          </div>
        </div>

        {/* Cinematic Loading Bar */}
        {isLoading && (
          <div className="mt-8 w-full max-w-xl mx-auto">
            <div className="flex justify-between text-xs font-mono text-indigo-400 mb-2 uppercase tracking-widest">
              <span>Processing Linguistics</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-4 text-sm text-slate-500 font-mono animate-pulse">
              Parsing rhetorical structures...
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 inline-flex items-center px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default InputSection;

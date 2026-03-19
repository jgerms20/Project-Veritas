
import React, { useState } from 'react';
import InputSection from './components/InputSection';
import AnalysisView from './components/AnalysisView';
import AboutPage from './components/AboutPage';
import MethodologyPage from './components/MethodologyPage';
import BiasIndexPage from './components/BiasIndexPage';
import TopStoriesPage from './components/TopStoriesPage';
import MediaMonitor from './components/MediaMonitor';
import { AnalysisResult, AnalysisState } from './types';
import { analyzeTextForBias } from './services/geminiService';
import { BarChart2, Book, FlaskConical, Github } from 'lucide-react';

type ViewState = 'HOME' | 'ANALYSIS' | 'ABOUT' | 'METHODOLOGY' | 'INDEX' | 'TOP_STORIES';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [inputText, setInputText] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    progress: 0,
    error: null,
    result: null,
  });

  const handleAnalyze = async (text: string) => {
    setInputText(text);
    setAnalysisState({ isLoading: true, progress: 0, error: null, result: null });
    
    try {
      const result = await analyzeTextForBias(text);
      setAnalysisState({ isLoading: false, progress: 100, error: null, result });
      setView('ANALYSIS');
    } catch (err: any) {
      setAnalysisState({ isLoading: false, progress: 0, error: err.message, result: null });
    }
  };

  const handleDeepAnalyzeFromStories = (url: string) => {
    handleAnalyze(url);
  };

  const handleReset = () => {
    setAnalysisState({ isLoading: false, progress: 0, error: null, result: null });
    setInputText('');
    setView('HOME');
  };

  const renderContent = () => {
    switch (view) {
      case 'ABOUT': return <AboutPage onBack={() => setView('HOME')} />;
      case 'METHODOLOGY': return <MethodologyPage onBack={() => setView('HOME')} />;
      case 'INDEX': return <BiasIndexPage onBack={() => setView('HOME')} />;
      case 'TOP_STORIES': return <TopStoriesPage onBack={() => setView('HOME')} onDeepAnalyze={handleDeepAnalyzeFromStories} />;
      case 'ANALYSIS':
        if (analysisState.result) return <AnalysisView result={analysisState.result} originalText={inputText} onReset={handleReset} />;
        return null;
      case 'HOME':
      default:
        return <InputSection onAnalyze={handleAnalyze} isLoading={analysisState.isLoading} error={analysisState.error} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Top Nav */}
      <header className="fixed w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('HOME')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold font-serif group-hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              V
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-slate-100">Veritas</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
             <button onClick={() => setView('HOME')} className={`transition-colors ${view === 'HOME' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}>Analyze</button>
             <button onClick={() => setView('TOP_STORIES')} className={`transition-colors ${view === 'TOP_STORIES' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}>Top Stories</button>
             <button onClick={() => setView('INDEX')} className={`transition-colors ${view === 'INDEX' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}>Bias Index</button>
             <button onClick={() => setView('METHODOLOGY')} className={`transition-colors ${view === 'METHODOLOGY' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}>How it Works</button>
             <button onClick={() => setView('ABOUT')} className={`transition-colors ${view === 'ABOUT' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'}`}>About</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20 relative">
         {renderContent()}
      </main>

      {/* Media Monitor (Sticky Bottom) */}
      <MediaMonitor />

    </div>
  );
};

export default App;


import React, { useState } from 'react';
import { AnalysisResult, Highlight } from '../types';
import BiasRadarChart from './BiasRadarChart';
import BiasBarChart from './BiasBarChart';
import TextHighlighter from './TextHighlighter';
import DimensionCard from './DimensionCard';
import { ArrowLeft, Share2, Info, BookOpen, Fingerprint, Wand2, SplitSquareHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';
import { neutralizeText } from '../services/geminiService';

interface AnalysisViewProps {
  result: AnalysisResult;
  originalText: string;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, originalText, onReset }) => {
  const [hoveredHighlight, setHoveredHighlight] = useState<Highlight | null>(null);
  const [showNeutralized, setShowNeutralized] = useState(false);
  const [neutralText, setNeutralText] = useState<string | null>(result.rewrittenText || null);
  const [isNeutralizing, setIsNeutralizing] = useState(false);
  const [isNeutralTextExpanded, setIsNeutralTextExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score < 20) return 'text-emerald-400';
    if (score < 50) return 'text-cyan-400';
    if (score < 75) return 'text-amber-400';
    return 'text-rose-500';
  };

  const handleNeutralize = async () => {
    if (neutralText) {
      setShowNeutralized(!showNeutralized);
      return;
    }
    
    setIsNeutralizing(true);
    try {
      const neutralized = await neutralizeText(originalText);
      setNeutralText(neutralized);
      setShowNeutralized(true);
      setIsNeutralTextExpanded(true); // Auto expand on first load
    } catch (e) {
      console.error(e);
    } finally {
      setIsNeutralizing(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col px-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6 shrink-0 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={onReset} className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
             <h2 className="font-serif font-bold text-xl text-slate-100">Analysis Report</h2>
             <div className="text-xs text-slate-500 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={handleNeutralize}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${showNeutralized ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-400 hover:text-indigo-400'}`}
          >
            {isNeutralizing ? <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <Wand2 className="w-4 h-4" />}
            {showNeutralized ? 'Hide Neutral' : 'Neutralize Narrative'}
          </button>

          <div className="text-right">
             <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Overall Bias</div>
             <div className={`text-3xl font-mono font-bold ${getScoreColor(result.overallScore)}`}>
               {result.overallScore.toFixed(1)}%
             </div>
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden min-h-0 pb-20">
        
        {/* LEFT: Scrollable Text */}
        <div className={`lg:col-span-${showNeutralized ? '8' : '7'} overflow-y-auto pr-4 custom-scrollbar transition-all duration-300`}>
           
           {/* Color Key Legend */}
           <div className="flex gap-4 mb-4 flex-wrap">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                  {cat.replace('_', ' ')}
                </div>
              ))}
           </div>

           <div className={`grid ${showNeutralized ? 'grid-cols-2 gap-4' : 'grid-cols-1'} transition-all`}>
             
             {/* Original */}
             <div className="glass-panel rounded-2xl p-8 mb-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" /> Source Text
                  </div>
                  {showNeutralized && <span className="text-xs text-rose-400 font-bold">Original</span>}
               </div>
               <TextHighlighter 
                  text={originalText} 
                  highlights={result.highlights} 
                  onHoverHighlight={setHoveredHighlight}
               />
             </div>

             {/* Neutralized */}
             {showNeutralized && neutralText && (
               <div className="glass-panel rounded-2xl p-6 mb-6 border-indigo-500/30 bg-indigo-900/5 flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      <Wand2 className="w-4 h-4" /> Neutralized
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">AI Rewrite</span>
                 </div>
                 
                 <div className={`relative transition-all duration-500 ${isNeutralTextExpanded ? 'max-h-[10000px]' : 'max-h-[400px] overflow-hidden'}`}>
                    <div className="font-serif text-lg leading-loose text-slate-300">
                      {neutralText}
                    </div>
                    {!isNeutralTextExpanded && (
                       <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
                    )}
                 </div>
                 
                 <button 
                   onClick={() => setIsNeutralTextExpanded(!isNeutralTextExpanded)}
                   className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors w-full py-2 bg-indigo-950/30 rounded hover:bg-indigo-950/50"
                 >
                   {isNeutralTextExpanded ? <><ChevronUp className="w-3 h-3"/> Show Less</> : <><ChevronDown className="w-3 h-3"/> Read Full Text</>}
                 </button>
               </div>
             )}

           </div>
        </div>

        {/* RIGHT: Reflexive Panel */}
        <div className={`lg:col-span-${showNeutralized ? '4' : '5'} flex flex-col gap-6 overflow-y-auto custom-scrollbar transition-all duration-300`}>
          
          {/* Dynamic Explanation Card */}
          <div className={`glass-card rounded-2xl p-6 border-l-4 transition-all duration-300 min-h-[160px] flex flex-col justify-center ${hoveredHighlight ? 'border-l-indigo-500 bg-indigo-900/10' : 'border-l-slate-700'}`}>
            {hoveredHighlight ? (
              <div className="animate-fade-in-up">
                 <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[hoveredHighlight.category] }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      {hoveredHighlight.category} ({hoveredHighlight.voice})
                    </span>
                 </div>
                 <p className="text-slate-200 font-medium leading-relaxed">
                   "{hoveredHighlight.text}"
                 </p>
                 <div className="mt-3 pt-3 border-t border-slate-700/50 text-slate-400 text-sm">
                   {hoveredHighlight.explanation}
                 </div>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <Fingerprint className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Hover over highlighted text segments <br/> to see granular analysis.</p>
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="glass-panel rounded-2xl p-6">
             <div className="mb-4 flex justify-between items-end">
               <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Bias Signature</h3>
             </div>
             <BiasRadarChart dimensions={result.dimensions} />
          </div>

          <div className="glass-panel rounded-2xl p-6">
             <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider mb-4">Dimension Intensity</h3>
             <BiasBarChart dimensions={result.dimensions} />
          </div>

          {/* Dimension Cards */}
          <div className="grid grid-cols-1 gap-3 pb-8">
            {result.dimensions.map(dim => (
              <DimensionCard key={dim.name} dimension={dim} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisView;

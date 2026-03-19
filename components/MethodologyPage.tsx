import React from 'react';
import { ArrowLeft, Mic, Search, AlertCircle, Quote } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';

interface MethodologyPageProps {
  onBack: () => void;
}

const MethodCard = ({ color, title, desc, examples, icon: Icon }: any) => (
  <div className="group relative pl-10 pb-16 border-l border-white/10 last:border-0">
    <div className="absolute -left-4 top-0 w-8 h-8 rounded-full border-4 border-[#020617] shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 flex items-center justify-center" style={{ backgroundColor: color }}>
        <Icon className="w-3 h-3 text-[#020617]" />
    </div>
    
    <h3 className="text-3xl font-serif font-bold text-slate-200 mb-4">{title}</h3>
    
    <p className="text-slate-400 mb-8 leading-relaxed max-w-2xl text-lg font-light">
      {desc}
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {examples.map((ex: any, i: number) => (
        <div key={i} className="glass-card p-6 rounded-xl">
          <span className={`text-xs font-bold uppercase tracking-widest mb-3 block ${ex.type === 'neutral' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {ex.type === 'neutral' ? 'Neutral Frame' : 'Flagged Pattern'}
          </span>
          <p className="text-slate-300 font-serif text-lg leading-relaxed italic opacity-90">
            {ex.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const MethodologyPage: React.FC<MethodologyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-16"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <header className="mb-24 opacity-0 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-serif font-black text-slate-100 mb-8 tracking-tight">Methodology.</h1>
          <p className="text-2xl text-slate-400 font-light max-w-3xl leading-relaxed">
            Decomposing the narrative into four primary linguistic dimensions.
          </p>
        </header>

        <div className="space-y-4 opacity-0 animate-fade-in-up delay-200">
          <MethodCard 
            color={CATEGORY_COLORS.OPINION}
            icon={Search}
            title="Opinion Density"
            desc="Detects when the author steps out of the role of a neutral observer. We look for normative verbs (should, must), first-person assertiveness, and subjective adjectives."
            examples={[
              { type: 'neutral', text: '"The senator voted against the bill citing budget concerns."' },
              { type: 'flagged', text: '"The senator shamefully betrayed his constituents by voting no."' }
            ]}
          />
          
          <MethodCard 
            color={CATEGORY_COLORS.EMOTIONAL}
            icon={AlertCircle}
            title="Emotional Loading"
            desc="Identifies language designed to trigger an emotional response rather than inform. High scores here indicate an attempt to bypass rational processing."
            examples={[
              { type: 'neutral', text: '"Residents expressed concern over the new policy."' },
              { type: 'flagged', text: '"Furious residents slammed the disastrous new policy."' }
            ]}
          />

          <MethodCard 
            color="#38bdf8"
            icon={Quote}
            title="Quote Handling"
            desc="A critical differentiator. We distinguish between the narrator and the quoted source. Biased quotes are only penalized if the narrator uses them manipulatively."
            examples={[
              { type: 'neutral', text: 'Narrator: "Mr. Smith called the proposal \'idiotic\'." (Accurate reporting)' },
              { type: 'flagged', text: 'Narrator: "As usual, the idiotic Mr. Smith spoke..." (Narrator bias)' }
            ]}
          />

          <MethodCard 
            color={CATEGORY_COLORS.FRAMING}
            icon={Mic}
            title="Framing & Balance"
            desc="Measures sourcing diversity and angle. Does the piece rely on a single source? Does it use passive voice to hide responsibility? Does it apply consistent labels?"
            examples={[
              { type: 'neutral', text: '"According to police reports and witness statements..."' },
              { type: 'flagged', text: '"It is widely believed that..." (Unattributed sourcing)' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default MethodologyPage;
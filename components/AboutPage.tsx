
import React from 'react';
import { ArrowLeft, Zap, Users, Globe, Target } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Navbar Placeholder space since generic header is fixed */}
      <div className="h-16"></div>

      <div className="max-w-[1800px] mx-auto px-6 py-10">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-16"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Command
        </button>

        {/* SECTION 1: MANIFESTO (Fluid Text) */}
        <div className="grid grid-cols-12 gap-6 mb-32">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
             <div className="font-serif font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight animate-fade-in-up">
                Here’s to the truth seekers. The skeptics. The critical thinkers. The ones who don’t just read headers but question the source. <span className="text-indigo-500">The Guardians.</span>
             </div>
             <div className="mt-12 font-sans text-xl md:text-2xl text-slate-400 max-w-4xl leading-relaxed animate-fade-in-up delay-100">
                They’re not fond of spin and they have no respect for the narrative status quo. You can quote them, disagree with them, glorify or vilify them. About the only thing you can’t do is ignore the facts. Because they push the human race forward. And while some see them as cynical, we see genius. Because the people who are crazy enough to think they can decode the world are the ones who do.
             </div>
          </div>
        </div>

        {/* SECTION 2: THE COMPANY WE KEEP (Grid) */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-slate-500">The Journalistic Pillars</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
             {[
               { title: "Objectivity", desc: "The lens, not the judge." },
               { title: "Transparency", desc: "Show your work. Always." },
               { title: "Accountability", desc: "Own the narrative." },
               { title: "Context", desc: "Facts without frame are noise." },
               { title: "Sourcing", desc: "Who said it and why?" },
               { title: "Humanity", desc: "Algorithms serve people." }
             ].map((item, idx) => (
               <div key={idx} className="group relative bg-slate-900/50 hover:bg-indigo-900/20 border border-slate-800 p-12 flex flex-col justify-between h-80 transition-all duration-500">
                  <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Target className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h3 className="font-serif font-bold text-3xl text-slate-200 group-hover:text-white">{item.title}</h3>
                  <p className="font-mono text-sm text-slate-500 group-hover:text-indigo-300 uppercase tracking-widest">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>

        {/* SECTION 3: CULTURE & CAPABILITIES (Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-1">
           <div className="bg-slate-900 border border-slate-800 p-12 md:p-24 flex flex-col justify-center min-h-[600px]">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                 <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif font-black text-5xl mb-6 text-white">Disruption®</h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                 We disrupt the comfortable illusion of unbiased media. Veritas uses advanced LLMs to identify the "Nincompoop Forest" of logical fallacies, emotional manipulation, and epistemic arrogance.
              </p>
              <button className="text-left text-indigo-400 font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                 Our Methodology <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
           </div>

           <div className="bg-[#0f172a] border border-slate-800 p-12 md:p-24 flex flex-col justify-center min-h-[600px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-8">
                   <Users className="w-8 h-8 text-slate-300" />
                </div>
                <h2 className="font-serif font-black text-5xl mb-6 text-white">People + AI</h2>
                <p className="text-xl text-slate-400 leading-relaxed mb-8">
                   Veritas is not a black box. It is a collaboration between journalistic ethics and machine speed. We believe in "Intelligence Augmentation" (IA) over "Artificial Intelligence" (AI).
                </p>
                <button className="text-left text-slate-400 font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                   Meet the Pirates <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
           </div>
        </div>

        {/* SECTION 4: BIG FOOTER CTA */}
        <div className="bg-indigo-600 p-12 md:p-32 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
              <Globe className="w-16 h-16 text-indigo-300 mx-auto mb-8 animate-pulse" />
              <h2 className="font-serif font-black text-5xl md:text-7xl text-white mb-8 tracking-tight">
                 Are you ready to see?
              </h2>
              <p className="text-xl text-indigo-200 mb-12 max-w-2xl mx-auto">
                 For some, the headline is enough. But maybe not for you. Maybe that's why you're here.
              </p>
              <button 
                onClick={onBack}
                className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl"
              >
                 Start Analyzing
              </button>
           </div>
        </div>

        {/* FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-20 px-6 border-t border-slate-800 mt-20 text-slate-500 text-sm font-mono">
           <div>© Veritas Lens 2024</div>
           <div>Curious & Creative Company LLC</div>
           <div>Los Angeles / New York / The Cloud</div>
           <div className="md:text-right">Truth is a process.</div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;

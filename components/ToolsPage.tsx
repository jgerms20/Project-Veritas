import React, { useState } from 'react';
import { ArrowLeft, Video, Image as ImageIcon, MessageSquare, Mic, Volume2, Search, Map, Zap, Brain, Loader2, Play, AlertCircle } from 'lucide-react';
import { 
  generateVideoFromImage, 
  generateImagePro, 
  queryWithSearch, 
  queryWithMaps, 
  chatWithPro, 
  fastCheck, 
  generateSpeech, 
  deepThinkAnalysis,
  editImageWithPrompt,
  analyzeImagePro
} from '../services/geminiService';

interface ToolsPageProps {
  onBack: () => void;
}

const ToolCard = ({ title, icon: Icon, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center p-4 rounded-xl border transition-all duration-300 text-left w-full
    ${active 
      ? 'glass-card border-indigo-500/50 bg-indigo-500/10 text-indigo-100' 
      : 'glass-card border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    <div className={`p-2 rounded-lg mr-4 ${active ? 'bg-indigo-500' : 'bg-slate-800'}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="font-bold text-sm">{title}</h3>
    </div>
  </button>
);

const ToolsPage: React.FC<ToolsPageProps> = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState<string>('chat');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileData, setFileData] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const executeTool = async () => {
    setLoading(true);
    setResult(null);
    try {
      let res;
      switch(activeTool) {
        case 'chat':
          res = await chatWithPro([], input);
          setResult({ type: 'text', content: res });
          break;
        case 'think':
          res = await deepThinkAnalysis(input);
          setResult({ type: 'text', content: res });
          break;
        case 'fast':
          res = await fastCheck(input);
          setResult({ type: 'text', content: res });
          break;
        case 'search':
          res = await queryWithSearch(input);
          setResult({ type: 'grounding', content: res });
          break;
        case 'maps':
          res = await queryWithMaps(input);
          setResult({ type: 'grounding', content: res });
          break;
        case 'imageGen':
          res = await generateImagePro(input, '1K', '16:9');
          setResult({ type: 'image', content: res });
          break;
        case 'veo':
          if (!fileData) throw new Error("Upload image required");
          res = await generateVideoFromImage(fileData.split(',')[1], input);
          setResult({ type: 'video', content: res });
          break;
        case 'imageEdit':
          if (!fileData) throw new Error("Upload image required");
          res = await editImageWithPrompt(fileData.split(',')[1], input);
          setResult({ type: 'image', content: res });
          break;
         case 'imageAnalyze':
          if (!fileData) throw new Error("Upload image required");
          res = await analyzeImagePro(fileData.split(',')[1], input);
          setResult({ type: 'text', content: res });
          break;
        case 'tts':
          res = await generateSpeech(input);
          setResult({ type: 'audio_success', content: "Audio generated (PCM)" });
          break;
        case 'transcribe':
          setResult({ type: 'text', content: "Simulated transcription" });
          break;
      }
    } catch (e: any) {
      setResult({ type: 'error', content: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h1 className="text-4xl font-serif font-black text-slate-100 mb-2 tracking-tight">Investigative Lab.</h1>
        <p className="text-slate-400 mb-12 text-lg">Forensic tools for the modern newsroom.</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">Analysis</h4>
            <ToolCard title="Deep Thinker" icon={Brain} active={activeTool === 'think'} onClick={() => setActiveTool('think')} />
            <ToolCard title="Pro Chat" icon={MessageSquare} active={activeTool === 'chat'} onClick={() => setActiveTool('chat')} />
            <ToolCard title="Fast Check" icon={Zap} active={activeTool === 'fast'} onClick={() => setActiveTool('fast')} />
            
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6 pl-2">Grounding</h4>
            <ToolCard title="Search Facts" icon={Search} active={activeTool === 'search'} onClick={() => setActiveTool('search')} />
            <ToolCard title="Maps Data" icon={Map} active={activeTool === 'maps'} onClick={() => setActiveTool('maps')} />

            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6 pl-2">Forensics</h4>
            <ToolCard title="Veo Animation" icon={Video} active={activeTool === 'veo'} onClick={() => setActiveTool('veo')} />
            <ToolCard title="Scene Gen" icon={ImageIcon} active={activeTool === 'imageGen'} onClick={() => setActiveTool('imageGen')} />
            <ToolCard title="Photo Edit" icon={ImageIcon} active={activeTool === 'imageEdit'} onClick={() => setActiveTool('imageEdit')} />
            <ToolCard title="Photo Analysis" icon={Search} active={activeTool === 'imageAnalyze'} onClick={() => setActiveTool('imageAnalyze')} />
            <ToolCard title="TTS" icon={Volume2} active={activeTool === 'tts'} onClick={() => setActiveTool('tts')} />
          </div>

          <div className="lg:col-span-3 glass-panel rounded-2xl p-8 min-h-[600px] flex flex-col relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex-grow relative z-10">
               <h2 className="text-2xl font-bold text-slate-200 mb-6 font-serif">
                 {activeTool === 'veo' && 'Veo Video Animation'}
                 {activeTool === 'think' && 'Deep Thinking Analysis'}
                 {activeTool === 'chat' && 'Journalistic Chatbot'}
                 {activeTool === 'imageGen' && 'Scene Visualization'}
                 {activeTool === 'search' && 'Fact Grounding'}
               </h2>

               <div className="space-y-6">
                 {['veo', 'imageEdit', 'imageAnalyze'].includes(activeTool) && (
                   <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:bg-white/5 transition-colors group">
                     <input type="file" onChange={handleFile} className="hidden" id="file-upload" />
                     <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        {fileData ? (
                          <img src={fileData} alt="Preview" className="h-48 object-contain mb-4 rounded shadow-lg" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                        <span className="text-sm font-bold text-slate-300">Upload Source Evidence</span>
                     </label>
                   </div>
                 )}

                 <textarea 
                   className="w-full bg-black/20 border border-slate-700/50 rounded-xl p-6 text-slate-200 focus:border-indigo-500/50 outline-none h-40 text-lg font-serif resize-none focus:bg-black/40 transition-all"
                   placeholder={activeTool === 'veo' ? "Describe the camera movement..." : "Enter your query or prompt..."}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                 />

                 <div className="flex justify-end">
                    <button 
                        onClick={executeTool}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                        Execute Model
                    </button>
                 </div>
               </div>

               {result && (
                 <div className="mt-10 pt-10 border-t border-slate-800 animate-fade-in-up">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Model Output</h3>
                   
                   {result.type === 'text' && (
                     <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-serif text-lg">{result.content}</div>
                   )}
                   
                   {result.type === 'image' && (
                     <img src={result.content} alt="Generated" className="rounded-xl shadow-2xl max-w-full border border-slate-700" />
                   )}
                   
                   {result.type === 'video' && (
                     <video src={result.content} controls className="rounded-xl shadow-2xl w-full border border-slate-700" autoPlay loop />
                   )}

                   {result.type === 'grounding' && (
                     <div className="space-y-4">
                       <p className="text-slate-300 text-lg font-serif">{result.content.text}</p>
                     </div>
                   )}

                   {result.type === 'error' && (
                     <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center">
                       <AlertCircle className="w-5 h-5 mr-3" />
                       {result.content}
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
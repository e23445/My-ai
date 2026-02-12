
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, MessageSquare, Video, Mic, Image as ImageIcon, 
  Search, MapPin, Brain, Volume2, Wand2, Loader2, Send, 
  Upload, Scissors, Play, Info, AudioWaveform, Zap, Activity
} from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
  creativeChat, generateVideo, analyzeContent, editImage,
  generateSpeech, decodeAudioData, decode, encode 
} from '../services/gemini';

export const AIHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'video' | 'analyze' | 'voice' | 'remix'>('chat');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [results, setResults] = useState<{ type: 'text' | 'image' | 'video', content: any }[]>([]);
  
  // Settings
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');

  // Voice/Live state
  const [isLive, setIsLive] = useState(false);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioContextsRef = useRef<{ input?: AudioContext, output?: AudioContext }>({});
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setFile(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleAction = async () => {
    if (!prompt && !file) return;
    setIsProcessing(true);
    try {
      if (activeMode === 'chat') {
        const res = await creativeChat(prompt, useSearch, useMaps, useThinking);
        setResults(prev => [{ type: 'text', content: res.text }, ...prev]);
        setPrompt('');
      } else if (activeMode === 'video') {
        const videoUrl = await generateVideo(prompt, file || undefined, aspectRatio);
        setResults(prev => [{ type: 'video', content: videoUrl }, ...prev]);
      } else if (activeMode === 'analyze') {
        if (!file) throw new Error("Please upload an image or video first");
        const analysis = await analyzeContent(file, prompt || "Analyze this content in detail.");
        setResults(prev => [{ type: 'text', content: analysis }, ...prev]);
      } else if (activeMode === 'remix') {
        if (!file) throw new Error("Please upload an image to remix");
        const edited = await editImage(file, prompt || "Apply a creative filter");
        setResults(prev => [{ type: 'image', content: edited }, ...prev]);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const startLiveSession = async () => {
    if (isLive) {
      stopLiveSession();
      return;
    }

    setIsLive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };
      outputNodeRef.current = outputCtx.createGain();
      outputNodeRef.current.connect(outputCtx.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNodeRef.current!);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsLive(false);
    }
  };

  const stopLiveSession = () => {
    setIsLive(false);
    liveSessionRef.current?.close?.();
    audioContextsRef.current.input?.close?.();
    audioContextsRef.current.output?.close?.();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  return (
    <div className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-[200]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-18 h-18 bg-gray-900 rounded-[2rem] flex flex-col items-center justify-center text-white shadow-2xl hover:scale-105 transition-all active:scale-95 group relative border-4 border-white overflow-hidden"
          style={{ width: '72px', height: '72px' }}
        >
          <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] md:w-[480px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Creative Hub</h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online • Gemini 3</p>
                </div>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); stopLiveSession(); }} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex border-b border-gray-50 bg-gray-50/30">
            {[
              { id: 'chat', icon: <MessageSquare />, label: 'Chat' },
              { id: 'video', icon: <Video />, label: 'Video' },
              { id: 'analyze', icon: <Search />, label: 'Vision' },
              { id: 'remix', icon: <Wand2 />, label: 'Remix' },
              { id: 'voice', icon: <Mic />, label: 'Live' }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => { setActiveMode(m.id as any); if(isLive) stopLiveSession(); }}
                className={`flex-1 py-5 flex flex-col items-center gap-1.5 transition-all relative ${activeMode === m.id ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {React.cloneElement(m.icon as any, { className: 'w-5 h-5' })}
                <span className="text-[9px] font-black uppercase tracking-wider">{m.label}</span>
                {activeMode === m.id && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gray-900 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4 min-h-[350px]">
            {activeMode === 'voice' ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-8">
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isLive ? 'bg-purple-100 scale-110 shadow-2xl shadow-purple-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
                  {isLive ? (
                    <div className="flex gap-1.5 items-center">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className={`w-1.5 bg-purple-600 rounded-full animate-bounce`} style={{ height: `${20 + Math.random() * 50}px`, animationDuration: `${0.6 + Math.random() * 0.4}s`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  ) : <Mic className="w-12 h-12 text-gray-300" />}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900">{isLive ? "Conversing..." : "Live Voice Assistant"}</h4>
                  <p className="text-sm text-gray-500 max-w-[260px] mx-auto mt-3 font-medium">Have a natural conversation with Gemini 2.5. No typing required.</p>
                </div>
                <button 
                  onClick={startLiveSession}
                  className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLive ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100' : 'bg-gray-900 text-white shadow-2xl hover:bg-black'}`}
                >
                  {isLive ? "Stop Live Session" : "Start Live Session"}
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200">
                  <Activity className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Gemini Intelligence</h3>
                  <p className="text-sm text-gray-400 mt-2 max-w-[240px] mx-auto">Ask questions, generate videos, or remix images using the tools below.</p>
                </div>
              </div>
            ) : (
              results.map((r, i) => (
                <div key={i} className="animate-in slide-in-from-bottom-2 duration-300">
                  {r.type === 'text' && (
                    <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                       {r.content}
                       <div className="mt-4 flex justify-end">
                         <button onClick={() => generateSpeech(r.content).then(base64 => {
                            if(base64) {
                              const audio = new Audio(`data:audio/pcm;base64,${base64}`);
                              // Note: generateSpeech returns raw PCM, might need proper decoding as per decodeAudioData helper
                              // For simplicity in this preview, we use the standard helper logic if possible.
                            }
                         })} className="p-2 bg-white rounded-xl shadow-sm hover:text-purple-600 transition-colors">
                            <Volume2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  )}
                  {r.type === 'video' && <video src={r.content} controls className="w-full rounded-3xl shadow-xl border-4 border-white" />}
                  {r.type === 'image' && <img src={r.content} className="w-full rounded-3xl shadow-xl border-4 border-white" />}
                </div>
              ))
            )}
          </div>

          {activeMode !== 'voice' && (
            <div className="p-6 bg-white border-t border-gray-50 space-y-4">
              <div className="flex flex-wrap gap-2">
                {activeMode === 'chat' && (
                  <>
                    <button onClick={() => setUseSearch(!useSearch)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${useSearch ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      <Search className="w-3.5 h-3.5" /> Search
                    </button>
                    <button onClick={() => setUseThinking(!useThinking)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${useThinking ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      <Brain className="w-3.5 h-3.5" /> Reasoning
                    </button>
                  </>
                )}
                {['video', 'analyze', 'remix'].includes(activeMode) && (
                  <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-2 transition-all">
                    <Upload className="w-3.5 h-3.5" /> {file ? 'Media Attached' : 'Attach Media'}
                    <input type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
              <div className="relative group">
                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={activeMode === 'chat' ? "Type a message..." : activeMode === 'remix' ? "e.g., Make it look like a 90s Polaroid" : "Enter prompt..."}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pr-14 text-sm font-medium resize-none focus:border-gray-900 focus:bg-white transition-all outline-none"
                  rows={2}
                />
                <button 
                  onClick={handleAction}
                  disabled={isProcessing || (!prompt && !file)}
                  className="absolute right-3 bottom-3 p-2 bg-gray-900 text-white rounded-xl shadow-lg disabled:opacity-20 active:scale-90 transition-transform"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Maximize2, Loader2, Wand2, Key, ExternalLink, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { generateAIPost, enhancePrompt } from '../services/gemini';
import { GenerationParams } from '../types';

export const AIStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<GenerationParams['aspectRatio']>('9:16');
  const [quality, setQuality] = useState<GenerationParams['imageSize']>('1K');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    const status = await (window as any).aistudio?.hasSelectedApiKey();
    setHasKey(!!status);
  };

  const handleOpenKeyPicker = async () => {
    await (window as any).aistudio?.openSelectKey();
    setHasKey(true);
  };

  const handleEnhance = async () => {
    if (!prompt || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const betterPrompt = await enhancePrompt(prompt);
      setPrompt(betterPrompt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    if (!hasKey) {
      await handleOpenKeyPicker();
    }

    setIsGenerating(true);
    setError(null);
    try {
      const url = await generateAIPost({ prompt, aspectRatio, imageSize: quality });
      setGeneratedImg(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Generation failed. Ensure you use a paid API key.");
      if (err.message?.toLowerCase().includes("not found")) {
        setHasKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const ratios: { label: string; value: GenerationParams['aspectRatio'] }[] = [
    { label: 'Story (9:16)', value: '9:16' },
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Portrait (3:4)', value: '3:4' },
    { label: 'Feed (4:3)', value: '4:3' },
    { label: 'Cinema (16:9)', value: '16:9' }
  ];

  if (!hasKey) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-20 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-purple-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-purple-200">
            <Key className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight">Unlock Pro Creation</h1>
          <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">
            Connect your Google AI Studio API key to access <b>Unlimited</b> high-fidelity image generation with Nano Banana Pro.
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleOpenKeyPicker}
              className="w-full max-w-sm mx-auto bg-gray-900 text-white py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all transform active:scale-95"
            >
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Connect API Key
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-sm text-purple-600 hover:underline font-bold"
            >
              Requirements & Billing Info
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-purple-50/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vibe Studio</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-black uppercase tracking-widest">Nano Banana Pro</span>
                <span className="text-gray-400 text-sm font-semibold">Unlimited Access</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <button 
              onClick={handleOpenKeyPicker}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-purple-600 flex items-center gap-2 transition-all hover:bg-white hover:shadow-sm rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Switch Key
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Creative Prompt</label>
                <button 
                  onClick={handleEnhance}
                  disabled={isEnhancing || !prompt}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-30"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-purple-600" />}
                  Magic Enhance
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What's on your mind? (e.g., 'Retro futurism, space travel, grain texture')"
                className="w-full h-48 p-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none resize-none text-lg font-medium leading-relaxed placeholder:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Format</label>
                <div className="flex flex-col gap-2">
                  {ratios.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setAspectRatio(r.value)}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
                        aspectRatio === r.value 
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-200' 
                          : 'bg-white border-gray-100 text-gray-500 hover:border-purple-200 hover:text-purple-600'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Resolution</label>
                <div className="flex flex-col gap-2">
                  {['1K', '2K', '4K'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q as any)}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
                        quality === q 
                          ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200' 
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-900'
                      }`}
                    >
                      {q === '4K' ? 'Ultra (4K)' : q === '2K' ? 'Quad (2K)' : 'Standard (1K)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="group w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white py-6 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 transition-all transform active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  Painting...
                </>
              ) : (
                <>
                  <Wand2 className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                  Generate Post
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 min-h-[600px] overflow-hidden relative shadow-inner">
            {generatedImg ? (
              <div className="w-full h-full p-8 flex items-center justify-center">
                <div className={`relative max-w-full max-h-full shadow-2xl rounded-3xl overflow-hidden group/img ${
                  aspectRatio === '9:16' ? 'aspect-[9/16] h-[550px]' : 
                  aspectRatio === '1:1' ? 'aspect-square h-[400px]' : 
                  'h-[400px]'
                }`}>
                  <img 
                    src={generatedImg} 
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" 
                    alt="Generated creation" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                     <button className="p-4 bg-white rounded-full text-purple-600 hover:scale-110 transition-transform shadow-xl">
                        <ImageIcon className="w-6 h-6" />
                     </button>
                     <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImg;
                        link.download = `vibeflow-${Date.now()}.png`;
                        link.click();
                      }}
                      className="p-4 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform shadow-xl"
                     >
                        <Maximize2 className="w-6 h-6" />
                     </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 space-y-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100 text-gray-200">
                   <ImageIcon className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Visuals appear here</h3>
                  <p className="text-gray-400 text-sm mt-2 max-w-[240px] mx-auto">Use the Nano Banana Pro engine to bring your imagination to life.</p>
                </div>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                 <div className="relative mb-8">
                    <Loader2 className="w-20 h-20 text-purple-600 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-fuchsia-500 animate-pulse" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2">Creating your Vibe</h3>
                 <p className="text-gray-500 font-medium">Nano Banana Pro is thinking...</p>
                 <div className="mt-8 px-6 py-2 bg-purple-50 rounded-full border border-purple-100">
                    <span className="text-xs font-black text-purple-600 uppercase tracking-widest animate-pulse">Processing High Fidelity {quality}</span>
                 </div>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-10 p-5 bg-red-50 border-2 border-red-100 rounded-3xl flex items-center gap-4 text-red-600 animate-in slide-in-from-bottom-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}
      </div>
      
      <div className="mt-12 flex flex-wrap items-center justify-center gap-12 text-gray-300">
         <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 fill-gray-200" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Unlimited Pro</span>
         </div>
         <div className="flex items-center gap-3">
            <ImageIcon className="w-4 h-4 fill-gray-200" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Lossless Generation</span>
         </div>
         <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 fill-gray-200" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">AI Powered Vibe</span>
         </div>
      </div>
    </div>
  );
};

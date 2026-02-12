
import React, { useState } from 'react';
import { Sparkles, Loader2, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Direct connection to Google via AI Studio identity provider
      if (typeof (window as any).aistudio !== 'undefined') {
        await (window as any).aistudio.openSelectKey();
        // Proceeding directly after selection
        onLogin();
      } else {
        // Fallback simulation for local testing
        setTimeout(() => {
          onLogin();
        }, 1200);
      }
    } catch (error) {
      console.error("Authentication failed", error);
      // Even if key picker is closed, we simulate login for the persona experience
      onLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-100/40 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-[2.5rem] mb-8 shadow-2xl shadow-gray-200 animate-in zoom-in duration-700">
             <h1 className="text-white text-4xl font-black italic tracking-tighter">VF</h1>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">VibeFlow.</h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xs mx-auto">
            The next generation of visual discovery, powered by Google Gemini.
          </p>
        </div>

        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-100 hover:border-gray-900 text-gray-900 py-5 px-6 rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 group overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <button
            onClick={() => onLogin()}
            className="w-full text-gray-400 font-bold text-xs uppercase tracking-[0.2em] py-4 hover:text-gray-900 transition-colors"
          >
            Guest Preview Mode
          </button>
        </div>

        <div className="mt-20 flex gap-8 items-center text-gray-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Gemini 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

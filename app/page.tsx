'use client';

import { useState, useRef, useEffect } from 'react';
import PresetSelector, { STYLES, COLORS, INDUSTRIES } from './components/PresetSelector';
import LogoPreview from './components/LogoPreview';
import { generateLogo } from './actions/generate';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [color, setColor] = useState('');
  const [industry, setIndustry] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<{prompt: string, logo: string}[]>([]);

  // Load session from localStorage on mount (optional persistent session across reloads)
  useEffect(() => {
    const savedSession = localStorage.getItem('logo-gen-session');
    if (savedSession) {
      setSessionId(savedSession);
      // We could ideally fetch previous logoUrl here via a server action,
      // but keeping it simple for now or fetch it from storage.
      const savedLogo = localStorage.getItem('logo-gen-last-url');
      if (savedLogo) setLogoUrl(savedLogo);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', style);
    formData.append('color', color);
    formData.append('industry', industry);
    if (sessionId) formData.append('sessionId', sessionId);

    const response = await generateLogo(formData);

    if (response.error) {
      setError(response.error);
      setLoading(false);
      return;
    }

    if (response.sessionId) {
      setSessionId(response.sessionId);
      localStorage.setItem('logo-gen-session', response.sessionId);
    }

    if (response.logoUrl) {
      setLogoUrl(response.logoUrl);
      localStorage.setItem('logo-gen-last-url', response.logoUrl);
      setHistory(prev => [...prev, { prompt, logo: response.logoUrl! }]);
    }
    
    setPrompt('');
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Left Sidebar / Form */}
      <div className="w-1/3 p-8 border-r border-gray-200 bg-white flex flex-col h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Logo Generator</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Describe your business, and we'll instantly generate a clean, minimal PNG logo. Add follow-up prompts to refine it.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-shadow min-h-[120px]"
              placeholder={
                history.length > 0
                  ? "Refine your logo (e.g., 'Make it more minimal', 'Try a geometric logo instead')"
                  : "e.g., A minimalist logo for a coffee shop named 'Brewed', featuring a simple cup icon."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <PresetSelector label="Style" options={STYLES} value={style} onChange={setStyle} />
            <PresetSelector label="Color" options={COLORS} value={color} onChange={setColor} />
            <PresetSelector label="Industry" options={INDUSTRIES} value={industry} onChange={setIndustry} />
          </div>

          <div className="mt-auto pt-6">
            {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Generating...' : history.length > 0 ? 'Refine Logo ->' : 'Generate Logo ->'}
            </button>
          </div>
        </form>

        {history.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Session History</h3>
            <ul className="space-y-3 text-sm flex flex-col-reverse">
              {history.map((h, i) => (
                <li key={i} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-800 font-medium">"{h.prompt}"</span>
                  <div className="h-16 w-16 bg-white border border-gray-200 rounded-md overflow-hidden relative shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.logo} alt={`History ${i}`} className="w-full h-full object-contain p-1" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Preview Area */}
      <div className="w-2/3 bg-gray-100/50 relative overflow-hidden flex flex-col">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 flex-grow p-12">
          <LogoPreview logoUrl={logoUrl} loading={loading} />
        </div>
      </div>
    </main>
  );
}


import React, { useState, useRef, useEffect } from 'react';
import { Feature, AnalysisResult, RiskLevel } from '../types';
import { analyzeContent } from '../geminiService';

interface AnalysisModuleProps {
  feature: Feature;
  isComfortMode?: boolean;
  onResult: (res: AnalysisResult, input: string) => void;
  onReport: (input: string) => void;
}

const AnalysisModule: React.FC<AnalysisModuleProps> = ({ feature, isComfortMode, onResult, onReport }) => {
  const [input, setInput] = useState(''); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasTakenAction, setHasTakenAction] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleReset();
  }, [feature]);

  const handleReset = () => {
    setInput('');
    setPhoneNumber('');
    setImage(null);
    setResult(null);
    setError(null);
    setHasTakenAction(false);
  };

  const isClearVisible = input.trim() !== '' || phoneNumber.trim() !== '' || image !== null || result !== null;

  const getRiskLabel = (level: RiskLevel): string => {
    if (feature === Feature.PAYMENT_PROOF) {
      if (level === 'Safe') return 'Genuine';
      if (level === 'Suspicious') return 'Verification Needed';
      return 'Tampered / Fake';
    }
    return level;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    let finalAnalysisInput = input;

    if (feature === Feature.PHONE) {
      if (!phoneNumber.trim() || !input.trim()) return;
      finalAnalysisInput = `Phone: ${phoneNumber} | Context: ${input}`;
    }

    if (!finalAnalysisInput && feature !== Feature.SCREENSHOT && feature !== Feature.PAYMENT_PROOF) return;
    if ((feature === Feature.SCREENSHOT || feature === Feature.PAYMENT_PROOF) && !image) {
      setError("Please upload the required screenshot to proceed.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeContent(feature, finalAnalysisInput, image || undefined);
      setResult(data);
      onResult(data, finalAnalysisInput || (feature === Feature.PAYMENT_PROOF ? 'Payment Verification' : 'Image Scan'));
    } catch (err: any) {
      setError(err.message || "Failed to analyze content. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = () => {
    if (hasTakenAction) return;
    setHasTakenAction(true);
    onReport(input || 'Screenshot');
  };

  return (
    <div className="max-w-4xl flex flex-col space-y-6 pb-20">
      <div className={`p-10 rounded-[2.5rem] shadow-sm border transition-colors duration-500 ${isComfortMode ? 'bg-[#fffef7] border-[#f2ecd9]' : 'bg-white border-slate-100'}`}>
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-colors duration-500 ${isComfortMode ? 'bg-[#faf7e6] border-[#f2ecd9]' : 'bg-slate-50 border-slate-100'}`}>
              {feature === Feature.SMS && '💬'}
              {feature === Feature.LINK && '🔗'}
              {feature === Feature.PHONE && '📞'}
              {feature === Feature.SCREENSHOT && '📸'}
              {feature === Feature.PAYMENT_PROOF && '🧾'}
            </div>
            {feature === Feature.SMS ? 'SMS Analysis' : 
             feature === Feature.LINK ? 'Domain Verification' : 
             feature === Feature.PHONE ? 'Transaction Check' : 
             feature === Feature.PAYMENT_PROOF ? 'Proof Validation' : 'Visual Scanning'}
          </h2>
          
          {isClearVisible && (
            <button 
              onClick={handleReset}
              className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-1 group"
            >
              <span>Clear</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
            </button>
          )}
        </div>

        {(feature === Feature.SCREENSHOT || feature === Feature.PAYMENT_PROOF) && (
          <div className="mb-8">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`w-full h-52 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all group overflow-hidden ${isComfortMode ? 'bg-[#faf7e6]/50 border-[#f2ecd9] hover:border-blue-300' : 'bg-slate-50/30 border-slate-100 hover:bg-slate-50 hover:border-blue-200'}`}
            >
              {image ? (
                <img src={image} alt="Preview" className="h-full w-full object-contain p-6" />
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-3 opacity-60">📤</div>
                  <span className="block text-slate-700 font-bold text-sm uppercase tracking-wider">Select Screenshot</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Supports PNG, JPG (Max 5MB)</p>
                </div>
              )}
            </button>
          </div>
        )}

        <div className="space-y-6">
          {feature === Feature.PHONE ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Sender Phone</label>
                <input
                  type="text"
                  className={`w-full px-5 py-4 border rounded-2xl focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold text-sm ${isComfortMode ? 'bg-[#faf7e6] border-[#f2ecd9]' : 'bg-slate-50 border-slate-100'}`}
                  placeholder="+91..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Fraud Description</label>
                <input
                  className={`w-full px-5 py-4 border rounded-2xl focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold text-sm ${isComfortMode ? 'bg-[#faf7e6] border-[#f2ecd9]' : 'bg-slate-50 border-slate-100'}`}
                  placeholder="What did they ask for?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                {feature === Feature.PAYMENT_PROOF ? 'Notes for AI Analysis' : 'Input Source Text'}
              </label>
              <textarea
                className={`w-full p-6 border rounded-[1.5rem] focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-sm leading-relaxed min-h-[140px] resize-none ${isComfortMode ? 'bg-[#faf7e6] border-[#f2ecd9] focus:bg-white' : 'bg-slate-50 border-slate-100 focus:bg-white'}`}
                placeholder={feature === Feature.SMS ? "Paste SMS content..." : feature === Feature.LINK ? "Enter URL..." : "Any extra details?"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || (feature === Feature.PHONE ? !input || !phoneNumber : (feature === Feature.SCREENSHOT || feature === Feature.PAYMENT_PROOF ? !image : !input))}
            className={`w-full py-5 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] uppercase tracking-[0.2em] ${
              loading ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
            }`}
          >
            {loading ? 'Processing Intelligence...' : 'Initiate Verification'}
          </button>
        </div>
      </div>

      {error && !result && (
        <div className={`border p-5 rounded-2xl flex gap-3 items-center animate-in zoom-in-95 ${isComfortMode ? 'bg-[#fff5f5] border-rose-200' : 'bg-rose-50 border-rose-100'}`}>
          <span className="text-rose-500 text-xl">⚠️</span>
          <p className="text-rose-700 font-semibold text-xs">{error}</p>
        </div>
      )}

      {result && (
        <div className={`p-10 rounded-[2.5rem] border animate-in slide-in-from-top-4 duration-500 shadow-xl transition-colors duration-500 ${
          result.risk_level === 'Safe' ? (isComfortMode ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-50/30 border-emerald-100') :
          result.risk_level === 'Suspicious' ? (isComfortMode ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-50/30 border-amber-100') :
          (isComfortMode ? 'bg-rose-50/50 border-rose-200' : 'bg-rose-50/30 border-rose-100')
        }`}>
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                result.risk_level === 'Safe' ? 'bg-emerald-600 text-white' :
                result.risk_level === 'Suspicious' ? 'bg-amber-500 text-white' :
                'bg-rose-600 text-white'
              }`}>
                {result.risk_level === 'Safe' ? '✓' : result.risk_level === 'Suspicious' ? '!' : '×'}
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">
                  Verdict: {getRiskLabel(result.risk_level)}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-widest uppercase">{result.confidence_score}% Confidence Score</p>
              </div>
            </div>
            <div className="flex gap-3">
              {result.risk_level === 'Scam' && (
                <button 
                  onClick={handleReportAction} 
                  disabled={hasTakenAction}
                  className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                    hasTakenAction ? 'bg-slate-200 text-slate-400' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100'
                  }`}
                >
                  {hasTakenAction ? 'Threat Reported' : 'Report Threat (+10)'}
                </button>
              )}
              <button 
                onClick={handleReset}
                className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all ${isComfortMode ? 'bg-slate-800 text-white hover:bg-black' : 'bg-slate-900 text-white hover:bg-black'}`}
              >
                Clear & Check Another
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-3xl border transition-colors duration-500 ${isComfortMode ? 'bg-white/80 border-[#f2ecd9]' : 'bg-white/60 border-white/50'}`}>
              <h4 className="font-bold text-slate-400 mb-5 uppercase text-[10px] tracking-[0.2em] opacity-80">Reasoning Engine</h4>
              <ul className="space-y-3">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex gap-3 text-slate-800">
                    <span className="text-blue-500 font-bold">•</span>
                    <span className="text-xs font-semibold leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-6 rounded-3xl border transition-colors duration-500 ${isComfortMode ? 'bg-white/80 border-[#f2ecd9]' : 'bg-white/60 border-white/50'}`}>
              <h4 className="font-bold text-slate-400 mb-5 uppercase text-[10px] tracking-[0.2em] opacity-80">Safety Recommendation</h4>
              <div className={`p-6 rounded-2xl text-white shadow-inner transition-colors duration-500 ${
                result.risk_level === 'Safe' ? 'bg-slate-800' :
                result.risk_level === 'Suspicious' ? 'bg-amber-600' :
                'bg-rose-800'
              }`}>
                <p className="text-xs font-semibold leading-relaxed italic text-center opacity-90">
                  "{result.recommendation}"
                </p>
              </div>
            </div>
          </div>
          
          {feature === Feature.PAYMENT_PROOF && (
             <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4 text-blue-600/60">
                <span className="text-xl">🛡️</span>
                <p className="text-[10px] font-bold uppercase tracking-wider">Verification assisted by Suraksha Shop Security Protocol</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisModule;

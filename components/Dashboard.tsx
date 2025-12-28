
import React, { useState } from 'react';
import { Feature, HistoryItem, AnalysisResult } from '../types';
import AnalysisModule from './AnalysisModule';

interface DashboardProps {
  user: string;
  rewardPoints: number;
  reportCount: number;
  history: HistoryItem[];
  onLogout: () => void;
  onAddHistory: (item: HistoryItem) => void;
  onAddReward: (input: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  rewardPoints, 
  reportCount,
  history, 
  onLogout, 
  onAddHistory,
  onAddReward
}) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false, // Acts as Eye Comfort Mode
    autoScan: false,
    biometrics: true
  });

  const featureCards = [
    { id: Feature.SMS, title: 'Message Analysis', icon: '💬', color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100', comfortColor: 'bg-indigo-50/40 text-indigo-700', comfortBorder: 'border-indigo-200/50', desc: 'Scan for fraudulent SMS text, phishing links, and fake bank alerts.' },
    { id: Feature.LINK, title: 'Link Analysis', icon: '🔗', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', comfortColor: 'bg-emerald-50/40 text-emerald-700', comfortBorder: 'border-emerald-200/50', desc: 'Verify URLs against known scam patterns and malicious redirects.' },
    { id: Feature.PHONE, title: 'Phone Check', icon: '📞', color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', comfortColor: 'bg-amber-50/40 text-amber-700', comfortBorder: 'border-amber-200/50', desc: 'Analyze phone numbers and payment scenarios for fraud risks.' },
    { id: Feature.SCREENSHOT, title: 'Screenshot Analysis', icon: '📸', color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', comfortColor: 'bg-rose-50/40 text-rose-700', comfortBorder: 'border-rose-200/50', desc: 'Extract and analyze text from images to detect hidden scam signals.' },
    { id: Feature.PAYMENT_PROOF, title: 'Payment Verification', icon: '🧾', color: 'bg-violet-50 text-violet-600', border: 'border-violet-100', comfortColor: 'bg-violet-50/40 text-violet-700', comfortBorder: 'border-violet-200/50', desc: 'Verify UPI and GPay screenshots to prevent payment manipulation.' }
  ];

  const handleFeatureClick = (feature: Feature) => {
    setShowSettings(false);
    setSelectedFeature(feature);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isComfort = settings.darkMode;

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${isComfort ? 'bg-[#fffdf2] text-slate-900' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. LEFT SIDEBAR: Navigation */}
      <aside className={`w-72 flex flex-col shrink-0 z-20 transition-colors duration-500 ${isComfort ? 'bg-slate-900' : 'bg-slate-900'} text-slate-300`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              🛡️
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight leading-none">SURAKSHA</h2>
              <p className="text-[9px] font-bold text-blue-400 tracking-widest uppercase mt-1">AI SCAM GUARD</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => { setSelectedFeature(null); setShowSettings(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${!selectedFeature && !showSettings ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
            >
              <span className="text-lg opacity-70">🏠</span> Home
            </button>
            <div className="pt-4 pb-2 px-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Modules</p>
            </div>
            {featureCards.map(f => (
              <button
                key={f.id}
                onClick={() => handleFeatureClick(f.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${selectedFeature === f.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
              >
                <span className="text-lg opacity-70">{f.icon}</span> {f.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1 border-t border-slate-800">
          <button 
            onClick={() => { setSelectedFeature(null); setShowSettings(true); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${showSettings ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
          >
            <span className="text-lg opacity-70">⚙️</span> Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all text-sm font-semibold"
          >
            <span className="text-lg opacity-70">🚪</span> Logout
          </button>
          <div className="px-4 py-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {user.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.split('@')[0]}</p>
                <p className="text-[9px] text-slate-500 truncate uppercase tracking-tighter">Active Agent</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTER MAIN CONTENT */}
      <main className={`flex-1 flex flex-col h-full overflow-y-auto transition-colors duration-500 ${isComfort ? 'bg-transparent' : 'bg-white/50 backdrop-blur-sm'}`}>
        <div className="p-10 max-w-6xl mx-auto w-full">
          {(selectedFeature || showSettings) && (
            <div className="mb-6">
               <button 
                  onClick={() => { setSelectedFeature(null); setShowSettings(false); }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition group text-sm"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                </button>
            </div>
          )}
          <header className="mb-10">
            <h1 className="text-3xl font-black tracking-tight">
              {showSettings ? 'Settings & Security' : selectedFeature ? featureCards.find(f => f.id === selectedFeature)?.title : 'System Overview'}
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {showSettings ? 'Manage your account and preferences.' : 'Advanced threat intelligence at your fingertips.'}
            </p>
          </header>

          {showSettings ? (
            <div className={`rounded-3xl border transition-colors duration-500 p-8 shadow-sm ${isComfort ? 'bg-[#fffef7] border-[#f2ecd9]' : 'bg-white border-slate-100'}`}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Security</h3>
                  {[{k:'notifications', l:'Live Alerts'}, {k:'biometrics', l:'Double Encryption'}].map(s => (
                    <div key={s.k} onClick={() => toggleSetting(s.k as any)} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors duration-300 ${isComfort ? 'bg-[#faf7e6] border-[#f2ecd9]' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="text-sm font-bold text-slate-700">{s.l}</span>
                      <div className={`w-10 h-5 rounded-full relative transition-all ${settings[s.k as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${settings[s.k as keyof typeof settings] ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Interface</h3>
                  {[{k:'darkMode', l:'Eye Comfort Mode'}, {k:'autoScan', l:'Auto-Scan Links'}].map(s => (
                    <div key={s.k} onClick={() => toggleSetting(s.k as any)} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors duration-300 ${isComfort ? 'bg-[#faf7e6] border-[#f2ecd9]' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="text-sm font-bold text-slate-700">{s.l}</span>
                      <div className={`w-10 h-5 rounded-full relative transition-all ${settings[s.k as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${settings[s.k as keyof typeof settings] ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedFeature ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <AnalysisModule 
                feature={selectedFeature} 
                isComfortMode={isComfort}
                onResult={(res, input) => {
                  onAddHistory({
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: Date.now(),
                    type: selectedFeature === Feature.PAYMENT_PROOF ? 'Payment Proof' : selectedFeature as any,
                    input,
                    result: res
                  });
                }}
                onReport={(input) => onAddReward(input)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featureCards.slice(0, 3).map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleFeatureClick(f.id)}
                    className={`group p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left min-h-[260px] flex flex-col ${isComfort ? 'bg-[#fffef7] border-[#f2ecd9]' : 'bg-white border-slate-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm border ${isComfort ? f.comfortColor + ' ' + f.comfortBorder : f.color + ' ' + f.border}`}>
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{f.desc}</p>
                    <div className="mt-auto text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Access Module <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                {featureCards.slice(3, 5).map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleFeatureClick(f.id)}
                    className={`group p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left min-h-[260px] md:w-[calc(33.333%-1rem)] flex flex-col ${isComfort ? 'bg-[#fffef7] border-[#f2ecd9]' : 'bg-white border-slate-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm border ${isComfort ? f.comfortColor + ' ' + f.comfortBorder : f.color + ' ' + f.border}`}>
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{f.desc}</p>
                    <div className="mt-auto text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Access Module <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. RIGHT PANEL: Dashboard Stats & History */}
      <aside className={`w-80 border-l flex flex-col shrink-0 h-screen overflow-y-auto transition-colors duration-500 ${isComfort ? 'bg-[#fffefc] border-[#f2ecd9]' : 'bg-white border-slate-100'}`}>
        <div className="p-8 h-full flex flex-col">
          <h2 className="text-xl font-black text-slate-900 mb-6">Dashboard</h2>
          
          {/* Section 1: Reward Points */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl mb-8 relative overflow-hidden shrink-0">
            <div className="relative z-10">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contributor Score</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black tracking-tighter">{rewardPoints}</span>
                <span className="text-blue-400 text-xs font-bold uppercase mb-2">PTS</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Suraksha Safety points</p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-2xl -mr-12 -mt-12 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-600/10 blur-xl -ml-10 -mb-10 rounded-full"></div>
          </div>

          {/* Section 2: History */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
              <span className="text-[10px] font-bold text-slate-300">{history.length}</span>
            </div>

            <div className="space-y-3 overflow-y-auto pb-4">
              {history.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-slate-300 uppercase italic">No recent logs</p>
                </div>
              ) : (
                history.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl border hover:shadow-md transition-all cursor-default ${isComfort ? 'bg-[#faf7e6] border-[#f2ecd9] hover:bg-white' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                        item.result.risk_level === 'Safe' ? 'bg-emerald-100 text-emerald-700' :
                        item.result.risk_level === 'Suspicious' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {item.result.risk_level}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-800 truncate">{item.type}: {item.input}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 3: Total Reported Scams (BOTTOM) */}
          <div className={`mt-auto pt-6 border-t ${isComfort ? 'border-[#f2ecd9]' : 'border-slate-100'}`}>
             <div className={`p-4 rounded-2xl border flex items-center justify-between ${isComfort ? 'bg-[#fff5f5] border-rose-200' : 'bg-rose-50 border-rose-100'}`}>
                <div>
                   <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Community Shield</p>
                   <p className={`text-xs font-black ${isComfort ? 'text-rose-800' : 'text-rose-700'}`}>Total Scams Reported: {reportCount}</p>
                </div>
                <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white text-lg">📢</div>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;

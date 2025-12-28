
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc] p-6 overflow-hidden">
      <div className="w-full max-w-lg p-12 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/30 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="text-center mb-12 relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-xl shadow-blue-100 animate-pulse">
            🛡️
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Security Access</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px] opacity-80">Enterprise Identity Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 opacity-70">Operator Identification</label>
            <input
              type="email"
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 text-slate-900 bg-slate-50/50 placeholder-slate-300 font-semibold text-base"
              placeholder="e.g. guard@suraksha.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 opacity-70">Secret Authentication Key</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 text-slate-900 bg-slate-50/50 placeholder-slate-300 font-semibold text-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-2"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              >
                {isPasswordVisible ? (
                  /* Open Eye Icon */
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  /* Closed Eye Icon (Eye Slash) */
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-sm uppercase tracking-[0.25em] mt-4"
          >
            Authenticate Portal
          </button>
        </form>
        
        <div className="mt-12 text-center relative z-10">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">Suraksha – Native Audio Intelligence v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

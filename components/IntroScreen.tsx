
import React from 'react';

const IntroScreen: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Animated Background Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-[1px] border-blue-50 rounded-full animate-ping duration-1000 opacity-20"></div>
        </div>
        
        <div className="w-32 h-32 mb-10 flex items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_20px_50px_rgba(37,99,235,0.3)] animate-bounce duration-1000">
           <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
            SURAKSHA
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-8 bg-blue-600 rounded-full"></div>
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.4em]">AI SCAM GUARD</p>
            <div className="h-[2px] w-8 bg-blue-600 rounded-full"></div>
          </div>
        </div>
        
        <div className="mt-16 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-[pulse_1s_infinite]"></div>
          <div className="w-1.5 h-1.5 bg-blue-600/60 rounded-full animate-[pulse_1s_infinite_200ms]"></div>
          <div className="w-1.5 h-1.5 bg-blue-600/30 rounded-full animate-[pulse_1s_infinite_400ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;

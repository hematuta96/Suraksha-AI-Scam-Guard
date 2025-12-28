
import React, { useState, useEffect, useRef } from 'react';
import { AppState, HistoryItem, RiskLevel } from './types';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.INTRO);
  const [user, setUser] = useState<string | null>(null);
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [reportCount, setReportCount] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Track inputs that have already been rewarded in this session
  const rewardedInputsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (currentScreen === AppState.INTRO) {
      const timer = setTimeout(() => {
        setCurrentScreen(AppState.LOGIN);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = (email: string) => {
    setUser(email);
    setCurrentScreen(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen(AppState.LOGIN);
  };

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 10));
    
    const inputKey = item.input.trim().toLowerCase();
    
    // Reward logic: Reject/Detect Scam +5 points ONLY ONCE per unique item
    if (item.result.risk_level === 'Scam' && inputKey) {
      if (!rewardedInputsRef.current.has(inputKey)) {
        setRewardPoints(prev => prev + 5);
        rewardedInputsRef.current.add(inputKey);
      }
    }
  };

  const handleReport = (input: string) => {
    const inputKey = input.trim().toLowerCase();
    const reportKey = `report_${inputKey}`;
    
    if (inputKey && !rewardedInputsRef.current.has(reportKey)) {
      setRewardPoints(prev => prev + 10);
      setReportCount(prev => prev + 1);
      rewardedInputsRef.current.add(reportKey);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 text-gray-900">
      {currentScreen === AppState.INTRO && <IntroScreen />}
      {currentScreen === AppState.LOGIN && <LoginScreen onLogin={handleLogin} />}
      {currentScreen === AppState.DASHBOARD && user && (
        <Dashboard 
          user={user} 
          rewardPoints={rewardPoints} 
          reportCount={reportCount}
          history={history}
          onLogout={handleLogout}
          onAddHistory={addHistory}
          onAddReward={handleReport}
        />
      )}
    </div>
  );
};

export default App;

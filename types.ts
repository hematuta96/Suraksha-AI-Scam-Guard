
export type RiskLevel = 'Safe' | 'Suspicious' | 'Scam';

export interface AnalysisResult {
  risk_level: RiskLevel;
  confidence_score: number;
  reasons: string[];
  recommendation: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'SMS' | 'Link' | 'Phone' | 'Screenshot' | 'Payment Proof';
  input: string;
  result: AnalysisResult;
}

export enum AppState {
  INTRO = 'INTRO',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum Feature {
  SMS = 'SMS',
  LINK = 'LINK',
  PHONE = 'PHONE',
  SCREENSHOT = 'SCREENSHOT',
  PAYMENT_PROOF = 'PAYMENT_PROOF'
}

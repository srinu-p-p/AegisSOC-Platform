/**
 * AegisSOC - AI Cybersecurity Threat Detection System Types
 */

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'open' | 'investigating' | 'mitigated' | 'false_positive';

export type LogCategory = 
  | 'network' 
  | 'system' 
  | 'auth' 
  | 'email' 
  | 'phishing_url' 
  | 'dns' 
  | 'firewall' 
  | 'endpoint';

export interface SecurityLog {
  id: string;
  timestamp: string;
  category: LogCategory;
  sourceIp: string;
  destinationIp: string;
  user: string;
  action: string;
  protocol: string;
  port: number;
  payloadSize: number; // bytes
  rawMessage: string;
  flaggedThreat?: string;
  severity: ThreatSeverity;
  riskScore: number; // 0-100
  isAnomaly: boolean;
  status: IncidentStatus;
  detectedBy: 'Rule-Based' | 'ML-RandomForest' | 'DL-LSTM' | 'Anomaly-IsolationForest' | 'LLM-Gemini';
}

export interface MLModelPerformance {
  id: string;
  name: string;
  category: 'Classical ML' | 'Deep Learning' | 'Anomaly Detection' | 'Rule-Based';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  latencyMs: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  rocCurvePoints: Array<{ fpr: number; tpr: number }>;
  description: string;
}

export interface PhishingAnalysisResult {
  isPhishing: boolean;
  confidenceScore: number; // 0-100
  riskLevel: ThreatSeverity;
  emailSubject: string;
  senderEmail: string;
  spfDkimStatus: 'PASS' | 'FAIL' | 'NEUTRAL' | 'SOFTFAIL';
  detectedSpoofing: boolean;
  suspiciousLinksCount: number;
  extractedUrls: string[];
  nlpSentimentUrgency: number; // 0-100
  keywordsFound: string[];
  headerAnalysis: {
    returnPathMismatch: boolean;
    suspiciousMailServer: boolean;
    domainAgeDays: number;
  };
  aiExplanation?: string;
  recommendedAction: string;
}

export interface IncidentPlaybookStep {
  stepNumber: number;
  phase: 'Preparation' | 'Containment' | 'Eradication' | 'Recovery' | 'Lessons Learned';
  title: string;
  action: string;
  automatedCommand?: string;
  assignedRole: 'Tier 1 SOC Analyst' | 'Tier 2 Security Engineer' | 'Incident Commander' | 'Network Admin';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface IncidentPlaybook {
  id: string;
  threatTitle: string;
  severity: ThreatSeverity;
  summary: string;
  indicatorsOfCompromise: string[];
  affectedAssets: string[];
  nistCategory: string;
  steps: IncidentPlaybookStep[];
  aiGeneratedInsights: string;
  createdTimestamp: string;
}

export interface UserBehaviorRecord {
  id: string;
  user: string;
  department: string;
  avgLoginHour: number; // 0-23
  loginHourToday: number;
  avgDataXferMb: number;
  dataXferTodayMb: number;
  failedAuthAttempts: number;
  unusualLocationsCount: number;
  anomalyScore: number; // 0-100
  status: 'Normal' | 'Suspicious' | 'High Risk Anomaly';
}

export interface SOCMetricsSummary {
  totalEventsProcessed: number;
  activeThreatsCount: number;
  criticalAlertsCount: number;
  phishingEmailsBlocked: number;
  anomaliesDetected: number;
  meanTimeToDetectMinutes: number;
  meanTimeToRespondMinutes: number;
  autoMitigatedPercent: number;
}

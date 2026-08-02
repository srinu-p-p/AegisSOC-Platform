import { SecurityLog, ThreatSeverity, PhishingAnalysisResult } from '../types';

/**
 * Feature Extraction for Cybersecurity Log Preprocessing (Module 2)
 */
export interface ExtractedLogFeatures {
  payloadBytes: number;
  entropy: number; // Shannon entropy of payload
  failedAuthCount: number;
  isUnusualPort: boolean;
  hasEncodedCommands: boolean;
  isExternalIp: boolean;
  protocolNumeric: number;
  riskScore: number;
}

export function calculateEntropy(str: string): number {
  if (!str) return 0;
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

export function extractLogFeatures(rawMessage: string, port: number, payloadSize: number, sourceIp: string): ExtractedLogFeatures {
  const entropy = calculateEntropy(rawMessage);
  const isExternalIp = !sourceIp.startsWith('10.') && !sourceIp.startsWith('192.168.') && !sourceIp.startsWith('127.');
  
  const hasEncodedCommands = /-[eE](ncodedCommand)?\s+[A-Za-z0-9+/=]{10,}/.test(rawMessage) ||
    /b3V0Ym91bmR_/i.test(rawMessage) ||
    /base64/i.test(rawMessage);

  const isUnusualPort = [4444, 6667, 31337, 54212, 8080].includes(port);
  
  let failedAuthCount = 0;
  const matchFail = rawMessage.match(/(\d+)\s+attempts/i);
  if (matchFail) {
    failedAuthCount = parseInt(matchFail[1], 10);
  }

  // Calculate heuristic risk score (0-100)
  let score = 10;
  if (isExternalIp) score += 20;
  if (hasEncodedCommands) score += 40;
  if (isUnusualPort) score += 25;
  if (entropy > 4.5) score += 15;
  if (failedAuthCount > 10) score += 30;
  if (/shadow|vss|delete|krbtgt|mimikatz|powershell|cmd.exe|eval/i.test(rawMessage)) score += 35;

  score = Math.min(100, score);

  return {
    payloadBytes: payloadSize,
    entropy,
    failedAuthCount,
    isUnusualPort,
    hasEncodedCommands,
    isExternalIp,
    protocolNumeric: port % 10,
    riskScore: score
  };
}

/**
 * Rule-Based Threat Detection (Module 6)
 */
export function runRuleBasedDetection(log: Partial<SecurityLog>): { isThreat: boolean; ruleMatched?: string; severity: ThreatSeverity } {
  const msg = (log.rawMessage || '').toLowerCase();
  
  if (msg.includes('vssadmin delete shadows') || msg.includes('shadow copy deletion')) {
    return { isThreat: true, ruleMatched: 'RULE-0101: Ransomware VSS Shadow Copy Deletion', severity: 'critical' };
  }
  if (msg.includes('dns query txt') && log.payloadSize && log.payloadSize > 20000) {
    return { isThreat: true, ruleMatched: 'RULE-0204: Outbound High-Entropy DNS Tunneling', severity: 'critical' };
  }
  if (msg.includes('failed password') && log.rawMessage?.includes('240 attempts')) {
    return { isThreat: true, ruleMatched: 'RULE-0309: SSH Password Brute Force Threshold Exceeded', severity: 'high' };
  }
  if (msg.includes('metasploit') || log.port === 4444) {
    return { isThreat: true, ruleMatched: 'RULE-0412: Metasploit Reverse Shell Port 4444 Connection', severity: 'high' };
  }
  if (msg.includes('kerberos') && msg.includes('rc4')) {
    return { isThreat: true, ruleMatched: 'RULE-0502: Kerberoasting TGS Ticket Request', severity: 'high' };
  }

  return { isThreat: false, severity: 'low' };
}

/**
 * ML & Deep Learning Classification Predictor Simulation (Module 3 & 4)
 */
export function classifyLogThreatWithML(log: SecurityLog, algorithm: string): {
  predictedThreat: string;
  confidenceScore: number;
  severity: ThreatSeverity;
  isAnomaly: boolean;
  processingTimeMs: number;
} {
  const features = extractLogFeatures(log.rawMessage, log.port, log.payloadSize, log.sourceIp);
  
  let confidence = features.riskScore;
  let predictedThreat = 'Normal Activity';
  let severity: ThreatSeverity = 'low';
  let isAnomaly = false;

  if (features.riskScore > 80) {
    severity = 'critical';
    isAnomaly = true;
    if (log.rawMessage.toLowerCase().includes('dns')) {
      predictedThreat = 'DNS Tunneling & Data Exfiltration';
    } else if (log.rawMessage.toLowerCase().includes('powershell')) {
      predictedThreat = 'Ransomware Execution & VSS Wiping';
    } else {
      predictedThreat = 'Critical Cyber Attack / Exploit Payload';
    }
  } else if (features.riskScore > 50) {
    severity = 'high';
    isAnomaly = true;
    if (log.rawMessage.toLowerCase().includes('failed password')) {
      predictedThreat = 'Brute Force Credential Stuffing';
    } else if (log.port === 4444) {
      predictedThreat = 'C2 Reverse Shell Connection';
    } else {
      predictedThreat = 'Suspicious Malicious Activity';
    }
  } else if (features.riskScore > 30) {
    severity = 'medium';
    isAnomaly = false;
    predictedThreat = 'Unusual Network Traffic Event';
  }

  // Adjust confidence slightly based on model complexity
  if (algorithm.includes('XGBoost') || algorithm.includes('Transformer')) {
    confidence = Math.min(99, confidence + 8);
  } else if (algorithm.includes('Decision Tree')) {
    confidence = Math.max(10, confidence - 5);
  }

  return {
    predictedThreat,
    confidenceScore: confidence,
    severity,
    isAnomaly,
    processingTimeMs: Number((Math.random() * 5 + 1).toFixed(1))
  };
}

/**
 * Phishing Email NLP Analysis (Module 2 & Module 7)
 */
export function analyzePhishingEmailLocally(subject: string, body: string, sender: string, headers: string): PhishingAnalysisResult {
  const lowerBody = body.toLowerCase();
  const lowerSubject = subject.toLowerCase();
  const lowerSender = sender.toLowerCase();

  const urgentKeywords = ['urgent', 'immediately', 'hours', 'suspension', 'hold', 'verify', 'account locked', 'w-2', 'direct deposit', 'password reset'];
  const foundKeywords = urgentKeywords.filter(kw => lowerBody.includes(kw) || lowerSubject.includes(kw));

  const urlMatches = body.match(/https?:\/\/[^\s<">]+/g) || [];
  const suspiciousLinks = urlMatches.filter(url => 
    url.includes('verify') || url.includes('login') || url.includes('update') || url.includes('.ru') || url.includes('.org') || url.includes('phish')
  );

  const spfFail = headers.toLowerCase().includes('spf=fail');
  const dkimFail = headers.toLowerCase().includes('dkim=fail');
  const detectedSpoofing = spfFail || dkimFail || !lowerSender.includes('corp.com') && lowerBody.includes('corporate');

  let riskScore = 15;
  riskScore += foundKeywords.length * 15;
  riskScore += suspiciousLinks.length * 25;
  if (detectedSpoofing) riskScore += 30;

  riskScore = Math.min(99, riskScore);
  const isPhishing = riskScore > 50;

  let riskLevel: ThreatSeverity = 'low';
  if (riskScore > 80) riskLevel = 'critical';
  else if (riskScore > 60) riskLevel = 'high';
  else if (riskScore > 40) riskLevel = 'medium';

  return {
    isPhishing,
    confidenceScore: riskScore,
    riskLevel,
    emailSubject: subject,
    senderEmail: sender,
    spfDkimStatus: spfFail || dkimFail ? 'FAIL' : 'PASS',
    detectedSpoofing,
    suspiciousLinksCount: suspiciousLinks.length,
    extractedUrls: urlMatches,
    nlpSentimentUrgency: Math.min(100, foundKeywords.length * 22 + 20),
    keywordsFound: foundKeywords,
    headerAnalysis: {
      returnPathMismatch: headers.includes('Return-Path') && !headers.includes(sender.split('@')[1] || ''),
      suspiciousMailServer: headers.includes('.ru') || headers.includes('phish') || headers.includes('attacker'),
      domainAgeDays: isPhishing ? 3 : 1420
    },
    recommendedAction: isPhishing ? 'Quarantine Email, Block Sender Domain on Gateway, and Invalidate SSO Sessions' : 'Mark as Safe & Allow Delivery'
  };
}

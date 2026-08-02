import { SecurityLog, MLModelPerformance, UserBehaviorRecord, SOCMetricsSummary, IncidentPlaybook } from '../types';

export const INITIAL_SOC_METRICS: SOCMetricsSummary = {
  totalEventsProcessed: 1485920,
  activeThreatsCount: 14,
  criticalAlertsCount: 3,
  phishingEmailsBlocked: 482,
  anomaliesDetected: 37,
  meanTimeToDetectMinutes: 1.4,
  meanTimeToRespondMinutes: 4.8,
  autoMitigatedPercent: 88.5,
};

export const MOCK_SECURITY_LOGS: SecurityLog[] = [
  {
    id: 'LOG-89201',
    timestamp: '2026-08-02T01:42:15Z',
    category: 'auth',
    sourceIp: '185.220.101.4',
    destinationIp: '10.0.4.12',
    user: 'admin_exec',
    action: 'SSH_LOGIN_FAILED_MULTIPLE',
    protocol: 'SSH',
    port: 22,
    payloadSize: 1024,
    rawMessage: 'Failed password for invalid user admin_exec from 185.220.101.4 port 54212 ssh2 - 240 attempts in 30s',
    flaggedThreat: 'Brute Force SSH Credential Stuffing',
    severity: 'high',
    riskScore: 84,
    isAnomaly: true,
    status: 'investigating',
    detectedBy: 'ML-RandomForest'
  },
  {
    id: 'LOG-89202',
    timestamp: '2026-08-02T01:41:02Z',
    category: 'network',
    sourceIp: '10.0.12.88',
    destinationIp: '198.51.100.99',
    user: 'j_smith_dev',
    action: 'EXCESSIVE_DNS_TXT_QUERY',
    protocol: 'DNS',
    port: 53,
    payloadSize: 64200,
    rawMessage: 'DNS Query TXT b3V0Ym91bmRfY3J5cHRvX2tleXNfZXhmaWx0cmF0aW9u.attacker-c2.net - High payload entropy 4.98',
    flaggedThreat: 'DNS Tunneling / Data Exfiltration',
    severity: 'critical',
    riskScore: 96,
    isAnomaly: true,
    status: 'open',
    detectedBy: 'DL-LSTM'
  },
  {
    id: 'LOG-89203',
    timestamp: '2026-08-02T01:39:48Z',
    category: 'email',
    sourceIp: '209.85.220.41',
    destinationIp: '10.0.1.5',
    user: 'finance_payroll@corp.com',
    action: 'EMAIL_INBOUND_RECEIVED',
    protocol: 'SMTP',
    port: 25,
    payloadSize: 14200,
    rawMessage: 'From: hr-update@payroll-verif-secure-portal.com | Subject: URGENT: Mandatory W-2 Verification Required immediately',
    flaggedThreat: 'Spear Phishing / CEO Fraud Impersonation',
    severity: 'critical',
    riskScore: 92,
    isAnomaly: true,
    status: 'investigating',
    detectedBy: 'LLM-Gemini'
  },
  {
    id: 'LOG-89204',
    timestamp: '2026-08-02T01:36:11Z',
    category: 'endpoint',
    sourceIp: '10.0.8.45',
    destinationIp: '127.0.0.1',
    user: 'm_rodriguez',
    action: 'PROCESS_SPAWN_POWERSHELL_ENCODED',
    protocol: 'SYSTEM',
    port: 0,
    payloadSize: 4096,
    rawMessage: 'powershell.exe -e a3lsbCB2c3NfYWRtaW4gZGVsZXRlIHNoYWRvd3MgL2FsbA== (Shadow copy deletion command detected)',
    flaggedThreat: 'Ransomware Preparation (VSS Shadow Copy Wiping)',
    severity: 'critical',
    riskScore: 99,
    isAnomaly: true,
    status: 'open',
    detectedBy: 'Rule-Based'
  },
  {
    id: 'LOG-89205',
    timestamp: '2026-08-02T01:32:00Z',
    category: 'firewall',
    sourceIp: '10.0.2.14',
    destinationIp: '45.33.32.156',
    user: 'system_svc',
    action: 'OUTBOUND_CONN_SUSPICIOUS_PORT',
    protocol: 'TCP',
    port: 4444,
    payloadSize: 8120,
    rawMessage: 'Outbound TCP connection to known Metasploit reverse shell default port 4444 from internal domain controller',
    flaggedThreat: 'Reverse Shell C2 Beaconing',
    severity: 'high',
    riskScore: 88,
    isAnomaly: true,
    status: 'investigating',
    detectedBy: 'Anomaly-IsolationForest'
  },
  {
    id: 'LOG-89206',
    timestamp: '2026-08-02T01:28:40Z',
    category: 'system',
    sourceIp: '10.0.4.102',
    destinationIp: '10.0.4.1',
    user: 'a_chen_analyst',
    action: 'KERBEROS_TICKET_REQUEST_SPN',
    protocol: 'Kerberos',
    port: 88,
    payloadSize: 2048,
    rawMessage: 'TGS request for service krbtgt/CORP with RC4 encryption requested - Potential Kerberoasting attack',
    flaggedThreat: 'Kerberoasting Active Directory Attack',
    severity: 'high',
    riskScore: 81,
    isAnomaly: true,
    status: 'open',
    detectedBy: 'ML-RandomForest'
  },
  {
    id: 'LOG-89207',
    timestamp: '2026-08-02T01:20:12Z',
    category: 'network',
    sourceIp: '10.0.1.15',
    destinationIp: '10.0.1.1',
    user: 'sysadmin',
    action: 'HTTP_GET_API_HEALTH',
    protocol: 'HTTP',
    port: 80,
    payloadSize: 320,
    rawMessage: 'GET /api/v1/health HTTP/1.1 200 OK - Standard monitoring check',
    flaggedThreat: 'None (Normal Traffic)',
    severity: 'low',
    riskScore: 4,
    isAnomaly: false,
    status: 'mitigated',
    detectedBy: 'Rule-Based'
  },
  {
    id: 'LOG-89208',
    timestamp: '2026-08-02T01:15:05Z',
    category: 'phishing_url',
    sourceIp: '10.0.9.12',
    destinationIp: '104.21.82.11',
    user: 'e_watson_sales',
    action: 'HTTP_POST_FORM_CREDENTIALS',
    protocol: 'HTTPS',
    port: 443,
    payloadSize: 1240,
    rawMessage: 'POST https://login.microsoftonline.corp-auth-verify.com/login.php with password input payload',
    flaggedThreat: 'Credential Harvesting Phishing Site',
    severity: 'high',
    riskScore: 89,
    isAnomaly: true,
    status: 'mitigated',
    detectedBy: 'LLM-Gemini'
  }
];

export const MOCK_ML_MODELS_PERFORMANCE: MLModelPerformance[] = [
  {
    id: 'mod-lr',
    name: 'Logistic Regression',
    category: 'Classical ML',
    accuracy: 0.884,
    precision: 0.862,
    recall: 0.851,
    f1Score: 0.856,
    rocAuc: 0.892,
    falsePositiveRate: 0.082,
    falseNegativeRate: 0.149,
    latencyMs: 1.2,
    description: 'Fast, linear decision boundary model. High interpretability, best for standard statistical baseline.',
    confusionMatrix: { tp: 851, fp: 82, tn: 918, fn: 149 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.05, tpr: 0.62 },
      { fpr: 0.082, tpr: 0.851 },
      { fpr: 0.15, tpr: 0.92 },
      { fpr: 0.30, tpr: 0.96 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-dt',
    name: 'Decision Tree',
    category: 'Classical ML',
    accuracy: 0.912,
    precision: 0.895,
    recall: 0.888,
    f1Score: 0.891,
    rocAuc: 0.915,
    falsePositiveRate: 0.064,
    falseNegativeRate: 0.112,
    latencyMs: 1.8,
    description: 'Hierarchical rule-tree classifier. Fast evaluation, slight vulnerability to overfitting on log noise.',
    confusionMatrix: { tp: 888, fp: 64, tn: 936, fn: 112 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.03, tpr: 0.70 },
      { fpr: 0.064, tpr: 0.888 },
      { fpr: 0.12, tpr: 0.94 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-rf',
    name: 'Random Forest (Ensemble)',
    category: 'Classical ML',
    accuracy: 0.968,
    precision: 0.961,
    recall: 0.954,
    f1Score: 0.957,
    rocAuc: 0.981,
    falsePositiveRate: 0.024,
    falseNegativeRate: 0.046,
    latencyMs: 4.5,
    description: 'Ensemble of bagged decision trees. Excellent balance of precision, accuracy, and noise tolerance.',
    confusionMatrix: { tp: 954, fp: 24, tn: 976, fn: 46 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.01, tpr: 0.82 },
      { fpr: 0.024, tpr: 0.954 },
      { fpr: 0.05, tpr: 0.985 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-xgb',
    name: 'XGBoost (Gradient Boosted)',
    category: 'Classical ML',
    accuracy: 0.982,
    precision: 0.979,
    recall: 0.972,
    f1Score: 0.975,
    rocAuc: 0.992,
    falsePositiveRate: 0.012,
    falseNegativeRate: 0.028,
    latencyMs: 6.1,
    description: 'State-of-the-art gradient boosted trees. Top performer for tabular network feature datasets.',
    confusionMatrix: { tp: 972, fp: 12, tn: 988, fn: 28 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.005, tpr: 0.90 },
      { fpr: 0.012, tpr: 0.972 },
      { fpr: 0.03, tpr: 0.995 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-mlp',
    name: 'Multilayer Perceptron (MLP)',
    category: 'Deep Learning',
    accuracy: 0.951,
    precision: 0.942,
    recall: 0.938,
    f1Score: 0.940,
    rocAuc: 0.969,
    falsePositiveRate: 0.035,
    falseNegativeRate: 0.062,
    latencyMs: 8.4,
    description: 'Deep feedforward neural net with ReLU & BatchNorm. Learns non-linear feature cross-correlations.',
    confusionMatrix: { tp: 938, fp: 35, tn: 965, fn: 62 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.015, tpr: 0.78 },
      { fpr: 0.035, tpr: 0.938 },
      { fpr: 0.08, tpr: 0.975 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-lstm',
    name: 'LSTM (Sequential Log Net)',
    category: 'Deep Learning',
    accuracy: 0.976,
    precision: 0.971,
    recall: 0.969,
    f1Score: 0.970,
    rocAuc: 0.989,
    falsePositiveRate: 0.018,
    falseNegativeRate: 0.031,
    latencyMs: 14.2,
    description: 'Bidirectional Recurrent Neural Network for temporal log sequences (e.g., multi-stage APTs & SSH brute force).',
    confusionMatrix: { tp: 969, fp: 18, tn: 982, fn: 31 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.008, tpr: 0.88 },
      { fpr: 0.018, tpr: 0.969 },
      { fpr: 0.04, tpr: 0.991 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-transformer',
    name: 'Transformer (Log-BERT Architecture)',
    category: 'Deep Learning',
    accuracy: 0.989,
    precision: 0.988,
    recall: 0.985,
    f1Score: 0.986,
    rocAuc: 0.997,
    falsePositiveRate: 0.008,
    falseNegativeRate: 0.015,
    latencyMs: 22.0,
    description: 'Self-attention transformer model fine-tuned on system audit logs & packet syntax for zero-day threat recognition.',
    confusionMatrix: { tp: 985, fp: 8, tn: 992, fn: 15 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.002, tpr: 0.94 },
      { fpr: 0.008, tpr: 0.985 },
      { fpr: 0.02, tpr: 0.998 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-iforest',
    name: 'Isolation Forest',
    category: 'Anomaly Detection',
    accuracy: 0.938,
    precision: 0.912,
    recall: 0.920,
    f1Score: 0.916,
    rocAuc: 0.952,
    falsePositiveRate: 0.048,
    falseNegativeRate: 0.080,
    latencyMs: 3.2,
    description: 'Unsupervised tree isolation algorithm. Identifies statistical outliers and zero-day anomalous behaviors without labels.',
    confusionMatrix: { tp: 920, fp: 48, tn: 952, fn: 80 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.02, tpr: 0.72 },
      { fpr: 0.048, tpr: 0.920 },
      { fpr: 0.10, tpr: 0.96 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-autoencoder',
    name: 'Deep Autoencoder Reconstruction',
    category: 'Anomaly Detection',
    accuracy: 0.962,
    precision: 0.951,
    recall: 0.948,
    f1Score: 0.949,
    rocAuc: 0.978,
    falsePositiveRate: 0.028,
    falseNegativeRate: 0.052,
    latencyMs: 11.5,
    description: 'Unsupervised bottleneck neural net. Flags logs with high reconstruction loss as suspicious behavior.',
    confusionMatrix: { tp: 948, fp: 28, tn: 972, fn: 52 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.012, tpr: 0.81 },
      { fpr: 0.028, tpr: 0.948 },
      { fpr: 0.06, tpr: 0.982 },
      { fpr: 1, tpr: 1 }
    ]
  },
  {
    id: 'mod-rules',
    name: 'Legacy Rule-Based Engine (SIEM Signatures)',
    category: 'Rule-Based',
    accuracy: 0.812,
    precision: 0.945,
    recall: 0.680,
    f1Score: 0.791,
    rocAuc: 0.810,
    falsePositiveRate: 0.025,
    falseNegativeRate: 0.320,
    latencyMs: 0.8,
    description: 'Hardcoded Regex & Snort/YARA signatures. High precision for known attacks, but misses obfuscated & zero-day attacks (high false negatives).',
    confusionMatrix: { tp: 680, fp: 25, tn: 975, fn: 320 },
    rocCurvePoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.025, tpr: 0.680 },
      { fpr: 1, tpr: 1 }
    ]
  }
];

export const MOCK_USER_BEHAVIOR: UserBehaviorRecord[] = [
  {
    id: 'usr-101',
    user: 'd_miller_exec',
    department: 'Executive Board',
    avgLoginHour: 9,
    loginHourToday: 3, // 3 AM!
    avgDataXferMb: 45,
    dataXferTodayMb: 8420, // 8.4 GB exfiltration
    failedAuthAttempts: 1,
    unusualLocationsCount: 3,
    anomalyScore: 92,
    status: 'High Risk Anomaly'
  },
  {
    id: 'usr-102',
    user: 'j_smith_dev',
    department: 'Software Engineering',
    avgLoginHour: 10,
    loginHourToday: 11,
    avgDataXferMb: 620,
    dataXferTodayMb: 710,
    failedAuthAttempts: 0,
    unusualLocationsCount: 0,
    anomalyScore: 12,
    status: 'Normal'
  },
  {
    id: 'usr-103',
    user: 'm_rodriguez',
    department: 'FinTech DevOps',
    avgLoginHour: 8,
    loginHourToday: 2,
    avgDataXferMb: 120,
    dataXferTodayMb: 3900,
    failedAuthAttempts: 8,
    unusualLocationsCount: 2,
    anomalyScore: 88,
    status: 'High Risk Anomaly'
  },
  {
    id: 'usr-104',
    user: 'e_watson_sales',
    department: 'Global Sales',
    avgLoginHour: 9,
    loginHourToday: 9,
    avgDataXferMb: 30,
    dataXferTodayMb: 180,
    failedAuthAttempts: 3,
    unusualLocationsCount: 1,
    anomalyScore: 48,
    status: 'Suspicious'
  },
  {
    id: 'usr-105',
    user: 'a_chen_analyst',
    department: 'SOC Analytics',
    avgLoginHour: 8,
    loginHourToday: 8,
    avgDataXferMb: 400,
    dataXferTodayMb: 420,
    failedAuthAttempts: 0,
    unusualLocationsCount: 0,
    anomalyScore: 8,
    status: 'Normal'
  }
];

export const SAMPLE_PHISHING_EMAILS = [
  {
    name: 'Executive Payroll Scam (Spear Phishing)',
    sender: 'hr-payroll@corp-verify-security-update.com',
    subject: 'CRITICAL URGENT: Update direct deposit details before 5 PM or payroll will fail',
    body: `Dear Employee,

We noticed an anomaly in your direct deposit bank account configuration for this month's payroll. 
To ensure your salary of $8,450.00 is credited on time without suspension, you must immediately verify your SSO credentials and banking details.

Please click the secure portal below within 2 hours:
http://corp-verify-security-update.com/sso/login?ref=payroll_urgent

Failure to do so will result in temporary payroll hold.

Best regards,
Corporate Human Resources Payroll Team`,
    headers: `Received: from mail-server-99.suspicious-node.ru (185.220.101.99)
Authentication-Results: spf=fail (sender IP 185.220.101.99 is not permitted)
DKIM-Signature: v=1; d=fake-domain.com; s=2026;
Return-Path: <bounce-collector@attacker-c2.net>`
  },
  {
    name: 'Microsoft 365 Password Reset Spoof',
    sender: 'no-reply@account-security-microsoftonline.net',
    subject: 'Security Alert: Unusual sign-in activity from Moscow, Russia',
    body: `Microsoft Security Team

Your Microsoft 365 account was accessed from an unrecognized device in Moscow, Russia (IP: 95.173.136.72).

If this was not you, please secure your account immediately by resetting your password:
https://login-microsoftonline-verify-portal.org/auth/reset

Time: August 2, 2026 01:22:10 AM UTC
Browser: Firefox on Linux x86_64`,
    headers: `Received: from mail-relay.phish-campaign.com (104.21.82.11)
Authentication-Results: dkim=fail header.i=@microsoft.com
Return-Path: <spoofed-m365@phish-campaign.com>`
  },
  {
    name: 'Legitimate System Notification (Clean Email)',
    sender: 'notifications@jira.internal-corp.net',
    subject: '[JIRA] Issue SOC-1049 assigned to you: Investigate DNS anomaly',
    body: `Hi Security Analyst,

Jira ticket SOC-1049 has been assigned to you by Alex Chen.

Summary: Investigate DNS TXT query volume from host 10.0.12.88
Priority: High
View issue: https://jira.internal-corp.net/browse/SOC-1049

Thank you,
Atlassian Jira Internal Service`,
    headers: `Received: from internal-mail.corp.net (10.0.1.5)
Authentication-Results: spf=pass dkim=pass
Return-Path: <notifications@jira.internal-corp.net>`
  }
];

export const MOCK_PLAYBOOKS: IncidentPlaybook[] = [
  {
    id: 'PB-2026-001',
    threatTitle: 'Ransomware & Shadow Copy Deletion (LOG-89204)',
    severity: 'critical',
    summary: 'Host 10.0.8.45 (m_rodriguez) executed an encoded PowerShell command attempting to purge VSS shadow copies and start file encryption.',
    indicatorsOfCompromise: [
      'Process: powershell.exe -e a3lsbCB2c3NfYWRtaW4...',
      'Command string: vssadmin delete shadows /all /quiet',
      'Source IP: 10.0.8.45',
      'Target file extension changes: .locked_aegis'
    ],
    affectedAssets: ['Workstation-FIN-0845', 'Internal User: m_rodriguez'],
    nistCategory: 'NIST SP 800-61 Rev 2 - Computer Security Incident Handling',
    createdTimestamp: '2026-08-02T01:37:00Z',
    aiGeneratedInsights: 'Gemini Threat Analysis: High certainty ransomware execution phase. Immediate host network isolation is mandatory before lateral movement via SMB (Port 445).',
    steps: [
      {
        stepNumber: 1,
        phase: 'Containment',
        title: 'Isolate Workstation from Local Subnet',
        action: 'Execute API call to endpoint EDR agent to sever all TCP/UDP connections except SOC management channel.',
        automatedCommand: 'aegis-cli endpoint isolate --host-id 10.0.8.45 --mode strict',
        assignedRole: 'Tier 1 SOC Analyst',
        status: 'pending'
      },
      {
        stepNumber: 2,
        phase: 'Containment',
        title: 'Block SMB/RDP Inbound/Outbound Rules',
        action: 'Push firewall rule to core router blocking ports 445, 139, and 3389 for host subnet 10.0.8.0/24.',
        automatedCommand: 'aegis-cli firewall block-ports --subnet 10.0.8.45 --ports 445,139,3389',
        assignedRole: 'Tier 2 Security Engineer',
        status: 'pending'
      },
      {
        stepNumber: 3,
        phase: 'Eradication',
        title: 'Terminate Suspicious PowerShell & Parent Processes',
        action: 'Kill process tree PID 4812 (PowerShell) and revoke Active Directory tokens for user m_rodriguez.',
        automatedCommand: 'aegis-cli user revoke-sessions --username m_rodriguez',
        assignedRole: 'Incident Commander',
        status: 'pending'
      },
      {
        stepNumber: 4,
        phase: 'Recovery',
        title: 'Restore System Snapshot from Immutable Backup',
        action: 'Initiate bare-metal restore from air-gapped immutable backup taken at 2026-08-01 22:00 UTC.',
        automatedCommand: 'aegis-cli backup restore --target Workstation-FIN-0845 --snapshot-id snap-89100',
        assignedRole: 'Network Admin',
        status: 'pending'
      }
    ]
  }
];

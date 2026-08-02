import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { SOCDashboard } from './components/SOCDashboard';
import { DataPipelineView } from './components/DataPipelineView';
import { MLClassifiersView } from './components/MLClassifiersView';
import { AnomalyDetectorView } from './components/AnomalyDetectorView';
import { PhishingAnalyzerView } from './components/PhishingAnalyzerView';
import { AIAssistantView } from './components/AIAssistantView';
import { EvaluationView } from './components/EvaluationView';
import { MitigationConsole } from './components/MitigationConsole';
import { DeliverablesHubView } from './components/DeliverablesHubView';
import { MOCK_SECURITY_LOGS, INITIAL_SOC_METRICS } from './data/mockSecurityData';
import { SecurityLog, SOCMetricsSummary, IncidentStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [logs, setLogs] = useState<SecurityLog[]>(MOCK_SECURITY_LOGS);
  const [metrics, setMetrics] = useState<SOCMetricsSummary>(INITIAL_SOC_METRICS);
  const [selectedLogForAI, setSelectedLogForAI] = useState<SecurityLog | null>(MOCK_SECURITY_LOGS[0] || null);
  const [mitigationInitialCommand, setMitigationInitialCommand] = useState<string>('');

  const threatLevel = logs.filter(l => l.severity === 'critical' && l.status === 'open').length > 0
    ? 'DEFCON 1 (CRITICAL)'
    : logs.filter(l => l.severity === 'high' && l.status === 'open').length > 0
    ? 'DEFCON 2 (HIGH)'
    : 'DEFCON 3 (ELEVATED)';

  // Handler to inject a synthetic attack log
  const handleSimulateAttack = (attackType: string) => {
    let newLog: SecurityLog;

    if (attackType.includes('Ransomware')) {
      newLog = {
        id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        category: 'endpoint',
        sourceIp: '10.0.8.99',
        destinationIp: '10.0.1.1',
        user: 'finance_usr_02',
        action: 'EXEC_ENCODED_POWERSHELL_VSS_PURGE',
        protocol: 'SYSTEM',
        port: 0,
        payloadSize: 8192,
        rawMessage: 'cmd.exe /c powershell.exe -Enc bT3V0Ym91bmRfY3J5cHRv (Attempting vssadmin delete shadows)',
        flaggedThreat: 'Ransomware VSS Shadow Copy Wiping',
        severity: 'critical',
        riskScore: 98,
        isAnomaly: true,
        status: 'open',
        detectedBy: 'Rule-Based'
      };
    } else if (attackType.includes('DNS')) {
      newLog = {
        id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        category: 'dns',
        sourceIp: '10.0.15.42',
        destinationIp: '1.1.1.1',
        user: 'dev_ops_host',
        action: 'EXCESSIVE_DNS_TXT_TUNNEL',
        protocol: 'DNS',
        port: 53,
        payloadSize: 51200,
        rawMessage: 'DNS Query TXT aGV4X2VuY29kZWRfc2VjcmV0c19leGZpbHRyYXRpb24=.c2.attacker.com',
        flaggedThreat: 'DNS Tunneling Data Exfiltration',
        severity: 'critical',
        riskScore: 95,
        isAnomaly: true,
        status: 'open',
        detectedBy: 'DL-LSTM'
      };
    } else if (attackType.includes('SSH')) {
      newLog = {
        id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        category: 'auth',
        sourceIp: '185.220.101.99',
        destinationIp: '10.0.2.15',
        user: 'root',
        action: 'SSH_AUTH_FAIL_BRUTE_FORCE',
        protocol: 'SSH',
        port: 22,
        payloadSize: 1200,
        rawMessage: 'Failed SSH login for user root from 185.220.101.99 - 500 attempts in 10s',
        flaggedThreat: 'SSH Password Brute Force',
        severity: 'high',
        riskScore: 88,
        isAnomaly: true,
        status: 'open',
        detectedBy: 'ML-RandomForest'
      };
    } else {
      newLog = {
        id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        category: 'email',
        sourceIp: '209.85.220.99',
        destinationIp: '10.0.1.5',
        user: 'ceo_exec@corp.com',
        action: 'EMAIL_INBOUND_SPOOF',
        protocol: 'SMTP',
        port: 25,
        payloadSize: 15400,
        rawMessage: 'From: ceo-office@corp-verify-urgent.org | Subject: URGENT Wire Transfer Request $45,000',
        flaggedThreat: 'Spear Phishing CEO Fraud Impersonation',
        severity: 'critical',
        riskScore: 93,
        isAnomaly: true,
        status: 'open',
        detectedBy: 'LLM-Gemini'
      };
    }

    setLogs(prev => [newLog, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalEventsProcessed: prev.totalEventsProcessed + 1,
      activeThreatsCount: prev.activeThreatsCount + 1,
      criticalAlertsCount: newLog.severity === 'critical' ? prev.criticalAlertsCount + 1 : prev.criticalAlertsCount
    }));
  };

  const handleUpdateLogStatus = (logId: string, newStatus: IncidentStatus) => {
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: newStatus } : l));
  };

  const handleIngestNewLog = (newLog: SecurityLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const handleSelectLogForAI = (log: SecurityLog) => {
    setSelectedLogForAI(log);
    setActiveTab('ai_assistant');
  };

  const handleExecutePlaybookStep = (cmd: string) => {
    setMitigationInitialCommand(cmd);
    setActiveTab('mitigation');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        threatLevel={threatLevel}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6">
        {activeTab === 'dashboard' && (
          <SOCDashboard
            logs={logs}
            metrics={metrics}
            onSelectLogForAI={handleSelectLogForAI}
            onSimulateAttack={handleSimulateAttack}
            onUpdateLogStatus={handleUpdateLogStatus}
          />
        )}

        {activeTab === 'pipeline' && (
          <DataPipelineView
            logs={logs}
            onIngestNewLog={handleIngestNewLog}
          />
        )}

        {activeTab === 'ml_classifiers' && (
          <MLClassifiersView logs={logs} />
        )}

        {activeTab === 'anomaly' && (
          <AnomalyDetectorView />
        )}

        {activeTab === 'phishing' && (
          <PhishingAnalyzerView />
        )}

        {activeTab === 'ai_assistant' && (
          <AIAssistantView
            logs={logs}
            selectedLogForAI={selectedLogForAI}
            onExecutePlaybookStep={handleExecutePlaybookStep}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationView />
        )}

        {activeTab === 'mitigation' && (
          <MitigationConsole initialCommand={mitigationInitialCommand} />
        )}

        {activeTab === 'deliverables' && (
          <DeliverablesHubView />
        )}
      </main>
    </div>
  );
}

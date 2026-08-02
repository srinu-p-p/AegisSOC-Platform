import React, { useState } from 'react';
import { Bot, Sparkles, Send, ShieldAlert, Terminal, CheckCircle2, Play, FileText, Cpu, RefreshCcw, Download } from 'lucide-react';
import { MOCK_PLAYBOOKS } from '../data/mockSecurityData';
import { SecurityLog, IncidentPlaybook } from '../types';
import { generateIncidentSummaryPDF } from '../utils/pdfGenerator';

interface AIAssistantViewProps {
  logs: SecurityLog[];
  selectedLogForAI: SecurityLog | null;
  onExecutePlaybookStep: (command: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ logs, selectedLogForAI, onExecutePlaybookStep }) => {
  const [activePlaybook, setActivePlaybook] = useState<IncidentPlaybook>(MOCK_PLAYBOOKS[0]);
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello Security Analyst. I am **AegisSOC AI Assistant** powered by Gemini 3.6 Flash. I specialize in MITRE ATT&CK technique mapping, security log triage, and automated NIST incident response playbooks. How can I assist your investigation today?'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Trigger Gemini AI Playbook Generation for a selected log
  const handleGenerateLogPlaybook = async (logToAnalyze: SecurityLog) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/analyze-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawMessage: logToAnalyze.rawMessage,
          category: logToAnalyze.category,
          sourceIp: logToAnalyze.sourceIp,
          destinationIp: logToAnalyze.destinationIp,
          user: logToAnalyze.user,
          port: logToAnalyze.port,
          riskScore: logToAnalyze.riskScore
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const newPlaybook: IncidentPlaybook = {
          id: `PB-${Date.now().toString().slice(-4)}`,
          threatTitle: d.threatTitle || logToAnalyze.flaggedThreat || 'Cyber Threat Event',
          severity: logToAnalyze.severity,
          summary: d.summary || 'Gemini AI generated incident summary.',
          indicatorsOfCompromise: d.indicatorsOfCompromise || [logToAnalyze.sourceIp, `Port ${logToAnalyze.port}`],
          affectedAssets: [`User: ${logToAnalyze.user}`, `Host: ${logToAnalyze.destinationIp}`],
          nistCategory: d.mitreAttackTechnique || 'NIST SP 800-61 Rev 2',
          createdTimestamp: new Date().toISOString(),
          aiGeneratedInsights: d.explainableAiAnalysis || 'AI Explainability: Flagged due to abnormal entropy and protocol signatures.',
          steps: (d.guidedPlaybook || []).map((step: any, i: number) => ({
            stepNumber: i + 1,
            phase: step.phase || 'Containment',
            title: `Step ${i + 1}: ${step.phase || 'Remediation'}`,
            action: step.action || 'Execute containment action',
            automatedCommand: step.command || `aegis-cli isolate --target ${logToAnalyze.sourceIp}`,
            assignedRole: 'Tier 2 Security Engineer',
            status: 'pending'
          }))
        };
        setActivePlaybook(newPlaybook);
      }
    } catch (err) {
      console.error('Error generating AI playbook:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Chat Submission
  const handleSendMessage = async () => {
    if (!userQuery.trim() || isGenerating) return;

    const query = userQuery;
    setUserQuery('');
    setChatMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: chatMessages
        })
      });

      const json = await res.json();
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: json.reply || json.error || 'No response from assistant.' }
      ]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Failed to communicate with AI Assistant backend.' }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Module 7: AI Cybersecurity SOC Assistant & Guided Incident Response Playbooks</h2>
              <p className="text-xs text-slate-400">Contextual Threat Summaries, Explainable AI (XAI) & Executable NIST Response Protocols</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => generateIncidentSummaryPDF(logs)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Incident PDF Report</span>
            </button>

            {selectedLogForAI && (
              <button
                onClick={() => handleGenerateLogPlaybook(selectedLogForAI)}
                disabled={isGenerating}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>{isGenerating ? 'Generating Playbook...' : `Generate AI Playbook for ${selectedLogForAI.id}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playbook Display Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  {activePlaybook.nistCategory}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{activePlaybook.threatTitle}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{new Date(activePlaybook.createdTimestamp).toLocaleTimeString()}</span>
            </div>

            {/* AI Summary & XAI Explanation */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini Threat Intelligence & XAI Narrative</span>
                </span>
                <p className="text-slate-300 leading-relaxed">{activePlaybook.aiGeneratedInsights}</p>
              </div>

              {/* Indicators of Compromise (IOC) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Extracted Indicators of Compromise (IOCs)</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activePlaybook.indicatorsOfCompromise.map((ioc, i) => (
                    <span key={i} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded text-[11px] font-mono">
                      {ioc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Guided Playbook Remediation Steps */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-200">NIST SP 800-61 Guided Incident Playbook Steps</h4>

              <div className="space-y-3">
                {activePlaybook.steps.map(step => (
                  <div key={step.stepNumber} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-[10px] font-mono font-bold">
                          {step.stepNumber}
                        </span>
                        <span>[{step.phase}] {step.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Role: {step.assignedRole}
                      </span>
                    </div>

                    <p className="text-slate-300 pl-7">{step.action}</p>

                    {step.automatedCommand && (
                      <div className="pl-7 pt-1 flex items-center justify-between gap-2">
                        <div className="bg-slate-900 border border-slate-800 text-blue-300 font-mono text-[11px] p-2 rounded flex-1 truncate">
                          $ {step.automatedCommand}
                        </div>
                        <button
                          onClick={() => onExecutePlaybookStep(step.automatedCommand!)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-[11px] transition-all flex items-center space-x-1 shadow-md shadow-emerald-600/30 whitespace-nowrap"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Execute Command</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conversational SOC AI Assistant Chat Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-[640px]">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-3">
            <Bot className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">SOC Analyst Conversational AI</h3>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white ml-auto font-sans'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 font-sans'
                }`}
              >
                <div className="text-[10px] opacity-70 mb-1 font-mono uppercase">
                  {msg.role === 'user' ? 'SOC Analyst' : 'Gemini AI Assistant'}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI about MITRE T1059, rules, or log analysis..."
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isGenerating}
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

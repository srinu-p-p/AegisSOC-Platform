import React, { useState } from 'react';
import { Mail, ShieldAlert, Sparkles, Link, FileText, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { SAMPLE_PHISHING_EMAILS } from '../data/mockSecurityData';
import { analyzePhishingEmailLocally } from '../utils/securityML';
import { PhishingAnalysisResult } from '../types';

export const PhishingAnalyzerView: React.FC = () => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const sample = SAMPLE_PHISHING_EMAILS[selectedSampleIndex];

  const [sender, setSender] = useState(sample.sender);
  const [subject, setSubject] = useState(sample.subject);
  const [body, setBody] = useState(sample.body);
  const [headers, setHeaders] = useState(sample.headers);

  const [localAnalysis, setLocalAnalysis] = useState<PhishingAnalysisResult>(() =>
    analyzePhishingEmailLocally(sample.subject, sample.body, sample.sender, sample.headers)
  );

  const [aiDeepAnalysis, setAiDeepAnalysis] = useState<any | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedSampleIndex(idx);
    const item = SAMPLE_PHISHING_EMAILS[idx];
    setSender(item.sender);
    setSubject(item.subject);
    setBody(item.body);
    setHeaders(item.headers);
    setLocalAnalysis(analyzePhishingEmailLocally(item.subject, item.body, item.sender, item.headers));
    setAiDeepAnalysis(null);
  };

  const handleRunLocalScan = () => {
    setLocalAnalysis(analyzePhishingEmailLocally(subject, body, sender, headers));
  };

  const handleRunGeminiDeepAudit = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/analyze-phishing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, subject, body, headers })
      });
      const data = await res.json();
      if (data.success) {
        setAiDeepAnalysis(data.data);
      } else {
        setAiDeepAnalysis({ error: data.fallbackMessage || data.error });
      }
    } catch (err: any) {
      setAiDeepAnalysis({ error: 'Failed to contact server AI endpoint' });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Modules 2 & 7: Phishing Email & URL NLP Analyzer</h2>
            <p className="text-xs text-slate-400">SPF/DKIM Header Inspection, Link Extraction, Urgency Sentiment Analysis & Gemini AI Deep Forensic Audit</p>
          </div>
        </div>

        {/* Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Preset Test Samples:</span>
          {SAMPLE_PHISHING_EMAILS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                selectedSampleIndex === idx
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Editor / Input Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Email Payload & Header Inspector</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Sender Email Address</label>
              <input
                type="text"
                value={sender}
                onChange={e => setSender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Body Content</label>
              <textarea
                rows={6}
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono rounded-lg p-3 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Received Headers (Raw Syslog)</label>
              <textarea
                rows={3}
                value={headers}
                onChange={e => setHeaders(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleRunLocalScan}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Run NLP Rule & Feature Engine</span>
              </button>

              <button
                onClick={handleRunGeminiDeepAudit}
                disabled={isLoadingAi}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/30"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>{isLoadingAi ? 'Scanning with Gemini...' : 'Gemini AI Deep Phishing Audit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scan Results & Forensic Breakdown */}
        <div className="space-y-6">
          {/* Rule/Heuristic NLP Scan Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-200">Local NLP & Header Analysis</h3>
              <span className={`px-3 py-1 rounded font-mono font-bold text-xs uppercase ${
                localAnalysis.isPhishing ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {localAnalysis.isPhishing ? 'PHISHING / MALICIOUS' : 'CLEAN EMAIL'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Confidence Score</span>
                <span className="text-rose-400 text-lg font-bold">{localAnalysis.confidenceScore}%</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">NLP Urgency Index</span>
                <span className="text-amber-300 text-lg font-bold">{localAnalysis.nlpSentimentUrgency}/100</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">SPF/DKIM Verdict</span>
                <span className={`font-bold ${localAnalysis.spfDkimStatus === 'FAIL' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {localAnalysis.spfDkimStatus}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Extracted Links</span>
                <span className="text-cyan-300 font-bold">{localAnalysis.extractedUrls.length} links found</span>
              </div>
            </div>

            {/* Suspicious Keywords */}
            {localAnalysis.keywordsFound.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-medium">Flagged Social Engineering Keywords:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {localAnalysis.keywordsFound.map(kw => (
                    <span key={kw} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded text-[11px] font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gemini AI Deep Audit Result */}
          {aiDeepAnalysis && (
            <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm border-b border-purple-800/50 pb-2">
                <Sparkles className="w-4 h-4" />
                <span>Gemini AI Forensic Email Audit Report</span>
              </div>

              {aiDeepAnalysis.error ? (
                <p className="text-xs text-rose-300">{aiDeepAnalysis.error}</p>
              ) : (
                <div className="space-y-2 text-xs text-purple-100">
                  <div className="flex justify-between items-center font-mono">
                    <span>Attack Vector Category:</span>
                    <span className="text-rose-300 font-bold">{aiDeepAnalysis.attackCategory}</span>
                  </div>

                  <p className="bg-purple-950/80 p-3 rounded-lg border border-purple-800/80 text-xs leading-relaxed font-sans">
                    {aiDeepAnalysis.detailedExplanation}
                  </p>

                  <div className="space-y-1">
                    <span className="text-purple-300 font-semibold">Remediation Protocol:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {(aiDeepAnalysis.remediationSteps || []).map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

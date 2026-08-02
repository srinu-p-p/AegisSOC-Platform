import React, { useState } from 'react';
import { Database, Filter, Code2, Binary, ShieldAlert, Sparkles, Cpu, CheckCircle } from 'lucide-react';
import { extractLogFeatures, ExtractedLogFeatures } from '../utils/securityML';
import { SecurityLog } from '../types';

interface DataPipelineViewProps {
  logs: SecurityLog[];
  onIngestNewLog: (log: SecurityLog) => void;
}

export const DataPipelineView: React.FC<DataPipelineViewProps> = ({ logs, onIngestNewLog }) => {
  const [rawInputLog, setRawInputLog] = useState(
    'Aug 02 01:45:12 firewall-gw01 syslog: OUTBOUND_TCP_CONN_FAIL src=10.0.12.88 dst=185.220.101.99 port=4444 payload=b3V0Ym91bmRfY3J5cHRv'
  );
  const [sourceIp, setSourceIp] = useState('10.0.12.88');
  const [port, setPort] = useState(4444);
  const [payloadBytes, setPayloadBytes] = useState(4096);
  const [category, setCategory] = useState<'network' | 'system' | 'auth' | 'email' | 'dns' | 'firewall' | 'endpoint'>('network');

  const [extractedFeatures, setExtractedFeatures] = useState<ExtractedLogFeatures>(() =>
    extractLogFeatures(rawInputLog, port, payloadBytes, sourceIp)
  );

  const handleProcessLog = () => {
    const features = extractLogFeatures(rawInputLog, port, payloadBytes, sourceIp);
    setExtractedFeatures(features);
  };

  const handleIngestToPipeline = () => {
    const features = extractLogFeatures(rawInputLog, port, payloadBytes, sourceIp);
    const newLog: SecurityLog = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      category,
      sourceIp,
      destinationIp: '10.0.1.1',
      user: 'custom_ingested_user',
      action: 'CUSTOM_PREPROCESSED_EVENT',
      protocol: category === 'dns' ? 'DNS' : category === 'auth' ? 'SSH' : 'TCP',
      port,
      payloadSize: payloadBytes,
      rawMessage: rawInputLog,
      flaggedThreat: features.riskScore > 60 ? 'Custom High Entropy Suspicious Payload' : 'Standard Network Activity',
      severity: features.riskScore > 80 ? 'critical' : features.riskScore > 50 ? 'high' : 'low',
      riskScore: features.riskScore,
      isAnomaly: features.riskScore > 50,
      status: 'open',
      detectedBy: 'ML-RandomForest'
    };
    onIngestNewLog(newLog);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Pipeline Diagram Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Modules 1 & 2: Data Collection & Preprocessing Pipeline</h2>
            <p className="text-xs text-slate-400">Log Aggregation, Noise Filtering, Feature Extraction & Normalization</p>
          </div>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center relative">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Step 1</span>
            <span className="font-bold text-slate-200 block mt-1">Multi-Source Log Ingestion</span>
            <span className="text-[10px] text-slate-500 block mt-1">Syslog, Auth, Email, NetFlow</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center relative">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Step 2</span>
            <span className="font-bold text-slate-200 block mt-1">Log Parsing & Cleaning</span>
            <span className="text-[10px] text-slate-500 block mt-1">Grok patterns & regex split</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center relative">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Step 3</span>
            <span className="font-bold text-slate-200 block mt-1">Feature Extraction</span>
            <span className="text-[10px] text-slate-500 block mt-1">Shannon Entropy & Vectors</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center relative">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Step 4</span>
            <span className="font-bold text-slate-200 block mt-1">Categorical Encoding</span>
            <span className="text-[10px] text-slate-500 block mt-1">One-Hot / Ordinal Scale</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center relative">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Step 5</span>
            <span className="font-bold text-slate-200 block mt-1">ML Tensor Dataset</span>
            <span className="text-[10px] text-emerald-500/80 block mt-1">Ready for Classifiers</span>
          </div>
        </div>
      </div>

      {/* Interactive Log Parser & Preprocessing Laboratory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Raw Security Log Input</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Module 2</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Log Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="network">Network Traffic (Flows/Packets)</option>
                <option value="auth">Authentication Record (SSH/Kerberos)</option>
                <option value="email">Inbound Email Message</option>
                <option value="dns">DNS Request Log</option>
                <option value="endpoint">Endpoint Command / Process Execution</option>
                <option value="firewall">Firewall Event</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Raw Syslog / Message String</label>
              <textarea
                rows={4}
                value={rawInputLog}
                onChange={e => setRawInputLog(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs rounded-lg p-3 focus:outline-none focus:border-blue-500"
                placeholder="Paste raw syslog..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Source IP</label>
                <input
                  type="text"
                  value={sourceIp}
                  onChange={e => setSourceIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Target Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={e => setPort(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Payload Bytes</label>
                <input
                  type="number"
                  value={payloadBytes}
                  onChange={e => setPayloadBytes(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono rounded-lg p-2"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleProcessLog}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30"
              >
                <Cpu className="w-4 h-4" />
                <span>Run Data Preprocessor</span>
              </button>

              <button
                onClick={handleIngestToPipeline}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Ingest to Live Feed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Tensor Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <Binary className="w-4 h-4 text-emerald-400" />
              <span>Extracted Features & Tensor Representation</span>
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
              Cleaned Output
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Payload Shannon Entropy:</span>
                <span className="font-bold text-amber-300">{extractedFeatures.entropy} bits/byte</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">External Origin IP Flag:</span>
                <span className={`font-bold ${extractedFeatures.isExternalIp ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {extractedFeatures.isExternalIp ? 'TRUE (Remote)' : 'FALSE (Internal 10.x)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Encoded Command Signature:</span>
                <span className={`font-bold ${extractedFeatures.hasEncodedCommands ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {extractedFeatures.hasEncodedCommands ? 'DETECTED (Base64/Powershell)' : 'CLEAN'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Unusual High-Risk Port:</span>
                <span className={`font-bold ${extractedFeatures.isUnusualPort ? 'text-amber-400' : 'text-slate-400'}`}>
                  {extractedFeatures.isUnusualPort ? 'YES (Port 4444/31337/54212)' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Computed Heuristic Risk Score:</span>
                <span className="font-bold text-rose-400">{extractedFeatures.riskScore} / 100</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2 font-sans font-semibold">Normalized Machine Learning Tensor Vector:</p>
              <div className="bg-slate-900 p-3 rounded font-mono text-[11px] text-blue-300 overflow-x-auto">
                [
                  {extractedFeatures.entropy},
                  {extractedFeatures.isExternalIp ? 1 : 0},
                  {extractedFeatures.hasEncodedCommands ? 1 : 0},
                  {extractedFeatures.isUnusualPort ? 1 : 0},
                  {extractedFeatures.failedAuthCount},
                  {extractedFeatures.payloadBytes},
                  {extractedFeatures.protocolNumeric}
                ]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Explorer & Ingested Logs Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-base font-bold text-slate-200">Active Pipeline Preprocessed Records ({logs.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">ID</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Entropy</th>
                <th className="p-2.5">Payload</th>
                <th className="p-2.5">Risk Score</th>
                <th className="p-2.5">Anomaly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.slice(0, 5).map(l => {
                const feat = extractLogFeatures(l.rawMessage, l.port, l.payloadSize, l.sourceIp);
                return (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-blue-400 font-bold">{l.id}</td>
                    <td className="p-2.5 capitalize">{l.category}</td>
                    <td className="p-2.5 text-amber-300">{feat.entropy}</td>
                    <td className="p-2.5">{l.payloadSize} B</td>
                    <td className="p-2.5 text-rose-400 font-bold">{l.riskScore}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        l.isAnomaly ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {l.isAnomaly ? 'ANOMALOUS' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BrainCircuit, Cpu, Zap, CheckCircle2, AlertTriangle, Layers, Play, RefreshCw } from 'lucide-react';
import { MOCK_ML_MODELS_PERFORMANCE } from '../data/mockSecurityData';
import { classifyLogThreatWithML } from '../utils/securityML';
import { SecurityLog } from '../types';

interface MLClassifiersViewProps {
  logs: SecurityLog[];
}

export const MLClassifiersView: React.FC<MLClassifiersViewProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<SecurityLog>(logs[0] || {
    id: 'DEMO-101',
    timestamp: new Date().toISOString(),
    category: 'network',
    sourceIp: '185.220.101.4',
    destinationIp: '10.0.4.12',
    user: 'admin_exec',
    action: 'SSH_BRUTE_FORCE',
    protocol: 'SSH',
    port: 22,
    payloadSize: 1024,
    rawMessage: 'Failed password for invalid user admin_exec from 185.220.101.4 - 240 attempts in 30s',
    flaggedThreat: 'Brute Force SSH Credential Stuffing',
    severity: 'high',
    riskScore: 84,
    isAnomaly: true,
    status: 'open',
    detectedBy: 'ML-RandomForest'
  });

  const classicalModels = MOCK_ML_MODELS_PERFORMANCE.filter(m => m.category === 'Classical ML');
  const deepLearningModels = MOCK_ML_MODELS_PERFORMANCE.filter(m => m.category === 'Deep Learning');

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Modules 3 & 4: Machine Learning & Deep Learning Classifiers</h2>
            <p className="text-xs text-slate-400">Classical ML (Logistic Regression, Decision Tree, Random Forest, XGBoost) & Deep Neural Nets (MLP, LSTM, Transformer)</p>
          </div>
        </div>
      </div>

      {/* Interactive Model Prediction Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Multi-Model Live Inference Comparison Playground</h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Test Input Security Log:</span>
            <select
              value={selectedLog.id}
              onChange={e => {
                const found = logs.find(l => l.id === e.target.value);
                if (found) setSelectedLog(found);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-1.5 font-mono"
            >
              {logs.map(l => (
                <option key={l.id} value={l.id}>
                  [{l.category.toUpperCase()}] {l.id} - {l.flaggedThreat || l.rawMessage.substring(0, 30)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Log Metadata Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Input Raw Payload:</span>
            <span className="text-blue-400">Port {selectedLog.port} | {selectedLog.protocol}</span>
          </div>
          <div className="text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 break-all">
            {selectedLog.rawMessage}
          </div>
        </div>

        {/* Live Multi-Model Predictions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {MOCK_ML_MODELS_PERFORMANCE.filter(m => m.category !== 'Rule-Based').map(model => {
            const prediction = classifyLogThreatWithML(selectedLog, model.name);

            return (
              <div key={model.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>{model.name}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    model.category === 'Deep Learning' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {model.category}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Predicted Category:</span>
                    <span className="font-bold text-rose-300">{prediction.predictedThreat}</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Confidence Score:</span>
                    <span className="font-mono font-bold text-emerald-400">{prediction.confidenceScore}%</span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${prediction.confidenceScore}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-slate-500 text-[10px] pt-1 font-mono">
                    <span>Model F1 Score: {(model.f1Score * 100).toFixed(1)}%</span>
                    <span>Inference: {model.latencyMs}ms</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classical ML Models Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>Module 3: Classical Machine Learning Models</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classicalModels.map(model => (
            <div key={model.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-slate-100 text-sm">{model.name}</h4>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  F1: {(model.f1Score * 100).toFixed(1)}%
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{model.description}</p>

              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Accuracy</span>
                  <span className="text-slate-200 font-bold">{(model.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Precision</span>
                  <span className="text-slate-200 font-bold">{(model.precision * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Recall</span>
                  <span className="text-slate-200 font-bold">{(model.recall * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ROC-AUC</span>
                  <span className="text-purple-300 font-bold">{model.rocAuc.toFixed(3)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Learning Models Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <span>Module 4: Deep Learning & Sequential Architecture Models</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deepLearningModels.map(model => (
            <div key={model.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-slate-100 text-sm">{model.name}</h4>
                <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  F1: {(model.f1Score * 100).toFixed(1)}%
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{model.description}</p>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">ROC-AUC Score</span>
                  <span className="text-emerald-400 font-bold">{model.rocAuc.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Inference Speed</span>
                  <span className="text-amber-300 font-bold">{model.latencyMs} ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

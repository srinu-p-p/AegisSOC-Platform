import React, { useState } from 'react';
import { BarChart3, CheckCircle2, AlertTriangle, Layers, Cpu } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MOCK_ML_MODELS_PERFORMANCE } from '../data/mockSecurityData';
import { MLModelPerformance } from '../types';

export const EvaluationView: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<MLModelPerformance>(MOCK_ML_MODELS_PERFORMANCE[3]); // XGBoost

  // Prepare combined ROC Curve data points for multi-line comparison
  const rocComparisonData = [
    { fpr: 0, xgb: 0, rf: 0, lstm: 0, transformer: 0, rules: 0 },
    { fpr: 0.01, xgb: 0.90, rf: 0.82, lstm: 0.88, transformer: 0.95, rules: 0.30 },
    { fpr: 0.02, xgb: 0.97, rf: 0.95, lstm: 0.96, transformer: 0.99, rules: 0.68 },
    { fpr: 0.05, xgb: 0.99, rf: 0.98, lstm: 0.99, transformer: 0.999, rules: 0.68 },
    { fpr: 0.10, xgb: 0.995, rf: 0.99, lstm: 0.995, transformer: 1.0, rules: 0.68 },
    { fpr: 1.0, xgb: 1.0, rf: 1.0, lstm: 1.0, transformer: 1.0, rules: 1.0 }
  ];

  const { tp, fp, tn, fn } = selectedModel.confusionMatrix;

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Module 8: Cyber AI Model Evaluation & Benchmark Metrics</h2>
            <p className="text-xs text-slate-400">Comparative Performance Analysis: ML, Deep Learning, Anomaly Detection vs. Legacy Rules</p>
          </div>
        </div>
      </div>

      {/* Model Performance Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-200">Threat Detection Accuracy Leaderboard</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">Category</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision</th>
                <th className="p-3">Recall</th>
                <th className="p-3">F1 Score</th>
                <th className="p-3">ROC-AUC</th>
                <th className="p-3">FPR / FNR</th>
                <th className="p-3 text-right">Inspect Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_ML_MODELS_PERFORMANCE.map(model => (
                <tr
                  key={model.id}
                  className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    selectedModel.id === model.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <td className="p-3 font-bold text-slate-100">{model.name}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {model.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-200">{(model.accuracy * 100).toFixed(1)}%</td>
                  <td className="p-3 text-slate-200">{(model.precision * 100).toFixed(1)}%</td>
                  <td className="p-3 text-slate-200">{(model.recall * 100).toFixed(1)}%</td>
                  <td className="p-3 font-bold text-emerald-400">{(model.f1Score * 100).toFixed(1)}%</td>
                  <td className="p-3 text-purple-300 font-bold">{model.rocAuc.toFixed(3)}</td>
                  <td className="p-3 text-slate-400">
                    <span className="text-rose-400">{(model.falsePositiveRate * 100).toFixed(1)}%</span> / <span className="text-amber-400">{(model.falseNegativeRate * 100).toFixed(1)}%</span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-[10px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Confusion Matrix & ROC Curves Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confusion Matrix Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="font-bold text-slate-200 text-sm">Confusion Matrix</h4>
            <span className="text-xs font-mono text-blue-400 font-semibold">{selectedModel.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
            <div className="bg-emerald-950/60 border border-emerald-600/40 p-4 rounded-xl space-y-1">
              <span className="text-emerald-400 text-[10px] block font-bold">TRUE POSITIVES (TP)</span>
              <span className="text-2xl font-bold text-emerald-200">{tp}</span>
              <span className="text-[10px] text-slate-400 block">Correct Threat Flags</span>
            </div>

            <div className="bg-rose-950/60 border border-rose-600/40 p-4 rounded-xl space-y-1">
              <span className="text-rose-400 text-[10px] block font-bold">FALSE POSITIVES (FP)</span>
              <span className="text-2xl font-bold text-rose-200">{fp}</span>
              <span className="text-[10px] text-slate-400 block">False Alarm Noise</span>
            </div>

            <div className="bg-amber-950/60 border border-amber-600/40 p-4 rounded-xl space-y-1">
              <span className="text-amber-400 text-[10px] block font-bold">FALSE NEGATIVES (FN)</span>
              <span className="text-2xl font-bold text-amber-200">{fn}</span>
              <span className="text-[10px] text-slate-400 block">Missed Cyber Attacks</span>
            </div>

            <div className="bg-blue-950/60 border border-blue-600/40 p-4 rounded-xl space-y-1">
              <span className="text-blue-400 text-[10px] block font-bold">TRUE NEGATIVES (TN)</span>
              <span className="text-2xl font-bold text-blue-200">{tn}</span>
              <span className="text-[10px] text-slate-400 block">Correct Normal Logs</span>
            </div>
          </div>
        </div>

        {/* Multi-Model ROC-AUC Curves Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-200 text-sm">ROC-AUC Benchmark Comparison</h4>
            <span className="text-xs text-slate-400">False Positive Rate vs True Positive Rate</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'False Positive Rate (FPR)', position: 'bottom', fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="transformer" name="Transformer (0.997)" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="xgb" name="XGBoost (0.992)" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="lstm" name="LSTM (0.989)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rf" name="Random Forest (0.981)" stroke="#eab308" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rules" name="Legacy Rules (0.810)" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

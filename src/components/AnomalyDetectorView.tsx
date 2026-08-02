import React, { useState } from 'react';
import { UserCheck, Activity, AlertCircle, ShieldAlert, Cpu, Eye, Filter } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { MOCK_USER_BEHAVIOR } from '../data/mockSecurityData';
import { UserBehaviorRecord } from '../types';

export const AnomalyDetectorView: React.FC = () => {
  const [userRecords, setUserRecords] = useState<UserBehaviorRecord[]>(MOCK_USER_BEHAVIOR);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'Isolation Forest' | 'Autoencoder' | 'One-Class SVM'>('Isolation Forest');

  const handleFlagAsNormal = (userId: string) => {
    setUserRecords(prev => prev.map(u => u.id === userId ? { ...u, status: 'Normal', anomalyScore: 10 } : u));
  };

  const scatterData = userRecords.map(u => ({
    user: u.user,
    failedAuth: u.failedAuthAttempts,
    dataXferMb: u.dataXferTodayMb,
    anomalyScore: u.anomalyScore,
    status: u.status,
    loginHour: u.loginHourToday
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Module 5: Behavioral Anomaly Detection & UEBA</h2>
            <p className="text-xs text-slate-400">Unsupervised Outlier Analytics (Isolation Forest, Deep Autoencoders & One-Class SVM) for Zero-Day Threat Discovery</p>
          </div>
        </div>
      </div>

      {/* Model Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Active Unsupervised Anomaly Engine:</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {(['Isolation Forest', 'Autoencoder', 'One-Class SVM'] as const).map(alg => (
            <button
              key={alg}
              onClick={() => setSelectedAlgorithm(alg)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedAlgorithm === alg
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>
      </div>

      {/* Behavioral Deviation Scatter Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100">User & Entity Behavior Analytics (UEBA) Outlier Map</h3>
            <p className="text-xs text-slate-400">Failed Logins (X-Axis) vs Outbound Data Transfer MB (Y-Axis) - High anomaly scores highlighted in red</p>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
            Engine: {selectedAlgorithm}
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey="failedAuth" name="Failed Logins" stroke="#64748b" label={{ value: 'Failed Auth Attempts', position: 'bottom', fill: '#64748b', fontSize: 11 }} />
              <YAxis type="number" dataKey="dataXferMb" name="Data Transfer (MB)" stroke="#64748b" label={{ value: 'Data Transfer Today (MB)', angle: -90, position: 'left', fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-xs space-y-1 shadow-xl">
                        <p className="font-bold text-blue-400">{data.user}</p>
                        <p className="text-slate-300">Data Transfer: {data.dataXferMb} MB</p>
                        <p className="text-slate-300">Failed Auth: {data.failedAuth}</p>
                        <p className="text-rose-400 font-bold">Anomaly Score: {data.anomalyScore}/100</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Users" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.anomalyScore > 75 ? '#ef4444' : entry.anomalyScore > 40 ? '#eab308' : '#10b981'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Behavior Anomalies Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-base font-bold text-slate-200">Tracked User Baseline Deviations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">User & Department</th>
                <th className="p-3">Avg vs Today Login Hour</th>
                <th className="p-3">Data Transfer (Avg vs Today)</th>
                <th className="p-3">Failed Auths</th>
                <th className="p-3">Anomaly Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Triage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {userRecords.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{u.user}</div>
                    <div className="text-[10px] text-slate-500">{u.department}</div>
                  </td>

                  <td className="p-3 font-mono">
                    <span className="text-slate-400">Avg {u.avgLoginHour}:00</span> / <span className={u.loginHourToday < 6 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{u.loginHourToday}:00 AM</span>
                  </td>

                  <td className="p-3 font-mono">
                    <span className="text-slate-400">{u.avgDataXferMb} MB</span> / <span className={u.dataXferTodayMb > 1000 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{u.dataXferTodayMb} MB</span>
                  </td>

                  <td className="p-3 font-mono">
                    <span className={u.failedAuthAttempts > 3 ? 'text-amber-400 font-bold' : 'text-slate-300'}>{u.failedAuthAttempts}</span>
                  </td>

                  <td className="p-3">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      u.anomalyScore > 75 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      u.anomalyScore > 40 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {u.anomalyScore} / 100
                    </span>
                  </td>

                  <td className="p-3 font-semibold">
                    <span className={u.status.includes('Anomaly') ? 'text-rose-400' : 'text-emerald-400'}>
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    {u.status !== 'Normal' ? (
                      <button
                        onClick={() => handleFlagAsNormal(u.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-all"
                      >
                        Reset Baseline
                      </button>
                    ) : (
                      <span className="text-emerald-500 text-[10px]">Verified Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

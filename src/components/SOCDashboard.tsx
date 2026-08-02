import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Zap, 
  Terminal, 
  Sparkles, 
  RefreshCw,
  PlusCircle,
  Eye,
  Download,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SecurityLog, SOCMetricsSummary, ThreatSeverity, IncidentStatus } from '../types';
import { generateIncidentSummaryPDF } from '../utils/pdfGenerator';

interface SOCDashboardProps {
  logs: SecurityLog[];
  metrics: SOCMetricsSummary;
  onSelectLogForAI: (log: SecurityLog) => void;
  onSimulateAttack: (attackType: string) => void;
  onUpdateLogStatus: (logId: string, newStatus: IncidentStatus) => void;
}

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#10b981'
};

export const SOCDashboard: React.FC<SOCDashboardProps> = ({
  logs,
  metrics,
  onSelectLogForAI,
  onSimulateAttack,
  onUpdateLogStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectingLog, setInspectingLog] = useState<SecurityLog | null>(null);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.rawMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sourceIp.includes(searchTerm) ||
      (log.flaggedThreat && log.flaggedThreat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  // Recharts data preparation
  const severityCounts = [
    { name: 'Critical', value: logs.filter(l => l.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: logs.filter(l => l.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: logs.filter(l => l.severity === 'medium').length, color: '#eab308' },
    { name: 'Low', value: logs.filter(l => l.severity === 'low').length, color: '#10b981' },
  ];

  const categoryDistribution = [
    { category: 'Auth', count: logs.filter(l => l.category === 'auth').length },
    { category: 'Network', count: logs.filter(l => l.category === 'network').length },
    { category: 'Email', count: logs.filter(l => l.category === 'email').length },
    { category: 'Endpoint', count: logs.filter(l => l.category === 'endpoint').length },
    { category: 'Firewall', count: logs.filter(l => l.category === 'firewall').length },
    { category: 'DNS', count: logs.filter(l => l.category === 'dns').length },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Logs Ingested</p>
            <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1">
              {metrics.totalEventsProcessed.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>Real-time ingestion active</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Threat Alerts</p>
            <h3 className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {logs.filter(l => l.status === 'open' || l.status === 'investigating').length}
            </h3>
            <p className="text-[11px] text-rose-400/90 mt-1 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{logs.filter(l => l.severity === 'critical').length} Critical level</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">MTTD / MTTR Metrics</p>
            <h3 className="text-2xl font-bold font-mono text-amber-300 mt-1">
              {metrics.meanTimeToDetectMinutes}m / {metrics.meanTimeToRespondMinutes}m
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Mean Time Detect / Respond</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Auto-Mitigation Rate</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {metrics.autoMitigatedPercent}%
            </h3>
            <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Rule & AI auto-containment</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attack Simulator & Quick Injection Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Inject Synthetic Attack Log</h4>
            <p className="text-xs text-slate-400">Simulate real-world cyber threat vectors into the AI detection pipeline</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSimulateAttack('Ransomware VSS Wiping')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-500/30 transition-all flex items-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Ransomware Payload</span>
          </button>

          <button
            onClick={() => onSimulateAttack('DNS Tunneling Exfiltration')}
            className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-all flex items-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>DNS Tunneling</span>
          </button>

          <button
            onClick={() => onSimulateAttack('SSH Brute Force Attack')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-all flex items-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>SSH Brute Force</span>
          </button>

          <button
            onClick={() => onSimulateAttack('Phishing Executive CEO Fraud')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition-all flex items-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spear Phishing</span>
          </button>
        </div>
      </div>

      {/* Analytics Charts & Threat Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Distribution Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h4 className="text-sm font-semibold text-slate-200 mb-1">Threat Severity Profile</h4>
          <p className="text-xs text-slate-400 mb-4">Active incident categorization breakdown</p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            {severityCounts.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300">{item.name}:</span>
                <span className="font-mono font-bold text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Log Vector Category Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-2">
          <h4 className="text-sm font-semibold text-slate-200 mb-1">Inbound Attack Vectors</h4>
          <p className="text-xs text-slate-400 mb-4">Threat activity distribution by security log category</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Security Threat Alerts Feed Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold text-slate-100">Live SOC Threat Incident Feed</h3>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full border border-slate-700">
              {filteredLogs.length} events
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Export PDF Button */}
            <button
              onClick={() => generateIncidentSummaryPDF(logs)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
              title="Download PDF report of open high-severity incidents & AI mitigation steps"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Incident PDF Report</span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search log, IP, threat, user..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-8 pr-3 py-1.5 w-56 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">All Severities</option>
                <option value="critical" className="bg-slate-900">Critical</option>
                <option value="high" className="bg-slate-900">High</option>
                <option value="medium" className="bg-slate-900">Medium</option>
                <option value="low" className="bg-slate-900">Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-lg">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">All Categories</option>
                <option value="auth" className="bg-slate-900">Authentication</option>
                <option value="network" className="bg-slate-900">Network Traffic</option>
                <option value="email" className="bg-slate-900">Email Phishing</option>
                <option value="endpoint" className="bg-slate-900">Endpoint Execution</option>
                <option value="firewall" className="bg-slate-900">Firewall</option>
                <option value="dns" className="bg-slate-900">DNS Request</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Flagged Threat</th>
                <th className="py-3 px-4">Source IP & User</th>
                <th className="py-3 px-4">Detected By</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' :
                      log.severity === 'high' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                      log.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {log.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-200">
                    <div>{log.flaggedThreat || 'Normal Traffic'}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{log.rawMessage}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-200">{log.sourceIp}</div>
                    <div className="text-[10px] text-blue-400">{log.user}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-purple-300">
                      {log.detectedBy}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            log.riskScore > 80 ? 'bg-rose-500' :
                            log.riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${log.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-200">{log.riskScore}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={log.status}
                      onChange={e => onUpdateLogStatus(log.id, e.target.value as IncidentStatus)}
                      className={`bg-slate-950 border text-[10px] rounded px-2 py-1 font-semibold focus:outline-none ${
                        log.status === 'open' ? 'border-rose-500/50 text-rose-300' :
                        log.status === 'investigating' ? 'border-amber-500/50 text-amber-300' :
                        log.status === 'mitigated' ? 'border-emerald-500/50 text-emerald-300' :
                        'border-slate-700 text-slate-400'
                      }`}
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="mitigated">Mitigated</option>
                      <option value="false_positive">False Positive</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setInspectingLog(log)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                      title="Inspect Log Raw Metadata"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectLogForAI(log)}
                      className="px-2.5 py-1 rounded-lg bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600 text-purple-200 text-[11px] font-medium transition-all inline-flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-purple-300" />
                      <span>AI Playbook</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Inspector Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-slate-100">Log Inspector Metadata ({inspectingLog.id})</h3>
              </div>
              <button
                onClick={() => setInspectingLog(null)}
                className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1 bg-slate-800 rounded"
              >
                ESC / Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 break-all leading-relaxed">
                <span className="text-blue-400 font-bold">[RAW LOG]:</span> {inspectingLog.rawMessage}
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500">Source IP:</span> <span className="text-slate-100">{inspectingLog.sourceIp}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500">Destination IP:</span> <span className="text-slate-100">{inspectingLog.destinationIp}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500">Target User:</span> <span className="text-slate-100">{inspectingLog.user}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500">Port / Protocol:</span> <span className="text-slate-100">{inspectingLog.port} ({inspectingLog.protocol})</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500">Payload Size:</span> <span className="text-slate-100">{inspectingLog.payloadSize} bytes</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500">Detected By Engine:</span> <span className="text-purple-300 font-bold">{inspectingLog.detectedBy}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectLogForAI(inspectingLog);
                  setInspectingLog(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Gemini AI Response Playbook</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

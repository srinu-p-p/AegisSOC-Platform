import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  BrainCircuit, 
  UserCheck, 
  Mail, 
  Bot, 
  BarChart3, 
  Terminal,
  Radio,
  Zap,
  FileCheck
} from 'lucide-react';
import { SOCMetricsSummary } from '../types';

export type TabType = 
  | 'dashboard' 
  | 'pipeline' 
  | 'ml_classifiers' 
  | 'anomaly' 
  | 'phishing' 
  | 'ai_assistant' 
  | 'evaluation' 
  | 'mitigation'
  | 'deliverables';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  metrics: SOCMetricsSummary;
  threatLevel: 'DEFCON 1 (CRITICAL)' | 'DEFCON 2 (HIGH)' | 'DEFCON 3 (ELEVATED)' | 'DEFCON 4 (NORMAL)';
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, metrics, threatLevel }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* Top Banner Stats */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldAlert className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide text-slate-200">AegisSOC Platform</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30">
              v3.6 AI Defense
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-ping" />
            <span className="text-slate-400">Ingestion:</span>
            <span className="font-mono text-blue-300 font-medium">142 EPS (Live)</span>
          </div>
        </div>

        {/* DEFCON Level Badge & Alerts Counter */}
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center space-x-1.5 border ${
            threatLevel.includes('CRITICAL') || threatLevel.includes('HIGH')
              ? 'bg-rose-950/80 text-rose-300 border-rose-600/50 animate-pulse'
              : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
          }`}>
            <Zap className="w-3.5 h-3.5" />
            <span>{threatLevel}</span>
          </div>

          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-2">
            <span className="text-slate-400">Active Threats:</span>
            <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {metrics.activeThreatsCount} Incidents
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>SOC Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Pipeline & Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('ml_classifiers')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'ml_classifiers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>ML & Deep Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('anomaly')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'anomaly'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Behavior Anomaly</span>
          </button>

          <button
            onClick={() => setActiveTab('phishing')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'phishing'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Phishing Email NLP</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'ai_assistant'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                : 'text-purple-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-300" />
            <span>AI Assistant & Playbooks</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'evaluation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Model Evaluation</span>
          </button>

          <button
            onClick={() => setActiveTab('mitigation')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'mitigation'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Remediation Console</span>
          </button>

          <button
            onClick={() => setActiveTab('deliverables')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'deliverables'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                : 'text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Deliverables & Docs Hub</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

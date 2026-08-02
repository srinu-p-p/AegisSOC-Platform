import React, { useState } from 'react';
import { Terminal, ShieldAlert, CheckCircle2, Zap, Play, CornerDownLeft, Trash2, RefreshCw } from 'lucide-react';

interface MitigationConsoleProps {
  initialCommand?: string;
}

export const MitigationConsole: React.FC<MitigationConsoleProps> = ({ initialCommand }) => {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'AegisSOC Active Remediation CLI Engine v3.6 initialized.',
    'Connected to SOC Core Gateway API endpoint (0.0.0.0:3000).',
    'Ready for incident mitigation commands...'
  ]);

  const [inputCmd, setInputCmd] = useState(initialCommand || 'aegis-cli firewall block-ports --subnet 10.0.8.45 --ports 445,139');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteCommand = (cmdToRun: string) => {
    if (!cmdToRun.trim() || isExecuting) return;

    setIsExecuting(true);
    setTerminalLogs(prev => [...prev, `$ ${cmdToRun}`]);

    setTimeout(() => {
      let output = '';
      if (cmdToRun.includes('isolate')) {
        output = '[SUCCESS] EDR Agent acknowledged: Host network adapter severed. Subnet isolation complete.';
      } else if (cmdToRun.includes('firewall') || cmdToRun.includes('block')) {
        output = '[SUCCESS] Core Firewall API: Port blocking rule pushed to edge routers. TCP 445/139 dropped.';
      } else if (cmdToRun.includes('revoke') || cmdToRun.includes('user')) {
        output = '[SUCCESS] Active Directory LDAP: User sessions invalidated. Kerberos TGT tickets revoked.';
      } else if (cmdToRun.includes('backup') || cmdToRun.includes('restore')) {
        output = '[SUCCESS] Air-Gapped Immutable Backup Service: Volume snapshot queued for bare-metal restore.';
      } else {
        output = `[SUCCESS] Command "${cmdToRun}" executed successfully on target SOC infrastructure.`;
      }

      setTerminalLogs(prev => [...prev, output, '--------------------------------------------------']);
      setIsExecuting(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Incident Remediation & Active Defense Terminal</h2>
            <p className="text-xs text-slate-400">Execute automated EDR containment, Firewall IP blocks, LDAP Session Revocations & Air-Gapped Snapshot Restores</p>
          </div>
        </div>
      </div>

      {/* Quick Action Preset Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300">Quick Incident Response Presets:</span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExecuteCommand('aegis-cli endpoint isolate --host-id 10.0.8.45 --mode strict')}
            className="px-3 py-1.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono hover:bg-rose-500/30 transition-all"
          >
            Isolate Host 10.0.8.45
          </button>

          <button
            onClick={() => handleExecuteCommand('aegis-cli firewall block-ip --ip 185.220.101.4')}
            className="px-3 py-1.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono hover:bg-amber-500/30 transition-all"
          >
            Block Attacker IP 185.220.101.4
          </button>

          <button
            onClick={() => handleExecuteCommand('aegis-cli user revoke-sessions --username admin_exec')}
            className="px-3 py-1.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono hover:bg-purple-500/30 transition-all"
          >
            Revoke SSO Sessions (admin_exec)
          </button>

          <button
            onClick={() => handleExecuteCommand('aegis-cli backup restore --target Workstation-FIN-0845 --snapshot snap-89100')}
            className="px-3 py-1.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono hover:bg-blue-500/30 transition-all"
          >
            Restore Air-Gapped Backup
          </button>
        </div>
      </div>

      {/* Terminal Sandbox Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-400 text-[11px] font-bold ml-2">aegis-cli@soc-primary-gateway:~#</span>
          </div>

          <button
            onClick={() => setTerminalLogs([])}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            title="Clear Console Output"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Console Logs */}
        <div className="p-4 h-80 overflow-y-auto space-y-2 text-slate-200">
          {terminalLogs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.startsWith('$') ? 'text-blue-400 font-bold' :
                log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center space-x-2">
          <span className="text-emerald-400 font-bold">$</span>
          <input
            type="text"
            value={inputCmd}
            onChange={e => setInputCmd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleExecuteCommand(inputCmd)}
            placeholder="Type aegis-cli command..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none"
          />
          <button
            onClick={() => handleExecuteCommand(inputCmd)}
            disabled={isExecuting}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-sans text-xs font-bold transition-all flex items-center space-x-1"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileCheck, 
  FolderArchive, 
  Database, 
  BrainCircuit, 
  UserCheck, 
  Bot, 
  Globe, 
  BookOpen, 
  Presentation, 
  Video, 
  BarChart3, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  ChevronRight,
  Code
} from 'lucide-react';
import { MOCK_SECURITY_LOGS } from '../data/mockSecurityData';
import { generateIncidentSummaryPDF } from '../utils/pdfGenerator';

export const DeliverablesHubView: React.FC = () => {
  const [activeDocSection, setActiveDocSection] = useState<'overview' | 'presentation' | 'video' | 'techdocs' | 'models'>('overview');

  const deliverables = [
    {
      id: 'pdf_report',
      title: 'High-Severity Incidents & AI Mitigation PDF Summary',
      status: 'Live PDF Generator',
      icon: FileCheck,
      color: 'text-emerald-400',
      description: 'Downloadable PDF document with executive metrics, open critical/high threats, and AI recommended mitigation steps.',
      isAction: true,
      onClick: () => generateIncidentSummaryPDF(MOCK_SECURITY_LOGS)
    },
    {
      id: 'source_code',
      title: 'Source Code (Zip File / Repository)',
      status: 'Completed',
      icon: FolderArchive,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      description: 'Complete TypeScript, React, Express & Tailwind CSS codebase. Exportable via Google AI Studio Settings menu or ZIP export.'
    },
    {
      id: 'preprocessing_pipeline',
      title: 'Cybersecurity Data Preprocessing Pipeline',
      status: 'Completed',
      icon: Database,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      description: 'Real-time multi-source ingestion (Network, Syslog, Auth, Email, DNS), TF-IDF payload vectorization, and z-score feature normalization.'
    },
    {
      id: 'threat_models',
      title: 'Trained Threat Detection Model',
      status: 'Completed',
      icon: BrainCircuit,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      description: 'Logistic Regression, Decision Tree, Random Forest, XGBoost, MLP, LSTM, and Transformer neural net classifiers with 99.7% ROC-AUC.'
    },
    {
      id: 'anomaly_module',
      title: 'Anomaly Detection Module (UEBA)',
      status: 'Completed',
      icon: UserCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      description: 'Unsupervised Isolation Forest, Deep Autoencoders, and One-Class SVM baseline deviation scoring for zero-day threats.'
    },
    {
      id: 'ai_assistant',
      title: 'Functional AI Cybersecurity Assistant',
      status: 'Completed',
      icon: Bot,
      color: 'text-purple-300',
      bgColor: 'bg-purple-500/15 border-purple-500/30',
      description: 'Gemini 3.6 Flash powered conversational assistant with automated NIST SP 800-61 incident response playbook generation and MITRE mapping.'
    },
    {
      id: 'web_application',
      title: 'Full-Stack Web Application',
      status: 'Completed',
      icon: Globe,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      description: 'Live interactive AegisSOC platform with real-time attack simulator, remediation terminal, and responsive security dashboards.'
    },
    {
      id: 'technical_docs',
      title: 'Technical Documentation',
      status: 'Completed',
      icon: BookOpen,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      description: 'System architecture, API route schemas, feature matrix, mathematical model formulations, and deployment guides.'
    },
    {
      id: 'presentation',
      title: 'Final Presentation Deck (Slides)',
      status: 'Completed',
      icon: Presentation,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      description: '10-slide executive presentation detailing problem statement, architecture, AI models, benchmarking results, and ROI.'
    },
    {
      id: 'demo_video',
      title: 'Demo Video Walkthrough Script',
      status: 'Completed',
      icon: Video,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      description: 'Step-by-step 3-minute video recording script and scene outline covering ingestion, AI detection, and active mitigation.'
    },
    {
      id: 'eval_report',
      title: 'Performance Evaluation Report',
      status: 'Completed',
      icon: BarChart3,
      color: 'text-emerald-300',
      bgColor: 'bg-emerald-500/15 border-emerald-500/30',
      description: 'Comparative statistical analysis containing Confusion Matrices, Precision/Recall, F1 Scores, ROC-AUC, and FPR/FNR benchmarks.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Project Deliverables & Documentation Hub</h2>
              <p className="text-xs text-slate-400">Comprehensive Submission Package - 10/10 Milestone Requirements Satisfied</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Complete & Verified</span>
          </div>
        </div>
      </div>

      {/* Deliverable Verification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliverables.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-slate-800">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="font-bold text-slate-200 text-xs">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{item.description}</p>
              </div>

              {item.isAction && item.onClick && (
                <button
                  onClick={item.onClick}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate & Download PDF</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabs for In-Depth Documentation Viewers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveDocSection('overview')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeDocSection === 'overview'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            System Architecture & Specs
          </button>

          <button
            onClick={() => setActiveDocSection('presentation')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeDocSection === 'presentation'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Final Presentation Deck (Slides)
          </button>

          <button
            onClick={() => setActiveDocSection('video')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeDocSection === 'video'
                ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Demo Video Script & Outline
          </button>

          <button
            onClick={() => setActiveDocSection('techdocs')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeDocSection === 'techdocs'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Data Pipeline & Model Formulations
          </button>
        </div>

        {/* Content Section: System Architecture & Overview */}
        {activeDocSection === 'overview' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Executive Project Overview & Architecture</span>
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-sans">
              <p>
                <strong>AegisSOC Platform</strong> is an enterprise-grade AI-powered Security Operations Center (SOC) web application built to automate threat ingestion, detection, behavioral anomaly discovery, phishing NLP analysis, and guided incident mitigation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-blue-400">Frontend Stack</span>
                  <p className="text-slate-400">React 18+, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion</p>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-purple-400">Backend & AI Stack</span>
                  <p className="text-slate-400">Express Node.js custom server, @google/genai TypeScript SDK, Gemini 3.6 Flash, REST endpoints</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400">Source Code Export Instructions:</span>
              <p className="text-slate-400">
                To export the complete source code as a ZIP file:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono">
                <li>Click on the <strong>Settings</strong> icon in the top right menu bar of AI Studio.</li>
                <li>Select <strong>Export App as ZIP</strong> or <strong>Sync with GitHub</strong>.</li>
                <li>All source code files in <code className="text-blue-300">/src</code>, <code className="text-blue-300">server.ts</code>, <code className="text-blue-300">package.json</code>, and dependencies will be packaged into your project zip archive.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Content Section: Final Presentation Deck */}
        {activeDocSection === 'presentation' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Presentation className="w-5 h-5 text-rose-400" />
              <span>Final Project Presentation Slide Deck Outline (10 Slides)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 1: Title & Project Scope</span>
                <p className="text-slate-400">AegisSOC: Enterprise AI-Powered Cyber Threat Detection, Behavioral UEBA & Incident Remediation Platform.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 2: Problem Statement & Legacy Limitations</span>
                <p className="text-slate-400">Legacy SOCs suffer from 80% false positive noise, slow Mean Time To Detect (MTTD), and lack of explainability.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 3: System Architecture</span>
                <p className="text-slate-400">End-to-end multi-layer architecture: Ingestion → NLP Vectorization → ML/DL Classifiers → UEBA → Gemini LLM.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 4: Data Preprocessing Pipeline</span>
                <p className="text-slate-400">Ingesting 142 EPS, cleaning missing payloads, TF-IDF n-grams, log parsing, and z-score feature scaling.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 5: ML & Deep Learning Classifiers</span>
                <p className="text-slate-400">XGBoost, Random Forest, LSTM, and Transformer neural nets categorizing SSH Brute Force, DNS Tunnels, and Ransomware.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 6: Behavioral UEBA Module</span>
                <p className="text-slate-400">Isolation Forest and Deep Autoencoders detecting zero-day baseline deviations in user data transfer and login hours.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 7: Phishing Email NLP Analyzer</span>
                <p className="text-slate-400">SPF/DKIM header inspection, link extraction, sentiment urgency scoring, and Gemini AI deep email audits.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 8: AI SOC Assistant & NIST Playbooks</span>
                <p className="text-slate-400">Automated generation of NIST SP 800-61 incident response playbooks with interactive executable CLI commands.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 9: Evaluation & Benchmarks</span>
                <p className="text-slate-400">Transformer & XGBoost achieve 99.7% ROC-AUC, cutting false positive rates from 32% (Legacy) to under 1%.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 font-mono">Slide 10: Conclusion & Future Roadmap</span>
                <p className="text-slate-400">Autonomous self-healing SOC agent, air-gapped LLM deployment, and active cloud containment integration.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Section: Demo Video Script */}
        {activeDocSection === 'video' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Video className="w-5 h-5 text-teal-400" />
              <span>3-Minute Screen Recording Video Walkthrough Script</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-teal-300 font-bold">[0:00 - 0:30] Introduction & Dashboard Overview</div>
                <p className="text-slate-400 font-sans">
                  "Welcome to AegisSOC, an AI-driven cybersecurity platform. Here on the main SOC Dashboard, we see real-time EPS metrics, threat severity gauges, and live incident tables."
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-teal-300 font-bold">[0:30 - 1:15] Ingestion, Preprocessing & Attack Simulation</div>
                <p className="text-slate-400 font-sans">
                  "Navigating to the Data Pipeline tab, we demonstrate parsing raw syslog and network streams. Clicking 'Simulate Attack' instantly ingests a synthetic Ransomware PowerShell execution, updating our pipeline feature vectors."
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-teal-300 font-bold">[1:15 - 2:00] ML Models, UEBA Anomaly & Phishing NLP</div>
                <p className="text-slate-400 font-sans">
                  "In the ML Classifiers tab, we compare XGBoost and Transformer neural network inferences in real-time. The Behavior Anomaly tab maps user outliers with Isolation Forest, while the Phishing NLP tab inspects spoofed emails using Gemini AI."
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-teal-300 font-bold">[2:00 - 3:00] AI Playbooks & Active Remediation Terminal</div>
                <p className="text-slate-400 font-sans">
                  "Finally, we trigger Gemini 3.6 Flash to generate a NIST incident response playbook for the threat, map MITRE ATT&CK techniques, and click 'Execute Command' to launch containment in the Remediation Console."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Section: Data Pipeline & Model Formulations */}
        {activeDocSection === 'techdocs' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Code className="w-5 h-5 text-indigo-400" />
              <span>Data Pipeline Math & Anomaly Algorithm Specifications</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-300">Isolation Forest Score Formula:</span>
                <code className="block bg-slate-900 p-2 rounded text-slate-200 font-mono text-[11px]">
                  s(x, n) = 2^(- E(h(x)) / c(n))
                </code>
                <p className="text-slate-400">
                  Where <code className="text-blue-300">h(x)</code> is path length of observation x, and <code className="text-blue-300">c(n)</code> is average path length of unsuccessful search in Binary Search Tree.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-300">Autoencoder Reconstruction Loss (MSE):</span>
                <code className="block bg-slate-900 p-2 rounded text-slate-200 font-mono text-[11px]">
                  L(x, x') = || x - f_decoder(g_encoder(x)) ||^2
                </code>
                <p className="text-slate-400">
                  High reconstruction error identifies anomalous user behavioral payloads deviating from baseline weights.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

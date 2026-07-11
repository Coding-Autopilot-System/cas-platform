import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cloud, PlayCircle, TerminalSquare, CheckCircle, Loader2, Server } from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployComplete: () => void;
}

type CloudProvider = 'aws' | 'azure' | 'gcp';

export default function DeploymentModal({ isOpen, onClose, onDeployComplete }: DeploymentModalProps) {
  const [selectedClouds, setSelectedClouds] = useState<CloudProvider[]>(['azure']);
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'ready' | 'deploying'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStage('idle');
      setLogs([]);
    }
  }, [isOpen]);

  const toggleCloud = (provider: CloudProvider) => {
    if (stage !== 'idle') return;
    if (selectedClouds.includes(provider)) {
      if (selectedClouds.length > 1) setSelectedClouds(selectedClouds.filter(c => c !== provider));
    } else {
      setSelectedClouds([...selectedClouds, provider]);
    }
  };

  const appendLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runWhatIf = () => {
    setStage('analyzing');
    setLogs([]);
    appendLog('Starting Multi-Cloud What-If Analysis...');
    
    let currentDelay = 500;
    
    selectedClouds.forEach((cloud) => {
      setTimeout(() => appendLog(`[${cloud.toUpperCase()}] Fetching current remote state...`), currentDelay);
      currentDelay += 800;
      setTimeout(() => appendLog(`[${cloud.toUpperCase()}] Calculating diff for 42 resources...`), currentDelay);
      currentDelay += 800;
      setTimeout(() => appendLog(`[${cloud.toUpperCase()}] Validating IAM roles and quotas...`), currentDelay);
      currentDelay += 800;
      setTimeout(() => appendLog(`[${cloud.toUpperCase()}] Analysis Complete. 0 Destructive Changes.`), currentDelay);
      currentDelay += 1000;
    });

    setTimeout(() => {
      appendLog('Global Policy Check: PASS.');
      appendLog('System Ready for Multi-Cloud Deployment.');
      setStage('ready');
    }, currentDelay + 500);
  };

  const runDeployment = () => {
    setStage('deploying');
    appendLog('Executing Multi-Cloud Deployment Plan...');
    
    setTimeout(() => appendLog('Provisioning infrastructure updates...'), 1000);
    setTimeout(() => appendLog('Running smoke tests against new endpoints...'), 2000);
    setTimeout(() => appendLog('Shifting traffic (100%)...'), 3000);
    setTimeout(() => {
      appendLog('Deployment Successful.');
      setTimeout(() => {
        onDeployComplete();
      }, 1000);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--luminosity-border)] flex justify-between items-center bg-[#0d0d12]">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-[var(--electric-cyan)]" />
              <h2 className="text-lg font-bold text-white tracking-wide">Multi-Cloud Deployment Orchestrator</h2>
            </div>
            <button onClick={onClose} disabled={stage === 'analyzing' || stage === 'deploying'} className="text-gray-400 hover:text-white disabled:opacity-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row h-[450px]">
            {/* Left Col: Config */}
            <div className="w-full md:w-1/3 border-r border-[var(--luminosity-border)] p-5 bg-[var(--surface-dark)] flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Target Clouds</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'azure', name: 'Microsoft Azure', color: 'border-blue-500/50 hover:border-blue-400' },
                    { id: 'aws', name: 'Amazon Web Services', color: 'border-amber-500/50 hover:border-amber-400' },
                    { id: 'gcp', name: 'Google Cloud Platform', color: 'border-red-500/50 hover:border-red-400' }
                  ].map((cloud) => (
                    <button
                      key={cloud.id}
                      data-testid={`cloud-select-${cloud.id}`}
                      onClick={() => toggleCloud(cloud.id as CloudProvider)}
                      disabled={stage !== 'idle'}
                      className={`flex items-center justify-between p-3 rounded-lg border bg-black/40 transition-all ${
                        selectedClouds.includes(cloud.id as CloudProvider) ? 'border-[var(--electric-cyan)] shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-[var(--electric-cyan)]/10' : cloud.color
                      } ${stage !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-sm font-medium text-gray-200">{cloud.name}</span>
                      {selectedClouds.includes(cloud.id as CloudProvider) && <CheckCircle className="w-4 h-4 text-[var(--electric-cyan)]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  data-testid="run-what-if-btn"
                  onClick={runWhatIf}
                  disabled={stage !== 'idle'}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    stage === 'idle' 
                      ? 'bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] border border-[var(--neon-purple)]/50 hover:bg-[var(--neon-purple)] hover:text-white' 
                      : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  }`}
                >
                  {stage === 'analyzing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <TerminalSquare className="w-4 h-4" />}
                  {stage === 'analyzing' ? 'Analyzing...' : 'Run What-If Analysis'}
                </button>

                <button
                  data-testid="execute-deployment-btn"
                  onClick={runDeployment}
                  disabled={stage !== 'ready'}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    stage === 'ready' 
                      ? 'bg-[var(--success-green)]/20 text-[var(--success-green)] border border-[var(--success-green)]/50 hover:bg-[var(--success-green)] hover:text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                      : stage === 'deploying'
                      ? 'bg-[var(--success-green)] text-black'
                      : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  }`}
                >
                  {stage === 'deploying' ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  {stage === 'deploying' ? 'Deploying...' : 'Execute Deployment'}
                </button>
              </div>
            </div>

            {/* Right Col: Terminal Output */}
            <div className="w-full md:w-2/3 bg-black flex flex-col relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
              
              <div className="p-3 border-b border-gray-800/50 flex items-center gap-2 bg-[#0a0a0f]">
                <Server className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-mono text-gray-500">Deployment Telemetry Log</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-gray-300">
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center flex-col text-gray-600 gap-2">
                    <TerminalSquare className="w-8 h-8 opacity-20" />
                    <p>Awaiting What-If Initialization...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {logs.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={i}
                        className={
                          log.includes('Complete') || log.includes('PASS') || log.includes('Successful') 
                            ? 'text-[var(--success-green)]' 
                            : log.includes('Executing') || log.includes('Deploying')
                            ? 'text-[var(--electric-cyan)]'
                            : 'text-gray-300'
                        }
                      >
                        {log}
                      </motion.div>
                    ))}
                    {/* Blinking cursor */}
                    {(stage === 'analyzing' || stage === 'deploying') && (
                      <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-gray-500 mt-1"></motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

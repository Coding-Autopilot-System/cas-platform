import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock, FileCheck, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from './Sidebar'; // Reusing cn utility
import DeploymentModal from './DeploymentModal';

interface GovernanceVaultProps {
  onDeploy?: () => void;
  onNavigateToArtifacts?: () => void;
}

export default function GovernanceVault({ onDeploy, onNavigateToArtifacts }: GovernanceVaultProps) {
  const [isActive, setIsActive] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const handleSign = () => {
    setIsActive(true);
    setIsSigned(true);
    triggerToast('Cryptographic Signature Applied: Execution Resumed');
  };

  const handleDeployInitiate = () => {
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleDeployComplete = () => {
    setIsDeploying(false);
    setIsModalOpen(false);
    setIsDeployed(true);
    triggerToast('Success: Multi-Cloud Pipeline Deployed to Prod');
    onDeploy?.();
  };

  return (
    <div 
      className={cn(
        "h-full border-l border-[var(--luminosity-border)] flex flex-col transition-all duration-500 ease-in-out backdrop-blur-[12px] bg-[var(--glass-bg)] z-50",
        isActive ? "w-[320px] opacity-100" : "w-[260px] opacity-60 hover:opacity-100"
      )}
      onMouseEnter={() => !isActive && setIsActive(true)}
      onMouseLeave={() => {
        if (!isSigned && !isDeploying && !isDeployed) setIsActive(false);
      }}
    >
      <div className="p-4 border-b border-[var(--luminosity-border)]">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className={cn("w-4 h-4", isActive ? "text-[var(--warning-amber)] animate-pulse" : "text-gray-400")} />
          Governance & Audit
        </h2>
        <p className="text-xs text-gray-500 mt-1">OCM Compliance Engine</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* HITL Gate */}
        <div className={cn(
          "rounded-lg p-3 border transition-colors",
          isActive && !isSigned ? "border-[var(--warning-amber)] shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-[var(--surface-bright)]/50" : "border-[var(--luminosity-border)] bg-[var(--surface)]"
        )}>
          <div className="flex justify-between items-center mb-2">
            <span className={cn("text-xs font-bold", isSigned ? "text-[var(--success-green)]" : "text-[var(--warning-amber)]")}>
              Tier 1: HITL Gate
            </span>
            {isSigned ? (
              <CheckCircle className="w-3 h-3 text-[var(--success-green)]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[var(--warning-amber)] animate-pulse"></span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mb-3">
            {isSigned ? "Cryptographic signature verified. Execution resumed." : "Execution halted. Human-in-the-loop authorization required for mission-critical path."}
          </p>
          <button 
            onClick={handleSign}
            disabled={isSigned}
            className={cn(
              "w-full py-1.5 text-xs rounded border flex items-center justify-center gap-2 transition-all duration-200",
              isSigned 
                ? "bg-[var(--success-green)]/10 text-[var(--success-green)] border-[var(--success-green)]/30 opacity-50 cursor-not-allowed" 
                : "bg-transparent text-gray-300 border-[var(--luminosity-border)] hover:border-[var(--neon-purple)] hover:text-[var(--neon-purple)] hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            )}
          >
            {isSigned ? <CheckCircle className="w-3 h-3" /> : <Fingerprint className="w-3 h-3" />}
            {isSigned ? "Signed Successfully" : "Cryptographic Sign"}
          </button>
        </div>

        {/* HOTL Gate */}
        <div className={cn(
          "rounded-lg p-3 border transition-colors",
          isSigned && !isDeployed ? "border-[var(--electric-cyan)] shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-[var(--surface-bright)]/50" : "border-[var(--luminosity-border)] bg-[var(--surface)]"
        )}>
          <div className="flex justify-between items-center mb-2">
            <span className={cn("text-xs font-bold", isDeployed ? "text-[var(--success-green)]" : "text-[var(--electric-cyan)]")}>
              Tier 2: HOTL Gate
            </span>
            <Lock className="w-3 h-3 text-gray-500" />
          </div>
          <p className="text-[10px] text-gray-400 mb-3">
            {isDeployed ? "Deployment completed. System live." : "Sandbox validation passed. Awaiting human deployment authorization."}
          </p>
          <button 
            onClick={handleDeployInitiate}
            disabled={!isSigned || isDeploying || isDeployed}
            className={cn(
              "w-full py-1.5 text-xs rounded border flex items-center justify-center gap-2 transition-all duration-200",
              (!isSigned || isDeployed)
                ? "bg-transparent text-gray-500 border-[var(--luminosity-border)] opacity-50 cursor-not-allowed" 
                : isDeploying
                ? "bg-[var(--electric-cyan)]/20 text-[var(--electric-cyan)] border-[var(--electric-cyan)]/50"
                : "bg-transparent text-gray-300 border-[var(--luminosity-border)] hover:border-[var(--neon-purple)] hover:text-[var(--neon-purple)] hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            )}
          >
            {isDeploying ? <Loader2 className="w-3 h-3 animate-spin" /> : isDeployed ? <CheckCircle className="w-3 h-3" /> : null}
            {isDeploying ? "Deploying..." : isDeployed ? "Deployed to Prod" : "Initialize Deployment"}
          </button>
          
          {/* Mission Complete Actions */}
          {isDeployed && (
            <div className="mt-3 pt-3 border-t border-[var(--luminosity-border)] animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={() => {
                  triggerToast('Mission Completed & Archived! Ready for Next Cycle.');
                  setTimeout(() => window.location.reload(), 2000); // Reloads the app simulating next cycle
                }}
                className="w-full py-2 text-xs font-bold text-white bg-[var(--success-green)]/20 border border-[var(--success-green)]/50 hover:bg-[var(--success-green)] hover:text-black rounded transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                Complete Mission & Close
              </button>
            </div>
          )}
        </div>

        {/* Artifact Vault */}
        <div className="mt-4">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Artifact Vault</h3>
          <div className="flex flex-col gap-2">
            <button 
              data-testid="gov-sast-btn"
              onClick={onNavigateToArtifacts}
              className="w-full text-left flex items-center gap-3 p-2 bg-[var(--surface)] hover:bg-gray-800 rounded border border-[var(--luminosity-border)] hover:border-[var(--success-green)]/50 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[var(--success-green)]" />
              <div>
                <div className="text-xs text-gray-300">SAST Clearance</div>
                <div className="text-[9px] text-gray-500 font-mono">0 Vulnerabilities</div>
              </div>
            </button>
            <button 
              data-testid="gov-slsa-btn"
              onClick={onNavigateToArtifacts}
              className="w-full text-left flex items-center gap-3 p-2 bg-[var(--surface)] hover:bg-gray-800 rounded border border-[var(--luminosity-border)] hover:border-[var(--electric-cyan)]/50 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[var(--electric-cyan)]" />
              <div>
                <div className="text-xs text-gray-300">SLSA Attestation</div>
                <div className="text-[9px] text-gray-500 font-mono">Level 4 Verified</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {activeToast && (
        <div className="absolute bottom-6 right-6 bg-gray-800 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 border border-gray-700 z-[110]">
          {activeToast}
        </div>
      )}

      <DeploymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onDeployComplete={handleDeployComplete} 
      />
    </div>
  );
}

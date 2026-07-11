import React, { useState } from 'react';
import { Shield, ShieldCheck, Activity, Key, CheckCircle, X } from 'lucide-react';

export default function ArtifactVaultView() {
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'split'>('split');
  const [artifactStatus, setArtifactStatus] = useState<'pending' | 'signed' | 'rejected'>('pending');

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  return (
    <div className="w-full h-full flex p-6 gap-6 overflow-hidden bg-[var(--background)]">
      {/* Left Column: Attestations */}
      <div className="w-[300px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2">
        <h2 className="text-xl font-bold text-white mb-2">Artifact Vault</h2>
        <p className="text-xs text-gray-400 mb-4">Secure repository for validated code changes, structural blueprints, and compliance attestations generated during autonomous cycles.</p>

        {/* SAST Clearance */}
        <div className="bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-300 tracking-wider">SAST CLEARANCE</span>
            <Shield className="w-4 h-4 text-[var(--success-green)]" />
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-extrabold text-[var(--success-green)]">0</span>
            <span className="text-xs text-gray-500 mt-2">Vulnerabilities Detected</span>
          </div>
          <div className="border-t border-[var(--luminosity-border)] pt-3 flex items-center gap-2 mt-2">
            <Activity className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-500">Scan completed 2m ago (SonarQube)</span>
          </div>
        </div>

        {/* SLSA Attestation */}
        <div className="bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-300 tracking-wider">SLSA ATTESTATION</span>
            <ShieldCheck className="w-4 h-4 text-[var(--neon-purple)]" />
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-[var(--neon-purple)]/10 border border-[var(--neon-purple)]/30 px-4 py-2 rounded-lg mb-3">
              <span className="text-sm font-bold text-[var(--neon-purple)]">LEVEL 4 VERIFIED</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center px-2">Hermetic build confirmed. Provenance verified.</p>
          </div>
          <button 
            data-testid="view-provenance-btn"
            onClick={() => setShowProvenanceModal(true)}
            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded border border-[var(--luminosity-border)] transition-colors mt-2"
          >
            View Provenance Record
          </button>
        </div>

        {/* Code Signing */}
        <div className="bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-300 tracking-wider">CODE SIGNING</span>
            <Key className="w-4 h-4 text-[var(--electric-cyan)]" />
          </div>
          <div className="bg-black/50 p-3 rounded border border-[var(--luminosity-border)] mb-3">
            <span className="text-[10px] text-gray-500 block mb-1">SIGNATURE HASH</span>
            <span className="text-xs text-gray-300 font-mono break-all">a3b8c44298fc5c149efbf4c8996fb...</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">Key: vault-prod-01</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-[var(--success-green)]" />
              <span className="text-[10px] font-bold text-[var(--success-green)]">Valid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Code Diff */}
      <div className="flex-1 flex flex-col h-full bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-xl overflow-hidden relative">
        <div className="p-6 border-b border-[var(--luminosity-border)] bg-[#1a1a24]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--neon-purple)] tracking-wider">SEMANTIC INTENT ANALYSIS</span>
            <span className="text-[10px] text-gray-500 font-mono">ID: PR-8492</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Refactored JWT generation logic to utilize environment variables for secure secret injection, 
            replacing hardcoded fallback values. This addresses a critical security flaw flagged in Phase 07.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-bold uppercase">Security</span>
            <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-bold uppercase">Refactor</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-[10px] text-[var(--success-green)] font-bold border border-green-500/20">
              <CheckCircle className="w-3 h-3" /> TESTS PASSED
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-[var(--luminosity-border)]">
          <span className="text-xs font-mono text-[var(--electric-cyan)]">src/auth/jwt_services.py</span>
          <div className="flex items-center gap-2">
            <button 
              data-testid="raw-btn"
              onClick={() => setViewMode('raw')}
              className={viewMode === 'raw' ? "text-[10px] font-bold text-white bg-gray-800 px-2 py-1 rounded" : "text-[10px] font-bold text-gray-400 hover:text-white"}
            >
              RAW
            </button>
            <button 
              data-testid="split-diff-btn"
              onClick={() => setViewMode('split')}
              className={viewMode === 'split' ? "text-[10px] font-bold text-white bg-gray-800 px-2 py-1 rounded" : "text-[10px] font-bold text-gray-400 hover:text-white"}
            >
              SPLIT DIFF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#0d0d12] p-4 font-mono text-sm leading-relaxed text-gray-300">
          <pre className="m-0">
            <code>
{`def generate_token(user_id: str, roles: list) -> str:
    """Generates a secure JWT for the user session."""
    
    payload = {
        "sub": user_id,
        "roles": roles,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }

`}
{viewMode === 'split' ? (
  <>
    <div className="bg-red-500/10 -mx-4 px-4 py-1 border-l-2 border-red-500/50 text-red-300">{`-   # OLD LOGIC\n-   secret = os.getenv("JWT_SECRET", "unsafe_dev_fallback_secret")`}</div>
    <div className="bg-green-500/10 -mx-4 px-4 py-1 border-l-2 border-green-500/50 text-green-300">{`+   # AUTONOMOUS FIX APPLIED\n+   secret = os.environ["JWT_SECRET"]  # Enforce strict env var presence`}</div>
  </>
) : (
  <div className="bg-transparent text-gray-300">{`    # AUTONOMOUS FIX APPLIED\n    secret = os.environ["JWT_SECRET"]  # Enforce strict env var presence`}</div>
)}
{`
    return jwt.encode(payload, secret, algorithm="HS256")
`}
            </code>
          </pre>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t border-[var(--luminosity-border)] bg-[var(--surface)] flex justify-end gap-3 z-10 relative">
          <button 
            data-testid="reject-artifact-btn"
            onClick={() => {
              setArtifactStatus('rejected');
              triggerToast('Error: Pipeline Halted & Signatures Rejected');
            }}
            disabled={artifactStatus !== 'pending'}
            className={artifactStatus === 'rejected' 
              ? "px-6 py-2 text-sm font-bold text-red-400 border border-red-500/30 bg-red-500/10 rounded" 
              : "px-6 py-2 text-sm font-bold text-gray-300 hover:text-white border border-[var(--luminosity-border)] hover:bg-gray-800 rounded transition-colors disabled:opacity-50"}
          >
            {artifactStatus === 'rejected' ? 'Rejected' : 'Reject'}
          </button>
          <button 
            data-testid="sign-artifact-btn"
            onClick={() => {
              setArtifactStatus('signed');
              triggerToast('Success: Cryptographic Signature Applied. Resuming Pipeline...');
            }}
            disabled={artifactStatus !== 'pending'}
            className={artifactStatus === 'signed'
              ? "px-6 py-2 text-sm font-bold text-[var(--success-green)] bg-green-500/10 border border-green-500/30 rounded"
              : "px-6 py-2 text-sm font-bold text-white bg-[var(--neon-purple)] hover:bg-purple-500 rounded shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"}
          >
            {artifactStatus === 'signed' ? 'Signed' : 'Sign & Resume Pipeline'}
          </button>
        </div>

        {activeToast && (
          <div className="absolute bottom-20 right-6 bg-gray-800 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 border border-gray-700 z-50">
            {activeToast}
          </div>
        )}
      </div>

      {/* Provenance Modal */}
      {showProvenanceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div data-testid="provenance-modal" className="bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-xl w-[600px] max-w-[90vw] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-[var(--luminosity-border)] flex justify-between items-center bg-[#1a1a24]">
              <h3 className="text-sm font-bold text-[var(--electric-cyan)] tracking-wider">SLSA Level 4 Provenance Record</h3>
              <button 
                data-testid="close-provenance-modal-btn"
                onClick={() => setShowProvenanceModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <pre className="text-xs text-gray-300 font-mono bg-black/50 p-4 rounded border border-gray-800 whitespace-pre-wrap">
{`{
  "_type": "https://in-toto.io/Statement/v0.1",
  "subject": [{"name": "cas-platform", "digest": {"sha256": "a3b8c44298fc5c149efbf4c8996fb..."}}],
  "predicateType": "https://slsa.dev/provenance/v0.2",
  "predicate": {
    "builder": { "id": "https://github.com/cas-build-engine" },
    "buildType": "https://github.com/cas-build-engine/docker/v1",
    "invocation": {
      "configSource": {
        "uri": "git+https://github.com/OgeonX-Ai/cas-workstation",
        "digest": {"sha1": "7a9e8f4c2b1d..."}
      }
    }
  }
}`}
              </pre>
            </div>
            <div className="p-4 border-t border-[var(--luminosity-border)] flex justify-end">
              <button 
                onClick={() => setShowProvenanceModal(false)}
                className="px-6 py-2 text-sm font-bold text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

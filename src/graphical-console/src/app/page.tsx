'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import SwarmGraph from '@/components/SwarmGraph';
import Sidebar from '@/components/Sidebar';
import FileEditorDrawer from '@/components/FileEditorDrawer';
import GovernanceVault from '@/components/GovernanceVault';
import ReasoningTranscript from '@/components/ReasoningTranscript';
import TopNavbar from '@/components/TopNavbar';
import ArtifactVaultView from '@/components/ArtifactVaultView';
import ReasoningEngineView from '@/components/ReasoningEngineView';

export default function Home() {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('orchestrator');
  const [telemetryUrl, setTelemetryUrl] = useState<string>('http://127.0.0.1:8000/api/swarm/events');
  const [isProdLive, setIsProdLive] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);

  const handleSidebarClick = (val: string) => {
    if (val === 'TELEMETRY:LIVE') {
      setTelemetryUrl('http://127.0.0.1:8000/api/swarm/events');
    } else if (val === 'TELEMETRY:SDLC_BLUEPRINT') {
      setTelemetryUrl('http://127.0.0.1:8000/api/sdlc/blueprint');
    } else if (val === 'TELEMETRY:ENG_OS_BLUEPRINT') {
      setTelemetryUrl('http://127.0.0.1:8000/api/sdlc/blueprint/engineering-os');
    } else if (val === 'TELEMETRY:BUG_FIX_BLUEPRINT') {
      setTelemetryUrl('http://127.0.0.1:8000/api/sdlc/blueprint/bug-fix');
    } else if (val === 'TELEMETRY:REFACTOR_BLUEPRINT') {
      setTelemetryUrl('http://127.0.0.1:8000/api/sdlc/blueprint/refactor');
    } else if (val === 'TELEMETRY:CICD_BLUEPRINT') {
      setTelemetryUrl('http://127.0.0.1:8000/api/sdlc/blueprint/cicd');
    } else if (val.startsWith('TELEMETRY:USE_CASE_')) {
      const caseId = val.split('_').pop();
      setTelemetryUrl(`http://127.0.0.1:8000/api/sdlc/use_case/${caseId}`);
    } else if (val.startsWith('TELEMETRY:PHASE')) {
      const phaseId = val.split('PHASE')[1];
      setTelemetryUrl(`http://127.0.0.1:8000/api/sdlc/blueprint/phase${phaseId}`);
    } else if (val === 'TELEMETRY:NEW_MISSION') {
      setTelemetryUrl('http://127.0.0.1:8000/api/swarm/mission_init');
    } else {
      setActiveFile(val);
    }
  };

  const handleDeployToProd = () => {
    setIsProdLive(true);
    setTelemetryUrl('http://127.0.0.1:8000/api/sdlc/deployment/prod');
  };

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-row bg-[var(--background)]">
      {/* Left Column: Sidebar Navigation */}
      <Sidebar onFileClick={handleSidebarClick} currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Right Column: Main App Shell */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
        <TopNavbar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isProdLive={isProdLive}
          onLLMChange={(llm) => {
            if (llm === 'LiveBrain') {
              setTelemetryUrl('http://127.0.0.1:3001/api/live-brain');
            } else {
              setTelemetryUrl('http://127.0.0.1:8000/api/swarm/events');
            }
          }}
        />
        
        {/* Dynamic View Content */}
        <div className="flex-1 flex flex-row relative overflow-hidden">
          {currentView === 'orchestrator' && (
            <>
              {/* Center Column: Orchestrator Canvas */}
              <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent relative">
                <SwarmGraph telemetryUrl={telemetryUrl} onOpenFile={(filename) => setActiveFile(filename)} pulseTrigger={pulseCount} />
                <FileEditorDrawer filePath={activeFile} onClose={() => setActiveFile(null)} />
                
                {/* Bottom-Docked Transcript */}
                <div className="absolute bottom-4 left-4 right-4 z-30 shadow-2xl rounded-xl overflow-hidden border border-[var(--luminosity-border)]">
                  <ReasoningTranscript telemetryUrl={telemetryUrl} onPromptSubmit={() => setPulseCount(c => c + 1)} />
                </div>
              </div>
              
              {/* Right Column: Governance Panel */}
              <GovernanceVault onDeploy={handleDeployToProd} onNavigateToArtifacts={() => setCurrentView('vault')} />
            </>
          )}

          {currentView === 'vault' && (
            <ArtifactVaultView />
          )}

          {currentView === 'reasoning' && (
            <ReasoningEngineView />
          )}

          {currentView === 'governance' && (
            <div className="flex-1 flex">
              <GovernanceVault onDeploy={handleDeployToProd} onNavigateToArtifacts={() => setCurrentView('vault')} />
              <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[var(--background)]">
                <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-2xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--neon-purple)] via-[var(--electric-cyan)] to-[var(--success-green)] opacity-50"></div>
                  
                  <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700 mb-6 relative">
                    <Shield className="w-10 h-10 text-[var(--electric-cyan)]" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                      <CheckCircle className="w-3 h-3 text-[var(--success-green)]" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">Enterprise Compliance Engine</h2>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-8">
                    All autonomous swarms are currently operating within defined guardrails. No pending HITL/HOTL authorization gates require your cryptographic signature.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="bg-black/40 border border-[var(--luminosity-border)] rounded-xl p-4 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Active Policies</span>
                      <span className="text-xl font-bold text-[var(--neon-purple)]">14</span>
                    </div>
                    <div className="bg-black/40 border border-[var(--luminosity-border)] rounded-xl p-4 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Violations</span>
                      <span className="text-xl font-bold text-[var(--success-green)]">0</span>
                    </div>
                    <div className="bg-black/40 border border-[var(--luminosity-border)] rounded-xl p-4 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Last Audit</span>
                      <span className="text-sm font-bold text-gray-300 mt-1">2m ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

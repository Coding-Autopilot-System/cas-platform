import React, { useState } from 'react';
import { Shield, User, Settings } from 'lucide-react';
import { cn } from './Sidebar';

type TopNavbarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
  isProdLive?: boolean;
  onLLMChange?: (llm: string) => void;
};

export default function TopNavbar({ currentView, onViewChange, isProdLive = false, onLLMChange }: TopNavbarProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTelemetryEnabled, setIsTelemetryEnabled] = useState(true);

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const tabs = [
    { id: 'orchestrator', label: 'Orchestrator' },
    { id: 'vault', label: 'Artifacts' },
    { id: 'reasoning', label: 'Reasoning' },
    { id: 'governance', label: 'Governance' },
  ];

  return (
    <div className="h-14 w-full border-b border-[var(--luminosity-border)] bg-[var(--surface)]/80 backdrop-blur-md flex items-center justify-between px-2 sm:px-4 relative z-[999] shrink-0">
      <div className="flex items-center gap-2 sm:gap-6 h-full">
        <h1 className="hidden md:block text-sm lg:text-lg font-bold text-white font-sans truncate shrink-0">CAS Visual Orchestrator</h1>
        
        <div className="flex items-center gap-1 h-full pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={cn(
                "h-full px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                currentView === tab.id 
                  ? "text-[var(--neon-purple)] border-[var(--neon-purple)]" 
                  : "text-gray-500 border-transparent hover:text-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative shrink-0">
        {/* LLM Engine Selector */}
        <div className="relative group">
          <select 
            data-testid="llm-selector"
            className="bg-[#0a0a0f] border border-gray-700 text-[10px] uppercase tracking-wider text-gray-300 font-bold rounded px-3 py-1 outline-none focus:border-[var(--neon-purple)] appearance-none pr-8 cursor-pointer transition-colors hover:border-gray-500"
            onChange={(e) => {
              triggerToast(`LLM Engine Switched to: ${e.target.value}`);
              onLLMChange?.(e.target.value);
            }}
          >
            <option value="Antigravity">Antigravity (Google)</option>
            <option value="LiveBrain">LIVE BRAIN MONITOR (CLI)</option>
            <option value="Claude 3.5">Claude 3.5 Sonnet</option>
            <option value="Codex">Codex (OpenAI)</option>
          </select>
          <div className="absolute right-2 top-1.5 pointer-events-none">
            <svg className="w-3 h-3 text-gray-500 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div 
          data-testid="status-pill"
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-colors",
            isProdLive 
              ? "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20" 
              : "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
          )}
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
        >
          <div className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            isProdLive 
              ? "bg-[var(--warning-amber)] shadow-[0_0_8px_rgba(245,158,11,0.8)]" 
              : "bg-[var(--success-green)] shadow-[0_0_8px_rgba(34,197,94,0.8)]"
          )} />
          <span className={cn(
            "text-xs font-mono",
            isProdLive ? "text-[var(--warning-amber)]" : "text-[var(--success-green)]"
          )}>
            {isProdLive ? "System Status: PROD LIVE" : "System Status: Optimal"}
          </span>
        </div>

        {showStatusDropdown && (
          <div data-testid="metrics-dropdown" className="absolute top-10 right-0 w-48 bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-md shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[10px] uppercase text-gray-400 font-bold mb-2">Metrics</h3>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-300">Agents:</span>
              <span className="text-[var(--neon-purple)] font-bold">12 Active</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Latency:</span>
              <span className="text-[var(--success-green)] font-bold">42ms</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 text-gray-400">
          <button data-testid="top-shield-icon" onClick={() => triggerToast('Shield: Security Scans Passed')} className="hover:text-white transition-colors p-1"><Shield className="w-4 h-4" /></button>
          <button data-testid="top-user-icon" onClick={() => triggerToast('User: Admin Profile Active')} className="hover:text-white transition-colors p-1"><User className="w-4 h-4" /></button>
          <button data-testid="top-settings-icon" onClick={() => setShowSettingsDrawer(!showSettingsDrawer)} className="hover:text-white transition-colors p-1"><Settings className="w-4 h-4" /></button>
        </div>

        {activeToast && (
          <div className="absolute top-12 right-0 bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded shadow-lg animate-in fade-in slide-in-from-top-2 border border-gray-700">
            {activeToast}
          </div>
        )}

        {showSettingsDrawer && (
          <div className="absolute top-12 right-0 w-64 bg-[var(--surface)] border border-[var(--luminosity-border)] rounded-md shadow-xl p-4 z-[999] animate-in fade-in slide-in-from-top-2">
            <h3 className="text-white font-bold text-sm mb-3 border-b border-gray-800 pb-2">Global Settings</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Dark Mode</span>
              <div 
                data-testid="dark-mode-toggle"
                className={cn("w-8 h-4 rounded-full relative cursor-pointer transition-colors", isDarkMode ? "bg-[var(--neon-purple)]" : "bg-gray-600")}
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", isDarkMode ? "right-1" : "left-1")}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Telemetry Stream</span>
              <div 
                data-testid="telemetry-toggle"
                className={cn("w-8 h-4 rounded-full relative cursor-pointer transition-colors", isTelemetryEnabled ? "bg-[var(--success-green)]" : "bg-gray-600")}
                onClick={() => setIsTelemetryEnabled(!isTelemetryEnabled)}
              >
                <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", isTelemetryEnabled ? "right-1" : "left-1")}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

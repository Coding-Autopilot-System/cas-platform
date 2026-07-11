import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Cpu, PanelLeftClose, PanelRightClose, Activity, Shield, Box, Plus, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type TreeNodeProps = {
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  onFileClick?: (filename: string) => void;
  currentPath?: string;
};

const TreeNode = ({ label, icon, children, defaultExpanded = false, onFileClick, currentPath = "" }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const fullPath = currentPath ? `${currentPath}/${label}` : label;
  
  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-800/50 rounded-md text-sm text-gray-300 select-none",
          expanded && "text-gray-100"
        )}
        onClick={() => {
          if (children) {
            setExpanded(!expanded);
          } else if (onFileClick && label.endsWith('.md')) {
            onFileClick(fullPath);
          }
        }}
      >
        <span className="w-4 h-4 flex items-center justify-center text-gray-500">
          {children && (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </span>
        <span className="text-blue-400">{icon}</span>
        <span className="font-sans truncate">{label}</span>
      </div>
      {expanded && children && (
        <div className="flex flex-col ml-4 border-l border-gray-800 pl-2 mt-1">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                onFileClick,
                currentPath: fullPath 
              } as Partial<TreeNodeProps>);
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const ENTERPRISE_USE_CASES = [
  // Planning & Requirements
  { id: 'TELEMETRY:USE_CASE_1', label: '1. PRD Generation', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },
  { id: 'TELEMETRY:USE_CASE_2', label: '2. Architecture Mapping', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },
  { id: 'TELEMETRY:USE_CASE_3', label: '3. API Contract Design', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },
  { id: 'TELEMETRY:USE_CASE_4', label: '4. Database Schema Modeling', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },
  { id: 'TELEMETRY:USE_CASE_5', label: '5. User Story Grooming', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },
  { id: 'TELEMETRY:USE_CASE_6', label: '6. UX Wireframe Scaffolding', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },
  { id: 'TELEMETRY:USE_CASE_7', label: '7. Capacity Planning', color: 'text-blue-500', hover: 'group-hover:text-blue-400' },

  // Development & Logic
  { id: 'TELEMETRY:USE_CASE_8', label: '8. Boilerplate Generation', color: 'text-green-500', hover: 'group-hover:text-green-400' },
  { id: 'TELEMETRY:USE_CASE_9', label: '9. Component Implementation', color: 'text-green-500', hover: 'group-hover:text-green-400' },
  { id: 'TELEMETRY:USE_CASE_10', label: '10. Business Logic Scaffolding', color: 'text-green-500', hover: 'group-hover:text-green-400' },
  { id: 'TELEMETRY:USE_CASE_11', label: '11. Database Migration Scripts', color: 'text-green-500', hover: 'group-hover:text-green-400' },
  { id: 'TELEMETRY:USE_CASE_12', label: '12. API Route Creation', color: 'text-green-500', hover: 'group-hover:text-green-400' },
  { id: 'TELEMETRY:USE_CASE_13', label: '13. GraphQL Resolvers', color: 'text-green-500', hover: 'group-hover:text-green-400' },
  { id: 'TELEMETRY:USE_CASE_14', label: '14. State Management Setup', color: 'text-green-500', hover: 'group-hover:text-green-400' },

  // Testing & QA
  { id: 'TELEMETRY:USE_CASE_15', label: '15. Unit Test Generation', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },
  { id: 'TELEMETRY:USE_CASE_16', label: '16. Integration Test Scaffolding', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },
  { id: 'TELEMETRY:USE_CASE_17', label: '17. E2E Playwright Mocking', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },
  { id: 'TELEMETRY:USE_CASE_18', label: '18. Mutation Testing', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },
  { id: 'TELEMETRY:USE_CASE_19', label: '19. Code Coverage Analysis', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },
  { id: 'TELEMETRY:USE_CASE_20', label: '20. Visual Regression Setup', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },
  { id: 'TELEMETRY:USE_CASE_21', label: '21. Chaos Engineering', color: 'text-purple-500', hover: 'group-hover:text-purple-400' },

  // DevSecOps
  { id: 'TELEMETRY:USE_CASE_22', label: '22. SAST Scanning', color: 'text-red-500', hover: 'group-hover:text-red-400' },
  { id: 'TELEMETRY:USE_CASE_23', label: '23. DAST Scanning', color: 'text-red-500', hover: 'group-hover:text-red-400' },
  { id: 'TELEMETRY:USE_CASE_24', label: '24. Dependency Auditing', color: 'text-red-500', hover: 'group-hover:text-red-400' },
  { id: 'TELEMETRY:USE_CASE_25', label: '25. Secrets Detection', color: 'text-red-500', hover: 'group-hover:text-red-400' },
  { id: 'TELEMETRY:USE_CASE_26', label: '26. RBAC Configuration', color: 'text-red-500', hover: 'group-hover:text-red-400' },
  { id: 'TELEMETRY:USE_CASE_27', label: '27. Compliance Validation', color: 'text-red-500', hover: 'group-hover:text-red-400' },
  { id: 'TELEMETRY:USE_CASE_28', label: '28. Container Hardening', color: 'text-red-500', hover: 'group-hover:text-red-400' },

  // Deployment
  { id: 'TELEMETRY:USE_CASE_29', label: '29. CI/CD Orchestration', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },
  { id: 'TELEMETRY:USE_CASE_30', label: '30. Infrastructure as Code', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },
  { id: 'TELEMETRY:USE_CASE_31', label: '31. Kubernetes Manifests', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },
  { id: 'TELEMETRY:USE_CASE_32', label: '32. Helm Chart Gen', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },
  { id: 'TELEMETRY:USE_CASE_33', label: '33. Blue/Green Deploy', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },
  { id: 'TELEMETRY:USE_CASE_34', label: '34. Feature Flag Scaffolding', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },
  { id: 'TELEMETRY:USE_CASE_35', label: '35. Rollback Triggers', color: 'text-orange-500', hover: 'group-hover:text-orange-400' },

  // Maintenance & SRE
  { id: 'TELEMETRY:USE_CASE_36', label: '36. Telemetry Injection', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
  { id: 'TELEMETRY:USE_CASE_37', label: '37. Log Aggregation Setup', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
  { id: 'TELEMETRY:USE_CASE_38', label: '38. Alerting Rules Gen', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
  { id: 'TELEMETRY:USE_CASE_39', label: '39. Auto-Remediation', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
  { id: 'TELEMETRY:USE_CASE_40', label: '40. Incident Post-Mortems', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
  { id: 'TELEMETRY:USE_CASE_41', label: '41. SLA Tracking', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
  { id: 'TELEMETRY:USE_CASE_42', label: '42. Cost Optimization', color: 'text-teal-500', hover: 'group-hover:text-teal-400' },
];

type SidebarProps = {
  onFileClick?: (filename: string) => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
};

export default function Sidebar({ onFileClick, currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const [showNewMission, setShowNewMission] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState<string>('TELEMETRY:LIVE');

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging]);

  if (isCollapsed) {
    return (
      <div className="w-[64px] h-full bg-[var(--surface)] border-r border-[var(--luminosity-border)] flex flex-col items-center py-4 flex-shrink-0 cursor-pointer hover:bg-[var(--surface-bright)] transition-colors z-50" onClick={() => setIsCollapsed(false)}>
        <PanelRightClose className="text-gray-500 w-5 h-5 hover:text-white" />
      </div>
    );
  }

  return (
    <div 
      className="h-full bg-[var(--surface)] border-r border-[var(--luminosity-border)] flex flex-col flex-shrink-0 relative z-50 transition-none"
      style={{ width: `${sidebarWidth}px` }}
    >
      
      {/* Resizer Handle */}
      <div 
        onMouseDown={() => setIsDragging(true)}
        className="absolute top-0 right-[-2px] w-1 h-full cursor-col-resize hover:bg-[var(--electric-cyan)] z-[60] transition-colors"
      />
      
      {/* Top Header Block */}
      <div className="p-4 border-b border-[var(--luminosity-border)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--success-green)]/10 border border-[var(--success-green)]/30 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-[var(--success-green)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">CAS Platform</span>
              <span className="text-[9px] font-mono text-[var(--success-green)] uppercase tracking-widest">Autonomous v4.2</span>
            </div>
          </div>
          <button 
            onClick={() => setIsCollapsed(true)}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={() => setShowNewMission(true)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Mission
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto custom-scrollbar flex-1 pb-24">
        
        {/* Primary Navigation */}
        <div className="flex flex-col gap-1 p-2 border-b border-[var(--luminosity-border)]">
          <button 
            onClick={() => onViewChange?.('orchestrator')} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold text-left",
              currentView === 'orchestrator' ? "bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            )}
          >
            <Activity className="w-4 h-4" /> Visualizer
          </button>
          <button 
            onClick={() => onViewChange?.('vault')} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold text-left",
              currentView === 'vault' ? "bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            )}
          >
            <Box className="w-4 h-4" /> Vault
          </button>
          <button 
            onClick={() => onViewChange?.('reasoning')} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold text-left",
              currentView === 'reasoning' ? "bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            )}
          >
            <FileText className="w-4 h-4" /> Transcript
          </button>
          <button 
            onClick={() => onViewChange?.('governance')} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold text-left",
              currentView === 'governance' ? "bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            )}
          >
            <Shield className="w-4 h-4" /> Audit
          </button>
          <button 
            onClick={() => triggerToast('System Health: Telemetry Loading...')}
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold text-left text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
          >
            <Activity className="w-4 h-4" /> System Health
          </button>
          <button 
            onClick={() => triggerToast('Blueprints: Loading Repository...')}
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-bold text-left text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
          >
            <Folder className="w-4 h-4" /> Blueprints
          </button>
        </div>

        {/* GSD Explorer section */}
        <div className="p-4 pt-4">
          <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">GSD Explorer</h2>
          <div className="pl-1">
            <TreeNode label="cas-platform" icon={<FolderOpen size={14} />} defaultExpanded onFileClick={onFileClick}>
          <TreeNode label=".planning" icon={<Folder size={14} />} defaultExpanded onFileClick={onFileClick}>
            <TreeNode label="phases" icon={<Folder size={14} />} defaultExpanded onFileClick={onFileClick}>
              <TreeNode label="06-PLAN.md" icon={<FileText size={14} />} onFileClick={onFileClick} />
              <TreeNode label="07-PLAN.md" icon={<FileText size={14} />} onFileClick={onFileClick} />
              <TreeNode label="08-PLAN.md" icon={<FileText size={14} />} onFileClick={onFileClick} />
            </TreeNode>
            <TreeNode label="ROADMAP.md" icon={<FileText size={14} />} onFileClick={onFileClick} />
          </TreeNode>
          <TreeNode label="src" icon={<Folder size={14} />} onFileClick={onFileClick}>
            <TreeNode label="graphical-console" icon={<Folder size={14} />} onFileClick={onFileClick} />
          </TreeNode>
            </TreeNode>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex-shrink-0">
          <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 px-2">Live Telemetry</h2>
          <div 
            onClick={() => { setActiveTelemetry('TELEMETRY:LIVE'); onFileClick && onFileClick('TELEMETRY:LIVE'); }}
            className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group", activeTelemetry === 'TELEMETRY:LIVE' ? "bg-gray-800" : "")}
          >
            <Cpu className="text-blue-400 w-4 h-4 group-hover:text-blue-300" />
            <span className={cn("text-sm font-sans font-bold", activeTelemetry === 'TELEMETRY:LIVE' ? "text-white" : "text-gray-300 group-hover:text-white")}>Phase 08 Execution</span>
            <span className={cn("w-1.5 h-1.5 rounded-full ml-auto shadow-[0_0_8px_rgba(34,197,94,0.8)]", activeTelemetry === 'TELEMETRY:LIVE' ? "bg-green-500 animate-pulse" : "bg-gray-600 shadow-none")}></span>
          </div>
        </div>

        <div className="mt-4 pt-4 pb-24 border-t border-gray-800 flex-shrink-0">
          <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 px-2">SDLC Blueprints</h2>
          <div 
            onClick={() => { setActiveTelemetry('TELEMETRY:SDLC_BLUEPRINT'); onFileClick && onFileClick('TELEMETRY:SDLC_BLUEPRINT'); }}
            className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group", activeTelemetry === 'TELEMETRY:SDLC_BLUEPRINT' ? "bg-gray-800" : "")}
          >
            <Cpu className="text-purple-400 w-4 h-4 group-hover:text-purple-300" />
            <span className={cn("text-sm font-sans font-bold", activeTelemetry === 'TELEMETRY:SDLC_BLUEPRINT' ? "text-white" : "text-gray-300 group-hover:text-white")}>GSD Core Loop</span>
          </div>
          <div 
            onClick={() => { setActiveTelemetry('TELEMETRY:ENG_OS_BLUEPRINT'); onFileClick && onFileClick('TELEMETRY:ENG_OS_BLUEPRINT'); }}
            className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group mt-1", activeTelemetry === 'TELEMETRY:ENG_OS_BLUEPRINT' ? "bg-gray-800" : "")}
          >
            <Cpu className="text-pink-400 w-4 h-4 group-hover:text-pink-300" />
            <span className={cn("text-sm font-sans font-bold", activeTelemetry === 'TELEMETRY:ENG_OS_BLUEPRINT' ? "text-white" : "text-gray-300 group-hover:text-white")}>Engineering OS Blueprint</span>
          </div>
          <div 
            onClick={() => { setActiveTelemetry('TELEMETRY:BUG_FIX_BLUEPRINT'); onFileClick && onFileClick('TELEMETRY:BUG_FIX_BLUEPRINT'); }}
            className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group mt-1", activeTelemetry === 'TELEMETRY:BUG_FIX_BLUEPRINT' ? "bg-gray-800" : "")}
          >
            <Cpu className="text-red-400 w-4 h-4 group-hover:text-red-300" />
            <span className={cn("text-sm font-sans font-bold", activeTelemetry === 'TELEMETRY:BUG_FIX_BLUEPRINT' ? "text-white" : "text-gray-300 group-hover:text-white")}>Bug Fix Blueprint</span>
          </div>
          <div 
            onClick={() => { setActiveTelemetry('TELEMETRY:REFACTOR_BLUEPRINT'); onFileClick && onFileClick('TELEMETRY:REFACTOR_BLUEPRINT'); }}
            className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group mt-1", activeTelemetry === 'TELEMETRY:REFACTOR_BLUEPRINT' ? "bg-gray-800" : "")}
          >
            <Cpu className="text-green-400 w-4 h-4 group-hover:text-green-300" />
            <span className={cn("text-sm font-sans font-bold", activeTelemetry === 'TELEMETRY:REFACTOR_BLUEPRINT' ? "text-white" : "text-gray-300 group-hover:text-white")}>Refactoring Blueprint</span>
          </div>
          <div 
            onClick={() => { setActiveTelemetry('TELEMETRY:CICD_BLUEPRINT'); onFileClick && onFileClick('TELEMETRY:CICD_BLUEPRINT'); }}
            className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group mt-1", activeTelemetry === 'TELEMETRY:CICD_BLUEPRINT' ? "bg-gray-800" : "")}
          >
            <Cpu className="text-yellow-400 w-4 h-4 group-hover:text-yellow-300" />
            <span className={cn("text-sm font-sans font-bold", activeTelemetry === 'TELEMETRY:CICD_BLUEPRINT' ? "text-white" : "text-gray-300 group-hover:text-white")}>CI/CD Pipeline Blueprint</span>
          </div>

          <div className="mt-4 mb-2 px-2">
            <h3 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest border-b border-gray-800 pb-1">The 42 Enterprise Use Cases</h3>
          </div>

          {ENTERPRISE_USE_CASES.map((uc, index) => (
            <div 
              key={uc.id}
              onClick={() => { setActiveTelemetry(uc.id); onFileClick && onFileClick(uc.id); }}
              className={cn("flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded-md transition-colors group", index > 0 ? "mt-1" : "", activeTelemetry === uc.id ? "bg-gray-800" : "")}
            >
              <Cpu className={cn("w-4 h-4", uc.color, uc.hover)} />
              <span className={cn("text-sm font-sans font-bold", activeTelemetry === uc.id ? "text-white" : "text-gray-300 group-hover:text-white")}>{uc.label}</span>
            </div>
          ))}
        </div>
        <div className="pb-24 flex-shrink-0"></div>
      </div>

      {/* New Mission Overlay Modal */}
      {showNewMission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="bg-[var(--surface)] border border-[var(--luminosity-border)] p-6 rounded-xl w-[400px] shadow-2xl">
            <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2 font-sans">
              <Plus className="w-5 h-5 text-[var(--electric-cyan)]" /> New Mission Configuration
            </h2>
            <div className="mb-4">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Objective Directives</label>
              <textarea 
                placeholder="Describe the overarching mission objective..." 
                className="w-full h-24 bg-[#0d0d12] border border-[var(--luminosity-border)] p-3 rounded text-white text-sm focus:outline-none focus:border-[var(--electric-cyan)] transition-colors resize-none custom-scrollbar" 
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--luminosity-border)]">
              <button 
                onClick={() => setShowNewMission(false)} 
                className="px-4 py-2 text-gray-400 hover:text-white text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowNewMission(false);
                  onFileClick && onFileClick('TELEMETRY:NEW_MISSION');
                  triggerToast('Swarm Initialization Started...');
                }} 
                className="px-4 py-2 bg-[var(--electric-cyan)] text-black hover:bg-cyan-400 rounded text-sm font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                Initialize Swarm
              </button>
            </div>
          </div>
        </div>
      )}

      {activeToast && (
        <div className="absolute bottom-6 left-6 bg-gray-800 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 border border-gray-700 z-[110]">
          {activeToast}
        </div>
      )}
    </div>
  );
}

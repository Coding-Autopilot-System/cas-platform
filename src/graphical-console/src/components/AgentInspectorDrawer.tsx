import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Square, Settings, Wrench, Fingerprint, Database, CheckCircle, XCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AgentInspectorDrawerProps {
  node: any;
  onClose: () => void;
  onOpenFile: (filename: string) => void;
}

export default function AgentInspectorDrawer({ node, onClose, onOpenFile }: AgentInspectorDrawerProps) {
  const data = node?.data;

  // Regex to find any file ending in .md
  const linkifyText = (text: string) => {
    if (!text) return text;
    const regex = /([a-zA-Z0-9_.-]+\.md)/g;
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (part.match(regex)) {
        return (
          <button 
            key={i} 
            onClick={() => onOpenFile(part)}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/50 hover:decoration-blue-400 transition-colors cursor-pointer font-bold bg-blue-500/10 px-1 rounded-sm"
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedInstructions, setEditedInstructions] = React.useState(data?.instructions || "");
  const [activeToast, setActiveToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEditedInstructions(data?.instructions || "");
    setIsEditing(false);
  }, [node]);

  const handleSaveInstructions = () => {
    // In a real app, this would post to an API
    setIsEditing(false);
  };

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: 600, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 600, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-[550px] bg-[#12121a]/95 backdrop-blur-2xl border-l border-gray-700/50 shadow-2xl p-6 z-50 flex flex-col overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white font-sans tracking-wide flex items-center gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Fingerprint className="text-purple-400 w-6 h-6" />
                {data?.label || "Agent"}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs text-green-400 font-mono tracking-wider uppercase">
                  STATUS: {data?.status || "IDLE"}
                </p>
              </div>
            </div>
            <button 
              data-testid="close-agent-inspector-btn"
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* HITL Controls */}
          <div className="flex gap-3 mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <button 
              data-testid="resume-agent-btn"
              onClick={() => triggerToast('Agent Execution Resumed')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.1)]"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
            <button 
              data-testid="halt-agent-btn"
              onClick={() => triggerToast('Agent Execution Halted via HITL')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.1)]"
            >
              <Square className="w-4 h-4 fill-current" />
              Halt Agent
            </button>
          </div>

          <div className="space-y-6">
            {/* Persona & Instructions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-300 font-sans flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-400" />
                  System Prompt / Instructions
                </h3>
                <button 
                  onClick={() => isEditing ? handleSaveInstructions() : setIsEditing(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-500/10 rounded-md font-bold transition-colors"
                >
                  {isEditing ? "Save Changes" : "Edit Prompt"}
                </button>
              </div>
              <div className="p-4 bg-[#0d0d12] rounded-xl border border-gray-800 text-sm text-gray-400 font-mono leading-relaxed min-h-[100px]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {isEditing ? (
                  <textarea 
                    className="w-full h-full bg-transparent outline-none border-none resize-y text-gray-300 min-h-[100px]"
                    value={editedInstructions}
                    onChange={(e) => setEditedInstructions(e.target.value)}
                    autoFocus
                  />
                ) : (
                  linkifyText(editedInstructions || "No custom instructions found for this agent.")
                )}
              </div>
            </div>

            {/* State Memory */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 font-sans mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-yellow-400" />
                Internal Memory State
              </h3>
              <div className="p-4 bg-[#0d0d12] rounded-xl border border-gray-800 text-sm text-yellow-200/70 font-mono whitespace-pre-wrap" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {linkifyText(data?.memory || "{}")}
              </div>
            </div>

            {/* AI Tool Workflows */}
            {data?.tools && data.tools.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-300 font-sans mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-green-400" />
                  Tool Execution Traces
                </h3>
                <div className="space-y-3">
                  {data.tools.map((tool: any, idx: number) => (
                    <div key={idx} className="bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-black/40 border-b border-gray-800">
                        <span className="font-mono text-sm text-green-400 font-bold">{tool.name}</span>
                        {tool.result.includes("Success") ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="p-3">
                        <SyntaxHighlighter
                          language="json"
                          style={vscDarkPlus}
                          customStyle={{ background: 'transparent', margin: 0, padding: 0, fontSize: '12px' }}
                        >
                          {JSON.stringify(tool, null, 2)}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Trace Logs */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 font-sans mb-3 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-gray-400" />
                Live Execution Logs
              </h3>
              <div className="p-4 bg-black rounded-xl border border-gray-800 text-xs text-gray-300 font-mono whitespace-pre-wrap leading-loose" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {linkifyText(data?.logs || "Waiting for execution traces...")}
                <span className="animate-pulse">_</span>
              </div>
            </div>
            
          </div>
          
          {activeToast && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 border border-gray-700 z-50 whitespace-nowrap">
              {activeToast}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

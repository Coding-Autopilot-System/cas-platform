import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, TerminalSquare } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TelemetryDrawerProps {
  edge: any;
  onClose: () => void;
}

export default function TelemetryDrawer({ edge, onClose }: TelemetryDrawerProps) {
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(edge.data?.payload || '{\n  "error": "No payload"\n}');
    triggerToast('JSON Payload copied to clipboard');
  };

  return (
    <AnimatePresence>
      {edge && (
        <motion.div
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 500, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-[450px] bg-[#12121a]/95 backdrop-blur-2xl border-l border-gray-700/50 shadow-2xl p-6 z-50 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-sans tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                A2A Telemetry Payload
              </h2>
              <p className="text-xs text-purple-400 font-mono mt-1 tracking-wider uppercase">
                {edge.source} &rarr; {edge.target}
              </p>
            </div>
            <button 
              data-testid="close-telemetry-btn"
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-[#0d0d12] rounded-xl border border-gray-800 custom-scrollbar">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{ background: 'transparent', margin: 0, padding: '1.5rem', fontSize: '13px', fontFamily: '"JetBrains Mono", monospace' }}
              wrapLines={true}
            >
              {edge.data?.payload || '{\n  "error": "No payload data attached to this event stream"\n}'}
            </SyntaxHighlighter>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button 
              data-testid="copy-json-btn"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy JSON
            </button>
            <button 
              data-testid="inject-prompt-btn"
              onClick={() => triggerToast('Prompt Injection Interface Opened')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <TerminalSquare className="w-4 h-4" />
              Inject Prompt
            </button>
          </div>

          {activeToast && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 border border-gray-700 z-[60] whitespace-nowrap">
              {activeToast}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

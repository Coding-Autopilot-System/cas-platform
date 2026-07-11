import React, { useState, useEffect } from 'react';
import { Terminal, Loader2 } from 'lucide-react';
import A2UISurface from './a2ui/A2UISurface';

interface ReasoningTranscriptProps {
  telemetryUrl?: string;
  onPromptSubmit?: (prompt: string) => void;
}

export default function ReasoningTranscript({ telemetryUrl = 'http://127.0.0.1:8000/api/swarm/events', onPromptSubmit }: ReasoningTranscriptProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [promptInput, setPromptInput] = useState('');

  useEffect(() => {
    // If not live-brain, just do normal connection logic
    if (telemetryUrl?.includes('live-brain')) {
      setIsConnecting(true);
      setLogs(['> [SYSTEM] Attempting to connect to Live Brain (Gemini CLI Transcript)...']);
      
      const es = new EventSource('/api/live-brain');
      
      es.onmessage = (event) => {
        setIsConnecting(false);
        try {
          const data = JSON.parse(event.data);
          if (data.text) {
            setLogs(prev => [...prev, data.text]);
          }
        } catch (e) {}
      };

      return () => {
        es.close();
      };
    } else {
      setIsConnecting(true);
      setLogs([]);
      const connectionTimer = setTimeout(() => {
        setIsConnecting(false);
        setLogs([`> [SYSTEM] Secured WebSocket to Swarm Mesh. Engine Ready.`]);
      }, 1000);
      return () => clearTimeout(connectionTimer);
    }
  }, [telemetryUrl]);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const userPrompt = promptInput.trim();
    setPromptInput('');
    onPromptSubmit?.(userPrompt);

    setLogs(prev => [
      ...prev,
      `\n> [USER PROMPT INJECTED]: "${userPrompt}"`,
    ]);

    try {
      // Connect to the real Next.js backend!
      const response = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, llmEngine: 'Antigravity' })
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          // SSE format: data: {"text": "..."}\n\n
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.text) {
                  setLogs(prev => [...prev, data.text]);
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      setLogs(prev => [...prev, `> [ERROR] Failed to connect to Backend API`]);
    }
  };

  return (
    <div data-testid="reasoning-transcript" className="h-[240px] w-full bg-[#0d0d12]/95 backdrop-blur-xl flex flex-col font-mono" style={{ fontFamily: '"JetBrains Mono", var(--font-mono)', fontVariationSettings: "'wght' 380" }}>
      <div className="flex items-center gap-2 p-2 px-4 bg-[#16161e]/90 border-b border-[var(--luminosity-border)]">
        {isConnecting ? (
          <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
        ) : (
          <Terminal className="w-4 h-4 text-green-400" />
        )}
        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
          {isConnecting ? 'Connecting to Stream...' : 'Live Reasoning Transcript'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed min-h-[150px]">
        {logs.map((log, idx) => {
          if (typeof log === 'string' && log.startsWith('A2UI_PAYLOAD:')) {
            try {
              const payload = JSON.parse(log.replace('A2UI_PAYLOAD:', ''));
              return <A2UISurface key={idx} payload={payload} onAction={(action, data) => {
                setLogs(prev => [...prev, `> [OPERATOR ACTION]: ${action} received for component ${data?.id}`]);
              }} />;
            } catch (e) {
              return <div key={idx} className="text-red-500">Failed to render A2UI payload</div>;
            }
          }

          return (
            <div key={idx} className="mb-1">
              <span className="text-gray-500 mr-2">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
              <span className={
                (log || '').includes('[THOUGHT]') ? 'text-blue-400' :
                (log || '').includes('[ACTION]') ? 'text-yellow-400' :
                (log || '').includes('[OBSERVATION]') ? 'text-purple-400' :
                (log || '').includes('[OPERATOR ACTION]') ? 'text-green-400 font-bold' :
                'text-gray-300'
              }>
                {log}
              </span>
            </div>
          );
        })}
        {!isConnecting && <div className="animate-pulse text-gray-500">_</div>}
      </div>

      {/* Interactive Prompt UI */}
      <div className="p-3 border-t border-gray-800 bg-[#08080b]">
        <form onSubmit={handlePromptSubmit} className="flex items-center gap-3 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 shadow-inner focus-within:border-[var(--neon-purple)] focus-within:ring-1 focus-within:ring-[var(--neon-purple)] transition-all">
          <span className="text-[var(--neon-purple)] font-bold text-sm animate-pulse">❯</span>
          <input
            type="text"
            data-testid="interactive-prompt-input"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Inject a prompt to the Swarm (e.g. 'Generate a new API route')"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 font-mono"
            disabled={isConnecting}
          />
        </form>
      </div>
    </div>
  );
}

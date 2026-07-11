import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, Zap, BrainCircuit, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const getNodeConfig = (type: string) => {
  if (type === 'meta') return { icon: <BrainCircuit className="w-5 h-5 text-purple-400" />, color: 'purple' };
  if (type === 'agent') return { icon: <Bot className="w-5 h-5 text-green-400" />, color: 'green' };
  if (type === 'sandbox') return { icon: <Zap className="w-5 h-5 text-yellow-400" />, color: 'yellow' };
  return { icon: <Activity className="w-5 h-5 text-blue-400" />, color: 'blue' };
};

export default function AgentNode({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }: any) {
  const { icon, color } = getNodeConfig(data.type);
  
  const colorMap: Record<string, string> = {
    purple: 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    green: 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    yellow: 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    blue: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  };

  const isWorking = data.status && data.status.toLowerCase().includes('ing');

  return (
    <div className={cn(
      "w-[240px] rounded-lg bg-[var(--surface)] border transition-transform hover:scale-105 duration-200 overflow-hidden flex shadow-lg",
      colorMap[color],
      isWorking && "animate-pulse"
    )}>
      <Handle type="target" position={targetPosition} className="w-2 h-2 bg-gray-500 border-none opacity-0" />
      
      {/* Left Icon Block */}
      <div className="w-12 flex flex-col items-center justify-center bg-white/5 border-r border-[var(--luminosity-border)]">
        {icon}
      </div>

      {/* Right Content Block */}
      <div className="flex flex-col flex-1 py-2 px-3">
        <span className="font-bold text-sm text-gray-200 font-sans truncate tracking-wide">{data.label}</span>
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate mt-0.5 font-mono">
          {data.status}
        </span>
      </div>
      
      <Handle type="source" position={sourcePosition} className="w-2 h-2 bg-gray-500 border-none opacity-0" />
    </div>
  );
}

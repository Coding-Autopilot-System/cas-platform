import React from 'react';
import { NodeProps } from '@xyflow/react';

export default function PhaseNode({ data }: NodeProps) {
  return (
    <div className="w-full h-full min-w-[800px] min-h-[600px] bg-[#1a1a24]/30 backdrop-blur-3xl border-2 border-dashed border-gray-700/50 rounded-3xl p-6 shadow-2xl relative">
      <div className="absolute -top-16 left-0 flex flex-col">
        <span className="text-xs text-blue-400 font-mono uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md w-fit">
          SDLC Phase Execution
        </span>
        <h2 className="text-xl font-extrabold text-gray-300 font-sans mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {data.label as string}
        </h2>
        <span className="text-sm text-green-400 font-mono mt-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {data.status as string}
        </span>
      </div>
    </div>
  );
}

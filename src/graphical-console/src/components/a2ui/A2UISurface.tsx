import React from 'react';
import { CheckCircle, XCircle, BarChart3, Database } from 'lucide-react';
import { cn } from '../Sidebar';

type A2UIComponent = {
  type: string;
  id: string;
  props?: Record<string, any>;
  children?: A2UIComponent[];
};

export interface A2UISurfaceProps {
  payload: A2UIComponent;
  onAction?: (action: string, payload?: any) => void;
}

export default function A2UISurface({ payload, onAction }: A2UISurfaceProps) {
  
  const renderComponent = (comp: A2UIComponent): React.ReactNode => {
    switch (comp.type) {
      case 'Container':
        return (
          <div key={comp.id} className={cn("flex flex-col gap-3 p-4 rounded-xl border border-gray-800 bg-[#0d0d12]/80", comp.props?.className)}>
            {comp.props?.title && <h3 className="text-sm font-bold text-white mb-2">{comp.props.title}</h3>}
            {comp.children?.map(renderComponent)}
          </div>
        );

      case 'ApprovalGate':
        return (
          <div key={comp.id} className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <h4 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {comp.props?.title || 'Human Approval Required'}
            </h4>
            <p className="text-xs text-gray-400 mb-4">{comp.props?.description}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => onAction?.('APPROVE', { id: comp.id })}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/40 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Approve
              </button>
              <button 
                onClick={() => onAction?.('REJECT', { id: comp.id })}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        );

      case 'Chart':
        return (
          <div key={comp.id} className="h-32 w-full bg-black/40 rounded-lg border border-gray-800 flex items-end justify-between p-4 gap-2">
            <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-mono flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> {comp.props?.title}
            </div>
            {comp.props?.data?.map((val: number, i: number) => (
              <div 
                key={i} 
                className="w-full bg-[var(--neon-purple)] rounded-t-sm opacity-80" 
                style={{ height: `${Math.max(10, val)}%` }}
              />
            ))}
          </div>
        );

      case 'SchemaViewer':
        return (
          <div key={comp.id} className="bg-[#16161e] border border-blue-500/20 rounded-lg overflow-hidden font-mono text-xs">
            <div className="bg-blue-900/20 px-3 py-2 border-b border-blue-500/20 flex items-center gap-2 text-blue-300 font-bold">
              <Database className="w-4 h-4" />
              {comp.props?.tableName || 'Table'}
            </div>
            <div className="p-3 grid grid-cols-3 gap-2 text-gray-400">
              <div className="font-bold text-gray-300">Column</div>
              <div className="font-bold text-gray-300">Type</div>
              <div className="font-bold text-gray-300">Constraint</div>
              {comp.props?.columns?.map((col: any, i: number) => (
                <React.Fragment key={i}>
                  <div className="text-blue-300">{col.name}</div>
                  <div className="text-yellow-200">{col.type}</div>
                  <div className="text-gray-500">{col.constraint || '-'}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );

      case 'Text':
        return <p key={comp.id} className={cn("text-xs text-gray-300", comp.props?.className)}>{comp.props?.content}</p>;

      default:
        return <div key={comp.id} className="text-red-500 text-xs">Unknown A2UI Component: {comp.type}</div>;
    }
  };

  return (
    <div className="w-full a2ui-surface animate-in fade-in zoom-in-95 duration-300 my-2">
      {renderComponent(payload)}
    </div>
  );
}

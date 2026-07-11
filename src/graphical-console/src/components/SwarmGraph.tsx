'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Edge,
  Position,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import AgentNode from './AgentNode';
import PhaseNode from './PhaseNode';
import TelemetryDrawer from './TelemetryDrawer';
import AgentInspectorDrawer from './AgentInspectorDrawer';

const DataPulseEdge = ({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, label, labelStyle, labelBgStyle
}: any) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} id={id} />
      <circle r="4" fill="var(--electric-cyan)" filter="drop-shadow(0 0 4px var(--electric-cyan))">
        <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: labelBgStyle?.fill || 'rgba(20, 19, 19, 0.9)',
              padding: '2px 8px',
              borderRadius: labelBgStyle?.rx || 6,
              fontSize: labelStyle?.fontSize || 11,
              fontWeight: labelStyle?.fontWeight || 600,
              fontFamily: labelStyle?.fontFamily || 'Inter',
              color: labelStyle?.fill || '#e5e7eb',
              pointerEvents: 'all',
              zIndex: 10,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const dagreGraph = new dagre.graphlib.Graph({ compound: true });
dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 120 });
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 220;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  nodes.forEach((node) => {
    if (node.type === 'phaseGroup') {
      dagreGraph.setNode(node.id, { label: node.id });
    } else {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
    if (node.parentId) {
      dagreGraph.setParent(node.id, node.parentId);
    }
  });
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Group nodes get positioned by Dagre, but we don't apply target/source handles to them
    if (node.type === 'phaseGroup') {
      const paddingW = 100;
      const paddingH = 150;
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWithPosition.width / 2 - paddingW / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2 - paddingH / 2,
        },
        style: { width: nodeWithPosition.width + paddingW, height: nodeWithPosition.height + paddingH },
      };
    }

    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      // React Flow requires child positions to be relative to the parent.
      // Dagre returns absolute positions, so if there is a parent, we must subtract the parent's absolute position.
      position: node.parentId ? {
        x: nodeWithPosition.x - nodeWidth / 2 - (dagreGraph.node(node.parentId).x - dagreGraph.node(node.parentId).width / 2),
        y: nodeWithPosition.y - nodeHeight / 2 - (dagreGraph.node(node.parentId).y - dagreGraph.node(node.parentId).height / 2),
      } : {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
  return { nodes: layoutedNodes, edges };
};

export default function SwarmGraph({ onOpenFile, telemetryUrl = 'http://127.0.0.1:8000/api/swarm/events', pulseTrigger = 0 }: { onOpenFile?: (filename: string) => void, telemetryUrl?: string, pulseTrigger?: number }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [metrics, setMetrics] = useState({ 
    activeSwarms: 1, nodeCount: 0, a2aRate: 0, 
    ttft: "0.0s", total_tokens: "0", est_cost: "$0.00", tool_success_rate: "0%" 
  });
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const nodeTypes = useMemo(() => ({ customNode: AgentNode, phaseGroup: PhaseNode }), []);
  const edgeTypes = useMemo(() => ({ pulse: DataPulseEdge }), []);

  const activeBlueprintName = useMemo(() => {
    if (telemetryUrl.includes('engineering-os')) return 'Engineering OS Blueprint';
    if (telemetryUrl.includes('bug-fix')) return 'Bug Fix Blueprint';
    if (telemetryUrl.includes('refactor')) return 'Refactoring Blueprint';
    if (telemetryUrl.includes('cicd')) return 'CI/CD Orchestration';
    if (telemetryUrl.includes('use_case')) {
      const match = telemetryUrl.match(/use_case\/(\d+)/);
      return match ? `Use Case ${match[1]} Blueprint` : 'Use Case Blueprint';
    }
    if (telemetryUrl.includes('blueprint/phase')) {
      const match = telemetryUrl.match(/phase(\d+\.\d+)/) || telemetryUrl.match(/phase(\d+)/);
      return match ? `Phase ${match[1]} Blueprint` : 'Phase Blueprint';
    }
    if (telemetryUrl.includes('mission_init')) return 'Mission Initialization';
    if (telemetryUrl.includes('deployment/prod')) return 'Production Deployment';
    if (telemetryUrl.includes('sdlc/blueprint')) return 'SDLC Master Blueprint';
    return 'Global Live Stream';
  }, [telemetryUrl]);

  useEffect(() => {
    // Connect to dynamic SSE telemetry stream
    const eventSource = new EventSource(telemetryUrl);
    
    // Clear nodes/edges when switching modes
    setNodes([]);
    setEdges([]);
    let messageCount = 0;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({ ...prev, a2aRate: messageCount }));
      messageCount = 0;
    }, 1000);

    let currentNodes: Node[] = [];
    let currentEdges: Edge[] = [];

    const applyLayout = (n: Node[], e: Edge[]) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(n, e, 'TB');
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      currentNodes = layoutedNodes;
      currentEdges = layoutedEdges;
    };

    eventSource.addEventListener('snapshot', (e) => {
      const data = JSON.parse(e.data);
      const newNodes = data.nodes.map((n: any) => ({
        id: n.id,
        type: n.type === 'phaseGroup' ? 'phaseGroup' : 'customNode',
        data: n,
        position: { x: 0, y: 0 },
        parentId: n.parentId,
        style: n.style,
      }));
      const parsedEdges = (data.edges || []).map((ev: any) => {
        const edgeData = ev.data ? ev.data : ev;
        return {
          id: edgeData.id,
          source: edgeData.source,
          target: edgeData.target,
          animated: false,
          type: 'pulse',
          style: edgeData.style || { stroke: '#a855f7', strokeWidth: 2, filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))' },
          label: edgeData.label,
          labelStyle: { fill: '#e5e7eb', fontWeight: 600, fontFamily: 'Inter', fontSize: 11 },
          labelBgStyle: { fill: '#141313', fillOpacity: 0.9, rx: 6, ry: 6 },
          data: { payload: `{\n  "source": "${edgeData.source}",\n  "target": "${edgeData.target}",\n  "action": "${edgeData.label}"\n}` }
        };
      });
      applyLayout(newNodes, parsedEdges);
      setMetrics(prev => ({ 
        ...prev, 
        nodeCount: newNodes.length,
        ...(data.metrics || {})
      }));
    });

    eventSource.addEventListener('node_created', (e) => {
      messageCount++;
      const data = JSON.parse(e.data);
      const newNode: Node = { 
        id: data.id, 
        type: data.type === 'phaseGroup' ? 'phaseGroup' : 'customNode', 
        data: data, 
        position: { x: 0, y: 0 },
        parentId: data.parentId,
        style: data.style,
      };
      const newNodes = [...currentNodes, newNode];
      applyLayout(newNodes, currentEdges);
      setMetrics(prev => ({ ...prev, nodeCount: newNodes.length }));
    });

    eventSource.addEventListener('node_update', (e) => {
      messageCount++;
      const data = JSON.parse(e.data);
      const updatedNodes = currentNodes.map(n => {
        if (n.id === data.id) {
          const newLogs = data.appendLogs ? (n.data.logs || '') + data.appendLogs + '\n' : (data.logs || n.data.logs);
          return { ...n, data: { ...n.data, ...data, logs: newLogs } };
        }
        return n;
      });
      applyLayout(updatedNodes, currentEdges);
    });

    eventSource.addEventListener('edge_created', (e) => {
      messageCount++;
      const data = JSON.parse(e.data);
      const newEdge: Edge = {
        id: data.id,
        source: data.source,
        target: data.target,
        animated: false,
        type: 'pulse',
        style: { stroke: '#a855f7', strokeWidth: 2, filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))' },
        label: data.label,
        labelStyle: { fill: '#e5e7eb', fontWeight: 600, fontFamily: 'Inter', fontSize: 11 },
        labelBgStyle: { fill: '#141313', fillOpacity: 0.9, rx: 6, ry: 6 },
        data: { payload: `{\n  "source": "${data.source}",\n  "target": "${data.target}",\n  "action": "${data.label}",\n  "timestamp": "${new Date().toISOString()}"\n}` }
      };
      applyLayout(currentNodes, [...currentEdges, newEdge]);
    });

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, [telemetryUrl]);

  useEffect(() => {
    if (pulseTrigger > 0 && nodes.length > 0) {
      const metaNode = nodes.find(n => n.data?.type === 'meta') || nodes[0];
      const targetNode = nodes.find(n => n.id !== metaNode.id && n.data?.type === 'agent') || (nodes.length > 1 ? nodes[1] : nodes[0]);
      
      const pulseEdge: Edge = {
        id: `pulse-${Date.now()}`,
        source: metaNode.id,
        target: targetNode.id,
        animated: false,
        type: 'pulse',
        style: { stroke: '#06b6d4', strokeWidth: 3, filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' },
        label: 'INJECTED_PROMPT',
        labelStyle: { fill: '#e5e7eb', fontWeight: 800, fontFamily: 'Inter', fontSize: 10 },
        labelBgStyle: { fill: '#0a0a0a', fillOpacity: 0.9, rx: 4, ry: 4 },
      };
      
      setEdges(prev => [...prev, pulseEdge]);
      
      // Remove it after 2 seconds
      setTimeout(() => {
        setEdges(prev => prev.filter(e => e.id !== pulseEdge.id));
      }, 2000);
    }
  }, [pulseTrigger]);

  return (
    <div className="w-full h-full bg-[var(--bg-primary)] relative overflow-hidden font-sans">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={(e, edge) => { setSelectedEdge(edge); setSelectedNode(null); }}
        onNodeClick={(e, node) => { setSelectedNode(node); setSelectedEdge(null); }}
        fitView
        className="dark"
        colorMode="dark"
        defaultEdgeOptions={{ type: 'pulse' }}
      >
        <Controls className="bg-[var(--surface)] border-[var(--luminosity-border)] fill-white !rounded-lg overflow-hidden shadow-xl" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data.type === 'meta') return '#a855f7';
            if (n.data.type === 'agent') return '#22c55e';
            if (n.data.type === 'sandbox') return '#f59e0b';
            return '#06b6d4';
          }}
          maskColor="rgba(10, 10, 10, 0.85)"
          style={{ backgroundColor: '#141313', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1a1a1a" />
      </ReactFlow>
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 bg-[var(--surface)]/20 border border-[var(--luminosity-border)] p-3 rounded-xl shadow-lg backdrop-blur-sm pointer-events-none z-10 w-52">
        <h1 className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--neon-purple)] mb-1 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
          CAS Visual Orchestrator
        </h1>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--success-green)] animate-pulse" />
          <p className="text-[9px] text-[var(--success-green)] font-mono tracking-widest truncate">
            {activeBlueprintName.toUpperCase()}
          </p>
        </div>
        <div className="space-y-1.5 pt-2 border-t border-gray-800/50">
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Swarms:</span>
            <span className="text-[var(--success-green)] font-bold">{metrics.activeSwarms}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Nodes:</span>
            <span className="font-bold text-[var(--electric-cyan)]">{metrics.nodeCount}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>A2A/sec:</span>
            <span className="font-bold text-[var(--neon-purple)]">{metrics.a2aRate}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>TTFT:</span>
            <span className="font-bold text-[var(--warning-amber)]">{metrics.ttft}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Tokens:</span>
            <span className="font-bold text-gray-200">{metrics.total_tokens}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Tool Success:</span>
            <span className="font-bold text-[var(--success-green)]">{metrics.tool_success_rate}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-1.5 border-t border-gray-800/50 mt-1">
            <span>Est. Cost:</span>
            <span className="font-bold text-red-400">{metrics.est_cost}</span>
          </div>
        </div>
      </div>

      <TelemetryDrawer edge={selectedEdge} onClose={() => setSelectedEdge(null)} />
      <AgentInspectorDrawer 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
        onOpenFile={(filename) => onOpenFile && onOpenFile(filename)}
      />
    </div>
  );
}

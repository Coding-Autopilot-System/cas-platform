import React, { useState } from 'react';
import { Network, Terminal, Code, GitMerge, FileEdit, Database, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from './Sidebar';

type TraceNode = {
  id: string;
  type: 'task' | 'thought' | 'tool' | 'diff' | 'error';
  title: string;
  timestamp: string;
  duration?: string;
  content?: string;
  children?: TraceNode[];
  isExpanded?: boolean;
};

const MOCK_TRACE: TraceNode[] = [
  {
    id: 't1',
    type: 'task',
    title: 'Mission: Scaffold Event-Driven Authentication Module',
    timestamp: '13:42:01.000',
    duration: '42.3s',
    isExpanded: true,
    children: [
      {
        id: 't1-1',
        type: 'thought',
        title: 'Architect Agent: Analyze Requirements',
        timestamp: '13:42:01.120',
        content: `I need to implement a JWT-based authentication module that publishes 'user.created' events to Kafka.
        
1. Check existing directory structure in src/auth.
2. Read the database schema for the User model.
3. Write the JWT service and Kafka producer.`,
      },
      {
        id: 't1-2',
        type: 'tool',
        title: 'Call: grep_search(query: "User", path: "src/db/schema.prisma")',
        timestamp: '13:42:02.400',
        duration: '1.2s',
        content: `> Searching for "User" model in schema.prisma...

[MATCH] src/db/schema.prisma:14
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}`,
      },
      {
        id: 't1-3',
        type: 'thought',
        title: 'Developer Agent: Draft Implementation',
        timestamp: '13:42:05.100',
        content: 'The schema has email and password. I will use bcrypt for hashing and jsonwebtoken for the token. I also need to initialize a Kafka producer.',
      },
      {
        id: 't1-4',
        type: 'diff',
        title: 'File Edit: src/auth/service.ts',
        timestamp: '13:42:15.550',
        duration: '10.4s',
        content: `--- a/src/auth/service.ts
+++ b/src/auth/service.ts
@@ -1,5 +1,18 @@
-export class AuthService {
-  // TODO: implement
-}
+import bcrypt from 'bcrypt';
+import jwt from 'jsonwebtoken';
+import { kafkaProducer } from '../lib/kafka';
+
+export class AuthService {
+  async registerUser(email: string, pass: string) {
+    const hashed = await bcrypt.hash(pass, 10);
+    const user = await db.user.create({ data: { email, password: hashed } });
+    
+    await kafkaProducer.send({
+      topic: 'user.events',
+      messages: [{ key: user.id, value: JSON.stringify({ event: 'user.created', email }) }]
+    });
+    
+    return jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
+  }
+}`,
      },
      {
        id: 't1-5',
        type: 'tool',
        title: 'Call: run_command(npm run test:auth)',
        timestamp: '13:42:26.100',
        duration: '14.2s',
        content: `> npm run test:auth
        
PASS src/auth/service.test.ts
✓ should register user and emit kafka event (450ms)
✓ should hash password correctly (120ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total`,
      },
      {
        id: 't1-6',
        type: 'task',
        title: 'Mission Accomplished. Code pushed to Artifact Vault.',
        timestamp: '13:42:43.300',
      }
    ]
  }
];

export default function ReasoningEngineView() {
  const [selectedNode, setSelectedNode] = useState<TraceNode | null>(MOCK_TRACE[0].children![3]);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'thought': return <Network className="w-4 h-4 text-purple-400" />;
      case 'tool': return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'diff': return <FileEdit className="w-4 h-4 text-blue-400" />;
      case 'error': return <Database className="w-4 h-4 text-red-500" />;
      default: return <Code className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderTree = (nodes: TraceNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="w-full">
        <div 
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 cursor-pointer text-sm font-mono transition-colors",
            selectedNode?.id === node.id && "bg-white/10 border-l-2 border-[var(--neon-purple)]"
          )}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            if (node.content || node.type === 'diff') {
              setSelectedNode(node);
            }
          }}
        >
          {node.children ? <ChevronDown className="w-3 h-3 text-gray-500" /> : <div className="w-3" />}
          {renderIcon(node.type)}
          <span className={cn("truncate flex-1", node.type === 'task' ? 'text-white font-bold' : 'text-gray-300')}>
            {node.title}
          </span>
          <span className="text-[10px] text-gray-500">{node.duration || node.timestamp.split('.')[1]}</span>
        </div>
        {node.children && node.isExpanded !== false && (
          <div className="w-full">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex-1 flex flex-row bg-[var(--background)] overflow-hidden">
      {/* Left Pane: Trace Tree */}
      <div className="w-[400px] border-r border-[var(--luminosity-border)] flex flex-col bg-black/40 shrink-0">
        <div className="h-12 border-b border-[var(--luminosity-border)] flex items-center px-4 shrink-0 bg-[var(--surface)]/50">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[var(--neon-purple)]" />
            Execution Trace
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {renderTree(MOCK_TRACE)}
        </div>
      </div>

      {/* Right Pane: Inspector */}
      <div className="flex-1 flex flex-col bg-[#0a0a0f] relative min-w-0">
        <div className="h-12 border-b border-[var(--luminosity-border)] flex items-center px-6 shrink-0 justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 truncate pr-4">
            {selectedNode && renderIcon(selectedNode.type)}
            {selectedNode ? selectedNode.title : 'Inspector'}
          </h2>
          {selectedNode && (
            <span className="text-xs font-mono text-gray-500 shrink-0">{selectedNode.timestamp}</span>
          )}
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedNode ? (
            <div className="max-w-4xl">
              {selectedNode.type === 'diff' ? (
                <div className="bg-[#111118] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a24] border-b border-gray-800 text-xs font-mono text-gray-400">
                    <FileEdit className="w-3 h-3 text-blue-400" />
                    Target: src/auth/service.ts
                  </div>
                  <pre className="p-4 text-[13px] font-mono leading-relaxed overflow-x-auto">
                    <code>
                      {selectedNode.content?.split('\n').map((line, i) => {
                        let color = 'text-gray-300';
                        let bg = 'bg-transparent';
                        if (line.startsWith('+')) { color = 'text-green-400'; bg = 'bg-green-400/10'; }
                        else if (line.startsWith('-')) { color = 'text-red-400'; bg = 'bg-red-400/10'; }
                        else if (line.startsWith('@@')) color = 'text-blue-400';
                        return (
                          <div key={i} className={cn("px-2 w-full whitespace-pre", color, bg)}>
                            {line}
                          </div>
                        );
                      })}
                    </code>
                  </pre>
                </div>
              ) : selectedNode.type === 'tool' ? (
                <div className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-xl">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs font-mono text-gray-400">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    STDOUT
                  </div>
                  <pre className="p-4 text-[13px] font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {selectedNode.content}
                  </pre>
                </div>
              ) : (
                <div className="bg-[#16161e]/50 border border-purple-500/20 rounded-lg p-6 shadow-xl prose prose-invert max-w-none">
                  <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Network className="w-5 h-5" />
                    <h3 className="text-lg font-bold m-0 text-white">Internal LLM Reasoning</h3>
                  </div>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {selectedNode.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 h-full">
              <Code className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a trace node to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

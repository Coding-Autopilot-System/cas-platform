import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, llmEngine } = await req.json();

    // Prepare a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Helper to send SSE messages
        const sendEvent = (data: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: data })}\n\n`));
        };

        const apiKey = process.env.GEMINI_API_KEY;

        sendEvent(`> [SYSTEM] Connecting to Backend Swarm...`);
        sendEvent(`> [ACTION] Meta-Manager routing prompt to Orchestrator Node...`);

        if (apiKey && (llmEngine === 'Antigravity' || !llmEngine)) {
          sendEvent(`> [SYSTEM] Live Gemini Key detected! Calling Real AI...`);
          try {
            const ai = new GoogleGenAI({ apiKey });
            // Simple call for this phase
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `You are a swarm Orchestrator agent inside a Visual Dashboard. 
              The user has sent this prompt: "${prompt}". 
              Respond with a thought process starting with "> [THOUGHT] " and then an action. 
              If they ask for metrics, return a JSON block starting with A2UI_PAYLOAD: {"type":"Chart"...}.`
            });
            
            const text = response.text || '';
            const lines = text.split('\n');
            for (const line of lines) {
              if (line.trim()) {
                sendEvent(line);
                await new Promise(r => setTimeout(r, 400));
              }
            }
          } catch (e: any) {
            sendEvent(`> [ERROR] Gemini API failed: ${e.message}`);
          }
        } else {
          // Fallback Mock Engine
          sendEvent(`> [THOUGHT] No API Key found or using Fallback Mock Engine for: ${llmEngine}`);
          await new Promise(r => setTimeout(r, 800));
          sendEvent(`> [THOUGHT] Analyzing injected context: "${prompt.substring(0, 30)}..."`);
          
          await new Promise(r => setTimeout(r, 1000));
          if (prompt.toLowerCase().includes('schema')) {
            sendEvent(`> [OBSERVATION] Found database context. Generating schema visualization...`);
            sendEvent(`A2UI_PAYLOAD:` + JSON.stringify({
              type: 'SchemaViewer',
              id: 'schema-1',
              props: {
                tableName: 'users',
                columns: [
                  { name: 'id', type: 'uuid', constraint: 'PRIMARY KEY' },
                  { name: 'email', type: 'varchar', constraint: 'UNIQUE' },
                  { name: 'role', type: 'enum', constraint: 'DEFAULT user' }
                ]
              }
            }));
          } else if (prompt.toLowerCase().includes('metrics')) {
            sendEvent(`> [OBSERVATION] Gathering system telemetry...`);
            sendEvent(`A2UI_PAYLOAD:` + JSON.stringify({
              type: 'Chart',
              id: 'chart-1',
              props: {
                title: 'Agent Token Usage (Last 24h)',
                data: [20, 45, 80, 15, 60, 95, 30]
              }
            }));
          } else {
            sendEvent(`> [ACTION] Initiating isolated ReAct chain to resolve injected query.`);
            await new Promise(r => setTimeout(r, 1500));
            sendEvent(`> [OBSERVATION] Found matching patterns in current AST. Generating structural patch...`);
            await new Promise(r => setTimeout(r, 1500));
            sendEvent(`> [THOUGHT] Patch generated. Waiting for human approval at HOTL Gate.`);
            sendEvent(`A2UI_PAYLOAD:` + JSON.stringify({
              type: 'Container',
              id: 'gate-container',
              props: { title: 'HOTL Security Gate' },
              children: [
                {
                  type: 'ApprovalGate',
                  id: 'approval-1',
                  props: {
                    title: 'Deploy Patch?',
                    description: 'Agent has prepared a structural patch for the requested changes. Requires operator authorization to merge.'
                  }
                }
              ]
            }));
          }
        }

        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

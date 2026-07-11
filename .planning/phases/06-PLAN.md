# Implementation Plan: Phase 06 - Elite Graphical Console

## Objective
Implement an Enterprise-Grade Next.js Visual Orchestrator for the CAS Swarm in strict adherence to the `06-UI-SPEC.md` design contract and the GSD Verifier-Led SDLC.

## Breakdown

### Step 1: Initialize Verified React Environment
- Purge any existing unverified UI code in `cas-platform/src/graphical-console` to prevent context contamination.
- Re-initialize a Next.js 16 app with TypeScript, Tailwind, and strict ESLint routing.
- Install dependencies: `@xyflow/react`, `dagre`, `framer-motion`, `lucide-react`, `react-syntax-highlighter`.
- **Verifier Gate**: `npm run build` must pass. `npm run lint` must return 0 errors.

### Step 2: Implement Core Components
- `AgentNode.tsx`: A custom React Flow node component implementing glassmorphism, pulsing indicators, and the typography defined in the UI-SPEC.
- `TelemetryDrawer.tsx`: A Framer Motion side panel to display the selected edge's raw JSON payload.
- `SwarmGraph.tsx`: The main React Flow orchestration component. It must use the `dagre` auto-layout engine to route nodes top-to-bottom.
- **Verifier Gate**: Jest unit tests must cover component rendering. 

### Step 3: Implement Telemetry Pipeline
- Implement a robust `EventSource` hook to consume the `/api/swarm/events` SSE stream from the Autogen backend.
- Parse incoming `snapshot`, `node_created`, and `edge_created` frames to dynamically update the React Flow state.
- **Verifier Gate**: A dedicated integration test (or mock API harness) to verify the SSE parser correctly maps frames to DAG states.

### Step 4: Red Team Audit (Verification)
- Spawn a `qa-automation-engineer` subagent to perform an adversarial review of the codebase.
- Verify adherence to `06-UI-SPEC.md`.
- Ensure no hardcoded dummy data remains.

## Acceptance Criteria
- [ ] Dagre layout properly aligns dynamically generated nodes.
- [ ] Framer motion drawer smoothly triggers on Edge click.
- [ ] Next.js app builds flawlessly.
- [ ] 100% of Verifier Gates passed.

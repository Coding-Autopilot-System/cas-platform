# UI Design Contract: Phase 06 - Elite Graphical Console

## 1. Visual Identity
- **Theme**: Ultra-dark modern interface (`bg-[#0f0f13]`).
- **Typography**: 
  - Primary UI text: `Inter`
  - Telemetry / Code / Payloads: `JetBrains Mono`
- **Component Style**: Glassmorphism with deep backdrop blurs (`backdrop-blur-xl`) and hyper-thin colored borders (`border-purple-500/50`).

## 2. Layout & Interactions
- **DAG Engine**: Dagre Auto-Layout must be used for deterministic node routing (Top-to-Bottom).
- **Node Anatomy**: Custom React Flow nodes. Must include a status indicator, icon, and dynamic pulsing shadows based on active state.
- **Edge Anatomy**: Animated SVG paths. Must be clickable.
- **Side Panel Drawer**: Triggered by clicking an edge. Slides from the right using `framer-motion`. Displays raw A2A JSON payload with syntax highlighting.

## 3. Required Verification Gates
- 100% test coverage requirement. 
- Must include a `SmokeTest` to verify the Next.js app mounts without hydration errors.
- Must include a `ContractTest` to verify the `EventSource` parser correctly interprets the Autogen SSE schema.

## 4. Subagent Routing
- **Implementer**: `personas/frontend-engineer.md`
- **Verifier**: `personas/qa-automation-engineer.md`

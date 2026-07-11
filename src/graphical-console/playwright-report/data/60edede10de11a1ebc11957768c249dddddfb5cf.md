# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-exhaustive.spec.ts >> CAS Orchestrator Exhaustive E2E Suite >> Section 9: Multi-LLM and Interactive Prompting >> Interactive Prompt UI injects text and triggers Swarm pulse
- Location: tests\e2e-exhaustive.spec.ts:335:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('path[id^="pulse-"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('path[id^="pulse-"]').first()
    6 × locator resolved to <path fill="none" id="pulse-1783592994054" class="react-flow__edge-path" d="M130 41.5L130 61.5L130 -38L130 -18"></path>
      - unexpected value "hidden"

```

```yaml
- main:
  - text: CAS Platform Autonomous v4.2
  - button
  - button "New Mission"
  - button "Visualizer"
  - button "Vault"
  - button "Transcript"
  - button "Audit"
  - button "System Health"
  - button "Blueprints"
  - heading "GSD Explorer" [level=2]
  - text: cas-platform .planning phases 06-PLAN.md 07-PLAN.md 08-PLAN.md ROADMAP.md src
  - heading "Live Telemetry" [level=2]
  - text: Phase 08 Execution
  - heading "SDLC Blueprints" [level=2]
  - text: GSD Core Loop Engineering OS Blueprint Bug Fix Blueprint Refactoring Blueprint CI/CD Pipeline Blueprint
  - heading "The 42 Enterprise Use Cases" [level=3]
  - text: 1. PRD Generation 2. Architecture Mapping 3. API Contract Design 4. Database Schema Modeling 5. User Story Grooming 6. UX Wireframe Scaffolding 7. Capacity Planning 8. Boilerplate Generation 9. Component Implementation 10. Business Logic Scaffolding 11. Database Migration Scripts 12. API Route Creation 13. GraphQL Resolvers 14. State Management Setup 15. Unit Test Generation 16. Integration Test Scaffolding 17. E2E Playwright Mocking 18. Mutation Testing 19. Code Coverage Analysis 20. Visual Regression Setup 21. Chaos Engineering 22. SAST Scanning 23. DAST Scanning 24. Dependency Auditing 25. Secrets Detection 26. RBAC Configuration 27. Compliance Validation 28. Container Hardening 29. CI/CD Orchestration 30. Infrastructure as Code 31. Kubernetes Manifests 32. Helm Chart Gen 33. Blue/Green Deploy 34. Feature Flag Scaffolding 35. Rollback Triggers 36. Telemetry Injection 37. Log Aggregation Setup 38. Alerting Rules Gen 39. Auto-Remediation 40. Incident Post-Mortems 41. SLA Tracking 42. Cost Optimization
  - heading "CAS Visual Orchestrator" [level=1]
  - button "Orchestrator"
  - button "Artifacts"
  - button "Reasoning"
  - button "Governance"
  - combobox:
    - option "Antigravity (Google)" [selected]
    - option "Claude 3.5 Sonnet"
    - option "Codex (OpenAI)"
  - img
  - text: "System Status: Optimal"
  - button
  - button
  - button
  - application:
    - img:
      - group "Edge from meta-manager to planner"
    - text: Delegates Task
    - group:
      - text: SDLC Phase Execution
      - 'heading "Phase 08: Universal GSD Visualizer" [level=2]'
      - text: In Progress
    - group: Meta-Manager Orchestrating
    - group: Planner Agent Analyzing Requirements
    - button "Zoom In":
      - img
    - button "Zoom Out":
      - img
    - button "Fit View":
      - img
    - button "Toggle Interactivity":
      - img
    - img "Mini Map"
    - img
    - link "React Flow attribution":
      - /url: https://reactflow.dev/attribution
      - text: React Flow
  - heading "CAS Visual Orchestrator" [level=1]
  - paragraph: SSE TELEMETRY ACTIVE
  - text: "Swarms: 1 Nodes: 3 A2A/sec: 1 TTFT: 1.2s Tokens: 4,281 Tool Success: 98.5% Est. Cost: $0.042 Live Reasoning Transcript [10:29:58]> Connected to reasoning stream at http://127.0.0.1:8000/api/swarm/events... [10:29:58] > [USER PROMPT INJECTED]: \"Deploy a new Redis cluster\" [10:29:58]> [ACTION] Meta-Manager routing prompt to Orchestrator Node... [10:29:58]> [THOUGHT] Analyzing prompt context against current Swarm Graph state. [10:29:58]> [ACTION] Initiating new execution stream for injected task. [10:29:58]> Analyzing context for events [10:29:58]> [THOUGHT] Found the relevant context. I will synthesize the requirements. [10:29:58]> [ACTION] Loading blueprint definitions... [10:29:58]> [OBSERVATION] Blueprint loaded successfully. Proceeding to execution phase. [10:29:58]> [THOUGHT] The loop for events is complete. Escaping ReAct cycle. [10:29:58]> Routing artifacts to HOTL Governance Gate... _ ❯"
  - textbox "Inject a prompt to the Swarm (e.g. 'Generate a new API route')"
  - heading "Governance & Audit" [level=2]
  - paragraph: OCM Compliance Engine
  - text: "Tier 1: HITL Gate"
  - paragraph: Execution halted. Human-in-the-loop authorization required for mission-critical path.
  - button "Cryptographic Sign"
  - text: "Tier 2: HOTL Gate"
  - paragraph: Sandbox validation passed. Awaiting human deployment authorization.
  - button "Initialize Deployment" [disabled]
  - heading "Artifact Vault" [level=3]
  - button "SAST Clearance 0 Vulnerabilities"
  - button "SLSA Attestation Level 4 Verified"
- alert
```

# Test source

```ts
  253 |       // Test Reject / Sign Actions
  254 |       const rejectBtn = page.getByTestId('reject-artifact-btn');
  255 |       const signBtn = page.getByTestId('sign-artifact-btn');
  256 |       
  257 |       await expect(rejectBtn).toBeEnabled();
  258 |       await expect(signBtn).toBeEnabled();
  259 |       
  260 |       // Click sign
  261 |       await signBtn.click();
  262 |       await expect(page.getByText('Success: Cryptographic Signature Applied. Resuming Pipeline...')).toBeVisible();
  263 |       
  264 |       // Buttons should now change text and be disabled
  265 |       await expect(signBtn).toHaveText('Signed');
  266 |       await expect(signBtn).toBeDisabled();
  267 |       await expect(rejectBtn).toBeDisabled();
  268 |     });
  269 |   });
  270 | 
  271 |   test.describe('Section 8: Graph Inspection Actions', () => {
  272 |     test('Agent Inspector Drawer Buttons', async ({ page }) => {
  273 |       // Navigate back to Reasoning / Orchestrator where graph is
  274 |       await page.getByRole('button', { name: 'Orchestrator', exact: true }).click();
  275 |       
  276 |       // The SwarmGraph nodes might take a second to render
  277 |       const node = page.locator('.react-flow__node').first();
  278 |       await expect(node).toBeVisible({ timeout: 10000 });
  279 |       await node.click({ force: true });
  280 |       
  281 |       // Wait for Agent Inspector to open
  282 |       await expect(page.getByText('Internal Memory State')).toBeVisible();
  283 | 
  284 |       // Test Resume and Halt
  285 |       const resumeBtn = page.getByTestId('resume-agent-btn');
  286 |       await resumeBtn.click();
  287 |       await expect(page.getByText('Agent Execution Resumed')).toBeVisible();
  288 |       
  289 |       // Wait for toast to disappear or just trigger next one
  290 |       await page.waitForTimeout(500);
  291 | 
  292 |       const haltBtn = page.getByTestId('halt-agent-btn');
  293 |       await haltBtn.click();
  294 |       await expect(page.getByText('Agent Execution Halted via HITL')).toBeVisible();
  295 | 
  296 |       // Close it
  297 |       await page.getByTestId('close-agent-inspector-btn').click();
  298 |       await expect(page.getByText('Internal Memory State')).not.toBeVisible();
  299 |     });
  300 | 
  301 |     test('Telemetry Drawer Buttons', async ({ page }) => {
  302 |       // Find an edge and click it
  303 |       const edge = page.locator('.react-flow__edge').first();
  304 |       await expect(edge).toBeVisible({ timeout: 10000 });
  305 |       await edge.click({ force: true });
  306 | 
  307 |       // Wait for Telemetry Drawer to open
  308 |       await expect(page.getByText('A2A Telemetry Payload')).toBeVisible();
  309 | 
  310 |       // Test Inject Prompt
  311 |       const injectBtn = page.getByTestId('inject-prompt-btn');
  312 |       await injectBtn.click();
  313 |       await expect(page.getByText('Prompt Injection Interface Opened')).toBeVisible();
  314 | 
  315 |       // Close it
  316 |       await page.getByTestId('close-telemetry-btn').click();
  317 |       await expect(page.getByText('A2A Telemetry Payload')).not.toBeVisible();
  318 |     });
  319 |   });
  320 | 
  321 |   test.describe('Section 9: Multi-LLM and Interactive Prompting', () => {
  322 |     test('Can switch LLM Engine via TopNavbar dropdown', async ({ page }) => {
  323 |       const llmSelector = page.getByTestId('llm-selector');
  324 |       await expect(llmSelector).toBeVisible();
  325 |       
  326 |       // Select Claude
  327 |       await llmSelector.selectOption('Claude 3.5');
  328 |       await expect(page.getByText('LLM Engine Switched to: Claude 3.5')).toBeVisible();
  329 | 
  330 |       // Select Codex
  331 |       await llmSelector.selectOption('Codex');
  332 |       await expect(page.getByText('LLM Engine Switched to: Codex')).toBeVisible();
  333 |     });
  334 | 
  335 |     test('Interactive Prompt UI injects text and triggers Swarm pulse', async ({ page }) => {
  336 |       // Ensure we are on Orchestrator view
  337 |       await page.getByRole('button', { name: 'Orchestrator', exact: true }).click();
  338 |       
  339 |       const promptInput = page.getByTestId('interactive-prompt-input');
  340 |       await expect(promptInput).toBeVisible();
  341 |       
  342 |       // Type and submit a prompt
  343 |       await promptInput.fill('Deploy a new Redis cluster');
  344 |       await promptInput.press('Enter');
  345 |       
  346 |       // Verify Transcript updates
  347 |       const transcript = page.getByTestId('reasoning-transcript');
  348 |       await expect(transcript).toContainText('[USER PROMPT INJECTED]: "Deploy a new Redis cluster"', { timeout: 5000 });
  349 |       await expect(transcript).toContainText('Meta-Manager routing prompt to Orchestrator Node', { timeout: 5000 });
  350 |       
  351 |       // The pulse edge should appear in the DOM
  352 |       const pulseEdge = page.locator('path[id^="pulse-"]');
> 353 |       await expect(pulseEdge.first()).toBeVisible({ timeout: 5000 });
      |                                       ^ Error: expect(locator).toBeVisible() failed
  354 |     });
  355 |   });
  356 | 
  357 | });
  358 | 
```
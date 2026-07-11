import { test, expect } from '@playwright/test';

const USE_CASES = [
  '1. PRD Generation', '2. Architecture Mapping', '3. API Contract Design', '4. Database Schema Modeling', '5. User Story Grooming', '6. UX Wireframe Scaffolding', '7. Capacity Planning',
  '8. Boilerplate Generation', '9. Component Implementation', '10. Business Logic Scaffolding', '11. Database Migration Scripts', '12. API Route Creation', '13. GraphQL Resolvers', '14. State Management Setup',
  '15. Unit Test Generation', '16. Integration Test Scaffolding', '17. E2E Playwright Mocking', '18. Mutation Testing', '19. Code Coverage Analysis', '20. Visual Regression Setup', '21. Chaos Engineering',
  '22. SAST Scanning', '23. DAST Scanning', '24. Dependency Auditing', '25. Secrets Detection', '26. RBAC Configuration', '27. Compliance Validation', '28. Container Hardening',
  '29. CI/CD Orchestration', '30. Infrastructure as Code', '31. Kubernetes Manifests', '32. Helm Chart Gen', '33. Blue/Green Deploy', '34. Feature Flag Scaffolding', '35. Rollback Triggers',
  '36. Telemetry Injection', '37. Log Aggregation Setup', '38. Alerting Rules Gen', '39. Auto-Remediation', '40. Incident Post-Mortems', '41. SLA Tracking', '42. Cost Optimization'
];

test.describe('CAS Orchestrator Exhaustive E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  });

  test.describe('Section 1: Exhaustive 42 Enterprise Use Cases Traversal', () => {
    test('Every single of the 42 Use Cases is clickable and dynamically drives the reasoning stream', async ({ page }) => {
      // Set test timeout to 120 seconds as this loops 42 times and waits for streaming text
      test.setTimeout(120000);

      // Loop through all 42 use cases
      for (const [index, useCaseName] of USE_CASES.entries()) {
        // Find the use case by exact text match within the Sidebar
        const ucBtn = page.getByText(useCaseName, { exact: true });
        
        // Scroll into view
        await ucBtn.scrollIntoViewIfNeeded();
        await expect(ucBtn).toBeVisible();
        
        // Click it
        await ucBtn.click();
        
        // Assert the Reasoning Transcript receives the correct stream ID
        const streamId = `${index + 1}`;
        await expect(page.getByTestId('reasoning-transcript')).toContainText(`Analyzing context for ${streamId}`, { timeout: 8000 });
      }
    });
  });

  test.describe('Section 2: Re-verified TopNavbar Settings Completeness', () => {
    test('Settings Toggle states update visually upon interaction', async ({ page }) => {
      const gearBtn = page.getByRole('button').filter({ has: page.locator('svg.lucide-settings') });
      await gearBtn.click();
      
      const darkModeToggle = page.getByTestId('dark-mode-toggle');
      // Initially it has bg-[var(--neon-purple)] because it is true
      await expect(darkModeToggle).toHaveClass(/bg-\[var\(--neon-purple\)\]/);
      
      // Wait for settings drawer slide animation to complete
      await page.waitForTimeout(500);

      // Click to toggle off
      await darkModeToggle.click();
      await expect(darkModeToggle).toHaveClass(/bg-gray-600/);

      const telemetryToggle = page.getByTestId('telemetry-toggle');
      await expect(telemetryToggle).toHaveClass(/bg-\[var\(--success-green\)\]/);
      await telemetryToggle.click();
      await expect(telemetryToggle).toHaveClass(/bg-gray-600/);
    });
  });

  test.describe('Section 3: End-to-End Governance Audit Loop', () => {
    test('Complete SDLC loop: Plan -> Vault -> Governance -> Deploy', async ({ page }) => {
      // 1. Plan Phase: Click PRD Generation
      const prdBtn = page.getByText('1. PRD Generation', { exact: true });
      await prdBtn.click({ force: true });
      await expect(page.getByTestId('reasoning-transcript')).toContainText(`Analyzing context for 1`, { timeout: 8000 });

      // 2. Vault Phase
      await page.getByRole('button', { name: 'Artifacts', exact: true }).click();
      await expect(page.getByText('SEMANTIC INTENT ANALYSIS')).toBeVisible();

      // 3. Governance Phase
      await page.getByRole('button', { name: 'Governance', exact: true }).click();
      
      // Click Tier 1 Sign
      const signBtn = page.getByRole('button', { name: 'Cryptographic Sign' });
      await signBtn.click();
      await expect(page.getByText('Signed Successfully')).toBeVisible();

      // Click Tier 2 Initialize Deployment
      const initBtn = page.getByRole('button', { name: 'Initialize Deployment' });
      await expect(initBtn).toBeEnabled();
      await initBtn.click();

      // Modal appears
      await expect(page.getByText('Multi-Cloud Deployment Orchestrator')).toBeVisible();

      // Select clouds (Azure is default, add AWS)
      await page.getByTestId('cloud-select-aws').click();

      // Run what-if
      const whatIfBtn = page.getByTestId('run-what-if-btn');
      await whatIfBtn.click();
      await expect(page.getByText('System Ready for Multi-Cloud Deployment.')).toBeVisible({ timeout: 15000 });

      // Execute deployment
      const execBtn = page.getByTestId('execute-deployment-btn');
      await execBtn.click();

      // Wait for modal to close
      await expect(page.getByText('Multi-Cloud Deployment Orchestrator')).not.toBeVisible({ timeout: 10000 });

      // Verify Global Reactivity!
      const systemStatus = page.getByText('System Status: PROD LIVE');
      await expect(systemStatus).toBeVisible({ timeout: 5000 });
      
      // Test the new Complete Mission button (wait for it since deployment takes 1.5s)
      const completeBtn = page.getByRole('button', { name: 'Complete Mission & Close' });
      await expect(completeBtn).toBeVisible({ timeout: 5000 });
      
      // Test that Artifact Vault links in Governance panel navigate correctly
      const sastBtn = page.getByTestId('gov-sast-btn');
      await sastBtn.click();
      await expect(page.getByText('SEMANTIC INTENT ANALYSIS')).toBeVisible(); // This proves we are on the Artifacts page
      
      // Transcript should show Prod logs
      await page.getByRole('button', { name: 'Orchestrator', exact: true }).click();
      await expect(page.getByTestId('reasoning-transcript')).toContainText('Connected to Prod Deployment Engine', { timeout: 8000 });
    });
  });

  test.describe('Section 4: Sidebar Interactions & Modal', () => {
    test('New Mission Modal and Initialization Loop', async ({ page }) => {
      // Open New Mission Modal
      const newMissionBtn = page.getByRole('button', { name: 'New Mission' });
      await newMissionBtn.click();
      await expect(page.getByText('New Mission Configuration')).toBeVisible();

      // Cancel it
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page.getByText('New Mission Configuration')).not.toBeVisible();

      // Open and Initialize
      await newMissionBtn.click();
      await page.getByRole('button', { name: 'Initialize Swarm' }).click();

      // Verify Toast
      await expect(page.getByText('Swarm Initialization Started...')).toBeVisible();
      
      // Verify Transcript
      await expect(page.getByTestId('reasoning-transcript')).toContainText('Connected to Swarm Initializer', { timeout: 5000 });
    });

    test('Sidebar Primary Navigation switching views', async ({ page }) => {
      // Click Vault in sidebar
      await page.getByRole('button', { name: 'Vault', exact: true }).click();
      await expect(page.getByText('Artifact Vault', { exact: true })).toBeVisible();

      // Click Transcript in sidebar
      await page.getByRole('button', { name: 'Transcript', exact: true }).click();
      await expect(page.getByText('Reasoning Engine')).toBeVisible();

      // Click System Health (Toast)
      await page.getByRole('button', { name: 'System Health' }).click();
      await expect(page.getByText('System Health: Telemetry Loading...')).toBeVisible();

      // Click Blueprints (Toast)
      await page.getByRole('button', { name: 'Blueprints' }).click();
      await expect(page.getByText('Blueprints: Loading Repository...')).toBeVisible();
    });

    test('Sidebar Collapse and Expand', async ({ page }) => {
      const collapseBtn = page.locator('.lucide-panel-left-close');
      await collapseBtn.click();
      
      // Should show expand button
      const expandBtn = page.locator('.lucide-panel-right-close');
      await expect(expandBtn).toBeVisible();
      
      // Expand again
      await expandBtn.click();
      await expect(collapseBtn).toBeVisible();
    });
  });

  test.describe('Section 5: GSD Explorer & File Editor Drawer', () => {
    test('Can open a file from GSD Explorer and close it', async ({ page }) => {
      // Find 06-PLAN.md
      const planFile = page.getByText('06-PLAN.md', { exact: true });
      await planFile.scrollIntoViewIfNeeded();
      await planFile.click();

      // Wait for drawer to appear
      const drawerHeader = page.locator('h2', { hasText: '06-PLAN.md' });
      await expect(drawerHeader).toBeVisible();

      // Click Save
      await page.getByRole('button', { name: 'Save' }).click();

      // Close it
      const closeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') });
      await closeBtn.click();
      await expect(drawerHeader).not.toBeVisible();
    });
  });

  test.describe('Section 6: TopNavbar Actions', () => {
    test('Shield and User icon toasts', async ({ page }) => {
      // Find the TopNavbar container by its 'CAS Visual Orchestrator' heading
      const topNav = page.locator('div').filter({ has: page.locator('h1', { hasText: 'CAS Visual Orchestrator' }) }).first();
      
      const shieldBtn = page.getByTestId('top-shield-icon');
      await shieldBtn.click();
      await expect(page.getByText('Shield: Security Scans Passed')).toBeVisible();

      const userBtn = page.getByTestId('top-user-icon');
      await userBtn.click();
      await expect(page.getByText('User: Admin Profile Active')).toBeVisible();
    });

    test('System Status Dropdown', async ({ page }) => {
      // Find the pill container using exact testid
      const statusPill = page.getByTestId('status-pill');
      await statusPill.click();
      
      // Verify dropdown appears with exact testid
      const dropdown = page.getByTestId('metrics-dropdown');
      await expect(dropdown).toBeVisible({ timeout: 5000 });
      
      // Verify specific metrics text
      await expect(dropdown).toContainText('12 Active');
      await expect(dropdown).toContainText('42ms');
    });
  });

  test.describe('Section 7: Artifact Vault Actions', () => {
    test('Artifact Vault UI Components and States', async ({ page }) => {
      // Navigate to Artifacts tab
      await page.getByRole('button', { name: 'Vault', exact: true }).click();
      await expect(page.getByText('Artifact Vault', { exact: true })).toBeVisible();

      // Test Provenance Modal
      const provBtn = page.getByTestId('view-provenance-btn');
      await provBtn.click();
      const provModal = page.getByTestId('provenance-modal');
      await expect(provModal).toBeVisible();
      await expect(provModal).toContainText('SLSA Level 4 Provenance Record');
      await page.getByTestId('close-provenance-modal-btn').click();
      await expect(provModal).not.toBeVisible();

      // Test Diff Mode toggles
      const rawBtn = page.getByTestId('raw-btn');
      const splitBtn = page.getByTestId('split-diff-btn');
      await rawBtn.click();
      await expect(page.getByText('    # AUTONOMOUS FIX APPLIED\n    secret = os.environ["JWT_SECRET"]  # Enforce strict env var presence')).toBeVisible();
      await splitBtn.click();
      await expect(page.getByText('-   # OLD LOGIC')).toBeVisible();

      // Test Reject / Sign Actions
      const rejectBtn = page.getByTestId('reject-artifact-btn');
      const signBtn = page.getByTestId('sign-artifact-btn');
      
      await expect(rejectBtn).toBeEnabled();
      await expect(signBtn).toBeEnabled();
      
      // Click sign
      await signBtn.click();
      await expect(page.getByText('Success: Cryptographic Signature Applied. Resuming Pipeline...')).toBeVisible();
      
      // Buttons should now change text and be disabled
      await expect(signBtn).toHaveText('Signed');
      await expect(signBtn).toBeDisabled();
      await expect(rejectBtn).toBeDisabled();
    });
  });

  test.describe('Section 8: Graph Inspection Actions', () => {
    test('Agent Inspector Drawer Buttons', async ({ page }) => {
      // Navigate back to Reasoning / Orchestrator where graph is
      await page.getByRole('button', { name: 'Orchestrator', exact: true }).click();
      
      // The SwarmGraph nodes might take a second to render
      const node = page.locator('.react-flow__node').first();
      await expect(node).toBeVisible({ timeout: 10000 });
      await node.click({ force: true });
      
      // Wait for Agent Inspector to open
      await expect(page.getByText('Internal Memory State')).toBeVisible();

      // Test Resume and Halt
      const resumeBtn = page.getByTestId('resume-agent-btn');
      await resumeBtn.click();
      await expect(page.getByText('Agent Execution Resumed')).toBeVisible();
      
      // Wait for toast to disappear or just trigger next one
      await page.waitForTimeout(500);

      const haltBtn = page.getByTestId('halt-agent-btn');
      await haltBtn.click();
      await expect(page.getByText('Agent Execution Halted via HITL')).toBeVisible();

      // Close it
      await page.getByTestId('close-agent-inspector-btn').click();
      await expect(page.getByText('Internal Memory State')).not.toBeVisible();
    });

    test('Telemetry Drawer Buttons', async ({ page }) => {
      // Find an edge and click it
      const edge = page.locator('.react-flow__edge').first();
      await expect(edge).toBeVisible({ timeout: 10000 });
      await edge.click({ force: true });

      // Wait for Telemetry Drawer to open
      await expect(page.getByText('A2A Telemetry Payload')).toBeVisible();

      // Test Inject Prompt
      const injectBtn = page.getByTestId('inject-prompt-btn');
      await injectBtn.click();
      await expect(page.getByText('Prompt Injection Interface Opened')).toBeVisible();

      // Close it
      await page.getByTestId('close-telemetry-btn').click();
      await expect(page.getByText('A2A Telemetry Payload')).not.toBeVisible();
    });
  });

  test.describe('Section 9: Multi-LLM and Interactive Prompting', () => {
    test('Can switch LLM Engine via TopNavbar dropdown', async ({ page }) => {
      const llmSelector = page.getByTestId('llm-selector');
      await expect(llmSelector).toBeVisible();
      
      // Select Claude
      await llmSelector.selectOption('Claude 3.5');
      await expect(page.getByText('LLM Engine Switched to: Claude 3.5')).toBeVisible();

      // Select Codex
      await llmSelector.selectOption('Codex');
      await expect(page.getByText('LLM Engine Switched to: Codex')).toBeVisible();
    });

    test('Interactive Prompt UI injects text and triggers Swarm pulse', async ({ page }) => {
      // Ensure we are on Orchestrator view
      await page.getByRole('button', { name: 'Orchestrator', exact: true }).click();
      
      const promptInput = page.getByTestId('interactive-prompt-input');
      await expect(promptInput).toBeVisible();
      
      // Type and submit a prompt
      await promptInput.fill('Deploy a new Redis cluster');
      await promptInput.press('Enter');
      
      // Verify Transcript updates
      const transcript = page.getByTestId('reasoning-transcript');
      await expect(transcript).toContainText('[USER PROMPT INJECTED]: "Deploy a new Redis cluster"', { timeout: 5000 });
      await expect(transcript).toContainText('Meta-Manager routing prompt to Orchestrator Node', { timeout: 5000 });
      
      // The pulse edge should appear in the DOM
      const pulseEdge = page.locator('path[id^="pulse-"]');
      await expect(pulseEdge.first()).toBeAttached({ timeout: 5000 });
    });
  });

});

import { test, expect } from '@playwright/test';

test.describe('CAS Orchestrator Interactions E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  });

  test.describe('Suite A: Navigation Orchestration', () => {
    test('TopNavbar tab switches accurately update the current view', async ({ page }) => {
      // Default view is Orchestrator, which shows the SwarmGraph React Flow instance
      await expect(page.locator('.react-flow')).toBeVisible();

      // Click the ARTIFACTS tab in TopNavbar
      await page.getByRole('button', { name: 'Artifacts', exact: true }).click();
      
      // We expect the Artifact Vault View to render
      await expect(page.locator('h2', { hasText: 'Artifact Vault' })).toBeVisible();
      await expect(page.locator('.react-flow')).not.toBeVisible();

      // Click the REASONING tab
      await page.getByRole('button', { name: 'Reasoning', exact: true }).click();
      await expect(page.locator('text=Reasoning Engine')).toBeVisible();

      // Click the GOVERNANCE tab
      await page.getByRole('button', { name: 'Governance', exact: true }).click();
      await expect(page.locator('text=Enterprise Compliance Engine')).toBeVisible();

      // Return to ORCHESTRATOR
      await page.getByRole('button', { name: 'Orchestrator', exact: true }).click();
      await expect(page.locator('.react-flow')).toBeVisible();
    });

    test('Sidebar navigation clicks sync with TopNavbar views', async ({ page }) => {
      // Click Vault in Sidebar
      await page.locator('button', { hasText: 'Vault' }).click();
      await expect(page.locator('h2', { hasText: 'Artifact Vault' })).toBeVisible();

      // Click Transcript in Sidebar
      await page.locator('button', { hasText: 'Transcript' }).click();
      await expect(page.locator('text=Reasoning Engine')).toBeVisible();

      // Click Audit in Sidebar
      await page.locator('button', { hasText: 'Audit' }).click();
      await expect(page.locator('text=Enterprise Compliance Engine')).toBeVisible();
      
      // Click Visualizer in Sidebar
      await page.locator('button', { hasText: 'Visualizer' }).click();
      await expect(page.locator('.react-flow')).toBeVisible();
    });

    test('GSD Explorer tree node expands and collapses', async ({ page }) => {
      // The .planning directory should be visible and expanded by default
      const planningNode = page.locator('span', { hasText: '.planning' });
      await expect(planningNode).toBeVisible();

      // The ROADMAP.md file inside .planning should be visible
      const roadmapNode = page.locator('span', { hasText: 'ROADMAP.md' });
      await expect(roadmapNode).toBeVisible();

      // Click .planning to collapse
      await planningNode.click();
      // ROADMAP.md should be hidden
      await expect(roadmapNode).not.toBeVisible();

      // Click again to expand
      await planningNode.click();
      // ROADMAP.md should be visible again
      await expect(roadmapNode).toBeVisible();
    });
  });

  test.describe('Suite B: Artifact Vault Integrity', () => {
    test('Artifact Vault buttons are interactable and render side-by-side diffs', async ({ page }) => {
      // Navigate to Artifact Vault
      await page.locator('button', { hasText: 'Vault' }).click();
      
      // Check SLSA and SAST modules
      await expect(page.locator('text=SAST CLEARANCE')).toBeVisible();
      await expect(page.locator('text=SLSA ATTESTATION')).toBeVisible();

      // Check Split Diff viewer
      await expect(page.locator('text=SEMANTIC INTENT ANALYSIS')).toBeVisible();
      await expect(page.locator('text=src/auth/jwt_services.py')).toBeVisible();

      // Check action buttons
      const rejectBtn = page.locator('button', { hasText: 'Reject' });
      const signBtn = page.locator('button', { hasText: 'Sign & Resume Pipeline' });
      
      await expect(rejectBtn).toBeVisible();
      await expect(signBtn).toBeVisible();
      
      // Verify hover states and clickability
      await expect(rejectBtn).toBeEnabled();
      await expect(signBtn).toBeEnabled();
    });
  });

  test.describe('Suite C: Governance & Audit Flow', () => {
    test('HITL / HOTL Tier 1 and Tier 2 pipeline authorization interactions', async ({ page }) => {
      // Make sure we are on the Orchestrator view (default)
      const hitlText = page.locator('span', { hasText: 'Tier 1: HITL Gate' });
      const signBtn = page.locator('button', { hasText: 'Cryptographic Sign' });
      const deployBtn = page.locator('button', { hasText: 'Deploy to Prod' });

      await expect(hitlText).toBeVisible();
      await expect(signBtn).toBeVisible();
      await expect(deployBtn).toBeVisible();

      // Tier 2 should be disabled initially
      await expect(deployBtn).toBeDisabled();

      // Click Tier 1 Sign
      await signBtn.click();

      // Tier 1 should change to Signed Successfully
      await expect(page.locator('button', { hasText: 'Signed Successfully' })).toBeVisible();

      // Tier 2 should now be enabled
      await expect(deployBtn).toBeEnabled();

      // Click Tier 2 Deploy
      await deployBtn.click();

      // Should show Deploying... loading state
      await expect(page.locator('button', { hasText: 'Deploying...' })).toBeVisible();

      // After 1.5 seconds, it should change to Deployed
      await expect(page.locator('button', { hasText: 'Deployed to Prod' })).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Suite D: SwarmGraph Canvas Interactivity', () => {
    test('Clicking AgentNodes opens the AgentInspectorDrawer', async ({ page }) => {
      // The React Flow node structure often uses standard DOM events.
      // We know there's a node with text "Planner Agent" in the Orchestrator
      // The SwarmGraph node is rendered via the ReactFlow renderer
      
      // Wait for the SwarmGraph and nodes to be visible
      await expect(page.locator('.react-flow')).toBeVisible();
      
      // First ensure the default state has the drawer closed (or not visible)
      // The drawer shows the agent's name as an h2
      
      // Since it's dynamically streamed, we just wait for a known node to appear.
      // E.g., Planning node. But wait, default view might not have nodes yet if we don't click a blueprint.
      // Let's toggle Phase 1 blueprint first to populate nodes.
      await page.locator('text=Phase 1: Planning').click();
      
      const targetNode = page.locator('text=API Contract');
      await expect(targetNode).toBeVisible({ timeout: 10000 });
      
      // Click the node
      await targetNode.click();
      
      // The AgentInspectorDrawer should now render the node data
      await expect(page.locator('h2', { hasText: 'API Contract' })).toBeVisible();
      
      // We can close the drawer by clicking its Close button (the 'X' lucide icon)
      // The AgentInspectorDrawer has a close button which wraps the X icon.
      await page.locator('button').filter({ has: page.locator('.lucide-x') }).first().click();
      
      // The drawer should be closed (Wait for text to disappear)
      await expect(page.locator('h2', { hasText: 'API Contract' })).not.toBeVisible();
    });
  });

  test.describe('Suite E: Layout Resilience & Resizing', () => {
    test('Sidebar can be dragged and resized', async ({ page }) => {
      // Find the resizer handle
      const resizer = page.locator('.cursor-col-resize').first();
      await expect(resizer).toBeVisible();

      const initialBox = await resizer.boundingBox();
      expect(initialBox).not.toBeNull();

      if (initialBox) {
        // Drag it 100px to the right
        await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + 10);
        await page.mouse.down();
        // Move smoothly
        await page.mouse.move(initialBox.x + 50, initialBox.y + 10, { steps: 5 });
        await page.mouse.move(initialBox.x + 100, initialBox.y + 10, { steps: 5 });
        await page.mouse.up();

        // Check new bounding box
        const newBox = await resizer.boundingBox();
        expect(newBox).not.toBeNull();
        if (newBox) {
          expect(newBox.x).toBeGreaterThan(initialBox.x + 50);
        }
      }
    });
  });

  test.describe('Suite F: Component Interactive Completeness', () => {
    test('New Mission Modal toggles correctly', async ({ page }) => {
      // Find the New Mission button
      const newMissionBtn = page.getByRole('button', { name: 'New Mission' });
      await expect(newMissionBtn).toBeVisible();

      await newMissionBtn.click();
      
      // Modal appears
      await expect(page.locator('h2', { hasText: 'New Mission Configuration' })).toBeVisible();

      // Click Cancel
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(page.locator('h2', { hasText: 'New Mission Configuration' })).not.toBeVisible();
    });

    test('TopNavbar interactive states (Status, Toasts, Settings)', async ({ page }) => {
      // System Status Dropdown
      const statusBtn = page.locator('text=System Status: Optimal');
      await statusBtn.click();
      await expect(page.locator('text=Agent Pool: 14 Active')).toBeVisible();

      // Click again to close
      await statusBtn.click();
      await expect(page.locator('text=Agent Pool: 14 Active')).not.toBeVisible();

      // The action buttons in TopNavbar
      const actionButtons = page.locator('.gap-3.text-gray-400 button');
      
      // Click Shield (1st button) -> Toast appears
      await actionButtons.nth(0).click();
      await expect(page.locator('text=Shield: Security Scans Passed')).toBeVisible();

      // Click Settings (3rd button) -> Drawer appears
      await actionButtons.nth(2).click();
      await expect(page.locator('h3', { hasText: 'Global Settings' })).toBeVisible();
    });
  });

  test.describe('Suite G: Uncompromising Button Completeness', () => {
    test('Final Sidebar & Vault Toasts trigger successfully', async ({ page }) => {
      // 1. Sidebar Buttons
      await page.getByRole('button', { name: 'System Health' }).click();
      await expect(page.getByText('System Health: Telemetry Loading...')).toBeVisible();
      // Wait for toast to fade
      await page.waitForTimeout(3500);

      await page.getByRole('button', { name: 'Blueprints' }).click();
      await expect(page.getByText('Blueprints: Loading Repository...')).toBeVisible();
      await page.waitForTimeout(3500);

      // 2. Vault View Buttons
      await page.getByRole('button', { name: 'Artifacts', exact: true }).click();
      
      await page.getByRole('button', { name: 'View Provenance Record' }).click();
      await expect(page.getByText('Drawer: SLSA Level 4 Provenance Record Opened')).toBeVisible();
      await page.waitForTimeout(3500);

      await page.getByRole('button', { name: 'Reject' }).click();
      await expect(page.getByText('Error: Pipeline Halted & Signatures Rejected')).toBeVisible();
      await page.waitForTimeout(3500);

      await page.getByRole('button', { name: 'Sign & Resume Pipeline' }).click();
      await expect(page.getByText('Success: Cryptographic Signature Applied. Resuming Pipeline...')).toBeVisible();
      await page.waitForTimeout(3500);

      // 3. Governance Buttons
      await page.getByRole('button', { name: 'Governance', exact: true }).click();
      await page.getByRole('button', { name: 'Cryptographic Sign' }).click();
      await expect(page.getByText('Cryptographic Signature Applied: Execution Resumed')).toBeVisible();
      await page.waitForTimeout(3500);

      await page.getByRole('button', { name: 'Deploy to Prod' }).click();
      await expect(page.getByText('Initiating Production Deployment...')).toBeVisible();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Success: Pipeline Deployed to Prod')).toBeVisible();
    });
  });

});

import { test, expect } from '@playwright/test';

test.describe('CAS Visual Orchestrator E2E', () => {
  test('should render the GSD Explorer Sidebar', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    
    // Check if the Sidebar header exists
    await expect(page.locator('h2', { hasText: 'GSD Explorer' })).toBeVisible();
    
    // Check if the cas-platform root node exists
    await expect(page.locator('text=cas-platform')).toBeVisible();
  });

  test('should render the React Flow canvas', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    
    // The React Flow wrapper should be visible
    const flowWrapper = page.locator('.react-flow');
    await expect(flowWrapper).toBeVisible();
  });

  test('should toggle the SDLC Blueprint mode', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    
    // Click the SDLC Blueprint button
    await page.locator('text=GSD Core Loop').click();
    
    // We expect the Dagre graph to render the Human Operator node from the backend SSE
    // We might need to wait for SSE to stream
    await expect(page.locator('text=Human Operator (You)')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle the Engineering OS Blueprint mode', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    
    // Click the new Engineering OS Blueprint button
    await page.locator('text=Engineering OS Blueprint').click();
    
    // We expect the Dagre graph to render the Elite Persona node from the backend SSE
    await expect(page.locator('text=Elite AI Persona')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle the Bug Fix Blueprint mode', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Bug Fix Blueprint').click();
    await expect(page.locator('text=Autonomous Bug Fix Workflow')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle the Refactoring Blueprint mode', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Refactoring Blueprint').click();
    await expect(page.locator('text=Codebase Refactoring Loop')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle the CI/CD Pipeline Blueprint mode', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=CI/CD Pipeline Blueprint').click();
    await expect(page.locator('text=Security Agent')).toBeVisible({ timeout: 10000 });
  });

  // Phase 14: Elite Enterprise 42 Use Case Blueprints
  test('should toggle Phase 1: Planning', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Phase 1: Planning').click();
    await expect(page.locator('text=API Contract')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle Phase 2: Development', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Phase 2: Development').click();
    await expect(page.locator('text=Legacy Translation')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle Phase 3: Testing & QA', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Phase 3: Testing & QA').click();
    await expect(page.locator('text=Edge Case Fuzzing')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle Phase 4: DevSecOps', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Phase 4: DevSecOps').click();
    await expect(page.locator('text=Attack Modeling')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle Phase 5: Deployment', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Phase 5: Deployment').click();
    await expect(page.locator('text=Multi-Region Orchestration')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle Phase 6: Maintenance', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.locator('text=Phase 6: Maintenance').click();
    await expect(page.locator('text=Stale Deprecation')).toBeVisible({ timeout: 10000 });
  });

  // Phase 14: Elite Enterprise UI Layouts
  test('should render the Governance & Audit Vault', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Governance & Audit')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Tier 1: HITL Gate')).toBeVisible({ timeout: 10000 });
  });

  test('should render the Live Reasoning Transcript', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Live Reasoning Transcript')).toBeVisible({ timeout: 10000 });
  });
});

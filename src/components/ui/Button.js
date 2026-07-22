/**
 * Shared UI — Part 2 / Part 10 (used by Part 3 – Authentication)
 * File: src/components/ui/Button.js
 *
 * Purpose:
 *   Generic, accessible, reusable button component used across
 *   the entire application. Supports multiple visual variants,
 *   sizes, loading/disabled states, and an optional leading icon.
 *
 * Planned variants (to be implemented):
 *   - primary   — solid blue; main CTAs (e.g. "Sign In")
 *   - secondary — muted; secondary actions
 *   - outline   — transparent background, coloured border
 *   - ghost     — no border/background; subtle actions
 *   - destructive — red; logout, delete
 *
 * Key responsibilities (to be implemented):
 *   - Render a <button> element with the correct classes
 *   - Accept: label, variant, size, disabled, loading, onClick
 *   - When loading=true: render Spinner, disable interactions,
 *     preserve button width to avoid layout shift
 *   - Expose proper ARIA attributes (aria-disabled, aria-busy)
 *   - Minimum touch target 44×44 px (FR-RESP-003)
 *
 * Dependencies (once implemented):
 *   - components/ui/Spinner.js
 *
 * TODO: Implement button rendering, variants, and states.
 *       (Part 2 / Part 10 scope — referenced by all auth forms)
 */

export {};

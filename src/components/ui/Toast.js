/**
 * @fileoverview Toast — Re-export Shim — Part 3.
 *
 * The canonical Toast implementation lives in `src/components/Toast.js`
 * (authored by Part 10 — UX Foundation).  This file re-exports everything
 * from there so that auth components can use the stable `ui/Toast` import
 * path without duplicating logic or creating a second implementation.
 *
 * ─── Import convention ───────────────────────────────────────────────────────
 *
 *   // Auth components (and all other modules) should use:
 *   import { showToast } from '../ui/Toast.js';
 *
 *   // Never import from the canonical path directly in auth code — doing so
 *   // would break if the Part 10 team reorganises the file structure.
 *
 * @module components/ui/Toast
 * @see module:components/Toast
 */

export * from '../Toast.js';

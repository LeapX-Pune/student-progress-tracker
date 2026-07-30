# ADR 002: Hash-Based Routing

**Date:** 2024-01-15 **Status:** Accepted

## Context

The SPA needs client-side routing. Options included History API routing or
hash-based routing.

## Decision

Use URL hash fragments (`#/route`) for routing.

## Rationale

- Works without server-side configuration (no fallback to `index.html` needed)
- Simpler to implement
- No risk of 404s on page reload
- Sufficient for the application's navigation needs

## Consequences

- URLs contain `#` fragments (less clean but functional)
- Cannot use server-side rendering
- Anchor link default behavior must be prevented

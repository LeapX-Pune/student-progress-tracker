# ADR 001: Use Vanilla JavaScript

**Date:** 2024-01-15 **Status:** Accepted

## Context

The project needs a frontend approach for a student progress tracking SaaS.
Options included React, Vue, or vanilla JS.

## Decision

Use vanilla JavaScript with ES modules. No frameworks or build tools in the
browser bundle.

## Rationale

- Zero framework lock-in
- Smaller bundle size
- Faster page loads
- Easier onboarding for team members new to frontend
- Sufficient for the application's complexity level

## Consequences

- State management must be implemented manually (observer pattern)
- No virtual DOM — direct DOM manipulation
- Routing must be custom-built

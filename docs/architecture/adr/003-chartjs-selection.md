# ADR 003: Chart.js for Data Visualization

**Date:** 2024-01-15 **Status:** Accepted

## Context

The dashboard requires interactive charts (bar, doughnut, line) for grade
visualization.

## Decision

Use Chart.js loaded from CDN.

## Rationale

- Lightweight and well-documented
- Supports all required chart types
- Simple declarative API
- No build step required (CDN-loaded)

## Consequences

- External dependency on CDN availability
- Chart.js global scope pollution mitigated by wrapping in service module
- Limited customization compared to D3.js

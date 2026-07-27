# Architecture Overview

## Principles

- **Vanilla-first**: Zero framework dependencies. Pure HTML, CSS, and
  JavaScript.
- **Modular**: Feature-based directory structure with clear separation of
  concerns.
- **Observer pattern**: Reactive state via publish-subscribe (no reactive
  framework).
- **API-first**: All data flows through a centralized API service layer.

## Layers

1. **UI Layer** (`src/components/`) — DOM component factories
2. **Service Layer** (`src/services/`) — API calls, auth, storage, network
3. **State Layer** (`src/context/`) — Global state singletons (AuthContext)
4. **Hook Layer** (`src/hooks/`) — Reactive subscriptions for components
5. **Utility Layer** (`src/utils/`) — Pure helper functions
6. **Config Layer** (`src/config/`) — Environment-specific configuration

## Data Flow

```
User Action → Component → Hook → Service → API → Mock/Real Backend
                                                    ↓
User Sees  ← Component ← Hook ← Context ← Service ← Response
```

## Routing

Hash-based routing without a router library. Route changes dispatch events that
components subscribe to.

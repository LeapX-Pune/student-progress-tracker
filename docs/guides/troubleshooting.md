# Troubleshooting

## Build Issues

| Problem                   | Solution                                            |
| ------------------------- | --------------------------------------------------- |
| `npm run build` fails     | Ensure Node.js 20+ is installed, run `npm ci` first |
| Bundle size exceeds limit | Check for large dependencies, enable code splitting |

## Test Issues

| Problem                           | Solution                                  |
| --------------------------------- | ----------------------------------------- |
| Tests fail in CI but pass locally | Check Node.js version match, clear cache  |
| E2E tests timeout                 | Ensure dev server is running on port 4173 |

## Dev Server

| Problem                | Solution                                                 |
| ---------------------- | -------------------------------------------------------- |
| Port in use            | Kill existing process or change port in `scripts/dev.js` |
| Hot reload not working | Hard refresh, clear browser cache                        |

## Common Errors

- **401 on API calls**: Session expired — log in again
- **Blank page**: Check browser console for JS errors
- **CORS errors**: Ensure mock API server is running

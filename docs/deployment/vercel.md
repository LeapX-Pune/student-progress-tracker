# Vercel Deployment

## Configuration

`vercel.json` at project root handles:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback via rewrites
- Cache headers for assets (1 year)
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

## Manual Deploy

```bash
npx vercel --prod
```

## Environment Variables

Set in Vercel dashboard:

- `VITE_API_URL` — Production API base URL
- `VITE_ENABLE_MOCK_API` — Set to `false` in production

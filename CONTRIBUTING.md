# Contributing

Thanks for contributing to the portfolio.

## Ground Rules

- Keep changes production-ready.
- Prefer small, focused updates over broad refactors.
- Do not reintroduce removed features without a clear reason.
- Preserve the existing routing, backend API contract, and deployment flow.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Start the frontend:

```bash
npm run dev
```

4. Start the backend in another terminal:

```bash
npm run dev:backend
```

## Before Opening a Change

Make sure your update:

- Builds cleanly with `npm run build`
- Does not break the backend verification script
- Keeps routes working on refresh
- Keeps contact and analytics environment variables documented

## Verification Checklist

Run these before handing off:

```bash
npm run build
npm run verify:analytics
```

If you change backend contact behavior, also verify:

- `POST /api/contact` returns validation errors correctly
- email delivery works with configured Gmail App Password credentials

## Code Guidelines

- Prefer existing patterns over introducing a parallel abstraction
- Keep UI changes consistent with the current visual system
- Use shared config and shared helpers where appropriate
- Avoid dead components, dead routes, and stale docs

## Documentation Expectations

If your change affects setup, scripts, routes, deployment, or env vars:

- update `README.md`
- update `CHANGELOG.md`
- update any related inline comments only when needed

## Deployment Notes

- Frontend is intended for Vercel
- Backend is intended for Railway or Render
- Keep `vercel.json` intact unless routing requirements truly change

## Security Notes

- Never commit real secrets
- Keep `EMAIL_PASS` out of version control
- Use Gmail App Passwords only

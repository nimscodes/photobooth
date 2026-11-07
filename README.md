# Elite Event Images

This repository contains the Next.js website and its Sanity content studio. The live website is served by Vercel; production environment variables are managed in the Vercel project settings and are not stored in this repository.

## Production deployment

The Vercel project is connected to this GitHub repository. Changes merged or pushed to `main` trigger a production deployment. Review the Vercel deployment result after each push.

The website requires these production variables in Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; do not expose it as a `NEXT_PUBLIC_` variable.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Optional integrations read additional settings from Vercel, including email/SMS, calendar, admin authentication, and CRM webhook credentials. Keep those values in Vercel and do not commit them.

## Sanity Studio

The Studio is available inside the deployed website at `/studio`. Its schemas and configuration live in `studio/`; the website's Sanity client lives in `sanity/`.

## Build verification

The Vercel production build runs from the repository root using the root `package.json` build script. The Studio also has a package-local build script for checking its schema and configuration.

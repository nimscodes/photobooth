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

For HoneyBook intake through Zapier, set `CRM_HONEYBOOK_WEBHOOK_URL` in Vercel to the Zapier Catch Hook URL. The booking API sends the client contact details and event inquiry fields to that hook, which should be connected to HoneyBook's Create Project action. Keep the URL secret and scope it to Production until Preview has its own test Zap.

## Staging and Preview deployments

Vercel Preview deployments use the separate Supabase project `photobooth-staging`. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the Preview environment only; keep the production values scoped to Production. The staging database starts empty and should use synthetic test data.

Apply the SQL files in `supabase/migrations/` to staging in filename order and verify the app there before applying database changes to production. Keep production email and calendar credentials scoped to Production so test bookings in Preview cannot contact customers or modify the live calendar. Store all secrets in Vercel, not in this repository.

## Sanity Studio

The website's `/studio` route forwards to the hosted Sanity Studio. Its schemas and configuration live in `studio/`; the website's Sanity client lives in `sanity/`. The root Next.js TypeScript project excludes the standalone Studio package; build it with its own package configuration when needed.

## Build verification

The Vercel production build runs from the repository root using the root `package.json` build script. The Studio also has a package-local build script for checking its schema and configuration.

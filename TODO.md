# TODO

- [ ] Diagnose repo deployment target for Vercel (which directory: `lucid-ai-af/` vs `apps/web/`).
- [ ] Add/verify Vercel config at the correct path (ensure `vercel.json` exists where Vercel expects it).
- [ ] Ensure build works in chosen Vercel project (`npm ci` + `npm run build`).
- [x] Create git branch `blackboxai/deploy-vercel`.
- [x] Commit changes.
- [ ] Push to remote.
- [ ] Open/prepare Vercel deployment (build command + output settings) and trigger it.
- [ ] If multiple apps exist, configure Vercel accordingly (single app or monorepo).

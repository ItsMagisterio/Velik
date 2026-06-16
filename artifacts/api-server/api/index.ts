// All requests are routed to api/handler.cjs via vercel.json rewrites.
// This file exists to prevent Vercel from raising "no serverless functions" errors.
// It has no imports intentionally — workspace packages use moduleResolution:bundler
// which is incompatible with Vercel's node16 TypeScript compilation.
export default {};

import { authRouter } from "./auth-router";
import { contributionsRouter } from "./contributions-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  contributions: contributionsRouter,
});

export type AppRouter = typeof appRouter;

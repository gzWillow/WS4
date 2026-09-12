import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "../server/kimi/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

// ⚠️ 临时方案：绕过 Kimi OAuth 登录，注入一个模拟管理员用户。
// 以后接真实登录时，把 MOCK_USER 和 createContext 里的兜底逻辑删掉即可。
const MOCK_USER: User = {
  id: 1,
  unionId: "mock-user-001",
  name: "Mock User",
  email: "mock@example.com",
  avatar: null,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignInAt: new Date(),
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    ctx.user = (await authenticateRequest(opts.req.headers)) ?? MOCK_USER;
  } catch {
    ctx.user = MOCK_USER;
  }
  return ctx;
}
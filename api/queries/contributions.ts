import { desc } from "drizzle-orm";
import { contributions, type InsertContribution } from "../../db/schema";
import { getDb } from "./connection";

/** 列出所有球迷上传的内容（最新在前） */
export async function listContributions(limit = 100) {
  return getDb()
    .select()
    .from(contributions)
    .orderBy(desc(contributions.createdAt))
    .limit(limit);
}

/** 新增一条上传内容 */
export async function createContribution(data: InsertContribution) {
  const [result] = await getDb().insert(contributions).values(data);
  return result.insertId;
}

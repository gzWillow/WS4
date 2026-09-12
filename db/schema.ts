import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 球迷上传的应援内容（图片 / 视频 / 文章 / 链接）。
 * 通过 Kimi 登录的用户可以提交，所有访客均可浏览。
 */
export const contributions = mysqlTable("contributions", {
  id: serial("id").primaryKey(),
  /** 上传者（关联 users.id）。免登录上传时为空 */
  userId: bigint("userId", { mode: "number", unsigned: true }).references(
    () => users.id,
  ),
  /** 上传者署名（可选，不填显示「匿名球迷」） */
  authorName: varchar("authorName", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  /** 分类：photos 图片 / videos 视频 / interviews 访谈 / matches 比赛记录 / other 其他 */
  category: mysqlEnum("category", [
    "photos",
    "videos",
    "interviews",
    "matches",
    "other",
  ])
    .default("other")
    .notNull(),
  /** 内容链接（图片地址、视频地址或文章链接） */
  url: varchar("url", { length: 1024 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = typeof contributions.$inferInsert;

// TODO: Add your tables here. See docs/Database.md for schema examples and patterns.
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()

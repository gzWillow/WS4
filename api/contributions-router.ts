import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  createContribution,
  listContributions,
} from "./queries/contributions";

export const contributionsRouter = createRouter({
  /** 所有人可浏览的上传列表 */
  list: publicQuery.query(() => listContributions()),

  /** 免登录直接上传（图片 / 视频 / 访谈 / 比赛记录均可） */
  create: publicQuery
    .input(
      z.object({
        title: z.string().min(1, "请填写标题").max(255),
        category: z.enum([
          "photos",
          "videos",
          "interviews",
          "matches",
          "other",
        ]),
        url: z.string().url("请填写有效的链接地址").max(1024),
        description: z.string().max(2000).optional(),
        authorName: z.string().max(255).optional(),
      }),
    )
    .mutation(({ input }) =>
      createContribution({
        ...input,
        authorName: input.authorName || "匿名球迷",
      }),
    ),
});

# Fashion Storefront — 使用说明（info）

## 语言

网站呈现给用户的语言应跟随用户 query 的语言。本仓库是**中文版**（品牌「织间」）；同一站点的**英文版就在旁边**（上级目录下 `en/fashion-storefront`，品牌 Atelier），内容、结构完全一致。用户用什么语言交流，就用对应版本呈现；如果用户没有语言偏好，直接使用本仓库即可。

## 使用前先问用户

动手之前，先用 ask_user 工具问几个问题：

1. **（必问）您是否需要将网页变成全栈应用？** 即持久化的数据存储：目前购物车只保存在浏览器 localStorage 里，结账、账户、订阅等操作都只是本地反馈，刷新或换设备后不会同步到任何服务器。全栈化意味着增加服务端与数据库，让订单、账户、订阅记录真正保存下来。
2. 品牌与内容：是否替换成自己的品牌名、品牌故事与联系方式？卖什么商品（名称、价格、图片、库存）？
3. 配色与风格：是否保留现在的「牛皮纸底色 + 粉笔蓝 + 朱砂红点缀」纸样室风格，还是另换一套配色？
4. 首页结构：16 个首页板块是否都要保留，顺序要不要调整（比如要不要倒计时促销、用户评价、造型册）？

如果用户不给任何回答，就直接加载默认网站文件。

可选：如果符合用户的需求，你可以使用图像和视频生成工具。

## 这是什么

一个转化导向的时装店面站点：首页、商品列表页、商品详情页、快速查看抽屉、全屏搜索、购物车抽屉，外加公告栏与页脚订阅。整站由一份类型化配置驱动——所有文案、商品、系列、价格、配色都在 `src/config.ts`，改配置即可换内容，不需要动引擎组件。

```text
index.html              # 入口 HTML（预载字体、站点标题）
package.json            # 脚本：dev / build / check / lint / test / test:e2e
vite.config.ts          # Vite 配置，dev 端口 3000
public/fonts/           # 站点字体的 SIL OFL 许可文件
src/
  main.tsx / App.tsx    # 入口与路由（首页、列表、详情、404）
  config.ts             # 全部内容配置：文案、商品、系列、板块、配色
  types.ts              # 配置的 TypeScript 模式（SiteConfig）
  lib/                  # validateConfig 启动校验、catalog 查询、金额格式化
  cart/                 # 购物车：reducer + localStorage 持久化（含损坏恢复）
  components/           # 头部、页脚、抽屉、快速查看、搜索、toast、SafeImage 等
  sections/             # 16 个可排序、可开关的首页板块
  pages/                # Home / Collection / ProductDetail / NotFound
  hooks/                # 倒计时、视差、滚动 reveal、hero 特效、拖拽 carousel 等
  styles/               # 纯 CSS：base / header / products / sections / footer / responsive
tests/                  # 配置校验与购物车 reducer 单测；e2e 浏览器验收矩阵
dist/                   # 已构建好的静态站点
```

## 潜在用法

时装店只是这份配置的一种填法。换掉 `src/config.ts` 里的文案、商品与媒体，同一套引擎可以变成：买手店或古着店、鞋包配饰专门店、设计师品牌官网、造型册主导的展示站、带倒计时的限时促销落地页（内置 `?sale=1` 促销过滤）等等。用户如果有特定需求，按需更改网站的文字或媒体内容即可；如果用户只是想看看这个网站，直接加载，不必改动。

## 技术浓缩

- React 19 + Vite + TypeScript + react-router；没有 UI 框架依赖，样式是 CSS 变量加原生 CSS，字体自托管。
- 所有内容都以 `src/config.ts` 为准；`src/lib/validateConfig.ts` 在渲染前校验配置，重复 slug、未知引用、空目录等问题会直接显示在页面上，而不是静默崩掉。
- 首页就是 `sections/` 里 16 个板块按 `config.homeSectionOrder` 的顺序渲染；每个板块都能在配置里独立开关，hero 的 canvas 特效层也有单独开关。
- 购物车是 `useReducer` + localStorage，写入前校验、读取时兜底恢复；结账、立即购买、账户、订阅都只给本地 toast 反馈——接服务端时从这几个入口下手即可。
- 动效全部是手写 hook：hero 的 2D canvas 光尘与指针视差、滚动 reveal、磁吸按钮、可拖拽 carousel、首次访问生成并持久化的倒计时；每一处都尊重 `prefers-reduced-motion`。
- `SafeImage` 会为 `/media` 下的图片自动生成 600w/1200w 的 srcSet，加载失败时渲染固定比例的占位块，布局不会塌。
- 更多细节不必猜，直接读代码：入口链路是 `src/main.tsx` → `src/App.tsx` → `pages/` 与 `sections/`。

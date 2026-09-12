import type { Product, ProductDetail, SiteConfig } from './types'

/**
 * 萨利巴 12 号应援站 —— 全站内容配置。
 * 改文案、改内容条目、换图片、调色板，都只改这一个文件，无需动组件。
 * 内容条目的 priceMinor 全为 0（免费），详情页会显示「免费」并提供下载。
 * 图片放在 public/media/ 下，以 /media/xxx.jpg 引用。
 */

/** 每个内容条目通用的折叠说明 */
const standardDetails: ProductDetail[] = [
  {
    label: '内容简介',
    body: '由本站编辑部与球迷共同整理。所有内容仅供球迷免费观看、下载与交流学习，禁止商用。',
  },
  {
    label: '如何下载',
    body: '点击详情页「立即下载」即可保存到本地；也可以把多个内容加入「下载清单」稍后统一下载。',
  },
  {
    label: '来源与版权',
    body: '素材来自公开渠道与球迷投稿，版权归原作者所有。如有侵权请联系删除。',
  },
]

/** 生成单个规格（应援内容没有尺码概念，统一一个「原版」规格） */
const singleVariant = (prefix: string) => [
  { id: `${prefix}-std`, color: '标准', colorHex: '#c8102e', size: '原版', available: true },
]

const products: Product[] = [
  // ---------- 精彩图集 ----------
  {
    id: 'p-the-wall',
    slug: 'the-wall-poster',
    name: '「红白之墙」比赛日海报',
    priceMinor: 0,
    badges: [{ label: '热门🔥', kind: 'plain' }],
    collectionSlugs: ['photos'],
    images: [
      { src: '/media/c-wall.jpg', alt: '萨利巴红白之墙主题海报' },
      { src: '/media/statement.jpg', alt: '看台上挥舞的 12 号旗帜' },
    ],
    variants: singleVariant('wall'),
    details: standardDetails,
  },
  {
    id: 'p-clean-sheet',
    slug: 'clean-sheet-night',
    name: '零封之夜 · 庆祝图集',
    priceMinor: 0,
    badges: [{ label: '免费下载', kind: 'plain' }],
    collectionSlugs: ['photos'],
    images: [
      { src: '/media/c-cleansheet.jpg', alt: '萨利巴与队友庆祝零封' },
      { src: '/media/c-fans.jpg', alt: '看台上欢呼的球迷' },
    ],
    variants: singleVariant('cleansheet'),
    details: standardDetails,
  },
  {
    id: 'p-derby-duel',
    slug: 'derby-duel',
    name: '北伦敦德比 · 对抗瞬间',
    priceMinor: 0,
    badges: [],
    collectionSlugs: ['photos'],
    images: [
      { src: '/media/c-derby.jpg', alt: '德比战中的激烈对抗' },
      { src: '/media/cat-photos.jpg', alt: '精准铲抢瞬间' },
    ],
    variants: singleVariant('derby'),
    details: standardDetails,
  },
  // ---------- 视频集锦 ----------
  {
    id: 'p-highlights',
    slug: 'season-highlights',
    name: '赛季防守高光集锦',
    priceMinor: 0,
    badges: [{ label: '视频', kind: 'sale' }],
    collectionSlugs: ['videos'],
    videoSrc: '/media/highlights.mp4',
    images: [
      { src: '/media/c-highlights.jpg', alt: '萨利巴头球解围瞬间' },
      { src: '/media/hero-1.jpg', alt: '萨利巴伫立球场' },
    ],
    variants: singleVariant('highlights'),
    details: [
      {
        label: '内容简介',
        body: '拦截、解围、制空、出球——本赛季萨利巴防守端的高光时刻剪辑，适合二创与安利。',
      },
      ...standardDetails.slice(1),
    ],
  },
  {
    id: 'p-skills',
    slug: 'ball-playing-skills',
    name: '出球与脚下技术精选',
    priceMinor: 0,
    badges: [{ label: '视频', kind: 'sale' }],
    collectionSlugs: ['videos'],
    images: [
      { src: '/media/c-skills.jpg', alt: '脚下控球特写' },
      { src: '/media/cat-videos.jpg', alt: '转播镜头下的比赛画面' },
    ],
    variants: singleVariant('skills'),
    details: standardDetails,
  },
  {
    id: 'p-fans-cam',
    slug: 'fans-cam',
    name: '球迷视角 · 助威现场',
    priceMinor: 0,
    badges: [],
    collectionSlugs: ['videos'],
    images: [
      { src: '/media/c-fans.jpg', alt: '挥舞围巾助威的球迷' },
      { src: '/media/hero-2.jpg', alt: '夜晚的球场与红色海洋' },
    ],
    variants: singleVariant('fanscam'),
    details: standardDetails,
  },
  // ---------- 访谈记录 ----------
  {
    id: 'p-interview-home',
    slug: 'interview-home',
    name: '专访：「这里就是我的家」',
    priceMinor: 0,
    badges: [{ label: '文字实录', kind: 'plain' }],
    collectionSlugs: ['interviews'],
    images: [
      { src: '/media/c-interview-1.jpg', alt: '发布会现场的萨利巴' },
      { src: '/media/cat-interviews.jpg', alt: '发布会桌上的麦克风' },
    ],
    variants: singleVariant('ivhome'),
    details: [
      {
        label: '访谈节选',
        body: '「从第一天起，这家俱乐部就让我感到被信任。伦敦就是我的家，我想在这里赢得一切。」——谈续约与归属感。',
      },
      ...standardDetails.slice(1),
    ],
  },
  {
    id: 'p-interview-france',
    slug: 'interview-france',
    name: '法国队发布会实录',
    priceMinor: 0,
    badges: [],
    collectionSlugs: ['interviews'],
    images: [
      { src: '/media/c-interview-2.jpg', alt: '身披法国队战袍的萨利巴' },
      { src: '/media/cat-interviews.jpg', alt: '混合采访区' },
    ],
    variants: singleVariant('ivfr'),
    details: [
      {
        label: '访谈节选',
        body: '「为国出战是儿时梦想。每一次穿上这件球衣，我都想证明自己配得上它。」——谈国家队竞争与目标。',
      },
      ...standardDetails.slice(1),
    ],
  },
  {
    id: 'p-interview-journey',
    slug: 'interview-journey',
    name: '从邦迪到北伦敦 · 成长之路',
    priceMinor: 0,
    badges: [],
    collectionSlugs: ['interviews'],
    images: [
      { src: '/media/cat-interviews.jpg', alt: '新闻发布会现场' },
      { src: '/media/promo-dark.jpg', alt: '球员通道中的身影' },
    ],
    variants: singleVariant('ivjourney'),
    details: [
      {
        label: '访谈节选',
        body: '从巴黎郊区的邦迪踢球少年，到圣埃蒂安、马赛，再到北伦敦的后防核心——一条关于耐心与自律的成长曲线。',
      },
      ...standardDetails.slice(1),
    ],
  },
  // ---------- 比赛记录 ----------
  {
    id: 'p-match-city',
    slug: 'match-vs-city',
    name: '比赛记录：vs 曼城',
    priceMinor: 0,
    badges: [{ label: '焦点战', kind: 'plain' }],
    collectionSlugs: ['matches'],
    images: [
      { src: '/media/c-match.jpg', alt: '赛前战术板与首发名单' },
      { src: '/media/cat-matches.jpg', alt: '防守站位示意' },
    ],
    variants: singleVariant('mcity'),
    details: [
      {
        label: '比赛速览',
        body: '关键数据：解围、拦截、对抗成功率、传球成功率一览，附赛后评分与教练点评。数据为示例，可按真实赛况修改。',
      },
      ...standardDetails.slice(1),
    ],
  },
  {
    id: 'p-match-spurs',
    slug: 'match-vs-spurs',
    name: '比赛记录：北伦敦德比',
    priceMinor: 0,
    badges: [{ label: '德比', kind: 'sale' }],
    collectionSlugs: ['matches'],
    images: [
      { src: '/media/cat-matches.jpg', alt: '德比战术布置' },
      { src: '/media/c-derby.jpg', alt: '德比对抗瞬间' },
    ],
    variants: singleVariant('mspurs'),
    details: [
      {
        label: '比赛速览',
        body: '德比战全程记录：出场时间、关键防守动作时间轴、赛后声音。数据为示例，可按真实赛况修改。',
      },
      ...standardDetails.slice(1),
    ],
  },
  {
    id: 'p-season-stats',
    slug: 'season-stats',
    name: '赛季数据总览',
    priceMinor: 0,
    badges: [{ label: '持续更新', kind: 'plain' }],
    collectionSlugs: ['matches'],
    images: [
      { src: '/media/c-stats.jpg', alt: '数据分析面板' },
      { src: '/media/c-match.jpg', alt: '阵型与站位' },
    ],
    variants: singleVariant('stats'),
    details: [
      {
        label: '数据说明',
        body: '出场、零封、对抗、传球等赛季累计数据面板，随赛程滚动更新。数据为示例，可接入真实数据源。',
      },
      ...standardDetails.slice(1),
    ],
  },
]

export const siteConfig: SiteConfig = {
  locale: 'zh-CN',
  currency: 'CNY',
  siteTitle: '萨利巴 12 号应援站 — William Saliba 球迷站',
  siteDescription:
    '威廉·萨利巴（William Saliba）中文球迷应援站：图片、视频、访谈、比赛记录免费观看下载，点击右下角「+」即可直接上传你的应援作品。',
  brandName: '萨利巴12号',
  theme: {
    canvas: '#f6f3ec',
    ink: '#17130e',
    muted: '#6f6759',
    line: '#ddd5c3',
    accent: '#c8102e',
    dark: '#101418',
    sale: '#063672',
  },
  /** 详情页「距离下一场比赛」倒计时时长（毫秒），可自行调整 */
  countdownDurationMs: 12 * 864e5 + 6 * 36e5,

  collections: [
    { slug: 'photos', name: '精彩图集', image: { src: '/media/cat-photos.jpg', alt: '比赛精彩瞬间' } },
    { slug: 'videos', name: '视频集锦', image: { src: '/media/cat-videos.jpg', alt: '视频集锦' } },
    { slug: 'interviews', name: '访谈记录', image: { src: '/media/cat-interviews.jpg', alt: '访谈记录' } },
    { slug: 'matches', name: '比赛记录', image: { src: '/media/cat-matches.jpg', alt: '比赛记录' } },
  ],

  products,

  homeSectionOrder: [
    'hero',
    'playerProfile',
    'trendGrid',
    'curatedLooks',
    'wordScroll',
    'promoBanner',
    'statement',
    'lookbook',
    'vibe',
    'stripMarquee',
    'testimonials',
  ],

  sections: {
    hero: {
      autoplayMs: 6000,
      effects: { enabled: true },
      slides: [
        {
          image: { src: '/media/hero-1.jpg', alt: '萨利巴伫立在球场中央' },
          titleLines: ['红白之墙', 'WILLIAM SALIBA'],
          ctaLabel: '进入内容库',
          ctaHref: '/collection',
        },
        {
          image: { src: '/media/hero-2.jpg', alt: '夜晚的球场与红色海洋' },
          titleLines: ['12 号传奇', '正在书写'],
          ctaLabel: '上传你的作品',
          ctaHref: '/upload',
        },
      ],
      chips: [
        { label: '精彩图集', subLabel: '免费下载', image: { src: '/media/cat-photos.jpg', alt: '' }, href: '/collection?c=photos' },
        { label: '视频集锦', subLabel: '免费观看', image: { src: '/media/cat-videos.jpg', alt: '' }, href: '/collection?c=videos' },
      ],
    },
    playerProfile: {
      kicker: '球员资料 · PLAYER PROFILE',
      heading: '威廉·萨利巴 William Saliba',
      paragraphs: [
        '威廉·萨利巴，2001 年 3 月 24 日出生于法国巴黎郊区的邦迪，法国职业足球运动员，司职中后卫，现效力于英超阿森纳足球俱乐部，并入选法国国家队。',
        '萨利巴出道于圣埃蒂安青训，2019 年加盟阿森纳，先后租借效力圣埃蒂安、尼斯与马赛，并在马赛当选法甲赛季最佳年轻球员。2022 年回归阿森纳后迅速坐稳主力，以冷静的防守选位、出色的出球能力和空中统治力成为球队后防核心，多次入选英超 PFA 年度最佳阵容。',
      ],
      facts: [
        { label: '全名', value: '威廉·阿兰·安德烈·加布里埃尔·萨利巴' },
        { label: '出生日期', value: '2001 年 3 月 24 日' },
        { label: '出生地', value: '法国 · 邦迪（Bondy）' },
        { label: '身高', value: '1.93 米' },
        { label: '场上位置', value: '中后卫' },
        { label: '现效力俱乐部', value: '阿森纳（英超）' },
        { label: '俱乐部号码', value: '2 号（2023 年起，此前为 12 号）' },
        { label: '国家队', value: '法国（2022 年完成首秀）' },
        { label: '青训生涯', value: '邦迪 → 圣埃蒂安' },
        { label: '主要荣誉', value: '法甲最佳年轻球员、多次 PFA 英超最佳阵容、社区盾冠军' },
      ],
      image: { src: '/media/c-wall.jpg', alt: '萨利巴主题海报' },
      ctaLabel: '查看他的比赛记录',
      ctaHref: '/collection?c=matches',
    },
    trendGrid: {
      heading: '本周热门',
      productIds: ['p-the-wall', 'p-highlights', 'p-interview-home', 'p-match-spurs'],
    },
    promoBanner: {
      marqueeWords: ['球迷共创'],
      heading: '球迷共创计划',
      body: '你有萨利巴的独家图片、二创视频或译制访谈？无需注册，点击右下角「+」即可直接上传，与全球枪迷一起分享。全部内容免费开放。',
      ctaLabel: '立即上传 +',
      ctaHref: '/upload',
      image: { src: '/media/promo-dark.jpg', alt: '球员通道中的萨利巴' },
    },
    curatedLooks: {
      heading: '内容分区',
      categories: [
        { label: '精彩图集', image: { src: '/media/cat-photos.jpg', alt: '' }, href: '/collection?c=photos' },
        { label: '视频集锦', image: { src: '/media/cat-videos.jpg', alt: '' }, href: '/collection?c=videos' },
        { label: '比赛记录', image: { src: '/media/cat-matches.jpg', alt: '' }, href: '/collection?c=matches' },
      ],
      productIds: ['p-clean-sheet', 'p-derby-duel', 'p-skills', 'p-fans-cam', 'p-match-city', 'p-season-stats'],
    },
    trio: {
      left: { image: { src: '/media/c-highlights.jpg', alt: '头球解围' }, href: '/collection?c=videos' },
      right: { image: { src: '/media/c-derby.jpg', alt: '德比对抗' }, href: '/collection?c=photos' },
      center: {
        image: { src: '/media/statement.jpg', alt: '12 号旗帜' },
        badgeLabel: '球迷共创',
        heading: '为爱发电',
        ctaLabel: '上传作品',
        ctaHref: '/upload',
      },
      miniProductIds: ['p-the-wall', 'p-interview-home'],
    },
    wordScroll: {
      rows: [
        [
          { type: 'text', text: '拦截' },
          { type: 'text', text: '制空' },
          { type: 'image', image: { src: '/media/c-highlights.jpg', alt: '' } },
          { type: 'text', text: '出球' },
        ],
        [
          { type: 'text', text: '红白之墙' },
          { type: 'image', image: { src: '/media/c-wall.jpg', alt: '' } },
          { type: 'text', text: '12 号' },
          { type: 'image', image: { src: '/media/c-fans.jpg', alt: '' } },
          { type: 'text', text: 'COYG' },
        ],
        [
          { type: 'image', image: { src: '/media/statement.jpg', alt: '' } },
          { type: 'text', text: '领袖' },
          { type: 'image', image: { src: '/media/c-cleansheet.jpg', alt: '' } },
          { type: 'text', text: '零封' },
        ],
      ],
    },
    statement: {
      words: ['拦截', '出球', '制空', '领袖', '12号'],
      body: '他不是最张扬的那个，却是防线上最让人安心的那个。一次次精准的卡位、冷静的回追、从容的出球——这就是威廉·萨利巴，枪手后防的定海神针。',
      ctaLabel: '了解他的比赛',
      ctaHref: '/collection?c=matches',
      image: { src: '/media/statement.jpg', alt: '看台上的 12 号旗帜' },
      rotateMs: 1600,
    },
    duo: {
      leftImage: { src: '/media/c-interview-1.jpg', alt: '发布会现场' },
      rightImage: { src: '/media/c-fans.jpg', alt: '助威的球迷' },
      heading: '关于这个站',
      paragraphs: [
        '这是一座由球迷搭建、为球迷服务的非营利应援站。我们收集整理萨利巴的图片、视频、访谈与比赛记录，全部免费向大众开放观看与下载。',
        '也欢迎每一位枪迷加入共创：点击右下角「+」直接上传你的独家内容，让这里成为中文世界最完整的萨利巴资料库。',
      ],
      ctaLabel: '加入我们',
      ctaHref: '/upload',
    },
    season: {
      image: { src: '/media/hero-2.jpg', alt: '赛季中的球场' },
      heading: '2025/26 赛季进行中',
    },
    editorialDark: {
      heading: '免费，且永远免费',
      paragraphs: [
        '本站所有内容均可免费观看与下载，不设门槛、没有付费墙。素材来自公开渠道与球迷投稿，仅供学习交流，版权归原作者。',
        '如果你是内容创作者，希望署名或撤下作品，请通过页脚邮箱联系我们，我们会第一时间处理。',
      ],
      ctaLabel: '浏览内容库',
      ctaHref: '/collection',
    },
    vibe: {
      image: { src: '/media/c-wall.jpg', alt: '红白之墙海报' },
      heading: '一键下载，为爱发电',
      body: '看到喜欢的图片或视频？点进详情页即可免费下载原图与视频，做壁纸、做剪辑、做安利图，随你用。',
      links: [
        { label: '全部内容', href: '/collection', primary: true },
        { label: '精彩图集', href: '/collection?c=photos' },
      ],
      productIds: ['p-the-wall', 'p-clean-sheet', 'p-derby-duel', 'p-season-stats'],
    },
    stripMarquee: {
      words: ['COYG · 萨利巴 12 号 —'],
    },
    twin: {
      items: [
        { image: { src: '/media/c-skills.jpg', alt: '脚下技术特写' }, href: '/collection?c=videos', action: 'link' },
        { image: { src: '/media/c-cleansheet.jpg', alt: '零封庆祝' }, href: '/collection?c=photos', action: 'link' },
      ],
    },
    lookbook: {
      heading: '赛季影像档案',
      body: '从球员通道到终场哨响：这一季关于 12 号的视觉记录——海报、对抗、庆祝，和那些值得珍藏的瞬间。',
      items: [
        {
          image: { src: '/media/hero-1.jpg', alt: '萨利巴伫立球场' },
          span: 'hero',
          tagSmall: '本站精选',
          tagStrong: '红白之墙',
        },
        { image: { src: '/media/c-wall.jpg', alt: '主题海报' }, num: '12' },
        { image: { src: '/media/c-derby.jpg', alt: '德比对抗' } },
        { image: { src: '/media/c-cleansheet.jpg', alt: '零封庆祝' } },
        { image: { src: '/media/promo-dark.jpg', alt: '球员通道' } },
      ],
    },
    lounge: {
      kicker: '最新上传',
      heading: '球迷共创区持续更新中',
      paragraphs: [
        '这里展示球迷投稿的最新内容：二创海报、译制访谈、观赛手记……每一份热爱都值得被看见。',
        '上传入口永远开放，无需注册即可投稿。',
      ],
      ctaLabel: '去上传',
      ctaHref: '/upload',
      productIds: ['p-interview-france', 'p-interview-journey'],
    },
    testimonials: {
      heading: '枪迷留言墙',
      featureImage: { src: '/media/c-fans.jpg', alt: '看台上的球迷' },
      items: [
        {
          heading: '太全了',
          body: '想找萨利巴的访谈中译，结果在这里翻到了一整页的实录，还有高清海报可以下载，感动。',
          author: '北伦敦的风',
          role: '枪迷 · 上海',
          avatar: { src: '/media/avatar-1.jpg', alt: '球迷头像' },
        },
        {
          heading: '二创素材库',
          body: '做安利视频一直缺素材，这里的高光集锦和图集直接免费用，剪了三条视频都破万赞了。',
          author: '剪辑小白',
          role: 'UP 主 · 广州',
          avatar: { src: '/media/avatar-2.jpg', alt: '球迷头像' },
        },
        {
          heading: '一起共建',
          body: '上传了自己拍的现场照片，第二天就收到了好多同好的留言。这大概就是足球的意义。',
          author: '12号观察员',
          role: '现场球迷 · 伦敦',
          avatar: { src: '/media/avatar-1.jpg', alt: '球迷头像' },
        },
      ],
    },
  },

  copy: {
    skipLink: '跳至内容',
    announcement: {
      messages: [
        '全部内容免费观看与下载',
        '点击右下角「+」即可上传作品',
        'COYG！一起为萨利巴加油',
      ],
      countdownAria: '倒计时',
      localeLabel: '中国 / 中文',
      prevMessageAria: '上一条公告',
      nextMessageAria: '下一条公告',
      daysUnit: '天',
      hoursUnit: '小时',
      minsUnit: '分',
      secsUnit: '秒',
    },
    header: {
      menuAria: '打开菜单',
      searchAria: '搜索',
      accountAria: '账户',
      cartAria: '打开下载清单',
      nav: [
        { label: '首页', href: '/' },
        {
          label: '内容库',
          href: '/collection',
          submenu: [
            { label: '全部内容', href: '/collection' },
            { label: '精彩图集', href: '/collection?c=photos' },
            { label: '视频集锦', href: '/collection?c=videos' },
            { label: '访谈记录', href: '/collection?c=interviews' },
            { label: '比赛记录', href: '/collection?c=matches' },
          ],
        },
        { label: '图集', href: '/collection?c=photos' },
        { label: '视频', href: '/collection?c=videos' },
        { label: '访谈', href: '/collection?c=interviews' },
        { label: '比赛记录', href: '/collection?c=matches' },
        { label: '上传作品', href: '/upload' },
      ],
    },
    search: {
      title: '搜索内容',
      placeholder: '搜索图片、视频、访谈…',
      popularHeading: '热门搜索',
      popularTerms: ['高光集锦', '德比', '专访', '零封', '数据'],
      resultsHeading: '内容',
      emptyText: '没有找到匹配的内容。',
      closeAria: '关闭搜索',
    },
    quickView: {
      title: '快速查看',
      viewDetailsLabel: '查看完整详情',
      closeAria: '关闭快速查看',
    },
    mobileMenu: {
      title: '菜单',
      closeAria: '关闭菜单',
    },
    cart: {
      title: '你的下载清单',
      closeAria: '关闭下载清单',
      emptyTitle: '下载清单是空的。',
      emptyBody: '去内容库逛逛，把喜欢的素材加进来吧。',
      subtotalLabel: '合计',
      checkoutLabel: '打包下载',
      checkoutDemoNotice: '打包下载暂未开放，请在详情页逐个「立即下载」。',
      removeLabel: '移除',
      decreaseAria: '减少数量',
      increaseAria: '增加数量',
      sizePrefix: '规格',
      addedNotice: '已加入下载清单',
      resetDemoLabel: '清空清单',
    },
    product: {
      addToCartLabel: '加入下载清单',
      soldOutLabel: '暂未开放',
      quickAddAria: '快速加入',
      quickViewLabel: '快速查看',
      vendorLabel: '萨利巴应援站',
      colorLabel: '主题',
      sizeLabel: '规格',
      quantityLabel: '数量',
      buyNowLabel: '立即下载',
      buyNowDemoNotice: '开始下载…',
      taxNote: '本站内容仅供球迷免费学习交流，禁止商用。',
      metaLabels: { vendor: '站点', type: '分类', sku: '编号', availability: '状态' },
      availabilityInStock: '已上线，可免费下载',
      relatedHeading: '相关内容推荐',
      hurryHeading: '距离下一场比赛',
      timerUnits: { days: '天', hours: '小时', mins: '分', secs: '秒' },
    },
    collection: {
      title: '内容库',
      breadcrumbHome: '首页',
      allLabel: '全部内容',
      sortLabel: '排序：',
      sortOptions: [
        { value: 'featured', label: '精选推荐' },
        { value: 'title', label: '按名称 A–Z' },
        { value: 'price-asc', label: '按名称 Z–A' },
        { value: 'price-desc', label: '默认排序' },
      ],
      loadMoreLabel: '显示更多内容',
      emptyLabel: '没有符合筛选条件的内容。',
    },
    newsletter: {
      heading: '订阅更新，第一时间获取新内容',
      placeholder: 'you@example.com',
      submitAria: '订阅',
      successNotice: '感谢订阅！新内容上线会通知你。',
      invalidNotice: '请输入有效的邮箱地址。',
    },
    footer: {
      emailLabel: '联系邮箱',
      emailValue: 'fans@saliba12.example.com',
      phoneLabel: '投稿咨询',
      phoneValue: '通过邮箱联系我们',
      socialHeading: '关注我们',
      socials: [
        { label: 'YouTube', href: '#', icon: 'youtube' },
        { label: 'X', href: '#', icon: 'x' },
        { label: 'Instagram', href: '#', icon: 'instagram' },
        { label: 'TikTok', href: '#', icon: 'tiktok' },
      ],
      columns: [
        {
          heading: '内容',
          links: [
            { label: '精彩图集', href: '/collection?c=photos' },
            { label: '视频集锦', href: '/collection?c=videos' },
            { label: '访谈记录', href: '/collection?c=interviews' },
            { label: '比赛记录', href: '/collection?c=matches' },
            { label: '全部内容', href: '/collection' },
          ],
        },
        {
          heading: '快速链接',
          links: [
            { label: '首页', href: '/' },
            { label: '内容库', href: '/collection' },
            { label: '上传作品', href: '/upload' },
          ],
        },
        {
          heading: '关于球员',
          links: [
            { label: '赛季数据', href: '/product/season-stats' },
            { label: '成长之路', href: '/product/interview-journey' },
            { label: '高光集锦', href: '/product/season-highlights' },
          ],
        },
        {
          heading: '站点说明',
          links: [
            { label: '联系我们', href: '#' },
            { label: '版权说明', href: '#' },
            { label: '使用条款', href: '#' },
          ],
        },
      ],
      localeLabel: '中国 / 中文',
      copyright: '© 2026 萨利巴12号应援站 · 球迷非营利站点',
      paymentLabels: [],
    },
    notFound: {
      heading: '找不到页面',
      body: '你要找的页面不存在，或已被移动。',
      ctaLabel: '返回首页',
    },
    errors: {
      configTitle: '配置错误',
      missingProduct: '该内容已下架。',
    },
    stories: {
      heading: '球迷故事',
      items: [
        { image: { src: '/media/c-fans.jpg', alt: '看台上的球迷' }, kicker: '共创', title: '上传你的独家内容', href: '/upload' },
        { image: { src: '/media/c-interview-1.jpg', alt: '发布会现场' }, kicker: '访谈', title: '最新专访实录', href: '/collection?c=interviews' },
      ],
    },
    faq: {
      heading: '常见问题',
      items: [
        {
          label: '内容真的可以免费下载吗？',
          body: '可以。本站所有内容面向大众免费开放，进入任意内容详情页，点击「立即下载」即可保存到本地。',
        },
        {
          label: '如何上传我的作品？',
          body: '点击页面右下角红色的「+」按钮，填写标题、分类和内容链接即可提交，无需注册登录，提交后立即展示在共创区。',
        },
        {
          label: '内容的版权归属？',
          body: '素材来自公开渠道与球迷投稿，仅供学习交流，版权归原作者所有。如需署名或撤下作品，请通过页脚邮箱联系我们。',
        },
      ],
    },
  },
}

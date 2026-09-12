import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { CATEGORY_LABELS, UploadForm } from '../components/UploadForm'

/**
 * 球迷共创区（免登录版）：
 * - 任何人都可以直接上传内容（图片 / 视频 / 访谈 / 比赛记录）
 * - 页面下方实时展示所有共创内容
 * 右下角「+」按钮（UploadFab）与本页共用同一个 UploadForm。
 */
export function UploadPage() {
  const listQuery = trpc.contributions.list.useQuery()

  return (
    <main className="page-head container" id="main">
      <p className="breadcrumb">
        <Link to="/">首页</Link> / <span>上传作品</span>
      </p>
      <h1>球迷共创区</h1>
      <p style={{ maxWidth: 640, color: 'var(--muted)', marginTop: 8 }}>
        无需注册登录，分享你收藏的萨利巴图片、二创视频、译制访谈或观赛记录，内容对所有访客免费开放。
      </p>

      <section className="section" style={{ maxWidth: 640 }}>
        <UploadForm />
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">最新共创内容</h2>
        </div>
        {listQuery.isLoading ? (
          <p>加载中…</p>
        ) : (listQuery.data ?? []).length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>还没有球迷上传内容，来当第一个吧！</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {(listQuery.data ?? []).map((item) => (
              <article
                key={item.id}
                style={{ border: '1px solid var(--line)', padding: 16, display: 'grid', gap: 6 }}
              >
                <p style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <b>{item.title}</b>
                  <small style={{ color: 'var(--sale)' }}>{CATEGORY_LABELS[item.category] ?? item.category}</small>
                  <small style={{ color: 'var(--muted)' }}>
                    {item.authorName ?? '匿名球迷'} · {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                  </small>
                </p>
                {item.description ? <p style={{ color: 'var(--muted)' }}>{item.description}</p> : null}
                <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                  查看内容 →
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { UploadForm } from './UploadForm'

/**
 * 右下角「+」悬浮上传按钮：
 * - 固定在每个页面的右下角
 * - 点击弹出上传对话框（无需登录，四大模块均可直接上传）
 * - 样式在 src/styles/base.css 的 .upload-fab / .upload-modal 中，可自由调整
 */
export function UploadFab() {
  const [open, setOpen] = useState(false)

  // Esc 关闭弹窗
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="upload-fab"
        aria-label="上传作品"
        title="上传作品"
        onClick={() => setOpen(true)}
      >
        +
      </button>

      {open ? (
        <div className="upload-modal" role="dialog" aria-modal="true" aria-label="上传作品">
          <div className="upload-modal__backdrop" onClick={() => setOpen(false)} />
          <div className="upload-modal__panel">
            <div className="upload-modal__head">
              <h2>上传作品</h2>
              <button type="button" className="upload-modal__close" aria-label="关闭" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <p className="upload-modal__tip">无需注册登录，图片、视频、访谈、比赛内容均可直接上传分享。</p>
            <UploadForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  )
}

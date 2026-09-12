import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { useToast } from './useToast'

export const CATEGORY_LABELS: Record<string, string> = {
  photos: '精彩图集',
  videos: '视频集锦',
  interviews: '访谈记录',
  matches: '比赛记录',
  other: '其他',
}

/**
 * 免登录上传表单（共享组件）：
 * 同时被右下角「+」上传弹窗（UploadFab）和 /upload 页面使用。
 * 所有字段直接提交到 contributions.create 接口，无需账号。
 */
export function UploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const { notify } = useToast()
  const utils = trpc.useUtils()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('photos')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [authorName, setAuthorName] = useState('')

  const createMutation = trpc.contributions.create.useMutation({
    onSuccess: async () => {
      notify('上传成功，感谢你的分享！')
      setTitle('')
      setUrl('')
      setDescription('')
      setAuthorName('')
      await utils.contributions.list.invalidate()
      onSuccess?.()
    },
    onError: (err) => notify(err.message || '上传失败，请稍后重试'),
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      title: title.trim(),
      category: category as 'photos' | 'videos' | 'interviews' | 'matches' | 'other',
      url: url.trim(),
      description: description.trim() || undefined,
      authorName: authorName.trim() || undefined,
    })
  }

  return (
    <form onSubmit={submit} className="upload-form">
      <label>
        标题 *
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：萨利巴德比战高清图集"
        />
      </label>
      <label>
        分类 *
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        内容链接 *
        <input
          required
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…（图片 / 视频 / 文章的地址）"
        />
      </label>
      <label>
        署名（可选）
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="你的昵称，不填则显示「匿名球迷」"
        />
      </label>
      <label>
        描述（可选）
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="简单介绍一下这份内容…"
        />
      </label>
      <button type="submit" className="btn btn--accent" disabled={createMutation.isPending}>
        {createMutation.isPending ? '提交中…' : '提交上传'}
      </button>
    </form>
  )
}

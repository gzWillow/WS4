/** Shared section heading + optional carousel arrows. */
export function SectionHead({
  title,
  onPrev,
  onNext,
  prevLabel = '上一个',
  nextLabel = '下一个',
}: {
  title: string
  onPrev?: () => void
  onNext?: () => void
  prevLabel?: string
  nextLabel?: string
}) {
  return (
    <div className="section__head">
      <h2 className="section__title">{title}</h2>
      {onPrev && onNext ? (
        <div className="section__nav">
          <button type="button" className="arrow-btn" onClick={onPrev} aria-label={prevLabel}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="arrow-btn" onClick={onNext} aria-label={nextLabel}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

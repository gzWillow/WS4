import { useState } from 'react'
import { siteConfig } from '../config'
import { useCountdown } from '../hooks/useCountdown'
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconGlobe } from './Icons'

export function AnnouncementBar() {
  const copy = siteConfig.copy.announcement
  const { days, hours, mins, secs } = useCountdown(siteConfig.countdownDurationMs)
  const [msgIdx, setMsgIdx] = useState(0)
  const show = (n: number) => setMsgIdx((n + copy.messages.length) % copy.messages.length)

  return (
    <div className="announcement">
      <div className="container announcement__inner">
        <div className="announcement__countdown" role="timer" aria-label={copy.countdownAria}>
          <b>{days}</b> {copy.daysUnit} <span>:</span> <b>{String(hours).padStart(2, '0')}</b> {copy.hoursUnit}{' '}
          <span>:</span> <b>{String(mins).padStart(2, '0')}</b> {copy.minsUnit} <span>:</span>{' '}
          <b key={secs} className="tick">{String(secs).padStart(2, '0')}</b> {copy.secsUnit}
        </div>
        <div className="announcement__promo">
          <button type="button" onClick={() => show(msgIdx - 1)} aria-label={copy.prevMessageAria}>
            <IconChevronLeft size={12} />
          </button>
          <p>{copy.messages[msgIdx]}</p>
          <button type="button" onClick={() => show(msgIdx + 1)} aria-label={copy.nextMessageAria}>
            <IconChevronRight size={12} />
          </button>
        </div>
        <div className="announcement__locale">
          <IconGlobe />
          {copy.localeLabel} <IconChevronDown />
        </div>
      </div>
    </div>
  )
}

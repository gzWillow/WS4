/* Inline SVG icon set (original paths, stroke/currentColor). */

interface IconProps {
  size?: number
  className?: string
}

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const IconMenu = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M3 6h18M3 12h18M3 18h12" /></svg>
)
export const IconSearch = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
)
export const IconUser = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
)
export const IconBag = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M6 7h12l1.2 13H4.8L6 7z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
)
export const IconClose = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const IconChevronDown = ({ size = 10, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
)
export const IconChevronLeft = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
)
export const IconChevronRight = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={2}><path d="M9 6l6 6-6 6" /></svg>
)
export const IconGlobe = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 4 5.7 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.7-4-9s1.5-6.4 4-9z" />
  </svg>
)
export const IconMail = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={1.6}><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></svg>
)
export const IconPhone = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={1.6}>
    <path d="M5 4h4l2 5-3 2a13 13 0 0 0 5 5l2-3 5 2v4c0 1-1 2-2 2A18 18 0 0 1 3 6c0-1 1-2 2-2z" />
  </svg>
)
export const IconPlus = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
)

export function SocialIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }
  switch (icon) {
    case 'facebook':
      return <svg {...props}><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3z" /></svg>
    case 'youtube':
      return <svg {...props}><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" /></svg>
    case 'x':
      return <svg {...props}><path d="M17.3 4h2.7l-6 6.8L21 20h-5.6l-4.3-5.7L6 20H3.3l6.4-7.3L3.4 4H9l3.9 5.2L17.3 4zm-.9 14.4h1.5L7.7 5.5H6.1l10.3 12.9z" /></svg>
    case 'instagram':
      return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'tiktok':
      return <svg {...props}><path d="M16.5 3c.4 2.3 1.8 3.7 4 3.9v3c-1.6 0-3-.5-4-1.3v6.6a5.9 5.9 0 1 1-5.9-5.9c.3 0 .7 0 1 .1v3.1a2.8 2.8 0 1 0 1.9 2.7V3h3z" /></svg>
    default:
      return null
  }
}

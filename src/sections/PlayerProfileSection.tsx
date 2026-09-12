import { siteConfig } from '../config'
import { SafeImage } from '../components/SafeImage'

/**
 * 首页「球员资料」板块：左图右文，附信息表。
 * 文案与数据全部来自 config.ts 的 sections.playerProfile，改配置即可更新。
 */
export function PlayerProfileSection() {
  const profile = siteConfig.sections.playerProfile
  return (
    <section className="section player-profile container" id="player-profile" data-reveal>
      <div className="player-profile__media">
        <SafeImage image={profile.image} loading="lazy" />
      </div>
      <div className="player-profile__body">
        <p className="player-profile__kicker">{profile.kicker}</p>
        <h2 className="section__title">{profile.heading}</h2>
        {profile.paragraphs.map((p, i) => (
          <p key={i} className="player-profile__text">
            {p}
          </p>
        ))}
        <dl className="player-profile__facts">
          {profile.facts.map((fact) => (
            <div key={fact.label} className="player-profile__fact">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <a className="btn" href={profile.ctaHref}>
          {profile.ctaLabel}
        </a>
      </div>
    </section>
  )
}

import { siteConfig } from '../config'
import type { HomeSectionId } from '../types'
import { HeroSection } from '../sections/HeroSection'
import { TrendGridSection } from '../sections/TrendGridSection'
import { PromoBannerSection, StripMarqueeSection } from '../sections/MarqueeSections'
import { CuratedLooksSection } from '../sections/CuratedLooksSection'
import { TrioSection, WordScrollSection } from '../sections/TrioWordSections'
import { DuoSection, EditorialDarkSection, SeasonSection, StatementSection } from '../sections/EditorialSections'
import { VibeSection } from '../sections/VibeSection'
import { LookbookSection, TwinSection } from '../sections/TwinLookbookSections'
import { LoungeSection } from '../sections/LoungeSection'
import { TestimonialsSection } from '../sections/TestimonialsSection'
import { PlayerProfileSection } from '../sections/PlayerProfileSection'

const SECTION_COMPONENTS: Record<HomeSectionId, () => React.JSX.Element> = {
  hero: HeroSection,
  playerProfile: PlayerProfileSection,
  trendGrid: TrendGridSection,
  promoBanner: PromoBannerSection,
  curatedLooks: CuratedLooksSection,
  trio: TrioSection,
  wordScroll: WordScrollSection,
  statement: StatementSection,
  duo: DuoSection,
  season: SeasonSection,
  editorialDark: EditorialDarkSection,
  vibe: VibeSection,
  stripMarquee: StripMarqueeSection,
  twin: TwinSection,
  lookbook: LookbookSection,
  lounge: LoungeSection,
  testimonials: TestimonialsSection,
}

export function HomePage() {
  return (
    <main id="main">
      {siteConfig.homeSectionOrder.map((id) => {
        const Section = SECTION_COMPONENTS[id]
        return <Section key={id} />
      })}
    </main>
  )
}

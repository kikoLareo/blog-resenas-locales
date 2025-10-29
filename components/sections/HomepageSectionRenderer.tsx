'use client';

import { HomepageSection } from '@/types/homepage';
import PosterSection from './PosterSection';
import PosterV2Section from './PosterV2Section';
import BannerSection from './BannerSection';
import CardSquareSection from './CardSquareSection';
import HomepageHeroSection from './HomepageHeroSection';

interface HomepageSectionRendererProps {
  section: HomepageSection;
}

export default function HomepageSectionRenderer({ section }: HomepageSectionRendererProps) {
  // Don't render disabled sections
  if (!section.enabled) {
    return null;
  }

  // Don't render sections without selected items
  if (!section.config.selectedItems?.length) {
    return null;
  }

  // Render based on section type
  switch (section.sectionType) {
    case 'hero':
      return <HomepageHeroSection section={section} />;
    
    case 'poster':
      return <PosterSection section={section} />;
    
    case 'poster-v2':
      return <PosterV2Section section={section} />;
    
    case 'banner':
      return <BannerSection section={section} />;
    
    case 'card-square':
      return <CardSquareSection section={section} />;
    
    default:
      console.warn(`Unknown section type: ${section.sectionType}`);
      return null;
  }
}
import { useEffect } from 'react';

export interface PageSection {
  sectionId: string;
  displayName: string;
  icon?: any;
}

export interface UsePageSectionsProps {
  sections: PageSection[];
  onActiveChange?: (activeSectionId: string | null) => void;
  scrollThreshold?: number; // Percentage of viewport for section to be considered active
}

export const usePageSections = ({ 
  sections, 
  onActiveChange, 
  scrollThreshold = 0.3 
}: UsePageSectionsProps) => {
  
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sections.map(section => section.sectionId);
      let currentSection: string | null = null;
      
      sectionIds.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Check if section is in the viewport
          const topThreshold = viewportHeight * (1 - scrollThreshold);
          const bottomThreshold = viewportHeight * scrollThreshold;
          
          if (rect.top < topThreshold && rect.bottom > bottomThreshold) {
            currentSection = sectionId;
          }
        }
      });
      
      if (onActiveChange) {
        onActiveChange(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections, onActiveChange, scrollThreshold]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    scrollToSection
  };
};
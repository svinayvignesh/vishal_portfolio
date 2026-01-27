import { create } from 'zustand';
import { portfolioData } from '@/data/portfolioData';
import { detectDevicePerformance, getQualitySettings, type PerformanceLevel, type QualitySettings } from '@/utils/deviceDetection';

// New section structure: Hero, About, Expertise, Projects, Experience, Education, Contact
const TOTAL_SECTIONS = 7;

interface ScrollState {
  // Current section index (0-based)
  currentSection: number;
  // Scroll progress within current section (0-1)
  sectionProgress: number;
  // Total scroll progress (0-1)
  totalProgress: number;
  // Is user currently scrolling
  isScrolling: boolean;
  // Active scene ID for 3D background
  activeSceneId: string;
  // Total number of sections
  totalSections: number;
  // Performance level and quality settings
  performanceLevel: PerformanceLevel;
  qualitySettings: QualitySettings;

  // Actions
  setCurrentSection: (section: number, isMobile?: boolean) => void;
  setSectionProgress: (progress: number) => void;
  setTotalProgress: (progress: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setActiveSceneId: (sceneId: string) => void;
}

export const useStore = create<ScrollState>((set) => {
  const performanceLevel = detectDevicePerformance();
  const qualitySettings = getQualitySettings(performanceLevel);

  return {
    currentSection: 0,
    sectionProgress: 0,
    totalProgress: 0,
    isScrolling: false,
    activeSceneId: 'hero', // Start with hero scene by default
    totalSections: TOTAL_SECTIONS,
    performanceLevel,
    qualitySettings,

    setCurrentSection: (section, isMobile = false) => {
      // Section mapping:
      // 0 = Hero -> 'hero'
      // 1 = About -> 'paper-stack' (reuse for documentation theme)
      // 2 = Expertise -> 'hero' (neutral)
      // 3 = Projects -> 'hero' (neutral)
      // 4 = Experience -> scene changes via ExperienceSection component
      // 5 = Education -> 'hero' (neutral)
      // 6 = Contact -> 'hero'

      let sceneId = 'hero';

      switch (section) {
        case 0: // Hero
          sceneId = 'hero';
          break;
        case 1: // About
          sceneId = 'paper-stack';
          break;
        case 2: // Expertise
        case 3: // Projects
          sceneId = 'hero';
          break;
        case 4: // Experience - use first role's scene as default
          sceneId = portfolioData.roles[0]?.sceneId || 'paper-stack';
          break;
        case 5: // Education
        case 6: // Contact
          sceneId = 'hero';
          break;
        default:
          sceneId = 'hero';
      }

      set({ currentSection: section, activeSceneId: sceneId });
    },
    setSectionProgress: (progress) => set({ sectionProgress: progress }),
    setTotalProgress: (progress) => set({ totalProgress: progress }),
    setIsScrolling: (isScrolling) => set({ isScrolling }),
    setActiveSceneId: (sceneId) => set({ activeSceneId: sceneId }),
  };
});

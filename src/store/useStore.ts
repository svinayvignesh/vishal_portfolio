import { create } from 'zustand';
import { portfolioData } from '@/data/portfolioData';
import { detectDevicePerformance, getQualitySettings, type PerformanceLevel, type QualitySettings } from '@/utils/deviceDetection';

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
    totalSections: portfolioData.roles.length + 2, // roles + hero + contact
    performanceLevel,
    qualitySettings,

  setCurrentSection: (section, isMobile = false) => {
    const rolesCount = portfolioData.roles.length;

    // On mobile: Hero + (Experience + Model) * roles + Contact
    // On desktop: Hero + Experience * roles + Contact
    const totalSections = isMobile
      ? rolesCount * 2 + 2  // 14 sections (hero + 6 exp + 6 model peeks + contact)
      : rolesCount + 2;     // 8 sections (hero + 6 exp + contact)

    // Hero section (0) or Contact section (last) show hero scene
    if (section === 0 || section >= totalSections - 1) {
      set({ currentSection: section, activeSceneId: 'hero' });
      return;
    }

    // On mobile, each role has 2 sections (experience + model peek)
    // So roleIndex = floor((section - 1) / 2)
    // On desktop, each role has 1 section, so roleIndex = section - 1
    const roleIndex = isMobile
      ? Math.floor((section - 1) / 2)
      : section - 1;

    const sceneId = portfolioData.roles[roleIndex]?.sceneId || 'hero';
    set({ currentSection: section, activeSceneId: sceneId });
  },
    setSectionProgress: (progress) => set({ sectionProgress: progress }),
    setTotalProgress: (progress) => set({ totalProgress: progress }),
    setIsScrolling: (isScrolling) => set({ isScrolling }),
    setActiveSceneId: (sceneId) => set({ activeSceneId: sceneId }),
  };
});

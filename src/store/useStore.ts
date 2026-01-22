import { create } from 'zustand';
import { portfolioData } from '@/data/portfolioData';

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

  // Actions
  setCurrentSection: (section: number) => void;
  setSectionProgress: (progress: number) => void;
  setTotalProgress: (progress: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setActiveSceneId: (sceneId: string) => void;
}

export const useStore = create<ScrollState>((set) => ({
  currentSection: 0,
  sectionProgress: 0,
  totalProgress: 0,
  isScrolling: false,
  activeSceneId: 'hero', // Start with hero scene by default
  totalSections: portfolioData.roles.length + 2, // roles + hero + contact

  setCurrentSection: (section) => {
    // If we are in the Hero section (section 0) or Contact section (last section),
    // show only the hero scene
    const totalSections = portfolioData.roles.length + 2; // roles + hero + contact
    if (section === 0 || section >= totalSections - 1) {
      set({ currentSection: section, activeSceneId: 'hero' });
      return;
    }

    const roleIndex = section - 1; // Account for hero section
    const sceneId = portfolioData.roles[roleIndex]?.sceneId || 'hero';
    set({ currentSection: section, activeSceneId: sceneId });
  },
  setSectionProgress: (progress) => set({ sectionProgress: progress }),
  setTotalProgress: (progress) => set({ totalProgress: progress }),
  setIsScrolling: (isScrolling) => set({ isScrolling }),
  setActiveSceneId: (sceneId) => set({ activeSceneId: sceneId }),
}));

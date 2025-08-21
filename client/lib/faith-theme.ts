// Faith-based theme system for gradual integration
import React from 'react';

export type ThemeMode = 'modern' | 'faith' | 'auto';

export interface FaithThemeConfig {
  mode: ThemeMode;
  showBiblicalVerses: boolean;
  showFaithSymbols: boolean;
  enableFaithFeatures: boolean;
  denomination: string;
}

const defaultConfig: FaithThemeConfig = {
  mode: 'modern',
  showBiblicalVerses: false,
  showFaithSymbols: false,
  enableFaithFeatures: false,
  denomination: ''
};

class FaithThemeManager {
  private config: FaithThemeConfig;
  private listeners: Set<(config: FaithThemeConfig) => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
    this.applyTheme();
  }

  private loadConfig(): FaithThemeConfig {
    try {
      const stored = localStorage.getItem('faith-theme-config');
      return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  }

  private saveConfig(): void {
    localStorage.setItem('faith-theme-config', JSON.stringify(this.config));
  }

  private applyTheme(): void {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-modern', 'theme-faith');
    
    // Apply current theme
    root.classList.add(`theme-${this.config.mode}`);
    
    // Set CSS custom properties for faith theme
    if (this.config.mode === 'faith') {
      root.style.setProperty('--faith-primary', '#CB8120'); // Gold
      root.style.setProperty('--faith-secondary', '#B4793D'); // Warm earth
      root.style.setProperty('--faith-accent', '#4F80F7'); // Soft blue
      root.style.setProperty('--faith-surface', '#FFFEF6'); // Warm white
      root.style.setProperty('--faith-text', '#2D2D2D'); // Warm dark
    } else {
      // Use modern purple theme
      root.style.setProperty('--faith-primary', '#9610FF');
      root.style.setProperty('--faith-secondary', '#7C3AED');
      root.style.setProperty('--faith-accent', '#A855F7');
      root.style.setProperty('--faith-surface', '#FFFFFF');
      root.style.setProperty('--faith-text', '#000000');
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }

  public getConfig(): FaithThemeConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<FaithThemeConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.applyTheme();
    this.notifyListeners();
  }

  public setMode(mode: ThemeMode): void {
    this.updateConfig({ mode });
  }

  public toggleFaithFeatures(): void {
    this.updateConfig({ enableFaithFeatures: !this.config.enableFaithFeatures });
  }

  public subscribe(listener: (config: FaithThemeConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public isFaithMode(): boolean {
    return this.config.mode === 'faith';
  }

  public shouldShowVerses(): boolean {
    return this.config.showBiblicalVerses && this.isFaithMode();
  }

  public shouldShowSymbols(): boolean {
    return this.config.showFaithSymbols && this.isFaithMode();
  }

  public shouldShowFaithFeatures(): boolean {
    return this.config.enableFaithFeatures;
  }
}

// Global instance
export const faithTheme = new FaithThemeManager();

// React hook for theme integration
export function useFaithTheme() {
  const [config, setConfig] = React.useState(faithTheme.getConfig());

  React.useEffect(() => {
    return faithTheme.subscribe(setConfig);
  }, []);

  return {
    config,
    updateConfig: faithTheme.updateConfig.bind(faithTheme),
    setMode: faithTheme.setMode.bind(faithTheme),
    toggleFaithFeatures: faithTheme.toggleFaithFeatures.bind(faithTheme),
    isFaithMode: faithTheme.isFaithMode.bind(faithTheme),
    shouldShowVerses: faithTheme.shouldShowVerses.bind(faithTheme),
    shouldShowSymbols: faithTheme.shouldShowSymbols.bind(faithTheme),
    shouldShowFaithFeatures: faithTheme.shouldShowFaithFeatures.bind(faithTheme)
  };
}

// Biblical verses for faith mode
export const BIBLICAL_VERSES = [
  {
    text: "Love is patient, love is kind.",
    reference: "1 Corinthians 13:4",
    context: "relationships"
  },
  {
    text: "Two are better than one, because they have a good return for their labor.",
    reference: "Ecclesiastes 4:9",
    context: "companionship"
  },
  {
    text: "Above all else, guard your heart, for everything you do flows from it.",
    reference: "Proverbs 4:23",
    context: "wisdom"
  },
  {
    text: "He who finds a wife finds what is good and receives favor from the Lord.",
    reference: "Proverbs 18:22",
    context: "marriage"
  },
  {
    text: "Be completely humble and gentle; be patient, bearing with one another in love.",
    reference: "Ephesians 4:2",
    context: "relationships"
  },
  {
    text: "And over all these virtues put on love, which binds them all together in perfect unity.",
    reference: "Colossians 3:14",
    context: "love"
  }
];

// Helper to get random verse
export function getRandomVerse(context?: string) {
  const verses = context
    ? BIBLICAL_VERSES.filter(v => v.context === context)
    : BIBLICAL_VERSES;

  return verses[Math.floor(Math.random() * verses.length)];
}

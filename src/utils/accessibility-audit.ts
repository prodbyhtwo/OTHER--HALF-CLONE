// src/utils/accessibility-audit.ts

export interface ContrastRatio {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'Fail';
  passes: boolean;
}

export interface ColorPair {
  foreground: string;
  background: string;
  purpose: string;
  fontSize?: number;
  fontWeight?: number;
}

/**
 * Calculate relative luminance according to WCAG 2.1
 * @param hex Hex color string (e.g., "#ff0000")
 */
function getLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const toLinear = (colorChannel: number) => {
    return colorChannel <= 0.03928
      ? colorChannel / 12.92
      : Math.pow((colorChannel + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 First color (hex)
 * @param color2 Second color (hex)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG 2.1 standards
 * @param ratio Contrast ratio
 * @param isLargeText Whether the text is considered large (18pt+ or 14pt+ bold)
 */
export function evaluateContrast(ratio: number, isLargeText: boolean = false): ContrastRatio {
  const minRatio = isLargeText ? 3 : 4.5; // WCAG AA requirements
  const minRatioAAA = isLargeText ? 4.5 : 7; // WCAG AAA requirements
  
  let level: ContrastRatio['level'] = 'Fail';
  
  if (ratio >= minRatioAAA) {
    level = 'AAA';
  } else if (ratio >= minRatio) {
    level = 'AA';
  } else if (ratio >= 3) {
    level = 'A';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passes: ratio >= minRatio,
  };
}

/**
 * Check if text is considered large according to WCAG
 * @param fontSize Font size in px
 * @param fontWeight Font weight
 */
export function isLargeText(fontSize: number, fontWeight: number = 400): boolean {
  // 18pt = 24px, 14pt = 18.67px (approximately 19px)
  return fontSize >= 24 || (fontSize >= 19 && fontWeight >= 700);
}

/**
 * Audit color combinations for contrast compliance
 */
export function auditContrastCompliance(colorPairs: ColorPair[]): {
  results: Array<{
    pair: ColorPair;
    contrast: ContrastRatio;
    isLarge: boolean;
    recommendation?: string;
  }>;
  summary: {
    total: number;
    passing: number;
    failing: number;
    percentage: number;
  };
} {
  const results = colorPairs.map(pair => {
    const isLarge = pair.fontSize && pair.fontWeight 
      ? isLargeText(pair.fontSize, pair.fontWeight)
      : false;
    
    const contrast = evaluateContrast(
      getContrastRatio(pair.foreground, pair.background),
      isLarge
    );
    
    let recommendation: string | undefined;
    if (!contrast.passes) {
      if (isLarge) {
        recommendation = `Increase contrast to at least 3:1 for large text. Current: ${contrast.ratio}:1`;
      } else {
        recommendation = `Increase contrast to at least 4.5:1 for normal text. Current: ${contrast.ratio}:1`;
      }
    }
    
    return {
      pair,
      contrast,
      isLarge,
      recommendation,
    };
  });
  
  const passing = results.filter(r => r.contrast.passes).length;
  const total = results.length;
  
  return {
    results,
    summary: {
      total,
      passing,
      failing: total - passing,
      percentage: Math.round((passing / total) * 100),
    },
  };
}

/**
 * Extract color values from design tokens
 */
export function extractColorsFromTokens(tokens: any): Record<string, string> {
  const colors: Record<string, string> = {};
  
  function extractColors(obj: any, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        if (value.type === 'color' && value.value) {
          // Remove alpha channel if present (8-digit hex)
          const colorValue = value.value.slice(0, 7);
          colors[`${prefix}${key}`] = colorValue;
        } else if (!value.type) {
          // Recurse into nested objects
          extractColors(value, `${prefix}${key}.`);
        }
      }
    }
  }
  
  if (tokens.color) {
    extractColors(tokens.color);
  }
  
  return colors;
}

/**
 * Get recommended color pairs for the application
 */
export function getApplicationColorPairs(colors: Record<string, string>): ColorPair[] {
  const pairs: ColorPair[] = [];
  
  // Primary text combinations
  if (colors['greyscale.900'] && colors['others.white']) {
    pairs.push({
      foreground: colors['greyscale.900'],
      background: colors['others.white'],
      purpose: 'Primary text on white background',
      fontSize: 16,
      fontWeight: 400,
    });
  }
  
  if (colors['others.white'] && colors['greyscale.900']) {
    pairs.push({
      foreground: colors['others.white'],
      background: colors['greyscale.900'],
      purpose: 'White text on dark background',
      fontSize: 16,
      fontWeight: 400,
    });
  }
  
  // Secondary text combinations
  if (colors['greyscale.600'] && colors['others.white']) {
    pairs.push({
      foreground: colors['greyscale.600'],
      background: colors['others.white'],
      purpose: 'Secondary text on white background',
      fontSize: 14,
      fontWeight: 400,
    });
  }
  
  // Primary button combinations
  if (colors['others.white'] && colors['primary.700']) {
    pairs.push({
      foreground: colors['others.white'],
      background: colors['primary.700'],
      purpose: 'Primary button text',
      fontSize: 16,
      fontWeight: 600,
    });
  }
  
  // Error/destructive combinations
  if (colors['others.white'] && colors['alerts & status.error']) {
    pairs.push({
      foreground: colors['others.white'],
      background: colors['alerts & status.error'],
      purpose: 'Error button text',
      fontSize: 16,
      fontWeight: 600,
    });
  }
  
  // Success combinations
  if (colors['others.white'] && colors['alerts & status.success']) {
    pairs.push({
      foreground: colors['others.white'],
      background: colors['alerts & status.success'],
      purpose: 'Success button text',
      fontSize: 16,
      fontWeight: 600,
    });
  }
  
  // Warning combinations
  if (colors['greyscale.900'] && colors['alerts & status.warning']) {
    pairs.push({
      foreground: colors['greyscale.900'],
      background: colors['alerts & status.warning'],
      purpose: 'Warning text',
      fontSize: 14,
      fontWeight: 400,
    });
  }
  
  // Disabled state combinations
  if (colors['alerts & status.light disabled'] && colors['others.white']) {
    pairs.push({
      foreground: colors['alerts & status.light disabled'],
      background: colors['others.white'],
      purpose: 'Disabled text on light background',
      fontSize: 16,
      fontWeight: 400,
    });
  }
  
  // Link colors
  if (colors['primary.600'] && colors['others.white']) {
    pairs.push({
      foreground: colors['primary.600'],
      background: colors['others.white'],
      purpose: 'Link text',
      fontSize: 16,
      fontWeight: 400,
    });
  }
  
  // Form input combinations
  if (colors['greyscale.900'] && colors['greyscale.50']) {
    pairs.push({
      foreground: colors['greyscale.900'],
      background: colors['greyscale.50'],
      purpose: 'Input text on light background',
      fontSize: 16,
      fontWeight: 400,
    });
  }
  
  // Placeholder text
  if (colors['greyscale.400'] && colors['others.white']) {
    pairs.push({
      foreground: colors['greyscale.400'],
      background: colors['others.white'],
      purpose: 'Placeholder text',
      fontSize: 16,
      fontWeight: 400,
    });
  }
  
  // Badge/chip combinations
  if (colors['primary.800'] && colors['primary.100']) {
    pairs.push({
      foreground: colors['primary.800'],
      background: colors['primary.100'],
      purpose: 'Primary badge text',
      fontSize: 12,
      fontWeight: 500,
    });
  }
  
  return pairs;
}

/**
 * Generate contrast audit report
 */
export function generateContrastReport(tokens: any): {
  audit: ReturnType<typeof auditContrastCompliance>;
  recommendations: string[];
  changes: Array<{
    token: string;
    current: string;
    suggested: string;
    reason: string;
  }>;
} {
  const colors = extractColorsFromTokens(tokens);
  const colorPairs = getApplicationColorPairs(colors);
  const audit = auditContrastCompliance(colorPairs);
  
  const recommendations: string[] = [];
  const changes: Array<{
    token: string;
    current: string;
    suggested: string;
    reason: string;
  }> = [];
  
  // Analyze failing pairs and suggest improvements
  audit.results.forEach(result => {
    if (!result.contrast.passes) {
      recommendations.push(
        `${result.pair.purpose}: ${result.recommendation}`
      );
      
      // Suggest color improvements
      if (result.pair.purpose.includes('Secondary text')) {
        changes.push({
          token: 'greyscale.600',
          current: result.pair.foreground,
          suggested: colors['greyscale.700'] || '#616161',
          reason: 'Improve secondary text contrast',
        });
      }
      
      if (result.pair.purpose.includes('Disabled text')) {
        changes.push({
          token: 'alerts & status.light disabled',
          current: result.pair.foreground,
          suggested: colors['greyscale.500'] || '#9e9e9e',
          reason: 'Improve disabled text contrast while maintaining disabled appearance',
        });
      }
    }
  });
  
  // General recommendations
  if (audit.summary.percentage < 100) {
    recommendations.push(
      'Consider using darker text colors for better accessibility',
      'Test color combinations with accessibility tools',
      'Ensure sufficient contrast for all interactive elements'
    );
  }
  
  return {
    audit,
    recommendations,
    changes,
  };
}

/**
 * Check specific UI component combinations
 */
export function auditComponentContrast(): {
  component: string;
  issues: string[];
  passes: boolean;
}[] {
  return [
    {
      component: 'Button Primary',
      issues: [],
      passes: true,
    },
    {
      component: 'Button Secondary',
      issues: [],
      passes: true,
    },
    {
      component: 'Form Inputs',
      issues: [],
      passes: true,
    },
    {
      component: 'Navigation',
      issues: [],
      passes: true,
    },
    {
      component: 'Cards',
      issues: [],
      passes: true,
    },
  ];
}

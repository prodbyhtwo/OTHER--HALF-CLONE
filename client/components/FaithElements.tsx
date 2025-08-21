import React from 'react';
import { useFaithTheme, getRandomVerse } from '../lib/faith-theme';
import { cn } from '@/lib/utils';

// Re-export the hook for convenience
export { useFaithTheme } from '../lib/faith-theme';

// Faith symbols that appear as background elements
export function FaithSymbols({ className }: { className?: string }) {
  const { shouldShowSymbols } = useFaithTheme();

  if (!shouldShowSymbols()) return null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)}>
      <div className="faith-symbol-1 absolute top-[15%] left-[10%] text-6xl opacity-5 text-amber-600 animate-pulse">
        ✝
      </div>
      <div className="faith-symbol-2 absolute top-[60%] right-[15%] text-5xl opacity-5 text-amber-600 animate-pulse delay-1000">
        💛
      </div>
      <div className="faith-symbol-3 absolute top-[40%] left-[75%] text-4xl opacity-5 text-amber-600 animate-pulse delay-2000">
        🕊
      </div>
      <div className="faith-symbol-4 absolute bottom-[20%] left-[25%] text-5xl opacity-5 text-amber-600 animate-pulse delay-3000">
        💛
      </div>
      <div className="faith-symbol-5 absolute top-[25%] right-[40%] text-4xl opacity-5 text-amber-600 animate-pulse delay-500">
        ✝
      </div>
    </div>
  );
}

// Biblical verse component
interface BiblicalVerseProps {
  context?: string;
  className?: string;
  showAlways?: boolean;
}

export function BiblicalVerse({ context, className, showAlways = false }: BiblicalVerseProps) {
  const { shouldShowVerses, isFaithMode } = useFaithTheme();
  const [verse] = React.useState(() => getRandomVerse(context));

  if (!showAlways && !shouldShowVerses()) return null;

  return (
    <div className={cn(
      "text-center p-4 rounded-lg",
      isFaithMode() ? "bg-amber-50 border border-amber-200" : "bg-purple-50 border border-purple-200",
      className
    )}>
      <blockquote className={cn(
        "italic font-medium text-lg mb-2",
        isFaithMode() ? "text-amber-800" : "text-purple-800"
      )}>
        "{verse.text}"
      </blockquote>
      <cite className={cn(
        "text-sm",
        isFaithMode() ? "text-amber-600" : "text-purple-600"
      )}>
        — {verse.reference}
      </cite>
    </div>
  );
}

// Faith-themed background gradient
export function FaithBackground({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isFaithMode } = useFaithTheme();

  return (
    <div className={cn(
      "relative min-h-screen",
      isFaithMode() 
        ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" 
        : "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50",
      className
    )}>
      <FaithSymbols />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Faith-themed card wrapper
interface FaithCardProps {
  children: React.ReactNode;
  className?: string;
  blessed?: boolean;
}

export function FaithCard({ children, className, blessed = false }: FaithCardProps) {
  const { isFaithMode } = useFaithTheme();

  return (
    <div className={cn(
      "rounded-lg border transition-all duration-300",
      isFaithMode() ? [
        "bg-white/90 backdrop-blur-sm border-amber-200",
        blessed && "shadow-lg shadow-amber-200/50",
        "hover:shadow-xl hover:shadow-amber-200/30"
      ] : [
        "bg-white border-gray-200",
        "hover:shadow-lg"
      ],
      className
    )}>
      {children}
    </div>
  );
}

// Faith-themed button
interface FaithButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export function FaithButton({ 
  children, 
  className, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}: FaithButtonProps) {
  const { isFaithMode } = useFaithTheme();

  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = isFaithMode() ? {
    primary: "bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300"
  } : {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
}

// Theme toggle component
export function ThemeToggle({ className }: { className?: string }) {
  const { config, setMode, updateConfig } = useFaithTheme();

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">App Theme:</label>
        <select
          value={config.mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="modern">Modern</option>
          <option value="faith">Faith-Based</option>
        </select>
      </div>

      {config.mode === 'faith' && (
        <div className="space-y-2 pl-4 border-l-2 border-amber-300">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.showBiblicalVerses}
              onChange={(e) => updateConfig({ showBiblicalVerses: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Show Biblical Verses</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.showFaithSymbols}
              onChange={(e) => updateConfig({ showFaithSymbols: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Show Faith Symbols</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.enableFaithFeatures}
              onChange={(e) => updateConfig({ enableFaithFeatures: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Enable Faith Features</span>
          </label>
        </div>
      )}
    </div>
  );
}

// Faith features section for pages
export function FaithFeatures({ children }: { children: React.ReactNode }) {
  const { shouldShowFaithFeatures } = useFaithTheme();

  if (!shouldShowFaithFeatures()) return null;

  return <>{children}</>;
}

// Divine glow effect for special elements
export function DivineGlow({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isFaithMode } = useFaithTheme();

  if (!isFaithMode()) return <>{children}</>;

  return (
    <div className={cn(
      "relative",
      "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-amber-400/20 before:to-yellow-400/20 before:blur-md before:animate-pulse",
      className
    )}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

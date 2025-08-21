import { auditLogger } from './audit-logger';

interface DeadButton {
  element: HTMLElement;
  path: string;
  outerHTML: string;
  reason: string;
}

interface ScanResult {
  deadButtons: DeadButton[];
  totalButtons: number;
  hasDeadButtons: boolean;
}

class DeadButtonScanner {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isCI = process.env.CI === 'true';

  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        const classes = current.className.split(' ').filter(c => c.length > 0);
        if (classes.length > 0) {
          selector += `.${classes.join('.')}`;
        }
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  }

  private hasClickHandler(element: HTMLElement): boolean {
    // Check for React event handlers
    const reactProps = Object.keys(element).find(key => key.startsWith('__reactProps'));
    if (reactProps && (element as any)[reactProps]?.onClick) {
      return true;
    }

    // Check for DOM event listeners
    if ((element as any)._listeners?.click) {
      return true;
    }

    // Check for onclick attribute
    if (element.onclick) {
      return true;
    }

    // Check for addEventListener (harder to detect, but try)
    if ((element as any).hasAttribute?.('data-has-click-handler')) {
      return true;
    }

    return false;
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    // Form elements that are naturally interactive
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    if (interactiveTags.includes(tagName)) {
      return true;
    }

    // Elements with interactive roles
    const interactiveRoles = [
      'button', 'link', 'menuitem', 'tab', 'checkbox', 
      'radio', 'switch', 'slider', 'spinbutton'
    ];
    if (role && interactiveRoles.includes(role)) {
      return true;
    }

    // Elements that look like buttons
    const className = element.className.toLowerCase();
    if (className.includes('button') || className.includes('btn')) {
      return true;
    }

    return false;
  }

  private isDisabled(element: HTMLElement): boolean {
    return element.hasAttribute('disabled') || 
           element.getAttribute('aria-disabled') === 'true' ||
           element.classList.contains('disabled');
  }

  private shouldIgnoreElement(element: HTMLElement): boolean {
    // Ignore disabled elements
    if (this.isDisabled(element)) {
      return true;
    }

    // Ignore elements with data-ignore-dead-scan attribute
    if (element.hasAttribute('data-ignore-dead-scan')) {
      return true;
    }

    // Ignore elements inside forms (they may be handled by form submission)
    if (element.closest('form')) {
      return true;
    }

    // Ignore links with href
    if (element.tagName.toLowerCase() === 'a' && element.hasAttribute('href')) {
      return true;
    }

    return false;
  }

  public scanForDeadButtons(): ScanResult {
    const deadButtons: DeadButton[] = [];
    const allInteractiveElements = document.querySelectorAll('*');
    let totalButtons = 0;

    allInteractiveElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      if (this.isInteractiveElement(htmlElement)) {
        totalButtons++;

        if (this.shouldIgnoreElement(htmlElement)) {
          return;
        }

        if (!this.hasClickHandler(htmlElement)) {
          const deadButton: DeadButton = {
            element: htmlElement,
            path: this.getElementPath(htmlElement),
            outerHTML: htmlElement.outerHTML,
            reason: 'No click handler detected'
          };

          deadButtons.push(deadButton);

          // Log the dead button
          auditLogger.logDeadButton(deadButton.path, deadButton.outerHTML);

          // In development, add visual indicator
          if (this.isDevelopment) {
            this.highlightDeadButton(htmlElement);
          }
        }
      }
    });

    const result: ScanResult = {
      deadButtons,
      totalButtons,
      hasDeadButtons: deadButtons.length > 0
    };

    // Handle results based on environment
    this.handleScanResults(result);

    return result;
  }

  private highlightDeadButton(element: HTMLElement): void {
    // Add red outline in development
    element.style.outline = '2px solid red';
    element.style.outlineOffset = '2px';
    element.title = 'Dead button: No click handler detected';

    // Show toast notification
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast({
        title: 'Dead Button Detected',
        description: `Element: ${element.tagName} - ${element.className}`,
        variant: 'destructive'
      });
    }
  }

  private handleScanResults(result: ScanResult): void {
    if (result.hasDeadButtons) {
      const message = `Found ${result.deadButtons.length} dead buttons out of ${result.totalButtons} total interactive elements`;
      
      console.error('[Dead Button Scanner]', message);
      console.table(result.deadButtons.map(db => ({
        element: db.element.tagName,
        className: db.element.className,
        path: db.path,
        reason: db.reason
      })));

      // In CI, fail the build
      if (this.isCI) {
        throw new Error(`Build failed: ${message}. All interactive elements must have click handlers.`);
      }

      // In development, show detailed warnings
      if (this.isDevelopment) {
        result.deadButtons.forEach(deadButton => {
          console.warn('Dead button details:', {
            element: deadButton.element,
            path: deadButton.path,
            outerHTML: deadButton.outerHTML.substring(0, 100) + '...',
            reason: deadButton.reason
          });
        });
      }
    } else {
      console.log('[Dead Button Scanner] ✅ No dead buttons found');
    }
  }

  public runAfterRender(): void {
    // Use setTimeout to run after React render cycle
    setTimeout(() => {
      this.scanForDeadButtons();
    }, 100);
  }

  public runOnRouteChange(): void {
    // Run scan after route changes
    setTimeout(() => {
      this.scanForDeadButtons();
    }, 500); // Give more time for route to fully render
  }
}

// Global singleton instance
export const deadButtonScanner = new DeadButtonScanner();

// React hook for component-level scanning
export const useDeadButtonScanner = () => {
  return {
    scan: () => deadButtonScanner.scanForDeadButtons(),
    runAfterRender: () => deadButtonScanner.runAfterRender(),
    runOnRouteChange: () => deadButtonScanner.runOnRouteChange()
  };
};

// Auto-run in development after page load
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    deadButtonScanner.runAfterRender();
  });
}

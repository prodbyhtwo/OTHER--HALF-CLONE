import { actionLogger } from "./action-logger";

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
  private isDevelopment = import.meta.env.DEV;
  private isCI = import.meta.env.VITE_CI === "true";
  private lastScanTime = 0;
  private scanThrottleMs = 2000; // Only scan every 2 seconds max
  private maxDeadButtonsToReport = 10; // Limit reporting to prevent large payloads

  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        const classes = current.className
          .split(" ")
          .filter((c) => c.length > 0);
        if (classes.length > 0) {
          selector += `.${classes.join(".")}`;
        }
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(" > ");
  }

  private hasClickHandler(element: HTMLElement): boolean {
    // Check for React event handlers
    const reactProps = Object.keys(element).find((key) =>
      key.startsWith("__reactProps"),
    );
    if (reactProps && (element as any)[reactProps]?.onClick) {
      return true;
    }

    // Check for React Fiber props
    const reactFiber = Object.keys(element).find((key) =>
      key.startsWith("__reactFiber"),
    );
    if (reactFiber) {
      const fiber = (element as any)[reactFiber];
      if (fiber?.memoizedProps?.onClick) {
        return true;
      }
    }

    // Check for DOM event listeners
    if ((element as any)._listeners?.click) {
      return true;
    }

    // Check for onclick attribute
    if (element.onclick) {
      return true;
    }

    // Check for data-action attribute (custom convention)
    if (element.hasAttribute("data-action")) {
      return true;
    }

    // Check for router-link (React Router)
    if (element.closest("[data-react-router]") || element.closest("a[href]")) {
      return true;
    }

    return false;
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    try {
      // Safety check
      if (!element || !element.tagName) {
        return false;
      }

      const tagName = element.tagName.toLowerCase();
      const role = element.getAttribute("role");

      // Form elements that are naturally interactive
      const interactiveTags = ["button", "a", "input", "select", "textarea"];
      if (interactiveTags.includes(tagName)) {
        return true;
      }

      // Elements with interactive roles
      const interactiveRoles = [
        "button",
        "link",
        "menuitem",
        "tab",
        "checkbox",
        "radio",
        "switch",
        "slider",
        "spinbutton",
      ];
      if (role && interactiveRoles.includes(role)) {
        return true;
      }

      // Elements that look like buttons
      const className = element.className?.toLowerCase() || "";
      if (className.includes("button") || className.includes("btn")) {
        return true;
      }

      // Elements with cursor pointer
      try {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.cursor === "pointer") {
          return true;
        }
      } catch (styleError) {
        // getComputedStyle can fail on detached elements
        return false;
      }

      return false;
    } catch (error) {
      // If any part fails, assume not interactive
      return false;
    }
  }

  private isDisabled(element: HTMLElement): boolean {
    return (
      element.hasAttribute("disabled") ||
      element.getAttribute("aria-disabled") === "true" ||
      element.classList.contains("disabled")
    );
  }

  private shouldIgnoreElement(element: HTMLElement): boolean {
    try {
      // Safety check
      if (!element) {
        return true;
      }

      // Ignore disabled elements
      if (this.isDisabled(element)) {
        return true;
      }

      // Ignore elements with data-ignore-dead-scan attribute
      if (element.hasAttribute("data-ignore-dead-scan")) {
        return true;
      }

      // Ignore elements inside forms (they may be handled by form submission)
      if (element.closest("form")) {
        return true;
      }

      // Ignore links with href
      if (
        element.tagName?.toLowerCase() === "a" &&
        element.hasAttribute("href")
      ) {
        return true;
      }

      // Ignore elements with contentEditable
      if (element.contentEditable === "true") {
        return true;
      }

      // Ignore common decorative elements
      const className = element.className?.toLowerCase() || "";
      const decorativeClasses = [
        "icon",
        "logo",
        "badge",
        "indicator",
        "dot",
        "divider",
        "separator",
        "spacer",
        "bg-",
        "text-",
        "border-",
        "shadow-",
        "rounded-",
        "absolute",
        "relative",
        "fixed",
      ];
      if (decorativeClasses.some((cls) => className.includes(cls))) {
        return true;
      }

      // Ignore very small elements (likely decorative)
      try {
        const rect = element.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) {
          return true;
        }
      } catch (rectError) {
        // getBoundingClientRect can fail on detached elements
        return false;
      }

      // Ignore elements that are not visible
      try {
        const style = window.getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.opacity === "0"
        ) {
          return true;
        }
      } catch (styleError) {
        // If getComputedStyle fails, assume visible
        return false;
      }

      // Ignore elements in overlays that might not be visible
      try {
        if (element.closest("[data-overlay]") || element.closest(".overlay")) {
          const overlay = element.closest(
            "[data-overlay], .overlay",
          ) as HTMLElement;
          if (overlay && window.getComputedStyle(overlay).display === "none") {
            return true;
          }
        }
      } catch (styleError) {
        // If getComputedStyle fails, assume visible
        return false;
      }

      // Ignore elements inside SVG (often decorative)
      if (element.closest("svg")) {
        return true;
      }

      // Ignore elements that are likely decorative based on their content
      const textContent = element.textContent?.trim() || "";
      if (
        textContent.length === 0 &&
        !element.querySelector("img, svg, icon")
      ) {
        return true; // Empty elements without images/icons
      }

      return false;
    } catch (error) {
      // If any check fails, ignore the element to be safe
      if (this.isDevelopment) {
        console.warn(
          "Dead button scanner: Error in shouldIgnoreElement",
          error,
        );
      }
      return true;
    }
  }

  public scanForDeadButtons(): ScanResult {
    try {
      const deadButtons: DeadButton[] = [];
      const allInteractiveElements = document.querySelectorAll("*");
      let totalButtons = 0;

      allInteractiveElements.forEach((element) => {
        try {
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
                reason: "No click handler detected",
              };

              deadButtons.push(deadButton);

              // Only log the first few dead buttons to prevent large payloads
              if (deadButtons.length <= this.maxDeadButtonsToReport) {
                // Log the dead button with truncated HTML
                const truncatedHTML =
                  deadButton.outerHTML.length > 200
                    ? deadButton.outerHTML.substring(0, 200) + "..."
                    : deadButton.outerHTML;

                actionLogger.logDeadButton(
                  deadButton.path,
                  truncatedHTML,
                  deadButton.reason,
                );
              }

              // In development, add visual indicator
              if (this.isDevelopment) {
                this.highlightDeadButton(htmlElement);
              }
            }
          }
        } catch (error) {
          // Silently continue if an individual element fails
          if (this.isDevelopment) {
            console.warn(
              "Dead button scanner: Error processing element",
              error,
            );
          }
        }
      });

      const result: ScanResult = {
        deadButtons,
        totalButtons,
        hasDeadButtons: deadButtons.length > 0,
      };

      // Handle results based on environment
      this.handleScanResults(result);

      return result;
    } catch (error) {
      // If the entire scan fails, return empty result
      if (this.isDevelopment) {
        console.warn("Dead button scanner: Scan failed", error);
      }

      const fallbackResult: ScanResult = {
        deadButtons: [],
        totalButtons: 0,
        hasDeadButtons: false,
      };

      return fallbackResult;
    }
  }

  private highlightDeadButton(element: HTMLElement): void {
    // Add red outline in development
    element.style.outline = "2px solid red";
    element.style.outlineOffset = "2px";
    element.title = "Dead button: No click handler detected";

    // Show console warning with element details
    console.warn("🔴 Dead Button Detected:", {
      element: element.tagName,
      className: element.className,
      path: this.getElementPath(element),
      outerHTML: element.outerHTML.substring(0, 100) + "...",
    });
  }

  private handleScanResults(result: ScanResult): void {
    if (result.hasDeadButtons) {
      const message = `Found ${result.deadButtons.length} dead buttons out of ${result.totalButtons} total interactive elements`;

      console.error("[Dead Button Scanner]", message);
      console.table(
        result.deadButtons.map((db) => ({
          element: db.element.tagName,
          className: db.element.className,
          path: db.path,
          reason: db.reason,
        })),
      );

      // In CI, fail the build
      if (this.isCI) {
        throw new Error(
          `Build failed: ${message}. All interactive elements must have click handlers.`,
        );
      }

      // In development, show detailed warnings
      if (this.isDevelopment) {
        result.deadButtons.forEach((deadButton) => {
          console.warn("Dead button details:", {
            element: deadButton.element,
            path: deadButton.path,
            outerHTML: deadButton.outerHTML.substring(0, 100) + "...",
            reason: deadButton.reason,
          });
        });
      }
    } else {
      console.log("[Dead Button Scanner] ✅ No dead buttons found");
    }
  }

  public runAfterRender(): void {
    if (this.isCI) return;

    const now = Date.now();
    if (now - this.lastScanTime < this.scanThrottleMs) {
      return; // Throttle scanning
    }

    // Use setTimeout to run after React render cycle
    setTimeout(() => {
      this.lastScanTime = Date.now();
      this.scanForDeadButtons();
    }, 100);
  }

  public runOnRouteChange(): void {
    if (this.isCI) return;

    const now = Date.now();
    if (now - this.lastScanTime < this.scanThrottleMs) {
      return; // Throttle scanning
    }

    // Run scan after route changes
    setTimeout(() => {
      this.lastScanTime = Date.now();
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
    runOnRouteChange: () => deadButtonScanner.runOnRouteChange(),
  };
};

// Auto-run in development after page load
if (typeof window !== "undefined" && import.meta.env.DEV) {
  window.addEventListener("load", () => {
    deadButtonScanner.runAfterRender();
  });
}

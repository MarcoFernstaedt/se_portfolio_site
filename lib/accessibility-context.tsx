'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Context value shared by AccessibilityProvider.
 *
 * @property accessibilityMode - True when screen-reader optimised mode is active
 *   (high contrast, reduced motion, linearised layout).
 * @property toggleAccessibilityMode - Toggles accessibility mode, persists the
 *   preference to localStorage, and updates the `accessibility-mode` body class.
 */
interface AccessibilityContextType {
  accessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  accessibilityMode: false,
  toggleAccessibilityMode: () => {},
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-mode');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const initial = saved === 'true' || prefersReducedMotion;
    setAccessibilityMode(initial);
    document.body.classList.toggle('accessibility-mode', initial);
  }, []);

  const toggleAccessibilityMode = () => {
    setAccessibilityMode((prev) => {
      const next = !prev;
      document.body.classList.toggle('accessibility-mode', next);
      localStorage.setItem('accessibility-mode', String(next));
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ accessibilityMode, toggleAccessibilityMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook to read and toggle accessibility mode from any client component.
 *
 * Must be used inside an `<AccessibilityProvider>`.
 */
export const useAccessibility = () => useContext(AccessibilityContext);

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const useAccessibility = () => useContext(AccessibilityContext);

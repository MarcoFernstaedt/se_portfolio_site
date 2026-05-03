'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { projects } from '@/lib/data';

type TourState = 'idle' | 'intro' | 'touring' | 'chatting';

interface HermesResponse {
  message: string;
  highlightId?: string;
  scrollToSection?: string;
  openProjectId?: string;
}

interface HermesTourProps {
  onProjectOpen: (project: Project) => void;
  onScrollTo: (section: string) => void;
  booted: boolean;
}

export default function HermesTour({ onProjectOpen, onScrollTo, booted }: HermesTourProps) {
  const [state, setState] = useState<TourState>('idle');
  const [tourStep, setTourStep] = useState(0);
  const [currentSection, setCurrentSection] = useState('projects');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef<string>(
    typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36)
  );
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  // Auto-show intro after boot animation completes
  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => setState('intro'), 3500);
    return () => clearTimeout(t);
  }, [booted]);

  const typeMessage = useCallback((text: string) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typewriterRef.current!);
        setIsTyping(false);
      }
    }, 18);
  }, []);

  const applyResponse = useCallback(
    (response: HermesResponse) => {
      typeMessage(response.message);
      if (response.scrollToSection) {
        setCurrentSection(response.scrollToSection);
        onScrollTo(response.scrollToSection);
      }
      if (response.highlightId) {
        const sectionId = response.highlightId.replace(/^section-/, '');
        const el = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (el) {
          el.classList.add('hermes-highlight');
          setTimeout(() => el.classList.remove('hermes-highlight'), 3000);
        }
      }
      if (response.openProjectId) {
        const project = projects.find((p) => p.id === response.openProjectId);
        if (project) onProjectOpen(project);
      }
    },
    [typeMessage, onScrollTo, onProjectOpen]
  );

  const logEvent = useCallback((event: string, data: object) => {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        sessionId: sessionId.current,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  }, []);

  const callHermes = useCallback(
    async (
      event: 'tour_start' | 'tour_step' | 'user_message',
      message: string | null = null,
      step: number = tourStep
    ) => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/hermes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            event,
            sessionId: sessionId.current,
            context: { currentSection, tourStep: step },
          }),
        });
        const data: HermesResponse = await res.json();
        applyResponse(data);
        logEvent(event, { step, message });
      } catch {
        typeMessage('I seem to be having trouble connecting. Please try again in a moment.');
      } finally {
        setIsLoading(false);
      }
    },
    [tourStep, currentSection, applyResponse, typeMessage, logEvent]
  );

  const handleStartTour = async () => {
    setState('touring');
    setTourStep(0);
    setDisplayedText('');
    logEvent('tour_start', {});
    await callHermes('tour_start', null, 0);
  };

  const handleNextStep = async () => {
    const nextStep = tourStep + 1;
    setTourStep(nextStep);
    setDisplayedText('');
    await callHermes('tour_step', null, nextStep);
  };

  const handleAskQuestion = async () => {
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue.trim();
    setInputValue('');
    setState('chatting');
    setDisplayedText('');
    await callHermes('user_message', msg);
  };

  const handleClose = () => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayedText('');
    setIsTyping(false);
    setState('idle');
  };

  if (!booted) return null;

  const panelStyle: React.CSSProperties = {
    backgroundColor: 'rgba(10,14,23,0.97)',
    border: '1px solid rgba(0,212,255,0.25)',
    boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.08)',
    backdropFilter: 'blur(10px)',
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={() => setState('intro')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold"
            style={{
              backgroundColor: 'rgba(10,14,23,0.95)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: 'var(--accent-cyan)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(0,212,255,0.1)',
              cursor: 'pointer',
            }}
            aria-label="Open Hermes AI guide"
          >
            <span aria-hidden="true">◈</span>
            <span>HERMES</span>
          </motion.button>
        )}

        {(state === 'intro' || state === 'touring' || state === 'chatting') && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg overflow-hidden"
            style={{ ...panelStyle, width: 'min(520px, calc(100vw - 2rem))' }}
            role="complementary"
            aria-live="polite"
            aria-label="Hermes AI Guide panel"
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderBottom: '1px solid rgba(0,212,255,0.1)',
              }}
            >
              <span
                className="text-xs font-mono font-bold"
                style={{ color: 'var(--accent-cyan)' }}
              >
                ◈ HERMES — AI GUIDE
              </span>
              <button
                onClick={handleClose}
                className="text-xs px-2 py-0.5 rounded transition-colors"
                style={{
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
                aria-label="Collapse Hermes panel"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Intro prompt (no message yet) */}
              {state === 'intro' && !displayedText && !isLoading && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  I can walk you through Marco&apos;s work or answer your questions.
                </p>
              )}

              {/* Message display */}
              {displayedText && (
                <div
                  className="text-sm leading-relaxed font-mono min-h-[3rem]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {displayedText}
                  {isTyping && (
                    <span
                      className="cursor-blink ml-0.5"
                      style={{ color: 'var(--accent-cyan)' }}
                      aria-hidden="true"
                    >
                      █
                    </span>
                  )}
                </div>
              )}

              {/* Loading */}
              {isLoading && !displayedText && (
                <div className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                  <span className="cursor-blink">▋</span> Hermes is thinking...
                </div>
              )}

              {/* Intro CTAs */}
              {state === 'intro' && !isLoading && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleStartTour}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded font-mono font-bold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'rgba(0,212,255,0.1)',
                      border: '1px solid rgba(0,212,255,0.4)',
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                    }}
                  >
                    ▶ START GUIDED TOUR
                  </button>
                  <button
                    onClick={() => setState('chatting')}
                    className="text-xs px-4 py-2 rounded font-mono transition-all hover:opacity-90"
                    style={{
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    ASK A QUESTION
                  </button>
                </div>
              )}

              {/* Next step — touring */}
              {state === 'touring' && !isLoading && !isTyping && displayedText && (
                <button
                  onClick={handleNextStep}
                  className="text-xs px-3 py-1.5 rounded font-mono transition-all hover:opacity-90"
                  style={{
                    border: '1px solid rgba(0,255,136,0.3)',
                    color: 'var(--accent-green)',
                    cursor: 'pointer',
                  }}
                >
                  → Continue
                </button>
              )}

              {/* Input — chatting or touring */}
              {(state === 'chatting' || state === 'touring') && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                    placeholder="Ask Hermes anything..."
                    className="flex-1 text-xs px-3 py-2 rounded font-mono bg-transparent outline-none"
                    style={{
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      caretColor: 'var(--accent-cyan)',
                    }}
                    aria-label="Ask Hermes a question"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={isLoading || !inputValue.trim()}
                    className="text-xs px-3 py-2 rounded font-mono transition-all"
                    style={{
                      backgroundColor: 'rgba(0,212,255,0.1)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      color: 'var(--accent-cyan)',
                      cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                      opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
                    }}
                    aria-label="Send message"
                  >
                    ↵
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

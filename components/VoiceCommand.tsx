'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/data';
import { Project } from '@/types';
import { FEEDBACK_DISPLAY_DURATION } from '@/lib/constants';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface VoiceCommandProps {
  onProjectOpen: (project: Project) => void;
  onScrollTo: (section: string) => void;
}

type CommandResult =
  | { type: 'project'; project: Project }
  | { type: 'navigate'; section: string }
  | { type: 'unknown'; transcript: string };

/**
 * Example voice commands shown in the help panel.
 * Defined outside the component to avoid re-creating the array on every render.
 */
const EXAMPLE_COMMANDS = [
  '"Show projects"',
  '"Open accessibility system"',
  '"Open messaging platform"',
  '"Show skills"',
  '"Navigate to systems"',
  '"Contact"',
];

/**
 * Maps voice keyword groups to project IDs (looked up at runtime).
 * Using IDs rather than array indices keeps this stable if project order changes.
 */
const PROJECT_KEYWORD_MAP: [string[], string][] = [
  [['image', 'audio', 'accessibility', 'vision'], 'ai-image-audio'],
  [['messaging', 'chat', 'real time', 'socket'], 'realtime-messaging'],
  [['interview', 'coding', 'code'], 'interview-platform'],
  [['real estate', 'property', 'data'], 'real-estate-data'],
];

/**
 * Parses a raw voice transcript into an executable command.
 *
 * Checks against project keywords first (open a project modal), then
 * navigation sections (scroll to an area), and falls back to "unknown".
 *
 * @param transcript - Raw text returned by the Speech Recognition API.
 */
function parseCommand(transcript: string): CommandResult {
  const t = transcript.toLowerCase().trim();

  // Project open commands — matched by keyword group, resolved by project ID
  const projectMap: [string[], Project | undefined][] = PROJECT_KEYWORD_MAP.map(
    ([keywords, id]) => [keywords, projects.find((p) => p.id === id)]
  );
  for (const [keywords, project] of projectMap) {
    if (project && keywords.some((k) => t.includes(k))) {
      return { type: 'project', project };
    }
  }

  // Navigate commands
  if (t.includes('project') || t.includes('show project')) {
    return { type: 'navigate', section: 'projects' };
  }
  if (t.includes('skill') || t.includes('tech')) {
    return { type: 'navigate', section: 'skills' };
  }
  if (t.includes('system') || t.includes('map')) {
    return { type: 'navigate', section: 'systems' };
  }
  if (t.includes('contact') || t.includes('founder') || t.includes('about')) {
    return { type: 'navigate', section: 'founder' };
  }

  return { type: 'unknown', transcript: t };
}

/**
 * Floating voice-command interface using the Web Speech API.
 *
 * Renders only in browsers that support `SpeechRecognition`. Users can speak
 * commands to open project modals or scroll to sections. Shows a collapsible
 * help panel listing available commands and a live transcript/feedback area.
 */
export default function VoiceCommand({ onProjectOpen, onScrollTo }: VoiceCommandProps) {
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleResult = useCallback(
    (t: string) => {
      const result = parseCommand(t);
      if (result.type === 'project') {
        setFeedback(`Opening: ${result.project.name}`);
        onProjectOpen(result.project);
      } else if (result.type === 'navigate') {
        setFeedback(`Navigating to: ${result.section}`);
        onScrollTo(result.section);
      } else {
        setFeedback(`Command not recognized: "${t}"`);
      }
      setTimeout(() => setFeedback(''), FEEDBACK_DISPLAY_DURATION);
    },
    [onProjectOpen, onScrollTo]
  );

  const startListening = useCallback(() => {
    if (!supported || listening) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const t = event.results[0][0].transcript;
      setTranscript(t);
      handleResult(t);
    };

    recognition.onerror = () => {
      setFeedback('Microphone error. Check permissions.');
      setListening(false);
      setTimeout(() => setFeedback(''), FEEDBACK_DISPLAY_DURATION);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript('');
  }, [supported, listening, handleResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  if (!supported) return null;

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-1.5rem)]" aria-label="Voice command interface">
      {/* Example commands panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 rounded-lg p-4 w-64"
            style={{
              backgroundColor: '#0f1520',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            }}
            role="tooltip"
            aria-label="Available voice commands"
          >
            <div
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: 'var(--accent-cyan)' }}
            >
              Voice Commands
            </div>
            <ul className="space-y-1.5">
              {EXAMPLE_COMMANDS.map((cmd) => (
                <li key={cmd} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>›</span> {cmd}
                </li>
              ))}
            </ul>

            {/* Transcript display */}
            {transcript && (
              <div
                className="mt-3 pt-3 text-xs"
                style={{ borderTop: '1px solid var(--border-color)', color: 'var(--accent-green)' }}
                aria-live="polite"
                aria-atomic="true"
              >
                Heard: &quot;{transcript}&quot;
              </div>
            )}
            {feedback && (
              <div
                className="mt-2 text-xs"
                style={{ color: feedback.includes('not recognized') ? 'var(--accent-red)' : 'var(--accent-green)' }}
                aria-live="polite"
                aria-atomic="true"
              >
                {feedback}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main voice button */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => setShowPanel((p) => !p)}
          className="text-xs px-3 py-2 rounded transition-all"
          style={{
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            backgroundColor: 'rgba(15,21,32,0.9)',
          }}
          aria-expanded={showPanel}
          aria-label="Toggle voice commands help panel"
        >
          {showPanel ? '✕ Close' : '? Commands'}
        </button>

        <motion.button
          onClick={listening ? stopListening : startListening}
          aria-pressed={listening}
          aria-label={listening ? 'Stop listening for voice commands' : 'Start voice command — Speak a command'}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-mono text-xs font-bold transition-all"
          style={{
            backgroundColor: listening ? 'rgba(0,255,136,0.15)' : 'rgba(0,212,255,0.1)',
            border: `1px solid ${listening ? 'var(--accent-green)' : 'var(--accent-cyan)'}`,
            color: listening ? 'var(--accent-green)' : 'var(--accent-cyan)',
            boxShadow: listening ? '0 0 20px rgba(0,255,136,0.2)' : 'none',
          }}
          whileTap={{ scale: 0.96 }}
          animate={listening ? { boxShadow: ['0 0 20px rgba(0,255,136,0.2)', '0 0 40px rgba(0,255,136,0.4)', '0 0 20px rgba(0,255,136,0.2)'] } : {}}
          transition={listening ? { duration: 1.5, repeat: Infinity } : {}}
        >
          <span aria-hidden="true">{listening ? '◉' : '◎'}</span>
          <span className="hidden sm:inline">{listening ? 'Listening...' : 'Speak a command'}</span>
          <span className="sm:hidden">{listening ? 'Listening' : 'Voice'}</span>
        </motion.button>
      </div>
    </div>
  );
}

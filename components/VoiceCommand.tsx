'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/data';
import { Project } from '@/types';

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

function parseCommand(transcript: string): CommandResult {
  const t = transcript.toLowerCase().trim();

  // Project open commands
  const projectMap: [string[], Project][] = [
    [['image', 'audio', 'accessibility', 'vision'], projects[0]],
    [['messaging', 'chat', 'real time', 'socket'], projects[1]],
    [['interview', 'coding', 'code'], projects[2]],
    [['real estate', 'property', 'data'], projects[3]],
  ];
  for (const [keywords, project] of projectMap) {
    if (keywords.some((k) => t.includes(k))) {
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

export default function VoiceCommand({ onProjectOpen, onScrollTo }: VoiceCommandProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setSupported(true);
    }
  }, []);

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
      setTimeout(() => setFeedback(''), 3000);
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
      setTimeout(() => setFeedback(''), 3000);
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

  const exampleCommands = [
    '"Show projects"',
    '"Open accessibility system"',
    '"Open messaging platform"',
    '"Show skills"',
    '"Navigate to systems"',
    '"Contact"',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40" aria-label="Voice command interface">
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
              border: '1px solid #1e3a5f',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            }}
            role="tooltip"
            aria-label="Available voice commands"
          >
            <div
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: '#00d4ff' }}
            >
              Voice Commands
            </div>
            <ul className="space-y-1.5">
              {exampleCommands.map((cmd) => (
                <li key={cmd} className="text-xs" style={{ color: '#94a3b8' }}>
                  <span style={{ color: '#4a5568' }}>›</span> {cmd}
                </li>
              ))}
            </ul>

            {/* Transcript display */}
            {transcript && (
              <div
                className="mt-3 pt-3 text-xs"
                style={{ borderTop: '1px solid #1e3a5f', color: '#00ff88' }}
                aria-live="polite"
                aria-atomic="true"
              >
                Heard: &quot;{transcript}&quot;
              </div>
            )}
            {feedback && (
              <div
                className="mt-2 text-xs"
                style={{ color: feedback.includes('not recognized') ? '#ff4444' : '#00ff88' }}
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
            border: '1px solid #1e3a5f',
            color: '#94a3b8',
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all"
          style={{
            backgroundColor: listening ? 'rgba(0,255,136,0.15)' : 'rgba(0,212,255,0.1)',
            border: `1px solid ${listening ? '#00ff88' : '#00d4ff'}`,
            color: listening ? '#00ff88' : '#00d4ff',
            boxShadow: listening ? '0 0 20px rgba(0,255,136,0.2)' : 'none',
          }}
          whileTap={{ scale: 0.96 }}
          animate={listening ? { boxShadow: ['0 0 20px rgba(0,255,136,0.2)', '0 0 40px rgba(0,255,136,0.4)', '0 0 20px rgba(0,255,136,0.2)'] } : {}}
          transition={listening ? { duration: 1.5, repeat: Infinity } : {}}
        >
          <span aria-hidden="true">{listening ? '◉' : '◎'}</span>
          {listening ? 'Listening...' : 'Speak a command'}
        </motion.button>
      </div>
    </div>
  );
}

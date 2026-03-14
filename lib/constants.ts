/**
 * Shared application constants.
 *
 * Centralises magic numbers and reusable Framer Motion animation variants so
 * that timings and motion presets stay consistent across components and are
 * easy to tweak in one place.
 */

// ---------------------------------------------------------------------------
// Timing (milliseconds)
// ---------------------------------------------------------------------------

/** Delay between each boot-sequence message line. */
export const BOOT_MESSAGE_INTERVAL = 420;

/** How long to wait after the last boot message before fading out. */
export const BOOT_COMPLETION_DELAY = 500;

/** Duration of the boot-screen exit animation. */
export const BOOT_EXIT_DURATION = 600;

/** How long a voice-command feedback message stays visible. */
export const FEEDBACK_DISPLAY_DURATION = 3000;

// ---------------------------------------------------------------------------
// Framer Motion animation variants
// ---------------------------------------------------------------------------

/** Fade in while sliding from the left — used for list items and skill rows. */
export const FADE_IN_LEFT = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
} as const;

/** Fade in while sliding upward — used for panel entrance animations. */
export const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
} as const;

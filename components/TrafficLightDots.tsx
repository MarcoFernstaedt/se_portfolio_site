/**
 * macOS-style traffic-light window control dots.
 *
 * Used in the TopBar and ProjectModal to reinforce the terminal/desktop
 * aesthetic. Rendered as a purely decorative, aria-hidden group.
 *
 * @param onClose - Optional click handler bound to the red dot (close action).
 *                  When provided, the red dot renders as a `<button>` instead
 *                  of a `<span>`.
 */

interface TrafficLightDotsProps {
  onClose?: () => void;
}

export default function TrafficLightDots({ onClose }: TrafficLightDotsProps) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {onClose ? (
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#ff5f57' }}
          aria-label="Close"
        />
      ) : (
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
      )}
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
    </div>
  );
}

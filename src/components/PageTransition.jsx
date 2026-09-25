import { useEffect, useState } from 'react';
import '../styles/transitions.css';

/**
 * PageTransition - Provides cinematic page transitions
 * 
 * @param {'doors' | 'switch' | 'origami'} type
 *   - doors:   Two panels slide apart like opening doors (default for all pages)
 *   - switch:  A horizontal card-flip / switch effect (Login & Register)
 *   - origami: Paper-unfold 3D perspective animation (initial loading)
 * @param {number} duration - Duration in ms (default 1200)
 */
export default function PageTransition({ children, type = 'doors', duration = 1200 }) {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'active' | 'done'

  useEffect(() => {
    // Small delay so the DOM paints the initial state first
    const raf = requestAnimationFrame(() => {
      setPhase('active');
    });

    const timer = setTimeout(() => {
      setPhase('done');
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration]);

  /* ─── Doors Transition ─── */
  if (type === 'doors') {
    return (
      <div className="transition-doors-wrapper">
        {/* Left door panel */}
        <div
          className={`transition-door transition-door-left ${
            phase === 'enter' ? '' : 'transition-door-open'
          }`}
        />
        {/* Right door panel */}
        <div
          className={`transition-door transition-door-right ${
            phase === 'enter' ? '' : 'transition-door-open'
          }`}
        />
        {/* Page content fades in after doors open */}
        <div
          className={`transition-doors-content ${
            phase === 'done' ? 'transition-doors-content-visible' : ''
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  /* ─── Switch Transition ─── */
  if (type === 'switch') {
    return (
      <div className="transition-switch-wrapper">
        <div
          className={`transition-switch-card ${
            phase !== 'enter' ? 'transition-switch-card-active' : ''
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  /* ─── Origami Transition ─── */
  if (type === 'origami') {
    return (
      <div className="transition-origami-wrapper">
        {/* Folded overlay panels */}
        <div
          className={`transition-origami-panel transition-origami-top ${
            phase !== 'enter' ? 'transition-origami-unfold' : ''
          }`}
        />
        <div
          className={`transition-origami-panel transition-origami-bottom ${
            phase !== 'enter' ? 'transition-origami-unfold' : ''
          }`}
        />
        {/* Content with 3D unfold */}
        <div
          className={`transition-origami-content ${
            phase === 'done' ? 'transition-origami-content-visible' : ''
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  // Fallback
  return <>{children}</>;
}

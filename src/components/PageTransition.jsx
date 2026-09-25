import { useEffect, useState } from 'react';
import '../styles/transitions.css';

/**
 * PageTransition - Provides authentic 3D Origami page transitions
 * 
 * @param {'origami' | 'doors' | 'switch'} type
 *   - origami: Multi-facet paper unfold with golden crease seams & flapping wings (Default for ALL pages)
 *   - doors:   Two panels slide apart like opening doors
 *   - switch:  A horizontal 3D card-flip effect
 * @param {number} duration - Duration in ms (default 850)
 */
export default function PageTransition({ children, type = 'origami', duration = 850 }) {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'active' | 'done'

  useEffect(() => {
    // Scroll to top on page load / transition
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Trigger active phase on next paint
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

  /* ─── Origami 3D Transition (Default) ─── */
  if (type === 'origami') {
    const isUnfolding = phase === 'active' || phase === 'done';
    const isDone = phase === 'done';

    return (
      <div className="transition-origami-wrapper">
        {/* Origami 3D Overlay - automatically unmounts when done */}
        {!isDone && (
          <div className={`origami-overlay ${isUnfolding ? 'origami-unfolding' : ''}`}>
            {/* 4 Multi-facet 3D origami paper flaps */}
            <div className="origami-facet origami-facet-top" />
            <div className="origami-facet origami-facet-right" />
            <div className="origami-facet origami-facet-bottom" />
            <div className="origami-facet origami-facet-left" />

            {/* Diagonal Origami Fold Creases */}
            <div className="origami-crease-diag-1" />
            <div className="origami-crease-diag-2" />

            {/* Center Origami Crane / Crest with Animated 3D Wings */}
            <div className="origami-center-emblem">
              <div className="origami-bird-wings">
                <div className="origami-wing origami-wing-l" />
                <div className="origami-wing-body">
                  <svg viewBox="0 0 40 40" className="origami-bird-svg" fill="none">
                    <polygon points="20,4 36,20 20,36 4,20" fill="url(#goldOrigamiGrad)" stroke="#FFD700" strokeWidth="1.5" />
                    <polygon points="20,4 20,36 36,20" fill="rgba(255,255,255,0.2)" />
                    <line x1="4" y1="20" x2="36" y2="20" stroke="#FFE082" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="20" y1="4" x2="20" y2="36" stroke="#FFE082" strokeWidth="1" strokeDasharray="2,2" />
                    <defs>
                      <linearGradient id="goldOrigamiGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#AA7A1E" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="origami-wing origami-wing-r" />
              </div>
              <div className="origami-tagline">Code Weave Planet</div>
              <div className="origami-subtag">Unfolding Excellence</div>
            </div>
          </div>
        )}

        {/* Content with 3D paper unfold effect */}
        <div
          className={`transition-origami-content ${
            isUnfolding ? 'transition-origami-content-unfolded' : ''
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  /* ─── Doors Transition ─── */
  if (type === 'doors') {
    return (
      <div className="transition-doors-wrapper">
        <div
          className={`transition-door transition-door-left ${
            phase === 'enter' ? '' : 'transition-door-open'
          }`}
        />
        <div
          className={`transition-door transition-door-right ${
            phase === 'enter' ? '' : 'transition-door-open'
          }`}
        />
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

  return <>{children}</>;
}

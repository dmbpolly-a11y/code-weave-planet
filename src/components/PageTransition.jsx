import React, { createContext, useContext, useEffect, useState } from 'react';

// Context to prevent duplicate nested origami transitions
const OrigamiContext = createContext(false);

/**
 * PageTransition - 3D Origami Paper Unfolding Transition
 * Every page loads with an authentic 3D origami fold-and-unfold sequence,
 * simulating crisp geometric paper facets opening into full view.
 */
export default function PageTransition({ children }) {
  const isNested = useContext(OrigamiContext);
  const [isUnfolded, setIsUnfolded] = useState(false);

  useEffect(() => {
    if (isNested) return;
    setIsUnfolded(false);
    const raf = requestAnimationFrame(() => {
      setIsUnfolded(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [isNested]);

  // If already wrapped by an outer PageTransition, render children directly
  if (isNested) {
    return <>{children}</>;
  }

  return (
    <OrigamiContext.Provider value={true}>
      <div className="origami-viewport">
        <style>{`
          .origami-viewport {
            perspective: 1600px;
            perspective-origin: 50% 30%;
            min-height: 100vh;
            width: 100%;
            overflow-x: hidden;
            background: transparent;
          }

          .origami-page-container {
            width: 100%;
            min-height: 100vh;
            transform-style: preserve-3d;
            transform-origin: 50% 15%;
            backface-visibility: hidden;
            will-change: transform, opacity, clip-path;
          }

          /* 3D Origami Paper Unfolding Animation */
          .origami-unfolding {
            animation: origamiPaperUnfold 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes origamiPaperUnfold {
            0% {
              opacity: 0;
              transform: perspective(1600px) rotateX(-38deg) rotateY(16deg) rotateZ(-3deg) scale(0.92) translateY(-40px);
              clip-path: polygon(10% 0%, 90% 0%, 100% 75%, 50% 100%, 0% 75%);
              filter: brightness(1.25) contrast(1.1) drop-shadow(0 25px 35px rgba(44, 24, 16, 0.35));
            }
            35% {
              opacity: 0.88;
              transform: perspective(1600px) rotateX(16deg) rotateY(-8deg) rotateZ(1.5deg) scale(0.97) translateY(12px);
              clip-path: polygon(3% 0%, 97% 0%, 100% 92%, 50% 98%, 0% 92%);
              filter: brightness(1.1) contrast(1.05) drop-shadow(0 15px 25px rgba(44, 24, 16, 0.2));
            }
            70% {
              transform: perspective(1600px) rotateX(-5deg) rotateY(2.5deg) rotateZ(-0.5deg) scale(0.995) translateY(-3px);
              clip-path: polygon(0% 0%, 100% 0%, 100% 99%, 50% 100%, 0% 99%);
              filter: brightness(1.03) contrast(1.02);
            }
            100% {
              opacity: 1;
              transform: perspective(1600px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) translateY(0);
              clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
              filter: brightness(1) contrast(1) drop-shadow(0 0 0 transparent);
            }
          }

          /* Origami Crease Light Flare Overlay */
          .origami-crease-flare {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999;
            background: linear-gradient(
              135deg,
              transparent 30%,
              rgba(255, 255, 255, 0.5) 48%,
              rgba(212, 175, 55, 0.4) 50%,
              rgba(34, 211, 238, 0.35) 52%,
              transparent 68%
            );
            opacity: 0;
            transform: translateX(-100%) rotate(25deg);
            animation: origamiCreaseShimmer 0.85s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
          }

          @keyframes origamiCreaseShimmer {
            0% {
              opacity: 0;
              transform: translateX(-80%) rotate(25deg);
            }
            25% {
              opacity: 0.75;
            }
            65% {
              opacity: 0.5;
              transform: translateX(60%) rotate(25deg);
            }
            100% {
              opacity: 0;
              transform: translateX(120%) rotate(25deg);
            }
          }

          @media (max-width: 768px) {
            .origami-viewport {
              perspective: 1000px;
            }
            @keyframes origamiPaperUnfold {
              0% {
                opacity: 0;
                transform: perspective(1000px) rotateX(-25deg) scale(0.95) translateY(-25px);
                clip-path: polygon(5% 0%, 95% 0%, 100% 85%, 50% 100%, 0% 85%);
              }
              100% {
                opacity: 1;
                transform: perspective(1000px) rotateX(0deg) scale(1) translateY(0);
                clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
              }
            }
          }
        `}</style>

        {/* Origami diagonal crease flare */}
        {isUnfolded && <div className="origami-crease-flare" />}

        {/* Unfolding Content Container */}
        <div className={`origami-page-container ${isUnfolded ? 'origami-unfolding' : ''}`}>
          {children}
        </div>
      </div>
    </OrigamiContext.Provider>
  );
}

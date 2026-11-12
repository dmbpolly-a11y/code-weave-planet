import React, { createContext, useContext, useEffect, useState } from 'react';

// Context to prevent duplicate nested door transitions
const DoorContext = createContext(false);

/**
 * PageTransition - High-Tech Celestial Double-Door Opening Transition
 * Every page opens with grand celestial double doors that slide/swing open
 * from the center with a burst of golden cosmic light, revealing the page.
 */
export default function PageTransition({ children }) {
  const isNested = useContext(DoorContext);
  const [animationActive, setAnimationActive] = useState(true);

  useEffect(() => {
    if (isNested) return;
    setAnimationActive(true);
    const timer = setTimeout(() => {
      setAnimationActive(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, [isNested]);

  if (isNested) {
    return <>{children}</>;
  }

  return (
    <DoorContext.Provider value={true}>
      <div className="cwp-door-viewport">
        <style>{`
          .cwp-door-viewport {
            position: relative;
            min-height: 100vh;
            width: 100%;
            overflow-x: hidden;
          }

          /* The Content beneath the doors */
          .cwp-door-content {
            width: 100%;
            min-height: 100vh;
            animation: cwpContentReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes cwpContentReveal {
            0% {
              opacity: 0.35;
              transform: scale(0.97);
              filter: blur(4px);
            }
            40% {
              opacity: 0.8;
              transform: scale(0.99);
              filter: blur(1px);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
          }

          /* Grand Double Door Overlay */
          .cwp-door-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            pointer-events: none;
            display: flex;
            overflow: hidden;
            perspective: 1200px;
          }

          /* Left Door Panel */
          .cwp-door-panel-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 50vw;
            height: 100vh;
            background: linear-gradient(135deg, #070B19 0%, #0D1630 60%, #152042 100%);
            border-right: 3px solid #C99726;
            box-shadow: inset -10px 0 30px rgba(201, 151, 38, 0.25), 10px 0 35px rgba(0, 0, 0, 0.7);
            transform-origin: left center;
            animation: cwpLeftDoorSlideOpen 0.95s cubic-bezier(0.77, 0, 0.175, 1) 0.12s forwards;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          /* Right Door Panel */
          .cwp-door-panel-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 50vw;
            height: 100vh;
            background: linear-gradient(225deg, #070B19 0%, #0D1630 60%, #152042 100%);
            border-left: 3px solid #C99726;
            box-shadow: inset 10px 0 30px rgba(201, 151, 38, 0.25), -10px 0 35px rgba(0, 0, 0, 0.7);
            transform-origin: right center;
            animation: cwpRightDoorSlideOpen 0.95s cubic-bezier(0.77, 0, 0.175, 1) 0.12s forwards;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          /* Geometric Tech Patterns on Doors */
          .cwp-door-grooves {
            position: absolute;
            inset: 0;
            opacity: 0.15;
            background-image: 
              linear-gradient(rgba(201, 151, 38, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201, 151, 38, 0.4) 1px, transparent 1px);
            background-size: 40px 40px;
          }

          /* Golden Seam Light in the Center */
          .cwp-door-center-light {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            width: 6px;
            transform: translateX(-50%);
            background: #FFFFFF;
            box-shadow: 0 0 25px 8px rgba(201, 151, 38, 0.8), 0 0 50px 15px rgba(255, 215, 0, 0.6);
            animation: cwpCenterSeamGlow 0.8s ease-out forwards;
            pointer-events: none;
          }

          /* Center Cosmic Emblem on the Doors */
          .cwp-door-center-emblem {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: radial-gradient(circle, #C99726 0%, #0A1128 70%);
            border: 2px solid #FFD700;
            box-shadow: 0 0 30px rgba(201, 151, 38, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 1px;
            font-family: 'Space Grotesk', sans-serif;
            animation: cwpEmblemPart 0.85s cubic-bezier(0.77, 0, 0.175, 1) 0.12s forwards;
            z-index: 10;
          }

          /* Left Door Opening Animation */
          @keyframes cwpLeftDoorSlideOpen {
            0% {
              transform: translateX(0) rotateY(0deg);
              opacity: 1;
            }
            15% {
              transform: translateX(0) rotateY(0deg);
              opacity: 1;
            }
            85% {
              transform: translateX(-100%) rotateY(15deg);
              opacity: 0.95;
            }
            100% {
              transform: translateX(-105%) rotateY(20deg);
              opacity: 0;
              visibility: hidden;
            }
          }

          /* Right Door Opening Animation */
          @keyframes cwpRightDoorSlideOpen {
            0% {
              transform: translateX(0) rotateY(0deg);
              opacity: 1;
            }
            15% {
              transform: translateX(0) rotateY(0deg);
              opacity: 1;
            }
            85% {
              transform: translateX(100%) rotateY(-15deg);
              opacity: 0.95;
            }
            100% {
              transform: translateX(105%) rotateY(-20deg);
              opacity: 0;
              visibility: hidden;
            }
          }

          /* Center Seam Flash & Dissolve */
          @keyframes cwpCenterSeamGlow {
            0% {
              opacity: 0;
              transform: translateX(-50%) scaleY(0);
            }
            30% {
              opacity: 1;
              transform: translateX(-50%) scaleY(1);
            }
            70% {
              opacity: 0.8;
              transform: translateX(-50%) scaleX(4);
            }
            100% {
              opacity: 0;
              transform: translateX(-50%) scaleX(8);
            }
          }

          /* Center Emblem Scale & Fade Out */
          @keyframes cwpEmblemPart {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            35% {
              transform: translate(-50%, -50%) scale(1.15);
              opacity: 1;
            }
            80% {
              transform: translate(-50%, -50%) scale(0.6);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
              visibility: hidden;
            }
          }

          @media (max-width: 768px) {
            .cwp-door-center-emblem {
              width: 70px;
              height: 70px;
              font-size: 22px;
            }
          }
        `}</style>

        {/* Cinematic Close-Door / Double-Door Transition Overlay */}
        {animationActive && (
          <div className="cwp-door-overlay" aria-hidden="true">
            {/* Left Door */}
            <div className="cwp-door-panel-left">
              <div className="cwp-door-grooves" />
            </div>

            {/* Right Door */}
            <div className="cwp-door-panel-right">
              <div className="cwp-door-grooves" />
            </div>

            {/* Glowing Golden Center Seam Light */}
            <div className="cwp-door-center-light" />

            {/* Cosmic Seal / Emblem */}
            <div className="cwp-door-center-emblem">
              <span>CWP</span>
            </div>
          </div>
        )}

        {/* Revealed Page Content */}
        <div className="cwp-door-content">
          {children}
        </div>
      </div>
    </DoorContext.Provider>
  );
}

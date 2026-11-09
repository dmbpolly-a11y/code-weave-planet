import React, { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';

/**
 * Helper to compute an SVG arc path
 */
function describeArc(cx, cy, r, startAngle, endAngle) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * SteeringWheelCircle
 * 
 * An interactive high-tech steering wheel circle placed before the footer on every page.
 * 
 * Behaviour:
 * - FULL when scrolling UP (scale = 1.0, full arc spans, full thickness, fully extended spokes & grips)
 * - REDUCES when scrolling DOWN (scale contracts to ~0.74, arc lengths retract, spokes thin out)
 * - Rotates dynamically based on scroll position & velocity (like steering a high-tech vessel)
 * - Hover / interactive pointer feedback: tilts & steers interactively
 * - Telemetry HUD showing current steering angle & status (FULL on scroll up / REDUCED on scroll down)
 */
export default function SteeringWheelCircle({ title = "Tech Command Steering Helm" }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [manualSteer, setManualSteer] = useState(0);

  const lastScrollYRef = useRef(0);
  const velocityTimeoutRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentScrollY / docHeight, 0), 1) : 0;
      const diff = currentScrollY - lastScrollYRef.current;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollProgress(progress);
          // If moving upwards (diff < 0), wheel is FULL. If moving downwards (diff > 0), wheel REDUCES.
          if (Math.abs(diff) > 2) {
            setIsScrollingUp(diff < 0);
            setScrollVelocity(Math.min(Math.abs(diff), 25));

            clearTimeout(velocityTimeoutRef.current);
            velocityTimeoutRef.current = setTimeout(() => {
              setScrollVelocity(0);
            }, 180);
          }
          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(velocityTimeoutRef.current);
    };
  }, []);

  // Center & base geometry
  const cx = 200;
  const cy = 200;

  // When scrolling UP: wheel fullness factor is high (0.95 -> 1.0).
  // When scrolling DOWN: wheel fullness reduces down to 0.45 -> 0.70.
  const fullness = isScrollingUp
    ? 1.0 - scrollProgress * 0.15 // remains very full (0.85 to 1.0)
    : Math.max(0.42, 0.95 - scrollProgress * 0.58); // reduces visibly when scrolling down

  // Overall scale: 1.0 when full (scrolling up), contracts to ~0.78 when scrolling down
  const baseScale = isScrollingUp ? 1.0 : Math.max(0.76, 1.0 - scrollProgress * 0.26);
  const interactiveScale = isHovered ? baseScale * 1.04 : baseScale;

  // Rotation: proportional to scroll + manual steer on pointer hover
  const scrollRotation = (lastScrollYRef.current * 0.22) % 360;
  const totalRotation = scrollRotation + manualSteer;

  // Rim dimensions
  const outerRimR = 145 * fullness;
  const innerRimR = 120 * fullness;
  const gripR = 133 * fullness;

  // Arc spans (in degrees)
  // When full (scrolling up): arc span is wide (~78 deg per quadrant, almost a complete circle).
  // When reduced (scrolling down): arc span retracts down to ~24 deg.
  const rimHalfSpan = 22 + fullness * 56; // 45 to 78 deg
  const gripHalfSpan = 14 + fullness * 32;

  // 4 rim segments (Top, Right, Bottom, Left)
  const topRimArc = describeArc(cx, cy, gripR, -90 - rimHalfSpan, -90 + rimHalfSpan);
  const btmRimArc = describeArc(cx, cy, gripR, 90 - rimHalfSpan, 90 + rimHalfSpan);
  const rightRimArc = describeArc(cx, cy, gripR, -rimHalfSpan, rimHalfSpan);
  const leftRimArc = describeArc(cx, cy, gripR, 180 - rimHalfSpan, 180 + rimHalfSpan);

  // Outer satellite orbital lines (reduce outside lines when scrolling down, expand when up)
  const satelliteR = 172 * fullness;
  const satelliteHalfSpan = Math.max(8, fullness * 48);
  const topSatArc = describeArc(cx, cy, satelliteR, -90 - satelliteHalfSpan, -90 + satelliteHalfSpan);
  const btmSatArc = describeArc(cx, cy, satelliteR, 90 - satelliteHalfSpan, 90 + satelliteHalfSpan);
  const rightSatArc = describeArc(cx, cy, satelliteR, -satelliteHalfSpan, satelliteHalfSpan);
  const leftSatArc = describeArc(cx, cy, satelliteR, 180 - satelliteHalfSpan, 180 + satelliteHalfSpan);

  // Colors based on Code Weave logo palette
  const logoGold = "#C99726";
  const midnightNavy = "#0A1128";
  const limeGreen = "#A3E635";
  const cyanBlue = "#1D70E2";
  const brightCyan = "#22D3EE";

  // Spoke endpoints (classic 3-spoke sports steering wheel: 180°, 0°, and 90° downward)
  const hubR = 36 * Math.max(0.85, fullness);
  const leftSpokeEnd = { x: cx - innerRimR, y: cy };
  const rightSpokeEnd = { x: cx + innerRimR, y: cy };
  const btmSpokeEnd = { x: cx, y: cy + innerRimR };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const steerAngle = (x / (rect.width / 2)) * 25;
    setManualSteer(steerAngle);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setManualSteer(0);
  };

  return (
    <section className="cwp-steering-section" aria-label="Interactive Steering Wheel">
      <style>{`
        .cwp-steering-section {
          background: linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%);
          border-top: 1.5px dashed #E5E7EB;
          border-bottom: 1.5px solid #E5E7EB;
          padding: 56px 20px 48px 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .cwp-steering-container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 36px;
        }

        /* Left telemetry block */
        .cwp-steering-telemetry {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cwp-steering-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFDF0;
          border: 1.5px solid #C99726;
          color: #92400E;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          width: fit-content;
        }

        .cwp-steering-title {
          font-size: 26px;
          font-weight: 800;
          color: #0A1128;
          line-height: 1.25;
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
        }

        .cwp-steering-desc {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.6;
          margin: 0;
        }

        .cwp-steering-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 6px;
        }

        .cwp-steering-stat-card {
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 6px;
          padding: 10px 14px;
          box-shadow: 0 2px 6px rgba(10, 17, 40, 0.03);
          transition: all 0.2s ease;
        }

        .cwp-steering-stat-card:hover {
          border-color: #C99726;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 151, 38, 0.15);
        }

        .cwp-steering-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #6B7280;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .cwp-steering-stat-value {
          font-size: 17px;
          font-weight: 800;
          color: #0A1128;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Center Steering Canvas */
        .cwp-steering-wheel-wrapper {
          position: relative;
          width: min(320px, 86vw);
          height: min(320px, 86vw);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          user-select: none;
          margin: 0 auto;
        }

        .cwp-steering-wheel-wrapper:active {
          cursor: grabbing;
        }

        .cwp-steering-svg {
          width: 100%;
          height: 100%;
          transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
          filter: drop-shadow(0 14px 28px rgba(10, 17, 40, 0.12));
        }

        /* Right status block */
        .cwp-steering-status {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cwp-status-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 6px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .cwp-status-pill:hover {
          border-color: #0A1128;
          box-shadow: 0 4px 14px rgba(10, 17, 40, 0.08);
          transform: translateY(-2px);
        }

        .cwp-status-indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 10px #10B981;
          animation: cwpPulseDot 1.8s infinite;
        }

        @keyframes cwpPulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.6; }
        }

        .cwp-steer-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0A1128;
          color: #FFFFFF;
          border: 2px solid #0A1128;
          border-radius: 6px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(10, 17, 40, 0.15);
        }

        .cwp-steer-action-btn:hover {
          background: #C99726;
          border-color: #C99726;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(201, 151, 38, 0.35);
        }

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .cwp-steering-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 28px;
          }
          .cwp-steering-telemetry, .cwp-steering-status {
            align-items: center;
          }
          .cwp-steering-stats-grid {
            max-width: 380px;
            margin: 0 auto;
          }
          .cwp-steering-wheel-wrapper {
            width: min(280px, 84vw);
            height: min(280px, 84vw);
          }
        }
      `}</style>

      <div className="cwp-steering-container">
        {/* Left Telemetry Card */}
        <div className="cwp-steering-telemetry">
          <div className="cwp-steering-badge">
            <Icon icon="mdi:steering" width="16" />
            Adaptive Steering Helm
          </div>
          <h3 className="cwp-steering-title">
            Steer Your Career <br /> Into Real Tech
          </h3>
          <p className="cwp-steering-desc">
            As you scroll up, this steering helm expands to <strong>full command</strong>.
            Scroll down and it smoothly contracts into <strong>precision drive</strong>.
          </p>

          <div className="cwp-steering-stats-grid">
            <div className="cwp-steering-stat-card">
              <div className="cwp-steering-stat-label">Helm Mode</div>
              <div className="cwp-steering-stat-value" style={{ color: isScrollingUp ? '#10B981' : '#1D70E2' }}>
                <Icon icon={isScrollingUp ? "mdi:arrow-up-bold" : "mdi:arrow-down-bold"} width="18" />
                {isScrollingUp ? "FULL (UP)" : "REDUCED (DOWN)"}
              </div>
            </div>

            <div className="cwp-steering-stat-card">
              <div className="cwp-steering-stat-label">Wheel Angle</div>
              <div className="cwp-steering-stat-value">
                <Icon icon="mdi:compass-outline" width="18" color="#C99726" />
                {Math.round(totalRotation % 360)}°
              </div>
            </div>
          </div>
        </div>

        {/* Center Interactive Steering Wheel SVG */}
        <div
          className="cwp-steering-wheel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          title="Interactive Steering Wheel - Hover and move cursor to steer left and right!"
        >
          <svg
            className="cwp-steering-svg"
            viewBox="0 0 400 400"
            style={{
              transform: `scale(${interactiveScale}) rotate(${totalRotation}deg)`,
              transformOrigin: '200px 200px',
            }}
          >
            <defs>
              {/* Radial gradient for steering rim */}
              <linearGradient id="steeringRimGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C99726" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              {/* Navy grip gradient */}
              <linearGradient id="steeringGripNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0A1128" />
              </linearGradient>

              {/* Spoke metallic gradient */}
              <linearGradient id="spokeMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4D4D8" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#A1A1AA" />
              </linearGradient>

              {/* Shadow filter */}
              <filter id="cwpHelmShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(10, 17, 40, 0.25)" />
              </filter>
            </defs>

            {/* ======================================================== */}
            {/* OUTSIDE SATELLITE LINES (Reduce on scroll down, expand on up) */}
            {/* ======================================================== */}
            <g className="outside-lines" opacity={0.8}>
              {/* Outer circular guide */}
              <circle
                cx={cx}
                cy={cy}
                r={satelliteR}
                fill="none"
                stroke="rgba(201, 151, 38, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
              />
              {/* Top satellite arc (Lime Green) */}
              <path
                d={topSatArc}
                fill="none"
                stroke={limeGreen}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Bottom satellite arc (Lime Green) */}
              <path
                d={btmSatArc}
                fill="none"
                stroke={limeGreen}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Right satellite arc (Electric Blue) */}
              <path
                d={rightSatArc}
                fill="none"
                stroke={cyanBlue}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Left satellite arc (Electric Blue) */}
              <path
                d={leftSatArc}
                fill="none"
                stroke={cyanBlue}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Satellite indicator pips */}
              <circle cx={cx} cy={cy - satelliteR} r="4" fill={limeGreen} />
              <circle cx={cx} cy={cy + satelliteR} r="4" fill={limeGreen} />
              <circle cx={cx + satelliteR} cy={cy} r="4" fill={cyanBlue} />
              <circle cx={cx - satelliteR} cy={cy} r="4" fill={cyanBlue} />
            </g>

            {/* ======================================================== */}
            {/* MAIN STEERING WHEEL RIM (Heavy structural outer wheel)   */}
            {/* ======================================================== */}
            <g className="steering-outer-rim" filter="url(#cwpHelmShadow)">
              {/* Continuous outer metallic wheel ring */}
              <circle
                cx={cx}
                cy={cy}
                r={outerRimR}
                fill="none"
                stroke="#0A1128"
                strokeWidth="14"
              />

              {/* Inner metallic rim track */}
              <circle
                cx={cx}
                cy={cy}
                r={innerRimR}
                fill="none"
                stroke="#C99726"
                strokeWidth="3"
                opacity="0.8"
              />

              {/* 4 Colored Steering Grips / Segment Arcs */}
              {/* Top Grip - Gold / Lime */}
              <path
                d={topRimArc}
                fill="none"
                stroke="url(#steeringRimGold)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Bottom Grip - Gold / Lime */}
              <path
                d={btmRimArc}
                fill="none"
                stroke="url(#steeringRimGold)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Right Grip - Electric Blue */}
              <path
                d={rightRimArc}
                fill="none"
                stroke={cyanBlue}
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Left Grip - Electric Blue */}
              <path
                d={leftRimArc}
                fill="none"
                stroke={cyanBlue}
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Grip Ridges / Ergonomic notches */}
              {[-60, -120, 60, 120, -30, 30, -150, 150].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x1 = cx + (outerRimR - 6) * Math.cos(rad);
                const y1 = cy + (outerRimR - 6) * Math.sin(rad);
                const x2 = cx + (outerRimR + 6) * Math.cos(rad);
                const y2 = cy + (outerRimR + 6) * Math.sin(rad);
                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                );
              })}
            </g>

            {/* ======================================================== */}
            {/* 3 STEERING SPOKES (Left, Right, Downward)                 */}
            {/* ======================================================== */}
            <g className="steering-spokes">
              {/* Left Horizontal Spoke */}
              <path
                d={`M ${cx - hubR} ${cy - 10} L ${leftSpokeEnd.x} ${cy - 6} L ${leftSpokeEnd.x} ${cy + 6} L ${cx - hubR} ${cy + 10} Z`}
                fill="url(#spokeMetal)"
                stroke="#0A1128"
                strokeWidth="1"
              />
              <line
                x1={cx - hubR}
                y1={cy}
                x2={leftSpokeEnd.x}
                y2={cy}
                stroke="#C99726"
                strokeWidth="2"
              />

              {/* Right Horizontal Spoke */}
              <path
                d={`M ${cx + hubR} ${cy - 10} L ${rightSpokeEnd.x} ${cy - 6} L ${rightSpokeEnd.x} ${cy + 6} L ${cx + hubR} ${cy + 10} Z`}
                fill="url(#spokeMetal)"
                stroke="#0A1128"
                strokeWidth="1"
              />
              <line
                x1={cx + hubR}
                y1={cy}
                x2={rightSpokeEnd.x}
                y2={cy}
                stroke="#C99726"
                strokeWidth="2"
              />

              {/* Bottom Center Vertical Spoke */}
              <path
                d={`M ${cx - 10} ${cy + hubR} L ${cx - 6} ${btmSpokeEnd.y} L ${cx + 6} ${btmSpokeEnd.y} L ${cx + 10} ${cy + hubR} Z`}
                fill="url(#spokeMetal)"
                stroke="#0A1128"
                strokeWidth="1"
              />
              <line
                x1={cx}
                y1={cy + hubR}
                x2={cx}
                y2={btmSpokeEnd.y}
                stroke="#C99726"
                strokeWidth="2"
              />

              {/* Spoke Weighting Cutouts (Race Wheel style) */}
              <circle cx={cx - (innerRimR + hubR) / 2} cy={cy} r="5" fill="#0A1128" />
              <circle cx={cx + (innerRimR + hubR) / 2} cy={cy} r="5" fill="#0A1128" />
              <circle cx={cx} cy={cy + (innerRimR + hubR) / 2} r="5" fill="#0A1128" />
            </g>

            {/* ======================================================== */}
            {/* CENTER STEERING BOSS / HUB (CW Code Weave Planet Core)   */}
            {/* ======================================================== */}
            <g className="steering-hub" filter="url(#cwpHelmShadow)">
              {/* Outer hub bezel */}
              <circle cx={cx} cy={cy} r={hubR + 6} fill="#0A1128" stroke="#C99726" strokeWidth="2.5" />
              {/* Inner metallic hub face */}
              <circle cx={cx} cy={cy} r={hubR} fill="#1E293B" stroke="#FFFFFF" strokeWidth="1" />
              {/* Inner gold ring */}
              <circle cx={cx} cy={cy} r={hubR - 6} fill="#0A1128" stroke="#C99726" strokeWidth="1.5" />

              {/* Monogram "CW" Code Weave Emblem */}
              <text
                x={cx}
                y={cy + 7}
                textAnchor="middle"
                fontSize={20 * Math.max(0.85, fullness)}
                fontWeight="900"
                fontFamily="'Space Grotesk', sans-serif"
                fill="#C99726"
                letterSpacing="1px"
              >
                CW
              </text>

              {/* Glowing center indicator dot */}
              <circle
                cx={cx}
                cy={cy}
                r="3"
                fill={brightCyan}
                opacity="0.9"
              />
            </g>
          </svg>
        </div>

        {/* Right Status & Action Column */}
        <div className="cwp-steering-status">
          <div className="cwp-status-pill">
            <span className="cwp-status-indicator-dot" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1128' }}>
                Full Course Autopilot Ready
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                MTN & Airtel MoMo, Stanbic & Centenary Bank
              </div>
            </div>
          </div>

          <div className="cwp-status-pill">
            <Icon icon="mdi:school" width="22" color="#C99726" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1128' }}>
                Mbarara Hands-On Tech Campus
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                AI, Laravel, Vite, Mobile & Cloud
              </div>
            </div>
          </div>

          {/* Action button in rectangular block shape */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('courses') || document.querySelector('.courses-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="cwp-steer-action-btn"
          >
            <Icon icon="mdi:compass-outline" width="18" />
            Navigate To Courses
          </button>
        </div>
      </div>
    </section>
  );
}

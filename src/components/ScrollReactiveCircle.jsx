import React, { useEffect, useState } from 'react';

/**
 * Helper to calculate SVG arc path string from center, radius, and angles (in degrees)
 */
function describeArc(cx, cy, r, startAngle, endAngle) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * ScrollReactiveCircle
 * Interactive segmented circle based on user reference:
 * - Top & Bottom arcs: Lime Green (#A3E635 / #84CC16)
 * - Left & Right arcs: Royal / Electric Blue (#1D70E2 / #0284C7)
 * - Outside & Inside lines: Concentric orbital lines that reduce when scrolling down
 *   and expand when scrolling up.
 * 
 * @param {string} size - CSS dimension e.g. "100%", "320px", etc.
 * @param {boolean} showFloatingIndicator - Whether to also show the floating bottom-right scroll badge
 */
export default function ScrollReactiveCircle({ size = '100%', showFloatingIndicator = true }) {
  const [scrollFraction, setScrollFraction] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = docHeight > 0 ? Math.min(Math.max(currentScrollY / docHeight, 0), 1) : 0;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollFraction(fraction);
          setIsScrollingDown(currentScrollY > lastScrollY);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial measure

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Geometry computation
  const cx = 160;
  const cy = 160;
  const mainR = 92;

  // Main 4 segmented arcs:
  // When scrollFraction is 0 (top): halfSpan is 38deg (total arc 76deg)
  // When scrollFraction is 1 (scrolled down): halfSpan contracts to 10deg (lines reduce)
  const mainHalfSpan = 38 - scrollFraction * 26;

  // Outside lines:
  // Radius contracts from 130 down to 108 as you scroll down
  // Arc span contracts from 34deg down to 6deg
  const outR = 130 - scrollFraction * 20;
  const outHalfSpan = Math.max(6, 34 - scrollFraction * 26);

  // Inside lines:
  // Radius contracts from 58 down to 40 as you scroll down
  // Arc span contracts from 30deg down to 5deg
  const inR = 58 - scrollFraction * 18;
  const inHalfSpan = Math.max(5, 30 - scrollFraction * 24);

  // Gentle rotation on scroll
  const rotationDeg = scrollFraction * 70;

  // Arcs angles
  // Top: centered at -90 deg
  const topMainArc = describeArc(cx, cy, mainR, -90 - mainHalfSpan, -90 + mainHalfSpan);
  // Bottom: centered at 90 deg
  const btmMainArc = describeArc(cx, cy, mainR, 90 - mainHalfSpan, 90 + mainHalfSpan);
  // Right: centered at 0 deg
  const rightMainArc = describeArc(cx, cy, mainR, -mainHalfSpan, mainHalfSpan);
  // Left: centered at 180 deg
  const leftMainArc = describeArc(cx, cy, mainR, 180 - mainHalfSpan, 180 + mainHalfSpan);

  // Outer segmented lines (4 orbital arcs)
  const topOutArc = describeArc(cx, cy, outR, -90 - outHalfSpan, -90 + outHalfSpan);
  const btmOutArc = describeArc(cx, cy, outR, 90 - outHalfSpan, 90 + outHalfSpan);
  const rightOutArc = describeArc(cx, cy, outR, -outHalfSpan, outHalfSpan);
  const leftOutArc = describeArc(cx, cy, outR, 180 - outHalfSpan, 180 + outHalfSpan);

  // Inner segmented lines (4 orbital arcs)
  const topInArc = describeArc(cx, cy, inR, -90 - inHalfSpan, -90 + inHalfSpan);
  const btmInArc = describeArc(cx, cy, inR, 90 - inHalfSpan, 90 + inHalfSpan);
  const rightInArc = describeArc(cx, cy, inR, -inHalfSpan, inHalfSpan);
  const leftInArc = describeArc(cx, cy, inR, 180 - inHalfSpan, 180 + inHalfSpan);

  const limeColor = '#A3E635'; // Reference Lime Green
  const blueColor = '#1D70E2'; // Reference Royal / Electric Blue
  const goldColor = '#D4AF37'; // System Gold Accent
  const cyanColor = '#22D3EE'; // System Cyan Accent

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="scroll-reactive-circle-wrapper" style={{ width: size, height: size, position: 'relative' }}>
      <svg
        viewBox="0 0 320 320"
        width="100%"
        height="100%"
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          transition: 'transform 0.15s ease-out',
          overflow: 'visible',
          display: 'block',
        }}
      >
        <defs>
          <filter id="glowLime" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* OUTSIDE LINES (Reduce on scroll down, expand on scroll up) */}
        {/* ======================================================== */}
        <g className="outside-lines" opacity={0.65 - scrollFraction * 0.35}>
          {/* Subtle Outer Guideline Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={outR}
            fill="none"
            stroke="rgba(34, 211, 238, 0.15)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          {/* Top Outer Line */}
          <path
            d={topOutArc}
            fill="none"
            stroke={limeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Bottom Outer Line */}
          <path
            d={btmOutArc}
            fill="none"
            stroke={limeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Right Outer Line */}
          <path
            d={rightOutArc}
            fill="none"
            stroke={cyanColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Left Outer Line */}
          <path
            d={leftOutArc}
            fill="none"
            stroke={cyanColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* ======================================================== */}
        {/* MAIN SEGMENTED CIRCLE (From user reference image)        */}
        {/* Top/Bottom: Lime Green (#A3E635)                         */}
        {/* Left/Right: Electric Blue (#1D70E2)                      */}
        {/* Stroke reduces as user scrolls down, expands on scroll up */}
        {/* ======================================================== */}
        <g className="main-segmented-circle">
          {/* Top Lime Arc */}
          <path
            d={topMainArc}
            fill="none"
            stroke={limeColor}
            strokeWidth="13"
            strokeLinecap="round"
            filter="url(#glowLime)"
          />
          {/* Bottom Lime Arc */}
          <path
            d={btmMainArc}
            fill="none"
            stroke={limeColor}
            strokeWidth="13"
            strokeLinecap="round"
            filter="url(#glowLime)"
          />
          {/* Right Blue Arc */}
          <path
            d={rightMainArc}
            fill="none"
            stroke={blueColor}
            strokeWidth="13"
            strokeLinecap="round"
            filter="url(#glowBlue)"
          />
          {/* Left Blue Arc */}
          <path
            d={leftMainArc}
            fill="none"
            stroke={blueColor}
            strokeWidth="13"
            strokeLinecap="round"
            filter="url(#glowBlue)"
          />
        </g>

        {/* ======================================================== */}
        {/* INSIDE LINES (Reduce on scroll down, expand on scroll up)  */}
        {/* ======================================================== */}
        <g className="inside-lines" opacity={0.75 - scrollFraction * 0.35}>
          {/* Subtle Inner Guideline Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={inR}
            fill="none"
            stroke="rgba(212, 175, 55, 0.2)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          {/* Top Inner Line */}
          <path
            d={topInArc}
            fill="none"
            stroke={goldColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Bottom Inner Line */}
          <path
            d={btmInArc}
            fill="none"
            stroke={goldColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Right Inner Line */}
          <path
            d={rightInArc}
            fill="none"
            stroke={blueColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Left Inner Line */}
          <path
            d={leftInArc}
            fill="none"
            stroke={blueColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Central Pulsing Tech Core */}
        <circle
          cx={cx}
          cy={cy}
          r={7 + (1 - scrollFraction) * 4}
          fill={scrollFraction > 0.5 ? cyanColor : goldColor}
          opacity="0.9"
        />
        <circle
          cx={cx}
          cy={cy}
          r={18 + (1 - scrollFraction) * 8}
          fill="none"
          stroke={goldColor}
          strokeWidth="1"
          opacity={0.3 + (1 - scrollFraction) * 0.4}
          strokeDasharray="3 3"
        />
      </svg>

      {/* Optional Floating Telemetry Scroll Widget */}
      {showFloatingIndicator && (
        <div
          className="floating-scroll-circle"
          onClick={scrollToTop}
          title="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(44, 24, 16, 0.18), 0 2px 8px rgba(34, 211, 238, 0.25)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9990,
            transform: `scale(${0.92 + scrollFraction * 0.16})`,
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
          }}
        >
          <svg viewBox="0 0 100 100" width="46" height="46" style={{ transform: `rotate(${rotationDeg}deg)` }}>
            {/* Miniature version of the segmented circle */}
            <path
              d={describeArc(50, 50, 36, -90 - mainHalfSpan, -90 + mainHalfSpan)}
              fill="none"
              stroke={limeColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={describeArc(50, 50, 36, 90 - mainHalfSpan, 90 + mainHalfSpan)}
              fill="none"
              stroke={limeColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={describeArc(50, 50, 36, -mainHalfSpan, mainHalfSpan)}
              fill="none"
              stroke={blueColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={describeArc(50, 50, 36, 180 - mainHalfSpan, 180 + mainHalfSpan)}
              fill="none"
              stroke={blueColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Center scroll percentage */}
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#2C1810"
              style={{ transform: `rotate(${-rotationDeg}deg)`, transformOrigin: '50px 50px' }}
            >
              {Math.round(scrollFraction * 100)}%
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}

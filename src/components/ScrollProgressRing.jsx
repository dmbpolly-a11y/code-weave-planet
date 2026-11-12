import React, { useState, useEffect } from 'react';

/**
 * Circular Scroll Progress Indicator & Scroll-to-Top Progress Ring
 * Keeps visible as the user scrolls on every page, filling up progressively
 * with a golden celestial glow and showing live scroll percentage or arrow.
 */
export default function ScrollProgressRing({
  size = 56,
  strokeWidth = 4.5,
  ringColor = '#C99726',
  trackColor = 'rgba(201, 151, 38, 0.18)',
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setScrollProgress(progress);
      // Keep visible as soon as the user scrolls past 20px
      setIsVisible(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ring fills UP as user scrolls down:
  // At top (0%): offset = circumference (empty)
  // At bottom (100%): offset = 0 (completely full ring)
  const strokeDashoffset = circumference * (1 - scrollProgress);
  const percentText = `${Math.round(scrollProgress * 100)}%`;

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Scroll to top. Page scrolled ${percentText}`}
      title={`Scroll to top (${percentText} scrolled)`}
      style={{
        position: 'fixed',
        bottom: '26px',
        right: '26px',
        width: `${size}px`,
        height: `${size}px`,
        padding: 0,
        border: 'none',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 6px 20px rgba(10, 17, 40, 0.18), 0 0 14px rgba(201, 151, 38, 0.35)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? (isHovered ? 'scale(1.1) translateY(-3px)' : 'scale(1) translateY(0)') : 'scale(0.8) translateY(12px)',
        transition: 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease',
        zIndex: 99999,
        outline: 'none',
      }}
    >
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}
      >
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Dynamic filled progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.12s linear',
            filter: 'drop-shadow(0 0 4px rgba(201, 151, 38, 0.6))'
          }}
        />
      </svg>

      {/* Center Icon or Percentage on Hover */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {isHovered ? (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#0A1128',
              fontFamily: "'Space Grotesk', monospace",
              letterSpacing: '-0.02em',
            }}
          >
            {percentText}
          </span>
        ) : (
          <svg
            width={size * 0.42}
            height={size * 0.42}
            viewBox="0 0 24 24"
            fill="none"
            stroke={ringColor}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        )}
      </div>
    </button>
  );
}

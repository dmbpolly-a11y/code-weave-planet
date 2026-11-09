import React, { useState, useEffect } from 'react';
import '../styles/planetLoader.css';

export default function PlanetLoader({ onLoaded, duration = 8000 }) {
  const [progress, setProgress] = useState(0);
  const [isBursting, setIsBursting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 30;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      // Trigger intense cosmic light burst at 88% (~7 seconds into the 8s load)
      if (pct >= 88 && !isBursting) {
        setIsBursting(true);
      }

      // Finish at 100% (8.0s)
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            if (onLoaded) onLoaded();
          }, 850);
        }, 350);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, isBursting, onLoaded]);

  const handleSkip = () => {
    setIsBursting(true);
    setTimeout(() => {
      setIsFinished(true);
      if (onLoaded) onLoaded();
    }, 400);
  };

  return (
    <div className={`planet-loader-overlay ${isFinished ? 'fade-out' : ''}`}>
      {/* Background stars & celestial nebula */}
      <div className="planet-stars-bg" />
      <div className="planet-nebula-glow" />

      {/* The Central Cosmic Planet System */}
      <div className="planet-system">
        {/* Orbital Rings */}
        <div className="planet-ring ring-secondary" />
        <div className="planet-ring ring-primary" />
        <div className="planet-ring ring-tertiary" />

        {/* Orbiting Tech Node */}
        <div className="orbiting-node" />

        {/* The Planet Sphere */}
        <div className="planet-sphere">
          <div className="planet-surface-waves" />
          <div className="planet-atmosphere" />
        </div>

        {/* 💥 THE INTENSE LIGHT BURST (Fires as it completes) */}
        <div className={`planet-light-burst ${isBursting ? 'active' : ''}`} />
        <div className={`planet-light-rays ${isBursting ? 'active' : ''}`} />
        <div className={`planet-shockwave ${isBursting ? 'active' : ''}`} />
      </div>

      {/* Brand & Loading Info */}
      <div className="planet-loader-info">
        <h1 className="planet-loader-title">Code Weave Planet</h1>
        <p className="planet-loader-subtitle">
          {progress < 25 && 'Initializing Cosmic Tech Universe...'}
          {progress >= 25 && progress < 50 && 'Aligning Digital Orbits & Skills...'}
          {progress >= 50 && progress < 75 && 'Weaving Careers into Reality...'}
          {progress >= 75 && progress < 90 && 'Charging Core Supernova...'}
          {progress >= 90 && 'Supernova Light Burst!'}
        </p>

        {/* Neon Progress Bar */}
        <div className="planet-progress-container">
          <div className="planet-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="planet-progress-text">{progress}%</div>

        <button onClick={handleSkip} className="planet-skip-btn" type="button">
          Skip Intro →
        </button>
      </div>
    </div>
  );
}

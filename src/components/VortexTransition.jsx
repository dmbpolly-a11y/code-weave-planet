import React, { useEffect, useState } from 'react';
import cwLogo from '../../public/images/Cwlogo.png';
import '../styles/vortex.css';

/**
 * VortexTransition
 * 6-Second cinematic 3D vortex entrance transition when the website starts.
 * 
 * @param {number} duration - Milliseconds to run (default 6000 = 6 seconds)
 * @param {function} onComplete - Callback when vortex finishes
 */
export default function VortexTransition({ duration = 6000, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Vortex Gateway...');
  const [warpFlash, setWarpFlash] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < 1500) {
        setStatusText('Initializing Vortex Gateway...');
      } else if (elapsed < 3000) {
        setStatusText('Weaving Digital Skills & Tutors...');
      } else if (elapsed < 4500) {
        setStatusText('Harmonizing AI & Web Architecture...');
      } else if (elapsed < 5500) {
        setStatusText('Synchronizing Mastery Spheres...');
      } else {
        setStatusText('Entering Code Weave Planet...');
      }

      if (elapsed >= duration - 400 && !warpFlash) {
        setWarpFlash(true);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsExiting(true);

        const endTimer = setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 500);

        return () => clearTimeout(endTimer);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onComplete, warpFlash]);

  const handleSkip = () => {
    setWarpFlash(true);
    setIsExiting(true);
    setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 300);
  };

  if (isDone) return null;

  return (
    <div className={`vortex-container ${isExiting ? 'vortex-exit' : ''}`} role="dialog" aria-modal="true">
      {/* Ambient Nebula Glow */}
      <div className="vortex-nebula" />

      {/* Warp Flash on Completion */}
      <div className={`vortex-warp-flash ${warpFlash ? 'vortex-warp-active' : ''}`} />

      {/* 3D Vortex Funnel Stage */}
      <div className="vortex-stage">
        {/* Concentric Rotating 3D Rings */}
        <div className="vortex-ring vortex-ring-1" />
        <div className="vortex-ring vortex-ring-2" />
        <div className="vortex-ring vortex-ring-3" />
        <div className="vortex-ring vortex-ring-4" />
        <div className="vortex-ring vortex-ring-5" />

        {/* Swirling Gravitational Conic Rays */}
        <div className="vortex-spiral-rays" />

        {/* Singularity Core with Glowing Emblem */}
        <div className="vortex-singularity">
          <img src={cwLogo} alt="Code Weave Planet" className="vortex-core-logo" />
        </div>
      </div>

      {/* Telemetry & Progress Display */}
      <div className="vortex-telemetry">
        <h1 className="vortex-brand-title">Code Weave Planet</h1>
        
        <div className="vortex-status-ticker">
          <span className="vortex-pulsing-dot" />
          <span>{statusText}</span>
        </div>

        <div className="vortex-progress-wrapper">
          <div className="vortex-progress-track">
            <div 
              className="vortex-progress-fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="vortex-progress-meta">
            <span>PORTAL CALIBRATION</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button 
        type="button" 
        onClick={handleSkip} 
        className="vortex-skip-btn"
        title="Skip intro to site"
      >
        Skip Intro ➔
      </button>
    </div>
  );
}

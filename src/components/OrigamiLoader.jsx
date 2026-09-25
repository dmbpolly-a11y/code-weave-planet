import React from 'react';
import '../styles/transitions.css';

/**
 * OrigamiLoader - 3D Origami paper-folding loading screen
 * Used during route transitions, auth checks, and data loading
 */
export default function OrigamiLoader({ text = 'Loading...' }) {
  return (
    <div className="origami-loading-screen" role="status" aria-live="polite">
      <div className="origami-stage">
        {/* Origami 3D folding geometric figure */}
        <div className="origami-cube">
          <div className="origami-face origami-top"></div>
          <div className="origami-face origami-bottom"></div>
          <div className="origami-face origami-left"></div>
          <div className="origami-face origami-right"></div>
          <div className="origami-face origami-front"></div>
          <div className="origami-face origami-back"></div>
        </div>
        
        {/* Origami geometric fold wings */}
        <div className="origami-bird">
          <div className="origami-wing origami-wing-left"></div>
          <div className="origami-wing origami-wing-right"></div>
          <div className="origami-body"></div>
        </div>
      </div>
      
      <p className="origami-loading-text">{text}</p>
      <div className="origami-loading-bar">
        <div className="origami-loading-progress"></div>
      </div>
    </div>
  );
}

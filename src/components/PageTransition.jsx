import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        animation: isVisible ? 'pageRipple 0.8s ease-in-out, pageOrigami 1s ease-in-out' : 'none',
        opacity: isVisible ? 1 : 0,
      }}
      dangerouslySetInnerHTML={{__html: `
        <style>
          @keyframes pageRipple {
            0% {
              clip-path: circle(0% at 50% 50%);
              opacity: 0;
            }
            100% {
              clip-path: circle(100% at 50% 50%);
              opacity: 1;
            }
          }
          @keyframes pageOrigami {
            0% {
              transform: perspective(1000px) rotateX(45deg) rotateY(-20deg);
              opacity: 0;
            }
            100% {
              transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
              opacity: 1;
            }
          }
        </style>
      `}}
    >
      {children}
    </div>
  );
}

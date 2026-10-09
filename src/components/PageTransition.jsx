import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
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
            transform: perspective(1000px) rotateX(20deg) rotateY(-10deg);
            opacity: 0;
          }
          100% {
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
      <div
        style={{
          animation: isVisible ? 'pageRipple 0.6s ease-in-out, pageOrigami 0.7s ease-in-out' : 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {children}
      </div>
    </>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import { SVGProps } from 'react';

interface AnimatedBackgroundProps {
  colors?: string[];
  className?: string;
}

export const AnimatedBackground = ({ 
  colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'],
  className = '' 
}: AnimatedBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set random positions for animation
    const setRandomPositions = () => {
      const root = document.documentElement;
      for (let i = 1; i <= 4; i++) {
        root.style.setProperty(`--tx-${i}`, `${Math.random() - 0.5}`);
        root.style.setProperty(`--ty-${i}`, `${Math.random() - 0.5}`);
      }
    };

    setRandomPositions();
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="absolute w-full h-full filter blur-3xl opacity-50">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          </filter>
        </defs>
        {colors.map((color, index) => {
          const circleProps: SVGProps<SVGCircleElement> = {
            key: index,
            fill: color,
            r: 50,
            className: `animate-blob${index + 1}`,
            style: {
              cx: `${Math.random() * 100}%`,
              cy: `${Math.random() * 100}%`,
            } as any // Using 'any' here because TypeScript doesn't recognize percentage strings for cx/cy
          };
          return <circle {...circleProps} />;
        })}
      </svg>
    </div>
  );
};
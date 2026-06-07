import React, { useEffect, useState, useRef } from 'react';

export default function GlowCircle() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate relative coordinates in percentage
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setTargetPos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Smooth damp animation loop
  useEffect(() => {
    let animationId: number;
    const updatePosition = () => {
      setMousePos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        // Ease with 0.08 scaling for fluid lagging effect
        const speed = 0.06;
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
      animationId = requestAnimationFrame(updatePosition);
    };
    animationId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationId);
  }, [targetPos]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950"
    >
      {/* Dynamic Cyber Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
      
      {/* Top subtle grid fading mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80"></div>
      
      {/* Light Radial Center Orb */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full bg-rust-500/10 blur-[120px] mix-blend-screen transition-transform duration-1000 ease-out"
        style={{
          top: '30%',
          left: '20%',
          transform: 'translate(-50%, -50%) scale(1.1)',
        }}
      ></div>

      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[140px] mix-blend-color-dodge transition-transform duration-[2000ms] ease-out"
        style={{
          bottom: '10%',
          right: '15%',
          transform: 'translate(50%, 50%) scale(0.9)',
        }}
      ></div>

      {/* Reactive cursor sphere */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-rust-600/15 blur-[100px] mix-blend-screen transition-all pointer-events-none"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>

      {/* Additional technological laser line or flare */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rust-500/30 to-transparent"></div>
    </div>
  );
}

import React, { useRef, useState } from 'react';

export const Tilt3D = ({
  children,
  maxTilt = 10,
  lift = 12,
  scaleOnHover = 1,
  className = '',
}) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * maxTilt;
    const rotateX = (0.5 - y) * 2 * maxTilt;

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-${lift * 0.3}px) scale(${scaleOnHover})`,
      transition: 'transform 0.08s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};
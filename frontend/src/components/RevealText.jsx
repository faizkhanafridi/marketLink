import React, { useEffect, useRef, useState } from 'react';

export const RevealText = ({
  children,
  as: Tag = 'div',
  type = 'words',
  className = '',
  delay = 0,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const text = typeof children === 'string' ? children : '';
  const words = type === 'words' ? text.split(' ') : [text];

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.5s ease ${delay + i * 0.05}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay + i * 0.05}s`,
            marginRight: '0.25em',
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
};
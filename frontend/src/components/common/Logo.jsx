import React from 'react';

const Logo = ({ size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Glass highlight */}
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="basketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F0" />
        </linearGradient>

        <linearGradient id="leafGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5D6A7" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>

        <linearGradient id="leafGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A62A" />
          <stop offset="100%" stopColor="#A6895C" />
        </linearGradient>

        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#0F3318"
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      {/* Solid theme-colored background — matches navbar brand tile */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="16"
        fill="#194d26"
        filter="url(#shadow)"
      />

      {/* Subtle glass highlight */}
      <rect x="3" y="3" width="58" height="30" rx="16" fill="url(#glass)" />

      {/* Basket rim */}
      <rect
        x="15"
        y="27"
        width="34"
        height="5.5"
        rx="2.75"
        fill="url(#basketGrad)"
      />

      {/* Basket body */}
      <path
        d="M18 32 L46 32 L43 46 C42.5 48.5 40.5 50 38.5 50 L25.5 50 C23.5 50 21.5 48.5 21 46 Z"
        fill="url(#basketGrad)"
      />

      {/* Weave lines — dark green to match brand */}
      <line x1="23" y1="35" x2="22" y2="47" stroke="#194D26" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="28" y1="35" x2="28" y2="48" stroke="#194D26" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="34" y1="35" x2="34" y2="48" stroke="#194D26" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="40" y1="35" x2="41" y2="47" stroke="#194D26" strokeWidth="1.3" strokeLinecap="round" />

      {/* Handle */}
      <path
        d="M23 27 C23 18, 41 18, 41 27"
        stroke="url(#basketGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Green leaf — matches site mint accent */}
      <path
        d="M27 27 C27 20, 34 15, 39 19 C43 23, 36 27, 30 27 Z"
        fill="url(#leafGreen)"
      />

      {/* Gold leaf — matches site gold accent */}
      <path
        d="M35 27 C37 20, 45 17, 48 21 C50 25, 42 28, 37 27 Z"
        fill="url(#leafGold)"
      />
    </svg>
  );
};

export default Logo;
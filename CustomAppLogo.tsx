import React from 'react';

interface CustomAppLogoProps {
  logoUrl?: string;
  appName?: string;
}

export default function CustomAppLogo({ logoUrl, appName }: CustomAppLogoProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={appName}
        className="w-24 h-24 mx-auto rounded-2xl object-cover"
      />
    );
  }
  return (
    <div className="w-24 h-24 mx-auto relative flex items-center justify-center select-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,122,0,0.25)]"
      >
        <defs>
          <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB000" />
            <stop offset="50%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#D45D00" />
          </linearGradient>
        </defs>
        <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="url(#hexGrad)" />
        <polygon
          points="50,11 84,31 84,69 50,89 16,69 16,31"
          fill="#FFFFFF"
          opacity="0.15"
        />
        <path
          d="M42,34 C42,28 47,26 50,32 C53,26 58,28 58,34 Z"
          fill="none"
          stroke="#221200"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M50,32 L50,42" stroke="#221200" strokeWidth="4.5" />
        <rect x="36" y="42" width="28" height="24" rx="3" fill="#2E1C0C" stroke="#221200" strokeWidth="4" />
        <rect x="36" y="49" width="28" height="5" fill="#FF9E2C" />
        <text
          x="50"
          y="60"
          fontFamily="sans-serif"
          fontWeight="900"
          fontSize="13"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          ₹
        </text>
      </svg>
    </div>
  );
}

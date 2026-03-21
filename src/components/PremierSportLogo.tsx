interface Props {
  className?: string;
}

export function PremierSportLogo({ className = 'w-10 h-10' }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ps-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      {/* Hexagon background */}
      <path d="M22 2L39.5 12V32L22 42L4.5 32V12Z" fill="url(#ps-grad)" />
      {/* Inner border */}
      <path
        d="M22 5.5L36.5 13.8V30.2L22 38.5L7.5 30.2V13.8Z"
        fill="none"
        stroke="white"
        strokeWidth="0.8"
        strokeOpacity="0.25"
      />
      {/* Diagonal accent */}
      <line
        x1="7.5" y1="30" x2="36.5" y2="14"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.12"
        strokeLinecap="round"
      />
      {/* PS text */}
      <text
        x="22"
        y="30"
        textAnchor="middle"
        fill="white"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="-0.5"
      >
        PS
      </text>
    </svg>
  );
}

import React from "react";

interface AxionLogoProps {
  height?: number | string; // Height of the SVG logo mark or whole component
  showText?: boolean;       // Show the AXION TECHNOLOGIES text
  logoSize?: number;        // Explicit size of the 2x2 grid icon (pixels)
  glow?: boolean;           // Add the subtle blue glow
  interactive?: boolean;    // Expand glow and scale on hover
  textClassName?: string;   // Extra styles for the text
  isDarkMode?: boolean;
}

export function AxionLogo({
  height,
  showText = true,
  logoSize = 40,
  glow = true,
  interactive = true,
  textClassName = "",
  isDarkMode = true,
}: AxionLogoProps) {
  // Determine actual height for responsive matching
  const actualHeight = height || logoSize;

  return (
    <div
      className={`flex items-center gap-3 select-none transition-all duration-250 cursor-pointer ${
        interactive
          ? "hover:scale-[1.03] active:scale-[0.98] group"
          : ""
      }`}
      style={{
        filter: glow
          ? "drop-shadow(0 0 15px rgba(77, 163, 255, 0.18))"
          : "none",
      }}
    >
      {/* 2x2 Rounded Grid Icon */}
      <svg
        width={logoSize}
        height={logoSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-250 ${
          interactive ? "group-hover:rotate-[2deg]" : ""
        }`}
      >
        <defs>
          {/* Top Left & Bottom Right: #4DA3FF Gradient */}
          <linearGradient id="axion-grad-light-blue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7ACCFF" />
            <stop offset="50%" stopColor="#4DA3FF" />
            <stop offset="100%" stopColor="#1F85FF" />
          </linearGradient>

          {/* Top Right & Bottom Left: #0D3B8F Gradient */}
          <linearGradient id="axion-grad-dark-blue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B5AE0" />
            <stop offset="50%" stopColor="#0D3B8F" />
            <stop offset="100%" stopColor="#06225B" />
          </linearGradient>

          {/* SVG Glow Filter (for internal SVG elements) */}
          <filter id="svg-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Top Left Block (AI Automation) */}
        <rect
          x="4"
          y="4"
          width="42"
          height="42"
          rx="12"
          fill="url(#axion-grad-light-blue)"
          className={`transition-all duration-300 ${
            interactive ? "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" : ""
          }`}
        />

        {/* Top Right Block (ERP & Enterprise Systems) */}
        <rect
          x="54"
          y="4"
          width="42"
          height="42"
          rx="12"
          fill="url(#axion-grad-dark-blue)"
          className={`transition-all duration-300 ${
            interactive ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : ""
          }`}
        />

        {/* Bottom Left Block (Software Engineering) */}
        <rect
          x="4"
          y="54"
          width="42"
          height="42"
          rx="12"
          fill="url(#axion-grad-dark-blue)"
          className={`transition-all duration-300 ${
            interactive ? "group-hover:-translate-x-0.5 group-hover:translate-y-0.5" : ""
          }`}
        />

        {/* Bottom Right Block (Digital Transformation) */}
        <rect
          x="54"
          y="54"
          width="42"
          height="42"
          rx="12"
          fill="url(#axion-grad-light-blue)"
          className={`transition-all duration-300 ${
            interactive ? "group-hover:translate-x-0.5 group-hover:translate-y-0.5" : ""
          }`}
        />
      </svg>

      {/* Typography block */}
      {showText && (
        <div className={`flex flex-col justify-center select-none ${textClassName}`}>
          <div className="flex items-baseline">
            <span
              className={`font-sans text-[17px] font-extrabold tracking-[0.06em] leading-none ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              AXION
            </span>
          </div>
          <span
            className={`font-sans text-[7.5px] font-semibold tracking-[0.34em] uppercase leading-none mt-1.5 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            TECHNOLOGIES
          </span>
        </div>
      )}
    </div>
  );
}

export default AxionLogo;

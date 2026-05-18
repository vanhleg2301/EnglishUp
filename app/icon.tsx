import { ImageResponse } from 'next/og'

export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 192,
        height: 192,
        display: 'flex',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: 44,
      }}
    >
      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speech bubble body */}
        <rect x="30" y="38" width="100" height="70" rx="18" fill="white" fillOpacity="0.95" />
        {/* Bubble tail */}
        <polygon points="44,108 36,132 68,108" fill="white" fillOpacity="0.95" />

        {/* Lines inside bubble */}
        <rect x="48" y="60" width="52" height="10" rx="5" fill="#7c3aed" />
        <rect x="48" y="78" width="36" height="10" rx="5" fill="#7c3aed" fillOpacity="0.45" />

        {/* Sparkle star — bottom right */}
        <g transform="translate(122, 110)">
          <path
            d="M18 0 L22 14 L36 18 L22 22 L18 36 L14 22 L0 18 L14 14 Z"
            fill="white"
            fillOpacity="0.92"
          />
        </g>
      </svg>
    </div>,
    { ...size }
  )
}

import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        display: 'flex',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: 40,
      }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speech bubble body */}
        <rect x="28" y="36" width="94" height="66" rx="17" fill="white" fillOpacity="0.95" />
        {/* Bubble tail */}
        <polygon points="42,102 34,124 64,102" fill="white" fillOpacity="0.95" />

        {/* Lines inside bubble */}
        <rect x="45" y="56" width="48" height="9" rx="4.5" fill="#7c3aed" />
        <rect x="45" y="73" width="34" height="9" rx="4.5" fill="#7c3aed" fillOpacity="0.45" />

        {/* Sparkle star — bottom right */}
        <g transform="translate(114, 102)">
          <path
            d="M17 0 L21 13 L34 17 L21 21 L17 34 L13 21 L0 17 L13 13 Z"
            fill="white"
            fillOpacity="0.92"
          />
        </g>
      </svg>
    </div>,
    { ...size }
  )
}

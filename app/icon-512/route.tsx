import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: 512,
        height: 512,
        display: 'flex',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: 116,
      }}
    >
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="80" y="100" width="264" height="184" rx="48" fill="white" fillOpacity="0.95" />
        <polygon points="116,284 96,352 180,284" fill="white" fillOpacity="0.95" />
        <rect x="128" y="160" width="140" height="27" rx="13" fill="#7c3aed" />
        <rect x="128" y="207" width="96" height="27" rx="13" fill="#7c3aed" fillOpacity="0.45" />
        <g transform="translate(328, 292)">
          <path
            d="M46 0 L57 37 L94 46 L57 57 L46 94 L35 57 L0 46 L35 37 Z"
            fill="white"
            fillOpacity="0.92"
          />
        </g>
      </svg>
    </div>,
    { width: 512, height: 512 }
  )
}

import { ImageResponse } from 'next/og'

export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20%',
        fontSize: 110,
        fontWeight: 700,
        color: 'white',
        fontFamily: 'sans-serif',
        letterSpacing: '-4px',
      }}
    >
      E
    </div>,
    { ...size }
  )
}

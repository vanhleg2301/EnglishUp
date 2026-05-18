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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: 44,
      }}
    >
      {/* Speech bubble */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 36,
          width: 88,
          height: 60,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingLeft: 14,
          gap: 8,
        }}
      >
        <div style={{ width: 44, height: 8, background: 'linear-gradient(90deg,#a78bfa,#818cf8)', borderRadius: 4 }} />
        <div style={{ width: 30, height: 8, background: 'rgba(167,139,250,0.5)', borderRadius: 4 }} />
      </div>
      {/* Bubble tail */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 94,
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '22px solid rgba(255,255,255,0.95)',
          borderTop: '16px solid rgba(255,255,255,0.95)',
        }}
      />
      {/* Star */}
      <div
        style={{
          position: 'absolute',
          right: 32,
          bottom: 34,
          fontSize: 54,
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1,
        }}
      >
        ✦
      </div>
    </div>,
    { ...size }
  )
}

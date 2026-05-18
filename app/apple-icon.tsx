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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: 40,
      }}
    >
      {/* Speech bubble */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 34,
          width: 82,
          height: 56,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingLeft: 13,
          gap: 8,
        }}
      >
        <div style={{ width: 40, height: 7, background: 'linear-gradient(90deg,#a78bfa,#818cf8)', borderRadius: 4 }} />
        <div style={{ width: 28, height: 7, background: 'rgba(167,139,250,0.5)', borderRadius: 4 }} />
      </div>
      {/* Bubble tail */}
      <div
        style={{
          position: 'absolute',
          left: 38,
          top: 88,
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '20px solid rgba(255,255,255,0.95)',
          borderTop: '14px solid rgba(255,255,255,0.95)',
        }}
      />
      {/* Star */}
      <div
        style={{
          position: 'absolute',
          right: 30,
          bottom: 32,
          fontSize: 50,
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

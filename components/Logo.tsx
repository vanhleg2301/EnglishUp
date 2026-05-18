import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
}

const sizes = {
  sm: { icon: 32, font: 12, sub: 10 },
  md: { icon: 36, font: 14, sub: 11 },
  lg: { icon: 44, font: 18, sub: 12 },
}

function LogoIcon({ px }: { px: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="44" height="44" rx="12" fill="url(#lg1)" />

      {/* Speech bubble — top left */}
      <rect x="8" y="9" width="20" height="14" rx="4" fill="white" fillOpacity="0.95" />
      <path d="M12 23 L10 27 L16 23" fill="white" fillOpacity="0.95" />

      {/* Three lines inside bubble */}
      <rect x="11" y="13" width="10" height="2" rx="1" fill="url(#lg2)" />
      <rect x="11" y="17" width="7" height="2" rx="1" fill="url(#lg2)" fillOpacity="0.6" />

      {/* Star / spark — bottom right */}
      <g transform="translate(26, 25)">
        <path
          d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5 Z"
          fill="white"
          fillOpacity="0.9"
        />
      </g>
    </svg>
  )
}

function LogoContent({ size = 'md', onClick }: { size?: LogoProps['size']; onClick?: () => void }) {
  const s = sizes[size!]
  return (
    <div className="flex items-center gap-2.5" onClick={onClick}>
      <LogoIcon px={s.icon} />
      <div>
        <p
          className="font-black leading-none tracking-tight text-white"
          style={{ fontSize: s.font }}
        >
          EnglishUp
        </p>
        <p
          className="text-violet-400 font-semibold leading-none mt-0.5"
          style={{ fontSize: s.sub }}
        >
          for developers
        </p>
      </div>
    </div>
  )
}

export default function Logo({ size = 'md', href, onClick }: LogoProps) {
  if (href) {
    return (
      <Link href={href} className="flex items-center">
        <LogoContent size={size} onClick={onClick} />
      </Link>
    )
  }
  return <LogoContent size={size} onClick={onClick} />
}

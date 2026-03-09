import { useState } from 'react'

interface PlaceholderImageProps {
  src: string
  fallbackGradient: string
  label: string
  type: 'background' | 'character'
  className?: string
  style?: React.CSSProperties
}

export function PlaceholderImage({
  src,
  fallbackGradient,
  label,
  type,
  className = '',
  style,
}: PlaceholderImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: fallbackGradient,
          ...style,
        }}
      >
        <div className="text-center opacity-60">
          {type === 'character' ? (
            <div className="flex flex-col items-center gap-2">
              {/* Character silhouette */}
              <svg
                width="120"
                height="200"
                viewBox="0 0 120 200"
                className="opacity-30"
              >
                <ellipse cx="60" cy="40" rx="30" ry="35" fill="currentColor" />
                <path
                  d="M20 85 Q60 70 100 85 L105 200 H15 Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm font-bold tracking-wider">{label}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-serif opacity-80">{label}</span>
              <span className="text-xs tracking-widest uppercase opacity-40">
                IMAGE PLACEHOLDER
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <img
        src={src}
        alt={label}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div
          className={`${className}`}
          style={{
            background: fallbackGradient,
            position: 'absolute',
            inset: 0,
            ...style,
          }}
        />
      )}
    </>
  )
}

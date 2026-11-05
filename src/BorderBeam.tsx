import React from 'react'

export interface BorderBeamProps {
  /** Size of the beam travel (percentage or pixel-based width) */
  size?: number
  /** Duration of the animation loop in seconds */
  duration?: number
  /** Delay before animation begins in seconds */
  delay?: number
  /** Start color of the metallic IA gradient */
  colorFrom?: string
  /** Middle color of the metallic IA gradient */
  colorMid?: string
  /** End color of the metallic IA gradient */
  colorTo?: string
  /** Border radius in px (defaults to inherit) */
  borderRadius?: number | string
  /** Beam thickness in px */
  borderWidth?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * BorderBeam component inspired by MagicUI / libraries.dev/beam.
 * Creates an animated luminous beam traveling seamlessly along the container's perimeter.
 * Styled with Nexo IA's signature metallic slate-silver gradient.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = '#455a64',
  colorMid = '#90a4ae',
  colorTo = '#546e7a',
  borderRadius = 'inherit',
  borderWidth = 1.5,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`border-beam-wrapper ${className}`}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius,
        overflow: 'hidden',
        zIndex: 2,
        ...style,
      }}
    >
      <div
        className="border-beam-animator"
        style={{
          position: 'absolute',
          aspectRatio: '1 / 1',
          width: `${size}px`,
          offsetPath: `rect(0 auto auto 0 round ${typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius})`,
          animation: `border-beam-travel ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorMid}, ${colorTo}, transparent)`,
          maskImage: 'radial-gradient(ellipse at center, white 40%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white 40%, transparent 75%)',
          transform: 'translate(-50%, -50%)',
          willChange: 'offset-distance',
        }}
      />
      {/* Static perimeter track border */}
      <div
        className="border-beam-track"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          border: `${borderWidth}px solid rgba(144, 164, 174, 0.22)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default BorderBeam

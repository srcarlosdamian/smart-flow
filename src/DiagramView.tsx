import { useRef, useState } from 'react'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  zoom: number
  onZoomChange?: (z: number) => void
}

export default function DiagramView({ theme, zoom, onZoomChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPan({
      x: dragStart.current.px + dx,
      y: dragStart.current.py + dy,
    })
  }

  const handlePointerUp = () => setDragging(false)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (!onZoomChange) return
    const delta = -e.deltaY * 0.08
    const nextZoom = Math.max(10, Math.min(200, Math.round(zoom + delta)))
    onZoomChange(nextZoom)
  }

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#081728' : '#f0f5fa'
  const gridColor = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.06)'
  const cyanStroke = isDark ? '#38bdf8' : '#0284c7'
  const orangeStroke = isDark ? '#fb923c' : '#ea580c'
  const textColor = isDark ? '#94a3b8' : '#475569'

  const scale = zoom / 50

  return (
    <div
      ref={containerRef}
      className="diagram-view"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        backgroundColor: bgColor,
        cursor: dragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <svg
        width="100%"
        height="100%"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <pattern id="diagram-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridColor} strokeWidth="1" />
          </pattern>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={cyanStroke} floodOpacity={isDark ? "0.6" : "0.2"} />
          </filter>
        </defs>

        {/* Blueprint Grid */}
        <rect width="100%" height="100%" fill="url(#diagram-grid)" />

        {/* Scaled & Panned Content */}
        <g
          transform={`translate(${containerRef.current ? containerRef.current.clientWidth / 2 + pan.x : 500 + pan.x}, ${containerRef.current ? containerRef.current.clientHeight / 2 + pan.y : 350 + pan.y}) scale(${scale})`}
        >
          {/* Main Topologic Branches (Schematic Galleries) */}
          {/* Secondary dashed connection lines */}
          <g stroke={orangeStroke} strokeWidth="2" strokeDasharray="5 4" fill="none" opacity={isDark ? "0.85" : "0.75"}>
            <path d="M -340,-120 L -240,-80 L -180,-140 L -90,-100 L -40,-60 L 20,-110 L 80,-80 L 150,-130" />
            <path d="M -220,10 L -140,50 L -60,20 L 40,70 L 120,40 L 210,90 L 290,60" />
            <path d="M -120,-80 L -80,0 L -20,-30 L 40,20 L 90,-40 L 160,0" />
            <path d="M 180,-140 L 250,-100 L 310,-150 L 380,-90 L 440,-130" />
            <path d="M 220,100 L 270,160 L 340,130 L 400,180" />
            <path d="M -380,80 L -300,140 L -220,90 L -150,150 L -80,110" />
          </g>

          {/* Primary Solid Cyan Loops & Ramps */}
          <g stroke={cyanStroke} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-cyan)">
            {/* Sector Noroeste: Galería Norte y Rampa N1 */}
            <path d="M -360,-140 C -320,-160 -260,-150 -220,-110 C -180,-70 -190,-10 -250,-20 C -290,-30 -340,-20 -360,-60 Z" />
            <path d="M -220,-110 L -120,-60 L -60,-80 L -20,-20 L -80,20 Z" />
            
            {/* Sector Central: Rampa Principal y Nivel 2 */}
            <path d="M -60,-80 C 0,-120 80,-110 140,-70 C 200,-30 180,30 120,40 C 60,50 0,20 -60,-80" />
            <path d="M 120,40 C 180,70 230,50 270,0 C 310,-50 270,-100 210,-90" />
            
            {/* Sector Noreste: Chancador y Frentes de voladura */}
            <path d="M 270,0 C 330,-20 390,10 410,70 C 430,130 370,170 310,150 C 250,130 240,60 270,0" />
            <path d="M 310,150 L 360,210 L 430,190 L 450,250 C 430,290 360,280 320,240 Z" />

            {/* Sector Sur: Nivel 4 y Refugio R-02 */}
            <path d="M -180,70 C -140,40 -70,60 -50,110 C -30,160 -90,200 -150,190 C -210,180 -220,100 -180,70" />
            <path d="M -50,110 L 30,150 L 100,120 L 140,180 C 110,220 50,210 0,180 Z" />
          </g>

          {/* Clean Schematic Line Architecture (Galerías, Rampas y Trazos) */}
        </g>
      </svg>

      {/* Floating 2D Diagram Legend & Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          display: 'flex',
          gap: 12,
          padding: '8px 14px',
          borderRadius: 12,
          background: isDark ? 'rgba(15, 25, 38, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          fontSize: 12,
          fontFamily: 'Titillium Web, sans-serif',
          color: textColor,
          pointerEvents: 'none',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 3, background: cyanStroke, borderRadius: 2 }} />
          Galerías y rampas principales
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 2, borderBottom: `2px dashed ${orangeStroke}` }} />
          Trazados auxiliares y chimeneas
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          Refugios mineros
        </span>
      </div>
    </div>
  )
}

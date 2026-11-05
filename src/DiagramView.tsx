import { useRef, useState } from 'react'
import { MapPin, X, LogIn } from 'lucide-react'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  zoom: number
  onZoomChange?: (z: number) => void
  onEnterInterior?: (roomId: string) => void
}

interface FacilityInfo {
  id: string
  name: string
  type: string
  ocupacion: string
  ocupacionRatio: number
  oxigeno: string
  comunicacion: string
  inspeccion: string
  roomId: string
  color: string
}

const FACILITIES: (FacilityInfo & { x: number; y: number })[] = [
  {
    id: 'refugio-05',
    name: 'Refugio R-05',
    type: 'Refugio',
    ocupacion: '5 / 12 personas',
    ocupacionRatio: 5 / 12,
    oxigeno: '67 h de autonomía',
    comunicacion: 'Enlace activo',
    inspeccion: '2026-07-15',
    roomId: 'refugio',
    x: 180,
    y: 10,
    color: '#10b981',
  },
  {
    id: 'bombeo',
    name: 'Sala de bombeo SB-01',
    type: 'Sala de bombeo',
    ocupacion: '3 / 4 bombas activas',
    ocupacionRatio: 3 / 4,
    oxigeno: 'Presión 12.4 bar',
    comunicacion: 'Enlace activo',
    inspeccion: '2026-08-01',
    roomId: 'bombeo',
    x: 240,
    y: 35,
    color: '#00b0ff',
  },
  {
    id: 'taller',
    name: 'Taller Mecánico TM-01',
    type: 'Taller',
    ocupacion: '4 técnicos activos',
    ocupacionRatio: 0.8,
    oxigeno: 'Ventilación 108%',
    comunicacion: 'Enlace activo',
    inspeccion: '2026-07-28',
    roomId: 'taller',
    x: -80,
    y: 5,
    color: '#f59e0b',
  },
  {
    id: 'chancador',
    name: 'Chancador CH-01',
    type: 'Chancador',
    ocupacion: 'Operativo continuo',
    ocupacionRatio: 0.9,
    oxigeno: 'Sensores OK',
    comunicacion: 'Enlace activo',
    inspeccion: '2026-07-20',
    roomId: 'chancador',
    x: 120,
    y: 110,
    color: '#ea580c',
  },
]

export default function DiagramView({ theme, zoom, onZoomChange, onEnterInterior }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: -40, y: -20 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const [selectedFacility, setSelectedFacility] = useState<FacilityInfo | null>(FACILITIES[0]) // default active or null

  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicking inside the modal, don't drag
    if ((e.target as HTMLElement).closest('.diagram-preview-card')) return
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
  const bgColor = isDark ? '#081728' : '#f8fafd'
  const gridColor = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.05)'
  const blueMain = isDark ? '#2563eb' : '#0066cc'
  const blueBranch = isDark ? '#38bdf8' : '#0284c7'
  const orangeChimney = isDark ? '#f97316' : '#ea580c'

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
          <pattern id="diagram-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={gridColor} strokeWidth="1" />
          </pattern>
        </defs>

        {/* Technical Coordinate Grid */}
        <rect width="100%" height="100%" fill="url(#diagram-grid)" />

        {/* Scaled & Panned Content */}
        <g
          transform={`translate(${containerRef.current ? containerRef.current.clientWidth / 2 + pan.x : 500 + pan.x}, ${containerRef.current ? containerRef.current.clientHeight / 2 + pan.y : 350 + pan.y}) scale(${scale})`}
        >
          {/* Detailed Branching Mine Geometry matching media_1793857860730_4c8c3e6a.jpg */}
          {/* Vertical Chimneys and Auxiliary Connections (Dashed Orange) */}
          <g stroke={orangeChimney} strokeWidth="2" strokeDasharray="6 4" fill="none" opacity={isDark ? "0.9" : "0.8"}>
            <path d="M -90,-80 L -80,5" />
            <path d="M 80,-120 L 95,-10" />
            <path d="M 170,-40 L 180,10" />
            <path d="M 130,50 L 120,110" />
            <path d="M 230,-10 L 240,35" />
            <path d="M -240,-30 L -210,40" />
            <path d="M 310,40 L 330,120" />
            <path d="M 50,140 L 60,200" />
          </g>

          {/* Deep Underground Mine Networks & Drifts (Darker Slate-Blue Underlay) */}
          <g stroke={blueMain} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            {/* West Vein & Deep Ramp West (Elongated gallery spine) */}
            <path d="M -480,-10 L -420,-15 L -350,-25 L -280,-20 L -210,15 L -150,30 L -90,45 L -20,60 L 50,70 L 140,80 L 230,65 L 320,50 L 410,20 L 480,-10" />
            <path d="M -440,-5 L -380,20 L -310,35 L -240,40 L -170,45 L -100,50 L -30,55 L 40,60 L 110,50 L 180,35 L 250,15 L 320,-5" />
            
            {/* North Ramp and Upper Level Galleries */}
            <path d="M -120,-240 L -115,-180 L -110,-120 L -105,-60 L -100,0 L -95,60 L -90,120 L -85,180" />
            <path d="M -220,-220 L -160,-210 L -120,-240 L -70,-230 L -20,-200 L 40,-220 L 90,-210 L 150,-230" />
            <path d="M -160,-170 L -115,-180 L -60,-165 L 10,-175 L 80,-160 L 140,-180" />
            <path d="M -200,-120 L -110,-120 L -30,-115 L 40,-130 L 110,-120 L 180,-135 L 250,-120" />
            
            {/* Dense Central Ore-Body Maze & Spiral Ramps (image 2 cluster) */}
            <path d="M -60,-40 C -80,-60 -110,-40 -100,-10 C -90,20 -50,30 -30,0 C -10,-30 -40,-50 -60,-40" />
            <path d="M 20,-30 C 0,-50 -30,-30 -20,0 C -10,30 30,40 50,10 C 70,-20 40,-40 20,-30" />
            <path d="M 90,-20 C 70,-40 40,-20 50,10 C 60,40 100,50 120,20 C 140,-10 110,-30 90,-20" />
            <path d="M 160,-10 C 140,-30 110,-10 120,20 C 130,50 170,60 190,30 C 210,0 180,-20 160,-10" />

            {/* South Stopes & Deep Production Levels */}
            <path d="M -10,140 C -40,120 -60,150 -40,180 C -20,210 20,200 40,170 C 60,140 20,120 -10,140" />
            <path d="M 70,160 C 40,140 20,170 40,200 C 60,230 100,220 120,190 C 140,160 100,140 70,160" />
            <path d="M 150,170 C 120,150 100,180 120,210 C 140,240 180,230 200,200 C 220,170 180,150 150,170" />
            <path d="M 220,150 C 190,130 170,160 190,190 C 210,220 250,210 270,180 C 290,150 250,130 220,150" />

            {/* East Exploration & Haulage Shaft Access */}
            <path d="M 180,-10 L 260,-40 L 330,-70 L 400,-110 L 460,-150" />
            <path d="M 240,35 L 310,30 L 380,50 L 450,40 L 510,70" />
            <path d="M 330,-70 L 350,0 L 380,50" />
            <path d="M 400,-110 L 420,-40 L 450,40" />
          </g>

          {/* Secondary Fine Blue Tunnels & Crosscuts */}
          <g stroke={blueBranch} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            <path d="M -410,-35 L -390,-60 L -360,-40 L -330,-65" />
            <path d="M -340,5 L -320,30 L -290,10 L -260,35" />
            <path d="M -260,-15 L -240,-45 L -200,-30 L -170,-55" />
            <path d="M -180,25 L -150,55 L -120,35 L -80,60" />
            <path d="M -70,-80 L -40,-95 L 0,-75 L 30,-90" />
            <path d="M 50,-80 L 80,-95 L 120,-75 L 150,-90" />
            <path d="M -20,80 L 10,105 L 50,85 L 80,110" />
            <path d="M 100,75 L 130,100 L 170,80 L 200,105" />
            <path d="M 270,-20 L 290,-50 L 330,-30 L 360,-55" />
            <path d="M 350,20 L 380,5 L 410,25 L 440,10" />
            <path d="M -50,180 L -30,220 L 10,200 L 40,235" />
            <path d="M 90,200 L 120,235 L 160,215 L 190,240" />
          </g>

          {/* Interactive Facility Landmarks (Shelters, Pumping Station, Workshop, Crusher) */}
          {FACILITIES.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id
            return (
              <g
                key={fac.id}
                transform={`translate(${fac.x}, ${fac.y})`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFacility(fac)
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Dashed Target Bounding Box matching image 2 & 4 */}
                <rect
                  x="-20"
                  y="-16"
                  width="40"
                  height="32"
                  rx="4"
                  fill={isSelected ? `${fac.color}22` : 'rgba(255,255,255,0.06)'}
                  stroke={fac.color}
                  strokeWidth={isSelected ? '2' : '1.5'}
                  strokeDasharray="4 3"
                />
                {/* Center Core Dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? '6' : '5'}
                  fill={fac.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Text Label */}
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill={isDark ? '#e2e8f0' : '#1e293b'}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="Titillium Web, sans-serif"
                  style={{ textShadow: isDark ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.9)' }}
                >
                  {fac.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Floating Preview Card matching media_1793857921272_9b39c102.png when facility is selected */}
      {selectedFacility && (
        <div
          className="diagram-preview-card glass"
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            width: 300,
            padding: '16px 18px',
            borderRadius: 14,
            background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)',
            border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            zIndex: 30,
            fontFamily: 'Titillium Web, sans-serif',
            userSelect: 'text',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header row with title and close icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-heading, #0f172a)' }}>
              {selectedFacility.name}
            </b>
            <button
              onClick={() => setSelectedFacility(null)}
              style={{
                background: 'transparent',
                border: 0,
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}
              title="Cerrar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Subtitle location badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <MapPin size={14} style={{ color: selectedFacility.color }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: selectedFacility.color }}>
              {selectedFacility.type}
            </span>
          </div>

          {/* Key-Value Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--muted)' }}>Ocupación</span>
                <b style={{ fontWeight: 600, color: 'var(--text-heading, #0f172a)' }}>
                  {selectedFacility.ocupacion}
                </b>
              </div>
              {/* Progress bar matching capture */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 3,
                  background: isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.round(selectedFacility.ocupacionRatio * 100)}%`,
                    height: '100%',
                    background: '#0891b2',
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Oxígeno</span>
              <b style={{ fontWeight: 600, color: 'var(--text-heading, #0f172a)' }}>
                {selectedFacility.oxigeno}
              </b>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Comunicación</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>
                {selectedFacility.comunicacion}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Última inspección</span>
              <b style={{ fontWeight: 600, color: 'var(--text-heading, #0f172a)' }}>
                {selectedFacility.inspeccion}
              </b>
            </div>
          </div>

          {/* Action button: Entrar */}
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <button
              onClick={() => onEnterInterior?.(selectedFacility.roomId)}
              style={{
                width: '100%',
                height: 38,
                borderRadius: 10,
                background: '#007791',
                color: '#ffffff',
                border: 0,
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 119, 145, 0.35)',
                transition: 'opacity .15s ease',
              }}
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
            <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginTop: 6 }}>
              Vista interior del lugar
            </small>
          </div>
        </div>
      )}

      {/* Floating Bottom-Left Pill matching media_1793857860730_4c8c3e6a.jpg */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 24,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 14px',
          borderRadius: 8,
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.88)',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          fontSize: 12,
          fontFamily: 'Titillium Web, sans-serif',
          color: isDark ? '#94a3b8' : '#64748b',
          pointerEvents: 'none',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 3, background: blueMain, borderRadius: 2 }} />
          Lugar
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 2, borderBottom: `2px dashed ${orangeChimney}` }} />
          Rampa
        </span>
        <span style={{ fontWeight: 600 }}>3749 trazos</span>
      </div>
    </div>
  )
}

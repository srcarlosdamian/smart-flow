import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  Globe,
  Sun,
  Moon,
  Crosshair,
  Plus,
  Minus,
  Check,
  CircleAlert,
  CirclePlus,
  CircleMinus,
  Trash,
  ZoomIn,
  ZoomOut,
  SquareArrowUp,
  Box,
  SquareArrowRight,
  SquareMousePointer,
  Scan,
  Upload,
  Ruler,
  Diamond,
  Cable,
  Lightbulb,
  Wrench,
  Undo2,
  Redo2,
  Settings,
  Layers,
  Layers2,
  Sparkles,
  ArrowLeft,
  ArrowUp,
  Palette,
  LandPlot,
  Grid3x3,
  Workflow,
  Fullscreen,
  Siren,
  Waypoints,
  UserRoundSearch,
  AudioWaveform,
  Wind,
  Flame,
  Zap,
  Wifi,
  MapPin,
  Activity,
  Users,
  Calendar,
  Play,
  Pause,
  ChevronsLeft,
  ChevronsRight,
  RotateCw,
  Bookmark,
  Repeat,
  SquareArrowOutUpRight,
  Target,
  X,
  Droplets,
} from 'lucide-react'
import { BitLogo } from './App'
import logoUrl from './assets/smartflow-logo.png'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  onBackToApp: () => void
  onNavigateToLocation?: (target: string) => void
}

type SectionTab = 'all' | 'toolbars' | 'dropdowns' | 'buttons' | 'badges' | 'ia' | 'cards'

const SECTIONS: { id: SectionTab; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'toolbars', label: 'Toolbars & Players' },
  { id: 'dropdowns', label: 'Dropdowns' },
  { id: 'buttons', label: 'Botones' },
  { id: 'badges', label: 'Badges & 3D' },
  { id: 'ia', label: 'Bit IA' },
  { id: 'cards', label: 'Cards & Listas' },
]

export default function DesignSystemView({ theme, onToggleTheme, onBackToApp, onNavigateToLocation }: Props) {
  const [activeTab, setActiveTab] = useState<SectionTab>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [filterOpen])

  // Interactive states for live toolbars & dropdowns
  const [activeSidebarTool, setActiveSidebarTool] = useState<string>('box')
  const [activeLevel, setActiveLevel] = useState<string>('L1')
  const [activeSurfaceMode, setActiveSurfaceMode] = useState<'sat' | 'map' | 'rel'>('sat')
  const [openDd, setOpenDd] = useState<string | null>('proj')
  const [selectedProj, setSelectedProj] = useState<string>('3D - Perspectiva')
  const [selectedCam, setSelectedCam] = useState<string>('Superior')
  const [selectedZoom, setSelectedZoom] = useState<number>(50)
  const [whatIfTarget, setWhatIfTarget] = useState<string>('Ventilador principal V-PH-01')
  const [shiftStart, setShiftStart] = useState<string>('06:00')
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({
    p1: true,
    p2: true,
    p3: false,
    p4: true,
  })

  const [activeDsSims, setActiveDsSims] = useState<string[]>(['Flujo de aire', 'Flujo de energía'])
  const toggleDsSim = (label: string) => {
    setActiveDsSims((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  // Interactive states for controls & players
  const [perfLevel, setPerfLevel] = useState<'Bajo' | 'Medio' | 'Alto'>('Medio')
  const [autoPerf, setAutoPerf] = useState<boolean>(true)
  const [densityVal, setDensityVal] = useState<number>(2)
  const [whatIfChecks, setWhatIfChecks] = useState({ carga: true, vent: true, dilucion: false })
  const [auxilioAttended, setAuxilioAttended] = useState<boolean>(false)
  const [auxilioTab, setAuxilioTab] = useState<'sin_cerrar' | 'resueltas'>('sin_cerrar')
  const [selectedPump, setSelectedPump] = useState<string>('BA-04')
  const [playerPlaying, setPlayerPlaying] = useState<boolean>(false)
  const [playerSpeed, setPlayerSpeed] = useState<string>('1x')
  const [playerSev, setPlayerSev] = useState<string>('Crítico')
  const [playerBookmarked, setPlayerBookmarked] = useState<boolean>(true)
  const [playerLoop, setPlayerLoop] = useState<boolean>(false)
  const [whatIfPlaying, setWhatIfPlaying] = useState<boolean>(false)
  const [whatIfSlider, setWhatIfSlider] = useState<number>(15)

  // Slider speed state
  const [beamSpeed, setBeamSpeed] = useState<number>(8)

  // Editable state for Bit IA Simulation Result Finding (Live Editor)
  const [dsFindingTitle, setDsFindingTitle] = useState('Ahorro de MXN 2.18 M por mes (35 %)')
  const [dsFindingBody, setDsFindingBody] = useState(
    'El costo cae de MXN 6.23 M a MXN 4.04 M. VOD por sí solo aporta MXN 1.23 M; la nueva programación añade MXN 957 k, principalmente al reducir la demanda en horario punta de 3,649 kW a 692 kW.'
  )
  const [dsFindingCategory, setDsFindingCategory] = useState<'opportunity' | 'context'>('opportunity')
  const [dsFindingSubCat, setDsFindingSubCat] = useState('Energía y costo')
  const [dsFindingConfidence, setDsFindingConfidence] = useState(82)

  const isLight = theme === 'light'

  // Exact background colors & technical grid from Scene3D.tsx PALETTE
  const pageBgColor = isLight ? '#dfe7ef' : '#0a1c30'
  const gridFineColor = isLight ? 'rgba(194, 205, 217, 0.45)' : 'rgba(13, 40, 66, 0.55)'
  const gridCoarseColor = isLight ? 'rgba(176, 190, 205, 0.65)' : 'rgba(7, 23, 40, 0.8)'

  const cardSurfaceStyle: React.CSSProperties = {
    padding: 20,
    borderRadius: 16,
    position: 'relative',
  }

  const labelTagStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  }

  const codePillStyle: React.CSSProperties = {
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '2px 7px',
    borderRadius: 5,
    background: isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.08)',
    color: isLight ? '#334155' : '#cbd5e1',
    border: '1px solid var(--line)',
  }

  return (
    <div
      className="ds-page app"
      data-theme={theme}
      style={{
        height: '100vh',
        width: '100vw',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: pageBgColor,
        backgroundImage: `
          linear-gradient(to right, ${gridFineColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridFineColor} 1px, transparent 1px),
          linear-gradient(to right, ${gridCoarseColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridCoarseColor} 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px, 28px 28px, 140px 140px, 140px 140px',
        color: 'var(--text)',
        position: 'relative',
      }}
    >
      {/* ==================================================================== */}
      {/* STICKY DESIGN SYSTEM HEADER                                          */}
      {/* ==================================================================== */}
      <header
        className="glass"
        style={{
          position: 'sticky',
          top: 8,
          margin: '8px 16px 0 16px',
          zIndex: 200,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 18px',
          minHeight: 52,
          boxSizing: 'border-box',
          gap: 16,
        }}
      >
        {/* Left: Back button + clean title "Sistema de Diseño" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="user-top-back-btn no-border"
            onClick={onBackToApp}
            title="Volver a SmartFlow"
            aria-label="Volver a SmartFlow"
            style={{ width: 36, height: 36 }}
          >
            <ChevronLeft size={18} />
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text)', whiteSpace: 'nowrap' }}>
            Sistema de Diseño
          </h1>
        </div>

        {/* Right: Section Filter Dropdown + Dark/Light toggle + Ir a la Mina CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Section Dropdown */}
          <div ref={filterRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={`dd-trigger ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen((prev) => !prev)}
              style={{ minWidth: 160, height: 36, padding: '0 12px' }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {SECTIONS.find((s) => s.id === activeTab)?.label || 'Todo'}
              </span>
              <ChevronDown
                size={14}
                style={{
                  transform: filterOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.18s ease',
                }}
              />
            </button>

            {filterOpen && (
              <div
                className="dd-menu glass"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  minWidth: 200,
                  zIndex: 300,
                }}
              >
                <div className="dd-group-title">Sección</div>
                {SECTIONS.map((sec) => {
                  const isSel = activeTab === sec.id
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      className="dd-item"
                      onClick={() => {
                        setActiveTab(sec.id)
                        setFilterOpen(false)
                      }}
                      style={{
                        fontWeight: isSel ? 600 : 400,
                        background: isSel ? 'var(--hover-bg)' : 'transparent',
                      }}
                    >
                      <span>{sec.label}</span>
                      {isSel && <Check size={14} className="dd-check" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle Button next to Dropdown */}
          <button
            type="button"
            className="user-top-back-btn no-border"
            onClick={onToggleTheme}
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            style={{ width: 36, height: 36 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Return to Mine */}
          <button
            type="button"
            className="cta no-shadow"
            onClick={onBackToApp}
            style={{ height: 36, padding: '0 14px', fontSize: 13 }}
          >
            Ir a la Mina
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CATALOG CONTAINER                                               */}
      {/* ==================================================================== */}
      <main
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '28px 20px 96px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
        }}
      >
        {/* ================================================================== */}
        {/* 1. REAL TOOL-BARS, FLOATING SIDEBARS & TIMELINE PLAYERS            */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'toolbars') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Layers size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  1. Toolbars, Barras de Navegación & Reproductores (Exactos del Visor)
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Renderizados con las mismas clases (<code>.glass.topbar</code>, <code>.glass.sidebar</code>, <code>.user-detail-topbar</code>, <code>.recorrido-player</code>, <code>.whatif-simulation-player</code>) y la misma transparencia, borde lineal y <code>backdrop-filter: blur(24px) saturate(160%)</code>.
              </p>
            </div>

            {/* 1.1 Main Topbar (.glass.topbar) */}
            <div className="glass" style={cardSurfaceStyle}>
              <div style={labelTagStyle}>
                <span>1.1 BARRA SUPERIOR PRINCIPAL — .glass.topbar (Altura 56px, Iconos 20px, Logo con hover Back)</span>
                <span style={codePillStyle}>.glass.topbar</span>
              </div>
              <div style={{ position: 'relative', height: 56, width: '100%' }}>
                <header
                  className="glass topbar"
                  style={{ position: 'relative', top: 0, left: 0, right: 0, width: '100%' }}
                >
                  <button className="logo-btn" aria-label="Volver" title="Pasa el cursor para ver el estado Volver">
                    <img src={logoUrl} alt="SmartFlow" className="logo-img" />
                    <span className="logo-back">
                      <ArrowLeft size={18} />
                    </span>
                  </button>

                  <div className="top-actions">
                    <button aria-label="Buscar" title="Buscar (Ctrl + K)">
                      <Search size={20} />
                    </button>
                    <button aria-label="Notificaciones" title="Tableros de comandos">
                      <Bell size={20} />
                    </button>
                    <button aria-label="Idioma" title="Servicios Digitales de Mina">
                      <Globe size={20} />
                    </button>
                    <button aria-label="Cambiar tema" onClick={onToggleTheme} title="Alternar modo claro / oscuro">
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button aria-label="Sistema de diseño" title="Sistema de Diseño">
                      <Palette size={20} />
                    </button>
                    <button className="avatar" title="Perfil de operador">
                      DS
                    </button>
                  </div>
                </header>
              </div>
            </div>

            {/* 1.2 Left Vertical Sidebar (.glass.sidebar) + Levels + Surface Switch + Sticky Detail Topbars */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(300px, 1fr) minmax(320px, 1fr)',
                gap: 20,
                alignItems: 'start',
              }}
            >
              {/* Left Vertical Floating Sidebar (.glass.sidebar) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 210 }}>
                <div style={{ ...labelTagStyle, width: '100%' }}>
                  <span>1.2 TOOLBAR IZQUIERDO</span>
                  <span style={codePillStyle}>.glass.sidebar</span>
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '0 0 12px 0', textAlign: 'center' }}>
                  40px ancho · 6 grupos con <code>&lt;hr /&gt;</code> · Iconos 18px en botones <code>30×30px</code>. Haz clic para activar:
                </p>

                <nav
                  className="glass sidebar"
                  style={{ position: 'relative', top: 'auto', left: 'auto', zIndex: 1 }}
                >
                  {/* Group 1: Zoom In / Zoom Out */}
                  <button
                    className={`icon-btn ${activeSidebarTool === 'zoom-in' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('zoom-in')}
                    title="Acercar vista"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'zoom-out' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('zoom-out')}
                    title="Alejar vista"
                  >
                    <ZoomOut size={18} />
                  </button>

                  <hr />

                  {/* Group 2: Camera & Selection Navigation */}
                  <button
                    className={`icon-btn ${activeSidebarTool === 'level-up' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('level-up')}
                    title="Nivel superior"
                  >
                    <SquareArrowUp size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'box' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('box')}
                    title="3D Perspectiva"
                  >
                    <Box size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'shift' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('shift')}
                    title="Vista lateral"
                  >
                    <SquareArrowRight size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'select' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('select')}
                    title="Selección de área"
                  >
                    <SquareMousePointer size={18} />
                  </button>

                  <hr />

                  {/* Group 3: Frame / Scan */}
                  <button
                    className={`icon-btn ${activeSidebarTool === 'fit' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('fit')}
                    title="Ajustar todo"
                  >
                    <Scan size={18} />
                  </button>

                  <hr />

                  {/* Group 4: Upload */}
                  <button
                    className={`icon-btn ${activeSidebarTool === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('upload')}
                    title="Cargar modelo"
                  >
                    <Upload size={18} />
                  </button>

                  <hr />

                  {/* Group 5: Measurement & Engineering Tools */}
                  <button
                    className={`icon-btn ${activeSidebarTool === 'ruler' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('ruler')}
                    title="Medición"
                  >
                    <Ruler size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'area' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('area')}
                    title="Área / Polígono"
                  >
                    <Diamond size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'cable' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('cable')}
                    title="Cableado y redes"
                  >
                    <Cable size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'light' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('light')}
                    title="Iluminación"
                  >
                    <Lightbulb size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'wrench' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('wrench')}
                    title="Ajustes y herramientas"
                  >
                    <Wrench size={18} />
                  </button>

                  <hr />

                  {/* Group 6: History Undo / Redo */}
                  <button
                    className={`icon-btn ${activeSidebarTool === 'undo' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('undo')}
                    title="Deshacer"
                  >
                    <Undo2 size={18} />
                  </button>
                  <button
                    className={`icon-btn ${activeSidebarTool === 'redo' ? 'active' : ''}`}
                    onClick={() => setActiveSidebarTool('redo')}
                    title="Rehacer"
                  >
                    <Redo2 size={18} />
                  </button>
                </nav>
              </div>

              {/* 1.3 Sticky Sub-headers (.user-detail-topbar) & Section Headers */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div style={labelTagStyle}>
                    <span>1.3 SUB-HEADERS STICKY DE DETALLE (UNIFICADO CON BÚSQUEDA)</span>
                    <span style={codePillStyle}>.user-detail-topbar</span>
                  </div>
                  <div>
                    {/* Componente Canónico Unificado: Siempre con Botón de Buscar y Back con fondo */}
                    <div className="user-detail-topbar" style={{ position: 'relative', margin: 0, width: '100%', top: 0, borderRadius: 10 }}>
                      <button className="user-top-back-btn" title="Volver">
                        <ChevronLeft size={18} />
                      </button>
                      <div className="user-top-crumb">
                        <span className="crumb-prefix">Inicio / </span>
                        <span className="crumb-name"><b>Victor Navarro</b></span>
                      </div>
                      <button className="user-top-search-btn" title="Buscar">
                        <Search size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordion Section Headers (.section-head) */}
                <div>
                  <div style={labelTagStyle}>
                    <span>CABECERAS DE SECCIÓN DEL PANEL DERECHO</span>
                    <span style={codePillStyle}>.section-head</span>
                  </div>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '0 8px' }}>
                    {/* Global Search Row */}
                    <div className="search" style={{ cursor: 'pointer' }}>
                      <span>Buscar</span>
                      <small>Ctrl + K</small>
                      <Search size={14} />
                    </div>
                    {/* Active section with Trash + Plus + Chevron */}
                    <div className="section">
                      <div className="section-head">
                        <span>Tracking (Activo)</span>
                        <div className="section-head-actions">
                          <button className="section-action-btn" title="Eliminar todos">
                            <Trash size={15} />
                          </button>
                          <button className="section-action-btn" title="Agregar tracking">
                            <CirclePlus size={16} />
                          </button>
                          <button className="accordion-chevron-btn" title="Contraer">
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Disabled section when empty */}
                    <div className="section">
                      <div className="section-head disabled-accordion">
                        <span>Simulaciones (Vacío / Deshabilitado)</span>
                        <div className="section-head-actions">
                          <button className="section-action-btn" title="Agregar simulación">
                            <CirclePlus size={16} />
                          </button>
                          <button className="accordion-chevron-btn disabled" disabled title="Sin simulaciones">
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.4 Levels Selector (.glass.levels) & Surface Toolbars */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div style={labelTagStyle}>
                    <span>1.4 SELECTOR DE NIVELES & SUPERFICIE</span>
                    <span style={codePillStyle}>.glass.levels</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <ul
                      className="glass levels"
                      style={{ position: 'relative', left: 'auto', bottom: 'auto', margin: 0 }}
                    >
                      {[
                        ['L1', 'General'],
                        ['L2', 'Sector'],
                        ['L3', 'Zona'],
                        ['L4', 'Equipo'],
                        ['L5', 'Interior'],
                      ].map(([code, name]) => (
                        <li
                          key={code}
                          className={activeLevel === code ? 'on' : ''}
                          onClick={() => setActiveLevel(code)}
                        >
                          <b>{code}</b> {name}
                        </li>
                      ))}
                    </ul>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                          Conmutador Vista Superficie (<code>.surface-bottom-switch</code>)
                        </small>
                        <div
                          className="surface-bottom-switch"
                          style={{ position: 'relative', bottom: 'auto', left: 'auto', width: 'fit-content' }}
                        >
                          {(
                            [
                              ['sat', 'Satélite'],
                              ['map', 'Mapa'],
                              ['rel', 'Relieve'],
                            ] as const
                          ).map(([k, lbl]) => (
                            <button
                              key={k}
                              className={`surface-switch-btn ${activeSurfaceMode === k ? 'active' : ''}`}
                              onClick={() => setActiveSurfaceMode(k)}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                          Barra de Estado Inferior (<code>.ableton-status-bar</code>)
                        </small>
                        <div
                          className="ableton-status-bar"
                          style={{ position: 'relative', borderRadius: 6, border: '1px solid var(--status-bar-border)' }}
                        >
                          <div className="ableton-status-content">
                            <span className="ableton-status-title">Vista:</span>
                            <span className="ableton-status-desc">
                              Permite alternar las perspectivas 3D/2D del gemelo digital.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1.5 Floating Timeline Players (.recorrido-player & .whatif-simulation-player) */}
            <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={labelTagStyle}>
                <span>
                  1.5 REPRODUCTORES DE LÍNEA DE TIEMPO (HOMOLOGADOS &amp; NEUTROS)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={codePillStyle}>.recorrido-player &amp; .whatif-simulation-player</span>
                  {onNavigateToLocation && (
                    <button
                      className="ds-open-app-btn"
                      onClick={() => onNavigateToLocation('recorrido-player')}
                      title="Abrir reproductor en SmartFlow"
                    >
                      <SquareArrowOutUpRight size={12} />
                      <span>Abrir en app</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Recorrido Player */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div
                  className="glass recorrido-player"
                  style={{
                    position: 'relative',
                    bottom: 'auto',
                    left: 'auto',
                    transform: 'none',
                    maxWidth: '100%',
                  }}
                >
                  <div className="player-row-top">
                    <div className="player-chips-left">
                      <div className="player-area-chip interior">
                        <SquareArrowOutUpRight size={14} className="chip-icon" />
                        <span className="chip-label">Interior</span>
                        <span className="chip-count">4</span>
                      </div>
                      <div className="player-area-chip superficie">
                        <SquareArrowOutUpRight size={14} className="chip-icon" />
                        <span className="chip-label">Superficie</span>
                        <span className="chip-count">2</span>
                      </div>
                    </div>

                    <div className="player-events-center">110 EVENTOS</div>

                    <div className="player-severity-pills">
                      {(['Informativo', 'Aviso', 'Grave', 'Crítico'] as const).map((sev) => (
                        <button
                          key={sev}
                          className={`player-sev-pill ${playerSev === sev ? 'active' : ''}`}
                          onClick={() => setPlayerSev(sev)}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="player-controls-row">
                    <div className="player-playback-group">
                      <button
                        className="player-ctrl-btn"
                        onClick={() => setPlayerPlaying((p) => !p)}
                        title={playerPlaying ? 'Pausar' : 'Reproducir'}
                      >
                        {playerPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button className="player-ctrl-btn" title="Retroceso rápido (30s)">
                        <ChevronsLeft size={18} />
                      </button>
                      <button className="player-ctrl-btn" title="Paso anterior (5s)">
                        <ChevronLeft size={18} />
                      </button>
                      <button className="player-ctrl-btn" title="Paso siguiente (5s)">
                        <ChevronRight size={18} />
                      </button>
                      <button className="player-ctrl-btn" title="Avance rápido (30s)">
                        <ChevronsRight size={18} />
                      </button>
                      <button className="player-ctrl-btn" title="Reiniciar">
                        <RotateCw size={17} />
                      </button>
                    </div>

                    <div className="player-speed-selector">
                      {(['0.5x', '1x', '2x', '4x', '8x'] as const).map((spd) => (
                        <button
                          key={spd}
                          className={`player-speed-btn ${playerSpeed === spd ? 'active' : ''}`}
                          onClick={() => setPlayerSpeed(spd)}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>

                    <div className="player-right-group">
                      <button
                        className={`player-action-icon-btn ${playerBookmarked ? 'active' : ''}`}
                        onClick={() => setPlayerBookmarked((v) => !v)}
                        title="Guardar marcador"
                      >
                        <Bookmark size={18} />
                      </button>
                      <button
                        className={`player-action-icon-btn ${playerLoop ? 'active' : ''}`}
                        onClick={() => setPlayerLoop((v) => !v)}
                        title="Repetir ciclo"
                      >
                        <Repeat size={18} />
                      </button>
                      <span className="player-time-display">06:15</span>
                    </div>
                  </div>

                  <div className="player-dots-track">
                    {[
                      '#0288d1',
                      '#0288d1',
                      '#f59e0b',
                      '#0288d1',
                      '#ef4444',
                      '#0288d1',
                      '#f59e0b',
                      '#10b981',
                      '#ef4444',
                      '#0288d1',
                    ].map((col, idx) => (
                      <span key={idx} className="player-event-dot" style={{ background: col }} />
                    ))}
                  </div>

                  <div className="player-seekbar-wrap">
                    <div className="player-seekbar-bg">
                      <div className="player-seekbar-fill" style={{ width: '38%' }} />
                      <div className="player-seekbar-thumb" style={{ left: '38%' }} />
                    </div>
                  </div>

                  <div className="player-time-footer">
                    <span className="time-footer-left">INICIO 06:00</span>
                    <span className="time-footer-center">TURNO A · RECORRIDO ACTIVO</span>
                    <span className="time-footer-right">FIN 18:00</span>
                  </div>
                </div>
              </div>

              {/* What-If Simulation Player */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className="whatif-simulation-player"
                  style={{
                    position: 'relative',
                    bottom: 'auto',
                    left: 'auto',
                    transform: 'none',
                    maxWidth: '100%',
                  }}
                >
                  <div className="whatif-player-top">
                    <div className="whatif-player-controls">
                      <button
                        className="whatif-player-btn"
                        onClick={() => setWhatIfPlaying((p) => !p)}
                        title="Reproducir / Pausar"
                      >
                        {whatIfPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        className="whatif-player-btn"
                        onClick={() => setWhatIfSlider(0)}
                        title="Reiniciar"
                      >
                        <RotateCw size={15} />
                      </button>
                      <span className="whatif-player-title">Simulación de impacto</span>
                    </div>
                    <span className="whatif-player-time">
                      {String(whatIfSlider).padStart(2, '0')}:00 / 30:00
                    </span>
                  </div>

                  <div className="whatif-event-dots-track">
                    {[15, 35, 62, 85].map((pct) => (
                      <span key={pct} className="whatif-event-dot" style={{ left: `${pct}%` }} />
                    ))}
                  </div>

                  <div
                    className="player-seekbar-wrap"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                      setWhatIfSlider(Math.round(pct * 30))
                    }}
                  >
                    <div className="player-seekbar-bg">
                      <div
                        className="player-seekbar-fill"
                        style={{ width: `${(whatIfSlider / 30) * 100}%` }}
                      />
                      <div
                        className="player-seekbar-thumb"
                        style={{ left: `${(whatIfSlider / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="whatif-player-footer">
                    <div className="row gap-3">
                      <div className="whatif-legend-item">
                        <span className="whatif-legend-dot blue" />
                        <span>Caudal sin cambio</span>
                      </div>
                      <div className="whatif-legend-item">
                        <span className="whatif-legend-dot red" />
                        <span>Pérdida de caudal</span>
                      </div>
                    </div>
                    <span>Horizonte: 30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 2. INTERACTIVE DROPDOWNS & POPOVER MENUS (Exact from App.tsx)      */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'dropdowns') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ChevronDown size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  2. Interacciones de Dropdowns & Popovers en Vivo (Exactos de App.tsx)
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Haz clic en cualquier disparador (<code>.dd-trigger</code>, <code>.section-action-btn</code>) para abrir/cerrar su menú flotante real (<code>.dd-menu</code>, <code>.zoom-menu</code>, <code>.track-add-menu</code>, <code>.sim-add-menu</code>, <code>.personal-checklist-menu</code>).
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 20,
                alignItems: 'start',
              }}
            >
              {/* 2.1 Projection & Camera + Zoom Dropdowns */}
              <div className="glass" style={{ ...cardSurfaceStyle, minHeight: 410 }}>
                <div style={labelTagStyle}>
                  <span>2.1 MODO DE VISUALIZACIÓN (PROYECCIÓN / ZOOM)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.dd-trigger + .dd-menu</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('dropdown-3d')}
                        title="Abrir menú de proyección en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="vis-controls" style={{ padding: 0, position: 'relative' }}>
                  <div className="row">
                    <button
                      className={`dd-trigger grow ${openDd === 'proj' ? 'active' : ''}`}
                      onClick={() => setOpenDd(openDd === 'proj' ? null : 'proj')}
                    >
                      <span>{selectedProj}</span>
                      <ChevronDown size={16} />
                    </button>

                    <button
                      className={`dd-trigger zoom-btn ${openDd === 'zoom' ? 'active' : ''}`}
                      onClick={() => setOpenDd(openDd === 'zoom' ? null : 'zoom')}
                    >
                      <span>{selectedZoom} %</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {/* Projection & Camera Menu */}
                  {openDd === 'proj' && (
                    <div className="dd-menu" style={{ position: 'relative', top: 8 }}>
                      <div className="dd-group-title">PROYECCIÓN</div>
                      {[
                        { id: '3D - Perspectiva', icon: Box },
                        { id: '3D - Superficie', icon: LandPlot },
                        { id: '2D - Vista superior', icon: Grid3x3 },
                        { id: '2D - Diagrama de planta', icon: Workflow },
                      ].map(({ id, icon: I }) => {
                        const isSel = selectedProj === id
                        return (
                          <button
                            key={id}
                            className={`dd-item ${isSel ? 'selected' : ''}`}
                            onClick={() => setSelectedProj(id)}
                          >
                            <I size={18} />
                            <span>{id}</span>
                            {isSel && <Check size={16} className="dd-check" />}
                          </button>
                        )
                      })}

                      <div className="dd-divider" />

                      <div className="dd-group-title">CÁMARA</div>
                      {[
                        { id: 'Superior', icon: SquareArrowUp },
                        { id: 'Frontal', icon: SquareMousePointer },
                        { id: 'Derecha', icon: SquareArrowRight },
                        { id: 'Isométrica', icon: Box },
                        { id: 'Ajustar todo', icon: Fullscreen },
                      ].map(({ id, icon: I }) => {
                        const isSel = selectedCam === id
                        return (
                          <button
                            key={id}
                            className={`dd-item ${isSel ? 'selected' : ''}`}
                            onClick={() => setSelectedCam(id)}
                          >
                            <I size={18} />
                            <span>{id}</span>
                            {isSel && <Check size={16} className="dd-check" />}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Zoom Menu */}
                  {openDd === 'zoom' && (
                    <div className="dd-menu zoom-menu" style={{ position: 'relative', top: 8, marginLeft: 'auto' }}>
                      <div className="dd-group-title">ESCALA DE VISTA</div>
                      {[
                        { val: 25, label: '25 %', tag: 'Alejado' },
                        { val: 50, label: '50 %', tag: 'Por defecto' },
                        { val: 75, label: '75 %' },
                        { val: 100, label: '100 %', tag: 'Escala real' },
                      ].map(({ val, label, tag }) => (
                        <button
                          key={val}
                          className={`dd-item ${selectedZoom === val ? 'selected' : ''}`}
                          onClick={() => setSelectedZoom(val)}
                        >
                          <span>{label}</span>
                          {tag && <small className="dd-tag">{tag}</small>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 2.2 Menú Agregar Tracking (.track-add-menu) */}
              <div className="glass" style={{ ...cardSurfaceStyle, minHeight: 410 }}>
                <div style={labelTagStyle}>
                  <span>2.2 MENÚ AGREGAR TRACKING</span>
                  <span style={codePillStyle}>.track-add-menu</span>
                </div>

                <div className="section" style={{ borderTop: 'none' }}>
                  <div
                    className="section-head"
                    onClick={() => setOpenDd(openDd === 'addTrack' ? null : 'addTrack')}
                  >
                    <span>Tracking (Clic para abrir menú)</span>
                    <div className="section-head-actions">
                      <button
                        className="section-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDd(openDd === 'addTrack' ? null : 'addTrack')
                        }}
                      >
                        <CirclePlus size={16} />
                      </button>
                      <button className="accordion-chevron-btn">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  {(openDd === 'addTrack' || openDd === 'proj') && (
                    <div className="dd-menu track-add-menu" style={{ position: 'relative', top: 4, left: 0, width: '100%', maxHeight: 'none', overflowY: 'visible' }}>
                      <div className="dd-group-title">AGREGAR TRACKING</div>
                      {[
                        { label: 'Declarar evacuación', color: '#ff1744', icon: Siren },
                        { label: 'Zonas y áreas', color: '#aa00ff', icon: Layers2 },
                        { label: 'Recorrido', color: '#ff9100', icon: Waypoints },
                        { label: 'Personal y vehículos', color: '#2979ff', icon: UserRoundSearch },
                        { label: 'Escenario alterno', color: '#00bfa5', icon: AudioWaveform },
                      ].map(({ label, color, icon: I }) => (
                        <button key={label} className="dd-item">
                          <I size={18} style={{ color }} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 2.3 Agregar Simulación Categorizado (.sim-add-menu) */}
              <div className="glass" style={{ ...cardSurfaceStyle, minHeight: 410 }}>
                <div style={labelTagStyle}>
                  <span>2.3 MENÚ CATEGORIZADO DE SIMULACIONES</span>
                  <span style={codePillStyle}>.sim-add-menu</span>
                </div>

                <div className="section" style={{ borderTop: 'none' }}>
                  <div
                    className="section-head"
                    onClick={() => setOpenDd(openDd === 'addSim' ? null : 'addSim')}
                  >
                    <span>Simulaciones (Clic para desplegar)</span>
                    <div className="section-head-actions">
                      <button
                        className="section-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDd(openDd === 'addSim' ? null : 'addSim')
                        }}
                      >
                        <CirclePlus size={16} />
                      </button>
                      <button className="accordion-chevron-btn">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  {(openDd === 'addSim' || openDd === 'proj') && (
                    <div
                      className="dd-menu sim-add-menu"
                      style={{ position: 'relative', top: 4, right: 'auto', width: '100%', maxHeight: 'none', overflowY: 'visible' }}
                    >
                      {[
                        {
                          cat: 'VENTILACIÓN',
                          items: [
                            { label: 'Flujo de aire', icon: Wind, color: '#00b0ff' },
                            { label: 'Mapa de calor', icon: Flame, color: '#ff6d00' },
                          ],
                        },
                        {
                          cat: 'ENERGÍA',
                          items: [{ label: 'Flujo de energía', icon: Zap, color: '#ffd600' }],
                        },
                        {
                          cat: 'COMUNICACIONES',
                          items: [{ label: 'Flujo de red', icon: Wifi, color: '#d500f9' }],
                        },
                        {
                          cat: 'SEGURIDAD',
                          items: [
                            { label: 'Geocercas', icon: MapPin, color: '#ff1744' },
                            { label: 'Vibraciones sísmicas', icon: Activity, color: '#ff9100' },
                          ],
                        },
                        {
                          cat: 'PERSONAL',
                          items: [{ label: 'Movimiento de personal', icon: Users, color: '#00e676' }],
                        },
                      ].map((group) => (
                        <div key={group.cat} className="sim-group-block">
                          <div className="dd-group-title">{group.cat}</div>
                          {group.items.map((it) => {
                            const Icon = it.icon
                            const isAdded = activeDsSims.includes(it.label)
                            return (
                              <button
                                key={it.label}
                                className={`dd-item ${isAdded ? 'selected' : ''}`}
                                onClick={() => toggleDsSim(it.label)}
                              >
                                <Icon size={18} style={{ color: it.color }} />
                                <span>{it.label}</span>
                                {isAdded && <Check size={16} className="dd-check" />}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 2.4 Checklist Multi-select de Personal + Time Picker + What-If Dropdowns */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 410 }}>
                <div style={labelTagStyle}>
                  <span>2.4 CHECKLIST MULTI-SELECCIÓN &amp; WHAT-IF</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.personal-checklist-menu</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('checklist-personal')}
                        title="Abrir checklist de personal en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Range Triggers */}
                <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                  <button
                    className={`dd-trigger full grow ${openDd === 'shiftStart' ? 'active' : ''}`}
                    onClick={() => setOpenDd(openDd === 'shiftStart' ? null : 'shiftStart')}
                  >
                    <span>Inicio ({shiftStart})</span>
                    <Calendar size={16} />
                  </button>
                  <button
                    className={`dd-trigger full grow ${openDd === 'whatifTarget' ? 'active' : ''}`}
                    onClick={() => setOpenDd(openDd === 'whatifTarget' ? null : 'whatifTarget')}
                  >
                    <span>Nodo What-If</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                {openDd === 'shiftStart' && (
                  <div className="dd-menu time-picker-menu" style={{ position: 'relative', top: 0, width: '100%' }}>
                    {['06:00', '08:00'].map((t) => (
                      <button
                        key={t}
                        className={`dd-item ${shiftStart === t ? 'selected' : ''}`}
                        onClick={() => {
                          setShiftStart(t)
                          setOpenDd(null)
                        }}
                      >
                        <span>{t}</span>
                        {shiftStart === t && <Check size={15} className="dd-check" />}
                      </button>
                    ))}
                  </div>
                )}

                {openDd === 'whatifTarget' && (
                  <div className="dd-menu" style={{ position: 'relative', top: 0, width: '100%' }}>
                    <div className="dd-group-title">COMPONENTE O NODO</div>
                    {[
                      'Ventilador principal V-PH-01',
                      'Subestación eléctrica CD-MT-01',
                    ].map((item) => (
                      <button
                        key={item}
                        className={`dd-item ${whatIfTarget === item ? 'selected' : ''}`}
                        onClick={() => {
                          setWhatIfTarget(item)
                          setOpenDd(null)
                        }}
                      >
                        <span>{item}</span>
                        {whatIfTarget === item && <Check size={15} className="dd-check" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Search Personal Checklist Trigger */}
                <button
                  className={`dd-trigger full ${openDd === 'personalSearch' ? 'active' : ''}`}
                  onClick={() => setOpenDd(openDd === 'personalSearch' ? null : 'personalSearch')}
                >
                  <Search size={16} />
                  <span style={{ flex: 1, textAlign: 'left' }}>Buscar personal (Checklist)</span>
                  <ChevronDown size={16} />
                </button>

                <div
                  className="dd-menu personal-checklist-menu"
                  style={{ position: 'relative', top: 0, left: 0, maxWidth: '100%', width: '100%' }}
                >
                  <div className="checklist-head">
                    <span>
                      {Object.values(checkedPeople).filter(Boolean).length}/2 SELECCIONADO
                    </span>
                    <button onClick={() => setCheckedPeople({})}>QUITAR TODOS</button>
                  </div>
                  <div className="checklist-scroll" style={{ maxHeight: 'none', overflowY: 'visible' }}>
                    {[
                      { id: 'p1', name: 'Juan García', sub: 'Acarreo · Camión T-01' },
                      { id: 'p2', name: 'María López', sub: 'Perforación · Jumbo J-02' },
                    ].map((p) => {
                      const checked = !!checkedPeople[p.id]
                      return (
                        <button
                          key={p.id}
                          className="checklist-item"
                          onClick={() =>
                            setCheckedPeople((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                          }
                        >
                          <span className={`chk-box ${checked ? 'checked' : ''}`}>
                            {checked && <Check size={12} strokeWidth={3} />}
                          </span>
                          <div className="checklist-names">
                            <b>{p.name}</b>
                            <small>{p.sub}</small>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 2.5 Card Flotante de Previsualización Interior (media_1793855456754_c88862b9.jpg) */}
              <div className="glass" style={{ ...cardSurfaceStyle, minHeight: 410, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>2.5 CARD FLOTANTE PREVISUALIZACIÓN INTERIOR</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.interior-preview-card</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('interior-sb01')}
                        title="Abrir sala de bombeo en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className="glass interior-preview-card"
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 320,
                    margin: '0 auto',
                    borderRadius: 16,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {/* Canonical Navigation Topbar: Back (sin borde) + Breadcrumb + Buscar */}
                  <div className="user-detail-topbar" style={{ margin: 0, padding: '0 0 10px 0', borderBottom: '1px solid var(--line)', width: '100%' }}>
                    <button className="user-top-back-btn" title="Volver" aria-label="Volver">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="user-top-crumb">
                      <span className="crumb-prefix">Interiores / </span>
                      <span className="crumb-name"><b>Sala de Bombeo SB1</b></span>
                    </div>
                    <button className="user-top-search-btn" title="Buscar" aria-label="Buscar">
                      <Search size={18} />
                    </button>
                  </div>

                  <div className="row gap-2" style={{ alignItems: 'center', marginTop: 2 }}>
                    <Droplets size={15} style={{ color: '#00b0ff' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0284c7' }}>Sala de bombeo</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="row between" style={{ fontSize: 13 }}>
                      <span style={{ color: 'var(--text)' }}>Nivel del sumidero</span>
                      <b style={{ color: '#0284c7', fontWeight: 700 }}>64%</b>
                    </div>
                    {/* Neutral progress bar */}
                    <div className="player-seekbar-bg" style={{ height: 6, margin: '2px 0' }}>
                      <div className="player-seekbar-fill" style={{ width: '64%' }} />
                    </div>
                  </div>

                  <div className="row between" style={{ fontSize: 13, color: 'var(--text)' }}>
                    <span>Bombas en marcha</span>
                    <b style={{ color: '#10b981' }}>2 / 4</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13, color: 'var(--text)' }}>
                    <span>Caudal total</span>
                    <b>150 L/s</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13, color: 'var(--text)' }}>
                    <span>En falla</span>
                    <b style={{ color: '#ef4444' }}>1</b>
                  </div>

                  {/* Primary CTA Full Width WITHOUT icon */}
                  <div style={{ marginTop: 6 }}>
                    <button
                      className="cta full no-shadow"
                      style={{
                        width: '100%',
                        height: 42,
                        borderRadius: 10,
                        background: 'linear-gradient(90deg, #1253d6, #08ddf0)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: 'none',
                      }}
                      onClick={() => {
                        if (onNavigateToLocation) onNavigateToLocation('interior-sb01')
                      }}
                    >
                      <span>Entrar</span>
                    </button>
                    <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 6 }}>
                      Vista interior del lugar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 3. EXHAUSTIVE BUTTONS INVENTORY (Full-Width vs Auto-Width)         */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SquareMousePointer size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  3. Catálogo Completo de Botones (Full-Width vs Auto-Width, Neutrales, IA, Peligro & Icon-Only)
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Documentación exhaustiva de todas las variantes de botones que existen en SmartFlow diferenciando su comportamiento de ancho (<code>width: 100%</code> vs <code>width: auto</code> vs <code>flex: 1</code>) y sus estados <code>:hover</code> / <code>.active</code> / <code>:disabled</code>.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: 20,
              }}
            >
              {/* 3.1 Primary & CTA Buttons (Full-Width vs Auto-Width) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>3.1 BOTONES PRIMARIOS &amp; EMERGENCIA (FULL vs AUTO)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.cta / .esc-primary-btn</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('whatif')}
                        title="Ver acciones primarias en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Full width CTA */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width (100%)</b> — <code>.cta.full.no-shadow</code> (Acción primaria full width)
                  </small>
                  <button
                    className="cta full no-shadow"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span>Acción Primaria</span>
                  </button>
                </div>

                {/* Auto width CTA */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Auto-Width (fit-content)</b> — <code>.cta.no-shadow</code> (Acción primaria auto)
                  </small>
                  <button className="cta no-shadow">Acción Primaria</button>
                </div>

                {/* Full-Width Entrar a Interior (Canónico sin íconos) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Entrar a Interior (Canónico)</b> — <code>.cta.full.no-shadow</code>
                  </small>
                  <button
                    className="cta full no-shadow"
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: 10,
                      background: 'linear-gradient(90deg, #1253d6, #08ddf0)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span>Entrar</span>
                  </button>
                </div>

                {/* Emergency Iniciar Evacuacion Button */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Emergencia / Iniciar Evacuación (#ef4444)</b> — <code>.cta.full.no-shadow</code>
                  </small>
                  <button
                    className="cta full no-shadow"
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      height: 40,
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 13.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <span>Iniciar evacuación</span>
                  </button>
                </div>
              </div>

              {/* 3.2 Secondary & Neutral Action Buttons (Full-Width vs Auto-Width vs Flex) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>3.2 BOTONES SECUNDARIOS &amp; NEUTRALES (HOVER HOMOLOGADO)</span>
                  <span style={codePillStyle}>.user-action-btn / .permanencia-chip</span>
                </div>

                {/* User Action Buttons (Full width canonical 36px) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Acción Neutral (36px)</b> — <code>.user-action-btn</code> (Componente canónico homologado)
                  </small>
                  <div className="user-action-buttons" style={{ marginBottom: 0 }}>
                    <button className="user-action-btn" style={{ height: 36, minHeight: 36 }}>
                      <Crosshair size={16} />
                      <span>Centrar en el mapa</span>
                    </button>
                  </div>
                </div>

                {/* Permanencia Chips (Full width left-aligned 36px) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Alineado a la Izquierda (36px)</b> — <code>.permanencia-chip</code> (Mismo alto 36px)
                  </small>
                  <div className="permanencia-chip-list">
                    <button className="permanencia-chip" style={{ height: 36, minHeight: 36, display: 'flex', alignItems: 'center' }}>
                      Camión T-03 · Nivel N02 (1h 45m)
                    </button>
                  </div>
                </div>

                {/* Escenario Secondary Buttons: Full vs Auto (36px) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width vs Auto-Width (36px)</b> — <code>.esc-secondary-btn.full</code> vs <code>.esc-secondary-btn</code>
                  </small>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="esc-secondary-btn full no-shadow" style={{ height: 36, minHeight: 36 }}>
                      Descartar escenario (Full-Width)
                    </button>
                    <div>
                      <button className="esc-secondary-btn" style={{ height: 36, minHeight: 36 }}>
                        Restablecer (Auto-Width)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flex 1 Row Buttons (.auxilio-action-btn & Conmutador Segmentado) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Botones Flex (36px) &amp; Pestañas Activa / Inactiva (.surface-bottom-switch)</b>
                  </small>
                  <div className="auxilio-card-actions" style={{ marginTop: 0, marginBottom: 8 }}>
                    <button
                      className={`auxilio-action-btn ${auxilioAttended ? 'active' : ''}`}
                      onClick={() => setAuxilioAttended((v) => !v)}
                      style={{ height: 36, minHeight: 36 }}
                    >
                      {auxilioAttended ? 'Atendido (Activo)' : 'Atender (Clic para alternar)'}
                    </button>
                  </div>

                  {/* Pestañas Activa / Inactiva con Conmutador Vista Superficie (.surface-bottom-switch) */}
                  <div
                    className="surface-bottom-switch"
                    style={{
                      position: 'relative',
                      bottom: 'auto',
                      left: 'auto',
                      width: '100%',
                      display: 'flex',
                      margin: 0,
                      boxShadow: 'none',
                      padding: 3,
                      height: 36,
                      minHeight: 36,
                      alignItems: 'center',
                    }}
                  >
                    <button
                      className={`surface-switch-btn ${auxilioTab === 'sin_cerrar' ? 'active' : ''}`}
                      onClick={() => setAuxilioTab('sin_cerrar')}
                      style={{ flex: 1, textAlign: 'center', height: '100%' }}
                    >
                      Pestaña activa
                    </button>
                    <button
                      className={`surface-switch-btn ${auxilioTab === 'resueltas' ? 'active' : ''}`}
                      onClick={() => setAuxilioTab('resueltas')}
                      style={{ flex: 1, textAlign: 'center', height: '100%' }}
                    >
                      Pestaña inactiva
                    </button>
                  </div>
                </div>

                {/* Inline Link Action Buttons (36px) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Acciones Inline con Ícono (36px)</b> — <code>.evac-action-link-btn</code> &amp; <code>.whatif-reconfig-btn</code>
                  </small>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="evac-action-link-btn" style={{ height: 36, minHeight: 36, padding: '0 12px', display: 'inline-flex', alignItems: 'center' }}>
                      <Check size={14} />
                      <span>Acción inline</span>
                    </button>
                    <button className="whatif-reconfig-btn" style={{ height: 36, minHeight: 36, width: 'auto', padding: '0 14px', display: 'inline-flex', alignItems: 'center' }}>
                      <RotateCw size={14} />
                      <span>Reconfigurar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3.3 Icon Buttons, Controls, Steppers & Segmented Controls */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>3.3 BOTONES DE ÍCONO, SEGMENTOS, STEPPERS &amp; CONTROLES</span>
                  <span style={codePillStyle}>Icon Sizing &amp; Controls</span>
                </div>

                {/* Icon sizing hierarchy */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>Jerarquía de Botones Icon-Only (1 por tamaño canónico)</b>: 38px, 32px, 28px, 24px, 22px, 20px
                  </small>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    {/* 38px Avatar */}
                    <button className="avatar" title=".avatar (38×38px)">
                      DS
                    </button>
                    {/* 32px Back button */}
                    <button className="user-top-back-btn" title=".user-top-back-btn (32×32px)">
                      <ChevronLeft size={18} />
                    </button>
                    {/* 32px Player Control */}
                    <button className="player-ctrl-btn" title=".player-ctrl-btn (32×32px)">
                      <Play size={18} />
                    </button>
                    {/* 28px Target Button */}
                    <button className="whatif-target-btn" title=".whatif-target-btn (28×28px)">
                      <Target size={15} />
                    </button>
                    {/* 28px Nexo Drawer Button */}
                    <button className="nexo-close-btn" title=".nexo-close-btn (28×28px)">
                      <X size={18} />
                    </button>
                    {/* 24px Auxilio Add */}
                    <button className="auxilio-add-btn" title=".auxilio-add-btn (24×24px)">
                      <Plus size={14} />
                    </button>
                    {/* 22px Section Action Button */}
                    <button className="section-action-btn" title=".section-action-btn (22×22px)">
                      <CirclePlus size={16} />
                    </button>
                    {/* 20px Sim Remove */}
                    <button className="sim-remove-btn" title=".sim-remove-btn (20×20px)">
                      <CircleMinus size={18} />
                    </button>
                  </div>
                </div>

                {/* Segmented Row (.seg-row) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>Control Segmentado</b> — <code>.seg-row</code>
                  </small>
                  <div className="seg-row">
                    {(['Bajo', 'Medio', 'Alto'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        className={perfLevel === lvl ? 'on' : ''}
                        onClick={() => setPerfLevel(lvl)}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density Stepper (.density-stepper) & Switch (.mui-switch) */}
                <div className="row between" style={{ padding: '4px 0' }}>
                  <div>
                    <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                      <b>Stepper Numérico</b> — <code>.density-stepper</code>
                    </small>
                    <div className="density-stepper" style={{ width: 'fit-content' }}>
                      <button onClick={() => setDensityVal((v) => Math.max(0, v - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="density-val">{densityVal}</span>
                      <button onClick={() => setDensityVal((v) => v + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                      <b>Switch Toggle</b> — <code>.mui-switch</code>
                    </small>
                    <div
                      className="row gap-2 switch-row"
                      onClick={() => setAutoPerf((v) => !v)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: 13 }}>{autoPerf ? 'Activo' : 'Inactivo'}</span>
                      <span className={`mui-switch ${autoPerf ? 'checked' : ''}`}>
                        <span className="mui-switch-track" />
                        <span className="mui-switch-thumb" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Checkboxes (.whatif-check-row) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>Filas de Checkbox Neutrales (Estados Checked / Unchecked)</b> — <code>.whatif-check-row</code>
                  </small>
                  <div className="whatif-axes-check-list" style={{ marginTop: 0 }}>
                    <div
                      className="whatif-check-row"
                      onClick={() =>
                        setWhatIfChecks((prev) => ({
                          ...prev,
                          carga: !prev.carga,
                        }))
                      }
                    >
                      <span className={`whatif-custom-checkbox ${whatIfChecks.carga ? 'checked' : ''}`}>
                        {whatIfChecks.carga && <Check size={14} />}
                      </span>
                      <span className="whatif-check-label">Estado seleccionado (Checked)</span>
                    </div>
                    <div
                      className="whatif-check-row"
                      onClick={() =>
                        setWhatIfChecks((prev) => ({
                          ...prev,
                          vent: !prev.vent,
                        }))
                      }
                    >
                      <span className={`whatif-custom-checkbox ${whatIfChecks.vent ? 'checked' : ''}`}>
                        {whatIfChecks.vent && <Check size={14} />}
                      </span>
                      <span className="whatif-check-label">Estado deseleccionado (Unchecked)</span>
                    </div>
                  </div>
                </div>

                {/* Canonical Progress Slider / Horizonte de Tiempo */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>Control Deslizante de Progreso (Horizonte de tiempo / Velocidad)</b> — <code>input[type=range]</code>
                  </small>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    <div className="row between" style={{ fontSize: 12.5 }}>
                      <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>Horizonte de tiempo</span>
                      <b style={{ color: 'var(--text)', fontWeight: 600, fontSize: 12.5 }}>60 min</b>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={120}
                      step={15}
                      defaultValue={60}
                      style={{
                        width: '100%',
                        margin: '4px 0 6px 0',
                        ['--range-progress' as any]: '42.8%',
                      }}
                    />
                    <small style={{ fontSize: 11, color: 'var(--muted)' }}>
                      Mismo componente homologado: altura 6px, pista neutral sin línea, progreso gris oscuro y thumb circular sin borde.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 4. UNIFIED BADGE SYSTEM (Componente Canónico Unificado .smart-badge) */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'badges') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={20} style={{ color: '#166534' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  4. Sistema Unificado de Badges (.smart-badge)
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Un solo componente homologado para todos los estados del sistema: mismo peso de fondo (100 / 16% dark), misma línea (1px solid), mismo peso de texto (600 Semibold, 11.5px), idéntico radio (6px), idéntico padding (3px 8px) y todos con mayúscula inicial.
              </p>
            </div>

            {/* 4.1 Componente Canónico Unificado en un solo lugar */}
            <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={labelTagStyle}>
                <span>4.1 COMPONENTE CANÓNICO DE BADGES DE ESTADO (MISMO PESO, LÍNEA Y FONDO)</span>
                <span style={codePillStyle}>.smart-badge (green | red | orange | yellow | neutral)</span>
              </div>

              {/* Fila Canónica Principal */}
              <div>
                <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                  <b>Variantes Canónicas Principales</b> (Crítico a la izquierda, Alto, Medio / Aviso, En falla, En marcha y En reserva):
                </small>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 10, background: 'var(--panel-item-bg, rgba(0,0,0,0.03))', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge red">Crítico</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Rojo</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge red">En falla</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Rojo</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge orange">Alto</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Naranja</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge yellow">Medio</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Amarillo</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge yellow">Aviso</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Amarillo</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge green">En marcha</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Verde</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge green">Operativo</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Verde</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span className="smart-badge neutral">En reserva</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Neutral</span>
                  </div>
                </div>
              </div>

              {/* Mapeo de Homologación por Categoría Semántica */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                {/* Verde */}
                <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row between" style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>
                    <span>Verde (Positivo / Marcha)</span>
                    <code style={codePillStyle}>.smart-badge.green</code>
                  </div>
                  <div className="row between">
                    <span className="smart-badge green">En marcha</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Bombas y equipos</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge green">Operativo</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Sistemas de ventilación</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge green">En línea</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Nodos de telemetría</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge green">Activo</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Servicios en ejecución</span>
                  </div>
                </div>

                {/* Rojo */}
                <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row between" style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>
                    <span>Rojo (Crítico / Falla)</span>
                    <code style={codePillStyle}>.smart-badge.red</code>
                  </div>
                  <div className="row between">
                    <span className="smart-badge red">Crítico</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Severidad máxima</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge red">En falla</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Bombas fuera de servicio</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge red">Alerta</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Evacuación y auxilio</span>
                  </div>
                </div>

                {/* Naranja & Amarillo */}
                <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row between" style={{ fontSize: 12, fontWeight: 700, color: '#9a3412' }}>
                    <span>Naranja &amp; Amarillo (Advertencia)</span>
                    <code style={codePillStyle}>.orange / .yellow</code>
                  </div>
                  <div className="row between">
                    <span className="smart-badge orange">Alto</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Severidad alta</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge yellow">Medio</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Severidad media</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge yellow">Aviso</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Notificación preventiva</span>
                  </div>
                </div>

                {/* Neutral */}
                <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row between" style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                    <span>Neutral (En reserva / Espera)</span>
                    <code style={codePillStyle}>.smart-badge.neutral</code>
                  </div>
                  <div className="row between">
                    <span className="smart-badge neutral">En reserva</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Bomba en standby</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge neutral">Sin atender</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Auxilio pendiente</span>
                  </div>
                  <div className="row between">
                    <span className="smart-badge neutral">Sin aplicar</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Escenario simulado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.2 In-Scene 3D Badges (Sala de Bombeo, Personal con Blur Icon, Simulación de Vehículos y Superficie) */}
            <div className="glass" style={cardSurfaceStyle}>
              <div style={labelTagStyle}>
                <span>
                  4.2 BADGES FLOTANTES EN ESCENA 3D (BLANCO 50% + BLUR POR DEFECTO, 100% BLANCO AL SELECCIONAR)
                </span>
                <span style={codePillStyle}>B1-B4, Sumidero, Jumbo, Manuel Reyes, Juan García</span>
              </div>

              {/* Sub-bloque A: Por defecto (50% blanco + blur 12px) */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Estado Por Defecto (Blanco 50% translúcido + Blur 12px)
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    alignItems: 'center',
                    padding: '24px 20px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {/* B1: Marcha */}
                  <div className="bombeo-3d-badge marcha" style={{ position: 'relative', transform: 'none' }}>
                    <div className="bombeo-badge-top-box">
                      <span className="callout-dot green" />
                      <span>BE-01</span>
                    </div>
                    <div className="bombeo-badge-bottom-box">75 L/s</div>
                  </div>

                  {/* B2: Marcha */}
                  <div className="bombeo-3d-badge marcha" style={{ position: 'relative', transform: 'none' }}>
                    <div className="bombeo-badge-top-box">
                      <span className="callout-dot green" />
                      <span>BE-02</span>
                    </div>
                    <div className="bombeo-badge-bottom-box">74 L/s</div>
                  </div>

                  {/* B3: Reserva */}
                  <div className="bombeo-3d-badge reserva" style={{ position: 'relative', transform: 'none' }}>
                    <div className="bombeo-badge-top-box">
                      <span className="callout-dot yellow" />
                      <span>BE-03</span>
                    </div>
                    <div className="bombeo-badge-bottom-box reserva">RESERVA</div>
                  </div>

                  {/* BE-04: Falla + Companion Bit IA Badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <div className="bombeo-3d-badge falla" style={{ position: 'relative', transform: 'none' }}>
                      <div className="bombeo-badge-top-box">
                        <span className="callout-dot red" />
                        <span>BE-04</span>
                      </div>
                      <div className="bombeo-badge-bottom-box falla">FALLA</div>
                    </div>

                    <div className="bombeo-3d-ai-badge" style={{ position: 'relative', transform: 'none' }}>
                      <BitLogo size={13} color="currentColor" />
                      <span className="ai-badge-pulse-dot" />
                      <span>BE-04 · Bit IA</span>
                    </div>
                  </div>

                  {/* Sumidero */}
                  <div className="bombeo-3d-sump-badge" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot cyan" />
                    <span>SUMIDERO 64%</span>
                  </div>

                  {/* Jumbo J-01 */}
                  <div className="sim-3d-badge" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot yellow" />
                    <span>JUMBO J-01</span>
                  </div>

                  {/* Manuel Reyes */}
                  <div className="bombeo-worker-3d-badge" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot green" />
                    <span>MANUEL REYES</span>
                  </div>

                  {/* Juan García */}
                  <div className="sim-3d-badge" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot green" />
                    <span>JUAN GARCÍA</span>
                  </div>
                </div>
              </div>

              {/* Sub-bloque B: Seleccionado (100% Blanco sólido + Sombra destacada) */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Estado Seleccionado (100% Blanco sólido + Sombra destacada)
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    alignItems: 'center',
                    padding: '24px 20px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {/* B1 Selected */}
                  <div className="bombeo-3d-badge marcha selected" style={{ position: 'relative', transform: 'none' }}>
                    <div className="bombeo-badge-top-box">
                      <span className="callout-dot green" />
                      <span>B-01</span>
                    </div>
                    <div className="bombeo-badge-bottom-box">75 L/s</div>
                  </div>

                  {/* B2 Selected */}
                  <div className="bombeo-3d-badge marcha selected" style={{ position: 'relative', transform: 'none' }}>
                    <div className="bombeo-badge-top-box">
                      <span className="callout-dot green" />
                      <span>BE-02</span>
                    </div>
                    <div className="bombeo-badge-bottom-box">74 L/s</div>
                  </div>

                  {/* B3 Selected */}
                  <div className="bombeo-3d-badge reserva selected" style={{ position: 'relative', transform: 'none' }}>
                    <div className="bombeo-badge-top-box">
                      <span className="callout-dot yellow" />
                      <span>BE-03</span>
                    </div>
                    <div className="bombeo-badge-bottom-box reserva">RESERVA</div>
                  </div>

                  {/* BE-04 Selected + Companion Bit IA Badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <div className="bombeo-3d-badge falla selected" style={{ position: 'relative', transform: 'none' }}>
                      <div className="bombeo-badge-top-box">
                        <span className="callout-dot red" />
                        <span>BE-04</span>
                      </div>
                      <div className="bombeo-badge-bottom-box falla">FALLA</div>
                    </div>

                    <div className="bombeo-3d-ai-badge active" style={{ position: 'relative', transform: 'none' }}>
                      <BitLogo size={13} color="currentColor" />
                      <span className="ai-badge-pulse-dot" />
                      <span>BE-04 · Diagnóstico Bit IA</span>
                    </div>
                  </div>

                  {/* Sumidero Selected */}
                  <div className="bombeo-3d-sump-badge selected" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot cyan" />
                    <span>SUMIDERO 64%</span>
                  </div>

                  {/* Jumbo J-01 Selected */}
                  <div className="sim-3d-badge selected" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot yellow" />
                    <span>JUMBO J-01</span>
                  </div>

                  {/* Manuel Reyes Selected */}
                  <div className="bombeo-worker-3d-badge selected" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot green" />
                    <span>MANUEL REYES</span>
                  </div>

                  {/* Juan García Selected */}
                  <div className="sim-3d-badge selected" style={{ position: 'relative', transform: 'none' }}>
                    <span className="callout-dot green" />
                    <span>JUAN GARCÍA</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 5. BIT IA · ANIMATIONS (BorderBeam), BUTTONS & DRAWER ELEMENTS     */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'ia') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} style={{ color: '#546e7a' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  5. Bit IA · Animación Perimetral (BorderBeam), Botones &amp; Drawer
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Animación con los colores metálicos del gradiente Bit IA (<code>#455a64</code>, <code>#546e7a</code>, <code>#90a4ae</code>) con ícono de rombo (<code>Diamond</code>) y todos los componentes del asistente.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: 20,
              }}
            >
              {/* BorderBeam Interactive Card */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>5.1 CARD IA PREDICTIVA CON &lt;BorderBeam /&gt;</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>&lt;BorderBeam /&gt;</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('worker-telemetria')}
                        title="Abrir telemetría de personal en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className="user-ai-gradient-card animating"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '16px 18px',
                    borderRadius: 12,
                    margin: '0 0 16px 0',
                    background: 'transparent',
                  }}
                >
                  <div className="user-ai-card-top">
                    <div className="user-ai-tag">
                      <BitLogo width={14} height={14} color="#546e7a" />
                      <span>IA Predictiva · Telemetría Activa</span>
                    </div>
                  </div>
                  <div className="user-ai-card-body">
                    <div className="user-ai-metric-row">
                      <span className="user-ai-lbl">Ruta recomendada</span>
                      <b className="user-ai-val">Rampa N02 → Refugio R-01</b>
                    </div>
                    <div className="user-ai-metric-row">
                      <span className="user-ai-lbl">Tiempo estimado</span>
                      <b className="user-ai-val">3 min 40 s (Sin riesgo)</b>
                    </div>
                    <div className="user-ai-metric-row">
                      <span className="user-ai-lbl">Atmósfera en ruta</span>
                      <b className="user-ai-val">CO &lt; 5 ppm · O₂ 20.9%</b>
                    </div>
                    <div className="user-ai-metric-row" style={{ borderBottom: 'none' }}>
                      <span className="user-ai-lbl">Estado</span>
                      <span className="status-badge-optimo">Óptimo</span>
                    </div>
                  </div>
                </div>

                {/* Control Deslizante de Progreso / Velocidad de duración (Único, Homologado & Neutro) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  <div className="row between" style={{ fontSize: 12.5 }}>
                    <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>Velocidad de duración</span>
                    <b style={{ color: 'var(--text)', fontWeight: 600, fontSize: 12.5 }}>{beamSpeed} s</b>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={18}
                    value={beamSpeed}
                    onChange={(e) => setBeamSpeed(Number(e.target.value))}
                    style={{
                      width: '100%',
                      margin: '4px 0 6px 0',
                      ['--range-progress' as any]: `${((beamSpeed - 2) / (18 - 2)) * 100}%`,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <small style={{ fontSize: 11, color: 'var(--muted)' }}>
                      Mismo componente para progreso y sliders: altura 6px, pista neutral sin línea y progreso gris oscuro.
                    </small>
                  </div>
                </div>
              </div>

              {/* All Bit IA Buttons */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>5.2 BOTONES Y TRIGGERS BIT IA</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.ia-gradient</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('nexo-drawer')}
                        title="Abrir Bit IA en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Barra Principal Superior (Centrada) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>1. Barra Principal Superior (Grande · Full-Width · Centrado)</b> — <code>.nexo-bar</code>
                  </small>
                  <div className="nexo-bar" style={{ justifyContent: 'center' }}>
                    <button className="nexo-open-trigger" style={{ justifyContent: 'center', textAlign: 'center' }}>
                      <span className="nexo-title" style={{ justifyContent: 'center', margin: '0 auto' }}>
                        <BitLogo /> Pregúntale a Bit IA
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Botones Primarios Bit IA (Sólidos con degradado metálico) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>2. Botones Primarios (Sólidos con degradado metálico)</b> — <code>.consultar-nexo-btn.ia-gradient</code>
                  </small>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <small style={{ fontSize: 10.5, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
                        2.1 Primario Full-Width (Altura 36px)
                      </small>
                      <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0, width: '100%', height: 36, fontSize: 13 }}>
                        <BitLogo width={14} height={14} color="#ffffff" />
                        <span>Consultar estado con Bit IA</span>
                      </button>
                    </div>
                    <div>
                      <small style={{ fontSize: 10.5, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
                        2.2 Primario Auto-Width (Altura 36px)
                      </small>
                      <div style={{ display: 'flex' }}>
                        <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0, width: 'auto', height: 36, padding: '0 16px', fontSize: 13 }}>
                          <BitLogo width={14} height={14} color="#ffffff" />
                          <span>Preguntar a Bit IA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Botones Secundarios Bit IA (Lineal / Outline degradado, interior transparente) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>3. Botones Secundarios Lineales (Sin fondo, línea con degradado de izquierda a derecha)</b> — <code>.consultar-nexo-btn.ia-secondary</code>
                  </small>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <small style={{ fontSize: 10.5, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
                        3.1 Secundario Lineal Full-Width (Altura 36px, 100 % transparente, contorno degradado)
                      </small>
                      <button className="consultar-nexo-btn ia-secondary" style={{ margin: 0, width: '100%', height: 36, fontSize: 13 }}>
                        <BitLogo width={14} height={14} color="currentColor" />
                        <span>Consultar estado con Bit IA</span>
                      </button>
                    </div>
                    <div>
                      <small style={{ fontSize: 10.5, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
                        3.2 Secundario Lineal Auto-Width (Altura 36px, 100 % transparente, contorno degradado)
                      </small>
                      <div style={{ display: 'flex' }}>
                        <button className="consultar-nexo-btn ia-secondary" style={{ margin: 0, width: 'auto', height: 36, padding: '0 16px', fontSize: 13 }}>
                          <BitLogo width={14} height={14} color="currentColor" />
                          <span>Preguntar a Bit IA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Botón Lineal de Falla en Tarjeta de Bomba (Sala de Bombeo) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>4. Botón Lineal de Alerta en Interior (Sin fondo, contorno degradado Bit IA)</b> — <code>.consultar-nexo-btn.ia-outline</code>
                  </small>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <button className="consultar-nexo-btn ia-outline" style={{ margin: 0, width: '100%', height: 34, fontSize: 12 }}>
                        <BitLogo width={12} height={14} color="currentColor" />
                        <span>Preguntar a Bit IA sobre BA-04</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bit Drawer Components (Avatar, Chat Bubbles & Prompt Box) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={labelTagStyle}>
                  <span>5.3 COMPONENTES DEL DRAWER BIT IA</span>
                  <span style={codePillStyle}>.nexo-drawer</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="nexo-avatar-circle">
                    <BitLogo width={22} height={22} color="#ffffff" />
                  </div>
                  <div>
                    <b style={{ fontSize: 15 }}>¿En qué puedo ayudarte hoy?</b>
                    <small style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                      <code>.nexo-avatar-circle</code> (52×52px con rombo) + <code>.nexo-greeting</code>
                    </small>
                  </div>
                </div>

                <div className="nexo-chat-log" style={{ gap: 8 }}>
                  <div className="nexo-msg user">¿Cuál es el estado de la bomba BA-04?</div>
                  <div className="nexo-msg assistant">
                    La bomba <b>BA-04</b> registra alerta de temperatura (78°C) con caudal 0 L/s. Las bombas BA-01 y BA-02 mantienen 152 L/s.
                  </div>
                </div>

                <div className="nexo-input-box" style={{ height: 96, padding: '10px 14px' }}>
                  <textarea
                    className="nexo-textarea"
                    placeholder="Pregúntale a Bit IA sobre la mina..."
                    readOnly
                  />
                  <div className="nexo-input-actions">
                    <button className="nexo-attach-btn" title="Adjuntar">
                      <Plus size={18} />
                    </button>
                    <button className="nexo-send-btn" title="Enviar">
                      <ArrowUp size={17} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 5.4 Resultados y Hallazgos de Simulación Bit IA (Sin fondo · Línea separada) */}
              <div className="glass" style={{ ...cardSurfaceStyle, gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={labelTagStyle}>
                  <span>5.4 RESULTADOS Y HALLAZGOS DE SIMULACIÓN BIT IA (SIN FONDO · LÍNEA SEPARADA)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.nexo-scenario-card</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('nexo-drawer')}
                        title="Abrir Bit IA en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  Patrón alineado al diseño SmartFlow: <b>sin fondo (transparente)</b>, <b>sin bordes redondeados tipo caja</b>, con <b>línea lateral de categoría</b> (verde para Oportunidad, azul para Contexto) y <b>línea separadora inferior</b> (<code>border-bottom: 1px solid var(--line)</code>).
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                  {/* Left: Live Interactive Card Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <small style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Previsualización en Vivo (Editable desde el panel derecho)
                    </small>

                    <div style={{ background: 'var(--panel-bg)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--line)' }}>
                      {/* Status header like inside drawer */}
                      <div className="nexo-status-pill" style={{ marginBottom: 12 }}>
                        <div className="row gap-2" style={{ alignItems: 'center' }}>
                          <Settings size={14} style={{ color: 'var(--muted)' }} />
                          <span>Bit calculó la red de ventilación</span>
                        </div>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>7 ms</span>
                      </div>

                      <div className={`nexo-scenario-card ${dsFindingCategory}`}>
                        <div className="nexo-card-header">
                          <div className={`nexo-card-cat-label ${dsFindingCategory}`}>
                            <b>{dsFindingCategory === 'opportunity' ? 'Oportunidad' : 'Contexto'}</b>
                            <span style={{ color: 'var(--muted)' }}>· {dsFindingSubCat}</span>
                          </div>
                          <div className="nexo-confidence-badge">
                            <div className={`nexo-confidence-circle ${dsFindingCategory === 'opportunity' ? 'green' : 'blue'}`}>
                              {dsFindingConfidence}%
                            </div>
                            <span className="nexo-confidence-sub">confianza</span>
                          </div>
                        </div>

                        <h3 className="nexo-card-title">{dsFindingTitle}</h3>
                        <p className="nexo-card-body">{dsFindingBody}</p>

                        <div className="nexo-card-actions">
                          <button className="nexo-card-btn" type="button">Mostrar hora punta</button>
                          <button className="nexo-card-btn" type="button">Comparar casos</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Field Editor for Design Customization */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px', borderRadius: 10, background: 'rgba(0,0,0,0.02)', border: '1px solid var(--line)' }}>
                    <small style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Editor de Propiedades del Hallazgo
                    </small>

                    {/* Category Switcher */}
                    <div>
                      <label className="field-label" style={{ fontSize: 11.5, marginBottom: 4 }}>Categoría</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="nexo-card-btn"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            background: dsFindingCategory === 'opportunity' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                            borderColor: dsFindingCategory === 'opportunity' ? '#10b981' : 'var(--line)',
                            color: dsFindingCategory === 'opportunity' ? '#10b981' : 'var(--text)',
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            setDsFindingCategory('opportunity')
                            setDsFindingSubCat('Energía y costo')
                          }}
                        >
                          Oportunidad (#10b981)
                        </button>
                        <button
                          type="button"
                          className="nexo-card-btn"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            background: dsFindingCategory === 'context' ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                            borderColor: dsFindingCategory === 'context' ? '#0284c7' : 'var(--line)',
                            color: dsFindingCategory === 'context' ? '#0284c7' : 'var(--text)',
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            setDsFindingCategory('context')
                            setDsFindingSubCat('Seguridad')
                          }}
                        >
                          Contexto (#0284c7)
                        </button>
                      </div>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="field-label" style={{ fontSize: 11.5, marginBottom: 4 }}>Subcategoría</label>
                      <input
                        type="text"
                        value={dsFindingSubCat}
                        onChange={(e) => setDsFindingSubCat(e.target.value)}
                        style={{
                          width: '100%',
                          height: 32,
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--line)',
                          background: 'var(--input-bg, #fff)',
                          color: 'var(--text)',
                          fontSize: 12.5,
                        }}
                      />
                    </div>

                    {/* Confidence Slider */}
                    <div>
                      <div className="row between" style={{ fontSize: 12 }}>
                        <span className="field-label" style={{ margin: 0, fontSize: 11.5 }}>Nivel de Confianza</span>
                        <b className="mono" style={{ color: dsFindingCategory === 'opportunity' ? '#10b981' : '#0284c7' }}>
                          {dsFindingConfidence} %
                        </b>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={dsFindingConfidence}
                        onChange={(e) => setDsFindingConfidence(+e.target.value)}
                        style={{
                          width: '100%',
                          marginTop: 4,
                          ['--range-progress' as any]: `${((dsFindingConfidence - 50) / 50) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="field-label" style={{ fontSize: 11.5, marginBottom: 4 }}>Título del Hallazgo</label>
                      <input
                        type="text"
                        value={dsFindingTitle}
                        onChange={(e) => setDsFindingTitle(e.target.value)}
                        style={{
                          width: '100%',
                          height: 32,
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--line)',
                          background: 'var(--input-bg, #fff)',
                          color: 'var(--text)',
                          fontSize: 12.5,
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="field-label" style={{ fontSize: 11.5, marginBottom: 4 }}>Descripción y métricas</label>
                      <textarea
                        rows={3}
                        value={dsFindingBody}
                        onChange={(e) => setDsFindingBody(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--line)',
                          background: 'var(--input-bg, #fff)',
                          color: 'var(--text)',
                          fontSize: 12,
                          lineHeight: 1.4,
                          resize: 'vertical',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 6. CARDS, LIST ROWS (.zona-row) & TELEMETRY CONTAINERS             */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'cards') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Box size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  6. Cards, Filas de Lista (.zona-row) &amp; Bloques de Telemetría
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Patrones de tarjetas homologados: <code>.auxilio-card</code>, <code>.evacuacion-alert-card</code>, <code>.bombeo-pump-card-v2</code>, <code>.zona-row</code>, <code>.whatif-compare-card-block</code> y <code>.interior-metrics-2grid</code>.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: 20,
              }}
            >
              {/* 6.1 Filas de Lista (.zona-row) & Interiores (.interior-item-row) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={labelTagStyle}>
                  <span>6.1 FILAS DE TRACKING, PERSONAL &amp; ZONAS</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.zona-row</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('personal')}
                        title="Abrir lista de personal en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="personal-list">
                  {/* Zona con alerta y ratio */}
                  <div className="zona-row personal-clickable-row" style={{ padding: '4px 6px', borderRadius: 6 }}>
                    <span className="zona-bar" style={{ background: '#aa00ff' }} />
                    <div className="zona-info">
                      <div className="zona-line1">
                        <b>Nivel 3 - Chancador</b> <small>Subterráneo</small>
                      </div>
                      <div className="zona-line2">Operación continua</div>
                    </div>
                    <span className="alert-pill">
                      <b>2</b> <CircleAlert size={12} />
                    </span>
                    <span className="zona-ratio">18/25</span>
                  </div>

                  {/* Personal con alerta */}
                  <div className="zona-row personal-clickable-row" style={{ padding: '4px 6px', borderRadius: 6 }}>
                    <span className="zona-bar" style={{ background: '#2196f3' }} />
                    <div className="zona-info">
                      <div className="zona-line1">
                        <b>Juan García</b>
                      </div>
                      <div className="zona-line2">Acarreo &nbsp; Camión T-01</div>
                    </div>
                    <span className="alert-pill">
                      <b>1</b> <CircleAlert size={12} />
                    </span>
                    <ChevronRight size={16} className="row-chevron" />
                  </div>
                </div>
              </div>

              {/* 6.2 Petición de Auxilio & Evacuación en Curso */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>6.2 PATRÓN DE EVACUACIÓN EN CURSO &amp; AUXILIO</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.evac-info-card</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('evacuacion')}
                        title="Abrir evacuación en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Título y descripción con badge de estado Activo */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, margin: '4px 0 4px 0' }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
                      Evacuación en curso
                    </h3>
                    <span className="smart-badge red" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Siren size={13} />
                      <span>Activo</span>
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.4 }}>
                    Área sin determinar · 33 sin contabilizar · Declarada por Operador
                  </p>
                </div>

                {/* 2. Card con tiempo sobre una sola línea y detalles operativos */}
                <div
                  className="evac-info-card"
                  style={{
                    borderRadius: 10,
                    padding: '12px 14px',
                    background: 'var(--panel-bg)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div className="row between" style={{ fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Tiempo transcurrido</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#ef4444' }}>
                      00:06:27
                    </span>
                  </div>

                  <div className="row between" style={{ fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Estado</span>
                    <span className="smart-badge red" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Siren size={13} />
                      <span>Activo</span>
                    </span>
                  </div>

                  <div className="row between" style={{ fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Personal sin contabilizar</span>
                    <b style={{ color: 'var(--text)' }}>33 trabajadores</b>
                  </div>

                  <div className="row between" style={{ fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Puntos de encuentro</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>Refugio R-01, Superficie</span>
                  </div>

                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Ruta principal</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>Rampa Norte N02</span>
                  </div>
                </div>

                {/* Botón inferior rojo de Finalizar Evacuación */}
                <div>
                  <button
                    className="cta full no-shadow"
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      background: '#dc2626',
                      color: '#ffffff',
                      fontSize: 13.5,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => onNavigateToLocation && onNavigateToLocation('evacuacion')}
                  >
                    <span>Finalizar evacuación</span>
                  </button>
                </div>

                {/* Conmutador Visual Segmentado de Petición de Auxilio (.surface-bottom-switch) */}
                <div
                  className="surface-bottom-switch"
                  style={{
                    position: 'relative',
                    bottom: 'auto',
                    left: 'auto',
                    width: '100%',
                    display: 'flex',
                    marginBottom: 10,
                    boxShadow: 'none',
                    padding: 3,
                  }}
                >
                  <button
                    className={`surface-switch-btn ${auxilioTab === 'sin_cerrar' ? 'active' : ''}`}
                    onClick={() => setAuxilioTab('sin_cerrar')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    3 sin resolver
                  </button>
                  <button
                    className={`surface-switch-btn ${auxilioTab === 'resueltas' ? 'active' : ''}`}
                    onClick={() => setAuxilioTab('resueltas')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    3 resueltas
                  </button>
                </div>

                <div className="auxilio-card">
                  <div className="auxilio-card-row1">
                    <span className="auxilio-type-title">Petición de auxilio</span>
                    <div className="auxilio-status-group">
                      <span className="auxilio-status-unattended">Sin atender</span>
                      <span className="auxilio-status-critical">Crítico</span>
                    </div>
                  </div>
                  <div className="auxilio-card-row2">
                    <MapPin size={14} className="auxilio-icon" />
                    <span>Nivel 3 · Rampa Sur</span>
                  </div>
                  <div className="auxilio-card-row3">
                    <span>Hace 4 min</span>
                    <span>·</span>
                    <span>Sensor SOS activado</span>
                  </div>
                  <div className="auxilio-card-actions">
                    <button className="auxilio-action-btn">Atender</button>
                    <button className="auxilio-action-btn">Resolver</button>
                  </div>
                </div>

                {/* Incendio homologado exactamente al mismo patrón .auxilio-card */}
                <div className="auxilio-card">
                  <div className="auxilio-card-row1">
                    <span className="auxilio-type-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Flame size={15} style={{ color: '#ef4444' }} />
                      <span>Incendio</span>
                    </span>
                    <div className="auxilio-status-group">
                      <span className="auxilio-status-unattended">Sin atender</span>
                      <span className="auxilio-status-critical">Crítico</span>
                    </div>
                  </div>
                  <div className="auxilio-card-row2">
                    <MapPin size={14} className="auxilio-icon" />
                    <span>Subestación Eléctrica Principal · Nivel 2</span>
                  </div>
                  <div className="auxilio-card-row3">
                    <span>Reportado 14:18</span>
                    <span>·</span>
                    <span>Humo detectado</span>
                  </div>
                  <div className="auxilio-card-actions">
                    <button className="auxilio-action-btn">Atender</button>
                    <button className="auxilio-action-btn">Resolver</button>
                  </div>
                </div>
              </div>

              {/* 6.3 Sala de Bombeo: 2x2 Grid + Pump Cards V2 */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={labelTagStyle}>
                  <span>6.3 SALA DE BOMBEO: GRID 2×2 &amp; CARDS DE BOMBA</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.bombeo-pump-card-v2</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('sala-bombeo')}
                        title="Abrir vista interior de Sala de Bombeo en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="interior-metrics-2grid" style={{ margin: 0 }}>
                  <div className="interior-metric-cell">
                    <span className="metric-cell-label">Nivel sumidero</span>
                    <span className="metric-cell-value">64%</span>
                  </div>
                  <div className="interior-metric-cell">
                    <span className="metric-cell-label">En marcha</span>
                    <span className="metric-cell-value text-green">2 / 4</span>
                  </div>
                  <div className="interior-metric-cell">
                    <span className="metric-cell-label">Caudal total</span>
                    <span className="metric-cell-value">150 L/s</span>
                  </div>
                  <div className="interior-metric-cell">
                    <span className="metric-cell-label">En falla</span>
                    <span className="metric-cell-value text-red">1</span>
                  </div>
                </div>

                <div className="bombeo-pumps-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { id: 'BE-01', status: 'marcha' as const, statusText: 'En marcha', temp: '48 °C', flow: '78 L/s · 4.2 bar', hours: '1,240 h', pct: 78 },
                    { id: 'BE-04', status: 'falla' as const, statusText: 'En falla', temp: '78 °C', flow: '0 L/s · 0.0 bar', hours: '2,150 h', pct: 100 },
                  ].map((p) => {
                    const isSel = selectedPump === p.id || p.id === 'BE-04'
                    return (
                      <div
                        key={p.id}
                        className={`bombeo-pump-card-v2 ${isSel ? 'selected' : ''}`}
                        onClick={() => setSelectedPump(p.id)}
                      >
                        <div className="bombeo-pump-v2-header">
                          <div className="row gap-2" style={{ alignItems: 'center' }}>
                            <span className={`pump-status-dot-v2 ${p.status}`} />
                            <b style={{ fontSize: 13.5, color: 'var(--text)' }}>{p.id}</b>
                          </div>
                          <div className="row gap-2" style={{ alignItems: 'center' }}>
                            <span className={`pump-badge-v2 ${p.status}`}>{p.statusText}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: p.status === 'falla' ? '#ef4444' : '#64748b' }}>
                              {p.temp}
                            </span>
                          </div>
                        </div>
                        <div className="row between" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          <span>{p.flow}</span>
                          <span>{p.hours}</span>
                        </div>
                        <div className="pump-bar-v2-track">
                          <div className={`pump-bar-v2-fill ${p.status}`} style={{ width: `${p.pct}%` }} />
                        </div>
                        {p.status === 'falla' && (
                          <button
                            className="consultar-nexo-btn ia-outline"
                            style={{ marginTop: 8, marginBottom: 0, height: 34, padding: '0 12px', fontSize: 12 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onNavigateToLocation) onNavigateToLocation('nexo-drawer')
                            }}
                            title="Preguntar a Bit IA sobre la mitigación de falla"
                          >
                            <BitLogo width={12} height={14} color="currentColor" />
                            <span>Preguntar a Bit IA sobre {p.id}</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 6.4 What-If Comparison 2-Col Box & Consequence Cards */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={labelTagStyle}>
                  <span>6.4 CARDS DE RESULTADOS WHAT-IF (ANTES/DESPUÉS)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.whatif-compare-2col-box</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('whatif-result')}
                        title="Abrir resultados What-If en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid con separación limpia de 12px y tipografía homologada */}
                <div className="whatif-compare-grid-cards" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="whatif-compare-card-block normal">
                    <span className="whatif-compare-card-title">Caudal total inyectado</span>
                    <div className="whatif-compare-2col-box">
                      <div className="whatif-col">
                        <span className="whatif-col-lbl">Antes</span>
                        <span className="whatif-col-val">925 m³/s</span>
                      </div>
                      <div className="whatif-col">
                        <span className="whatif-col-lbl">Después</span>
                        <span className="whatif-col-val">925 m³/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="whatif-compare-card-block degraded">
                    <span className="whatif-compare-card-title">Margen mínimo hasta el umbral</span>
                    <div className="whatif-compare-2col-box">
                      <div className="whatif-col">
                        <span className="whatif-col-lbl">Antes</span>
                        <span className="whatif-col-val">1.9 min</span>
                      </div>
                      <div className="whatif-col">
                        <span className="whatif-col-lbl">Después</span>
                        <span className="whatif-col-val" style={{ color: '#ef4444' }}>
                          1.4 min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consecuencias proyectadas matching sketch media_1793854997435_ef0863f7.jpg */}
                <div className="whatif-consequence-card-styled critical">
                  <div className="whatif-card-top-row">
                    <b className="whatif-card-title">Nivel 2 - Este pierde 100% de caudal</b>
                    <button className="whatif-target-btn" title="Localizar en 3D">
                      <Target size={15} />
                    </button>
                  </div>
                  <p className="whatif-card-desc">
                    Caudal de 0 a 0 m³/s (requerido 43 m³/s). 4 persona(s) en zona. Margen hasta umbral: 2 h.
                  </p>
                  <div className="row between whatif-card-bottom-row">
                    <span className="whatif-card-level-label">Crítico</span>
                    <span className="whatif-card-time-label">a los 2.3 h</span>
                  </div>
                </div>

                <div className="whatif-consequence-card-styled critical">
                  <div className="whatif-card-top-row">
                    <b className="whatif-card-title">3 persona(s) sin refugio asignado</b>
                    <button className="whatif-target-btn" title="Localizar en 3D">
                      <Target size={15} />
                    </button>
                  </div>
                  <p className="whatif-card-desc">
                    Carlos Martínez, Ricardo Flores, Hugo Romero. Capacidad de refugios agotada o rutas bloqueadas.
                  </p>
                  <div className="row between whatif-card-bottom-row">
                    <span className="whatif-card-level-label">Crítico</span>
                    <span className="whatif-card-time-label">a los 2.3 h</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

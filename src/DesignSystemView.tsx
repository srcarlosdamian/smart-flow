import { useState } from 'react'
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
import { NexoLogo } from './App'
import logoUrl from './assets/smartflow-logo.png'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  onBackToApp: () => void
  onNavigateToLocation?: (target: string) => void
}

type SectionTab = 'all' | 'toolbars' | 'dropdowns' | 'buttons' | 'badges' | 'ia' | 'cards'

export default function DesignSystemView({ theme, onToggleTheme, onBackToApp, onNavigateToLocation }: Props) {
  const [activeTab, setActiveTab] = useState<SectionTab>('all')

  // Interactive states for live toolbars & dropdowns
  const [activeSidebarTool, setActiveSidebarTool] = useState<string>('box')
  const [activeLevel, setActiveLevel] = useState<string>('L1')
  const [activeSurfaceMode, setActiveSurfaceMode] = useState<'sat' | 'map' | 'rel'>('sat')
  const [openDd, setOpenDd] = useState<string | null>('proj')
  const [selectedProj, setSelectedProj] = useState<string>('3D - Perspectiva')
  const [selectedCam, setSelectedCam] = useState<string>('Superior')
  const [selectedZoom, setSelectedZoom] = useState<number>(50)
  const [nexoEnabled, setNexoEnabled] = useState<boolean>(true)
  const [nexoAutoAlerts, setNexoAutoAlerts] = useState<boolean>(true)
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
          padding: '10px 20px',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            className="user-top-back-btn no-border"
            onClick={onBackToApp}
            title="Volver a SmartFlow"
            aria-label="Volver a SmartFlow"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>SmartFlow · Sistema de Diseño</h1>
              <span className="pump-badge-v2 marcha">v2.5 Homologado</span>
              <span style={codePillStyle}>{isLight ? 'Modo Claro (#dfe7ef)' : 'Modo Oscuro (#0a1c30)'}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Componentes reales vinculados en vivo a <code>App.css</code> y <code>App.tsx</code> — Toolbars, Dropdowns interactivos, Botones (Full / Auto), Badges y Nexo IA
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div className="seg-row" style={{ padding: 3 }}>
            {(
              [
                ['all', 'Todo'],
                ['toolbars', 'Toolbars & Players'],
                ['dropdowns', 'Dropdowns (Live)'],
                ['buttons', 'Botones (Full / Auto)'],
                ['badges', 'Badges & 3D'],
                ['ia', 'Nexo IA'],
                ['cards', 'Cards & Listas'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                className={activeTab === id ? 'on' : ''}
                onClick={() => setActiveTab(id)}
                style={{ padding: '4px 10px', fontSize: 12, whiteSpace: 'nowrap' }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="user-top-back-btn no-border"
            onClick={onToggleTheme}
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            style={{ width: 36, height: 36 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="cta no-shadow"
            onClick={onBackToApp}
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
                    {/* Componente Canónico Unificado: Siempre con Botón de Buscar */}
                    <div className="user-detail-topbar" style={{ position: 'relative', margin: 0 }}>
                      <button className="user-top-back-btn no-border" title="Volver">
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
                Haz clic en cualquier disparador (<code>.dd-trigger</code>, <code>.nexo-settings-btn</code>, <code>.section-action-btn</code>) para abrir/cerrar su menú flotante real (<code>.dd-menu</code>, <code>.zoom-menu</code>, <code>.nexo-settings-menu</code>, <code>.track-add-menu</code>, <code>.sim-add-menu</code>, <code>.personal-checklist-menu</code>).
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

              {/* 2.2 Nexo IA Settings Dropdown + Agregar Tracking Dropdown */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 410 }}>
                <div>
                  <div style={labelTagStyle}>
                    <span>2.2 CONFIGURACIÓN NEXO IA &amp; AGREGAR TRACKING</span>
                    <span style={codePillStyle}>.nexo-settings-menu</span>
                  </div>

                  {/* Nexo Bar with Gear Trigger */}
                  <div className="nexo-bar-wrap">
                    <div className={`nexo-bar ${!nexoEnabled ? 'disabled' : ''}`}>
                      <button className="nexo-open-trigger">
                        <span className="nexo-title">
                          <NexoLogo /> Pregúntale a Nexo IA
                        </span>
                      </button>
                      <button
                        className={`nexo-settings-btn ${openDd === 'nexoSettings' ? 'active' : ''}`}
                        onClick={() => setOpenDd(openDd === 'nexoSettings' ? null : 'nexoSettings')}
                        title="Abrir dropdown de Configuración Nexo IA"
                      >
                        <Settings size={17} />
                      </button>
                    </div>

                    {openDd === 'nexoSettings' && (
                      <div className="dd-menu nexo-settings-menu" style={{ position: 'relative', top: 8 }}>
                        <div className="dd-group-title">CONFIGURACIÓN NEXO IA</div>
                        <div
                          className="row between switch-row nexo-switch-row"
                          onClick={() => setNexoEnabled((v) => !v)}
                        >
                          <div className="nexo-switch-text">
                            <span>Asistente Nexo IA</span>
                            <small>{nexoEnabled ? 'Activo en el entorno' : 'Desactivado'}</small>
                          </div>
                          <span className={`mui-switch ${nexoEnabled ? 'checked' : ''}`}>
                            <span className="mui-switch-track" />
                            <span className="mui-switch-thumb" />
                          </span>
                        </div>
                        <div className="dd-divider" />
                        <div
                          className="row between switch-row nexo-switch-row"
                          onClick={() => setNexoAutoAlerts((v) => !v)}
                        >
                          <div className="nexo-switch-text">
                            <span>Sugerencias automáticas</span>
                            <small>Alertas proactivas del turno</small>
                          </div>
                          <span className={`mui-switch ${nexoAutoAlerts ? 'checked' : ''}`}>
                            <span className="mui-switch-track" />
                            <span className="mui-switch-thumb" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agregar Tracking Popover */}
                <div>
                  <div className="section" style={{ borderTop: '1px solid var(--line)' }}>
                    <div
                      className="section-head"
                      onClick={() => setOpenDd(openDd === 'addTrack' ? null : 'addTrack')}
                    >
                      <span>Tracking (Clic en + para abrir menú)</span>
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

                    {openDd === 'addTrack' && (
                      <div className="dd-menu track-add-menu" style={{ position: 'relative', top: 4, left: 0 }}>
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
                  <div className="row between" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      Sala de bombeo SB-01
                    </span>
                    <button
                      className="no-border"
                      style={{ background: 'transparent', cursor: 'pointer', color: 'var(--muted)', padding: 2 }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="row gap-2" style={{ alignItems: 'center' }}>
                    <Droplets size={15} style={{ color: '#00b0ff' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0284c7' }}>Sala de bombeo</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="row between" style={{ fontSize: 13 }}>
                      <span style={{ color: 'var(--text)' }}>Nivel del sumidero</span>
                      <b style={{ color: '#ef4444', fontWeight: 700 }}>85%</b>
                    </div>
                    {/* Neutral progress bar */}
                    <div className="player-seekbar-bg" style={{ height: 6, margin: '2px 0' }}>
                      <div className="player-seekbar-fill" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="row between" style={{ fontSize: 13, color: 'var(--text)' }}>
                    <span>Bombas en marcha</span>
                    <b>3 / 4</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13, color: 'var(--text)' }}>
                    <span>Caudal total</span>
                    <b>157 L/s</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13, color: 'var(--text)' }}>
                    <span>Presión de descarga</span>
                    <b>12.4 bar</b>
                  </div>

                  <button
                    className="cta full no-shadow"
                    style={{
                      marginTop: 6,
                      height: 40,
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onClick={() => {
                      if (onNavigateToLocation) onNavigateToLocation('interior-sb01')
                    }}
                  >
                    <SquareArrowOutUpRight size={16} />
                    <span>Entrar</span>
                  </button>

                  <small style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', margin: '2px 0 0 0' }}>
                    Vista interior del lugar
                  </small>
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

                {/* Emergency Declare Evacuation Button */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Emergencia / Peligro (#ef4444)</b> — <code>.cta.full.no-shadow</code>
                  </small>
                  <button
                    className="cta full no-shadow"
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      padding: '12px 18px',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <span>Declarar la evacuación</span>
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
        {/* 4. UNIFIED BADGE SYSTEM (Organizado por Tipo y Paleta Semántica)    */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'badges') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={20} style={{ color: '#166534' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  4. Sistema Unificado de Badges (Organizado por Tipo: Fondo 100 / Texto 800 / Semibold)
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Todos los badges del sistema homologados a la misma geometría: <code>border-radius: 6px</code>, padding uniforme <code>3px 8px</code>, tipografía <code>font-weight: 600</code> (Semibold) y paleta tonal <b>Fondo 100 / Texto 800</b>.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {/* 4.1 Badges de Estado Verde */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.1 BADGES VERDES (POSITIVO / OPERATIVO / ÉXITO)</span>
                  <span style={codePillStyle}>Fondo #dcfce7 / Texto #166534</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <span className="user-signal-badge online">En línea</span>
                    <code style={codePillStyle}>.user-signal-badge.online</code>
                  </div>
                  <div className="row between">
                    <span className="green-badge">Operativo</span>
                    <code style={codePillStyle}>.green-badge</code>
                  </div>
                  <div className="row between">
                    <span className="green-badge">En marcha</span>
                    <code style={codePillStyle}>.green-badge (homologado sin punto)</code>
                  </div>
                  <div className="row between">
                    <span className="user-ai-status">Óptimo</span>
                    <code style={codePillStyle}>.user-ai-status</code>
                  </div>
                  <div className="row between">
                    <span className="enlace-activo-badge">Enlace activo</span>
                    <code style={codePillStyle}>.enlace-activo-badge</code>
                  </div>
                  <div className="row between">
                    <span className="cmd-pill-activo">Activo</span>
                    <code style={codePillStyle}>.cmd-pill-activo</code>
                  </div>
                </div>
              </div>

              {/* 4.2 Badges de Alerta y Falla Roja */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.2 BADGES ROJOS (PELIGRO / CRÍTICO / FALLA)</span>
                  <span style={codePillStyle}>Fondo #fee2e2 / Texto #991b1b</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <span className="evac-alert-tag-critical">En falla</span>
                    <code style={codePillStyle}>.evac-alert-tag-critical (sin punto)</code>
                  </div>
                  <div className="row between">
                    <span className="evac-alert-tag-critical">Crítico</span>
                    <code style={codePillStyle}>.evac-alert-tag-critical</code>
                  </div>
                  <div className="row between">
                    <span className="whatif-severity-tag critical">Crítico</span>
                    <code style={codePillStyle}>.whatif-severity-tag.critical</code>
                  </div>
                  <div className="row between">
                    <span className="auxilio-status-critical">Crítico</span>
                    <code style={codePillStyle}>.auxilio-status-critical</code>
                  </div>
                  <div className="row between">
                    <span className="alert-pill">
                      <b>1</b> <CircleAlert size={12} />
                    </span>
                    <code style={codePillStyle}>.alert-pill</code>
                  </div>
                </div>
              </div>

              {/* 4.3 Badges de Advertencia Naranja y Amarillo */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.3 BADGES NARANJA &amp; AMARILLO (ADVERTENCIA / SEVERIDAD)</span>
                  <span style={codePillStyle}>Fondo 100 / Texto 800</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <span className="whatif-severity-tag high">alto</span>
                    <code style={codePillStyle}>.whatif-severity-tag.high (#ffedd5 / #9a3412)</code>
                  </div>
                  <div className="row between">
                    <span className="whatif-severity-tag medium">medio</span>
                    <code style={codePillStyle}>.whatif-severity-tag.medium (#fef9c3 / #854d0e)</code>
                  </div>
                  <div className="row between">
                    <span className="whatif-severity-tag aviso">aviso</span>
                    <code style={codePillStyle}>.whatif-severity-tag.aviso</code>
                  </div>
                  <div className="row between">
                    <span className="whatif-severity-tag critical">crítico</span>
                    <code style={codePillStyle}>.whatif-severity-tag.critical</code>
                  </div>
                  <div className="row between">
                    <span className="ai-nexo-tag">nexo ia</span>
                    <code style={codePillStyle}>.ai-nexo-tag (gradiente metálico)</code>
                  </div>
                </div>
              </div>

              {/* 4.4 Badges con Ícono (Área: Interior & Superficie) */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.4 BADGES CON ÍCONO (ÁREA: INTERIOR &amp; SUPERFICIE)</span>
                  <span style={codePillStyle}>Fondo 100 / Texto 800 + Ícono</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <div className="player-area-chip interior">
                      <SquareArrowOutUpRight size={13} />
                      <span className="chip-label">interior</span>
                      <span className="chip-count">4</span>
                    </div>
                    <code style={codePillStyle}>.player-area-chip.interior (#f3e8ff / #6b21a8)</code>
                  </div>
                  <div className="row between">
                    <div className="player-area-chip superficie">
                      <SquareArrowOutUpRight size={13} />
                      <span className="chip-label">superficie</span>
                      <span className="chip-count">2</span>
                    </div>
                    <code style={codePillStyle}>.player-area-chip.superficie (#dbeafe / #1e40af)</code>
                  </div>
                  <div className="row between">
                    <div className="player-area-chip neutral">
                      <span className="chip-label">sector norte</span>
                    </div>
                    <code style={codePillStyle}>.player-area-chip.neutral (homologado, sin icono)</code>
                  </div>
                  <div className="row between">
                    <div className="chips-row" style={{ flex: 1, maxWidth: 200 }}>
                      <span>8 núcleos · 8 GB</span>
                    </div>
                    <code style={codePillStyle}>.chips-row span</code>
                  </div>
                </div>
              </div>

              {/* 4.5 Badges Neutrales & En Espera */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.5 BADGES NEUTRALES (EN ESPERA / DESACTIVADO)</span>
                  <span style={codePillStyle}>Fondo #f1f5f9 / Texto #334155</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <span className="auxilio-status-unattended">En reserva</span>
                    <code style={codePillStyle}>.auxilio-status-unattended (sin punto)</code>
                  </div>
                  <div className="row between">
                    <span className="auxilio-status-unattended">Sin atender</span>
                    <code style={codePillStyle}>.auxilio-status-unattended</code>
                  </div>
                  <div className="row between">
                    <span className="status-badge-unapplied">Sin aplicar</span>
                    <code style={codePillStyle}>.status-badge-unapplied</code>
                  </div>
                  <div className="row between">
                    <span className="auxilio-status-unattended">Horizonte 30m</span>
                    <code style={codePillStyle}>.auxilio-status-unattended (homologado)</code>
                  </div>
                  <div className="row between">
                    <span className="auxilio-status-unattended">Por defecto</span>
                    <code style={codePillStyle}>.auxilio-status-unattended (homologado)</code>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.6 In-Scene 3D Badges (Sala de Bombeo, Personal con Blur Icon, Simulación de Vehículos y Superficie) */}
            <div className="glass" style={cardSurfaceStyle}>
              <div style={labelTagStyle}>
                <span>
                  4.6 BADGES FLOTANTES EN ESCENA 3D (TRANSPARENTE CON BLUR, TEXTO BLANCO &amp; BOLITA)
                </span>
                <span style={codePillStyle}>In-Scene 3D Overlays Homologados</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  alignItems: 'center',
                  padding: '18px 20px',
                  borderRadius: 12,
                  background: theme === 'dark' ? '#0f172a' : '#ffffff',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                }}
              >
                {/* Pump 3D Badge: Marcha (Top box with green dot + flow) */}
                <div
                  className="bombeo-3d-badge marcha"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <div className="bombeo-badge-top-box">
                    <span className="callout-dot green" />
                    <span>B-01</span>
                  </div>
                  <div className="bombeo-badge-bottom-box">75 L/s</div>
                </div>

                {/* Pump 3D Badge: Reserva (Top box with yellow dot + reserva) */}
                <div
                  className="bombeo-3d-badge reserva"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <div className="bombeo-badge-top-box">
                    <span className="callout-dot yellow" />
                    <span>B-03</span>
                  </div>
                  <div className="bombeo-badge-bottom-box reserva">RESERVA</div>
                </div>

                {/* Pump 3D Badge: Falla (Top box with red dot + falla) */}
                <div
                  className="bombeo-3d-badge falla"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <div className="bombeo-badge-top-box">
                    <span className="callout-dot red" />
                    <span>B-04</span>
                  </div>
                  <div className="bombeo-badge-bottom-box falla">FALLA</div>
                </div>

                {/* Sump 3D Badge (Sumidero with cyan dot) */}
                <div
                  className="bombeo-3d-sump-badge"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <span className="callout-dot cyan" />
                  <span>SUMIDERO 64%</span>
                </div>

                {/* Interior Worker 3D Badge (Manuel Reyes) */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="callout-dot green" />
                  <span>MANUEL REYES</span>
                </div>

                {/* Simulated Vehicle 3D Badge (Jumbo J-01) */}
                <div
                  className="bombeo-3d-badge"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <div className="bombeo-badge-top-box">
                    <span className="callout-dot green" />
                    <span>JUMBO J-01</span>
                  </div>
                  <div className="bombeo-badge-bottom-box">PERFORACIÓN</div>
                </div>

                {/* Surface Worker Marker (Juan García) */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="callout-dot green" />
                  <span>JUAN GARCÍA</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 5. NEXO IA · ANIMATIONS (BorderBeam), BUTTONS & DRAWER ELEMENTS    */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'ia') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} style={{ color: '#546e7a' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  5. Nexo IA · Animación Perimetral (BorderBeam), Botones &amp; Drawer
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Animación inspirada en <code>https://libraries.dev/beam</code> con los colores metálicos del gradiente Nexo IA (<code>#455a64</code>, <code>#546e7a</code>, <code>#90a4ae</code>) y todos los componentes del asistente.
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
                  }}
                >
                  <div className="user-ai-card-top">
                    <div className="user-ai-tag">
                      <NexoLogo width={14} height={16} color="#546e7a" />
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

              {/* All Nexo IA Buttons */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>5.2 BOTONES Y TRIGGERS NEXO IA</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.ia-gradient</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('nexo-drawer')}
                        title="Abrir Nexo IA en SmartFlow"
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
                        <NexoLogo /> Pregúntale a Nexo IA
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Botón Mediano Full-Width */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>2. Botón Mediano Full (Full-Width · Altura 36px)</b> — <code>.consultar-nexo-btn.ia-gradient</code>
                  </small>
                  <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0, width: '100%', height: 36, fontSize: 13 }}>
                    <NexoLogo width={14} height={16} color="#ffffff" />
                    <span>Consultar estado con Nexo IA</span>
                  </button>
                </div>

                {/* 3. Botón Mediano Auto-Width (Exactamente igual pero auto) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>3. Botón Mediano Auto (Auto-Width · Altura 36px)</b> — <code>.consultar-nexo-btn.ia-gradient (auto)</code>
                  </small>
                  <div style={{ display: 'flex' }}>
                    <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0, width: 'auto', height: 36, padding: '0 16px', fontSize: 13 }}>
                      <NexoLogo width={14} height={16} color="#ffffff" />
                      <span>Preguntar a Nexo IA</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Nexo Drawer Components (Avatar, Chat Bubbles & Prompt Box) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={labelTagStyle}>
                  <span>5.3 COMPONENTES DEL DRAWER NEXO IA</span>
                  <span style={codePillStyle}>.nexo-drawer</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="nexo-avatar-circle">
                    <NexoLogo width={20} height={24} color="#ffffff" />
                  </div>
                  <div>
                    <b style={{ fontSize: 15 }}>¿En qué puedo ayudarte?</b>
                    <small style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                      <code>.nexo-avatar-circle</code> (52×52px) + <code>.nexo-greeting</code>
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
                    placeholder="Pregúntale a Nexo IA sobre la mina..."
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

              {/* 6.2 Petición de Auxilio (.auxilio-card) & Evacuación (.evacuacion-alert-card) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>6.2 PATRÓN PETICIÓN DE AUXILIO / ALERTAS ACTIVAS</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={codePillStyle}>.auxilio-card</span>
                    {onNavigateToLocation && (
                      <button
                        className="ds-open-app-btn"
                        onClick={() => onNavigateToLocation('peticion-auxilio')}
                        title="Abrir alerta de auxilio en SmartFlow"
                      >
                        <SquareArrowOutUpRight size={12} />
                        <span>Abrir en app</span>
                      </button>
                    )}
                  </div>
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
                    <span className="metric-cell-value">152 L/s</span>
                  </div>
                  <div className="interior-metric-cell">
                    <span className="metric-cell-label">En falla</span>
                    <span className="metric-cell-value text-red">1</span>
                  </div>
                </div>

                {[
                  { id: 'BA-01', status: 'marcha' as const, statusText: 'En marcha', temp: '48 °C', flow: '78 L/s · 4.2 bar', hours: '1,240 h', pct: 78 },
                  { id: 'BA-04', status: 'falla' as const, statusText: 'En falla', temp: '78 °C', flow: '0 L/s · 0.0 bar', hours: '2,150 h', pct: 100 },
                ].map((p) => {
                  const isSel = selectedPump === p.id
                  return (
                    <div
                      key={p.id}
                      className={`bombeo-pump-card-v2 ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedPump(p.id)}
                    >
                      <div className="bombeo-pump-v2-header">
                        <div className="row gap-2">
                          <span className={`pump-status-dot-v2 ${p.status}`} />
                          <b style={{ fontSize: 14, color: 'var(--text)' }}>{p.id}</b>
                        </div>
                        <div className="row gap-2">
                          <span className={`pump-badge-v2 ${p.status}`}>{p.statusText}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: p.status === 'falla' ? '#ef4444' : '#64748b' }}>
                            {p.temp}
                          </span>
                        </div>
                      </div>
                      <div className="row between" style={{ fontSize: 12, color: '#64748b' }}>
                        <span>{p.flow}</span>
                        <span>{p.hours}</span>
                      </div>
                      <div className="pump-bar-v2-track">
                        <div className={`pump-bar-v2-fill ${p.status}`} style={{ width: `${p.pct}%` }} />
                      </div>
                      {isSel && (
                        <button
                          className="consultar-nexo-btn ia-gradient"
                          style={{ marginTop: 6, marginBottom: 0, padding: '7px 12px', fontSize: 12 }}
                        >
                          <NexoLogo width={12} height={14} color="#ffffff" />
                          <span>Preguntar a Nexo sobre {p.id}</span>
                        </button>
                      )}
                    </div>
                  )
                })}
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

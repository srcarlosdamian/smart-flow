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
  CheckCheck,
  AlertTriangle,
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
  ExternalLink,
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
  User,
  CornerDownLeft,
  History,
  X,
} from 'lucide-react'
import { NexoLogo } from './App'
import { BorderBeam } from './BorderBeam'
import logoUrl from './assets/smartflow-logo.png'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  onBackToApp: () => void
}

type SectionTab = 'all' | 'toolbars' | 'dropdowns' | 'buttons' | 'badges' | 'ia' | 'cards'

export default function DesignSystemView({ theme, onToggleTheme, onBackToApp }: Props) {
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

  // BorderBeam playground state
  const [beamSpeed, setBeamSpeed] = useState<number>(8)
  const [beamSize, setBeamSize] = useState<number>(220)

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
            style={{
              padding: '8px 14px',
              fontSize: 13,
              borderRadius: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Volver al Gemelo 3D</span>
            <ExternalLink size={14} />
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
                    <span>1.3 SUB-HEADERS STICKY DE DETALLE</span>
                    <span style={codePillStyle}>.user-detail-topbar</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Variant A: With Search Button */}
                    <div className="user-detail-topbar" style={{ position: 'relative', margin: 0 }}>
                      <button className="user-top-back-btn" title="Volver">
                        <ChevronLeft size={18} />
                      </button>
                      <div className="user-top-crumb">
                        <span className="crumb-prefix">Inicio / </span>
                        <span className="crumb-name">Victor Navarro</span>
                      </div>
                      <button className="user-top-search-btn" title="Buscar">
                        <Search size={18} />
                      </button>
                    </div>

                    {/* Variant B: Interior Breadcrumb */}
                    <div className="user-detail-topbar" style={{ position: 'relative', margin: 0 }}>
                      <button className="user-top-back-btn no-border" title="Volver">
                        <ChevronLeft size={18} />
                      </button>
                      <div className="user-top-crumb">
                        <span className="crumb-prefix">Interiores / </span>
                        <span className="crumb-name">
                          <b>Sala de bombeo SB-01</b>
                        </span>
                      </div>
                    </div>

                    {/* Variant C: Evacuation / What-If Breadcrumb */}
                    <div className="user-detail-topbar" style={{ position: 'relative', margin: 0 }}>
                      <button className="user-top-back-btn no-border" title="Volver">
                        <ChevronLeft size={18} />
                      </button>
                      <div className="user-top-crumb">
                        <span className="crumb-prefix">Inicio / Evacuación d... / </span>
                        <span className="crumb-name">
                          <b>Resultados</b>
                        </span>
                      </div>
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
                  1.5 REPRODUCTORES DE LÍNEA DE TIEMPO — Homologados en transparencia y borde lineal con <code>.sidebar</code>
                </span>
                <span style={codePillStyle}>.recorrido-player &amp; .whatif-simulation-player</span>
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

                  <div className="whatif-player-slider-row">
                    <input
                      type="range"
                      className="whatif-player-slider"
                      min={0}
                      max={30}
                      value={whatIfSlider}
                      onChange={(e) => setWhatIfSlider(Number(e.target.value))}
                    />
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
                  <span style={codePillStyle}>.dd-trigger + .dd-menu</span>
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
                          <div className="sim-category-title">{group.cat}</div>
                          {group.items.map((it) => {
                            const Icon = it.icon
                            return (
                              <button key={it.label} className="sim-cat-item">
                                <Icon size={18} style={{ color: it.color }} />
                                <span>{it.label}</span>
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
                  <span style={codePillStyle}>.personal-checklist-menu</span>
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
                    className="dd-trigger full grow"
                    onClick={() => setOpenDd(openDd === 'whatifTarget' ? null : 'whatifTarget')}
                  >
                    <span>Nodo What-If</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                {openDd === 'shiftStart' && (
                  <div className="dd-menu time-picker-menu" style={{ position: 'relative', top: 0, width: '100%' }}>
                    {['06:00', '08:00', '10:00', '12:00'].map((t) => (
                      <button
                        key={t}
                        className={`dd-item ${shiftStart === t ? 'selected' : ''}`}
                        onClick={() => {
                          setShiftStart(t)
                          setOpenDd('personalSearch')
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
                      'Ventilador secundario V-SA-01',
                      'Subestación eléctrica CD-MT-01',
                    ].map((item) => (
                      <button
                        key={item}
                        className={`dd-item ${whatIfTarget === item ? 'selected' : ''}`}
                        onClick={() => {
                          setWhatIfTarget(item)
                          setOpenDd('personalSearch')
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
                      {Object.values(checkedPeople).filter(Boolean).length}/4 SELECCIONADO
                    </span>
                    <button onClick={() => setCheckedPeople({})}>QUITAR TODOS</button>
                  </div>
                  <div className="checklist-scroll" style={{ maxHeight: 'none', overflowY: 'visible' }}>
                    {[
                      { id: 'p1', name: 'Juan García', sub: 'Acarreo · Camión T-01' },
                      { id: 'p2', name: 'María López', sub: 'Perforación · Jumbo J-02' },
                      { id: 'p3', name: 'Pedro Ramírez', sub: 'Seguridad · Nivel N02' },
                      { id: 'p4', name: 'Victor Navarro', sub: 'Operador · Nivel 3 - Sector B' },
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
                  <span style={codePillStyle}>.cta / .esc-primary-btn</span>
                </div>

                {/* Full width CTA */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width (100%)</b> — <code>.cta.full.no-shadow</code> (Entrar a recinto, Editar ajustes)
                  </small>
                  <button
                    className="cta full no-shadow"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span>Entrar</span>
                  </button>
                </div>

                {/* Auto width CTA */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Auto-Width (fit-content)</b> — <code>.cta.no-shadow</code> (Botón en barra o formulario)
                  </small>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button className="cta no-shadow">Simular escenario</button>
                    <button
                      className="cta no-shadow"
                      style={{ padding: '8px 14px', fontSize: 13, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <span>Ir a la Mina</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>

                {/* Escenario Primary Button */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Sólido (#0288d1)</b> — <code>.esc-primary-btn</code> (Condiciones del escenario)
                  </small>
                  <button className="esc-primary-btn">Aplicar condiciones al escenario</button>
                </div>

                {/* Interior Enter Button */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Recinto Interior (44px)</b> — <code>.interior-enter-btn</code>
                  </small>
                  <button className="interior-enter-btn">
                    <span>Ingresar a Sala de Bombeo SB-01</span>
                  </button>
                </div>

                {/* Emergency Declare Evacuation Button */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Emergencia (#ef4444)</b> — <code>.cta.full.no-shadow</code> (Declarar evacuación)
                  </small>
                  <button
                    className="cta full no-shadow"
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      width: '100%',
                    }}
                  >
                    <Siren size={16} />
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

                {/* User Action Buttons (Full width) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Acción Neutral (36px)</b> — <code>.user-action-btn</code> (Con ícono y solo texto)
                  </small>
                  <div className="user-action-buttons" style={{ marginBottom: 0 }}>
                    <button className="user-action-btn">
                      <Crosshair size={16} />
                      <span>Centrar en el mapa</span>
                    </button>
                    <button className="user-action-btn">
                      <span>Seguir usuario - Superficie</span>
                    </button>
                    <button
                      className="user-action-btn"
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <AlertTriangle size={15} />
                      <span>Terminar evacuación</span>
                    </button>
                  </div>
                </div>

                {/* Permanencia Chips (Full width left-aligned) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width Alineado a la Izquierda</b> — <code>.permanencia-chip</code> (Hover neutro sin borde azul)
                  </small>
                  <div className="permanencia-chip-list">
                    <button className="permanencia-chip">Camión T-03 · Nivel N02 (1h 45m)</button>
                    <button className="permanencia-chip">Usuario en el interior · Sala de bombeo SB-01</button>
                  </div>
                </div>

                {/* Escenario Secondary Buttons: Full vs Auto */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Full-Width vs Auto-Width</b> — <code>.esc-secondary-btn.full</code> vs <code>.esc-secondary-btn</code>
                  </small>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="esc-secondary-btn full no-shadow">
                      Descartar escenario (Full-Width)
                    </button>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className="esc-secondary-btn">Restablecer (Auto-Width)</button>
                      <button className="esc-secondary-btn">Cancelar (Auto-Width)</button>
                    </div>
                  </div>
                </div>

                {/* Flex 1 Row Buttons (.auxilio-action-btn & .auxilio-tab-btn) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Botones Flex (1/2 Fila)</b> — <code>.auxilio-action-btn</code> (Normal y <code>.active</code>) &amp; <code>.auxilio-tab-btn</code>
                  </small>
                  <div className="auxilio-card-actions" style={{ marginTop: 0, marginBottom: 8 }}>
                    <button
                      className={`auxilio-action-btn ${auxilioAttended ? 'active' : ''}`}
                      onClick={() => setAuxilioAttended((v) => !v)}
                    >
                      {auxilioAttended ? 'Atendido (Activo)' : 'Atender'}
                    </button>
                    <button className="auxilio-action-btn">Resolver</button>
                  </div>

                  <div className="auxilio-tabs-row" style={{ margin: 0 }}>
                    <button
                      className={`auxilio-tab-btn ${auxilioTab === 'sin_cerrar' ? 'active' : ''}`}
                      onClick={() => setAuxilioTab('sin_cerrar')}
                    >
                      2 sin cerrar
                    </button>
                    <button
                      className={`auxilio-tab-btn ${auxilioTab === 'resueltas' ? 'active' : ''}`}
                      onClick={() => setAuxilioTab('resueltas')}
                    >
                      1 resueltas
                    </button>
                  </div>
                </div>

                {/* Inline Link Action Buttons */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>Acciones Inline con Ícono (Auto-Width)</b> — <code>.evac-action-link-btn</code> &amp; <code>.whatif-reconfig-btn</code>
                  </small>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="evac-action-link-btn" style={{ padding: '5px 10px' }}>
                      <Check size={14} />
                      <span>Atender</span>
                    </button>
                    <button className="evac-action-link-btn" style={{ padding: '5px 10px' }}>
                      <CheckCheck size={14} />
                      <span>Resolver</span>
                    </button>
                    <button className="whatif-reconfig-btn" style={{ width: 'auto', padding: '6px 12px' }}>
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
                    <b>Todos los Botones Icon-Only del Sistema</b> (Tamaños exactos: 38px, 32px, 30px, 28px, 24px, 22px)
                  </small>
                  <div style={{ display: ' flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    {/* 38px Avatar */}
                    <button className="avatar" title=".avatar (38x38px)">
                      DS
                    </button>
                    {/* 32px Back button */}
                    <button className="user-top-back-btn" title=".user-top-back-btn (32x32px)">
                      <ChevronLeft size={18} />
                    </button>
                    {/* 32px Player Control */}
                    <button className="player-ctrl-btn" title=".player-ctrl-btn (32x32px)">
                      <Play size={18} />
                    </button>
                    {/* 28px Target Button */}
                    <button className="whatif-target-btn" title=".whatif-target-btn (28x28px)">
                      <Target size={15} />
                    </button>
                    {/* 28px Nexo Drawer Buttons */}
                    <button className="nexo-drawer-settings-btn" title=".nexo-drawer-settings-btn (28x28px)">
                      <Settings size={18} />
                    </button>
                    <button className="nexo-more-btn" title=".nexo-more-btn (28x28px)">
                      <History size={18} />
                    </button>
                    <button className="nexo-close-btn" title=".nexo-close-btn (28x28px)">
                      <X size={18} />
                    </button>
                    {/* 24px Auxilio Add */}
                    <button className="auxilio-add-btn" title=".auxilio-add-btn (24x24px)">
                      <Plus size={14} />
                    </button>
                    {/* 22px Section Action Buttons */}
                    <button className="section-action-btn" title=".section-action-btn (22x22px)">
                      <CirclePlus size={16} />
                    </button>
                    <button className="section-action-btn" title=".section-action-btn (22x22px)">
                      <Trash size={15} />
                    </button>
                    {/* Sim Remove */}
                    <button className="sim-remove-btn" title=".sim-remove-btn">
                      <CircleMinus size={18} />
                    </button>
                  </div>
                </div>

                {/* Segmented Row (.seg-row) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    <b>Control Segmentado</b> — <code>.seg-row</code> (Estadísticas de rendimiento)
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
                      <span style={{ fontSize: 13 }}>{autoPerf ? 'Automático' : 'Manual'}</span>
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
                    <b>Filas de Checkbox Neutrales</b> — <code>.whatif-check-row</code> + <code>.whatif-custom-checkbox</code>
                  </small>
                  <div className="whatif-axes-check-list" style={{ marginTop: 0 }}>
                    {[
                      ['carga', 'Flujo de carga radial'],
                      ['vent', 'Red de ventilación'],
                      ['dilucion', 'Dilución por zona'],
                    ].map(([key, label]) => {
                      const isChecked = whatIfChecks[key as keyof typeof whatIfChecks]
                      return (
                        <div
                          key={key}
                          className="whatif-check-row"
                          onClick={() =>
                            setWhatIfChecks((prev) => ({
                              ...prev,
                              [key]: !prev[key as keyof typeof whatIfChecks],
                            }))
                          }
                        >
                          <span className={`whatif-custom-checkbox ${isChecked ? 'checked' : ''}`}>
                            {isChecked && <Check size={14} />}
                          </span>
                          <span className="whatif-check-label">{label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* 4. COMPLETE INVENTORY OF ALL BADGES, PILLS & 3D MARKERS            */}
        {/* ================================================================== */}
        {(activeTab === 'all' || activeTab === 'badges') && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={20} style={{ color: '#10b981' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  4. Inventario Completo de Badges, Status Pills &amp; Etiquetas 3D
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Todos los badges existentes en la interfaz lateral, modales, reproductores y sobre el lienzo 3D documentados con su clase exacta para homologación.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {/* 4.1 Personal, Conectividad y Estado General */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.1 PERSONAL, SEÑAL &amp; CONECTIVIDAD</span>
                  <span style={codePillStyle}>5 variantes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <span className="user-signal-badge online">En línea</span>
                    <code style={codePillStyle}>.user-signal-badge.online</code>
                  </div>
                  <div className="row between">
                    <span className="user-signal-badge online">Trabajador</span>
                    <code style={codePillStyle}>.user-signal-badge.online</code>
                  </div>
                  <div className="row between">
                    <span className="enlace-activo-badge">Enlace activo</span>
                    <code style={codePillStyle}>.enlace-activo-badge</code>
                  </div>
                  <div className="row between">
                    <span className="green-badge">Operativo</span>
                    <code style={codePillStyle}>.green-badge</code>
                  </div>
                  <div className="row between">
                    <span className="status-badge-unapplied">Sin aplicar</span>
                    <code style={codePillStyle}>.status-badge-unapplied</code>
                  </div>
                  <div className="row between">
                    <span className="cmd-pill-activo">Activo</span>
                    <code style={codePillStyle}>.cmd-pill-activo</code>
                  </div>
                </div>
              </div>

              {/* 4.2 Estado de Bombas e Infraestructura Interior */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.2 BOMBAS &amp; EQUIPOS (.pump-badge-v2 / .pump-status-badge)</span>
                  <span style={codePillStyle}>6 variantes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="pump-status-dot-v2 marcha" />
                      <span className="pump-badge-v2 marcha">En marcha</span>
                    </div>
                    <code style={codePillStyle}>.pump-badge-v2.marcha</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="pump-status-dot-v2 reserva" />
                      <span className="pump-badge-v2 reserva">En reserva</span>
                    </div>
                    <code style={codePillStyle}>.pump-badge-v2.reserva</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="pump-status-dot-v2 falla" />
                      <span className="pump-badge-v2 falla">En falla</span>
                    </div>
                    <code style={codePillStyle}>.pump-badge-v2.falla</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="pump-status-badge marcha">Marcha (v1)</span>
                      <span className="pump-status-badge reserva">Reserva (v1)</span>
                      <span className="pump-status-badge falla">Falla (v1)</span>
                    </div>
                    <code style={codePillStyle}>.pump-status-badge</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="user-ai-status">Óptimo</span>
                      <span className="ai-insight-badge">Crítico</span>
                      <span className="ai-nexo-tag">NEXO IA</span>
                    </div>
                    <code style={codePillStyle}>.user-ai-status / .ai-nexo-tag</code>
                  </div>
                </div>
              </div>

              {/* 4.3 Alertas, Auxilio, Evacuación & Severidad */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.3 ALERTAS, EVACUACIÓN &amp; SEVERIDAD</span>
                  <span style={codePillStyle}>8 variantes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="alert-pill">
                        <b>1</b> <CircleAlert size={12} />
                      </span>
                      <span className="alert-pill">
                        <b>2</b> <CircleAlert size={12} />
                      </span>
                    </div>
                    <code style={codePillStyle}>.alert-pill</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="evac-alert-tag-critical">Crítico</span>
                      <span className="evac-alert-status-pill">Sin atender</span>
                      <span className="evac-alert-status-pill">Atendido</span>
                    </div>
                    <code style={codePillStyle}>.evac-alert-status-pill</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="auxilio-status-unattended" style={{ fontSize: 12 }}>Sin atender</span>
                      <span className="auxilio-status-critical" style={{ fontSize: 12 }}>Crítico</span>
                    </div>
                    <code style={codePillStyle}>.auxilio-status-*</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-3">
                      <span className="row gap-1">
                        <span className="whatif-severity-dot critical" style={{ marginTop: 0 }} />
                        <span className="whatif-severity-tag critical">Crítico</span>
                      </span>
                      <span className="row gap-1">
                        <span className="whatif-severity-dot high" style={{ marginTop: 0 }} />
                        <span className="whatif-severity-tag high">Alto</span>
                      </span>
                      <span className="row gap-1">
                        <span className="whatif-severity-dot medium" style={{ marginTop: 0 }} />
                        <span className="whatif-severity-tag medium">Medio</span>
                      </span>
                    </div>
                    <code style={codePillStyle}>.whatif-severity-*</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="whatif-chip">Parada 0% RPM</span>
                      <span className="whatif-chip">Horizonte 30m</span>
                    </div>
                    <code style={codePillStyle}>.whatif-chip</code>
                  </div>
                </div>
              </div>

              {/* 4.4 Reproductor, Buscador Global (Ctrl+K) y Metadatos */}
              <div className="glass" style={cardSurfaceStyle}>
                <div style={labelTagStyle}>
                  <span>4.4 REPRODUCTOR, TECLADO &amp; HARDWARE CHIPS</span>
                  <span style={codePillStyle}>6 variantes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="row between">
                    <div className="row gap-2">
                      <div className="player-area-chip interior">
                        <SquareArrowOutUpRight size={14} />
                        <span className="chip-label">Interior</span>
                        <span className="chip-count">4</span>
                      </div>
                      <div className="player-area-chip superficie">
                        <SquareArrowOutUpRight size={14} />
                        <span className="chip-label">Superficie</span>
                        <span className="chip-count">2</span>
                      </div>
                    </div>
                    <code style={codePillStyle}>.player-area-chip</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="player-sev-pill">Aviso</span>
                      <span className="player-sev-pill active">Crítico</span>
                    </div>
                    <code style={codePillStyle}>.player-sev-pill</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <small className="dd-tag">Alejado</small>
                      <small className="dd-tag">Por defecto</small>
                      <small className="dd-tag">Escala real</small>
                    </div>
                    <code style={codePillStyle}>.dd-tag</code>
                  </div>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="cmd-esc-badge">ESC</span>
                      <span className="cmd-key-box">
                        <ArrowUp size={11} />
                      </span>
                      <span className="cmd-key-box">
                        <CornerDownLeft size={11} />
                      </span>
                    </div>
                    <code style={codePillStyle}>.cmd-esc-badge / .cmd-key-box</code>
                  </div>
                  <div className="row between">
                    <div className="chips-row" style={{ flex: 1, maxWidth: 200 }}>
                      <span>8 núcleos</span>
                      <span>8 GB</span>
                      <span>DPR 2</span>
                    </div>
                    <code style={codePillStyle}>.chips-row span</code>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.5 In-Scene 3D Badges (Sala de Bombeo, Personal con Blur Icon, Simulación de Vehículos y Superficie) */}
            <div className="glass" style={cardSurfaceStyle}>
              <div style={labelTagStyle}>
                <span>
                  4.5 BADGES FLOTANTES EN ESCENA 3D (SALA DE BOMBEO, PERSONAL CON BLUR ICON &amp; SIMULACIÓN DE VEHÍCULOS)
                </span>
                <span style={codePillStyle}>In-Scene 3D Overlays</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 18,
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {/* Pump 3D Badge: Marcha */}
                <div
                  className="bombeo-3d-badge marcha"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <span>BA-01</span>
                  <span className="badge-flow">76 L/s</span>
                </div>

                {/* Pump 3D Badge: Reserva */}
                <div
                  className="bombeo-3d-badge reserva"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <span>BA-03</span>
                  <span style={{ fontSize: 10.5, color: '#94a3b8' }}>RESERVA</span>
                </div>

                {/* Pump 3D Badge: Falla */}
                <div
                  className="bombeo-3d-badge falla"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  <span>BA-04</span>
                  <span className="badge-alarm">⚠ FALLA</span>
                </div>

                {/* Sump 3D Badge */}
                <div
                  className="bombeo-3d-sump-badge"
                  style={{ position: 'relative', transform: 'none' }}
                >
                  SUMIDERO: 64%
                </div>

                {/* Interior Worker 3D Badge with Semi-Transparent Blurred Touch Icon */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '4px 10px 4px 5px',
                    borderRadius: 999,
                    background: 'rgba(15, 23, 42, 0.86)',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    color: '#f8fafc',
                    fontSize: 12,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.18)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.28)',
                    }}
                  >
                    <User size={12} color="#38bdf8" />
                  </span>
                  <span>M. Reyes</span>
                </div>

                {/* Simulated Vehicle 3D Badge (Jumbo J-01) */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.92)',
                    border: '1.5px solid #eab308',
                    color: '#f8fafc',
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Jumbo J-01</span>
                  <span style={{ fontSize: 10.5, color: '#94a3b8' }}>Perforación</span>
                </div>

                {/* Simulated Worker 3D Badge (Victor Navarro) */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.92)',
                    border: '1.5px solid #00e676',
                    color: '#f8fafc',
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Victor Navarro</span>
                  <span style={{ fontSize: 10.5, color: '#94a3b8' }}>Operador</span>
                </div>

                {/* Surface Worker Marker */}
                <div className="surface-worker-marker" style={{ marginLeft: 6 }}>
                  <div className="marker-pulse" />
                  <div className="marker-dot">
                    <User size={14} color="#fff" />
                  </div>
                  <div className="marker-label">
                    <b>Juan García</b>
                    <small>Camión T-01</small>
                  </div>
                </div>

                {/* Surface Region Badge */}
                <span className="surface-region-badge">SECTOR NORTE</span>
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
                  <span style={codePillStyle}>&lt;BorderBeam /&gt;</span>
                </div>

                <div
                  className="user-ai-gradient-card"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '16px 18px',
                    borderRadius: 12,
                    margin: '0 0 16px 0',
                  }}
                >
                  <BorderBeam
                    duration={beamSpeed}
                    size={beamSize}
                    colorFrom="#455a64"
                    colorMid="#90a4ae"
                    colorTo="#546e7a"
                    borderRadius={12}
                    borderWidth={2}
                  />
                  <div className="user-ai-card-top">
                    <div className="user-ai-tag">
                      <NexoLogo width={14} height={16} color={isLight ? '#455a64' : '#ffffff'} />
                      <span>IA Predictiva · Telemetría Activa</span>
                    </div>
                    <span className="user-ai-status">Óptimo</span>
                  </div>
                  <div className="user-ai-card-body">
                    <div className="user-ai-metric-row">
                      <span className="user-ai-lbl">Ruta recomendada</span>
                      <b className="user-ai-val">Rampa N02 → Refugio R-01</b>
                    </div>
                    <div className="user-ai-metric-row">
                      <span className="user-ai-lbl">Tiempo estimado</span>
                      <b className="user-ai-val">3 min 40 s</b>
                    </div>
                    <div className="user-ai-metric-row">
                      <span className="user-ai-lbl">Atmósfera en ruta</span>
                      <b className="user-ai-val" style={{ color: '#10b981' }}>
                        CO &lt; 5 ppm · O₂ 20.9%
                      </b>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div className="row between" style={{ fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)' }}>Velocidad del haz (duration)</span>
                      <b>{beamSpeed} s</b>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={18}
                      value={beamSpeed}
                      onChange={(e) => setBeamSpeed(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <div className="row between" style={{ fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)' }}>Longitud del haz (size)</span>
                      <b>{beamSize} px</b>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={380}
                      step={10}
                      value={beamSize}
                      onChange={(e) => setBeamSize(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* All Nexo IA Buttons */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>5.2 TODAS LAS VARIANTES DE BOTONES NEXO IA</span>
                  <span style={codePillStyle}>.ia-gradient</span>
                </div>

                {/* 1. Nexo Bar */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>1. Barra Principal Superior (Full-Width)</b> — <code>.nexo-bar</code>
                  </small>
                  <div className="nexo-bar">
                    <button className="nexo-open-trigger">
                      <span className="nexo-title">
                        <NexoLogo /> Pregúntale a Nexo IA
                      </span>
                    </button>
                    <button className="nexo-settings-btn">
                      <Settings size={17} />
                    </button>
                  </div>
                </div>

                {/* 2. Consultar estado con Nexo IA (Full width, no hover shift, no shadow) */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>2. Botón Consultar Estado (Full-Width · Sin sombra ni salto en hover)</b> — <code>.consultar-nexo-btn.ia-gradient</code>
                  </small>
                  <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0 }}>
                    <NexoLogo width={14} height={16} color="#ffffff" />
                    <span>Consultar estado con Nexo IA</span>
                  </button>
                </div>

                {/* 3. Compact Pump Nexo Button */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>3. Botón Contextual Compacto en Card de Bomba (Full-Width)</b> — <code>fontSize: 12px, padding: 7px 12px</code>
                  </small>
                  <button
                    className="consultar-nexo-btn ia-gradient"
                    style={{ margin: 0, padding: '7px 12px', fontSize: 12 }}
                  >
                    <NexoLogo width={12} height={14} color="#ffffff" />
                    <span>Preguntar a Nexo sobre BA-04</span>
                  </button>
                </div>

                {/* 4. Floating Interior Top Trigger (Auto-Width) & Suggestion Pill */}
                <div>
                  <small style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                    <b>4. Pill Flotante Auto-Width &amp; Sugerencia de Drawer</b> — <code>.bombeo-nexo-top-trigger</code> &amp; <code>.nexo-pill</code>
                  </small>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <button
                      className="bombeo-nexo-top-trigger"
                      style={{ position: 'relative', top: 'auto', left: 'auto' }}
                    >
                      <NexoLogo width={13} height={15} color="#ffffff" />
                      <span>Analizar anomalía BA-04</span>
                    </button>

                    <button className="nexo-pill" style={{ minHeight: 36, padding: '6px 12px', fontSize: 13 }}>
                      ¿Qué bombas están activas hoy?
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
                  <span style={codePillStyle}>.zona-row</span>
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

                  {/* Simulación Personal / Vehículo */}
                  <div className="zona-row personal-clickable-row" style={{ padding: '4px 6px', borderRadius: 6 }}>
                    <span className="zona-bar" style={{ background: '#eab308' }} />
                    <div className="zona-info">
                      <div className="zona-line1">
                        <b>Jumbo J-01</b>
                      </div>
                      <div className="zona-line2">Perforación &nbsp; Nivel 2 - Rampa Sur</div>
                    </div>
                    <span className="user-signal-badge online" style={{ fontSize: 11 }}>
                      Vehículo
                    </span>
                    <ChevronRight size={16} className="row-chevron" />
                  </div>
                </div>
              </div>

              {/* 6.2 Petición de Auxilio (.auxilio-card) & Evacuación (.evacuacion-alert-card) */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={labelTagStyle}>
                  <span>6.2 PATRÓN PETICIÓN DE AUXILIO / ALERTAS ACTIVAS</span>
                  <span style={codePillStyle}>.auxilio-card</span>
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

                <div className="evacuacion-alert-card">
                  <div className="evac-alert-top-row">
                    <div className="evac-alert-title-group">
                      <Flame size={16} style={{ color: '#ef4444' }} />
                      <b style={{ fontSize: 14, color: 'var(--text)' }}>Incendio</b>
                      <span className="evac-alert-tag-critical">Crítico</span>
                    </div>
                    <span className="evac-alert-status-pill">Sin atender</span>
                  </div>
                  <div className="evac-alert-location">Subestación Eléctrica Principal · Nivel 2</div>
                  <div className="evac-alert-meta">Reportado 14:18 · Humo detectado</div>
                  <div className="evac-alert-actions">
                    <button className="evac-action-link-btn" style={{ padding: '4px 10px' }}>
                      <Check size={14} />
                      <span>Atender</span>
                    </button>
                    <button className="evac-action-link-btn" style={{ padding: '4px 10px' }}>
                      <CheckCheck size={14} />
                      <span>Resolver</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6.3 Sala de Bombeo: 2x2 Grid + Pump Cards V2 */}
              <div className="glass" style={{ ...cardSurfaceStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={labelTagStyle}>
                  <span>6.3 SALA DE BOMBEO: GRID 2×2 &amp; CARDS DE BOMBA</span>
                  <span style={codePillStyle}>.bombeo-pump-card-v2</span>
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
                  <span style={codePillStyle}>.whatif-compare-2col-box</span>
                </div>

                <div className="whatif-compare-card-block">
                  <span className="whatif-compare-card-title">Caudal total de aire</span>
                  <div className="whatif-compare-2col-box">
                    <div className="whatif-col">
                      <span className="whatif-col-lbl">Antes</span>
                      <span className="whatif-col-val">185 m³/s</span>
                    </div>
                    <div className="whatif-col">
                      <span className="whatif-col-lbl">Después</span>
                      <span className="whatif-col-val" style={{ color: '#ef4444' }}>
                        62 m³/s
                      </span>
                    </div>
                  </div>
                </div>

                <div className="whatif-consequence-card-styled critical">
                  <div className="whatif-card-top-row">
                    <b className="whatif-card-title">Acumulación crítica de CO en Nivel 3</b>
                    <button className="whatif-target-btn" title="Localizar en 3D">
                      <Target size={15} />
                    </button>
                  </div>
                  <p className="whatif-card-desc">
                    La pérdida de impulsión reduce la dilución de gases en el frente sur por debajo del umbral seguro.
                  </p>
                  <div className="row between whatif-card-bottom-row">
                    <span className="whatif-card-level-label">Crítico</span>
                    <span className="whatif-card-time-label">a los 18 min</span>
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

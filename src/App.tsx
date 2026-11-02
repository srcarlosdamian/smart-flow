import { useState, useEffect, useRef } from 'react'
import {
  Search, Bell, Globe, Sun, Moon, Wrench, ChevronDown, ChevronUp, ChevronRight,
  CirclePlus, CircleMinus, Calendar, CircleAlert, CheckSquare, Square,
  ZoomIn, ZoomOut, SquareArrowUp, Box, SquareArrowRight, SquareMousePointer,
  Fullscreen, Upload, RulerDimensionLine, Diamond, Cable, Lightbulb, Undo2, Redo2,
  UserRoundSearch, Layers2, CircleGauge, Waypoints, AudioWaveform, Siren, Trash,
  Wind, Flame, Zap, Wifi, MapPin, Activity, Users, Eye, EyeOff, Minus,
  Grid3x3, Workflow, Check, ArrowLeft, LandPlot,
} from 'lucide-react'
import Scene3D, { type ViewMode, type Theme } from './Scene3D'
import logoUrl from './assets/smartflow-logo.png'
import './App.css'

function NexoLogo() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.30986 8.23786C1.52047 9.62654 1.94747 11.3897 3.28474 12.2633C3.70779 12.5397 4.18751 12.7021 4.67897 12.7444L3.66391 14.5026C3.16334 14.3689 2.68149 14.1558 2.23782 13.8659C0.0538579 12.4392 -0.643495 9.55972 0.6457 7.29182L4.79077 0H6.99271L2.30986 8.23786Z" fill="white" />
      <path d="M13.6265 11.7621C14.4159 10.3735 13.9889 8.61031 12.6516 7.7367C12.2286 7.46033 11.7489 7.29793 11.2574 7.25561L12.2725 5.49743C12.773 5.63113 13.2549 5.84422 13.6986 6.13406C15.8825 7.56079 16.5799 10.4403 15.2907 12.7082L11.1456 20L8.94366 20L13.6265 11.7621Z" fill="white" />
      <path d="M6.50173 9.75989H4.29979L9.89546 0H12.0974L6.50173 9.75989Z" fill="white" />
      <path d="M6.04194 19.9947H3.84L9.43567 10.2348H11.6376L6.04194 19.9947Z" fill="white" />
    </svg>
  )
}

const levels = [['L1', 'General'], ['L2', 'Sector'], ['L3', 'Zona'], ['L4', 'Equipo'], ['L5', 'Interior']]

const projections: { id: string; label: string; view: ViewMode; icon: typeof Box }[] = [
  { id: '3D - Perspectiva', label: '3D - Perspectiva', view: 'perspective', icon: Box },
  { id: '3D - Superficie', label: '3D - Superficie', view: 'perspective', icon: LandPlot },
  { id: '2D - Vista superior', label: '2D - Vista superior', view: 'top', icon: Grid3x3 },
  { id: '2D - Diagrama de planta', label: '2D - Diagrama de planta', view: 'top', icon: Workflow },
]

const cameras: { id: string; label: string; view: ViewMode; icon: typeof Box; reset?: boolean }[] = [
  { id: 'Superior', label: 'Superior', view: 'top', icon: SquareArrowUp },
  { id: 'Frontal', label: 'Frontal', view: 'perspective', icon: SquareMousePointer },
  { id: 'Derecha', label: 'Derecha', view: 'perspective', icon: SquareArrowRight },
  { id: 'Isométrica', label: 'Isométrica', view: 'isometric', icon: Box },
  { id: 'Ajustar todo', label: 'Ajustar todo', view: 'perspective', icon: Fullscreen, reset: true },
]

const zoomPresets: { val: number; label: string; tag?: string }[] = [
  { val: 25, label: '25 %', tag: 'Alejado' },
  { val: 50, label: '50 %', tag: 'Por defecto' },
  { val: 75, label: '75 %' },
  { val: 100, label: '100 %', tag: 'Escala real' },
  { val: 150, label: '150 %' },
  { val: 200, label: '200 %', tag: 'Detalle' },
]

type TrackingType = 'personal' | 'zonas' | 'perimetros' | 'recorrido' | 'escenario' | 'evacuacion'

const TRACKING_CATALOG: { id: TrackingType; label: string; menuLabel: string; color: string; icon: typeof UserRoundSearch }[] = [
  { id: 'personal', label: 'Personal y vehículos', menuLabel: 'Personal y vehículos', color: '#2196f3', icon: UserRoundSearch },
  { id: 'zonas', label: 'Zonas y áreas', menuLabel: 'Zonas y áreas', color: '#ff9800', icon: Layers2 },
  { id: 'perimetros', label: 'Perímetros', menuLabel: 'Perímetros', color: '#f44336', icon: CircleGauge },
  { id: 'recorrido', label: 'Recorrido', menuLabel: 'Recorrido', color: '#7c4dff', icon: Waypoints },
  { id: 'escenario', label: 'Escenario alterno', menuLabel: 'Escenario alterno', color: '#00bfa5', icon: AudioWaveform },
  { id: 'evacuacion', label: 'Declarar evaluación', menuLabel: 'Declarar evacuación', color: '#ff5252', icon: Siren },
]

const ZONAS_DATA = [
  { title: 'Nivel 3', sub: 'Chancador', status: 'Restringida', color: '#f44336', alert: 1, ratio: '1/3' },
  { title: 'Refugio', sub: 'R-01', status: 'Refugio', color: '#2196f3', alert: 2, ratio: '2/16' },
  { title: 'Nivel 5', sub: 'Sala de bombeo', status: 'Restringida', color: '#f44336', alert: 2, ratio: '2/4' },
  { title: 'Nivel 7', sub: 'Frente de voladura', status: 'Peligrosa', color: '#f44336', alert: 1, ratio: '1/4' },
  { title: 'Refugio', sub: 'R-04', status: 'Refugio', color: '#2196f3', alert: 1, ratio: '1/16' },
  { title: 'Rampa', sub: 'principal', status: 'Operativa', color: '#2196f3', ratio: '3/14' },
  { title: 'Nivel 1', sub: 'Galeria norte', status: 'Operativa', color: '#2196f3', ratio: '0/10' },
  { title: 'Nivel 2', sub: 'Taller mecanico', status: 'Operativa', color: '#2196f3', ratio: '2/8' },
  { title: 'Nivel 2', sub: 'Frente de avance', status: 'Operativa', color: '#2196f3', ratio: '2/6' },
  { title: 'Nivel 3', sub: 'Frente de voladura', status: 'Peligrosa', color: '#f44336', ratio: '0/4' },
  { title: 'Refugio', sub: 'R-02', status: 'Refugio', color: '#2196f3', ratio: '1/16' },
  { title: 'Nivel 4', sub: 'Galeria principal', status: 'Operativa', color: '#2196f3', ratio: '0/10' },
  { title: 'Nivel 4', sub: 'Frente de avance', status: 'Operativa', color: '#2196f3', ratio: '0/6' },
]

const PERSONAL_RECORRIDO = [
  { name: 'Ana Torres', role: 'Operador', area: 'Interior', alert: 1 },
  { name: 'Carlos Martínez', role: 'Mecánico', area: 'Exterior' },
  { name: 'Luis Pérez', role: 'Operador', area: 'Superficie' },
  { name: 'Sofía Jiménez', role: 'Mecánico', area: 'Tecnología' },
]

const PERSONAL_CHECKLIST = [
  { id: '1', name: 'Camila Cordero', sub: 'Carla Campos' },
  { id: '2', name: 'Catalina Cano', sub: 'Cayetana Castro' },
  { id: '3', name: 'César Calderón', sub: 'Carmelo Carrillo' },
  { id: '4', name: 'Celia Castañeda', sub: 'Clara Cifuentes' },
  { id: '5', name: 'Camilo Cárdenas', sub: 'Carolina Ceballos' },
  { id: '6', name: 'Candela Cortés', sub: 'Candelaria Cruz' },
  { id: '7', name: 'Carlos Carmona', sub: 'Cayetano Correa' },
  { id: '8', name: 'Carina Cifuentes', sub: 'Carmen Calderón' },
  { id: '9', name: 'Camilo Castillo', sub: 'Carla Cabrera' },
  { id: '10', name: 'Cecilia Campos', sub: 'Carlos Cordero' },
]

const simItems = [
  { icon: Wind, label: 'Flujo de aire' },
  { icon: Flame, label: 'Mapa de calor' },
  { icon: Zap, label: 'Flujo de energía' },
  { icon: Wifi, label: 'Flujo de red' },
  { icon: MapPin, label: 'Geocercas' },
  { icon: Activity, label: 'Vibraciones sísmicas' },
  { icon: Users, label: 'Movimiento de personal' },
]

function Section({
  title, open, onToggle, iconType = 'chevron', children,
}: {
  title: string; open: boolean; onToggle: () => void; iconType?: 'chevron' | 'plus'; children?: React.ReactNode
}) {
  return (
    <div className="section">
      <button className="section-head" onClick={onToggle}>
        <span>{title}</span>
        {iconType === 'plus'
          ? (open ? <ChevronUp size={16} /> : <CirclePlus size={16} />)
          : (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </button>
      {open && children && <div className="section-body">{children}</div>}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mode, setMode] = useState<ViewMode>('perspective')
  const [selectedProj, setSelectedProj] = useState('3D - Perspectiva')
  const [selectedCam, setSelectedCam] = useState<string>('')
  const [zoom, setZoom] = useState(50)
  const [ddOpen, setDdOpen] = useState<'proj' | 'zoom' | 'addTrack' | 'personalSearch' | null>(null)
  const [nexoOn, setNexoOn] = useState(true)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [perfLevel, setPerfLevel] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo')
  const [autoPerf, setAutoPerf] = useState(false)
  const [factor, setFactor] = useState(1.3)
  const [level, setLevel] = useState('L1')
  const [activeTool, setActiveTool] = useState<string>('')
  const [eyeOff, setEyeOff] = useState<Record<string, boolean>>({})

  // TRACKING state (SMF - V2 - 5 / 6 / 7 / 8)
  const [activeTrackings, setActiveTrackings] = useState<TrackingType[]>([])
  const [expandedTrack, setExpandedTrack] = useState<Record<string, boolean>>({})
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({ '3': true, '4': true })

  const panelRef = useRef<HTMLElement>(null)

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const toggleEye = (k: string) => setEyeOff((e) => ({ ...e, [k]: !e[k] }))
  const clamp = (n: number) => Math.max(10, Math.min(200, n))

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setDdOpen(null)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const addTrackingItem = (id: TrackingType) => {
    setActiveTrackings((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setExpandedTrack((prev) => ({ ...prev, [id]: true }))
    setDdOpen(null)
  }

  const removeTrackingItem = (id: TrackingType) => {
    setActiveTrackings((prev) => prev.filter((item) => item !== id))
  }

  const selectedCount = Object.values(checkedPeople).filter(Boolean).length

  return (
    <div className="app" data-theme={theme}>
      <Scene3D mode={mode} zoom={zoom} theme={theme} />

      <header className="glass topbar">
        <button className="logo-btn" aria-label="Volver" title="Volver">
          <img src={logoUrl} alt="SmartFlow" className="logo-img" />
          <span className="logo-back">
            <ArrowLeft size={18} />
          </span>
        </button>

        <div className="top-actions">
          <button aria-label="Buscar"><Search size={20} /></button>
          <button aria-label="Notificaciones"><Bell size={20} /></button>
          <button aria-label="Idioma"><Globe size={20} /></button>
          <button
            aria-label="Cambiar tema"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className="avatar">DS</span>
        </div>
      </header>

      {/* Left vertical sidebar from SMF - V2 - 3 / 17 */}
      <nav className="glass sidebar">
        <button className="icon-btn" title="Acercar" onClick={() => setZoom(clamp(zoom + 10))}><ZoomIn size={20} /></button>
        <button className="icon-btn" title="Alejar" onClick={() => setZoom(clamp(zoom - 10))}><ZoomOut size={20} /></button>
        <hr />
        <button className={`icon-btn ${mode === 'top' ? 'active' : ''}`} title="Vista superior" onClick={() => setMode('top')}><SquareArrowUp size={20} /></button>
        <button className={`icon-btn ${mode === 'perspective' ? 'active' : ''}`} title="Vista 3D" onClick={() => setMode('perspective')}><Box size={20} /></button>
        <button className={`icon-btn ${mode === 'isometric' ? 'active' : ''}`} title="Vista isométrica" onClick={() => setMode('isometric')}><SquareArrowRight size={20} /></button>
        <button className={`icon-btn ${activeTool === 'select' ? 'active' : ''}`} title="Seleccionar" onClick={() => setActiveTool('select')}><SquareMousePointer size={20} /></button>
        <hr />
        <button className="icon-btn" title="Ajustar vista" onClick={() => { setZoom(50); setMode('perspective') }}><Fullscreen size={20} /></button>
        <hr />
        <button className="icon-btn" title="Subir / Exportar"><Upload size={20} /></button>
        <hr />
        <button className={`icon-btn ${activeTool === 'ruler' ? 'active' : ''}`} title="Medir" onClick={() => setActiveTool('ruler')}><RulerDimensionLine size={20} /></button>
        <button className={`icon-btn ${activeTool === 'diamond' ? 'active' : ''}`} title="Marcadores" onClick={() => setActiveTool('diamond')}><Diamond size={20} /></button>
        <button className={`icon-btn ${activeTool === 'cable' ? 'active' : ''}`} title="Conexiones" onClick={() => setActiveTool('cable')}><Cable size={20} /></button>
        <button className={`icon-btn ${activeTool === 'light' ? 'active' : ''}`} title="Iluminación" onClick={() => setActiveTool('light')}><Lightbulb size={20} /></button>
        <button className={`icon-btn ${activeTool === 'wrench' ? 'active' : ''}`} title="Herramientas" onClick={() => setActiveTool('wrench')}><Wrench size={20} /></button>
        <hr />
        <button className="icon-btn" title="Deshacer"><Undo2 size={20} /></button>
        <button className="icon-btn" title="Rehacer"><Redo2 size={20} /></button>
      </nav>

      {/* Right column */}
      <div className="right-col">
        <button className="nexo-bar" onClick={() => setNexoOn((v) => !v)}>
          <span className="nexo-title"><NexoLogo /> Pregúntale a Nexo IA</span>
          <span className={`nexo-badge ${nexoOn ? 'on' : ''}`}>{nexoOn ? 'ON' : 'OFF'}</span>
        </button>

        <aside className="glass panel" ref={panelRef}>
          <div className="search"><span>Buscar</span><small>Ctrl + K</small><Search size={14} /></div>

          {/* 1. MODO DE VISUALIZACIÓN (SMF - V2 - 4) */}
          <div className="vis-block">
            <button className="section-head" onClick={() => toggle('vis')}>
              <span>Modo de visualización</span>
              {open.vis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open.vis && (
              <div className="vis-controls">
                <div className="row">
                  <button
                    className={`dd-trigger grow ${ddOpen === 'proj' ? 'active' : ''}`}
                    onClick={() => setDdOpen((d) => (d === 'proj' ? null : 'proj'))}
                  >
                    <span>{selectedProj}</span>
                    <ChevronDown size={16} />
                  </button>

                  <button
                    className={`dd-trigger zoom-btn ${ddOpen === 'zoom' ? 'active' : ''}`}
                    onClick={() => setDdOpen((d) => (d === 'zoom' ? null : 'zoom'))}
                  >
                    <span>{zoom} %</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* SMF - V2 - 4 Projection & Camera Popover Menu */}
                {ddOpen === 'proj' && (
                  <div className="dd-menu">
                    <div className="dd-group-title">PROYECCIÓN</div>
                    {projections.map(({ id, label, view, icon: I }) => {
                      const isSel = selectedProj === id
                      return (
                        <button
                          key={id}
                          className={`dd-item ${isSel ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedProj(id)
                            setMode(view)
                            setDdOpen(null)
                          }}
                        >
                          <I size={18} />
                          <span>{label}</span>
                          {isSel && <Check size={16} className="dd-check" />}
                        </button>
                      )
                    })}

                    <div className="dd-divider" />

                    <div className="dd-group-title">CÁMARA</div>
                    {cameras.map(({ id, label, view, icon: I, reset }) => {
                      const isSel = selectedCam === id
                      return (
                        <button
                          key={id}
                          className={`dd-item ${isSel ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedCam(id)
                            setMode(view)
                            if (reset) setZoom(50)
                            setDdOpen(null)
                          }}
                        >
                          <I size={18} />
                          <span>{label}</span>
                          {isSel && <Check size={16} className="dd-check" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* 50% Zoom Popover Menu with default prototype parameters */}
                {ddOpen === 'zoom' && (
                  <div className="dd-menu zoom-menu">
                    <div className="dd-group-title">ESCALA DE VISTA</div>
                    {zoomPresets.map(({ val, label, tag }) => {
                      const isSel = zoom === val
                      return (
                        <button
                          key={val}
                          className={`dd-item ${isSel ? 'selected' : ''}`}
                          onClick={() => {
                            setZoom(val)
                            setDdOpen(null)
                          }}
                        >
                          <span>{label}</span>
                          {tag && <small className="dd-tag">{tag}</small>}
                          {isSel && <Check size={16} className="dd-check" />}
                        </button>
                      )
                    })}
                    <div className="dd-divider" />
                    <div className="dd-group-title">PARÁMETROS DE CÁMARA</div>
                    <div className="dd-param-row"><span>FOV</span><b>50°</b></div>
                    <div className="dd-param-row"><span>Distancia focal</span><b>30 m</b></div>
                    <div className="dd-param-row"><span>Recorte cercano</span><b>0.1 m</b></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. ESTADÍSTICAS DE RENDIMIENTO (SMF - V2 - 11) */}
          <Section title="Estadísticas de rendimiento" open={!!open.perf} onToggle={() => toggle('perf')}>
            <div className="seg-row">
              {(['Bajo', 'Medio', 'Alto'] as const).map((lvl) => (
                <button key={lvl} className={perfLevel === lvl ? 'on' : ''} onClick={() => setPerfLevel(lvl)}>{lvl}</button>
              ))}
            </div>

            <div className="row between switch-row" onClick={() => setAutoPerf((v) => !v)}>
              <span>Automático</span>
              <span className={`mui-switch ${autoPerf ? 'checked' : ''}`}>
                <span className="mui-switch-track" />
                <span className="mui-switch-thumb" />
              </span>
            </div>

            <div className="perf-divider" />

            <div className="sublabel">Dispositivo</div>
            <div className="chips-row">
              <span>8 núcleos</span><span>8 GB</span><span>DPR 2</span>
            </div>
            <p className="hint">ANGLE (Apple, ANGLE Metal Renderer: Apple M2, versión no especificada)</p>

            <div className="perf-divider" />

            <div className="fps-row"><b>60</b> <span>FPS</span> <small>16,7 ms</small></div>
            <div className="stats-grid">
              <div><b>48</b><small>Triángulos</small></div>
              <div><b>9</b><small>Llamadas de di...</small></div>
              <div><b>15</b><small>Objetos</small></div>
              <div><b>42 MB</b><small>Memoria GPU</small></div>
              <div><b>37</b><small>Texturas</small></div>
              <div><b>47</b><small>Geometrías</small></div>
            </div>
          </Section>

          {/* 3. TRACKING (SMF - V2 - 5, 6, 7, 8) */}
          <div className="section track-section">
            <div className="section-head">
              <span onClick={() => setDdOpen((d) => (d === 'addTrack' ? null : 'addTrack'))} style={{ flex: 1, textAlign: 'left' }}>
                Tracking
              </span>
              <button
                className="plus-trigger"
                aria-label="Agregar tracking"
                onClick={() => setDdOpen((d) => (d === 'addTrack' ? null : 'addTrack'))}
              >
                <CirclePlus size={17} />
              </button>
            </div>

            {/* SMF - V2 - 6 Popover: AGREGAR TRACKING */}
            {ddOpen === 'addTrack' && (
              <div className="dd-menu track-add-menu">
                <div className="dd-group-title">AGREGAR TRACKING</div>
                {TRACKING_CATALOG.map(({ id, menuLabel, color, icon: I }) => (
                  <button
                    key={id}
                    className="dd-item"
                    onClick={() => addTrackingItem(id)}
                  >
                    <I size={18} style={{ color }} />
                    <span>{menuLabel}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Active Tracking Items List */}
            {activeTrackings.length > 0 && (
              <div className="section-body track-body">
                {activeTrackings.map((id) => {
                  const cfg = TRACKING_CATALOG.find((c) => c.id === id)!
                  const Icon = cfg.icon
                  const isExp = !!expandedTrack[id]
                  return (
                    <div key={id} className="track-item-block">
                      <div className="track-row-head">
                        <button
                          className="track-row-title"
                          onClick={() => setExpandedTrack((prev) => ({ ...prev, [id]: !prev[id] }))}
                        >
                          <Icon size={18} style={{ color: cfg.color }} />
                          <span>{id === 'evacuacion' && isExp ? 'Terminar evaluación' : cfg.label}</span>
                        </button>
                        <div className="track-row-actions">
                          <button title="Quitar" onClick={() => removeTrackingItem(id)}>
                            <CircleMinus size={18} />
                          </button>
                          {id !== 'evacuacion' && (
                            <button
                              title={isExp ? 'Contraer' : 'Expandir'}
                              onClick={() => setExpandedTrack((prev) => ({ ...prev, [id]: !prev[id] }))}
                            >
                              {isExp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded sub-panel for Zonas y áreas */}
                      {isExp && id === 'zonas' && (
                        <div className="track-subpanel">
                          {ZONAS_DATA.map((z, idx) => (
                            <div key={idx} className="zona-row">
                              <span className="zona-bar" style={{ background: z.color }} />
                              <div className="zona-info">
                                <div className="zona-line1">
                                  <b>{z.title}</b> <small>{z.sub}</small>
                                </div>
                                <div className="zona-line2">{z.status}</div>
                              </div>
                              {z.alert && (
                                <span className="alert-pill">
                                  <b>{z.alert}</b> <CircleAlert size={12} />
                                </span>
                              )}
                              <span className="zona-ratio">{z.ratio}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expanded sub-panel for Recorrido (SMF - V2 - 7 & 8) */}
                      {isExp && id === 'recorrido' && (
                        <div className="track-subpanel">
                          <div className="recorrido-header">
                            <span>Tramo del recorrido</span>
                            <b>Todo el turno</b>
                          </div>
                          <div className="row">
                            <button className="dd-trigger grow">
                              <span>Inicio</span>
                              <Calendar size={16} />
                            </button>
                            <button className="dd-trigger grow">
                              <span>Fin</span>
                              <Calendar size={16} />
                            </button>
                          </div>

                          <div className="recorrido-search-wrap">
                            <button
                              className={`dd-trigger full ${ddOpen === 'personalSearch' ? 'active' : ''}`}
                              onClick={() => setDdOpen((d) => (d === 'personalSearch' ? null : 'personalSearch'))}
                            >
                              <Search size={16} />
                              <span style={{ flex: 1 }}>Buscar personal</span>
                              <ChevronDown size={16} />
                            </button>

                            {/* SMF - V2 - 8 Popover: Multi-select checklist */}
                            {ddOpen === 'personalSearch' && (
                              <div className="dd-menu personal-checklist-menu">
                                <div className="checklist-head">
                                  <span>{selectedCount}/12 SELECCIONADO</span>
                                  <button onClick={() => setCheckedPeople({})}>QUITAR TODOS</button>
                                </div>
                                <div className="checklist-scroll">
                                  {PERSONAL_CHECKLIST.map((p) => {
                                    const checked = !!checkedPeople[p.id]
                                    return (
                                      <button
                                        key={p.id}
                                        className="checklist-item"
                                        onClick={() => setCheckedPeople((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                                      >
                                        {checked
                                          ? <CheckSquare size={18} className="chk-on" />
                                          : <Square size={18} className="chk-off" />}
                                        <div className="checklist-names">
                                          <b>{p.name}</b>
                                          <small>{p.sub}</small>
                                        </div>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="personal-list">
                            {PERSONAL_RECORRIDO.map((p) => (
                              <div key={p.name} className="zona-row">
                                <span className="zona-bar neutral" />
                                <div className="zona-info">
                                  <div className="zona-line1"><b>{p.name}</b></div>
                                  <div className="zona-line2">{p.role} &nbsp; {p.area}</div>
                                </div>
                                {p.alert && (
                                  <span className="alert-pill">
                                    <b>{p.alert}</b> <CircleAlert size={12} />
                                  </span>
                                )}
                                <ChevronRight size={16} className="row-chevron" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expanded sub-panel for Personal y vehículos */}
                      {isExp && id === 'personal' && (
                        <div className="track-subpanel">
                          <div className="personal-list">
                            {PERSONAL_RECORRIDO.map((p) => (
                              <div key={p.name} className="zona-row">
                                <span className="zona-bar" style={{ background: '#2196f3' }} />
                                <div className="zona-info">
                                  <div className="zona-line1"><b>{p.name}</b></div>
                                  <div className="zona-line2">{p.role} &nbsp; {p.area}</div>
                                </div>
                                {p.alert && (
                                  <span className="alert-pill">
                                    <b>{p.alert}</b> <CircleAlert size={12} />
                                  </span>
                                )}
                                <ChevronRight size={16} className="row-chevron" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expanded sub-panel for Escenario alterno */}
                      {isExp && id === 'escenario' && (
                        <div className="track-subpanel">
                          <div className="zona-row">
                            <span className="zona-bar neutral" />
                            <div className="zona-info">
                              <div className="zona-line1"><b>Condiciones del escenario</b></div>
                              <div className="zona-line2">Configuración para simular en el entorno</div>
                            </div>
                            <ChevronRight size={16} className="row-chevron" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="perf-divider" />
                <button className="clear-track-btn" onClick={() => setActiveTrackings([])}>
                  <Trash size={17} />
                  <span>Limpiar lista de seguimiento</span>
                </button>
              </div>
            )}
          </div>

          <Section title="Simulaciones" iconType="plus" open={!!open.sim} onToggle={() => toggle('sim')}>
            <ul className="item-list">
              {simItems.map(({ icon: I, label }) => (
                <li key={label}>
                  <I size={16} /><span>{label}</span>
                  <button onClick={() => toggleEye(label)}>
                    {eyeOff[label] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </li>
              ))}
              <li className="clear-item"><Trash size={16} /><span>Limpiar lista de simulación</span></li>
            </ul>
          </Section>

          <Section title="Análisis" open={!!open.ana} onToggle={() => toggle('ana')}>
            <select className="field full"><option>Buscar por zona, nivel o equipo</option></select>
            <ul className="tag-list">
              <li><span>L3 - Zona Norte</span><Minus size={16} /></li>
              <li><span>V-PH-01 (Ventilador Principal)</span><Minus size={16} /></li>
            </ul>
            <select className="field full"><option>Falla de equipo</option><option>Evacuación de emergencia</option></select>
            <div className="row between"><span>Concentración en la fuente</span><b>{factor.toFixed(1)} x</b></div>
            <input type="range" min={1} max={3} step={0.1} value={factor} onChange={(e) => setFactor(+e.target.value)} />
            <select className="field full"><option>Métrica de impacto</option></select>
            <ul className="tag-list">
              <li><span>Red de ventilación</span><Minus size={16} /></li>
              <li><span>Rutas de personal</span><Minus size={16} /></li>
            </ul>
            <button className="cta">Simular escenario</button>
          </Section>

          <Section title="Seguimiento" open={!!open.seg} onToggle={() => toggle('seg')} />
        </aside>
      </div>

      <ul className="glass levels">
        {levels.map(([k, n]) => (
          <li key={k} className={level === k ? 'on' : ''} onClick={() => setLevel(k)}><b>{k}</b> {n}</li>
        ))}
      </ul>
    </div>
  )
}

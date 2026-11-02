import { useState } from 'react'
import {
  Search, Bell, Globe, Sun, Moon, Wrench, ChevronDown, ChevronUp, CirclePlus,
  ZoomIn, ZoomOut, SquareArrowUp, Box, SquareArrowRight, SquareMousePointer,
  Fullscreen, Upload, RulerDimensionLine, Diamond, Cable, Lightbulb, Undo2, Redo2,
  UserRoundSearch, Layers2, CircleGauge, Waypoints, AudioWaveform, Siren, Trash,
  Wind, Flame, Zap, Wifi, MapPin, Activity, Users, Eye, EyeOff, Minus, Sparkles,
} from 'lucide-react'
import Scene3D, { type ViewMode, type Theme } from './Scene3D'
import './App.css'

const levels = [['L1', 'General'], ['L2', 'Sector'], ['L3', 'Zona'], ['L4', 'Equipo'], ['L5', 'Interior']]
const modes: { v: ViewMode; label: string }[] = [
  { v: 'perspective', label: '3D - Perspectiva' },
  { v: 'isometric', label: '3D - Isométrica' },
  { v: 'top', label: '2D - Planta' },
]

const trackingItems = [
  { icon: UserRoundSearch, label: 'Personal y vehículos' },
  { icon: Layers2, label: 'Zonas y áreas' },
  { icon: CircleGauge, label: 'Perímetros' },
  { icon: Waypoints, label: 'Recorrido' },
  { icon: AudioWaveform, label: 'Escenario alterno' },
  { icon: Siren, label: 'Declarar evaluación' },
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
  const [zoom, setZoom] = useState(50)
  const [nexoOn, setNexoOn] = useState(true)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [perfLevel, setPerfLevel] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo')
  const [autoPerf, setAutoPerf] = useState(false)
  const [factor, setFactor] = useState(1.3)
  const [level, setLevel] = useState('L1')
  const [activeTool, setActiveTool] = useState<string>('')
  const [eyeOff, setEyeOff] = useState<Record<string, boolean>>({})
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const toggleEye = (k: string) => setEyeOff((e) => ({ ...e, [k]: !e[k] }))
  const clamp = (n: number) => Math.max(10, Math.min(200, n))

  return (
    <div className="app" data-theme={theme}>
      <Scene3D mode={mode} zoom={zoom} theme={theme} />

      <header className="glass topbar">
        <div className="logo">S</div>
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

      {/* Left vertical sidebar from SMF - V2 - 17 */}
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

      {/* Right column from SMF - V2 - 17 */}
      <div className="right-col">
        <button className="nexo-bar" onClick={() => setNexoOn((v) => !v)}>
          <span className="nexo-title"><Sparkles size={16} /> Pregúntale a Nexo IA</span>
          <span className={`nexo-badge ${nexoOn ? 'on' : ''}`}>{nexoOn ? 'ON' : 'OFF'}</span>
        </button>

        <aside className="glass panel">
          <div className="search"><span>Buscar</span><small>Ctrl + K</small><Search size={14} /></div>

          <Section title="Modo de visualización" open={!!open.vis} onToggle={() => toggle('vis')}>
            <div className="row">
              <select value={mode} onChange={(e) => setMode(e.target.value as ViewMode)} className="field grow">
                {modes.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
              </select>
              <select value={zoom} onChange={(e) => setZoom(+e.target.value)} className="field">
                {[10, 25, 50, 75, 100, 150, 200].map((z) => <option key={z} value={z}>{z} %</option>)}
              </select>
            </div>
          </Section>

          <Section title="Estadísticas de rendimiento" open={!!open.perf} onToggle={() => toggle('perf')}>
            <div className="seg-row">
              {(['Bajo', 'Medio', 'Alto'] as const).map((lvl) => (
                <button key={lvl} className={perfLevel === lvl ? 'on' : ''} onClick={() => setPerfLevel(lvl)}>{lvl}</button>
              ))}
            </div>
            <label className="row between switch-row">
              <span>Automático</span>
              <input type="checkbox" checked={autoPerf} onChange={(e) => setAutoPerf(e.target.checked)} />
            </label>
            <div className="sublabel">Dispositivo</div>
            <div className="chips-row">
              <span>8 núcleos</span><span>8 GB</span><span>DPR 2</span>
            </div>
            <p className="hint">ANGLE (Apple, ANGLE Metal Renderer: Apple M2, versión no especificada)</p>
            <div className="fps-row"><b>60</b> <span>FPS</span> <small>16,7 ms</small></div>
            <div className="stats-grid">
              <div><b>48</b><small>Triángulos</small></div>
              <div><b>9</b><small>Llamadas de dibujo</small></div>
              <div><b>15</b><small>Objetos</small></div>
              <div><b>42 MB</b><small>Memoria GPU</small></div>
              <div><b>37</b><small>Texturas</small></div>
              <div><b>47</b><small>Geometrías</small></div>
            </div>
          </Section>

          <Section title="Tracking" iconType="plus" open={!!open.track} onToggle={() => toggle('track')}>
            <ul className="item-list">
              {trackingItems.map(({ icon: I, label }) => (
                <li key={label}>
                  <I size={16} /><span>{label}</span>
                  <button onClick={() => toggleEye(label)}>
                    {eyeOff[label] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </li>
              ))}
              <li className="clear-item"><Trash size={16} /><span>Limpiar lista de seguimiento</span></li>
            </ul>
          </Section>

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

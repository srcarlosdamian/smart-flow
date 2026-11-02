import { useState } from 'react'
import {
  Search, Bell, Globe, Sun, Moon, Compass, Calendar, Pickaxe, Factory, ShieldCheck, Wrench,
  Cpu, Settings, ChevronRight, ChevronDown, ChevronUp, ZoomIn, ZoomOut, SquareArrowUp,
  SquareMousePointer, SquareArrowRight, Box, Fullscreen, Columns3, RulerDimensionLine, Sparkles,
} from 'lucide-react'
import Scene3D, { type ViewMode, type Theme } from './Scene3D'
import './App.css'

const sideIcons = [Compass, Calendar, Pickaxe, Factory, ShieldCheck, Wrench]
const levels = [['L1', 'General'], ['L2', 'Sector'], ['L3', 'Zona'], ['L4', 'Equipo'], ['L5', 'Interior']]
const modes: { v: ViewMode; label: string }[] = [
  { v: 'perspective', label: '3D - Perspectiva' },
  { v: 'isometric', label: '3D - Isométrica' },
  { v: 'top', label: '2D - Planta' },
]

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children?: React.ReactNode }) {
  return (
    <div className="section">
      <button className="section-head" onClick={onToggle}>
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children && <div className="section-body">{children}</div>}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mode, setMode] = useState<ViewMode>('perspective')
  const [zoom, setZoom] = useState(50)
  const [open, setOpen] = useState<Record<string, boolean>>({ vis: true, sim: true })
  const [factor, setFactor] = useState(1.3)
  const [level, setLevel] = useState('L1')
  const [tool, setTool] = useState(0)
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }))
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

      <nav className="glass sidebar">
        {sideIcons.map((I, i) => <button key={i} className="icon-btn"><I size={20} /></button>)}
        <hr />
        <button className="icon-btn active"><Cpu size={20} /></button>
        <hr />
        <button className="icon-btn"><Settings size={20} /></button>
        <div className="spacer" />
        <ChevronRight size={24} />
      </nav>

      <div className="glass toolbar">
        <button onClick={() => setZoom(clamp(zoom + 10))}><ZoomIn size={20} /></button>
        <button onClick={() => setZoom(clamp(zoom - 10))}><ZoomOut size={20} /></button>
        <i className="vsep" />
        <button><SquareArrowUp size={20} /></button>
        <button><SquareMousePointer size={20} /></button>
        <button><SquareArrowRight size={20} /></button>
        <button onClick={() => setMode('perspective')}><Box size={20} /></button>
        <button onClick={() => { setZoom(50); setMode('perspective') }}><Fullscreen size={20} /></button>
        <div className="seg">
          {[Columns3, RulerDimensionLine].map((I, i) => (
            <button key={i} className={tool === i ? 'on' : ''} onClick={() => setTool(i)}><I size={24} /></button>
          ))}
        </div>
      </div>

      <aside className="glass panel">
        <span className="nexo"><Sparkles size={14} /> Trabaja con Nexo IA</span>
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
        {['Estadísticas de rendimiento', 'Tracking', 'Esquema', 'Seguimiento'].map((t) => (
          <Section key={t} title={t} open={!!open[t]} onToggle={() => toggle(t)} />
        ))}
        <Section title="Simulaciones" open={!!open.sim} onToggle={() => toggle('sim')}>
          <h3>Simulación What-If</h3>
          <select className="field full"><option>Evacuación de emergencia</option><option>Incendio</option></select>
          <p className="hint">Asigna a cada persona el refugio más cercano con capacidad disponible y proporciona la ruta, la distancia y el tiempo estimado de llegada.</p>
          <select className="field full"><option>Zona de origen</option></select>
          <select className="field full"><option>Alcance</option></select>
          <div className="row between"><span>Factor de congestión</span><b>{factor.toFixed(1)} x</b></div>
          <input type="range" min={1} max={3} step={0.1} value={factor} onChange={(e) => setFactor(+e.target.value)} />
          <textarea className="field full" placeholder="Penalización por humo, visibilidad reducida o contraflujo" rows={2} />
          <button className="cta">Simular escenario</button>
        </Section>
      </aside>

      <ul className="glass levels">
        {levels.map(([k, n]) => (
          <li key={k} className={level === k ? 'on' : ''} onClick={() => setLevel(k)}><b>{k}</b> {n}</li>
        ))}
      </ul>
    </div>
  )
}

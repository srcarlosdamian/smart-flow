import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search, Bell, Globe, Sun, Moon, Wrench, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  CirclePlus, CircleMinus, CircleAlert, CheckSquare, Square,
  ZoomIn, ZoomOut, SquareArrowUp, Box, SquareArrowRight, SquareMousePointer,
  Fullscreen, Upload, RulerDimensionLine, Diamond, Cable, Lightbulb, Undo2, Redo2,
  UserRoundSearch, Layers2, CircleGauge, Waypoints, AudioWaveform, Siren, Trash,
  Wind, Flame, Zap, Wifi, MapPin, Activity, Users, Minus,
  Grid3x3, Workflow, Check, ArrowLeft, ArrowUp, Plus, PanelRightClose, LandPlot, Settings,
  EllipsisVertical, Ellipsis, TextAlignStart, Pin, PictureInPicture2, SquareArrowOutUpRight,
  RotateCcw, FlaskConical, History, ShieldCheck,
  Droplets, Mountain, ArrowUpDown, CornerDownLeft,
  Play, Pause, ChevronsLeft, ChevronsRight, RotateCw, Bookmark, Repeat, Crosshair, Clock, Eye,
} from 'lucide-react'
import Scene3D, { type ViewMode, type Theme } from './Scene3D'
import logoUrl from './assets/smartflow-logo.png'
import './App.css'

function NexoLogo({ width = 16, height = 20 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.30986 8.23786C1.52047 9.62654 1.94747 11.3897 3.28474 12.2633C3.70779 12.5397 4.18751 12.7021 4.67897 12.7444L3.66391 14.5026C3.16334 14.3689 2.68149 14.1558 2.23782 13.8659C0.0538579 12.4392 -0.643495 9.55972 0.6457 7.29182L4.79077 0H6.99271L2.30986 8.23786Z" fill="white" />
      <path d="M13.6265 11.7621C14.4159 10.3735 13.9889 8.61031 12.6516 7.7367C12.2286 7.46033 11.7489 7.29793 11.2574 7.25561L12.2725 5.49743C12.773 5.63113 13.2549 5.84422 13.6986 6.13406C15.8825 7.56079 16.5799 10.4403 15.2907 12.7082L11.1456 20L8.94366 20L13.6265 11.7621Z" fill="white" />
      <path d="M6.50173 9.75989H4.29979L9.89546 0H12.0974L6.50173 9.75989Z" fill="white" />
      <path d="M6.04194 19.9947H3.84L9.43567 10.2348H11.6376L6.04194 19.9947Z" fill="white" />
    </svg>
  )
}

const NEXO_SUGGESTIONS = [
  'Ponme al día con el turno',
  '¿Cómo está la ventilación?',
  '¿Dónde está la gente en este momento?',
]

const NEXO_PINNED_CHATS = [
  'Reporte de turno — Nivel 3 Chancador',
  'Estado de ventilación V-PH-01',
  'Personal activo en Galería Norte',
  'Cálculo de caudal y alertas L5',
  'Rutas de evacuación Refugio R-01',
]

const NEXO_MORE_CHATS = [
  'Resumen operativo del turno matutino',
  'Monitoreo de gases en Frente de voladura',
  'Disponibilidad de equipos Jumbo J-01 y J-02',
  'Historial de alertas en Sala de bombeo',
  'Simulación de falla en ventilador principal',
  'Ubicación de cuadrilla de mantenimiento',
  'Tiempo estimado de evacuación Nivel 4',
  'Balance energético en subestación interior',
  'Inspección de geocercas y perímetros activos',
  'Bitácora de incidentes y telemetría L2',
]

// Definition for Search Command Palette (SMF - V2 - 10)
interface CommandItem {
  id: string
  title: string
  category: 'Vista' | 'Tracking' | 'Simulaciones' | 'Análisis' | 'Interiores' | 'Ingeniería'
  sub: string
  icon: any
  iconColor?: string
  active?: boolean
  disabled?: boolean
  action?: () => void
}

const AUTH_STORAGE_KEY = 'smartflow_auth_email_v2'
const AUTH_COOKIE_KEY = 'smartflow_auth_email_v2'

function normalizeInstitutionalEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

function isAllowedInstitutionalEmail(raw: string): boolean {
  const email = normalizeInstitutionalEmail(raw)
  const parts = email.split('@')
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local || local.includes(' ')) return false
  return domain === 'lasec.com.mx' || domain === 'carlosdamian.com'
}

function getSavedAuthEmail(): string | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored && isAllowedInstitutionalEmail(stored)) return normalizeInstitutionalEmail(stored)
  } catch {
    // ignore storage errors
  }
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + AUTH_COOKIE_KEY + '=([^;]*)'))
    if (match) {
      const decoded = decodeURIComponent(match[1])
      if (isAllowedInstitutionalEmail(decoded)) return normalizeInstitutionalEmail(decoded)
    }
  } catch {
    // ignore cookie errors
  }
  return null
}

function saveAuthEmail(email: string) {
  const clean = normalizeInstitutionalEmail(email)
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, clean)
  } catch {
    // ignore storage errors
  }
  try {
    // Persist for 10 years (315360000 seconds) so the browser remembers as long as possible
    document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(clean)}; max-age=315360000; path=/; SameSite=Lax`
  } catch {
    // ignore cookie errors
  }
}

function clearSavedAuthEmail() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // ignore
  }
  try {
    document.cookie = `${AUTH_COOKIE_KEY}=; max-age=0; path=/; SameSite=Lax`
  } catch {
    // ignore
  }
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

type SimulationType = 'aire' | 'calor' | 'energia' | 'red' | 'geocercas' | 'vibraciones' | 'personal'

const SIMULATION_CATALOG: { id: SimulationType; label: string; color: string; icon: typeof Wind }[] = [
  { id: 'aire', label: 'Flujo de aire', color: '#00bcd4', icon: Wind },
  { id: 'calor', label: 'Mapa de calor', color: '#ff5722', icon: Flame },
  { id: 'energia', label: 'Flujo de energía', color: '#ffc107', icon: Zap },
  { id: 'red', label: 'Flujo de red', color: '#2196f3', icon: Wifi },
  { id: 'geocercas', label: 'Geocercas', color: '#9c27b0', icon: MapPin },
  { id: 'vibraciones', label: 'Vibraciones sísmicas', color: '#e91e63', icon: Activity },
  { id: 'personal', label: 'Movimiento de personal', color: '#4caf50', icon: Users },
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

export interface PersonalItem {
  id: string
  name: string
  role: string
  area: string
  alert?: number
  type?: string
  status?: string
  time?: string
  zone?: string
  precision?: string
  recent?: string
}

const PERSONAL_RECORRIDO: PersonalItem[] = [
  {
    id: 'ana',
    name: 'Ana Torres',
    role: 'Operador',
    area: 'Interior',
    alert: 1,
    type: 'Perforista',
    status: 'En línea',
    time: '00:25:00',
    zone: 'Interior - Nivel 2',
    precision: '± 2.1 m',
    recent: '5 min',
  },
  {
    id: 'carlos',
    name: 'Carlos Martínez',
    role: 'Mecánico',
    area: 'Exterior',
    type: 'Perforista',
    status: 'En línea',
    time: '00:25:00',
    zone: 'Fuera de zonas monitoreadas',
    precision: '± 2.1 m',
    recent: '5 min',
  },
  {
    id: 'luis',
    name: 'Luis Pérez',
    role: 'Operador',
    area: 'Superficie',
    type: 'Operador planta',
    status: 'En línea',
    time: '00:18:20',
    zone: 'Superficie - Chancado',
    precision: '± 1.8 m',
    recent: '3 min',
  },
  {
    id: 'sofia',
    name: 'Sofía Jiménez',
    role: 'Mecánico',
    area: 'Tecnología',
    type: 'Técnico telecom',
    status: 'En línea',
    time: '00:32:15',
    zone: 'Interior - Taller L2',
    precision: '± 1.2 m',
    recent: '8 min',
  },
]

const PLAYER_EVENT_DOTS = [
  '#ff5722', '#f44336', '#f44336', '#ff5722', '#ff5722', '#f44336', '#f44336',
  '#4caf50', '#fbc02d', '#ff5722', '#ff5722', '#f44336', '#f44336', '#f44336',
  '#fbc02d', '#fbc02d', '#ff5722', '#ff5722', '#ff5722', '#f44336', '#f44336',
  '#fbc02d', '#fbc02d', '#fbc02d', '#f44336', '#f44336', '#ff5722', '#ff5722',
  '#ff5722', '#f44336', '#f44336', '#f44336', '#fbc02d', '#fbc02d', '#ff5722',
  '#ff5722',
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

function Section({
  title, open, onToggle, iconType = 'chevron', onHover, children,
}: {
  title: string; open: boolean; onToggle: () => void; iconType?: 'chevron' | 'plus'
  onHover?: { onMouseEnter: () => void; onMouseLeave: () => void }
  children?: React.ReactNode
}) {
  return (
    <div className="section" {...onHover}>
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
  const [authEmail, setAuthEmail] = useState<string | null>(() => getSavedAuthEmail())
  const [emailInput, setEmailInput] = useState('')
  const [authError, setAuthError] = useState('')
  const emailInputRef = useRef<HTMLInputElement>(null)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const cmdListRef = useRef<HTMLDivElement>(null)

  const [theme, setTheme] = useState<Theme>('light')
  const [mode, setMode] = useState<ViewMode>('perspective')
  const [selectedProj, setSelectedProj] = useState('3D - Perspectiva')
  const [selectedCam, setSelectedCam] = useState<string>('')
  const [zoom, setZoom] = useState(50)
  const [ddOpen, setDdOpen] = useState<'proj' | 'zoom' | 'addTrack' | 'addSim' | 'personalSearch' | 'nexoSettings' | 'shiftStart' | 'shiftEnd' | null>(null)
  const [nexoOpen, setNexoOpen] = useState(false)
  const [nexoMoreOpen, setNexoMoreOpen] = useState(false)
  const [nexoMoreView, setNexoMoreView] = useState<'main' | 'more'>('main')
  const [nexoEnabled, setNexoEnabled] = useState(true)
  const [nexoAutoAlerts, setNexoAutoAlerts] = useState(true)
  const [nexoVoice, setNexoVoice] = useState(false)
  const [nexoPrompt, setNexoPrompt] = useState('')
  const [nexoMessages, setNexoMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [perfLevel, setPerfLevel] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo')
  const [autoPerf, setAutoPerf] = useState(false)
  const [factor, setFactor] = useState(1.3)
  const [level, setLevel] = useState('L1')
  const [activeTool, setActiveTool] = useState<string>('')
  const [helpInfo, setHelpInfo] = useState<{ title: string; desc: string } | null>(null)

  const showHelp = (title: string, desc: string) => ({
    onMouseEnter: () => setHelpInfo({ title, desc }),
    onMouseLeave: () => setHelpInfo(null),
  })

  // TRACKING state (SMF - V2 - 5 / 6 / 7 / 8)
  const [activeTrackings, setActiveTrackings] = useState<TrackingType[]>([])
  const [expandedTrack, setExpandedTrack] = useState<Record<string, boolean>>({})
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({ '3': true, '4': true })

  // SIMULACIONES state (SMF - V2 - 12 / 13)
  const [activeSimulations, setActiveSimulations] = useState<SimulationType[]>([])

  // Recorrido Player & Detail state (SMF - V2 - 7, 8, 9)
  const [selectedUser, setSelectedUser] = useState<PersonalItem | null>(null)
  const [recorridoPlayerVisible, setRecorridoPlayerVisible] = useState(true)
  const [playerPlaying, setPlayerPlaying] = useState(false)
  const [playerSeconds, setPlayerSeconds] = useState(4)
  const [playerSpeed, setPlayerSpeed] = useState<'0.5x' | '1x' | '2x' | '4x' | '8x'>('1x')
  const [playerSeverityFilter, setPlayerSeverityFilter] = useState<string | null>('Aviso')
  const [playerBookmarked, setPlayerBookmarked] = useState(false)
  const [playerLoop, setPlayerLoop] = useState(false)
  const [auxilioHandled, setAuxilioHandled] = useState(false)
  const [auxilioResolved, setAuxilioResolved] = useState(false)
  const [personSearchText, setPersonSearchText] = useState('')
  const [shiftStart, setShiftStart] = useState('08:00')
  const [shiftEnd, setShiftEnd] = useState('16:00')

  useEffect(() => {
    if (!playerPlaying) return
    const speedMult: Record<string, number> = {
      '0.5x': 0.5,
      '1x': 1,
      '2x': 2,
      '4x': 4,
      '8x': 8,
    }
    const mult = speedMult[playerSpeed] || 1
    const interval = setInterval(() => {
      setPlayerSeconds((prev) => {
        if (prev >= 3600) {
          if (playerLoop) return 0
          setPlayerPlaying(false)
          return 3600
        }
        return prev + 1
      })
    }, 1000 / mult)
    return () => clearInterval(interval)
  }, [playerPlaying, playerSpeed, playerLoop])

  const formatPlayerTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const filteredChecklist = useMemo(() => {
    const q = personSearchText.trim().toLowerCase()
    if (!q) return PERSONAL_CHECKLIST
    return PERSONAL_CHECKLIST.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q)
    )
  }, [personSearchText])

  const rightColRef = useRef<HTMLDivElement>(null)
  const nexoMoreRef = useRef<HTMLDivElement>(null)

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const clamp = (n: number) => Math.max(10, Math.min(200, n))

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rightColRef.current && !rightColRef.current.contains(e.target as Node)) {
        setDdOpen(null)
      }
      if (nexoMoreRef.current && !nexoMoreRef.current.contains(e.target as Node)) {
        setNexoMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    if (!authEmail && emailInputRef.current) {
      const input = emailInputRef.current
      input.focus()
      try {
        input.setSelectionRange(0, 0)
      } catch {
        // ignore if unsupported
      }
    }
  }, [authEmail])

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = normalizeInstitutionalEmail(emailInput)
    if (!isAllowedInstitutionalEmail(clean)) {
      setAuthError('No puedes acceder a la plataforma')
      return
    }
    saveAuthEmail(clean)
    setAuthEmail(clean)
    setAuthError('')
  }

  const addTrackingItem = (id: TrackingType) => {
    setActiveTrackings((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setExpandedTrack((prev) => ({ ...prev, [id]: true }))
    setOpen((prev) => ({ ...prev, track: true }))
    setDdOpen(null)
  }

  const removeTrackingItem = (id: TrackingType) => {
    setActiveTrackings((prev) => prev.filter((item) => item !== id))
  }

  const addSimulationItem = (id: SimulationType) => {
    setActiveSimulations((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setOpen((prev) => ({ ...prev, sim: true }))
    setDdOpen(null)
  }

  const removeSimulationItem = (id: SimulationType) => {
    setActiveSimulations((prev) => prev.filter((item) => item !== id))
  }

  const sendNexoMessage = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    const replyMap: Record<string, string> = {
      'Ponme al día con el turno': 'El turno actual opera con normalidad. Hay 28 trabajadores activos en interior mina, 2 alertas preventivas en Nivel 3 (Chancador) y Nivel 5 (Sala de bombeo), y los refugios R-01 y R-04 se encuentran operativos.',
      '¿Cómo está la ventilación?': 'El caudal principal en V-PH-01 está al 96 % de su capacidad nominal. Los niveles L1 a L4 mantienen niveles óptimos de oxígeno y concentración de gases dentro de norma.',
      '¿Dónde está la gente en este momento?': 'Actualmente hay 14 personas en Galería Norte (L1), 8 en Taller Mecánico (L2), 4 en Rampa Principal y 2 en Sala de Bombeo (L5).',
    }
    const reply = replyMap[clean] || `Analizando "${clean}" en tiempo real sobre los sensores y telemetría activa de SmartFlow... Todos los indicadores del sector ${level} están sincronizados.`
    setNexoMessages((prev) => [...prev, { role: 'user', text: clean }, { role: 'assistant', text: reply }])
    setNexoPrompt('')
  }

  const selectedCount = Object.values(checkedPeople).filter(Boolean).length

  // SMF - V2 - 10: 40 Command Palette items
  const commands: CommandItem[] = useMemo(() => [
    // Vista
    { id: 'cam-sup', title: 'Superior', category: 'Vista', sub: 'Cámara', icon: SquareArrowUp, action: () => setMode('top') },
    { id: 'cam-front', title: 'Frontal', category: 'Vista', sub: 'Cámara', icon: SquareMousePointer, action: () => setMode('perspective') },
    { id: 'cam-right', title: 'Derecha', category: 'Vista', sub: 'Cámara', icon: SquareArrowRight, action: () => setMode('perspective') },
    { id: 'cam-iso', title: 'Isométrica', category: 'Vista', sub: 'Cámara', icon: Box, action: () => setMode('isometric') },
    { id: 'cam-fit', title: 'Ajustar todo', category: 'Vista', sub: 'Cámara', icon: Fullscreen, action: () => { setZoom(50); setMode('perspective') } },
    { id: 'proj-3d', title: '3D – Perspectiva', category: 'Vista', sub: 'Proyección', icon: Box, active: mode === 'perspective', action: () => setMode('perspective') },
    { id: 'proj-2d', title: '2D – Vista superior', category: 'Vista', sub: 'Proyección', icon: SquareArrowUp, active: mode === 'top', action: () => setMode('top') },
    { id: 'proj-2d-imm', title: '2D inmersivo', category: 'Vista', sub: 'Cambia a vista superior (2D)', icon: Layers2, disabled: true },
    { id: 'proj-diagram', title: 'Diagrama de planta', category: 'Vista', sub: 'Proyección', icon: Cable },
    { id: 'proj-surface', title: 'Superficie', category: 'Vista', sub: 'Proyección', icon: Globe },
    { id: 'panel-perf', title: 'Estadísticas de rendimiento', category: 'Vista', sub: 'Paneles', icon: CircleGauge, action: () => setOpen((o) => ({ ...o, perf: true })) },

    // Tracking
    { id: 'track-personal', title: 'Personal y vehículos', category: 'Tracking', sub: 'En vivo', icon: UserRoundSearch, iconColor: '#2196f3', action: () => { addTrackingItem('personal'); setOpen((o) => ({ ...o, track: true })) } },
    { id: 'track-zonas', title: 'Zonas y áreas', category: 'Tracking', sub: 'En vivo', icon: Layers2, iconColor: '#ff9800', action: () => { addTrackingItem('zonas'); setOpen((o) => ({ ...o, track: true })) } },
    { id: 'track-perim', title: 'Perímetros', category: 'Tracking', sub: 'En vivo', icon: CircleGauge, iconColor: '#f44336', action: () => { addTrackingItem('perimetros'); setOpen((o) => ({ ...o, track: true })) } },
    { id: 'track-recorrido', title: 'Recorrido', category: 'Tracking', sub: 'Histórico', icon: Waypoints, iconColor: '#7c4dff', action: () => { addTrackingItem('recorrido'); setOpen((o) => ({ ...o, track: true })) } },
    { id: 'track-escenario', title: 'Escenario alterno', category: 'Tracking', sub: 'Histórico', icon: AudioWaveform, iconColor: '#00bfa5', action: () => { addTrackingItem('escenario'); setOpen((o) => ({ ...o, track: true })) } },
    { id: 'track-reset', title: 'Restablecer la demostración', category: 'Tracking', sub: 'Emergencia', icon: RotateCcw, iconColor: '#546e7a', action: () => { setActiveTrackings([]); setActiveSimulations([]) } },
    { id: 'track-evac', title: 'Declarar evacuación', category: 'Tracking', sub: 'Emergencia', icon: Siren, iconColor: '#ff5252' },

    // Simulaciones
    { id: 'sim-aire', title: 'Flujo de aire', category: 'Simulaciones', sub: 'Ventilación', icon: Wind, iconColor: '#00bcd4', action: () => { addSimulationItem('aire'); setOpen((o) => ({ ...o, sim: true })) } },
    { id: 'sim-calor', title: 'Mapa de calor', category: 'Simulaciones', sub: 'Ventilación', icon: Flame, iconColor: '#ff5722', action: () => { addSimulationItem('calor'); setOpen((o) => ({ ...o, sim: true })) } },
    { id: 'sim-energia', title: 'Flujo de energía', category: 'Simulaciones', sub: 'Energía', icon: Zap, iconColor: '#ffc107', action: () => { addSimulationItem('energia'); setOpen((o) => ({ ...o, sim: true })) } },
    { id: 'sim-red', title: 'Flujo de red', category: 'Simulaciones', sub: 'Módulo aún no implementado', icon: Wifi, iconColor: '#2196f3', disabled: true },
    { id: 'sim-geocercas', title: 'Geocercas', category: 'Simulaciones', sub: 'Seguridad', icon: MapPin, iconColor: '#9c27b0', action: () => { addSimulationItem('geocercas'); setOpen((o) => ({ ...o, sim: true })) } },
    { id: 'sim-sismicas', title: 'Vibraciones sísmicas', category: 'Simulaciones', sub: 'Módulo aún no implementado', icon: Activity, iconColor: '#e91e63', disabled: true },
    { id: 'sim-personal', title: 'Movimiento de personal', category: 'Simulaciones', sub: 'Personal', icon: Users, iconColor: '#4caf50', action: () => { addSimulationItem('personal'); setOpen((o) => ({ ...o, sim: true })) } },
    { id: 'sim-hide', title: 'Ocultar todas las capas', category: 'Simulaciones', sub: 'Simulaciones', icon: Trash, iconColor: '#78909c', action: () => setActiveSimulations([]) },

    // Análisis
    { id: 'ana-sub', title: 'Apagón de subestación', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpen((o) => ({ ...o, ana: true })) },
    { id: 'ana-vent', title: 'Falla de ventilador', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpen((o) => ({ ...o, ana: true })) },
    { id: 'ana-gas', title: 'Fuga de gas', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpen((o) => ({ ...o, ana: true })) },
    { id: 'ana-evac', title: 'Evacuación de emergencia', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpen((o) => ({ ...o, ana: true })) },
    { id: 'ana-cierre', title: 'Cierre de galería', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpen((o) => ({ ...o, ana: true })) },
    { id: 'ana-time', title: 'Máquina del tiempo', category: 'Análisis', sub: 'Histórico', icon: History, iconColor: '#5c6bc0' },

    // Interiores
    { id: 'int-refugio', title: 'Refugio', category: 'Interiores', sub: 'En la mina', icon: ShieldCheck, iconColor: '#4caf50' },
    { id: 'int-taller', title: 'Taller mecánico', category: 'Interiores', sub: 'En la mina', icon: Wrench, iconColor: '#fbc02d' },
    { id: 'int-bombeo', title: 'Sala de bombeo', category: 'Interiores', sub: 'En la mina', icon: Droplets, iconColor: '#03a9f4' },
    { id: 'int-chancador', title: 'Chancador', category: 'Interiores', sub: 'En la mina', icon: Mountain, iconColor: '#ff7043' },
    { id: 'int-subestacion', title: 'Sala de subestación', category: 'Interiores', sub: 'Selecciona una subestación en el visor para entrar', icon: Zap, iconColor: '#fbc02d', disabled: true },

    // Ingeniería
    { id: 'ing-herramientas', title: 'Herramientas de ingeniería', category: 'Ingeniería', sub: 'Herramientas', icon: RulerDimensionLine, active: true },
    { id: 'ing-cad', title: 'Laboratorio de importación CAD', category: 'Ingeniería', sub: 'Herramientas', icon: Box },
  ], [mode])

  const filteredCommands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    )
  }, [commands, searchQuery])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchOpen])

  useEffect(() => {
    if (searchOpen) {
      setSearchQuery('')
      setSelectedCmdIndex(0)
      setTimeout(() => searchInputRef.current?.focus(), 40)
    }
  }, [searchOpen])

  const executeCommand = (cmd: CommandItem) => {
    if (cmd.disabled) return
    if (cmd.action) cmd.action()
    setSearchOpen(false)
  }

  const handleCmdKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedCmdIndex((idx) => (idx + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedCmdIndex((idx) => (idx - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filteredCommands[selectedCmdIndex]
      if (item) executeCommand(item)
    }
  }

  return (
    <div className={`app ${nexoOpen ? 'nexo-open' : ''}`} data-theme={theme}>
      <Scene3D mode={mode} zoom={zoom} theme={theme} onZoomChange={setZoom} />

      <header className="glass topbar">
        <button
          className="logo-btn"
          aria-label="Volver"
          {...showHelp('Motor de Gemelo Digital', 'Núcleo de la representación virtual 3D de la infraestructura minera.')}
        >
          <img src={logoUrl} alt="SmartFlow" className="logo-img" />
          <span className="logo-back">
            <ArrowLeft size={18} />
          </span>
        </button>

        <div className="top-actions">
          <button
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
            {...showHelp('Datos', 'Consulta y administración de fuentes de información y flujos de datos del sistema (Ctrl + K).')}
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Notificaciones"
            {...showHelp('Tableros de comandos', 'Paneles visuales (dashboards) con indicadores clave de desempeño (KPIs) y resúmenes operativos.')}
          >
            <Bell size={20} />
          </button>
          <button
            aria-label="Idioma"
            {...showHelp('Servicios Digitales de Mina', 'Suite de herramientas tecnológicas que integran la plataforma.')}
          >
            <Globe size={20} />
          </button>
          <button
            aria-label="Cambiar tema"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            {...showHelp('Configuración', 'Ajustes generales del sistema, modo claro/oscuro, permisos y parámetros de la plataforma.')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="avatar"
            onClick={() => {
              clearSavedAuthEmail()
              setEmailInput('')
              setAuthEmail(null)
            }}
            {...showHelp('Operaciones', 'Módulos principales para gestionar las distintas áreas de la empresa minera (HSEC, planeación y producción).')}
          >
            DS
          </button>
        </div>
      </header>

      {/* Left vertical sidebar from SMF - V2 - 3 / 17 */}
      <nav className="glass sidebar">
        <button
          className="icon-btn"
          onClick={() => setZoom(clamp(zoom + 10))}
          {...showHelp('Acercar vista', 'Incrementa la escala de acercamiento sobre el modelo del gemelo digital en 3D/2D.')}
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="icon-btn"
          onClick={() => setZoom(clamp(zoom - 10))}
          {...showHelp('Alejar vista', 'Reduce la escala de visualización para obtener una vista general del entorno minero.')}
        >
          <ZoomOut size={20} />
        </button>
        <hr />
        <button
          className={`icon-btn ${mode === 'top' ? 'active' : ''}`}
          onClick={() => setMode('top')}
          {...showHelp('Vista (Superior)', 'Permite alternar y configurar las perspectivas y modos de visualización del gemelo digital en 2D/planta.')}
        >
          <SquareArrowUp size={20} />
        </button>
        <button
          className={`icon-btn ${mode === 'perspective' ? 'active' : ''}`}
          onClick={() => setMode('perspective')}
          {...showHelp('Vista (3D Perspectiva)', 'Permite alternar y configurar las perspectivas y modos de visualización del gemelo digital en 3D/2D.')}
        >
          <Box size={20} />
        </button>
        <button
          className={`icon-btn ${mode === 'isometric' ? 'active' : ''}`}
          onClick={() => setMode('isometric')}
          {...showHelp('Vista (Isométrica)', 'Proyección técnica isométrica para inspeccionar niveles, rampas y galerías sin distorsión.')}
        >
          <SquareArrowRight size={20} />
        </button>
        <button
          className={`icon-btn ${activeTool === 'select' ? 'active' : ''}`}
          onClick={() => setActiveTool('select')}
          {...showHelp('Interiores', 'Gestión y visualización detallada de espacios cerrados, refugios y talleres.')}
        >
          <SquareMousePointer size={20} />
        </button>
        <hr />
        <button
          className="icon-btn"
          onClick={() => { setZoom(50); setMode('perspective') }}
          {...showHelp('Motor de Gemelo Digital', 'Restablece la cámara principal del núcleo de representación virtual 3D de la infraestructura minera.')}
        >
          <Fullscreen size={20} />
        </button>
        <hr />
        <button
          className="icon-btn"
          {...showHelp('Motor de Flujo de Datos', 'Gestión y procesamiento en tiempo real de la telemetría e información de sensores.')}
        >
          <Upload size={20} />
        </button>
        <hr />
        <button
          className={`icon-btn ${activeTool === 'ruler' ? 'active' : ''}`}
          onClick={() => setActiveTool('ruler')}
          {...showHelp('Ingeniería', 'Acceso a las capas estructurales, niveles, rampas, cotas y parámetros técnicos del diseño de la mina.')}
        >
          <RulerDimensionLine size={20} />
        </button>
        <button
          className={`icon-btn ${activeTool === 'diamond' ? 'active' : ''}`}
          onClick={() => setActiveTool('diamond')}
          {...showHelp('Demo de seguimiento', 'Ejercicios o modos demostrativos para pruebas de tracking y puntos de control en interior mina.')}
        >
          <Diamond size={20} />
        </button>
        <button
          className={`icon-btn ${activeTool === 'cable' ? 'active' : ''}`}
          onClick={() => setActiveTool('cable')}
          {...showHelp('Motor de Blueprints', 'Gestión de planos, esquemas, redes de conexión y diseños técnicos originales.')}
        >
          <Cable size={20} />
        </button>
        <button
          className={`icon-btn ${activeTool === 'light' ? 'active' : ''}`}
          onClick={() => setActiveTool('light')}
          {...showHelp('Motor de Provisión de Dispositivos', 'Configuración, alta y administración del hardware y luminarias instaladas en terreno.')}
        >
          <Lightbulb size={20} />
        </button>
        <button
          className={`icon-btn ${activeTool === 'wrench' ? 'active' : ''}`}
          onClick={() => setActiveTool('wrench')}
          {...showHelp('Operaciones', 'Módulos principales para gestionar Exploración, Planificación, Operaciones Mina, Planta, HSEC y Servicios de Sitio.')}
        >
          <Wrench size={20} />
        </button>
        <hr />
        <button
          className="icon-btn"
          {...showHelp('Deshacer', 'Revierte la última acción realizada sobre la vista o herramientas de ingeniería.')}
        >
          <Undo2 size={20} />
        </button>
        <button
          className="icon-btn"
          {...showHelp('Rehacer', 'Restaura la acción previamente deshecha en el entorno de trabajo.')}
        >
          <Redo2 size={20} />
        </button>
      </nav>

      {/* Right column */}
      <div className="right-col" ref={rightColRef}>
        {!nexoOpen && (
          <div className="nexo-bar-wrap">
            <div className={`nexo-bar ${!nexoEnabled ? 'disabled' : ''}`}>
              <button
                className="nexo-open-trigger"
                onClick={() => {
                  setDdOpen(null)
                  setNexoOpen(true)
                }}
                {...showHelp('Nexo IA', 'Asistente de inteligencia artificial para consultar el estado del turno, ventilación, personal y alertas en tiempo real.')}
              >
                <span className="nexo-title"><NexoLogo /> Pregúntale a Nexo IA</span>
              </button>

              <button
                className={`nexo-settings-btn ${ddOpen === 'nexoSettings' ? 'active' : ''}`}
                aria-label="Configuración de Nexo IA"
                onClick={(e) => {
                  e.stopPropagation()
                  setDdOpen((d) => (d === 'nexoSettings' ? null : 'nexoSettings'))
                }}
                {...showHelp('Configuración Nexo IA', 'Activa o desactiva el asistente Nexo IA, las sugerencias automáticas de turno y las respuestas por voz.')}
              >
                <Settings size={17} />
              </button>
            </div>

            {ddOpen === 'nexoSettings' && (
              <div className="dd-menu nexo-settings-menu">
                <div className="dd-group-title">CONFIGURACIÓN NEXO IA</div>

                <div className="row between switch-row nexo-switch-row" onClick={() => setNexoEnabled((v) => !v)}>
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

                <div className="row between switch-row nexo-switch-row" onClick={() => setNexoAutoAlerts((v) => !v)}>
                  <div className="nexo-switch-text">
                    <span>Sugerencias automáticas</span>
                    <small>Alertas proactivas del turno</small>
                  </div>
                  <span className={`mui-switch ${nexoAutoAlerts ? 'checked' : ''}`}>
                    <span className="mui-switch-track" />
                    <span className="mui-switch-thumb" />
                  </span>
                </div>

                <div className="row between switch-row nexo-switch-row" onClick={() => setNexoVoice((v) => !v)}>
                  <div className="nexo-switch-text">
                    <span>Respuestas por voz</span>
                    <small>Lectura de avisos críticos</small>
                  </div>
                  <span className={`mui-switch ${nexoVoice ? 'checked' : ''}`}>
                    <span className="mui-switch-track" />
                    <span className="mui-switch-thumb" />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <aside className={`glass panel ${ddOpen ? 'has-dropdown-open' : ''}`}>
          {selectedUser ? (
            <div className="user-detail-panel">
              {/* Breadcrumb matching SMF - V2 - 9 */}
              <div className="user-detail-breadcrumb">
                <button
                  className="user-back-btn"
                  onClick={() => setSelectedUser(null)}
                  title="Volver al panel principal"
                >
                  <ChevronLeft size={16} />
                  <span>Inicio</span>
                </button>
                <span className="crumb-sep">/</span>
                <span className="crumb-current">{selectedUser.name}</span>
              </div>

              {/* Title row */}
              <div className="user-detail-header">
                <h3 className="user-detail-name">{selectedUser.name}</h3>
              </div>

              {/* Action buttons */}
              <div className="user-actions-row">
                <button className="user-action-btn primary" onClick={() => {}}>
                  <Crosshair size={14} />
                  <span>Centrar en el mapa</span>
                </button>
                <button className="user-action-btn secondary" onClick={() => {}}>
                  <span>Seguir usuario - Superficie</span>
                </button>
              </div>

              {/* Detail Table */}
              <div className="user-info-table">
                <div className="info-row">
                  <span className="info-key">Tipo</span>
                  <span className="info-val">{selectedUser.type || selectedUser.role}</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Señal</span>
                  <span className="info-val">
                    <span className="user-status-pill online">
                      <span className="dot" /> {selectedUser.status || 'En línea'}
                    </span>
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-key">Última observación</span>
                  <span className="info-val">{selectedUser.time || '00:25:00'}</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Zona</span>
                  <span className="info-val">{selectedUser.zone || selectedUser.area}</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Precisión del fix</span>
                  <span className="info-val">{selectedUser.precision || '± 2.1 m'}</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Recorrido reciente</span>
                  <span className="info-val">{selectedUser.recent || '5 min'}</span>
                </div>
              </div>

              {/* Petición de auxilio section (for Ana Torres or any user with alert) */}
              {(selectedUser.alert || selectedUser.id === 'ana') && (
                <div className="user-auxilio-section">
                  <div className="auxilio-card">
                    <div className="auxilio-header">
                      <div className="auxilio-title-row">
                        <span className="auxilio-accent" />
                        <b>Petición de auxilio</b>
                      </div>
                      <span className="auxilio-badge-crit">Crítica</span>
                    </div>

                    <div className="auxilio-desc">
                      Alerta activada por sensor de hombre caído
                    </div>

                    <div className="auxilio-tags">
                      <span>Hombre caído</span>
                      <span>Rampa Principal N2</span>
                    </div>

                    <div className="auxilio-actions">
                      <button
                        className={`auxilio-btn atender ${auxilioHandled ? 'done' : ''}`}
                        onClick={() => setAuxilioHandled((v) => !v)}
                      >
                        {auxilioHandled ? 'Atendido' : 'Atender'}
                      </button>
                      <button
                        className={`auxilio-btn resolver ${auxilioResolved ? 'done' : ''}`}
                        onClick={() => setAuxilioResolved((v) => !v)}
                      >
                        {auxilioResolved ? 'Resuelto' : 'Resolver'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                className="search"
                onClick={() => setSearchOpen(true)}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                {...showHelp('Datos', 'Consulta y administración de fuentes de información y flujos de datos del sistema (Ctrl + K).')}
              >
                <span>Buscar</span><small>Ctrl + K</small><Search size={14} />
              </div>

          {/* 1. MODO DE VISUALIZACIÓN (SMF - V2 - 4) */}
          <div
            className="vis-block"
            {...showHelp('Vista', 'Permite alternar y configurar las perspectivas y modos de visualización del gemelo digital en 3D/2D.')}
          >
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
          <Section
            title="Estadísticas de rendimiento"
            open={!!open.perf}
            onToggle={() => toggle('perf')}
            onHover={showHelp('Estadísticas de rendimiento', 'Monitoreo de FPS, memoria GPU, llamadas de dibujo, geometrías y perfil de calidad gráfica del visor 3D.')}
          >
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
          <div
            className="section track-section"
            {...showHelp('Tracking', 'Monitoreo y seguimiento en tiempo real de personal, vehículos y activos dentro de la mina.')}
          >
            <div className="section-head" onClick={() => toggle('track')}>
              <span>Tracking</span>
              <div className="section-head-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="plus-trigger"
                  aria-label="Agregar tracking"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDdOpen((d) => (d === 'addTrack' ? null : 'addTrack'))
                  }}
                >
                  <CirclePlus size={17} />
                </button>
                <button
                  className="accordion-chevron-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle('track')
                  }}
                  aria-label={open.track !== false ? 'Ocultar Tracking' : 'Mostrar Tracking'}
                >
                  {open.track !== false ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
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
            {open.track !== false && activeTrackings.length > 0 && (
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
                          {id === 'recorrido' && (
                            <button
                              title={recorridoPlayerVisible ? 'Ocultar reproductor' : 'Mostrar reproductor'}
                              onClick={() => setRecorridoPlayerVisible((v) => !v)}
                              style={{ opacity: recorridoPlayerVisible ? 1 : 0.4 }}
                            >
                              <Eye size={17} />
                            </button>
                          )}
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
                          <div className="row" style={{ position: 'relative' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                              <button
                                className="dd-trigger grow"
                                onClick={() => setDdOpen((d) => (d === 'shiftStart' ? null : 'shiftStart'))}
                              >
                                <span>Inicio: {shiftStart}</span>
                                <Clock size={15} />
                              </button>
                              {ddOpen === 'shiftStart' && (
                                <div className="dd-menu time-picker-menu">
                                  {['06:00', '08:00', '10:00', '12:00'].map((t) => (
                                    <button
                                      key={t}
                                      className={`dd-item ${shiftStart === t ? 'active' : ''}`}
                                      onClick={() => { setShiftStart(t); setDdOpen(null) }}
                                    >
                                      <span>{t}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div style={{ flex: 1, position: 'relative' }}>
                              <button
                                className="dd-trigger grow"
                                onClick={() => setDdOpen((d) => (d === 'shiftEnd' ? null : 'shiftEnd'))}
                              >
                                <span>Fin: {shiftEnd}</span>
                                <Clock size={15} />
                              </button>
                              {ddOpen === 'shiftEnd' && (
                                <div className="dd-menu time-picker-menu">
                                  {['14:00', '16:00', '18:00', '20:00'].map((t) => (
                                    <button
                                      key={t}
                                      className={`dd-item ${shiftEnd === t ? 'active' : ''}`}
                                      onClick={() => { setShiftEnd(t); setDdOpen(null) }}
                                    >
                                      <span>{t}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="recorrido-search-wrap" style={{ position: 'relative' }}>
                            <button
                              className={`dd-trigger full ${ddOpen === 'personalSearch' ? 'active' : ''}`}
                              onClick={() => setDdOpen((d) => (d === 'personalSearch' ? null : 'personalSearch'))}
                            >
                              <Search size={16} />
                              <span style={{ flex: 1, textAlign: 'left' }}>Buscar personal</span>
                              <ChevronDown size={16} />
                            </button>

                            {/* SMF - V2 - 8 Popover: Multi-select checklist with search */}
                            {ddOpen === 'personalSearch' && (
                              <div className="dd-menu personal-checklist-menu">
                                <div className="checklist-search-bar">
                                  <Search size={14} className="checklist-search-icon" />
                                  <input
                                    type="text"
                                    placeholder="Filtrar por nombre..."
                                    value={personSearchText}
                                    onChange={(e) => setPersonSearchText(e.target.value)}
                                    className="checklist-input"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="checklist-head">
                                  <span>{selectedCount}/{PERSONAL_CHECKLIST.length} SELECCIONADO</span>
                                  <button onClick={() => setCheckedPeople({})}>QUITAR TODOS</button>
                                </div>
                                <div className="checklist-scroll">
                                  {filteredChecklist.map((p) => {
                                    const checked = !!checkedPeople[p.id]
                                    return (
                                      <button
                                        key={p.id}
                                        className="checklist-item"
                                        onClick={() => {
                                          setCheckedPeople((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                                        }}
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
                              <div
                                key={p.id}
                                className="zona-row personal-clickable-row"
                                onClick={() => setSelectedUser(p)}
                                title="Ver detalle de usuario"
                              >
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
                              <div
                                key={p.id}
                                className="zona-row personal-clickable-row"
                                onClick={() => setSelectedUser(p)}
                                title="Ver detalle de usuario"
                              >
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

                {activeTrackings.length > 1 && (
                  <>
                    <div className="perf-divider" />
                    <button className="clear-track-btn" onClick={() => setActiveTrackings([])}>
                      <Trash size={17} />
                      <span>Limpiar lista de seguimiento</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 4. SIMULACIONES (SMF - V2 - 12 & SMF - V2 - 13) */}
          <div
            className="section sim-section"
            {...showHelp('Simulaciones', 'Ejecución de modelos predictivos (flujo de aire, mapas de calor, energía, red, geocercas, vibraciones, etc.).')}
          >
            <div className="section-head" onClick={() => toggle('sim')}>
              <span>Simulaciones</span>
              <div className="section-head-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="plus-trigger"
                  aria-label="Agregar simulación"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDdOpen((d) => (d === 'addSim' ? null : 'addSim'))
                  }}
                >
                  <CirclePlus size={17} />
                </button>
                <button
                  className="accordion-chevron-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle('sim')
                  }}
                  aria-label={open.sim !== false ? 'Ocultar Simulaciones' : 'Mostrar Simulaciones'}
                >
                  {open.sim !== false ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* SMF - V2 - 13 Popover: AGREGAR SIMULACIÓN */}
            {ddOpen === 'addSim' && (
              <div className="dd-menu track-add-menu">
                <div className="dd-group-title">AGREGAR SIMULACIÓN</div>
                {SIMULATION_CATALOG.map(({ id, label, color, icon: I }) => (
                  <button
                    key={id}
                    className="dd-item"
                    onClick={() => addSimulationItem(id)}
                  >
                    <I size={18} style={{ color }} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Active Simulations List (SMF - V2 - 12 / node 8865:305609) */}
            {open.sim !== false && activeSimulations.length > 0 && (
              <div className="section-body track-body">
                {activeSimulations.map((id) => {
                  const cfg = SIMULATION_CATALOG.find((c) => c.id === id)!
                  const Icon = cfg.icon
                  return (
                    <div key={id} className="track-row-head">
                      <div className="track-row-title" style={{ cursor: 'default' }}>
                        <Icon size={18} style={{ color: cfg.color }} />
                        <span>{cfg.label}</span>
                      </div>
                      <div className="track-row-actions">
                        <button title="Quitar simulación" onClick={() => removeSimulationItem(id)}>
                          <CircleMinus size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}

                {activeSimulations.length > 2 && (
                  <>
                    <div className="perf-divider" />
                    <button className="clear-track-btn" onClick={() => setActiveSimulations([])}>
                      <Trash size={17} />
                      <span>Limpiar lista de simulación</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Section
            title="Análisis"
            open={!!open.ana}
            onToggle={() => toggle('ana')}
            onHover={showHelp('Análisis', 'Evaluación de datos operativos, métricas de rendimiento y reportes de la mina.')}
          >
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

          <Section
            title="Seguimiento"
            open={!!open.seg}
            onToggle={() => toggle('seg')}
            onHover={showHelp('Demo de seguimiento', 'Ejercicios o modos demostrativos para pruebas de tracking y seguimiento operativo.')}
          />
            </>
          )}
        </aside>
      </div>

      {/* SMF - V2 - 7 & SMF - 34: Exact Figma Recorrido Simulation Player (node 8739-11054) */}
      {activeTrackings.includes('recorrido') && recorridoPlayerVisible && (
        <div className={`glass recorrido-player ${nexoOpen ? 'nexo-offset' : ''}`}>
          {/* Row 1: Header - Chips Left, 110 Eventos Center, Severity Pills Right */}
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

            <div className="player-events-center">
              110 EVENTOS
            </div>

            <div className="player-severity-pills">
              {(['Informativo', 'Aviso', 'Grave', 'Crítico'] as const).map((sev) => {
                const isSelected = playerSeverityFilter === sev
                return (
                  <button
                    key={sev}
                    className={`player-sev-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setPlayerSeverityFilter(sev)}
                  >
                    {sev}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 2: Controls - 6 buttons Left, Speed Selector Center, Actions + Time Right */}
          <div className="player-controls-row">
            <div className="player-playback-group">
              <button
                className="player-ctrl-btn"
                title={playerPlaying ? 'Pausar' : 'Reproducir'}
                onClick={() => setPlayerPlaying((p) => !p)}
              >
                {playerPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                className="player-ctrl-btn"
                title="Retroceso rápido (30s)"
                onClick={() => setPlayerSeconds((s) => Math.max(0, s - 30))}
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                className="player-ctrl-btn"
                title="Paso anterior (5s)"
                onClick={() => setPlayerSeconds((s) => Math.max(0, s - 5))}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="player-ctrl-btn"
                title="Paso siguiente (5s)"
                onClick={() => setPlayerSeconds((s) => Math.min(3600, s + 5))}
              >
                <ChevronRight size={18} />
              </button>
              <button
                className="player-ctrl-btn"
                title="Avance rápido (30s)"
                onClick={() => setPlayerSeconds((s) => Math.min(3600, s + 30))}
              >
                <ChevronsRight size={18} />
              </button>
              <button
                className="player-ctrl-btn"
                title="Reiniciar"
                onClick={() => setPlayerSeconds(0)}
              >
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
                title={playerBookmarked ? 'Marcador guardado' : 'Guardar marcador'}
                onClick={() => setPlayerBookmarked((v) => !v)}
              >
                <Bookmark size={18} />
              </button>
              <button
                className={`player-action-icon-btn ${playerLoop ? 'active' : ''}`}
                title={playerLoop ? 'Bucle activado' : 'Activar bucle'}
                onClick={() => setPlayerLoop((v) => !v)}
              >
                <Repeat size={18} />
              </button>
              <div className="player-time-display">
                {formatPlayerTime(playerSeconds)}
              </div>
            </div>
          </div>

          {/* Row 3: Event scatter 36 dots across the width */}
          <div className="player-dots-track">
            {PLAYER_EVENT_DOTS.map((color, idx) => (
              <span
                key={idx}
                className="player-event-dot"
                style={{ backgroundColor: color }}
                onClick={() => setPlayerSeconds(Math.round((idx / 35) * 3600))}
                title={`Evento ${idx + 1}`}
              />
            ))}
          </div>

          {/* Row 4: Seekbar track with progress fill and thumb */}
          <div
            className="player-seekbar-wrap"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              setPlayerSeconds(Math.round(pct * 3600))
            }}
          >
            <div className="player-seekbar-bg">
              <div
                className="player-seekbar-fill"
                style={{ width: `${(playerSeconds / 3600) * 100}%` }}
              />
              <div
                className="player-seekbar-thumb"
                style={{ left: `${(playerSeconds / 3600) * 100}%` }}
              />
            </div>
          </div>

          {/* Row 5: Time markers (0:00:00, Segundo X/ 3600, 1:00:00) */}
          <div className="player-time-footer">
            <span className="time-footer-left">0:00:00</span>
            <span className="time-footer-center">Segundo {playerSeconds}/ 3600</span>
            <span className="time-footer-right">1:00:00</span>
          </div>
        </div>
      )}

      {/* SMF - V2 - 20 Nexo IA Right Drawer (340px wide, full height) */}
      {nexoOpen && (
        <aside className="glass nexo-drawer" aria-label="Nexo IA">
          <div className="nexo-drawer-top" ref={nexoMoreRef}>
            <div className="nexo-top-actions">
              <button
                className={`nexo-more-btn ${nexoMoreOpen ? 'active' : ''}`}
                title="Historial y más opciones"
                aria-label="Historial y más opciones"
                onClick={() => {
                  setNexoMoreOpen((v) => !v)
                  setNexoMoreView('main')
                }}
              >
                <EllipsisVertical size={17} />
              </button>

              <button
                className="nexo-close-btn"
                title="Cerrar Nexo IA"
                aria-label="Cerrar Nexo IA"
                onClick={() => {
                  setNexoMoreOpen(false)
                  setNexoOpen(false)
                }}
              >
                <PanelRightClose size={18} />
              </button>
            </div>

            {nexoMoreOpen && (
              <div className="dd-menu nexo-history-menu">
                {nexoMoreView === 'main' ? (
                  <>
                    <button
                      className="dd-item nexo-history-item"
                      onClick={() => setNexoMoreOpen(false)}
                    >
                      <PictureInPicture2 size={16} />
                      <span>Chat en ventana emergente</span>
                    </button>

                    <div className="dd-divider" />

                    <div className="dd-group-title">HISTORIAL DE CONVERSACIÓN</div>
                    {NEXO_PINNED_CHATS.map((chatTitle) => (
                      <button
                        key={chatTitle}
                        className="dd-item nexo-history-item"
                        onClick={() => {
                          sendNexoMessage(chatTitle)
                          setNexoMoreOpen(false)
                        }}
                      >
                        <TextAlignStart size={16} className="nexo-hist-icon" />
                        <span className="nexo-hist-label">{chatTitle}</span>
                        <Pin size={14} className="nexo-pin-icon" />
                      </button>
                    ))}

                    <button
                      className="dd-item nexo-history-item"
                      onClick={() => setNexoMoreView('more')}
                    >
                      <Ellipsis size={16} className="nexo-hist-icon" />
                      <span className="nexo-hist-label">Más chats</span>
                      <ChevronRight size={15} className="nexo-pin-icon" />
                    </button>

                    <div className="dd-divider" />

                    <button className="dd-item nexo-history-item disabled" disabled>
                      <SquareArrowOutUpRight size={16} />
                      <span>Continuar chat en una nueva pestaña</span>
                    </button>

                    <button
                      className="dd-item nexo-history-item"
                      onClick={() => setNexoMoreOpen(false)}
                    >
                      <Settings size={16} />
                      <span className="nexo-hist-label">Configuración y ayuda</span>
                      <ChevronRight size={15} className="nexo-pin-icon" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="dd-item nexo-back-row"
                      onClick={() => setNexoMoreView('main')}
                    >
                      <ChevronLeft size={16} />
                      <span>Atrás</span>
                    </button>

                    <div className="dd-divider" />

                    <div className="nexo-history-scroll">
                      {NEXO_MORE_CHATS.map((chatTitle) => (
                        <button
                          key={chatTitle}
                          className="dd-item nexo-history-item"
                          onClick={() => {
                            sendNexoMessage(chatTitle)
                            setNexoMoreOpen(false)
                          }}
                        >
                          <TextAlignStart size={16} className="nexo-hist-icon" />
                          <span className="nexo-hist-label">{chatTitle}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="nexo-drawer-body">
            {nexoMessages.length > 0 && (
              <div className="nexo-chat-log">
                {nexoMessages.map((m, i) => (
                  <div key={i} className={`nexo-msg ${m.role}`}>
                    {m.text}
                  </div>
                ))}
              </div>
            )}

            <div className="nexo-welcome">
              <div className="nexo-avatar-circle">
                <NexoLogo width={24} height={30} />
              </div>

              <h2 className="nexo-greeting">¿Cómo puedo ayudarte hoy?</h2>

              <div className="nexo-suggestions">
                {NEXO_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="nexo-pill"
                    onClick={() => sendNexoMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            className="nexo-input-box"
            onSubmit={(e) => {
              e.preventDefault()
              sendNexoMessage(nexoPrompt)
            }}
          >
            <textarea
              className="nexo-textarea"
              placeholder="Pregúntale a Nexo IA"
              value={nexoPrompt}
              onChange={(e) => setNexoPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendNexoMessage(nexoPrompt)
                }
              }}
            />
            <div className="nexo-input-actions">
              <button type="button" className="nexo-attach-btn" title="Adjuntar contexto">
                <Plus size={18} />
              </button>
              <button type="submit" className="nexo-send-btn" title="Enviar a Nexo IA">
                <ArrowUp size={18} />
              </button>
            </div>
          </form>
        </aside>
      )}

      <ul
        className="glass levels"
        {...showHelp('Ingeniería', 'Acceso a las capas estructurales, niveles (L1 General a L5 Interior), rampas, cotas y parámetros técnicos del diseño de la mina.')}
      >
        {levels.map(([k, n]) => (
          <li key={k} className={level === k ? 'on' : ''} onClick={() => setLevel(k)}><b>{k}</b> {n}</li>
        ))}
      </ul>

      {/* Ableton-style docked minimalist bottom info bar (no blur, non-floating) */}
      <footer className="ableton-status-bar" aria-live="polite">
        {helpInfo ? (
          <div className="ableton-status-content">
            <span className="ableton-status-title">{helpInfo.title}:</span>
            <span className="ableton-status-desc">{helpInfo.desc}</span>
          </div>
        ) : (
          <div className="ableton-status-content idle">
            <span className="ableton-status-title">SmartFlow:</span>
            <span className="ableton-status-desc">Pasa el cursor sobre cualquier herramienta para ver su descripción.</span>
          </div>
        )}
      </footer>

      {/* Institutional Email Access Gate Modal */}
      {!authEmail && (
        <div className="auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          <form className="glass auth-modal" onSubmit={handleAuthSubmit} noValidate>
            <div className="auth-logo-wrap">
              <img src={logoUrl} alt="SmartFlow" className="auth-logo" />
            </div>

            <div className="auth-header">
              <h2 id="auth-modal-title">Acceso a SmartFlow</h2>
              <p>Ingresa tu correo con tu correo institucional</p>
            </div>

            <div className="auth-field-group">
              <label htmlFor="institutional-email" className="auth-label">
                Ingresa tu correo con tu correo institucional
              </label>
              <input
                ref={emailInputRef}
                id="institutional-email"
                type="text"
                inputMode="email"
                className={`auth-input ${authError ? 'error' : ''}`}
                placeholder="Ingresa tu correo con tu correo institucional"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value)
                  if (authError) setAuthError('')
                }}
                autoComplete="email"
                autoFocus
              />
              {authError && (
                <span className="auth-error">{authError}</span>
              )}
            </div>

            <button type="submit" className="cta auth-submit">
              Agregar
            </button>
          </form>
        </div>
      )}

      {/* SMF - V2 - 10: Command Palette Modal */}
      {searchOpen && (
        <div
          className="cmd-backdrop"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar comandos"
        >
          <div className="glass cmd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cmd-header">
              <Search size={19} className="cmd-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="cmd-input"
                placeholder="Buscar comandos, simulaciones y escenarios..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedCmdIndex(0)
                }}
                onKeyDown={handleCmdKeyDown}
              />
              <kbd className="cmd-esc-badge" onClick={() => setSearchOpen(false)}>esc</kbd>
            </div>

            <div className="cmd-list" ref={cmdListRef}>
              {filteredCommands.length === 0 ? (
                <div className="cmd-empty">No se encontraron resultados para "{searchQuery}"</div>
              ) : (
                (['Vista', 'Tracking', 'Simulaciones', 'Análisis', 'Interiores', 'Ingeniería'] as const).map((cat) => {
                  const itemsInCat = filteredCommands.filter((c) => c.category === cat)
                  if (itemsInCat.length === 0) return null
                  return (
                    <div key={cat} className="cmd-group">
                      <div className="cmd-group-title">{cat}</div>
                      {itemsInCat.map((item) => {
                        const Icon = item.icon
                        const globalIndex = filteredCommands.indexOf(item)
                        const isSelected = globalIndex === selectedCmdIndex
                        return (
                          <div
                            key={item.id}
                            className={`cmd-item ${isSelected ? 'selected' : ''} ${item.disabled ? 'disabled' : ''}`}
                            onClick={() => executeCommand(item)}
                            onMouseEnter={() => setSelectedCmdIndex(globalIndex)}
                          >
                            <div className="cmd-item-left">
                              <div className="cmd-icon-box" style={{ color: item.iconColor }}>
                                <Icon size={19} />
                              </div>
                              <span className="cmd-item-title">{item.title}</span>
                              {item.active && <span className="cmd-pill-activo">Activo</span>}
                            </div>
                            <span className="cmd-item-sub">{item.sub}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>

            <div className="cmd-footer">
              <div className="cmd-footer-hints">
                <span className="cmd-hint">
                  <kbd className="cmd-key-box"><ArrowUpDown size={12} /></kbd> Navegar
                </span>
                <span className="cmd-hint">
                  <kbd className="cmd-key-box"><CornerDownLeft size={12} /></kbd> Ejecutar
                </span>
              </div>
              <div className="cmd-footer-count">
                {filteredCommands.length} comando(s)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

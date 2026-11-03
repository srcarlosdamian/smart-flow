import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search, Bell, Globe, Sun, Moon, Wrench, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  CirclePlus, CircleMinus, CircleAlert,
  ZoomIn, ZoomOut, SquareArrowUp, Box, SquareArrowRight, SquareMousePointer,
  Cable, Fullscreen,
  UserRoundSearch, Layers2, CircleGauge, Waypoints, AudioWaveform, Siren, Trash,
  Wind, Flame, Zap, Wifi, MapPin, Activity, Users, Minus,
  Grid3x3, Workflow, Check, ArrowLeft, ArrowUp, Plus, PanelRightClose, LandPlot, Settings,
  EllipsisVertical, Ellipsis, TextAlignStart, Pin, PictureInPicture2, SquareArrowOutUpRight,
  RotateCcw, FlaskConical, History, ShieldCheck,
  Droplets, Mountain, ArrowUpDown, CornerDownLeft,
  Play, Pause, ChevronsLeft, ChevronsRight, RotateCw, Bookmark, Repeat, Crosshair, Calendar,
  X, DoorOpen, Sparkles,
  Clock, TrendingDown, TrendingUp, Target, SlidersHorizontal,
} from 'lucide-react'
import Scene3D, { type ViewMode, type Theme } from './Scene3D'
import DiagramView from './DiagramView'
import SurfaceView from './SurfaceView'
import InteriorBombeoView from './InteriorBombeoView'
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
  category: 'Vista' | 'Tracking' | 'Simulaciones' | 'Análisis' | 'Interiores'
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

const PUMPS_SIDEBAR = [
  { id: 'BA-01', name: 'BA-01', flow: '78 L/s · 12.4 bar', hours: '3120 h de servicio', status: 'marcha', statusText: 'En marcha', temp: '62°C', barPercent: 65 },
  { id: 'BA-02', name: 'BA-02', flow: '74 L/s · 11.9 bar', hours: '2870 h de servicio', status: 'marcha', statusText: 'En marcha', temp: '59°C', barPercent: 62 },
  { id: 'BA-03', name: 'BA-03', flow: '0 L/s · 0.0 bar', hours: '1490 h de servicio', status: 'reserva', statusText: 'Reserva', temp: '24°C', barPercent: 0 },
  { id: 'BA-04', name: 'BA-04', flow: '0 L/s · 0.0 bar', hours: '4650 h de servicio', status: 'falla', statusText: 'Falla', temp: '81°C', barPercent: 100 },
]

const TRACKING_CATALOG: { id: TrackingType; label: string; menuLabel: string; color: string; icon: typeof UserRoundSearch }[] = [
  { id: 'personal', label: 'Personal y vehículos', menuLabel: 'Personal y vehículos', color: '#2196f3', icon: UserRoundSearch },
  { id: 'zonas', label: 'Zonas y áreas', menuLabel: 'Zonas y áreas', color: '#ff9800', icon: Layers2 },
  { id: 'perimetros', label: 'Perímetros', menuLabel: 'Perímetros', color: '#f44336', icon: CircleGauge },
  { id: 'recorrido', label: 'Recorrido', menuLabel: 'Recorrido', color: '#7c4dff', icon: Waypoints },
  { id: 'escenario', label: 'Escenario alterno', menuLabel: 'Escenario alterno', color: '#00bfa5', icon: AudioWaveform },
  { id: 'evacuacion', label: 'Declarar evaluación', menuLabel: 'Declarar evacuación', color: '#ff5252', icon: Siren },
]

const ZONAS_DATA = [
  { id: 'z1', title: 'Nivel 3', sub: 'Chancador', status: 'Restringida', color: '#f44336', alert: 1, ratio: '1/3', ext: '51 tramos', nivel: 'N03', vehicles: ['Camion T-03', 'Scoop ST-02'] },
  { id: 'z2', title: 'Rampa', sub: 'principal', status: 'Operativa', color: '#2196f3', ratio: '3/14', ext: '85 tramos', nivel: 'N01-N04', vehicles: ['Camion T-01', 'Camioneta C-04'] },
  { id: 'z3', title: 'Nivel 1', sub: 'Galeria norte', status: 'Operativa', color: '#2196f3', ratio: '0/10', ext: '42 tramos', nivel: 'N01', vehicles: [] },
  { id: 'z4', title: 'Nivel 2', sub: 'Taller mecanico', status: 'Operativa', color: '#2196f3', ratio: '2/8', ext: '38 tramos', nivel: 'N02', vehicles: ['Scoop ST-01'] },
  { id: 'z5', title: 'Nivel 2', sub: 'Frente de avance', status: 'Operativa', color: '#2196f3', ratio: '2/6', ext: '29 tramos', nivel: 'N02', vehicles: ['Jumbo J-01'] },
  { id: 'z6', title: 'Nivel 3', sub: 'Frente de voladura', status: 'Peligrosa', color: '#f44336', ratio: '0/4', ext: '34 tramos', nivel: 'N03', vehicles: [] },
  { id: 'z7', title: 'Refugio', sub: 'R-02', status: 'Refugio', color: '#2196f3', ratio: '1/16', ext: '12 tramos', nivel: 'N02', vehicles: [] },
  { id: 'z8', title: 'Nivel 4', sub: 'Galeria principal', status: 'Operativa', color: '#2196f3', ratio: '0/10', ext: '60 tramos', nivel: 'N04', vehicles: [] },
  { id: 'z9', title: 'Nivel 4', sub: 'Frente de avance', status: 'Operativa', color: '#2196f3', ratio: '0/6', ext: '22 tramos', nivel: 'N04', vehicles: [] },
]

export interface SimulationItem {
  id: string
  label: string
  category: 'VENTILACIÓN' | 'ENERGÍA' | 'COMUNICACIONES' | 'SEGURIDAD' | 'PERSONAL'
  icon: typeof Wind
  color: string
}

const SIMULATION_CATALOG: SimulationItem[] = [
  { id: 'aire', label: 'Flujo de aire', category: 'VENTILACIÓN', icon: Wind, color: '#03a9f4' },
  { id: 'calor', label: 'Mapa de calor', category: 'VENTILACIÓN', icon: Flame, color: '#ff5722' },
  { id: 'energia', label: 'Flujo de energía', category: 'ENERGÍA', icon: Zap, color: '#fbc02d' },
  { id: 'red', label: 'Flujo de red', category: 'COMUNICACIONES', icon: Wifi, color: '#7c4dff' },
  { id: 'geocercas', label: 'Geocercas', category: 'SEGURIDAD', icon: MapPin, color: '#f44336' },
  { id: 'sismicas', label: 'Vibraciones sísmicas', category: 'SEGURIDAD', icon: Activity, color: '#e91e63' },
  { id: 'personal', label: 'Movimiento de personal', category: 'PERSONAL', icon: Users, color: '#00bfa5' },
]

export interface InteriorItem {
  id: string
  title: string
  subTitle: string
  category: string
  icon: any
  iconColor: string
  locationLabel: string
  level: string
  metrics: {
    label: string
    value: string
    valueColor?: string
    bar?: { current: number; max: number }
  }[]
  disabled?: boolean
}

const INTERIORES_DATA: InteriorItem[] = [
  {
    id: 'refugio',
    title: 'Refugio R-01',
    subTitle: 'Refugio',
    category: 'General',
    icon: ShieldCheck,
    iconColor: '#00e676',
    locationLabel: 'Refugio',
    level: 'L5',
    metrics: [
      { label: 'Ocupación', value: '1 / 12 personas', bar: { current: 1, max: 12 } },
      { label: 'Oxígeno', value: '69 h de autonomía' },
      { label: 'Comunicación', value: 'Enlace activo', valueColor: '#00c853' },
      { label: 'Última inspección', value: '2026-07-11' },
    ],
  },
  {
    id: 'taller',
    title: 'Taller mecánico TM-01',
    subTitle: 'Taller mecánico',
    category: 'General',
    icon: Wrench,
    iconColor: '#ffb300',
    locationLabel: 'Taller mecánico',
    level: 'L2',
    metrics: [
      { label: 'Órdenes activas', value: '2 en proceso' },
      { label: 'Bahías ocupadas', value: '2 / 2', bar: { current: 2, max: 2 } },
      { label: 'Técnicos en turno', value: '4' },
      { label: 'Horas pendientes', value: '29 h' },
    ],
  },
  {
    id: 'bombeo',
    title: 'Sala de bombeo SB-01',
    subTitle: 'Sala de bombeo',
    category: 'General',
    icon: Droplets,
    iconColor: '#00b0ff',
    locationLabel: 'Sala de bombeo',
    level: 'L5',
    metrics: [
      { label: 'Nivel del sumidero', value: '85%', valueColor: '#f44336', bar: { current: 85, max: 100 } },
      { label: 'Bombas en marcha', value: '3 / 4' },
      { label: 'Caudal total', value: '157 L/s' },
      { label: 'Presión de descarga', value: '12.4 bar' },
    ],
  },
  {
    id: 'chancador',
    title: 'Chancador CH-01',
    subTitle: 'Chancador',
    category: 'General',
    icon: Mountain,
    iconColor: '#ff5722',
    locationLabel: 'Chancador',
    level: 'L3',
    metrics: [
      { label: 'Tonelaje', value: '857 t/h' },
      { label: 'Utilización', value: '71%', bar: { current: 71, max: 100 } },
      { label: 'Etapas en alarma', value: '1' },
      { label: 'Disponibilidad', value: '95%' },
    ],
  },
]

export interface WhatIfConsequence {
  id: string
  level: 'critical' | 'high' | 'medium'
  levelLabel: string
  title: string
  desc: string
  hasTarget?: boolean
  coords?: [number, number, number]
}

export interface WhatIfScenarioData {
  title: string
  elementLabel: string
  ms: number
  kpis: { label: string; val: string }[]
  beforeAfter: {
    label: string
    before: string
    after: string
    unit: string
    trend?: 'down' | 'up'
    trendColor?: string
  }[]
  consequences: WhatIfConsequence[]
  mitigations: { id: string; text: string }[]
}

const WHAT_IF_SCENARIOS: Record<string, WhatIfScenarioData> = {
  'CD-MT-01': {
    title: '¿Qué pasa si desconecto CD-MT-01?',
    elementLabel: 'Subestación Principal CD-MT-01',
    ms: 16,
    kpis: [
      { label: 'Subestaciones sin suministro', val: '5' },
      { label: 'Ventiladores fuera', val: '6 / 15' },
      { label: 'Zonas bajo el mínimo', val: '8 / 8' },
      { label: 'Personas en riesgo', val: '4' },
      { label: 'Variación de caudal total', val: '-35%' },
    ],
    beforeAfter: [
      { label: 'Caudal total inyectado', before: '925', after: '600', unit: 'm3/s', trend: 'down', trendColor: '#ff9800' },
      { label: 'Zonas con ventilación conforme', before: '0', after: '0', unit: 'de 8' },
      { label: 'Personal en zona degradada', before: '30.0', after: '30.0', unit: 'personas' },
      { label: 'Margen mínimo hasta umbral', before: '1.9', after: '1.0', unit: 'min', trend: 'down', trendColor: '#f44336' },
      { label: 'Potencia de ventilación', before: '2425', after: '1580', unit: 'kW', trend: 'down', trendColor: '#4caf50' },
      { label: 'Carga desconectada', before: '0', after: '1373', unit: 'kVA', trend: 'up', trendColor: '#f44336' },
    ],
    consequences: [
      {
        id: 'c1',
        level: 'critical',
        levelLabel: 'Crítico',
        title: '5 subestaciones sin suministro',
        desc: 'CD-MT-01, CD-MT-T-01, SM-01, SM-03, ENDIS-02. Carga desconectada: 1373 kVA.',
        hasTarget: false,
      },
      {
        id: 'c2',
        level: 'critical',
        levelLabel: 'Crítico · a los 2.3 h',
        title: 'Nivel 2 - Este pierde 50% de caudal',
        desc: 'Caudal de 0 a 0 m3/s (requerido 43 m3/s). 4 personas en zona. Margen hasta umbral: 2 h.',
        hasTarget: true,
        coords: [-9, 6.8, -6.5],
      },
      {
        id: 'c3',
        level: 'critical',
        levelLabel: 'Crítico · a los 0:59 min',
        title: 'Nivel 4 - Oeste pierde 100% de caudal',
        desc: 'Caudal de 27 a 0 m3/s (requerido 43 m3/s). 4 personas en zona. Margen hasta umbral: 1 min.',
        hasTarget: true,
        coords: [12, 2.5, -4.5],
      },
      {
        id: 'c4',
        level: 'critical',
        levelLabel: 'Crítico · a los 32:34 min',
        title: 'Nivel 1 - Oeste pierde 9% de caudal',
        desc: 'Caudal de 1 a 1 m3/s (requerido 43 m3/s). 4 personas en zona. Margen hasta umbral: 33 min.',
        hasTarget: true,
        coords: [-14, 10, -4],
      },
      {
        id: 'c5',
        level: 'high',
        levelLabel: 'Alto',
        title: 'V-PH-01 se detiene por falta de suministro',
        desc: 'Alimentado desde CD-MT-T-01, Caudal perdido: 90 m3/s.',
        hasTarget: true,
        coords: [0, 14, -5],
      },
      {
        id: 'c6',
        level: 'high',
        levelLabel: 'Alto',
        title: 'V-PH-02 se detiene por falta de suministro',
        desc: 'Alimentado desde CD-MT-T-01, Caudal perdido: 90 m3/s.',
        hasTarget: true,
        coords: [-4, 11, -5],
      },
      {
        id: 'c7',
        level: 'high',
        levelLabel: 'Alto',
        title: 'V-PV-01 se detiene por falta de suministro',
        desc: 'Alimentado desde CD-MT-01. Caudal perdido: 70 m3/s.',
        hasTarget: true,
        coords: [4, 9, -5],
      },
      {
        id: 'c8',
        level: 'medium',
        levelLabel: 'Medio',
        title: 'V-SA-01 se detiene por falta de suministro',
        desc: 'Alimentado desde SM-01. Caudal perdido: 25 m3/s.',
        hasTarget: true,
        coords: [-12, 10, -5],
      },
      {
        id: 'c9',
        level: 'medium',
        levelLabel: 'Medio',
        title: 'V-SA-03 se detiene por falta de suministro',
        desc: 'Alimentado desde SM-03. Caudal perdido: 25 m3/s.',
        hasTarget: true,
        coords: [10, 2.8, -5],
      },
    ],
    mitigations: [
      { id: 'm1', text: 'Subir frecuencia de ventiladores operativos (V-PH-03 a 60 Hz) para compensar déficits.' },
      { id: 'm2', text: 'Restringir el ingreso de equipos diésel a Nivel 2 y Nivel 4.' },
      { id: 'm3', text: 'Reubicar al personal hacia sectores con ventilación conforme.' },
      { id: 'm4', text: 'Transferir cargas críticas a subestación móvil de respaldo SM-02 antes de la maniobra.' },
    ],
  },
  'V-PH-01': {
    title: '¿Qué pasa si falla el ventilador V-PH-01?',
    elementLabel: 'Ventilador Principal V-PH-01',
    ms: 12,
    kpis: [
      { label: 'Subestaciones sin suministro', val: '0' },
      { label: 'Ventiladores fuera', val: '1 / 15' },
      { label: 'Zonas bajo el mínimo', val: '2 / 8' },
      { label: 'Personas en riesgo', val: '2' },
      { label: 'Variación de caudal total', val: '-11%' },
    ],
    beforeAfter: [
      { label: 'Caudal total inyectado', before: '925', after: '835', unit: 'm3/s', trend: 'down', trendColor: '#ff9800' },
      { label: 'Zonas con ventilación conforme', before: '8', after: '6', unit: 'de 8' },
      { label: 'Personal en zona degradada', before: '0.0', after: '4.0', unit: 'personas' },
      { label: 'Margen mínimo hasta umbral', before: '1.9', after: '1.4', unit: 'min', trend: 'down', trendColor: '#ff9800' },
      { label: 'Potencia de ventilación', before: '2425', after: '2100', unit: 'kW', trend: 'down', trendColor: '#4caf50' },
      { label: 'Carga desconectada', before: '0', after: '0', unit: 'kVA' },
    ],
    consequences: [
      {
        id: 'cv1',
        level: 'critical',
        levelLabel: 'Crítico · a los 4:10 min',
        title: 'Nivel 1 - Galería Norte pierde 30% de caudal',
        desc: 'Caudal cae de 90 a 62 m3/s. 2 personas en zona.',
        hasTarget: true,
        coords: [-14, 10, -4],
      },
      {
        id: 'cv2',
        level: 'high',
        levelLabel: 'Alto',
        title: 'V-PH-01 detenido por disparo de protección',
        desc: 'Caudal perdido: 90 m3/s directo en tiro principal.',
        hasTarget: true,
        coords: [0, 14, -5],
      },
    ],
    mitigations: [
      { id: 'mv1', text: 'Activar ventilador de relevo V-PH-02 a 58 Hz en menos de 5 minutos.' },
      { id: 'mv2', text: 'Suspender operaciones de acarreo en Rampa Nivel 1.' },
    ],
  },
}

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

export interface VehicleDetailItem {
  name: string
  type: string
  zone: string
  level: string
  precision: string
  time?: string
  recent?: string
}

export type SidebarView =
  | null
  | { type: 'user'; data: PersonalItem }
  | { type: 'interior'; data: InteriorItem }
  | { type: 'whatif_result' }
  | { type: 'escenario_condiciones' }
  | { type: 'escenario_comparacion' }
  | { type: 'zona_detail'; data: (typeof ZONAS_DATA)[0] }
  | { type: 'vehicle_detail'; data: VehicleDetailItem }

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
    name: 'Carlos García',
    role: 'Perforista',
    area: 'Superficie',
    alert: 1,
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
  { id: '11', name: 'Claudio Castro', sub: 'Claudia Cisneros' },
  { id: '12', name: 'Cristóbal Cruz', sub: 'Cristina Corona' },
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
  const [nexoPrompt, setNexoPrompt] = useState('')
  const [nexoMessages, setNexoMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [interiorView, setInteriorView] = useState<'bombeo' | null>(null)
  const [selectedPump, setSelectedPump] = useState<string>('BA-01')
  const [active3DPoint, setActive3DPoint] = useState<string | null>(null)
  const [aiKpiOpen, setAiKpiOpen] = useState(true)
  const [whatIfTarget, setWhatIfTarget] = useState('V-PH-01')
  const [whatIfAction, setWhatIfAction] = useState('Parada no programada de ventilador')
  const [whatIfHorizon, setWhatIfHorizon] = useState(60)
  const [whatIfAxes, setWhatIfAxes] = useState({ carga: true, vent: true, dilucion: true })
  const [perfLevel, setPerfLevel] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo')
  const [autoPerf, setAutoPerf] = useState(false)
  const [level, setLevel] = useState('L1')
  const [activeTool, setActiveTool] = useState<string>('')
  const [helpInfo, setHelpInfo] = useState<{ title: string; desc: string } | null>(null)

  const showHelp = (title: string, desc: string) => ({
    onMouseEnter: () => setHelpInfo({ title, desc }),
    onMouseLeave: () => setHelpInfo(null),
  })

  // Navigation & Sub-views in Sidebar
  const [sidebarView, setSidebarView] = useState<SidebarView>(null)
  const setSelectedUser = (u: PersonalItem | null) => setSidebarView(u ? { type: 'user', data: u } : null)
  const [recorridoPlayerVisible] = useState(true)

  // TRACKING state: empty by default per user request
  const [activeTrackings, setActiveTrackings] = useState<TrackingType[]>([])
  const [expandedTrack, setExpandedTrack] = useState<Record<string, boolean>>({})
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({ '3': true, '4': true })

  // SIMULACIONES state: empty by default per user request
  const [activeSimulations, setActiveSimulations] = useState<string[]>([])

  const toggleTrackItem = (id: string) => {
    setExpandedTrack((prev) => (prev[id] ? {} : { [id]: true }))
  }

  // Escenario alterno state
  const [escenarioCierres, setEscenarioCierres] = useState<string[]>(['Nivel 2 - Taller mecanico', 'Frente de voladura'])
  const [escenarioRefugios, setEscenarioRefugios] = useState<string[]>(['Refugio R01', 'Refugio R02'])
  const [escenarioFueraTurno, setEscenarioFueraTurno] = useState<string[]>(['Miguel Torres', 'Juan Garcia'])
  const [escenarioPuntos, setEscenarioPuntos] = useState({ n01: true, n04: true, n07: true })
  const [escenarioDensidad, setEscenarioDensidad] = useState<Record<string, number>>({
    'Rampa principal': 1,
    'Nivel 1 - Galeria norte': 1,
    'Nivel 2 - Taller mecanico': 0,
    'Nivel 2 - Frente de avance': 0,
    'Nivel 3 - Frente de voladura': 0,
    'Nivel 3 - Chancador': 0,
    'Refugio R-01': 0,
  })
  const [escenarioMinuto10, setEscenarioMinuto10] = useState(true)
  const [escenarioSlider, setEscenarioSlider] = useState(25)

  // Vehicle auxilio state
  const [auxilioTab, setAuxilioTab] = useState<'sin_resolver' | 'resueltas'>('sin_resolver')
  const [auxilioAddOpen, setAuxilioAddOpen] = useState(false)
  const [vehicleAuxilios, setVehicleAuxilios] = useState<string[]>(['Hombre caído', 'Coacción', 'SOS'])

  // Recorrido Player & Detail state (SMF - V2 - 7, 8, 9)
  const [playerPlaying, setPlayerPlaying] = useState(false)
  const [playerSeconds, setPlayerSeconds] = useState(4)
  const [playerSpeed, setPlayerSpeed] = useState<'0.5x' | '1x' | '2x' | '4x' | '8x'>('1x')
  const [playerSeverityFilter, setPlayerSeverityFilter] = useState<string | null>('Aviso')
  const [playerBookmarked, setPlayerBookmarked] = useState(false)
  const [playerLoop, setPlayerLoop] = useState(false)
  const [auxilioHandled, setAuxilioHandled] = useState(false)
  const [auxilioResolved, setAuxilioResolved] = useState(false)
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

  const rightColRef = useRef<HTMLDivElement>(null)
  const nexoMoreRef = useRef<HTMLDivElement>(null)

  const toggle = (k: string) => setOpenSection((prev) => (prev === k ? null : k))
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
    setExpandedTrack({ [id]: true })
    setOpenSection('track')
    setDdOpen(null)
  }

  const removeTrackingItem = (id: TrackingType) => {
    setActiveTrackings((prev) => prev.filter((item) => item !== id))
  }

  const addSimulationItem = (id: string) => {
    setActiveSimulations((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setOpenSection('sim')
    setDdOpen(null)
  }

  const removeSimulationItem = (id: string) => {
    setActiveSimulations((prev) => prev.filter((item) => item !== id))
  }

  const sendNexoMessage = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    const replyMap: Record<string, string> = {
      'Ponme al día con el turno': 'El turno actual opera con normalidad. Hay 28 trabajadores activos en interior mina, 2 alertas preventivas en Nivel 3 (Chancador) y Nivel 5 (Sala de bombeo), y los refugios R-01 y R-04 se encuentran operativos.',
      '¿Cómo está la ventilación?': 'Nexo calculó la red de ventilación (10 sensores en línea): La mina tiene 14 % más flujo de aire del requerido. El punto más ajustado es el Nivel 3 al 106 % de su mínimo. Si se detuviera V-PH-01 bajaría del mínimo en unos 25 minutos.',
      '¿Por qué se degrada el rodamiento de V-SA-01?': 'Nexo leyó 10 sensores, revisó 2 años de historial y comparó 42 ventiladores similares:\n• Alerta crítica (91% confianza): Falla probable en 17 días por desgaste de rodamiento SKF 6310. Vibración al alza (+12%/sem) a 3.68 mm/s y 52 °C.\n• Consecuencia si no se actúa: Parada no planificada de ~14 h, evacuación de 38 personas, costo estimado US$48,000 vs US$3,200 planificado.',
      '¿Cuándo es el mejor momento para detenerlo?': 'Revisado el plan de producción, cuadrillas y almacén: se recomienda ventana de mantenimiento este Jueves 14:00–16:00 (menor demanda de ventilación en N3) y reservar 2 × SKF 6310 en almacén central.',
      '¿Qué pasa si no hacemos nada?': 'Proyección a 14 días (Health score 78% → 61%): Parada intempestiva del ventilador, pérdida de caudal normativo en Nivel 3 en 25 min y paro forzado de equipos de acarreo.',
      '¿Dónde está la gente en este momento?': 'Actualmente hay 14 personas en Galería Norte (L1), 8 en Taller Mecánico (L2), 4 en Rampa Principal y 2 en Sala de Bombeo (L5).',
      '¿Cómo mitigar la falla de BA-04 en Sala de bombeo SB-01?': 'Recomendación Nexo: Arrancar la bomba BA-03 (actualmente en reserva) para estabilizar el caudal en 152 L/s y evitar el rebose del sumidero (64%), mientras la cuadrilla aísla BA-04.',
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
    { id: 'proj-3d', title: '3D – Perspectiva', category: 'Vista', sub: 'Proyección', icon: Box, active: selectedProj === '3D - Perspectiva', action: () => { setSelectedProj('3D - Perspectiva'); setMode('perspective') } },
    { id: 'proj-2d', title: '2D – Vista superior', category: 'Vista', sub: 'Proyección', icon: SquareArrowUp, active: selectedProj === '2D - Vista superior', action: () => { setSelectedProj('2D - Vista superior'); setMode('top') } },
    { id: 'proj-2d-imm', title: '2D inmersivo', category: 'Vista', sub: 'Cambia a vista superior (2D)', icon: Layers2, active: selectedProj === '2D - Vista superior', action: () => { setSelectedProj('2D - Vista superior'); setMode('top') } },
    { id: 'proj-diagram', title: 'Diagrama de planta', category: 'Vista', sub: 'Proyección', icon: Cable, active: selectedProj === '2D - Diagrama de planta', action: () => { setSelectedProj('2D - Diagrama de planta'); setMode('top') } },
    { id: 'proj-surface', title: 'Superficie', category: 'Vista', sub: 'Proyección', icon: Globe, active: selectedProj === '3D - Superficie', action: () => { setSelectedProj('3D - Superficie'); setMode('perspective') } },
    { id: 'panel-perf', title: 'Estadísticas de rendimiento', category: 'Vista', sub: 'Paneles', icon: CircleGauge, action: () => setOpenSection('perf') },

    // Tracking
    { id: 'track-personal', title: 'Personal y vehículos', category: 'Tracking', sub: 'En vivo', icon: UserRoundSearch, iconColor: '#2196f3', action: () => { addTrackingItem('personal'); setOpenSection('track') } },
    { id: 'track-zonas', title: 'Zonas y áreas', category: 'Tracking', sub: 'En vivo', icon: Layers2, iconColor: '#ff9800', action: () => { addTrackingItem('zonas'); setOpenSection('track') } },
    { id: 'track-perim', title: 'Perímetros', category: 'Tracking', sub: 'En vivo', icon: CircleGauge, iconColor: '#f44336', action: () => { addTrackingItem('perimetros'); setOpenSection('track') } },
    { id: 'track-recorrido', title: 'Recorrido', category: 'Tracking', sub: 'Histórico', icon: Waypoints, iconColor: '#7c4dff', action: () => { addTrackingItem('recorrido'); setOpenSection('track') } },
    { id: 'track-escenario', title: 'Escenario alterno', category: 'Tracking', sub: 'Histórico', icon: AudioWaveform, iconColor: '#00bfa5', action: () => { addTrackingItem('escenario'); setOpenSection('track') } },
    { id: 'track-reset', title: 'Restablecer la demostración', category: 'Tracking', sub: 'Emergencia', icon: RotateCcw, iconColor: '#546e7a', action: () => { setActiveTrackings([]) } },
    { id: 'track-evac', title: 'Declarar evacuación', category: 'Tracking', sub: 'Emergencia', icon: Siren, iconColor: '#ff5252' },

    // Simulaciones
    { id: 'sim-aire', title: 'Flujo de aire', category: 'Simulaciones', sub: 'Ventilación', icon: Wind, iconColor: '#00bcd4', action: () => setOpenSection('sim') },
    { id: 'sim-calor', title: 'Mapa de calor', category: 'Simulaciones', sub: 'Ventilación', icon: Flame, iconColor: '#ff5722', action: () => setOpenSection('sim') },
    { id: 'sim-energia', title: 'Flujo de energía', category: 'Simulaciones', sub: 'Energía', icon: Zap, iconColor: '#ffc107', action: () => setOpenSection('sim') },
    { id: 'sim-red', title: 'Flujo de red', category: 'Simulaciones', sub: 'Módulo aún no implementado', icon: Wifi, iconColor: '#2196f3', disabled: true },
    { id: 'sim-geocercas', title: 'Geocercas', category: 'Simulaciones', sub: 'Seguridad', icon: MapPin, iconColor: '#9c27b0', action: () => setOpenSection('sim') },
    { id: 'sim-sismicas', title: 'Vibraciones sísmicas', category: 'Simulaciones', sub: 'Módulo aún no implementado', icon: Activity, iconColor: '#e91e63', disabled: true },
    { id: 'sim-personal', title: 'Movimiento de personal', category: 'Simulaciones', sub: 'Personal', icon: Users, iconColor: '#4caf50', action: () => setOpenSection('sim') },
    { id: 'sim-hide', title: 'Ocultar todas las capas', category: 'Simulaciones', sub: 'Simulaciones', icon: Trash, iconColor: '#78909c', action: () => setOpenSection(null) },

    // Análisis
    { id: 'ana-sub', title: 'Apagón de subestación', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpenSection('ana') },
    { id: 'ana-vent', title: 'Falla de ventilador', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpenSection('ana') },
    { id: 'ana-gas', title: 'Fuga de gas', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpenSection('ana') },
    { id: 'ana-evac', title: 'Evacuación de emergencia', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpenSection('ana') },
    { id: 'ana-cierre', title: 'Cierre de galería', category: 'Análisis', sub: 'Qué pasa si...', icon: FlaskConical, iconColor: '#e91e63', action: () => setOpenSection('ana') },
    { id: 'ana-time', title: 'Máquina del tiempo', category: 'Análisis', sub: 'Histórico', icon: History, iconColor: '#5c6bc0' },

    // Interiores
    { id: 'int-refugio', title: 'Refugio', category: 'Interiores', sub: 'En la mina', icon: ShieldCheck, iconColor: '#4caf50' },
    { id: 'int-taller', title: 'Taller mecánico', category: 'Interiores', sub: 'En la mina', icon: Wrench, iconColor: '#fbc02d' },
    { id: 'int-bombeo', title: 'Sala de bombeo', category: 'Interiores', sub: 'En la mina', icon: Droplets, iconColor: '#03a9f4' },
    { id: 'int-chancador', title: 'Chancador', category: 'Interiores', sub: 'En la mina', icon: Mountain, iconColor: '#ff7043' },
    { id: 'int-subestacion', title: 'Sala de subestación', category: 'Interiores', sub: 'Selecciona una subestación en el visor para entrar', icon: Zap, iconColor: '#fbc02d', disabled: true },
  ], [mode, selectedProj])

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
      {interiorView === 'bombeo' ? (
        <InteriorBombeoView
          theme={theme}
          onClose={() => setInteriorView(null)}
          selectedPumpId={selectedPump}
          onSelectPump={setSelectedPump}
          onAskNexo={(q) => {
            setNexoOpen(true)
            sendNexoMessage(q)
          }}
        />
      ) : selectedProj === '3D - Superficie' ? (
        <SurfaceView
          theme={theme}
          onClose={() => {
            setSelectedProj('3D - Perspectiva')
            setMode('perspective')
          }}
        />
      ) : selectedProj === '2D - Diagrama de planta' ? (
        <DiagramView theme={theme} zoom={zoom} onZoomChange={setZoom} />
      ) : (
        <>
          <Scene3D
            mode={selectedProj === '2D - Vista superior' ? 'top' : mode}
            zoom={zoom}
            theme={theme}
            activeSimulations={activeSimulations}
            onZoomChange={setZoom}
          />

          {/* Workspace AI KPI Strip with Sparklines & Nexo 14-day Forecast Marker (Guía Nexo PDF p.6, 8, 12, 18) */}
          {aiKpiOpen && (
            <div className="workspace-ai-kpis-strip glass">
              <div className="ai-kpi-item">
                <span className="ai-kpi-label">Consumo</span>
                <span className="ai-kpi-val">62.4 <small>kW</small></span>
                <svg className="ai-kpi-sparkline" viewBox="0 0 40 16">
                  <polyline fill="none" stroke="#38bdf8" strokeWidth="1.5" points="0,12 8,10 16,11 24,7 32,8 40,6" />
                </svg>
              </div>

              <div className="ai-kpi-divider" />

              <div className="ai-kpi-item">
                <span className="ai-kpi-label">Flujo</span>
                <span className="ai-kpi-val">125 <small>m³/s</small></span>
                <svg className="ai-kpi-sparkline" viewBox="0 0 40 16">
                  <polyline fill="none" stroke="#22c55e" strokeWidth="1.5" points="0,10 8,9 16,8 24,9 32,7 40,7" />
                </svg>
              </div>

              <div className="ai-kpi-divider" />

              <div className="ai-kpi-item">
                <span className="ai-kpi-label">Disponibilidad</span>
                <span className="ai-kpi-val highlight-green">94.2 <small>%</small></span>
                <svg className="ai-kpi-sparkline" viewBox="0 0 40 16">
                  <polyline fill="none" stroke="#22c55e" strokeWidth="1.5" points="0,7 8,8 16,6 24,7 32,6 40,6" />
                </svg>
              </div>

              <div className="ai-kpi-divider" />

              {/* Health Score with Forecast Dotted Line and Nexo 14 d: 61 marker */}
              <div
                className="ai-kpi-item health-score-item"
                onClick={() => {
                  setNexoOpen(true)
                  sendNexoMessage('¿Por qué se degrada el rodamiento de V-SA-01?')
                }}
                title="Clic para ver pronóstico de Nexo IA"
              >
                <div className="ai-kpi-head-row">
                  <span className="ai-kpi-label">Health Score</span>
                  <span className="ai-nexo-tag">Nexo 14 d: 61</span>
                </div>
                <div className="ai-kpi-val-row">
                  <span className="ai-kpi-val highlight-amber">78 <small>%</small></span>
                  <svg className="ai-kpi-sparkline forecast" viewBox="0 0 60 16">
                    <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" points="0,6 10,7 20,8 30,9 35,9" />
                    <polyline fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" points="35,9 45,12 55,15 60,15" />
                    <circle cx="55" cy="15" r="2" fill="#ef4444" />
                  </svg>
                </div>
              </div>

              <div className="ai-kpi-divider" />

              <div className="ai-kpi-item">
                <span className="ai-kpi-label">Alertas</span>
                <span className="ai-kpi-val highlight-red">1 <small>crítica</small></span>
                <svg className="ai-kpi-sparkline" viewBox="0 0 40 16">
                  <polyline fill="none" stroke="#ef4444" strokeWidth="1.5" points="0,14 8,14 16,14 24,14 32,4 40,4" />
                </svg>
              </div>

              <div className="ai-kpi-divider" />

              <div className="ai-kpi-item">
                <span className="ai-kpi-label">Horas operación</span>
                <span className="ai-kpi-val">12,400 <small>h</small></span>
                <svg className="ai-kpi-sparkline" viewBox="0 0 40 16">
                  <polyline fill="none" stroke="#94a3b8" strokeWidth="1.5" points="0,14 8,12 16,10 24,8 32,6 40,4" />
                </svg>
              </div>

              <button
                className="ai-kpi-close-btn"
                onClick={() => setAiKpiOpen(false)}
                title="Ocultar tira KPI"
                aria-label="Ocultar tira KPI"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 4,
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Subtle 3D Points of Interest with Anchored Dropdowns (Guía Nexo PDF p.10, 11) */}
          <div
            className={`poi-subtle-indicator alerta ${active3DPoint === 'v-sa-01' ? 'active' : ''}`}
            style={{ left: '46%', top: '38%' }}
            onClick={() => setActive3DPoint(active3DPoint === 'v-sa-01' ? null : 'v-sa-01')}
            title="V-SA-01: Alerta predictiva de rodamiento"
          >
            <div className="poi-circle-pulse" />
            <div className="poi-center-dot" />
            <div className="poi-mini-tag">87% · 17 d</div>
          </div>

          <div
            className={`poi-subtle-indicator cyan ${active3DPoint === 'sb-01' ? 'active' : ''}`}
            style={{ left: '58%', top: '56%' }}
            onClick={() => setActive3DPoint(active3DPoint === 'sb-01' ? null : 'sb-01')}
            title="SB-01: Sala de bombeo interior L5"
          >
            <div className="poi-center-dot" />
            <div className="poi-mini-tag">SB-01 · 64%</div>
          </div>

          {active3DPoint === 'v-sa-01' && (
            <div className="poi-anchored-dropdown glass" style={{ left: 'calc(46% + 24px)', top: '32%' }}>
              <div className="poi-dropdown-header">
                <div>
                  <div className="poi-dropdown-title">Bearings · Rodamiento delantero</div>
                  <div className="poi-dropdown-sub">SKF 6310 ball bearing · V-SA-01</div>
                </div>
                <button className="poi-close-btn" onClick={() => setActive3DPoint(null)}>
                  <X size={14} />
                </button>
              </div>

              <div className="poi-dropdown-divider" />

              <div className="poi-dropdown-grid">
                <div className="poi-grid-row">
                  <span className="poi-k">Temperatura:</span>
                  <span className="poi-v highlight-amber">52.01 °C <small>▲ +0.32°C/min</small></span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Vibración:</span>
                  <span className="poi-v highlight-red">3.68 mm/s <small>(umbral: 2.8)</small></span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Horas de operación:</span>
                  <span className="poi-v">13,078 h</span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Predicción de falla:</span>
                  <span className="poi-v highlight-red">18.55 d (fuera de umbral)</span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Salud:</span>
                  <span className="poi-v highlight-amber">72%</span>
                </div>
              </div>

              <div className="poi-dropdown-divider" />

              <div className="poi-dropdown-actions">
                <button
                  className="poi-ask-btn"
                  onClick={() => {
                    setActive3DPoint(null)
                    setNexoOpen(true)
                    sendNexoMessage('¿Por qué se degrada el rodamiento de V-SA-01?')
                  }}
                >
                  <Sparkles size={14} />
                  <span>Ask Nexo about this</span>
                </button>
              </div>
            </div>
          )}

          {active3DPoint === 'sb-01' && (
            <div className="poi-anchored-dropdown glass" style={{ left: 'calc(58% + 24px)', top: '48%' }}>
              <div className="poi-dropdown-header">
                <div>
                  <div className="poi-dropdown-title">Sala de bombeo SB-01</div>
                  <div className="poi-dropdown-sub">Nivel 5 · Interior mina</div>
                </div>
                <button className="poi-close-btn" onClick={() => setActive3DPoint(null)}>
                  <X size={14} />
                </button>
              </div>

              <div className="poi-dropdown-divider" />

              <div className="poi-dropdown-grid">
                <div className="poi-grid-row">
                  <span className="poi-k">Nivel del sumidero:</span>
                  <span className="poi-v highlight-cyan">64%</span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Bombas activas:</span>
                  <span className="poi-v">2 / 4 en marcha</span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Caudal total:</span>
                  <span className="poi-v">152 L/s</span>
                </div>
                <div className="poi-grid-row">
                  <span className="poi-k">Estado:</span>
                  <span className="poi-v highlight-red">BA-04 en falla (81°C)</span>
                </div>
              </div>

              <div className="poi-dropdown-divider" />

              <div className="poi-dropdown-actions">
                <button
                  className="poi-enter-scene-btn"
                  onClick={() => {
                    setActive3DPoint(null)
                    setInteriorView('bombeo')
                    setSidebarView({ type: 'interior', data: INTERIORES_DATA[2] })
                  }}
                >
                  <DoorOpen size={14} />
                  <span>Entrar a la Sala 3D</span>
                </button>
                <button
                  className="poi-ask-btn secondary"
                  onClick={() => {
                    setActive3DPoint(null)
                    setNexoOpen(true)
                    sendNexoMessage('¿Cómo mitigar la falla de BA-04 en Sala de bombeo SB-01?')
                  }}
                >
                  <Sparkles size={14} />
                  <span>Preguntar a Nexo</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
      {selectedProj !== '3D - Superficie' && (
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
            className={`icon-btn ${activeTool === 'level-up' ? 'active' : ''}`}
            onClick={() => setActiveTool((t) => t === 'level-up' ? '' : 'level-up')}
            {...showHelp('Flecha arriba', 'Permite elevar o cambiar de nivel/piso en la visualización vertical de la mina.')}
          >
            <SquareArrowUp size={20} />
          </button>
          <button
            className={`icon-btn ${mode === 'perspective' ? 'active' : ''}`}
            onClick={() => { setSelectedProj('3D - Perspectiva'); setMode('perspective') }}
            {...showHelp('Cubo', 'Alterna o ajusta la vista de volúmenes 3D y geometrías de los modelos.')}
          >
            <Box size={20} />
          </button>
          <button
            className={`icon-btn ${activeTool === 'shift' ? 'active' : ''}`}
            onClick={() => setActiveTool((t) => t === 'shift' ? '' : 'shift')}
            {...showHelp('Flecha derecha', 'Desplaza la selección o cambia entre vistas/secciones adyacentes.')}
          >
            <SquareArrowRight size={20} />
          </button>
          <button
            className={`icon-btn ${activeTool === 'select' ? 'active' : ''}`}
            onClick={() => setActiveTool((t) => t === 'select' ? '' : 'select')}
            {...showHelp('Cuadros punteados (delimitadores)', 'Seleccionan áreas de interés, bounding boxes o zonas de recorte para aislar sectores.')}
          >
            <SquareMousePointer size={20} />
          </button>
          <hr />
          <button
            className="icon-btn"
            onClick={() => {}}
            {...showHelp('Flecha hacia arriba saliente', 'Exporta o sube configuraciones, capas o elementos personalizados a la plataforma.')}
          >
            <Fullscreen size={20} />
          </button>
          <button
            className={`icon-btn ${activeTool === 'network' ? 'active' : ''}`}
            onClick={() => { setSelectedProj('2D - Diagrama de planta') }}
            {...showHelp('Nodos conectados (Red)', 'Muestra u optimiza la topología de red, rutas de evacuación o conexiones estructurales.')}
          >
            <Workflow size={20} />
          </button>
          <button
            className={`icon-btn ${activeTool === 'sim-lab' ? 'active' : ''}`}
            onClick={() => setActiveTool((t) => t === 'sim-lab' ? '' : 'sim-lab')}
            {...showHelp('Matraz', 'Activa herramientas de simulación (como flujos, pruebas ambientales o análisis químicos/técnicos).')}
          >
            <FlaskConical size={20} />
          </button>
          <button
            className={`icon-btn ${activeTool === 'wrench-left' ? 'active' : ''}`}
            onClick={() => setActiveTool((t) => t === 'wrench-left' ? '' : 'wrench-left')}
            {...showHelp('Llave inglesa', 'Acceso rápido a herramientas de ajuste o propiedades del sistema seleccionado.')}
          >
            <Wrench size={20} />
          </button>
        </nav>
      )}

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
              </div>
            )}
          </div>
        )}

        <aside className={`glass panel ${ddOpen ? 'has-dropdown-open' : ''}`}>
          {sidebarView?.type === 'interior' ? (
            <div className="user-detail-panel interior-detail-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => {
                    setSidebarView(null)
                    if (interiorView === 'bombeo') setInteriorView(null)
                  }}
                  title="Volver"
                  aria-label="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Interiores / </span>
                  <span className="crumb-name">{sidebarView.data.title}</span>
                </div>
              </div>

              <div className="interior-panel-body" style={{ padding: '16px 20px' }}>
                <div className="interior-location-badge">
                  <MapPin size={15} style={{ color: sidebarView.data.iconColor }} />
                  <span style={{ color: sidebarView.data.iconColor }}>{sidebarView.data.locationLabel}</span>
                </div>

                <div className="interior-card-divider" />

                <div className="interior-metrics-list">
                  {sidebarView.data.metrics.map((m, idx) => (
                    <div key={idx} className="interior-metric-block">
                      <div className="row between interior-metric-row">
                        <span className="interior-metric-label">{m.label}</span>
                        <span className="interior-metric-val bold" style={{ color: m.valueColor }}>{m.value}</span>
                      </div>
                      {m.bar && (
                        <div className="interior-metric-progress">
                          <div
                            className="interior-progress-fill"
                            style={{ width: `${(m.bar.current / m.bar.max) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {sidebarView.data.id === 'bombeo' && interiorView === 'bombeo' ? (
                  <>
                    <div className="interior-card-divider" />

                    <div className="bombeo-sidebar-kpis">
                      <div className="bombeo-kpi-item">
                        <div className="kpi-label">NIVEL SUMIDERO</div>
                        <div className="kpi-val highlight-cyan">64%</div>
                        <div className="kpi-mini-bar"><div className="fill-cyan" style={{ width: '64%' }} /></div>
                      </div>
                      <div className="bombeo-kpi-item">
                        <div className="kpi-label">EN MARCHA</div>
                        <div className="kpi-val highlight-green">2 / 4</div>
                      </div>
                      <div className="bombeo-kpi-item">
                        <div className="kpi-label">CAUDAL TOTAL</div>
                        <div className="kpi-val">152 <small>L/s</small></div>
                      </div>
                      <div className="bombeo-kpi-item">
                        <div className="kpi-label">EN FALLA</div>
                        <div className="kpi-val highlight-red">1</div>
                      </div>
                    </div>

                    <div className="bombeo-section-title">BOMBAS (4)</div>
                    <div className="bombeo-pumps-list">
                      {PUMPS_SIDEBAR.map((p) => (
                        <div
                          key={p.id}
                          className={`bombeo-pump-card ${selectedPump === p.id ? 'active' : ''}`}
                          onClick={() => setSelectedPump(p.id)}
                        >
                          <div className="pump-card-header">
                            <div className="pump-name-group">
                              <span className={`pump-status-dot ${p.status}`} />
                              <span className="pump-name">{p.id}</span>
                            </div>
                            <div className="pump-status-pill-group">
                              <span className={`pump-status-badge ${p.status}`}>{p.statusText}</span>
                              <span className="pump-temp">{p.temp}</span>
                            </div>
                          </div>
                          <div className="pump-card-details">
                            <span className="pump-telemetry">{p.flow}</span>
                            <span className="pump-hours">{p.hours}</span>
                          </div>
                          <div className="pump-card-bar">
                            <div className={`pump-bar-fill ${p.status}`} style={{ width: `${p.barPercent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="bombeo-exit-btn"
                      onClick={() => setInteriorView(null)}
                    >
                      <span>Volver al modelo general de la mina</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="interior-card-divider" />
                    <button
                      className="interior-enter-btn blue-grad-no-shadow"
                      onClick={() => {
                        if (sidebarView.data.id === 'bombeo') {
                          setInteriorView('bombeo')
                        } else {
                          setLevel(sidebarView.data.level)
                          setZoom(120)
                        }
                      }}
                    >
                      <DoorOpen size={18} />
                      <span>Entrar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : sidebarView?.type === 'whatif_result' ? (
            <div className="user-detail-panel whatif-result-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => setSidebarView(null)}
                  title="Volver"
                  aria-label="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Análisis / </span>
                  <span className="crumb-name">Resultado del escenario</span>
                </div>
              </div>

              <div className="whatif-result-container" style={{ padding: '16px 20px' }}>
                {(() => {
                  const sc = WHAT_IF_SCENARIOS[whatIfTarget] || WHAT_IF_SCENARIOS['V-PH-01'] || WHAT_IF_SCENARIOS['CD-MT-01']
                  return (
                    <>
                      <h4 className="whatif-question-title">{sc.title}</h4>

                      <div className="whatif-chips-group">
                        <span className="whatif-chip">Flujo de carga radial</span>
                        <span className="whatif-chip">Red de ventilación</span>
                        <span className="whatif-chip">Dilución por zona</span>
                      </div>

                      <div className="whatif-meta-line">
                        <Clock size={13} className="whatif-clock-icon" />
                        <span>Resuelto en {sc.ms} ms · horizonte {whatIfHorizon} min</span>
                      </div>

                      <div className="whatif-section-title">Antes y después</div>
                      <div className="whatif-compare-list">
                        {sc.beforeAfter.map((row, idx) => (
                          <div key={idx} className="whatif-compare-row">
                            <span className="whatif-compare-label">{row.label}</span>
                            <div className="whatif-compare-values">
                              <span className="mono">{row.before}</span>
                              <span className="arrow">→</span>
                              <span
                                className="mono bold"
                                style={{
                                  color: row.trendColor || 'inherit',
                                }}
                              >
                                {row.after}
                              </span>
                              <span className="whatif-unit">{row.unit}</span>
                              {row.trend === 'down' ? (
                                <TrendingDown size={14} style={{ color: row.trendColor || '#ff9800' }} />
                              ) : row.trend === 'up' ? (
                                <TrendingUp size={14} style={{ color: row.trendColor || '#f44336' }} />
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="whatif-section-title" style={{ marginTop: 14 }}>
                        Consecuencias proyectadas ({sc.consequences.length})
                      </div>
                      <div className="whatif-consequences-stack">
                        {sc.consequences.map((c) => (
                          <div key={c.id} className="whatif-consequence-card">
                            <span
                              className={`whatif-severity-dot ${c.level}`}
                              title={c.levelLabel}
                            />
                            <div className="whatif-consequence-info">
                              <b className="whatif-consequence-title">{c.title}</b>
                              <p className="whatif-consequence-desc">{c.desc}</p>
                              <span className={`whatif-severity-tag ${c.level}`}>
                                {c.levelLabel}
                              </span>
                            </div>
                            {c.hasTarget && (
                              <button
                                className="whatif-target-btn"
                                title="Localizar en 3D"
                                onClick={() => {
                                  if (c.coords) setZoom(100)
                                }}
                              >
                                <Target size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="whatif-section-title" style={{ marginTop: 14 }}>Acciones recomendadas (Mitigación)</div>
                      <div className="whatif-mitigations-list">
                        {sc.mitigations.map((m) => (
                          <div key={m.id} className="whatif-mitigation-item">
                            <span className="whatif-mitigation-bullet">•</span>
                            <span>{m.text}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        className="whatif-reconfig-btn"
                        onClick={() => setSidebarView(null)}
                      >
                        <SlidersHorizontal size={15} />
                        <span>Modificar parámetros de maniobra</span>
                      </button>
                    </>
                  )
                })()}
              </div>
            </div>
          ) : sidebarView?.type === 'user' ? (
            <div className="user-detail-panel">
              {/* Header / Breadcrumb row matching Figma SMF - V2 - 9 & screenshot */}
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => setSidebarView(null)}
                  title="Volver"
                  aria-label="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Inicio / </span>
                  <span className="crumb-name">{sidebarView.data.name}</span>
                </div>
                <button
                  className="user-top-search-btn"
                  onClick={() => setSearchOpen(true)}
                  title="Buscar"
                  aria-label="Buscar"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* User title */}
              <h2 className="user-detail-title">{sidebarView.data.name}</h2>

              {/* Action buttons */}
              <div className="user-action-buttons">
                <button className="user-action-btn">
                  <Crosshair size={16} />
                  <span>Centrar en el mapa</span>
                </button>
                <button className="user-action-btn">
                  <span>Seguir usuario - {sidebarView.data.area || 'Superficie'}</span>
                </button>
              </div>

              {/* Info Table */}
              <div className="user-info-list">
                <div className="user-info-row">
                  <span className="info-label">Tipo</span>
                  <span className="info-value bold">{sidebarView.data.type || sidebarView.data.role}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Señal</span>
                  <span className="info-value">
                    <span className="user-signal-badge online">{sidebarView.data.status || 'En línea'}</span>
                  </span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Última observación</span>
                  <span className="info-value bold">{sidebarView.data.time || '00:25:00'}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Zona</span>
                  <span className="info-value bold text-right">{sidebarView.data.zone || 'Fuera de zonas monitoreadas'}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Precisión del fix</span>
                  <span className="info-value bold">{sidebarView.data.precision || '± 2.1 m'}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Recorrido reciente</span>
                  <span className="info-value bold">{sidebarView.data.recent || '5 min'}</span>
                </div>
              </div>

              {/* Sparkline / Recorrido Graph */}
              <div className="user-graph-container">
                <svg viewBox="0 0 280 48" className="user-graph-svg" preserveAspectRatio="none">
                  <path
                    d="M 6,38 C 30,38 60,37 90,35 C 130,34 160,26 195,20 C 220,16 235,16 250,14 C 255,16 260,18 263,16 L 274,8"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Petición de auxilio (Emergency Card) */}
              <div className="user-auxilio-section">
                <div className="auxilio-section-header">
                  <span className="auxilio-section-title">Petición de auxilio</span>
                  <button className="auxilio-add-btn" title="Agregar petición">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="auxilio-card">
                  <div className="auxilio-card-row1">
                    <span className="auxilio-type-title">Hombre caído</span>
                    <div className="auxilio-status-group">
                      <span className="auxilio-status-unattended">{auxilioHandled ? 'Atendido' : 'Sin atender'}</span>
                      <span className="auxilio-status-critical">{auxilioResolved ? 'Resuelto' : 'Crítico'}</span>
                    </div>
                  </div>

                  <div className="auxilio-card-row2">
                    <Crosshair size={14} className="auxilio-icon" />
                    <span>Camion T-03</span>
                  </div>

                  <div className="auxilio-card-row3">
                    <span>Refugio R-0</span>
                    <span>10:00:00</span>
                    <span>hace 0 s</span>
                  </div>

                  <div className="auxilio-card-actions">
                    <button
                      className={`auxilio-action-btn ${auxilioHandled ? 'active' : ''}`}
                      onClick={() => setAuxilioHandled((v) => !v)}
                    >
                      {auxilioHandled ? 'Atendido' : 'Atender'}
                    </button>
                    <button
                      className={`auxilio-action-btn ${auxilioResolved ? 'active' : ''}`}
                      onClick={() => setAuxilioResolved((v) => !v)}
                    >
                      {auxilioResolved ? 'Resuelto' : 'Resolver'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : sidebarView?.type === 'escenario_condiciones' ? (
            /* SMF - V2: Condiciones del escenario */
            <div className="escenario-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => setSidebarView(null)}
                  title="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Inicio / </span>
                  <span className="crumb-name">Condiciones del escen...</span>
                </div>
                <button className="user-top-search-btn" onClick={() => setSearchOpen(true)}>
                  <Search size={18} />
                </button>
              </div>

              <h2 className="user-detail-title">Condiciones del escenario</h2>
              <div className="row between status-banner-row">
                <span className="field-label">Estatus</span>
                <span className="status-badge-unapplied">Sin aplicar</span>
              </div>

              {/* CIERRES */}
              <div className="esc-section-block">
                <div className="esc-block-title">CIERRES</div>
                <button className="dd-trigger full">
                  <Search size={16} />
                  <span style={{ flex: 1, textAlign: 'left' }}>Zonas cerradas</span>
                  <ChevronDown size={16} />
                </button>
                <small className="esc-hint">Cierra el paso en esta área. Los trabajadores deberán tomar un desvío o se quedarán sin salida</small>
                <div className="esc-tag-list">
                  {escenarioCierres.map((c, i) => (
                    <div key={i} className="esc-tag-item">
                      <span className="esc-tag-bar" />
                      <span className="esc-tag-text">{c}</span>
                      <button onClick={() => setEscenarioCierres((prev) => prev.filter((_, idx) => idx !== i))}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PUNTOS DE REUNIÓN */}
              <div className="esc-section-block">
                <div className="esc-block-title">PUNTOS DE REUNIÓN</div>
                {[
                  { key: 'n01', label: 'Punto de encuentro N01' },
                  { key: 'n04', label: 'Punto de encuentro N04' },
                  { key: 'n07', label: 'Punto de encuentro N07' },
                ].map(({ key, label }) => (
                  <div key={key} className="row between switch-row-esc" onClick={() => setEscenarioPuntos((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}>
                    <span>{label}</span>
                    <span className={`mui-switch ${escenarioPuntos[key as keyof typeof escenarioPuntos] ? 'checked' : ''}`}>
                      <span className="mui-switch-track" />
                      <span className="mui-switch-thumb" />
                    </span>
                  </div>
                ))}
                <button className="dd-trigger full" style={{ marginTop: 8 }}>
                  <Search size={16} />
                  <span style={{ flex: 1, textAlign: 'left' }}>Habilitar como refugio</span>
                  <ChevronDown size={16} />
                </button>
                <small className="esc-hint">Mover un refugio fuera de su área contará al personal en la zona vecina</small>
                <div className="esc-tag-list">
                  {escenarioRefugios.map((r, i) => (
                    <div key={i} className="esc-tag-item">
                      <span className="esc-tag-bar" />
                      <span className="esc-tag-text">{r}</span>
                      <button onClick={() => setEscenarioRefugios((prev) => prev.filter((_, idx) => idx !== i))}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TURNO */}
              <div className="esc-section-block">
                <div className="esc-block-title">TURNO</div>
                <button className="dd-trigger full">
                  <Search size={16} />
                  <span style={{ flex: 1, textAlign: 'left' }}>Fuera del turno</span>
                  <ChevronDown size={16} />
                </button>
                <div className="esc-tag-list" style={{ marginTop: 6 }}>
                  {escenarioFueraTurno.map((p, i) => (
                    <div key={i} className="esc-tag-item">
                      <span className="esc-tag-bar" />
                      <span className="esc-tag-text">{p}</span>
                      <button onClick={() => setEscenarioFueraTurno((prev) => prev.filter((_, idx) => idx !== i))}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DENSIDAD POR ÁREA */}
              <div className="esc-section-block">
                <div className="esc-block-title">DENSIDAD POR ÁREA</div>
                {Object.entries(escenarioDensidad).map(([area, val]) => (
                  <div key={area} className="row between density-row">
                    <span className="density-label">{area}</span>
                    <div className="density-stepper">
                      <button onClick={() => setEscenarioDensidad((p) => ({ ...p, [area]: Math.max(0, p[area] - 1) }))}>
                        <Minus size={14} />
                      </button>
                      <span className="density-val">{val}</span>
                      <button onClick={() => setEscenarioDensidad((p) => ({ ...p, [area]: p[area] + 1 }))}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DENSIDAD DE LA EVACUACIÓN */}
              <div className="esc-section-block">
                <div className="esc-block-title">DENSIDAD DE LA EVACUACIÓN</div>
                <div className="row between switch-row-esc" onClick={() => setEscenarioMinuto10((v) => !v)}>
                  <span>Declarar minuto 10</span>
                  <span className={`mui-switch ${escenarioMinuto10 ? 'checked' : ''}`}>
                    <span className="mui-switch-track" />
                    <span className="mui-switch-thumb" />
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={escenarioSlider}
                  onChange={(e) => setEscenarioSlider(+e.target.value)}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </div>

              {/* Action Buttons */}
              <div className="esc-actions-wrap">
                <button
                  className="esc-primary-btn"
                  onClick={() => setSidebarView({ type: 'escenario_comparacion' })}
                >
                  Aplicar y comparar
                </button>
                <div className="row gap-2" style={{ marginTop: 8 }}>
                  <button className="esc-secondary-btn flex-1" onClick={() => {}}>Limpiar</button>
                  <button className="esc-secondary-btn flex-1" onClick={() => setSidebarView(null)}>Descartar</button>
                </div>
              </div>
            </div>
          ) : sidebarView?.type === 'escenario_comparacion' ? (
            /* SMF - V2: Comparación */
            <div className="escenario-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => setSidebarView({ type: 'escenario_condiciones' })}
                  title="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Inicio / Condicio... / </span>
                  <span className="crumb-name">Compara...</span>
                </div>
                <button className="user-top-search-btn" onClick={() => setSearchOpen(true)}>
                  <Search size={18} />
                </button>
              </div>

              <h2 className="user-detail-title">Comparación</h2>
              <button className="esc-primary-btn" style={{ marginBottom: 8 }} onClick={() => {}}>
                Volver a medir
              </button>
              <button
                className="esc-secondary-btn full"
                style={{ marginBottom: 14 }}
                onClick={() => setSidebarView({ type: 'escenario_condiciones' })}
              >
                Editar condiciones
              </button>

              <div className="esc-block-title">INDICADORES CLAVE</div>
              <div className="comp-card-list">
                <div className="comp-card red-bar">
                  <b className="comp-card-title">Tiempo de despeje</b>
                  <div className="comp-grid-2">
                    <div><small>Base</small><p>No despejó</p></div>
                    <div><small>Escenario</small><p>No despejó</p></div>
                  </div>
                  <span className="comp-note">No comparable: alguna corrida no despejó</span>
                </div>

                <div className="comp-card green-bar">
                  <b className="comp-card-title">Personas sin contabilizar</b>
                  <div className="comp-grid-2">
                    <div><small>Base</small><p>35</p></div>
                    <div><small>Escenario</small><p>12</p></div>
                  </div>
                  <span className="comp-note green">23 personas menos</span>
                </div>

                <div className="comp-card green-bar">
                  <b className="comp-card-title">Equipo sin contabilizar</b>
                  <div className="comp-grid-2">
                    <div><small>Base</small><p>10</p></div>
                    <div><small>Escenario</small><p>6</p></div>
                  </div>
                  <span className="comp-note green">4 equipos menos</span>
                </div>

                <div className="comp-card green-bar">
                  <b className="comp-card-title">Reglas incumplidas</b>
                  <div className="comp-grid-2">
                    <div><small>Base</small><p>18</p></div>
                    <div><small>Escenario</small><p>14</p></div>
                  </div>
                  <span className="comp-note green">4 incumplimientos menos</span>
                </div>
              </div>

              <div className="esc-block-title" style={{ marginTop: 14 }}>CONGESTIÓN POR ZONA</div>
              <div className="comp-card-list">
                {[
                  { name: 'Punto de encuentro N04', max: '15 personas más' },
                  { name: 'Refugio R-02', max: '3 personas más' },
                  { name: 'Nivel 1 - Galeria norte', max: '2 personas más' },
                  { name: 'Rampa principal', max: '5 personas más' },
                ].map((item, idx) => (
                  <div key={idx} className="comp-congestion-card">
                    <b className="comp-card-title">{item.name}</b>
                    <div className="comp-grid-2">
                      <div><small>Ocupación Máxi...</small><p>{item.max}</p></div>
                      <div><small>Sobre Capacidad</small><p>Sin cambio</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : sidebarView?.type === 'zona_detail' ? (
            /* SMF - V2: Zona Detail */
            <div className="zona-detail-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => setSidebarView(null)}
                  title="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Inicio / </span>
                  <span className="crumb-name">{sidebarView.data.title}</span>
                </div>
                <button className="user-top-search-btn" onClick={() => setSearchOpen(true)}>
                  <Search size={18} />
                </button>
              </div>

              <h2 className="user-detail-title">{sidebarView.data.title} - {sidebarView.data.sub}</h2>
              <button className="user-action-btn" style={{ marginBottom: 12 }}>
                <Crosshair size={16} />
                <span>Centrar en el mapa</span>
              </button>

              <div className="user-info-list">
                <div className="user-info-row">
                  <span className="info-label">Tipo</span>
                  <span className="info-value bold">{sidebarView.data.status}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Nivel</span>
                  <span className="info-value bold">{sidebarView.data.nivel || 'N03'}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Extensión</span>
                  <span className="info-value bold">{sidebarView.data.ext || '51 tramos'}</span>
                </div>
                <div className="user-info-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div className="row between">
                    <span className="info-label">Aforo</span>
                    <span className="info-value bold">{sidebarView.data.ratio}</span>
                  </div>
                  <div className="aforo-bar-track">
                    <div className="aforo-bar-fill" style={{ width: '33%' }} />
                  </div>
                </div>
              </div>

              <div className="esc-block-title" style={{ marginTop: 10 }}>Alerta activa</div>
              <div className="zona-alert-box">
                <p>Camion T-03 no autorizado en Refugio R-01</p>
                <p>Scoop ST-02 no autorizado en Refugio R-01</p>
              </div>

              <div className="esc-block-title" style={{ marginTop: 12 }}>Permanencia</div>
              <div className="permanencia-chip-list">
                <button
                  className="permanencia-chip"
                  onClick={() => setSidebarView({
                    type: 'vehicle_detail',
                    data: { name: 'Camion T-03', type: 'Acarreo', zone: 'Refugio R-01', level: 'N02', precision: '± 1.0 m' }
                  })}
                >
                  Camion T-03
                </button>
                <button
                  className="permanencia-chip"
                  onClick={() => setSidebarView({
                    type: 'vehicle_detail',
                    data: { name: 'Scoop ST-02', type: 'Carga', zone: 'Refugio R-01', level: 'N02', precision: '± 1.2 m' }
                  })}
                >
                  Scoop ST-02
                </button>
              </div>

              <div className="row between hist-row" style={{ marginTop: 14 }}>
                <span className="info-label">Historial</span>
                <span className="info-value bold">Hace 15 minutos</span>
              </div>
            </div>
          ) : sidebarView?.type === 'vehicle_detail' ? (
            /* SMF - V2: Vehicle Detail */
            <div className="vehicle-detail-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn"
                  onClick={() => setSidebarView({ type: 'zona_detail', data: ZONAS_DATA[0] })}
                  title="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Inicio / Nivel 3 / </span>
                  <span className="crumb-name">{sidebarView.data.name}...</span>
                </div>
                <button className="user-top-search-btn" onClick={() => setSearchOpen(true)}>
                  <Search size={18} />
                </button>
              </div>

              <h2 className="user-detail-title">{sidebarView.data.name}</h2>
              <button className="user-action-btn" style={{ marginBottom: 12 }}>
                <Crosshair size={16} />
                <span>Centrar en el mapa</span>
              </button>

              <div className="user-info-list">
                <div className="user-info-row">
                  <span className="info-label">Camión</span>
                  <span className="info-value bold">{sidebarView.data.type}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Señal</span>
                  <span className="info-value">
                    <span className="user-signal-badge online">En línea</span>
                  </span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Última observación</span>
                  <span className="info-value bold">00:00:00</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Zona</span>
                  <span className="info-value bold">{sidebarView.data.zone}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Nivel</span>
                  <span className="info-value bold">{sidebarView.data.level}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Precisión del fix</span>
                  <span className="info-value bold">{sidebarView.data.precision}</span>
                </div>
                <div className="user-info-row">
                  <span className="info-label">Recorrido reciente</span>
                  <span className="info-value bold">5 min</span>
                </div>
              </div>

              {/* Petición de auxilio */}
              <div className="user-auxilio-section" style={{ position: 'relative' }}>
                <div className="auxilio-section-header">
                  <span className="auxilio-section-title">Petición de auxilio</span>
                  <button
                    className="auxilio-add-btn"
                    onClick={() => setAuxilioAddOpen((o) => !o)}
                    title="Agregar petición"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Popover: Registrar petición de auxilio */}
                {auxilioAddOpen && (
                  <div className="dd-menu auxilio-register-popover">
                    <div className="dd-group-title">Registrar petición de auxilio</div>
                    {['SOS', 'Coacción', 'Hombre caído'].map((item) => (
                      <button
                        key={item}
                        className="dd-item"
                        onClick={() => {
                          setVehicleAuxilios((prev) => prev.includes(item) ? prev : [item, ...prev])
                          setAuxilioAddOpen(false)
                        }}
                      >
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Filter Tabs: 3 sin resolver | 3 resueltas */}
                <div className="auxilio-tabs-row">
                  <button
                    className={`auxilio-tab-btn ${auxilioTab === 'sin_resolver' ? 'active' : ''}`}
                    onClick={() => setAuxilioTab('sin_resolver')}
                  >
                    3 sin resolver
                  </button>
                  <button
                    className={`auxilio-tab-btn ${auxilioTab === 'resueltas' ? 'active' : ''}`}
                    onClick={() => setAuxilioTab('resueltas')}
                  >
                    3 resueltas
                  </button>
                </div>

                {/* Multiple SOS cards */}
                <div className="vehicle-auxilios-stack">
                  {vehicleAuxilios.map((tipo) => (
                    <div key={tipo} className="auxilio-card">
                      <div className="auxilio-card-row1">
                        <span className="auxilio-type-title">{tipo}</span>
                        <div className="auxilio-status-group">
                          <span className="auxilio-status-unattended">{auxilioHandled ? 'Atendido' : 'Sin atender'}</span>
                          <span className="auxilio-status-critical">{auxilioResolved ? 'Resuelto' : 'Crítico'}</span>
                        </div>
                      </div>
                      <div className="auxilio-card-row2">
                        <Crosshair size={14} className="auxilio-icon" />
                        <span>Camion T-03</span>
                      </div>
                      <div className="auxilio-card-row3">
                        <span>Refugio R-0</span>
                        <span>10:00:00</span>
                        <span>hace 0 s</span>
                      </div>
                      <div className="auxilio-card-actions">
                        <button
                          className={`auxilio-action-btn ${auxilioHandled ? 'active' : ''}`}
                          onClick={() => setAuxilioHandled((v) => !v)}
                        >
                          {auxilioHandled ? 'Atendido' : 'Atender'}
                        </button>
                        <button
                          className={`auxilio-action-btn ${auxilioResolved ? 'active' : ''}`}
                          onClick={() => setAuxilioResolved((v) => !v)}
                        >
                          {auxilioResolved ? 'Resuelto' : 'Resolver'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedProj === '3D - Superficie' ? (
            /* Surface Sidebar section */
            <div className="surface-sidebar-panel">
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

              <div className="vis-block">
                <div className="section-head no-chevron" style={{ cursor: 'default' }}>
                  <span>Modo de visualización</span>
                </div>
                <div className="vis-controls">
                    <button
                      className={`dd-trigger full ${ddOpen === 'proj' ? 'active' : ''}`}
                      onClick={() => setDdOpen((d) => (d === 'proj' ? null : 'proj'))}
                    >
                      <span>{selectedProj}</span>
                      <ChevronDown size={16} />
                    </button>
                    {ddOpen === 'proj' && (
                      <div className="dd-menu">
                        <div className="dd-group-title">PROYECCIÓN</div>
                        {projections.map(({ id, label, icon: I }) => (
                          <button
                            key={id}
                            className={`dd-item ${selectedProj === id ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedProj(id)
                              const pr = projections.find((p) => p.id === id)
                              if (pr) setMode(pr.view)
                              setDdOpen(null)
                            }}
                          >
                            <I size={18} />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
              </div>

              <div className="section" style={{ marginTop: 12 }}>
                <div className="section-head">
                  <span>Superficie exterior</span>
                </div>
                <div className="surface-stat-grid">
                  <div className="surface-stat-box">
                    <small>Personal exterior</small>
                    <b>11 afuera</b>
                  </div>
                  <div className="surface-stat-box">
                    <small>Precisión GPS</small>
                    <b>±50 m</b>
                  </div>
                </div>

                <div className="esc-block-title" style={{ marginTop: 14 }}>Personal y vehículos en exterior</div>
                <div className="personal-list">
                  {[
                    { name: 'Juan García', role: 'Acarreo', area: 'Camión T-01' },
                    { name: 'Ricardo Flores', role: 'Supervisión', area: 'Camioneta C-04' },
                    { name: 'Carlos Martínez', role: 'Mecánico', area: 'Taller Exterior' },
                    { name: 'Alejandro Ruiz', role: 'Operador', area: 'Cargador L-02' },
                  ].map((p, idx) => (
                    <div key={idx} className="zona-row">
                      <span className="zona-bar" style={{ background: '#0284c7' }} />
                      <div className="zona-info">
                        <div className="zona-line1"><b>{p.name}</b></div>
                        <div className="zona-line2">{p.role} &nbsp; {p.area}</div>
                      </div>
                      <span className="user-signal-badge online" style={{ fontSize: 11 }}>En línea</span>
                    </div>
                  ))}
                </div>
              </div>
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
            <div className="section-head no-chevron" style={{ cursor: 'default' }}>
              <span>Modo de visualización</span>
            </div>

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
          </div>

          {/* 2. ESTADÍSTICAS DE RENDIMIENTO (SMF - V2 - 11) */}
          <Section
            title="Estadísticas de rendimiento"
            open={openSection === 'perf'}
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
            <div className="section-head tracking-header-no-chevron" onClick={() => toggle('track')}>
              <span>Tracking</span>
              <div className="section-head-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="plus-trigger"
                  aria-label="Agregar tracking"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDdOpen((d) => (d === 'addTrack' ? null : 'addTrack'))
                  }}
                  title="Agregar tracking"
                >
                  <CirclePlus size={17} />
                </button>
              </div>
            </div>

            {/* SMF - V2 - 6 Popover: AGREGAR TRACKING */}
            {ddOpen === 'addTrack' && (
              <div className="dd-menu track-add-menu">
                <div className="dd-group-title">AGREGAR TRACKING</div>
                {TRACKING_CATALOG
                  .filter(({ id }) => !activeTrackings.includes(id))
                  .map(({ id, menuLabel, color, icon: I }) => (
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
            {openSection === 'track' && activeTrackings.length > 0 && (
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
                          onClick={() => toggleTrackItem(id)}
                        >
                          <Icon size={18} style={{ color: cfg.color }} />
                          <span>{id === 'evacuacion' && isExp ? 'Terminar evaluación' : cfg.label}</span>
                        </button>
                        <div className="track-row-actions">
                          <button title="Quitar" onClick={() => removeTrackingItem(id)}>
                            <CircleMinus size={18} />
                          </button>
                          {id !== 'evacuacion' && id !== 'escenario' && (
                            <button
                              title={isExp ? 'Contraer' : 'Expandir'}
                              onClick={() => toggleTrackItem(id)}
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
                            <div
                              key={idx}
                              className="zona-row personal-clickable-row"
                              onClick={() => setSidebarView({ type: 'zona_detail', data: z })}
                              style={{ cursor: 'pointer' }}
                              title="Ver detalle de zona"
                            >
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
                                <span>Inicio</span>
                                <Calendar size={16} />
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
                                <span>Fin</span>
                                <Calendar size={16} />
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

                            {/* SMF - V2 - 8 Popover: Multi-select checklist matching Figma */}
                            {ddOpen === 'personalSearch' && (
                              <div className="dd-menu personal-checklist-menu">
                                <div className="checklist-head">
                                  <span>{selectedCount}/{PERSONAL_CHECKLIST.length} SELECCIONADO</span>
                                  <button onClick={() => setCheckedPeople({})}>QUITAR TODOS</button>
                                </div>
                                <div className="checklist-scroll">
                                  {PERSONAL_CHECKLIST.map((p) => {
                                    const checked = !!checkedPeople[p.id]
                                    return (
                                      <button
                                        key={p.id}
                                        className="checklist-item"
                                        onClick={() => {
                                          setCheckedPeople((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                                        }}
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

                      {/* Sub-panel for Escenario alterno */}
                      {id === 'escenario' && (
                        <div className="track-subpanel">
                          <div
                            className="zona-row personal-clickable-row"
                            onClick={() => setSidebarView({ type: 'escenario_condiciones' })}
                            style={{ cursor: 'pointer' }}
                            title="Abrir condiciones del escenario"
                          >
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

                {activeTrackings.length > 0 && (
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

          {/* 4. SIMULACIONES */}
          <div
            className="section sim-section"
            {...showHelp('Simulaciones', 'Ejecución de modelos predictivos y escenarios.')}
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
                  aria-label={openSection === 'sim' ? 'Ocultar Simulaciones' : 'Mostrar Simulaciones'}
                >
                  {openSection === 'sim' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Popover: AGREGAR SIMULACIÓN */}
            {ddOpen === 'addSim' && (
              <div className="dd-menu sim-add-menu">
                {(['VENTILACIÓN', 'ENERGÍA', 'COMUNICACIONES', 'SEGURIDAD', 'PERSONAL'] as const).map((cat) => {
                  const items = SIMULATION_CATALOG.filter((s) => s.category === cat)
                  return (
                    <div key={cat} className="sim-group-block">
                      <div className="sim-category-title">{cat}</div>
                      {items.map((sim) => {
                        const Icon = sim.icon
                        return (
                          <button
                            key={sim.id}
                            className="sim-cat-item"
                            onClick={() => addSimulationItem(sim.id)}
                          >
                            <Icon size={16} style={{ color: sim.color }} />
                            <span>{sim.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Active Simulations List */}
            {openSection === 'sim' && activeSimulations.length > 0 && (
              <div className="section-body sim-body">
                {activeSimulations.map((id) => {
                  const sim = SIMULATION_CATALOG.find((s) => s.id === id)
                  if (!sim) return null
                  const Icon = sim.icon
                  return (
                    <div key={id} className="sim-row-item">
                      <div className="sim-row-left">
                        <Icon size={18} style={{ color: sim.color }} />
                        <span>{sim.label}</span>
                      </div>
                      <button
                        className="sim-remove-btn"
                        title="Quitar simulación"
                        onClick={() => removeSimulationItem(id)}
                      >
                        <CircleMinus size={18} />
                      </button>
                    </div>
                  )
                })}

                <div className="perf-divider" />
                <button className="clear-track-btn" onClick={() => setActiveSimulations([])}>
                  <Trash size={17} />
                  <span>Limpiar lista de simulación</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. ANÁLISIS: What-If Simulation Engine matching SmartFlow 5.0 spec */}
          <Section
            title="Análisis"
            open={openSection === 'ana'}
            onToggle={() => toggle('ana')}
            onHover={showHelp('Análisis What-If', 'Simulador predictivo ¿Qué pasa si...?: modela fallas de subestaciones, paradas de ventilación y dilución ambiental.')}
          >
            <div className="whatif-config-box">
              <div className="esc-block-title">SIMULACIÓN WHAT-IF (¿QUÉ PASA SI...?)</div>
              
              <label className="field-label">Componente o nodo a alterar</label>
              <select
                className="field full"
                value={whatIfTarget}
                onChange={(e) => setWhatIfTarget(e.target.value)}
              >
                <option value="CD-MT-01">CD-MT-01 (Subestación Principal MT)</option>
                <option value="V-PH-01">V-PH-01 (Ventilador Principal L1)</option>
                <option value="CD-MT-T-01">CD-MT-T-01 (Transformador de Potencia)</option>
                <option value="SM-01">SM-01 (Subestación Móvil L2)</option>
                <option value="V-PV-01">V-PV-01 (Ventilador Primario)</option>
              </select>

              <label className="field-label" style={{ marginTop: 8 }}>Tipo de evento simulado</label>
              <select
                className="field full"
                value={whatIfAction}
                onChange={(e) => setWhatIfAction(e.target.value)}
              >
                <option value="desconexion">Desconexión / Corte de kVA radial</option>
                <option value="ventilador">Parada no programada de ventilador</option>
                <option value="galeria">Cierre de galería / Falla de compuerta</option>
              </select>

              <label className="field-label" style={{ marginTop: 8 }}>Ejes de simulación activos</label>
              <div className="whatif-axes-toggle-row">
                <button
                  className={`whatif-axis-pill ${whatIfAxes.carga ? 'active' : ''}`}
                  onClick={() => setWhatIfAxes((a) => ({ ...a, carga: !a.carga }))}
                >
                  Flujo de carga radial
                </button>
                <button
                  className={`whatif-axis-pill ${whatIfAxes.vent ? 'active' : ''}`}
                  onClick={() => setWhatIfAxes((a) => ({ ...a, vent: !a.vent }))}
                >
                  Red de ventilación
                </button>
                <button
                  className={`whatif-axis-pill ${whatIfAxes.dilucion ? 'active' : ''}`}
                  onClick={() => setWhatIfAxes((a) => ({ ...a, dilucion: !a.dilucion }))}
                >
                  Dilución por zona
                </button>
              </div>

              <div className="row between" style={{ marginTop: 12, fontSize: 13 }}>
                <span className="field-label">Horizonte de tiempo</span>
                <b className="mono">{whatIfHorizon} min</b>
              </div>
              <input
                type="range"
                min={15}
                max={120}
                step={15}
                value={whatIfHorizon}
                onChange={(e) => setWhatIfHorizon(+e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />

              <button
                className="cta whatif-submit-btn"
                style={{ marginTop: 14 }}
                onClick={() => setSidebarView({ type: 'whatif_result' })}
              >
                Simular escenario
              </button>
            </div>
          </Section>

          <Section
            title="Seguimiento"
            open={openSection === 'seg'}
            onToggle={() => toggle('seg')}
            onHover={showHelp('Demo de seguimiento', 'Ejercicios o modos demostrativos para pruebas de tracking y seguimiento operativo.')}
          />

          {/* 7. INTERIORES (SMF - V2 exact match) */}
          <Section
            title="Interiores"
            open={openSection === 'interiores'}
            onToggle={() => toggle('interiores')}
            onHover={showHelp('Interiores', 'Acceso y estado operativo en tiempo real de los recintos e infraestructura interior de la mina.')}
          >
            <div className="interiores-list">
              {INTERIORES_DATA.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.id}
                    className="interior-item-row"
                    onClick={() => setSidebarView({ type: 'interior', data: item })}
                    title={`Ver detalle de ${item.title}`}
                  >
                    <div className="interior-item-left">
                      <Icon size={18} style={{ color: item.iconColor }} />
                      <span className="interior-item-title">{item.subTitle}</span>
                    </div>
                    <ChevronRight size={16} className="row-chevron" />
                  </div>
                )
              })}

              <div className="interiores-group-title">POR EQUIPO</div>

              <div className="interior-item-row disabled" title="Selecciona una subestación en el visor para entrar">
                <div className="interior-item-left">
                  <Zap size={18} style={{ color: '#94a3b8' }} />
                  <span className="interior-item-title" style={{ color: '#94a3b8' }}>Sala de subestación</span>
                </div>
              </div>
            </div>
          </Section>
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
              <button
                type="submit"
                className={`nexo-send-btn ${!nexoPrompt.trim() ? 'disabled' : ''}`}
                disabled={!nexoPrompt.trim()}
                title="Enviar a Nexo IA"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </form>
        </aside>
      )}

      <ul
        className="glass levels"
        {...showHelp('Niveles', 'Acceso a las capas estructurales, niveles (L1 General a L5 Interior), rampas, cotas y parámetros técnicos del diseño de la mina.')}
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
                (['Vista', 'Tracking', 'Simulaciones', 'Análisis', 'Interiores'] as const).map((cat) => {
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

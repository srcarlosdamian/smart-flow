import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search, Bell, Globe, Sun, Moon, Wrench, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  CirclePlus, CircleMinus, CircleAlert,
  ZoomIn, ZoomOut, SquareArrowUp, Box, SquareArrowRight, SquareMousePointer,
  Scan, Ruler, Diamond, Cable, Lightbulb, Undo2, Redo2,
  Fullscreen, UserRoundSearch, Layers2, CircleGauge, Waypoints, AudioWaveform, Siren, Trash,
  Maximize2,
  Wind, Flame, Zap, Wifi, MapPin, Activity, Users, Minus,
  Grid3x3, Workflow, Check, ArrowLeft, ArrowUp, Plus, PanelRightClose, LandPlot, Settings,
  EllipsisVertical, Ellipsis, TextAlignStart, Pin, SquareArrowOutUpRight,
  RotateCcw, FlaskConical, History, ShieldCheck,
  Droplets, Mountain, ArrowUpDown, CornerDownLeft,
  Play, Pause, ChevronsLeft, ChevronsRight, RotateCw, Bookmark, Repeat, Crosshair, Calendar,
  X, Target, Upload, Download, Camera, Palette,
} from 'lucide-react'
import Scene3D, { type ViewMode, type Theme } from './Scene3D'
import DiagramView from './DiagramView'
import SurfaceView from './SurfaceView'
import InteriorBombeoView, { type WorkerData } from './InteriorBombeoView'
import { SIM_ENTITIES } from './simulations3D'
import DesignSystemView from './DesignSystemView'
import logoUrl from './assets/smartflow-logo.png'
import './App.css'

export function BitLogo({ width = 16, height = 18, size, color = '#ffffff' }: { width?: number; height?: number; size?: number; color?: string }) {
  const iconSize = size ?? Math.max(width, height)
  return (
    <Diamond
      size={iconSize}
      color={color}
      strokeWidth={2.4}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  )
}
export const NexoLogo = BitLogo

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
  { id: 'Frontal', label: 'Frontal', view: 'front', icon: SquareMousePointer },
  { id: 'Derecha', label: 'Derecha', view: 'right', icon: SquareArrowRight },
  { id: 'Isométrica', label: 'Isométrica', view: 'isometric', icon: Box },
  { id: 'Ajustar todo', label: 'Ajustar todo', view: 'perspective', icon: Fullscreen, reset: true },
]

const zoomPresets: { val: number; label: string }[] = [
  { val: 25, label: '25 %' },
  { val: 50, label: '50 %' },
  { val: 75, label: '75 %' },
  { val: 100, label: '100 %' },
  { val: 150, label: '150 %' },
  { val: 200, label: '200 %' },
]

type TrackingType = 'personal' | 'zonas' | 'perimetros' | 'recorrido' | 'escenario' | 'evacuacion'

interface NexoChatMessage {
  role: 'user' | 'assistant'
  text: string
  isScenarioResult?: boolean
}

const DRILL_WINDOW_OPTIONS = [
  'Mantener plan actual',
  'Fuera de horas punta',
  'Noche 22:00–06:00',
  'Tarifa base 00:00–06:00',
  'Ventana personalizada',
]

const TARIFF_SEASON_OPTIONS = [
  'Nov–Mar · punta 18–22 h',
  'Abr–Oct · punta 20–22 h',
]

const PUMPS_SIDEBAR = [
  { id: 'B-01', name: 'B-01', flow: '75 L/s · 12.4 bar', hours: '3120 h de servicio', status: 'marcha', statusText: 'En marcha', temp: '62°C', barPercent: 75 },
  { id: 'B-02', name: 'B-02', flow: '75 L/s · 11.9 bar', hours: '2870 h de servicio', status: 'marcha', statusText: 'En marcha', temp: '59°C', barPercent: 75 },
  { id: 'B-03', name: 'B-03', flow: '0 L/s · 0.0 bar', hours: '1490 h de servicio', status: 'reserva', statusText: 'En reserva', temp: '24°C', barPercent: 0 },
  { id: 'B-04', name: 'B-04', flow: '0 L/s · 0.0 bar', hours: '4650 h de servicio', status: 'falla', statusText: 'En falla', temp: '81°C', barPercent: 100 },
]

const TRACKING_CATALOG: { id: TrackingType; label: string; menuLabel: string; color: string; icon: typeof UserRoundSearch }[] = [
  { id: 'personal', label: 'Personal y vehículos', menuLabel: 'Personal y vehículos', color: '#2196f3', icon: UserRoundSearch },
  { id: 'zonas', label: 'Zonas y áreas', menuLabel: 'Zonas y áreas', color: '#ff9800', icon: Layers2 },
  { id: 'perimetros', label: 'Perímetros', menuLabel: 'Perímetros', color: '#f44336', icon: CircleGauge },
  { id: 'recorrido', label: 'Recorrido', menuLabel: 'Recorrido', color: '#7c4dff', icon: Waypoints },
  { id: 'escenario', label: 'Escenario alterno', menuLabel: 'Escenario alterno', color: '#00bfa5', icon: AudioWaveform },
  { id: 'evacuacion', label: 'Iniciar evacuación', menuLabel: 'Iniciar evacuación', color: '#ff5252', icon: Siren },
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
    title: 'Refugio R1',
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
    title: 'Sala de Bombeo SB1',
    subTitle: 'Sala de bombeo',
    category: 'General',
    icon: Droplets,
    iconColor: '#00b0ff',
    locationLabel: 'Sala de bombeo',
    level: 'L5',
    metrics: [
      { label: 'Nivel del sumidero', value: 'Sumidero 64%', valueColor: '#0284c7', bar: { current: 64, max: 100 } },
      { label: 'Bombas en marcha', value: '2 de 4' },
      { label: 'Caudal total', value: '150 L/s' },
      { label: 'En falla', value: '1', valueColor: '#ef4444' },
      { label: 'En reserva', value: '1' },
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

export const WHAT_IF_TARGETS = [
  { id: 'CD-MT-01', label: 'CD-MT-01 (Subestación Principal MT)' },
  { id: 'V-PH-01', label: 'V-PH-01 (Ventilador Principal L1)' },
  { id: 'CD-MT-T-01', label: 'CD-MT-T-01 (Transformador de Potencia)' },
  { id: 'SM-01', label: 'SM-01 (Subestación Móvil L2)' },
  { id: 'V-PV-01', label: 'V-PV-01 (Ventilador Primario)' },
]

export const WHAT_IF_ACTIONS = [
  { id: 'desconexion', label: 'Desconexión / Corte de kVA radial' },
  { id: 'ventilador', label: 'Parada no programada de ventilador' },
  { id: 'galeria', label: 'Cierre de galería / Falla de compuerta' },
]

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
  | { type: 'evacuacion_alertas' }

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
  const [surfaceMode, setSurfaceMode] = useState<'satelite' | 'mapa' | 'relieve'>('satelite')
  const [surfaceShowRelief, setSurfaceShowRelief] = useState(true)
  const [surfaceAction, setSurfaceAction] = useState<{ type: string; id: number } | null>(null)
  const [zoom, setZoom] = useState(100)
  const [ddOpen, setDdOpen] = useState<string | null>(null)
  const [nexoOpen, setNexoOpen] = useState(false)
  const [nexoMoreOpen, setNexoMoreOpen] = useState(false)
  const [nexoMoreView, setNexoMoreView] = useState<'main' | 'more'>('main')
  const [nexoEnabled, setNexoEnabled] = useState(true)
  const [nexoAutoAlerts, setNexoAutoAlerts] = useState(true)
  const [nexoPrompt, setNexoPrompt] = useState('')
  const [nexoMessages, setNexoMessages] = useState<NexoChatMessage[]>([])
  
  // Bit IA Scenario Inputs (CFE + Plan de Turnos)
  const [drillWindow, setDrillWindow] = useState('Fuera de horas punta')
  const [tariffSeason, setTariffSeason] = useState('Abr–Oct · punta 20–22 h')
  const [haulagePeak, setHaulagePeak] = useState(40)
  const [recoverOffPeak, setRecoverOffPeak] = useState(true)
  const [noBlastingPeak, setNoBlastingPeak] = useState(true)
  const [vodMargin, setVodMargin] = useState(10)
  const [fleetDetailsOpen, setFleetDetailsOpen] = useState(false)
  const [scenarioJsonCopied, setScenarioJsonCopied] = useState(false)

  const handleRunScenarioWithBit = () => {
    setNexoOpen(true)
    setSidebarView({ type: 'whatif_result' })
    const promptText = `Ejecutar con: ${drillWindow} · ${tariffSeason.includes('Abr') ? 'tarifa de verano' : 'tarifa de invierno'} · acarreo en punta ${haulagePeak} %, ${recoverOffPeak ? 'recuperar en valle' : ''} · ${noBlastingPeak ? 'sin voladura en punta' : ''} · margen ${vodMargin} %`

    setNexoMessages((prev) => [
      ...prev,
      { role: 'user', text: promptText },
      {
        role: 'assistant',
        text: 'Bit calculó la red de ventilación y los costos de demanda CFE.',
        isScenarioResult: true,
      },
    ])
  }

  const handleCopyScenarioJson = () => {
    const payload = {
      scenario: 'heavy_drilling_outside_peak_hours',
      drilling_window: drillWindow,
      tariff_season: tariffSeason,
      haulage_at_peak_pct: haulagePeak,
      recover_tonnes_off_peak: recoverOffPeak,
      no_blasting_clearance_during_peak: noBlastingPeak,
      vod_safety_margin_pct: vodMargin,
      fleet: {
        jumbos: 4,
        jumbo_model: 'Sandvik DD422i',
        trucks: 6,
        truck_model: 'TH551i',
        scoops: 3,
        scoop_model: 'LH517i',
      },
      cfe_contract: {
        tariff_type: 'GDMTH Media Tensión Horaria',
        peak_demand_charge_mxn_kw: 312.4,
      },
    }
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setScenarioJsonCopied(true)
    setTimeout(() => setScenarioJsonCopied(false), 2400)
  }
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [interiorView, setInteriorView] = useState<string | null>(null)

  const navigateToInterior = (roomId: string) => {
    setInteriorView(roomId)
    window.location.hash = `#/interior/${roomId}`
  }

  const exitInterior = () => {
    setInteriorView(null)
    setSelectedWorker(null)
    setSidebarView(null)
    setSelected3DObjectId(null)
    if (window.location.hash.startsWith('#/interior')) {
      window.history.pushState(null, '', window.location.pathname)
    }
  }

  const handleBackFromInterior = () => {
    exitInterior()
  }

  const [currentRoute, setCurrentRoute] = useState<'app' | 'design-system'>(() => {
    if (typeof window === 'undefined') return 'app'
    const hash = window.location.hash || ''
    const path = window.location.pathname || ''
    return hash === '#/design-system' || path.endsWith('/design-system') ? 'design-system' : 'app'
  })

  // Hash routing for rooms/interiors & design system
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || ''
      const path = window.location.pathname || ''
      if (hash === '#/design-system' || path.endsWith('/design-system')) {
        setCurrentRoute('design-system')
        return
      }
      setCurrentRoute('app')

      const match = hash.match(/^#\/interior\/([a-zA-Z0-9_-]+)/)
      if (match && match[1]) {
        const roomId = match[1]
        setInteriorView(roomId)
        const found = INTERIORES_DATA.find((item) => item.id === roomId)
        if (found) {
          setSidebarView({ type: 'interior', data: found })
        }
      } else if (!hash || hash === '#' || hash === '#/') {
        setInteriorView(null)
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    window.addEventListener('popstate', handleHash)
    return () => {
      window.removeEventListener('hashchange', handleHash)
      window.removeEventListener('popstate', handleHash)
    }
  }, [])
  const [selectedPump, setSelectedPump] = useState<string>('BA-01')
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null)
  const [whatIfTarget] = useState('V-PH-01')
  const [whatIfHorizon] = useState(60)
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
  const [selected3DObjectId, setSelected3DObjectId] = useState<string | null>(null)
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

  const [whatIfPlaying, setWhatIfPlaying] = useState(false)
  const [whatIfTime, setWhatIfTime] = useState(900)

  useEffect(() => {
    let t: any = null
    if (whatIfPlaying) {
      t = setInterval(() => {
        setWhatIfTime((prev) => (prev >= 1800 ? 0 : prev + 1))
      }, 1000)
    }
    return () => clearInterval(t)
  }, [whatIfPlaying])

  // Evacuacion state
  const [evacuacionActiva, setEvacuacionActiva] = useState(false)

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
  const [escenarioSlider, setEscenarioSlider] = useState(30)

  // Vehicle auxilio state
  const [auxilioTab, setAuxilioTab] = useState<'sin_resolver' | 'resueltas'>('sin_resolver')
  const [auxilioAddOpen, setAuxilioAddOpen] = useState(false)
  const [vehicleAuxilios, setVehicleAuxilios] = useState<string[]>(['Hombre caído', 'Coacción', 'SOS'])

  // Recorrido Player & Detail state (SMF - V2 - 7, 8, 9)
  const [playerPlaying, setPlayerPlaying] = useState(false)
  const [playerSeconds, setPlayerSeconds] = useState(1800)
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
      const target = e.target as HTMLElement | null
      if (!target) return

      // Close dropdowns if clicking outside any open dropdown or dropdown trigger button
      const isInsideDropdown =
        target.closest('.dd-menu') ||
        target.closest('.dd-trigger') ||
        target.closest('.section-action-btn') ||
        target.closest('.nexo-settings-btn') ||
        target.closest('.time-picker-menu')

      if (!isInsideDropdown) {
        setDdOpen(null)
      }

      if (nexoMoreRef.current && !nexoMoreRef.current.contains(target)) {
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
    setActiveTrackings((prev) => {
      const next = prev.filter((item) => item !== id)
      if (next.length === 0) {
        setOpenSection((cur) => (cur === 'track' ? null : cur))
      }
      return next
    })
  }

  const toggleSimulationItem = (id: string) => {
    setActiveSimulations((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id)
        if (next.length === 0) {
          setOpenSection((cur) => (cur === 'sim' ? null : cur))
        }
        return next
      } else {
        setOpenSection('sim')
        return [...prev, id]
      }
    })
  }

  const removeSimulationItem = (id: string) => {
    setActiveSimulations((prev) => {
      const next = prev.filter((item) => item !== id)
      if (next.length === 0) {
        setOpenSection((cur) => (cur === 'sim' ? null : cur))
      }
      return next
    })
  }

  const sendNexoMessage = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    const lower = clean.toLowerCase()

    let reply = ''
    if (lower.includes('ba-04') || (lower.includes('bomba') && (lower.includes('falla') || lower.includes('alarma') || lower.includes('sobretemperatura')))) {
      reply = 'Diagnóstico Bit IA para Bomba BA-04:\n• Estado: Disparo térmico por sobretemperatura (81 °C) y presión nula (0.0 bar).\n• Horas acumuladas: 4,650 h de servicio continuo (próxima a ciclo mayor).\n• Causa probable: Restricción en el caudal de refrigeración del sello mecánico y desgaste del rodamiento de empuje.\n• Recomendación inmediata: Conmutar el arranque de la bomba BA-03 (reserva fría) para estabilizar el caudal en 152 L/s y evitar el rebose del sumidero L5 (64%), mientras la brigada aísla y desarma BA-04.'
    } else if (lower.includes('ba-03') || (lower.includes('bomba') && lower.includes('reserva'))) {
      reply = 'Telemetría Bit IA - Bomba BA-03:\n• Estado: En reserva (Standby operativo listo).\n• Temperatura: 24 °C (ambiente nominal).\n• Horas de servicio: 1,490 h.\n• Presión proyectada: 12.0 bar a 75 L/s.\n• Bit puede autorizar la secuencia de cebado y arranque automático si se aprueba la maniobra de relevo.'
    } else if (lower.includes('ba-01') || lower.includes('ba-02')) {
      const pName = lower.includes('01') ? 'BA-01' : 'BA-02'
      const flow = lower.includes('01') ? '78 L/s' : '74 L/s'
      const temp = lower.includes('01') ? '62 °C' : '59 °C'
      reply = `Telemetría Bit IA - Bomba ${pName}:\n• Estado: En marcha continua y estable.\n• Caudal aportado: ${flow} a 12 bar de presión.\n• Temperatura de operación: ${temp} (dentro de rango seguro < 70 °C).\n• Eficiencia hidráulica estimada: 92.4%. No requiere intervención inmediata.`
    } else if (lower.includes('sumidero') || lower.includes('desborde') || lower.includes('nivel')) {
      reply = 'Monitoreo de Sumidero L5 (Bit IA):\n• Nivel actual: 64% (~180 m³).\n• Caudal de afluente: 148 L/s promedio.\n• Caudal de extracción activo: 152 L/s (BA-01 + BA-02).\n• Margen neto: +4 L/s de descenso gradual.\n• Tiempo crítico hasta cota de alarma en caso de parada: 42 minutos. Con BA-01 y BA-02 activas el sistema se mantiene en equilibrio seguro.'
    } else if (lower.includes('sala de bombeo') || lower.includes('sb-01') || lower.includes('bombeo')) {
      reply = 'Informe Integral Bit IA - Sala de Bombeo SB-01 (Nivel 5):\n• Equipos: 2 en marcha (BA-01, BA-02), 1 en reserva (BA-03), 1 en falla (BA-04).\n• Caudal total evacuado: 152 L/s hacia piscina de superficie.\n• Nivel del sumidero: 64% (estable).\n• Estado de tuberías: Presión en colector principal 12.2 bar sin vibraciones anómalas.\n• Acción sugerida: Arrancar BA-03 para aislar BA-04 y realizar mantenimiento preventivo.'
    } else if (lower.includes('refugio') || lower.includes('r-01') || lower.includes('oxígeno')) {
      reply = 'Diagnóstico Bit IA - Refugio R-01 (Nivel 5):\n• Ocupación actual: 1 / 12 personas.\n• Autonomía de O₂: 69 horas calculadas según recambio químico y bancos de cilindros.\n• Comunicaciones: Enlace activo por fibra óptica y backup LoRaWAN verificado hace 12 min.\n• Monitoreo de gases interno: CO₂ 350 ppm, O₂ 20.9%, CO 0 ppm.'
    } else if (lower.includes('taller') || lower.includes('tm-01')) {
      reply = 'Estado Operativo Bit IA - Taller Mecánico TM-01 (Nivel 2):\n• Bahías ocupadas: 2 / 2 (LHD-02 en cambio de mangueras hidráulicas y Jumbo J-01 en revisión de martillo).\n• Cuadrilla técnica: 4 técnicos activos.\n• Horas de mantención pendientes: 29 h.\n• Ventilación en taller: 108% sobre norma.'
    } else if (lower.includes('escenario') || lower.includes('outside peak') || lower.includes('horas punta') || lower.includes('perforación') || lower.includes('tarifa')) {
      setSidebarView({ type: 'whatif_result' })
      setNexoMessages((prev) => [
        ...prev,
        { role: 'user', text: clean },
        {
          role: 'assistant',
          text: 'Bit calculó la red de ventilación y los costos de demanda CFE.',
          isScenarioResult: true,
        },
      ])
      setNexoPrompt('')
      return
    } else {
      const replyMap: Record<string, string> = {
        'Ponme al día con el turno': 'El turno actual opera con normalidad. Hay 28 trabajadores activos en interior mina, 2 alertas preventivas en Nivel 3 (Chancador) y Nivel 5 (Sala de bombeo), y los refugios R-01 y R-04 se encuentran operativos.',
        '¿Cómo está la ventilación?': 'Bit calculó la red de ventilación (10 sensores en línea): La mina tiene 14 % más flujo de aire del requerido. El punto más ajustado es el Nivel 3 al 106 % de su mínimo. Si se detuviera V-PH-01 bajaría del mínimo en unos 25 minutos.',
        '¿Por qué se degrada el rodamiento de V-SA-01?': 'Bit leyó 10 sensores, revisó 2 años de historial y comparó 42 ventiladores similares:\n• Alerta crítica (91% confianza): Falla probable en 17 días por desgaste de rodamiento SKF 6310. Vibración al alza (+12%/sem) a 3.68 mm/s y 52 °C.\n• Consecuencia si no se actúa: Parada no planificada de ~14 h, evacuación de 38 personas, costo estimado US$48,000 vs US$3,200 planificado.',
        '¿Cuándo es el mejor momento para detenerlo?': 'Revisado el plan de producción, cuadrillas y almacén: se recomienda ventana de mantenimiento este Jueves 14:00–16:00 (menor demanda de ventilación en N3) y reservar 2 × SKF 6310 en almacén central.',
        '¿Qué pasa si no hacemos nada?': 'Proyección a 14 días (Health score 78% → 61%): Parada intempestiva del ventilador, pérdida de caudal normativo en Nivel 3 en 25 min y paro forzado de equipos de acarreo.',
        '¿Dónde está la gente en este momento?': 'Actualmente hay 14 personas en Galería Norte (L1), 8 en Taller Mecánico (L2), 4 en Rampa Principal y 2 en Sala de Bombeo (L5).',
        '¿Cómo mitigar la falla de BA-04 en Sala de bombeo SB-01?': 'Recomendación Bit: Arrancar la bomba BA-03 (actualmente en reserva) para estabilizar el caudal en 152 L/s y evitar el rebose del sumidero (64%), mientras la cuadrilla aísla BA-04.',
      }
      reply = replyMap[clean] || `Analizando "${clean}" en tiempo real sobre los sensores y telemetría activa de SmartFlow... Todos los indicadores del sector ${level} están sincronizados.`
    }

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
    { id: 'track-evac', title: 'Iniciar evacuación', category: 'Tracking', sub: 'Emergencia', icon: Siren, iconColor: '#ff5252' },

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

  const currentNexoSuggestions = useMemo(() => {
    if (interiorView === 'bombeo' || (sidebarView?.type === 'interior' && sidebarView.data.id === 'bombeo')) {
      return [
        '¿Por qué está en falla la bomba BA-04?',
        '¿Cómo mitigar la falla de BA-04 en Sala de bombeo SB-01?',
        'Monitoreo de Sumidero L5 y caudal',
      ]
    }
    if (interiorView === 'refugio' || (sidebarView?.type === 'interior' && sidebarView.data.id === 'refugio')) {
      return [
        '¿Cuál es la autonomía de oxígeno en Refugio R-01?',
        '¿Cómo está el enlace de comunicación en el refugio?',
        'Diagnóstico general de Refugio R-01',
      ]
    }
    if (interiorView === 'taller' || (sidebarView?.type === 'interior' && sidebarView.data.id === 'taller')) {
      return [
        '¿Cuáles son las órdenes activas en Taller TM-01?',
        'Personal y técnicos en Taller Mecánico',
        'Estado de ventilación en Taller TM-01',
      ]
    }
    if (interiorView === 'chancador' || (sidebarView?.type === 'interior' && sidebarView.data.id === 'chancador')) {
      return [
        '¿Cómo está la vibración en Chancador CH-01?',
        'Estado del motor de chancado primario',
        'Capacidad de tolva de alimentación',
      ]
    }
    return NEXO_SUGGESTIONS
  }, [interiorView, sidebarView])

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

  const handleNavigateFromDesignSystem = (target: string) => {
    window.location.hash = ''
    setCurrentRoute('app')
    setInteriorView(null)
    setNexoOpen(false)
    setDdOpen(null)

    setTimeout(() => {
      switch (target) {
        case 'auxilio':
        case 'peticion-auxilio':
        case 'sos': {
          const juan = SIM_ENTITIES.find((w) => w.name.includes('Juan')) || SIM_ENTITIES[0]
          setSelectedWorker({
            id: juan.id,
            name: juan.name,
            tag: juan.tag,
            role: juan.role,
            turno: juan.turno,
            ingreso: juan.ingreso,
            zona: juan.zona,
            velocidad: juan.velocidad,
            bateria: juan.bateria,
            ultimoPunto: juan.ultimoPunto,
            pos: [0, 0, 0],
            rotY: 0,
          })
          break
        }

        case 'worker-telemetria':
        case 'personal': {
          const w0 = SIM_ENTITIES[0]
          setSelectedWorker({
            id: w0.id,
            name: w0.name,
            tag: w0.tag,
            role: w0.role,
            turno: w0.turno,
            ingreso: w0.ingreso,
            zona: w0.zona,
            velocidad: w0.velocidad,
            bateria: w0.bateria,
            ultimoPunto: w0.ultimoPunto,
            pos: [0, 0, 0],
            rotY: 0,
          })
          break
        }

        case 'sala-bombeo':
        case 'interior-bombeo':
          navigateToInterior('bombeo')
          break

        case 'sala-bombeo-card': {
          const found = INTERIORES_DATA.find((it) => it.id === 'bombeo')
          if (found) setSidebarView({ type: 'interior', data: found })
          break
        }

        case 'refugio':
          navigateToInterior('refugio')
          break

        case 'taller':
          navigateToInterior('taller')
          break

        case 'chancador': {
          const found = INTERIORES_DATA.find((it) => it.id === 'chancador')
          if (found) setSidebarView({ type: 'interior', data: found })
          break
        }

        case 'whatif-simular':
        case 'whatif':
          setOpenSection('whatif')
          setSidebarView({ type: 'escenario_condiciones' })
          break

        case 'whatif-result':
        case 'resultado-escenario':
          setSidebarView({ type: 'whatif_result' })
          break

        case 'evacuacion':
        case 'declarar-evacuacion':
          setEvacuacionActiva(true)
          setSidebarView({ type: 'evacuacion_alertas' })
          break

        case 'nexo-drawer':
        case 'nexo-ia':
          setNexoOpen(true)
          break

        case 'checklist-personal':
        case 'buscar-personal':
          setOpenSection('tracking')
          setDdOpen('personalSearch')
          break

        case 'dropdown-3d':
        case 'proyeccion-3d':
          setDdOpen('proj')
          break

        case 'dropdown-zoom':
          setDdOpen('zoom')
          break

        case 'simulaciones-menu':
          setOpenSection('sims')
          setDdOpen('addSim')
          break

        case 'recorrido-player':
          setOpenSection('tracking')
          break

        default:
          break
      }
    }, 10)
  }

  if (currentRoute === 'design-system') {
    return (
      <DesignSystemView
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onBackToApp={() => {
          window.location.hash = ''
          setCurrentRoute('app')
        }}
        onNavigateToLocation={handleNavigateFromDesignSystem}
      />
    )
  }

  return (
    <div className={`app ${nexoOpen ? 'nexo-open' : ''} ${interiorView ? 'in-interior' : ''}`} data-theme={theme}>
      {interiorView ? (
        <InteriorBombeoView
          roomId={interiorView}
          theme={theme}
          onClose={exitInterior}
          selectedPumpId={selectedPump}
          onSelectPump={(id) => {
            setSelectedPump(id)
            setSelectedWorker(null)
          }}
          onSelectWorker={(w) => setSelectedWorker(w)}
          onAskNexo={(q) => {
            setNexoOpen(true)
            sendNexoMessage(q)
          }}
        />
      ) : selectedProj === '3D - Superficie' ? (
        <SurfaceView
          theme={theme}
          surfaceMode={surfaceMode}
          onSurfaceModeChange={setSurfaceMode}
          showRelief={surfaceShowRelief}
          actionTrigger={surfaceAction}
          onClose={() => {
            setSelectedProj('3D - Perspectiva')
            setMode('perspective')
          }}
        />
      ) : selectedProj === '2D - Diagrama de planta' ? (
        <DiagramView
          theme={theme}
          zoom={zoom}
          onZoomChange={setZoom}
          onEnterInterior={(roomId) => navigateToInterior(roomId)}
        />
      ) : (
        <Scene3D
          mode={selectedProj === '2D - Vista superior' ? 'top' : mode}
          zoom={zoom}
          theme={theme}
          activeSimulations={activeSimulations}
          selectedObjectId={selected3DObjectId}
          onZoomChange={setZoom}
          onSelectObject={(id) => {
            if (!id) {
              setSelected3DObjectId(null)
              if (sidebarView?.type === 'interior' && !interiorView) {
                setSidebarView(null)
              }
              return
            }
            setSelected3DObjectId(id)
            const found = INTERIORES_DATA.find((item) => item.id === id)
            if (found) {
              setSidebarView({ type: 'interior', data: found })
            }
          }}
          onSelectSimEntity={(ent) => {
            setSelectedWorker({
              id: ent.id,
              name: ent.name,
              tag: ent.tag,
              role: ent.role,
              turno: ent.turno,
              ingreso: ent.ingreso,
              zona: ent.zona,
              velocidad: ent.velocidad,
              bateria: ent.bateria,
              ultimoPunto: ent.ultimoPunto,
              pos: [0, 0, 0],
              rotY: 0,
            })
          }}
        />
      )}

      {!interiorView && (
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
              aria-label="Sistema de diseño"
              title="Abrir Sistema de Diseño (/design-system)"
              onClick={() => {
                window.location.hash = '/design-system'
                setCurrentRoute('design-system')
              }}
              {...showHelp('Sistema de Diseño', 'Catálogo de componentes, tokens, badges, botones e interacción de SmartFlow (/design-system).')}
            >
              <Palette size={20} />
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
      )}

      {/* Left vertical floating toolbar (Diagrama 2D: Zoom in/out/fit; Superficie: 5 tools; 3D: full tools) */}
      {!interiorView && (
        <nav className="glass sidebar">
          {selectedProj === '2D - Diagrama de planta' ? (
            /* 2D - Diagrama de planta: ONLY zoom, alejar y ver todo */
            <>
              <button
                className="icon-btn"
                onClick={() => setZoom(clamp(zoom + 10))}
                {...showHelp('Acercar vista', 'Incrementa la escala del diagrama 2D.')}
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setZoom(clamp(zoom - 10))}
                {...showHelp('Alejar vista', 'Reduce la escala del diagrama 2D.')}
              >
                <ZoomOut size={18} />
              </button>
              <hr />
              <button
                className="icon-btn"
                onClick={() => setZoom(50)}
                {...showHelp('Ver todo', 'Ajusta el zoom para ver el diagrama de planta completo.')}
              >
                <Maximize2 size={18} />
              </button>
            </>
          ) : selectedProj === '3D - Superficie' ? (
            /* 3D - Superficie: Acercar, alejar, resetear, enfocarse y ajustar el sitio */
            <>
              <button
                className="icon-btn"
                onClick={() => setSurfaceAction({ type: 'zoomIn', id: Date.now() })}
                {...showHelp('Acercar', 'Acerca la vista del mapa de superficie.')}
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setSurfaceAction({ type: 'zoomOut', id: Date.now() })}
                {...showHelp('Alejar', 'Aleja la vista del mapa de superficie.')}
              >
                <ZoomOut size={18} />
              </button>
              <hr />
              <button
                className="icon-btn"
                onClick={() => setSurfaceAction({ type: 'reset', id: Date.now() })}
                {...showHelp('Resetear', 'Restablece la orientación hacia el norte y centro.')}
              >
                <RotateCcw size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setSurfaceAction({ type: 'focus', id: Date.now() })}
                {...showHelp('Enfocarse', 'Enfoca las cuadrillas y vehículos en superficie.')}
              >
                <Crosshair size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setSurfaceAction({ type: 'fit', id: Date.now() })}
                {...showHelp('Ajustar el sitio', 'Ajusta la extensión completa del sitio minero.')}
              >
                <Maximize2 size={18} />
              </button>
            </>
          ) : (
            /* Standard 3D navigation tools */
            <>
              {/* Group 1: Zoom In / Zoom Out */}
              <button
                className="icon-btn"
                onClick={() => setZoom(clamp(zoom + 10))}
                {...showHelp('Acercar vista', 'Incrementa la escala de acercamiento sobre el modelo 3D.')}
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setZoom(clamp(zoom - 10))}
                {...showHelp('Alejar vista', 'Reduce la escala de visualización general.')}
              >
                <ZoomOut size={18} />
              </button>

              <hr />

              {/* Group 2: Camera & Selection Navigation */}
              <button
                className={`icon-btn ${activeTool === 'level-up' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'level-up' ? '' : 'level-up'))}
                {...showHelp('Nivel superior', 'Permite elevar o alternar nivel en la mina.')}
              >
                <SquareArrowUp size={18} />
              </button>
              <button
                className={`icon-btn ${mode === 'perspective' ? 'active' : ''}`}
                onClick={() => { setSelectedProj('3D - Perspectiva'); setMode('perspective') }}
                {...showHelp('3D Perspectiva', 'Vista en volumen y geometría 3D de la mina.')}
              >
                <Box size={18} />
              </button>
              <button
                className={`icon-btn ${activeTool === 'shift' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'shift' ? '' : 'shift'))}
                {...showHelp('Vista lateral', 'Desplaza la perspectiva a la derecha o lateral.')}
              >
                <SquareArrowRight size={18} />
              </button>
              <button
                className={`icon-btn ${activeTool === 'select' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'select' ? '' : 'select'))}
                {...showHelp('Selección de área', 'Caja delimitadora para aislar o seleccionar un sector.')}
              >
                <SquareMousePointer size={18} />
              </button>

              <hr />

              {/* Group 3: Frame / Scan */}
              <button
                className={`icon-btn ${activeTool === 'fit' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTool((t) => (t === 'fit' ? '' : 'fit'))
                  setZoom(50)
                }}
                {...showHelp('Ajustar todo', 'Encuadra y centra toda la infraestructura de la mina en el visor.')}
              >
                <Scan size={18} />
              </button>

              <hr />

              {/* Group 4: Export / Upload */}
              <button
                className={`icon-btn ${activeTool === 'upload' ? 'active' : ''}`}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.glb,.gltf,.obj'
                  input.click()
                }}
                {...showHelp('Cargar modelo', 'Importa o carga un modelo 3D local al gemelo digital.')}
              >
                <Upload size={18} />
              </button>

              <hr />

              {/* Group 5: Measurement & Engineering Tools */}
              <button
                className={`icon-btn ${activeTool === 'ruler' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'ruler' ? '' : 'ruler'))}
                {...showHelp('Medición', 'Mide distancias tridimensionales entre puntos o túneles.')}
              >
                <Ruler size={18} />
              </button>
              <button
                className={`icon-btn ${activeTool === 'area' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'area' ? '' : 'area'))}
                {...showHelp('Área / Polígono', 'Calcula el área o sección transversal de galerías.')}
              >
                <Diamond size={18} />
              </button>
              <button
                className={`icon-btn ${activeTool === 'cable' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'cable' ? '' : 'cable'))}
                {...showHelp('Cableado y redes', 'Muestra conductos eléctricos y cableado de comunicación.')}
              >
                <Cable size={18} />
              </button>
              <button
                className={`icon-btn ${activeTool === 'light' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'light' ? '' : 'light'))}
                {...showHelp('Iluminación', 'Alterna visualización de luminarias y postes de seguridad.')}
              >
                <Lightbulb size={18} />
              </button>
              <button
                className={`icon-btn ${activeTool === 'wrench-left' ? 'active' : ''}`}
                onClick={() => setActiveTool((t) => (t === 'wrench-left' ? '' : 'wrench-left'))}
                {...showHelp('Ajustes y herramientas', 'Herramientas de configuración y mantenimiento del visor.')}
              >
                <Wrench size={18} />
              </button>

              <hr />

              {/* Group 6: History Undo / Redo */}
              <button
                className="icon-btn"
                onClick={() => {}}
                {...showHelp('Deshacer', 'Deshace la última acción o cambio de visualización.')}
              >
                <Undo2 size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => {}}
                {...showHelp('Rehacer', 'Rehace la acción previa revertida.')}
              >
                <Redo2 size={18} />
              </button>
            </>
          )}
        </nav>
      )}

      {/* Right column */}
      <div className="right-col" ref={rightColRef}>
        {!interiorView && !nexoOpen && (
          <div className="nexo-bar-wrap">
            <div className={`nexo-bar ${!nexoEnabled ? 'disabled' : ''}`}>
              <button
                className="nexo-open-trigger"
                onClick={() => {
                  setDdOpen(null)
                  setNexoOpen(true)
                }}
                {...showHelp('Bit IA', 'Asistente de inteligencia artificial para consultar el estado del turno, ventilación, personal y alertas en tiempo real.')}
              >
                <span className="nexo-title"><BitLogo /> Pregúntale a Bit IA</span>
              </button>
            </div>

            {ddOpen === 'nexoSettings' && (
              <div className="dd-menu nexo-settings-menu">
                <div className="dd-group-title">CONFIGURACIÓN BIT IA</div>

                <div className="row between switch-row nexo-switch-row" onClick={() => setNexoEnabled((v) => !v)}>
                  <div className="nexo-switch-text">
                    <span>Asistente Bit IA</span>
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
          {selectedWorker ? (
            /* Worker Detail Panel matching media_1793838814752_d3b96d00.png & media_1793839101437_8685ffe9.png */
            <div className="user-detail-panel interior-detail-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn no-border"
                  onClick={() => setSelectedWorker(null)}
                  title="Volver"
                  aria-label="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">{interiorView ? 'Sala de bombeo / ' : 'Simulaciones / '}</span>
                  <span className="crumb-name"><b>{selectedWorker.name}</b></span>
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

              <div className="interior-panel-body">
                <h2 className="user-detail-title" style={{ margin: '4px 0 2px 0' }}>{selectedWorker.name}</h2>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
                  <span className="user-signal-badge online" style={{ fontSize: 11 }}>{selectedWorker.tag}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500 }}>{selectedWorker.role}</span>
                </div>

                <div className="esc-block-title" style={{ marginTop: 8 }}>Información</div>
                <div className="user-info-list">
                  <div className="user-info-row">
                    <span className="info-label">Tipo</span>
                    <span className="info-value bold">{selectedWorker.tag}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="info-label">Rol</span>
                    <span className="info-value bold">{selectedWorker.role}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="info-label">Turno</span>
                    <span className="info-value bold">{selectedWorker.turno}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="info-label">Hora de ingreso</span>
                    <span className="info-value bold">{selectedWorker.ingreso}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="info-label">Zona actual</span>
                    <span className="info-value bold text-right">{selectedWorker.zona}</span>
                  </div>
                </div>

                <div className="esc-block-title" style={{ marginTop: 14 }}>Telemetría</div>
                <div className="user-info-list">
                  <div className="user-info-row">
                    <span className="info-label">Velocidad</span>
                    <span className="info-value bold">{selectedWorker.velocidad}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="info-label">Batería</span>
                    <span className="status-pill online" style={{ fontSize: 11, padding: '2px 8px' }}>{selectedWorker.bateria}</span>
                  </div>
                  <div className="user-info-row">
                    <span className="info-label">Último punto de control</span>
                    <span className="info-value bold">{selectedWorker.ultimoPunto}</span>
                  </div>
                </div>

                {/* Telemetría y acciones */}
              </div>
            </div>
          ) : sidebarView?.type === 'interior' || interiorView ? (() => {
            const currentInterior = sidebarView?.type === 'interior'
              ? sidebarView.data
              : INTERIORES_DATA.find((i) => i.id === interiorView) || INTERIORES_DATA[0]
            const isBombeo = interiorView === 'bombeo' || currentInterior.id === 'bombeo'

            if (isBombeo) {
              return (
                <div className="user-detail-panel interior-detail-panel bombeo-sidebar-panel">
                  {/* Clean header: Back breadcrumb navigation + Search (NO X) */}
                  <div className="user-detail-topbar">
                    <button
                      className="user-top-back-btn"
                      onClick={handleBackFromInterior}
                      title="Volver"
                      aria-label="Volver"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="user-top-crumb">
                      <span className="crumb-prefix">Interiores / </span>
                      <span className="crumb-name"><b>Sala de Bombeo SB1</b></span>
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

                  <div className="interior-panel-body" style={{ marginTop: 6 }}>
                    {/* IF NOT INSIDE: Preview card & Entrar CTA button */}
                    {!interiorView && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: 8,
                            background: 'var(--panel-item-bg, rgba(0,0,0,0.03))',
                            border: '1px solid var(--line)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                          }}
                        >
                          <div className="row between" style={{ fontSize: 13 }}>
                            <span style={{ color: 'var(--muted)' }}>Ubicación</span>
                            <b style={{ color: 'var(--text)' }}>Nivel L5 · Sector Central</b>
                          </div>
                          <div className="row between" style={{ fontSize: 13 }}>
                            <span style={{ color: 'var(--muted)' }}>Instalación</span>
                            <span style={{ color: 'var(--text)' }}>Estación de bombeo SB1</span>
                          </div>
                          <div className="row between" style={{ fontSize: 13 }}>
                            <span style={{ color: 'var(--muted)' }}>Equipos</span>
                            <span style={{ color: 'var(--text)' }}>4 bombas hidráulicas</span>
                          </div>
                          <div className="row between" style={{ fontSize: 13 }}>
                            <span style={{ color: 'var(--muted)' }}>Estado</span>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>2 en marcha · 1 falla</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 8 }}>
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
                            onClick={() => navigateToInterior('bombeo')}
                          >
                            <span>Entrar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* IF INSIDE: 2x2 Telemetry Grid (Nivel sumidero, En marcha, Caudal total, En falla), Arrastrar para girar & Pump cards */}
                    {interiorView && (
                      <>
                        <div className="interior-metrics-2grid" style={{ margin: '4px 0 12px 0' }}>
                          <div className="interior-metric-cell">
                            <span className="metric-cell-label">Nivel sumidero</span>
                            <span className="metric-cell-value" style={{ color: '#0284c7' }}>64%</span>
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

                        <div className="interior-card-divider" style={{ margin: '14px 0 10px 0' }} />

                        <div className="bombeo-section-title" style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', margin: '4px 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Bombas (4)
                        </div>

                        <div className="bombeo-pumps-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {PUMPS_SIDEBAR.map((p) => {
                            const isSel = selectedPump === p.id
                            return (
                              <div
                                key={p.id}
                                className={`bombeo-pump-card-v2 ${isSel ? 'selected' : ''}`}
                                onClick={() => setSelectedPump(p.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="bombeo-pump-v2-header">
                                  <div className="row gap-2" style={{ alignItems: 'center' }}>
                                    <span className={`pump-status-dot-v2 ${p.status}`} />
                                    <b style={{ fontSize: 13.5, color: 'var(--text)' }}>{p.id}</b>
                                  </div>
                                  <div className="row gap-2" style={{ alignItems: 'center' }}>
                                    <span className={`pump-badge-v2 ${p.status}`}>{p.statusText}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: p.status === 'falla' ? '#ef4444' : '#64748b' }}>{p.temp}</span>
                                  </div>
                                </div>
                                <div className="row between" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                                  <span>{p.flow}</span>
                                  <span>{p.hours}</span>
                                </div>
                                <div className="pump-bar-v2-track">
                                  <div
                                    className={`pump-bar-v2-fill ${p.status}`}
                                    style={{ width: p.status === 'reserva' ? '0%' : p.status === 'falla' ? '100%' : `${p.barPercent}%` }}
                                  />
                                </div>
                                {(isSel || p.status === 'falla') && (
                                  <button
                                    className="consultar-nexo-btn ia-secondary"
                                    style={{ marginTop: 8, marginBottom: 0, height: 34, padding: '0 12px', fontSize: 12 }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setNexoOpen(true)
                                      sendNexoMessage('¿Cómo mitigar la falla de BA-04 en Sala de bombeo SB-01?')
                                    }}
                                    title="Preguntar a Bit IA sobre la mitigación de falla"
                                  >
                                    <BitLogo width={12} height={14} color="#ffffff" />
                                    <span>Preguntar a Bit IA sobre {p.id}</span>
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            }

            return (
              <div className="user-detail-panel interior-detail-panel">
                <div className="user-detail-topbar">
                  <button
                    className="user-top-back-btn"
                    onClick={handleBackFromInterior}
                    title="Volver"
                    aria-label="Volver"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="user-top-crumb">
                    <span className="crumb-prefix">Interiores / </span>
                    <span className="crumb-name">
                      <b>{currentInterior.title}</b>
                    </span>
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

                <div className="interior-panel-body" style={{ marginTop: 6 }}>
                  <div className="interior-metrics-list">
                    {currentInterior.metrics.map((m, idx) => (
                      <div key={idx} className="interior-metric-item">
                        <div className="row between">
                          <span style={{ color: 'var(--muted)' }}>{m.label}</span>
                          <b style={{ color: m.valueColor || 'var(--text)' }}>{m.value}</b>
                        </div>
                        {m.bar && (
                          <div className="neutral-progress-track">
                            <div
                              className="neutral-progress-fill"
                              style={{ width: `${Math.round((m.bar.current / m.bar.max) * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!interiorView && (
                    <div style={{ marginTop: 20 }}>
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
                          gap: 8,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: 'none',
                        }}
                        onClick={() => navigateToInterior(currentInterior.id)}
                      >
                        <span>Entrar</span>
                      </button>
                      <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 6 }}>
                        Vista interior del lugar
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })() : sidebarView?.type === 'whatif_result' ? (
            <div className="user-detail-panel whatif-result-panel">
              <div className="user-detail-topbar">
                <button
                  className="user-top-back-btn no-border"
                  onClick={() => setSidebarView(null)}
                  title="Volver"
                  aria-label="Volver"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="user-top-crumb">
                  <span className="crumb-prefix">Inicio / Evacuación d... / </span>
                  <span className="crumb-name"><b>Resultados</b></span>
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

              <div className="whatif-result-container" style={{ padding: '4px 0' }}>
                <h2 className="user-detail-title" style={{ margin: '4px 0 12px 0', fontSize: 20, fontWeight: 700 }}>Resultado del escenario</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  <button
                    className="cta full no-shadow"
                    style={{
                      padding: '12px 18px',
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 12,
                      background: 'linear-gradient(90deg, #1253dd, #08ddf0)',
                      color: '#fff',
                      border: 'none',
                    }}
                    onClick={() => setSidebarView(null)}
                  >
                    Editar ajustes
                  </button>
                  <button
                    className="esc-secondary-btn full no-shadow"
                    style={{ padding: '11px 18px', fontSize: 13.5, fontWeight: 600, borderRadius: 12, boxShadow: 'none' }}
                    onClick={() => setSidebarView(null)}
                  >
                    Descartar escenario
                  </button>
                </div>

                {(() => {
                  const sc = WHAT_IF_SCENARIOS[whatIfTarget] || WHAT_IF_SCENARIOS['V-PH-01'] || WHAT_IF_SCENARIOS['CD-MT-01']
                  return (
                    <>
                      <h4 className="whatif-question-title" style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text)' }}>{sc.title}</h4>

                      <div className="whatif-kpi-summary-list">
                        <div className="row between whatif-kpi-row">
                          <span className="whatif-kpi-lbl">Zonas bajo el mínimo</span>
                          <b className="mono">8 / 8</b>
                        </div>
                        <div className="row between whatif-kpi-row">
                          <span className="whatif-kpi-lbl">Rutas de evacuación</span>
                          <b className="mono">3</b>
                        </div>
                        <div className="row between whatif-kpi-row">
                          <span className="whatif-kpi-lbl">Resuelto</span>
                          <b className="mono">{sc.ms} ms</b>
                        </div>
                        <div className="row between whatif-kpi-row">
                          <span className="whatif-kpi-lbl">Horizonte</span>
                          <b className="mono">{whatIfHorizon} min</b>
                        </div>
                      </div>

                      <div className="whatif-section-title" style={{ marginTop: 16 }}>Antes y después</div>
                      <div className="whatif-compare-grid-cards">
                        {sc.beforeAfter.map((row, idx) => {
                          const isDegraded =
                            row.trendColor === '#f44336' ||
                            row.trendColor === '#ef4444' ||
                            row.trendColor === '#ff9800' ||
                            (row.label.includes('degradad') && row.after !== '0.0') ||
                            (row.label.includes('conforme') && row.after !== row.before)
                          return (
                            <div key={idx} className={`whatif-compare-card-block ${isDegraded ? 'degraded' : 'normal'}`}>
                              <span className="whatif-compare-card-title">{row.label}</span>
                              <div className="whatif-compare-2col-box">
                                <div className="whatif-col">
                                  <span className="whatif-col-lbl">Antes</span>
                                  <span className="whatif-col-val">{row.before} {row.unit}</span>
                                </div>
                                <div className="whatif-col">
                                  <span className="whatif-col-lbl">Después</span>
                                  <span className="whatif-col-val" style={{ color: row.trendColor || 'inherit' }}>
                                    {row.after} {row.unit}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="whatif-section-title" style={{ marginTop: 16 }}>
                        Consecuencias proyectadas
                      </div>
                      <div className="whatif-consequences-list-styled">
                        {sc.consequences.map((c) => (
                          <div key={c.id} className={`whatif-consequence-card-styled ${c.level}`}>
                            <div className="whatif-card-top-row">
                              <b className="whatif-card-title">{c.title}</b>
                              {c.hasTarget && (
                                <button
                                  className="whatif-target-btn"
                                  title="Localizar en 3D"
                                  onClick={() => {
                                    if (c.coords) setZoom(100)
                                  }}
                                >
                                  <Target size={15} />
                                </button>
                              )}
                            </div>
                            <p className="whatif-card-desc">{c.desc}</p>
                            <div className="row between whatif-card-bottom-row">
                              <span className="whatif-card-level-label">
                                {c.level === 'critical' ? 'Crítico' : 'Alto'}
                              </span>
                              <span className="whatif-card-time-label">a los 2.3 h</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="whatif-section-title" style={{ marginTop: 16 }}>
                        Acciones recomendadas
                      </div>
                      <div className="whatif-actions-box">
                        <ul>
                          {sc.mitigations.map((m) => (
                            <li key={m.id}>{m.text}</li>
                          ))}
                        </ul>
                      </div>
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

              {/* AI Metric Card (Bit IA · Telemetría Activa, neutral colors, divider lines) */}
              <div className="user-ai-gradient-card animating">
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

                <div
                  className="surface-bottom-switch"
                  style={{
                    position: 'relative',
                    bottom: 'auto',
                    left: 'auto',
                    width: '100%',
                    display: 'flex',
                    marginBottom: 12,
                    boxShadow: 'none',
                    padding: 3,
                  }}
                >
                  <button
                    className={`surface-switch-btn ${auxilioTab === 'sin_resolver' ? 'active' : ''}`}
                    onClick={() => setAuxilioTab('sin_resolver')}
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

                <div className="vehicle-auxilios-stack" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Hombre caído', 'Coacción', 'SOS'].map((tipo) => (
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
                        <span>{sidebarView.data.name || 'Carlos Mendoza'}</span>
                      </div>

                      <div className="auxilio-card-row3">
                        <span>Refugio R-01</span>
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
                  style={{
                    width: '100%',
                    marginTop: 8,
                    ['--range-progress' as any]: `${(escenarioSlider / 60) * 100}%`,
                  }}
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

              <div className="user-info-list" style={{ marginTop: 14 }}>
                <div className="user-info-row">
                  <span className="info-label">Historial</span>
                  <span className="info-value bold">Hace 15 minutos</span>
                </div>
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

                {/* Filter Tabs: 3 sin resolver | 3 resueltas (Segmented Control matching design system) */}
                <div
                  className="surface-bottom-switch"
                  style={{
                    position: 'relative',
                    bottom: 'auto',
                    left: 'auto',
                    width: '100%',
                    display: 'flex',
                    marginBottom: 12,
                    boxShadow: 'none',
                    padding: 3,
                  }}
                >
                  <button
                    className={`surface-switch-btn ${auxilioTab === 'sin_resolver' ? 'active' : ''}`}
                    onClick={() => setAuxilioTab('sin_resolver')}
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
          ) : sidebarView?.type === 'evacuacion_alertas' ? (
            /* Evacuación View matching media_1793984790645_4b0c3ba0.png (No alertas, exact padding, red button at bottom) */
            <div className="user-detail-panel evacuacion-alertas-panel">
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
                  <span className="crumb-name"><b>Evacuación en curso</b></span>
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

              <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h2 className="user-detail-title" style={{ margin: '4px 0 6px 0', fontSize: 18, fontWeight: 700 }}>
                  Evacuación en curso
                </h2>

                {/* Evacuation Status Box matching media_1793984790645_4b0c3ba0.png */}
                <div
                  className="evac-info-card"
                  style={{
                    borderRadius: 10,
                    padding: '12px 14px',
                    background: 'var(--panel-bg)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Siren size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>
                      EVACUACIÓN EN CURSO
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.35 }}>
                      Área: Área sin determinar · 33 sin contabilizar
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      Declarada por Operador
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                      498329:06:27
                    </span>
                  </div>
                </div>

                {/* Operational Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
                  <div className="row between" style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Estado</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>Activa</span>
                  </div>
                  <div className="row between" style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Personal sin contabilizar</span>
                    <b style={{ color: 'var(--text)' }}>33 trabajadores</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--muted)' }}>Puntos de encuentro</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>Refugio R-01, Superficie</span>
                  </div>
                  <div className="row between" style={{ fontSize: 13, padding: '4px 0' }}>
                    <span style={{ color: 'var(--muted)' }}>Ruta principal</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>Rampa Norte N02</span>
                  </div>
                </div>

                {/* Bottom Red Finalize Button */}
                <div style={{ marginTop: 16 }}>
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
                      boxShadow: 'none',
                    }}
                    onClick={() => {
                      setEvacuacionActiva(false)
                      setSidebarView(null)
                    }}
                  >
                    <span>Finalizar evacuación</span>
                  </button>
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
                          className={`dd-item ${selectedProj === id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedProj(id)
                            const pr = projections.find((p) => p.id === id)
                            if (pr) setMode(pr.view)
                            setDdOpen(null)
                          }}
                        >
                          <I size={18} />
                          <span>{label}</span>
                          {selectedProj === id && <Check size={16} className="dd-check" />}
                        </button>
                      ))}

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
                              setSelectedProj('3D - Perspectiva')
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
                </div>
              </div>

              {/* Segmented Switch: Satélite | Mapa | Relieve (Figma / Conmutador Vista Superficie archetype) */}
              <div className="section" style={{ marginTop: 14 }}>
                <div className="section-head no-chevron" style={{ cursor: 'default', marginBottom: 8 }}>
                  <span>Capa de mapa</span>
                </div>
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
                  }}
                >
                  <button
                    className={`surface-switch-btn ${surfaceMode === 'satelite' ? 'active' : ''}`}
                    onClick={() => setSurfaceMode('satelite')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Satélite
                  </button>
                  <button
                    className={`surface-switch-btn ${surfaceMode === 'mapa' ? 'active' : ''}`}
                    onClick={() => setSurfaceMode('mapa')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Mapa
                  </button>
                  <button
                    className={`surface-switch-btn ${surfaceMode === 'relieve' ? 'active' : ''}`}
                    onClick={() => setSurfaceMode('relieve')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Relieve
                  </button>
                </div>

                {/* Quitar relieve toggle */}
                <div
                  className="row between"
                  style={{
                    padding: '10px 4px 6px',
                    marginTop: 6,
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSurfaceShowRelief((v) => !v)}
                >
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>Relieve 3D / Sombras</span>
                  <div className="row gap-2 switch-row">
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {surfaceShowRelief ? 'Activo' : 'Sin relieve'}
                    </span>
                    <span className={`mui-switch ${surfaceShowRelief ? 'checked' : ''}`}>
                      <span className="mui-switch-track" />
                      <span className="mui-switch-thumb" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Superficie exterior */}
              <div className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
                <div className="section-head no-chevron" style={{ cursor: 'default', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Superficie exterior
                  </span>
                </div>
                <div className="diagram-data-grid" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Personal interior</span>
                    <b style={{ fontWeight: 600 }}>30 adentro</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Personal exterior</span>
                    <b style={{ fontWeight: 600 }}>11 afuera</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Precisión GPS</span>
                    <b style={{ fontWeight: 600 }}>±50 m</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Temperatura exterior</span>
                    <b style={{ fontWeight: 600 }}>21.5 °C</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Viento</span>
                    <b style={{ fontWeight: 600 }}>12 km/h NE</b>
                  </div>
                </div>
              </div>

              {/* Título y lista de Personal y vehículos en exterior dividida con línea */}
              <div className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
                <div className="section-head no-chevron" style={{ cursor: 'default', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PERSONAL Y VEHÍCULOS EN EXTERIOR
                  </span>
                </div>
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
          ) : selectedProj === '2D - Diagrama de planta' ? (
            /* Contextual Sidebar for 2D - Diagrama de planta (Buscar, Modo visualización, Lugar, Rampa y Trazos) */
            <div className="diagram-sidebar-panel">
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

              {/* Modo de visualización */}
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
                          className={`dd-item ${selectedProj === id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedProj(id)
                            const pr = projections.find((p) => p.id === id)
                            if (pr) setMode(pr.view)
                            setDdOpen(null)
                          }}
                        >
                          <I size={18} />
                          <span>{label}</span>
                          {selectedProj === id && <Check size={16} className="dd-check" />}
                        </button>
                      ))}

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
                              setSelectedProj('3D - Perspectiva')
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
                </div>
              </div>

              {/* Capas y simbología de diagrama (media_1793857718823_5301fe75.png) */}
              <div className="diagram-context-section" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
                <div className="section-head no-chevron" style={{ cursor: 'default', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Elementos de planta
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 3, background: '#0066cc', borderRadius: 2 }} />
                    <span style={{ color: 'var(--text)' }}>Galerías y rampas principales</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 2, borderBottom: '2px dashed #ea580c' }} />
                    <span style={{ color: 'var(--text)' }}>Trazados auxiliares y chimeneas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ color: 'var(--text)' }}>Refugios mineros</span>
                  </div>
                </div>
              </div>

              {/* Lugar, Rampa, Cantidad de trazos y Total desarrollo activo divididos con línea */}
              <div className="diagram-context-section" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
                <div className="section-head no-chevron" style={{ cursor: 'default', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Datos del trazado
                  </span>
                </div>
                <div className="diagram-data-grid" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Lugar</span>
                    <b style={{ fontWeight: 600 }}>Mina Ciénaga</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Rampa</span>
                    <b style={{ fontWeight: 600 }}>Rampa Principal RP-01</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Cantidad de trazos</span>
                    <b style={{ fontWeight: 600, fontFamily: 'monospace' }}>3,749 trazos</b>
                  </div>
                  <div className="row between" style={{ fontSize: 13, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 700 }}>Total desarrollo activo</span>
                    <b style={{ fontWeight: 800, color: theme === 'dark' ? '#ffffff' : '#000000', fontFamily: 'monospace', fontSize: 14 }}>
                      1,935 m
                    </b>
                  </div>
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

                {/* 50% Zoom Popover Menu */}
                {ddOpen === 'zoom' && (
                  <div className="dd-menu zoom-menu">
                    <div className="dd-group-title">ESCALA DE VISTA</div>
                    {zoomPresets.map(({ val, label }) => {
                      const isSel = zoom === val
                      return (
                        <button
                          key={val}
                          className={`dd-item ${isSel ? 'active' : ''}`}
                          onClick={() => {
                            setZoom(val)
                            setDdOpen(null)
                          }}
                        >
                          <span>{label}</span>
                          {isSel && <Check size={16} className="dd-check" />}
                        </button>
                      )
                    })}
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
            <div
              className={`section-head ${activeTrackings.length === 0 ? 'disabled-accordion' : ''}`}
              onClick={() => {
                if (activeTrackings.length > 0) toggle('track')
              }}
              style={{ cursor: activeTrackings.length > 0 ? 'pointer' : 'default' }}
            >
              <span>Tracking</span>
              <div className="section-head-actions" onClick={(e) => e.stopPropagation()}>
                {activeTrackings.length > 0 && (
                  <button
                    className="section-action-btn"
                    title="Eliminar todos los elementos de tracking"
                    {...showHelp('Eliminar tracking', 'Elimina todos los elementos de seguimiento activos de la vista 3D.')}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTrackings([])
                      setExpandedTrack({})
                      if (openSection === 'track') setOpenSection(null)
                    }}
                  >
                    <Trash size={15} />
                  </button>
                )}
                <button
                  className="section-action-btn"
                  title="Agregar tracking"
                  {...showHelp('Agregar tracking', 'Añade una nueva capa o elemento de seguimiento (personal, vehículos, zonas, etc.).')}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDdOpen((d) => (d === 'addTrack' ? null : 'addTrack'))
                  }}
                >
                  <CirclePlus size={16} />
                </button>
                <button
                  className={`accordion-chevron-btn ${activeTrackings.length === 0 ? 'disabled' : ''}`}
                  disabled={activeTrackings.length === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (activeTrackings.length > 0) toggle('track')
                  }}
                  aria-label={openSection === 'track' && activeTrackings.length > 0 ? 'Contraer' : 'Expandir'}
                  aria-disabled={activeTrackings.length === 0}
                  title={activeTrackings.length === 0 ? 'Sin elementos de tracking' : (openSection === 'track' ? 'Contraer' : 'Expandir')}
                >
                  {openSection === 'track' && activeTrackings.length > 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                          <span>{id === 'evacuacion' && evacuacionActiva ? 'Terminar evacuación' : cfg.label}</span>
                        </button>
                        <div className="track-row-actions">
                          <button title="Quitar" onClick={() => removeTrackingItem(id)}>
                            <CircleMinus size={18} />
                          </button>
                          <button
                            className="accordion-chevron-btn"
                            title={isExp ? 'Contraer' : 'Expandir'}
                            onClick={() => toggleTrackItem(id)}
                          >
                            {isExp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded sub-panel for Declarar evacuación */}
                      {isExp && id === 'evacuacion' && (
                        <div className="track-subpanel" style={{ padding: '8px 10px' }}>
                          <button
                            className="cta full no-shadow"
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              padding: '12px 18px',
                              borderRadius: 12,
                              fontWeight: 700,
                              fontSize: 14,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 'none',
                              width: '100%',
                            }}
                            onClick={() => {
                              setEvacuacionActiva(true)
                              setSidebarView({ type: 'evacuacion_alertas' })
                            }}
                          >
                            <span>Declarar la evacuación</span>
                          </button>
                        </div>
                      )}

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
                          <div style={{ display: 'flex', gap: 8, width: '100%', position: 'relative' }}>
                            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                              <button
                                className="dd-trigger full grow"
                                style={{ width: '100%' }}
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

                            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                              <button
                                className="dd-trigger full grow"
                                style={{ width: '100%' }}
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
              </div>
            )}
          </div>

          {/* 4. SIMULACIONES */}
          <div
            className="section sim-section"
            {...showHelp('Simulaciones', 'Ejecución de modelos predictivos y escenarios.')}
          >
            <div
              className={`section-head ${activeSimulations.length === 0 ? 'disabled-accordion' : ''}`}
              onClick={() => {
                if (activeSimulations.length > 0) toggle('sim')
              }}
              style={{ cursor: activeSimulations.length > 0 ? 'pointer' : 'default' }}
            >
              <span>Simulaciones</span>
              <div className="section-head-actions" onClick={(e) => e.stopPropagation()}>
                {activeSimulations.length > 0 && (
                  <button
                    className="section-action-btn"
                    title="Eliminar todas las simulaciones"
                    {...showHelp('Eliminar simulaciones', 'Elimina todas las simulaciones activas de la vista 3D.')}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSimulations([])
                      if (openSection === 'sim') setOpenSection(null)
                    }}
                  >
                    <Trash size={15} />
                  </button>
                )}
                <button
                  className="section-action-btn"
                  title="Agregar simulación"
                  {...showHelp('Agregar simulación', 'Añade una nueva capa de simulación física (ventilación, energía, geocercas, etc.).')}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDdOpen((d) => (d === 'addSim' ? null : 'addSim'))
                  }}
                >
                  <CirclePlus size={16} />
                </button>
                <button
                  className={`accordion-chevron-btn ${activeSimulations.length === 0 ? 'disabled' : ''}`}
                  disabled={activeSimulations.length === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (activeSimulations.length > 0) toggle('sim')
                  }}
                  aria-label={openSection === 'sim' && activeSimulations.length > 0 ? 'Contraer' : 'Expandir'}
                  aria-disabled={activeSimulations.length === 0}
                  title={activeSimulations.length === 0 ? 'Sin simulaciones activas' : (openSection === 'sim' ? 'Contraer' : 'Expandir')}
                >
                  {openSection === 'sim' && activeSimulations.length > 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                      <div className="dd-group-title">{cat}</div>
                      {items.map((sim) => {
                        const Icon = sim.icon
                        const isAdded = activeSimulations.includes(sim.id)
                        return (
                          <button
                            key={sim.id}
                            className={`dd-item ${isAdded ? 'selected' : ''}`}
                            onClick={() => toggleSimulationItem(sim.id)}
                          >
                            <Icon size={18} style={{ color: sim.color }} />
                            <span>{sim.label}</span>
                            {isAdded && <Check size={16} className="dd-check" />}
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
                    <div key={id} className="track-item-block">
                      <div className="sim-row-item">
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
                      {id === 'personal' && (
                        <div className="track-subpanel" style={{ paddingLeft: 4 }}>
                          <div className="personal-list">
                            {SIM_ENTITIES.map((ent) => (
                              <div
                                key={ent.id}
                                className="zona-row personal-clickable-row"
                                onClick={() =>
                                  setSelectedWorker({
                                    id: ent.id,
                                    name: ent.name,
                                    tag: ent.tag,
                                    role: ent.role,
                                    turno: ent.turno,
                                    ingreso: ent.ingreso,
                                    zona: ent.zona,
                                    velocidad: ent.velocidad,
                                    bateria: ent.bateria,
                                    ultimoPunto: ent.ultimoPunto,
                                    pos: [0, 0, 0],
                                    rotY: 0,
                                  })
                                }
                                title={`Ver detalle de ${ent.name}`}
                              >
                                <span className="zona-bar" style={{ background: ent.color }} />
                                <div className="zona-info">
                                  <div className="zona-line1"><b>{ent.name}</b></div>
                                  <div className="zona-line2">{ent.role} &nbsp; {ent.zona}</div>
                                </div>
                                <span className="user-signal-badge online" style={{ fontSize: 11 }}>{ent.tag}</span>
                                <ChevronRight size={16} className="row-chevron" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 5. SIMULAR ESCENARIO (CFE + Plan de Turnos + Bit IA) */}
          <Section
            title="Simular escenario"
            open={openSection === 'ana' || openSection === 'simulaciones'}
            onToggle={() => toggle('ana')}
            onHover={showHelp('Simular escenario', 'Entradas del escenario precargadas desde el plan de turnos y contrato CFE con ejecución en Bit IA.')}
          >
            <div className="whatif-config-box">
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.45 }}>
                Entradas del escenario: precargadas desde el plan de turnos y contrato CFE.
              </div>

              {/* 1. ¿Dónde debe ocurrir la perforación pesada? */}
              <label className="field-label">¿Dónde debe ocurrir la perforación pesada?</label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`dd-trigger full ${ddOpen === 'drill_window' ? 'active' : ''}`}
                  onClick={() => setDdOpen((d) => (d === 'drill_window' ? null : 'drill_window'))}
                >
                  <span>{drillWindow}</span>
                  <ChevronDown size={16} />
                </button>
                {ddOpen === 'drill_window' && (
                  <div className="dd-menu" style={{ width: '100%', top: 'calc(100% + 4px)', left: 0, zIndex: 120 }}>
                    <div className="dd-group-title">VENTANA DE PERFORACIÓN</div>
                    {DRILL_WINDOW_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`dd-item ${drillWindow === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setDrillWindow(opt)
                          setDdOpen(null)
                        }}
                      >
                        <span>{opt}</span>
                        {drillWindow === opt && <Check size={14} className="dd-check" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <small style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.35 }}>
                Plan actual: 4 jumbos perforan 4 h en cada turno de 8 h (los turnos comienzan a las 06:00, 14:00, 22:00).
              </small>

              {/* 2. Temporada de tarifas */}
              <label className="field-label" style={{ marginTop: 12 }}>Temporada de tarifas</label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`dd-trigger full ${ddOpen === 'tariff_season' ? 'active' : ''}`}
                  onClick={() => setDdOpen((d) => (d === 'tariff_season' ? null : 'tariff_season'))}
                >
                  <span>{tariffSeason}</span>
                  <ChevronDown size={16} />
                </button>
                {ddOpen === 'tariff_season' && (
                  <div className="dd-menu" style={{ width: '100%', top: 'calc(100% + 4px)', left: 0, zIndex: 120 }}>
                    <div className="dd-group-title">TEMPORADA CFE</div>
                    {TARIFF_SEASON_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`dd-item ${tariffSeason === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setTariffSeason(opt)
                          setDdOpen(null)
                        }}
                      >
                        <span>{opt}</span>
                        {tariffSeason === opt && <Check size={14} className="dd-check" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Acarreo mantenido durante horas punta */}
              <div className="row between" style={{ marginTop: 12, fontSize: 13 }}>
                <span className="field-label" style={{ margin: 0 }}>Acarreo mantenido durante horas punta</span>
                <b className="mono">{haulagePeak} %</b>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={haulagePeak}
                onChange={(e) => setHaulagePeak(+e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  ['--range-progress' as any]: `${haulagePeak}%`,
                }}
              />
              <small style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.35 }}>
                Las horas punta se utilizan para merienda (crib), inspecciones y cambio de turno en lugar de acarreo.
              </small>

              {/* 4. Checkboxes */}
              <div className="whatif-axes-check-list" style={{ marginTop: 10 }}>
                <div
                  className="whatif-check-row"
                  onClick={() => setRecoverOffPeak((prev) => !prev)}
                >
                  <span className={`whatif-custom-checkbox ${recoverOffPeak ? 'checked' : ''}`}>
                    {recoverOffPeak && <Check size={14} />}
                  </span>
                  <span className="whatif-check-label">
                    Recuperar toneladas perdidas en valle (utilización de camiones hasta 92 %)
                  </span>
                </div>
                <div
                  className="whatif-check-row"
                  onClick={() => setNoBlastingPeak((prev) => !prev)}
                >
                  <span className={`whatif-custom-checkbox ${noBlastingPeak ? 'checked' : ''}`}>
                    {noBlastingPeak && <Check size={14} />}
                  </span>
                  <span className="whatif-check-label">
                    Sin autorización de voladura (clearance) durante horas punta
                  </span>
                </div>
              </div>

              {/* 5. Margen de seguridad VOD sobre requerimiento */}
              <div className="row between" style={{ marginTop: 12, fontSize: 13 }}>
                <span className="field-label" style={{ margin: 0 }}>Margen de seguridad VOD sobre requerimiento</span>
                <b className="mono">{vodMargin} %</b>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={vodMargin}
                onChange={(e) => setVodMargin(+e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  ['--range-progress' as any]: `${(vodMargin / 30) * 100}%`,
                }}
              />

              {/* 6. Acordeón: Valores de flota, personal y tarifas */}
              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setFleetDetailsOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    padding: '4px 0',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    cursor: 'pointer',
                  }}
                >
                  {fleetDetailsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Valores de flota, personal y tarifas</span>
                </button>
                {fleetDetailsOpen && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.03)',
                      border: '1px solid var(--line)',
                      fontSize: 11.5,
                      lineHeight: 1.5,
                      color: 'var(--text)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div>• <b>Flota activa:</b> 4 Jumbos DD422i, 6 Camiones TH551i, 3 Scoops LH517i.</div>
                    <div>• <b>Personal:</b> 28 trabajadores en interior mina (Turno A).</div>
                    <div>• <b>Contrato CFE:</b> Tarifa GDMTH Media Tensión horaria ($312.40 MXN/kW-mes demanda punta).</div>
                  </div>
                )}
              </div>

              {/* 7. Action buttons: Secondary Bit IA button + Copiar JSON */}
              <button
                type="button"
                className="consultar-nexo-btn ia-secondary"
                style={{ width: '100%', height: 40, marginTop: 14 }}
                onClick={handleRunScenarioWithBit}
                title="Simular escenario con Bit IA"
              >
                <BitLogo width={14} height={14} color="#ffffff" />
                <span>Simular escenario con Bit IA</span>
              </button>

              <button
                type="button"
                style={{
                  width: '100%',
                  height: 32,
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onClick={handleCopyScenarioJson}
              >
                {scenarioJsonCopied ? '✔ JSON copiado al portapapeles' : 'Copiar JSON del escenario'}
              </button>
            </div>
          </Section>

          {/* 6. INTERIORES */}
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
                    onClick={() => {
                      setSelected3DObjectId(item.id)
                      setSidebarView({ type: 'interior', data: item })
                    }}
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
            </div>
          </Section>

          {/* 7. IMPORTAR / EXPORTAR */}
          <Section
            title="Importar / Exportar"
            open={openSection === 'impexp'}
            onToggle={() => toggle('impexp')}
            onHover={showHelp('Importar y exportar', 'Gestión de datos 3D: importar nuevos modelos, exportar la escena o capturar la vista actual.')}
          >
            <div className="interiores-list">
              <div
                className="interior-item-row"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.glb,.gltf,.obj'
                  input.onchange = () => alert('Modelo cargado correctamente en el visor 3D.')
                  input.click()
                }}
                title="Importar modelo 3D (GLB, GLTF, OBJ)"
              >
                <div className="interior-item-left">
                  <Upload size={18} style={{ color: 'var(--text)' }} />
                  <span className="interior-item-title">Importar modelo</span>
                </div>
              </div>

              <div
                className="interior-item-row"
                onClick={() => alert('Exportando escena completa en formato GLB...')}
                title="Exportar toda la mina a GLB"
              >
                <div className="interior-item-left">
                  <Download size={18} style={{ color: 'var(--text)' }} />
                  <span className="interior-item-title">Exportar escena (GLB)</span>
                </div>
              </div>

              <div
                className="interior-item-row"
                onClick={() => alert('Exportando elementos seleccionados a GLB...')}
                title="Exportar elementos seleccionados a GLB"
              >
                <div className="interior-item-left">
                  <Download size={18} style={{ color: '#64748b' }} />
                  <span className="interior-item-title" style={{ color: '#64748b' }}>Exportar selección (GLB)</span>
                </div>
              </div>

              <div
                className="interior-item-row"
                onClick={() => {
                  const canvas = document.querySelector('canvas')
                  if (canvas) {
                    const link = document.createElement('a')
                    link.download = 'smartflow-captura.png'
                    link.href = canvas.toDataURL('image/png')
                    link.click()
                  }
                }}
                title="Capturar pantalla de la vista 3D"
              >
                <div className="interior-item-left">
                  <Camera size={18} style={{ color: 'var(--text)' }} />
                  <span className="interior-item-title">Captura de pantalla</span>
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

      {/* What-If Simulation Player (media_1793688483305_37ea198b.png) */}
      {sidebarView?.type === 'whatif_result' && (
        <div className="glass whatif-simulation-player">
          <div className="whatif-player-top">
            <div className="whatif-player-controls">
              <button
                className="whatif-player-btn"
                title={whatIfPlaying ? 'Pausar' : 'Reproducir'}
                onClick={() => setWhatIfPlaying((p) => !p)}
              >
                {whatIfPlaying ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button
                className="whatif-player-btn"
                title="Reiniciar"
                onClick={() => setWhatIfTime(0)}
              >
                <RotateCcw size={16} />
              </button>
              <span className="whatif-player-title">Ultima persona llega a refugio</span>
            </div>
            <span className="whatif-player-time">
              {String(Math.floor(whatIfTime / 60)).padStart(2, '0')}:{String(whatIfTime % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Gray incident indicators above progress bar (media_1793692794190_dad454a5.png) */}
          <div className="whatif-event-dots-track">
            {[
              { time: 140, label: 'Inicio de alteración en flujo' },
              { time: 420, label: 'Compuerta V-01 cerrada' },
              { time: 760, label: 'Evacuación alertada' },
              { time: 1180, label: 'Personal arriba a punto seguro' },
              { time: 1540, label: 'Estabilización de caudal' },
            ].map((ev, idx) => (
              <span
                key={idx}
                className="whatif-event-dot"
                style={{ left: `${(ev.time / 1800) * 100}%` }}
                title={`${ev.label} (${Math.floor(ev.time / 60)}:${String(ev.time % 60).padStart(2, '0')})`}
                onClick={() => setWhatIfTime(ev.time)}
              />
            ))}
          </div>

          <div
            className="player-seekbar-wrap"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              setWhatIfTime(Math.round(pct * 1800))
            }}
          >
            <div className="player-seekbar-bg">
              <div
                className="player-seekbar-fill"
                style={{ width: `${(whatIfTime / 1800) * 100}%` }}
              />
              <div
                className="player-seekbar-thumb"
                style={{ left: `${(whatIfTime / 1800) * 100}%` }}
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
      )}

      {/* SMF - V2 - 20 Bit IA Right Drawer (340px wide, full height) */}
      {nexoOpen && (
        <aside className="glass nexo-drawer" aria-label="Bit IA">
          <div className="nexo-drawer-top" ref={nexoMoreRef}>
            {/* Left: Configuration gear icon (no background, matching size, weight and color) */}
            <button
              className={`nexo-drawer-settings-btn ${ddOpen === 'nexoSettings' ? 'active' : ''}`}
              title="Configuración de Bit IA"
              aria-label="Configuración de Bit IA"
              onClick={(e) => {
                e.stopPropagation()
                setDdOpen((d) => (d === 'nexoSettings' ? null : 'nexoSettings'))
              }}
            >
              <Settings size={18} />
            </button>

            {/* Right: History and Close icons */}
            <div className="nexo-top-actions">
              <button
                className={`nexo-more-btn ${nexoMoreOpen ? 'active' : ''}`}
                title="Historial de Bit y más opciones"
                aria-label="Historial de Bit y más opciones"
                onClick={() => {
                  setNexoMoreOpen((v) => !v)
                  setNexoMoreView('main')
                }}
              >
                <EllipsisVertical size={18} />
              </button>

              <button
                className="nexo-close-btn"
                title="Cerrar Bit IA"
                aria-label="Cerrar Bit IA"
                onClick={() => {
                  setNexoMoreOpen(false)
                  setNexoOpen(false)
                }}
              >
                <PanelRightClose size={18} />
              </button>
            </div>

            {ddOpen === 'nexoSettings' && (
              <div className="dd-menu nexo-settings-menu" style={{ top: 'calc(100% + 6px)', left: 0, right: 'auto', width: 280 }}>
                <div className="dd-group-title">CONFIGURACIÓN BIT IA</div>

                <div className="row between switch-row nexo-switch-row" onClick={() => setNexoEnabled((v) => !v)}>
                  <div className="nexo-switch-text">
                    <span>Asistente Bit IA</span>
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
                    <small>{nexoAutoAlerts ? 'Alertas proactivas del turno' : 'Solo bajo demanda'}</small>
                  </div>
                  <span className={`mui-switch ${nexoAutoAlerts ? 'checked' : ''}`}>
                    <span className="mui-switch-track" />
                    <span className="mui-switch-thumb" />
                  </span>
                </div>
              </div>
            )}

            {nexoMoreOpen && (
              <div className="dd-menu nexo-history-menu">
                {nexoMoreView === 'main' ? (
                  <>
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
                {nexoMessages.map((m, i) => {
                  if (m.isScenarioResult) {
                    return (
                      <div key={i} className="nexo-msg assistant" style={{ width: '100%', maxWidth: '100%', padding: '12px 14px' }}>
                        {/* Status Pill matching image: ⚙ Bit calculó la red de ventilación   7 ms */}
                        <div className="nexo-status-pill">
                          <div className="row gap-2" style={{ alignItems: 'center' }}>
                            <Settings size={14} style={{ color: 'var(--muted)' }} />
                            <span>Bit calculó la red de ventilación</span>
                          </div>
                          <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>7 ms</span>
                        </div>

                        {/* 4 Scenario Result Cards */}
                        <div className="nexo-scenario-cards-container">
                          {/* Card 1: Oportunidad · Energía y costo */}
                          <div className="nexo-scenario-card opportunity">
                            <div className="nexo-card-header">
                              <div className="nexo-card-cat-label opportunity">
                                <b>Oportunidad</b>
                                <span style={{ color: 'var(--muted)' }}>· Energía y costo</span>
                              </div>
                              <div className="nexo-confidence-badge">
                                <div className="nexo-confidence-circle green">82%</div>
                                <span className="nexo-confidence-sub">confianza</span>
                              </div>
                            </div>
                            <h3 className="nexo-card-title">Ahorro de MXN 2.18 M por mes (35 %)</h3>
                            <p className="nexo-card-body">
                              El costo cae de MXN 6.23 M a MXN 4.04 M. VOD por sí solo aporta MXN 1.23 M; la nueva programación añade MXN 957 k, principalmente al reducir la demanda en horario punta de 3,649 kW a 692 kW.
                            </p>
                            <div className="nexo-card-actions">
                              <button className="nexo-card-btn" onClick={() => setSelectedProj('3D - Perspectiva')}>Mostrar hora punta</button>
                              <button className="nexo-card-btn" onClick={() => setSidebarView({ type: 'whatif_result' })}>Comparar casos</button>
                            </div>
                          </div>

                          {/* Card 2: Contexto · Seguridad */}
                          <div className="nexo-scenario-card context">
                            <div className="nexo-card-header">
                              <div className="nexo-card-cat-label context">
                                <b>Contexto</b>
                                <span style={{ color: 'var(--muted)' }}>· Seguridad</span>
                              </div>
                              <div className="nexo-confidence-badge">
                                <div className="nexo-confidence-circle blue">88%</div>
                                <span className="nexo-confidence-sub">confianza</span>
                              </div>
                            </div>
                            <h3 className="nexo-card-title">El aire se mantiene sobre el requerimiento en toda la mina</h3>
                            <p className="nexo-card-body">
                              Punto más ajustado: N1 al 110 % de su mínimo a las 00:00 (piso). 0 eventos de nivel de acción de gas. La ventilación post-voladura siempre opera al 100 % de velocidad de ventilador.
                            </p>
                            <div className="nexo-card-actions">
                              <button className="nexo-card-btn" onClick={() => setLevel('L1')}>Mostrar punto más ajustado</button>
                            </div>
                          </div>

                          {/* Card 3: Oportunidad · Producción */}
                          <div className="nexo-scenario-card opportunity">
                            <div className="nexo-card-header">
                              <div className="nexo-card-cat-label opportunity">
                                <b>Oportunidad</b>
                                <span style={{ color: 'var(--muted)' }}>· Producción</span>
                              </div>
                              <div className="nexo-confidence-badge">
                                <div className="nexo-confidence-circle green">86%</div>
                                <span className="nexo-confidence-sub">confianza</span>
                              </div>
                            </div>
                            <h3 className="nexo-card-title">El plan de perforación cabe en la ventana</h3>
                            <p className="nexo-card-body">
                              Las 48 horas-jumbo de perforación caben. Las voladuras inician a las 04:00, 12:00, 22:00.
                            </p>
                            <div className="nexo-card-actions">
                              <button className="nexo-card-btn">Mostrar primera voladura</button>
                            </div>
                          </div>

                          {/* Card 4: Contexto · Acarreo */}
                          <div className="nexo-scenario-card context">
                            <div className="nexo-card-header">
                              <div className="nexo-card-cat-label context">
                                <b>Contexto</b>
                                <span style={{ color: 'var(--muted)' }}>· Acarreo</span>
                              </div>
                              <div className="nexo-confidence-badge">
                                <div className="nexo-confidence-circle blue">74%</div>
                                <span className="nexo-confidence-sub">confianza</span>
                              </div>
                            </div>
                            <h3 className="nexo-card-title">18,214 t/día acarreadas (+1 % vs hoy)</h3>
                            <p className="nexo-card-body">
                              Menos despejes por voladura y la recuperación fuera de punta mantienen las toneladas en plan. El acarreo en punta es 40 % del normal.
                            </p>
                          </div>
                        </div>

                        {/* Closing Note from Bit */}
                        <div className="nexo-closing-note">
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>Bit</div>
                          <p style={{ fontSize: 13, lineHeight: 1.45, margin: '0 0 6px 0', color: 'var(--text)' }}>
                            Cada hallazgo viene con acciones recomendadas. Tú las ejecutas: yo no cambio consignas de ventiladores ni roles de turno por mi cuenta.
                          </p>
                          <p style={{ fontSize: 12, lineHeight: 1.45, margin: 0, color: 'var(--muted)' }}>
                            El panel derecho ahora muestra la simulación junto a la operación real medida a la izquierda. Desplaza el reloj o haz clic en un ventilador para comparar cada componente. Modifica cualquier entrada arriba y ejecuta de nuevo.
                          </p>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={i} className={`nexo-msg ${m.role}`}>
                      {m.text}
                    </div>
                  )
                })}
              </div>
            )}

            {nexoMessages.length === 0 && (
              <div className="nexo-welcome">
                <div className="nexo-avatar-circle">
                  <BitLogo width={26} height={26} color="#ffffff" />
                </div>

                <h2 className="nexo-greeting">¿Cómo puedo ayudarte hoy?</h2>

                {(interiorView === 'bombeo' || sidebarView?.type === 'interior') && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: 'rgba(2, 132, 199, 0.1)',
                      color: '#0284c7',
                      fontSize: 11.5,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    <BitLogo width={12} height={12} color="#0284c7" />
                    <span>
                      Contexto activo: {interiorView === 'bombeo' ? 'Sala de bombeo SB-01 (L5)' : sidebarView?.type === 'interior' ? sidebarView.data.title : ''}
                    </span>
                  </div>
                )}

                <div className="nexo-suggestions">
                  {currentNexoSuggestions.map((s) => (
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
            )}
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
              placeholder="Pregúntale a Bit IA"
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
                title="Enviar a Bit IA"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </form>
        </aside>
      )}

      {!interiorView && selectedProj !== '2D - Diagrama de planta' && selectedProj !== '3D - Superficie' && (
        <ul
          className="glass levels"
          {...showHelp('Niveles', 'Acceso a las capas estructurales, niveles (L1 General a L5 Interior), rampas, cotas y parámetros técnicos del diseño de la mina.')}
        >
          {levels.map(([k, n]) => (
            <li key={k} className={level === k ? 'on' : ''} onClick={() => setLevel(k)}><b>{k}</b> {n}</li>
          ))}
        </ul>
      )}

      {/* Ableton-style docked minimalist bottom info bar (no blur, non-floating) */}
      {!interiorView && (
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
      )}

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

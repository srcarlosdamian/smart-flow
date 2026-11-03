import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Globe, Users, Crosshair, X, Plus, Minus, Compass, Home, Maximize2, Minimize2,
} from 'lucide-react'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  onClose: () => void
}

type SurfaceMode = 'satelite' | 'mapa' | 'relieve'

const MINE_CENTER: [number, number] = [24.9752, -106.2848] // Ciénaga de Nuestra Señora / Vascogil region

const EXTERIOR_PEOPLE = [
  { id: 'juan', name: 'Juan García', role: 'Acarreo', coords: [24.9765, -106.2890] as [number, number], vehicle: 'Camión T-01' },
  { id: 'ricardo', name: 'Ricardo Flores', role: 'Supervisión', coords: [24.9740, -106.2865] as [number, number], vehicle: 'Camioneta C-04' },
  { id: 'carlos', name: 'Carlos Martínez', role: 'Mecánico', coords: [24.9725, -106.2730] as [number, number], vehicle: 'Taller Exterior' },
  { id: 'alejandro', name: 'Alejandro Ruiz', role: 'Operador', coords: [24.9710, -106.2745] as [number, number], vehicle: 'Cargador L-02' },
]

export default function SurfaceView({ theme, onClose }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('relieve')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: MINE_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    })
    mapRef.current = map

    // Custom pulse & marker icon creation
    EXTERIOR_PEOPLE.forEach((p) => {
      const iconHtml = `
        <div class="surface-worker-marker">
          <div class="marker-pulse"></div>
          <div class="marker-dot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <div class="marker-label">
            <b>${p.name}</b>
            <small>${p.vehicle}</small>
          </div>
        </div>
      `
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [120, 50],
        iconAnchor: [60, 20],
      })
      L.marker(p.coords, { icon }).addTo(map)
    })

    // Region label markers
    const regionHtml1 = `<div class="surface-region-badge">Cienega de Nuestra Señora</div>`
    L.marker([24.9810, -106.2680], {
      icon: L.divIcon({ className: '', html: regionHtml1, iconSize: [160, 24], iconAnchor: [80, 12] })
    }).addTo(map)

    const regionHtml2 = `<div class="surface-region-badge">Vascogil</div>`
    L.marker([24.9980, -106.2920], {
      icon: L.divIcon({ className: '', html: regionHtml2, iconSize: [80, 24], iconAnchor: [40, 12] })
    }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Switch Tile Layer when surfaceMode or theme changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
      tileLayerRef.current = null
    }

    let url = ''
    let options: L.TileLayerOptions = { maxZoom: 18 }

    if (surfaceMode === 'satelite') {
      // High-resolution Esri World Imagery
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    } else if (surfaceMode === 'relieve') {
      // OpenTopoMap with contour relief
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
      options = { maxZoom: 17, subdomains: ['a', 'b', 'c'] }
    } else {
      // Vector map: Dark Matter in dark mode, Positron/Voyager in light mode
      url = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      options = { subdomains: 'abcd', maxZoom: 20 }
    }

    const layer = L.tileLayer(url, options).addTo(map)
    tileLayerRef.current = layer
  }, [surfaceMode, theme])

  const handleZoomIn = () => mapRef.current?.zoomIn()
  const handleZoomOut = () => mapRef.current?.zoomOut()
  const handleHome = () => mapRef.current?.setView(MINE_CENTER, 13)
  const handleCompass = () => {
    mapRef.current?.setView(MINE_CENTER, mapRef.current.getZoom(), { animate: true })
  }
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="surface-view-container">
      {/* Interactive Map Canvas */}
      <div ref={mapContainerRef} className="surface-map-viewport" />

      {/* Top Indicators Bar */}
      <div className="surface-top-chips">
        <div className="surface-chip">
          <Globe size={15} />
          <span>Superficie</span>
        </div>
        <div className="surface-chip">
          <Users size={15} />
          <span>11 afuera</span>
        </div>
        <div className="surface-chip">
          <Crosshair size={15} />
          <span>±50 m</span>
        </div>
        <button className="surface-chip close-btn" onClick={onClose} title="Cerrar vista superficie">
          <X size={15} />
        </button>
      </div>

      {/* Right-Side Tool Controls matching Figma & screenshot */}
      <div className="surface-right-toolbar">
        <button className="surface-tool-btn" onClick={handleZoomIn} title="Acercar (Zoom in)">
          <Plus size={18} />
        </button>
        <button className="surface-tool-btn" onClick={handleZoomOut} title="Alejar (Zoom out)">
          <Minus size={18} />
        </button>
        <hr className="surface-tool-sep" />
        <button className="surface-tool-btn" onClick={handleCompass} title="Brújula (Restablecer orientación al norte)">
          <Compass size={18} />
        </button>
        <button className="surface-tool-btn" onClick={handleHome} title="Inicio (Vista predeterminada)">
          <Home size={18} />
        </button>
        <button className="surface-tool-btn" onClick={toggleFullscreen} title="Pantalla completa">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Bottom-Left Mode Segmented Switch: Satélite | Mapa | Relieve */}
      <div className="surface-bottom-switch">
        <button
          className={`surface-switch-btn ${surfaceMode === 'satelite' ? 'active' : ''}`}
          onClick={() => setSurfaceMode('satelite')}
        >
          Satélite
        </button>
        <button
          className={`surface-switch-btn ${surfaceMode === 'mapa' ? 'active' : ''}`}
          onClick={() => setSurfaceMode('mapa')}
        >
          Mapa
        </button>
        <button
          className={`surface-switch-btn ${surfaceMode === 'relieve' ? 'active' : ''}`}
          onClick={() => setSurfaceMode('relieve')}
        >
          Relieve
        </button>
      </div>
    </div>
  )
}

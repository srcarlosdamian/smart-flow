import { useState } from 'react'
import {
  ChevronLeft,
  Search,
  Bell,
  Globe,
  Sun,
  Moon,
  Crosshair,
  Plus,
  Check,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  SquareArrowUp,
  Box,
  SquareArrowRight,
  SquareMousePointer,
  Ruler,
  Settings,
  ChevronDown,
  Droplets,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
} from 'lucide-react'
import { NexoLogo } from './App'
import { BorderBeam } from './BorderBeam'
import type { Theme } from './Scene3D'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  onBackToApp: () => void
}

export default function DesignSystemView({ theme, onToggleTheme, onBackToApp }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'buttons' | 'ia' | 'icons' | 'badges' | 'cards' | 'inputs'>('all')
  const [beamSpeed, setBeamSpeed] = useState<number>(8)
  const [beamSize, setBeamSize] = useState<number>(220)

  return (
    <div className={`ds-page app`} data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowY: 'auto' }}>
      {/* Top sticky navigation */}
      <header
        className="ds-header glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--line)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className="user-top-back-btn no-border"
            onClick={onBackToApp}
            title="Volver a SmartFlow Gemelo Digital"
            style={{ width: 34, height: 34, borderRadius: 8, cursor: 'pointer' }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>SmartFlow · Design System</h1>
              <span className="status-pill marcha" style={{ fontSize: 10, padding: '2px 8px' }}>v2.4 Live</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Catálogo unificado de tokens, componentes, hovers neutrales, iconos y animaciones de IA
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Navigation Filter Tabs */}
          <div className="ds-tab-pills" style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.04)', padding: 3, borderRadius: 8 }}>
            {(['all', 'buttons', 'ia', 'icons', 'badges', 'cards', 'inputs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === tab ? 'var(--hover-bg)' : 'transparent',
                  color: activeTab === tab ? 'var(--text)' : 'var(--muted)',
                  transition: 'all .15s ease',
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="icon-btn"
            onClick={onToggleTheme}
            title={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            style={{ width: 36, height: 36, borderRadius: 8 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="cta no-shadow"
            onClick={onBackToApp}
            style={{
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Ir a la Mina</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 24px 80px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* ============================================================== */}
        {/* 1. IA COMPONENTS & BORDER BEAM (libraries.dev/beam Inspired)   */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'ia') && (
          <section className="ds-section">
            <div className="ds-section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} style={{ color: '#90a4ae' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Nexo IA · Animaciones & Componentes</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Inspirado en la animación de luz perimetral continua de <code>https://libraries.dev/beam</code> adaptada a los tonos metálicos gris / pizarra de Nexo IA (<code>#455a64</code>, <code>#546e7a</code>, <code>#90a4ae</code>).
              </p>
            </div>

            {/* Interactive Border Beam Showcase */}
            <div
              className="ds-grid-2"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)',
                gap: 24,
                marginBottom: 24,
              }}
            >
              {/* Card with Border Beam Active */}
              <div
                className="user-ai-gradient-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px 24px',
                  borderRadius: 14,
                  background: 'transparent',
                  margin: 0,
                }}
              >
                <BorderBeam
                  duration={beamSpeed}
                  size={beamSize}
                  colorFrom="#455a64"
                  colorMid="#90a4ae"
                  colorTo="#546e7a"
                  borderRadius={14}
                  borderWidth={1.5}
                />
                <div className="user-ai-card-top" style={{ marginBottom: 12 }}>
                  <div className="user-ai-tag" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <NexoLogo width={16} height={18} color="#ffffff" />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>IA Predictiva · Telemetría Activa</span>
                  </div>
                  <span className="user-ai-status" style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    Óptimo
                  </span>
                </div>

                <div className="user-info-list" style={{ marginTop: 12 }}>
                  <div className="user-info-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                    <span className="info-label" style={{ fontSize: 13, color: 'var(--muted)' }}>Ruta recomendada</span>
                    <span className="info-value bold" style={{ fontSize: 13, fontWeight: 600 }}>Rampa N02 → Refugio R-01</span>
                  </div>
                  <div className="user-info-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                    <span className="info-label" style={{ fontSize: 13, color: 'var(--muted)' }}>Tiempo estimado</span>
                    <span className="info-value bold" style={{ fontSize: 13, fontWeight: 600 }}>3 min 40 s (Sin riesgo)</span>
                  </div>
                  <div className="user-info-row" style={{ padding: '8px 0' }}>
                    <span className="info-label" style={{ fontSize: 13, color: 'var(--muted)' }}>Atmósfera en ruta</span>
                    <span className="info-value bold" style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>CO &lt; 5 ppm · O₂ 20.9%</span>
                  </div>
                </div>
              </div>

              {/* Controls for Border Beam */}
              <div
                className="glass"
                style={{
                  padding: 20,
                  borderRadius: 14,
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>Parámetros en Tiempo Real</div>
                <div>
                  <div className="row between" style={{ fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--muted)' }}>Velocidad del haz (Loop)</span>
                    <b>{beamSpeed} s</b>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    step={1}
                    value={beamSpeed}
                    onChange={(e) => setBeamSpeed(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <div className="row between" style={{ fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--muted)' }}>Tamaño del haz (Beam Size)</span>
                    <b>{beamSize} px</b>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={400}
                    step={10}
                    value={beamSize}
                    onChange={(e) => setBeamSize(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--hover-bg)', padding: '10px 12px', borderRadius: 8 }}>
                  💡 <b>Regla del Sistema:</b> Cualquier contenedor o card que reciba sugerencias proactivas de Nexo IA usará <code>&lt;BorderBeam /&gt;</code> con fondo translúcido/transparente.
                </div>
              </div>
            </div>

            {/* Nexo Buttons Showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Button: Pregúntale a Nexo IA (Top Bar Trigger) */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>BARRA SUPERIOR · TRIGGER PRINCIPAL</div>
                <div className="nexo-bar" style={{ width: '100%' }}>
                  <button className="nexo-open-trigger" style={{ cursor: 'pointer' }}>
                    <span className="nexo-title"><NexoLogo /> Pregúntale a Nexo IA</span>
                  </button>
                  <button className="nexo-settings-btn" title="Configuración">
                    <Settings size={17} />
                  </button>
                </div>
              </div>

              {/* Button: Consultar estado con Nexo IA (Sin movimiento ni sombra) */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>BOTÓN ESTADO NEXO (SIN HOVER SHIFT NI SOMBRA)</div>
                <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0 }}>
                  <NexoLogo width={14} height={16} color="#ffffff" />
                  <span>Consultar estado con Nexo IA</span>
                </button>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                  <code>box-shadow: none !important; transform: none !important;</code>
                </div>
              </div>

              {/* Button: Preguntar a Nexo sobre equipo */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>ACCIÓN CONTEXTUAL DE EQUIPO / BOMBA</div>
                <button className="consultar-nexo-btn ia-gradient" style={{ margin: 0, padding: '9px 14px', fontSize: 12.5 }}>
                  <NexoLogo width={13} height={15} color="#ffffff" />
                  <span>Preguntar a Nexo sobre BA-04</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 2. BUTTONS & NEUTRAL HOVERS (Homologación Unificada)           */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <section className="ds-section">
            <div className="ds-section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Layers size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Botones & Comportamiento Neutral en Hover</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Todos los botones secundarios, chips de permanencia y botones de acción adoptan el <b>hover neutral translúcido</b> idéntico al home (sin tintes azules accidentales).
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {/* CTA Primario Cyan-Azul */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>1. CTA PRIMARIO (.cta)</div>
                <button className="cta full no-shadow" style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, borderRadius: 8 }}>
                  Aplicar Cambios
                </button>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>Gradiente <code>linear-gradient(90deg, #1253dd, #08ddf0)</code></div>
              </div>

              {/* Botón Acción Neutral (.user-action-btn) */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>2. ACCIÓN NEUTRAL (.user-action-btn)</div>
                <button className="user-action-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 14px' }}>
                  <Crosshair size={16} />
                  <span>Centrar en el mapa</span>
                </button>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>Hover neutral: <code>rgba(0,0,0,0.08)</code> / <code>rgba(255,255,255,0.12)</code></div>
              </div>

              {/* Botón Petición / Chip (.permanencia-chip / .auxilio-action-btn) */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>3. CHIP PERMANENCIA (.permanencia-chip)</div>
                <button className="permanencia-chip" style={{ margin: 0 }}>
                  Camion T-03 · Nivel N02
                </button>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>Hover neutro homologado (sin borde azul)</div>
              </div>

              {/* Botón Secundario Peligro / Terminar Evacuación */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>4. TERMINAR EVACUACIÓN / ALERTA</div>
                <button
                  className="user-action-btn"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 14px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <AlertTriangle size={15} />
                  <span>Terminar evacuación</span>
                </button>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>Patrón de acción consistente en el tope del panel</div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 3. ICONOGRAPHY & SIZING HIERARCHY                              */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'icons') && (
          <section className="ds-section">
            <div className="ds-section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ruler size={20} style={{ color: '#10b981' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Jerarquía de Iconos & Tamaños del Sistema</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Escala estandarizada de iconos basada en Lucide React para mantener proporciones óptimas.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* 20px - Topbar Actions */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div className="row between" style={{ marginBottom: 8 }}>
                  <b style={{ fontSize: 14 }}>20 px · Barra Superior</b>
                  <span className="status-pill online">TopBar</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                  <Search size={20} />
                  <Bell size={20} />
                  <Globe size={20} />
                  <Sun size={20} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Usado en acciones globales del encabezado</div>
              </div>

              {/* 18px - Toolbar & Navigation */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div className="row between" style={{ marginBottom: 8 }}>
                  <b style={{ fontSize: 14 }}>18 px · Toolbar & Navegación</b>
                  <span className="status-pill marcha">Sidebar</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                  <ChevronLeft size={18} />
                  <ZoomIn size={18} />
                  <ZoomOut size={18} />
                  <SquareArrowUp size={18} />
                  <Box size={18} />
                  <SquareArrowRight size={18} />
                  <SquareMousePointer size={18} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Barra flotante izquierda y botones de retroceso (Back)</div>
              </div>

              {/* 16px - Standard Actions */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div className="row between" style={{ marginBottom: 8 }}>
                  <b style={{ fontSize: 14 }}>16 px · Botones de Acción</b>
                  <span className="status-pill warning">Acciones</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                  <Crosshair size={16} />
                  <Plus size={16} />
                  <Check size={16} />
                  <AlertTriangle size={16} />
                  <ChevronDown size={16} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Acciones primarias, botones de centrar y desplegables</div>
              </div>

              {/* 14px - Metadatos & Filas */}
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div className="row between" style={{ marginBottom: 8 }}>
                  <b style={{ fontSize: 14 }}>14 px · Metadatos & Cards</b>
                  <span className="status-pill reserva">Micro</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                  <Settings size={14} />
                  <Droplets size={14} />
                  <Copy size={14} />
                  <ExternalLink size={14} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Iconos informativos secundarios dentro de listas y chips</div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 4. BADGES, STATUS PILLS & INDICATORS (Inventario Completo)     */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'badges') && (
          <section className="ds-section">
            <div className="ds-section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={20} style={{ color: '#10b981' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Inventario de Badges & Status Pills</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Catálogo documentado de todos los badges existentes en SmartFlow para auditoría y homologación.
              </p>
            </div>

            <div className="glass" style={{ padding: 20, borderRadius: 14, border: '1px solid var(--line)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Estado de Equipos / Bombas</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span className="status-pill marcha">En marcha</span>
                    <span className="status-pill reserva">En reserva</span>
                    <span className="status-pill falla">Falla</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Personal & Vehículos</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span className="user-signal-badge online">En línea</span>
                    <span className="status-pill online">Activo</span>
                    <span className="enlace-activo-badge">Enlace activo</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Alertas & Evacuación</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span className="evac-alert-tag-critical">Crítico</span>
                    <span className="auxilio-status-unattended">Sin atender</span>
                    <span className="status-pill warning">Atendido</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Badges en Escena 3D</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <div className="bombeo-pump-3d-badge active" style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}>
                      <span className="pump-badge-name">BA-01</span>
                      <span className="pump-badge-flow">78 L/s</span>
                    </div>
                    <div className="bombeo-pump-3d-badge error" style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}>
                      <span className="pump-badge-name">BA-04</span>
                      <span className="pump-badge-flow">Falla</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 5. CARDS & CONTAINERS                                          */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'cards') && (
          <section className="ds-section">
            <div className="ds-section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Box size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Cards & Patrones de Contenedor</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Componentes de contenedor con padding homogéneo (<code>padding: 10px 12px</code>) y efectos glass con blur.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {/* Sticky Topbar Breadcrumb */}
              <div className="glass" style={{ padding: 16, borderRadius: 14, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>STICKY TOPBAR CON BLUR INTENSO</div>
                <div className="user-detail-topbar" style={{ position: 'relative', margin: 0 }}>
                  <button className="user-top-back-btn no-border" title="Volver">
                    <ChevronLeft size={18} />
                  </button>
                  <div className="user-top-crumb">
                    <span className="crumb-prefix">Interiores / </span>
                    <span className="crumb-name"><b>Sala de bombeo SB-01</b></span>
                  </div>
                  <button className="user-top-back-btn no-border" style={{ marginLeft: 'auto' }} title="Buscar">
                    <Search size={16} />
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                  Blur 20px + fondo 82% opaco para que el scroll inferior no traspase.
                </div>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="glass" style={{ padding: 16, borderRadius: 14, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>GRID MÉTRICO 2x2 (.interior-metrics-2grid)</div>
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
              </div>

              {/* Emergency Auxilio Card */}
              <div className="glass" style={{ padding: 16, borderRadius: 14, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>CARD DE ALERTA / AUXILIO (.auxilio-card)</div>
                <div className="auxilio-card" style={{ margin: 0 }}>
                  <div className="auxilio-card-row1">
                    <span className="auxilio-type-title">Camion T-03 no autorizado</span>
                    <div className="auxilio-status-group">
                      <span className="auxilio-status-unattended">Sin atender</span>
                      <span className="auxilio-status-critical">Crítico</span>
                    </div>
                  </div>
                  <div className="auxilio-card-row2">
                    <Crosshair size={14} className="auxilio-icon" />
                    <span>Zona Refugio R-01 · Nivel N03</span>
                  </div>
                  <div className="auxilio-card-actions">
                    <button className="auxilio-action-btn">
                      <span>Atender</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bombeo Pump Card */}
              <div className="glass" style={{ padding: 16, borderRadius: 14, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>CARD DE BOMBA (.bombeo-pump-card-v2)</div>
                <div className="bombeo-pump-card-v2" style={{ margin: 0 }}>
                  <div className="pump-card-v2-header">
                    <span className="pump-name">BA-01</span>
                    <span className="status-pill marcha">En marcha</span>
                  </div>
                  <div className="pump-card-v2-metrics">
                    <span>78 L/s</span>
                    <span>·</span>
                    <span>12.4 bar</span>
                    <span>·</span>
                    <span>62°C</span>
                  </div>
                  <div className="pump-card-v2-hours">3120 h de servicio</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 6. INPUTS & CONTRAST IN DARK MODE                             */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'inputs') && (
          <section className="ds-section">
            <div className="ds-section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ChevronDown size={20} style={{ color: '#0284c7' }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Selects, Triggers & Contraste en Modo Oscuro</h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Garantiza que el texto dentro de <code>.dd-trigger</code> y selects nunca se pierda sobre fondos oscuros (contrast ratio &gt; 7:1).
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>MODO DE VISUALIZACIÓN (.dd-trigger)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="dd-trigger grow" style={{ flex: 1 }}>
                    <span>3D - Perspectiva</span>
                    <ChevronDown size={16} />
                  </button>
                  <button className="dd-trigger zoom-btn">
                    <span>50 %</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                  Color forzado a <code>#f8fafc</code> con fondo translúcido en dark mode.
                </div>
              </div>

              <div className="glass" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>SWITCH TOGGLE (.mui-switch)</div>
                <div className="row between switch-row nexo-switch-row" style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.03)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Asistente Nexo IA</span>
                  <span className="mui-switch checked">
                    <span className="mui-switch-track" />
                    <span className="mui-switch-thumb" />
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

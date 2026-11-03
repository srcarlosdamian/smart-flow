import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { X, AlertTriangle, Droplets, ChevronLeft } from 'lucide-react'
import { NexoLogo } from './App'
import type { Theme } from './Scene3D'

interface Props {
  theme?: Theme
  onClose: () => void
  selectedPumpId?: string | null
  onSelectPump?: (id: string) => void
  onAskNexo?: (query: string) => void
}

interface Pump3D {
  id: string
  name: string
  flow: string
  pressure: string
  temp: string
  hours: string
  status: 'marcha' | 'reserva' | 'falla'
  color: string
  statusText: string
  pos: [number, number, number]
}

const PUMPS: Pump3D[] = [
  { id: 'BA-01', name: 'BA-01', flow: '78 L/s', pressure: '12.4 bar', temp: '62°C', hours: '3120 h', status: 'marcha', color: '#00e676', statusText: 'En marcha', pos: [-6, 0, 0] },
  { id: 'BA-02', name: 'BA-02', flow: '74 L/s', pressure: '11.9 bar', temp: '59°C', hours: '2870 h', status: 'marcha', color: '#00e676', statusText: 'En marcha', pos: [-2, 0, 0] },
  { id: 'BA-03', name: 'BA-03', flow: '0 L/s', pressure: '0.0 bar', temp: '24°C', hours: '1490 h', status: 'reserva', color: '#94a3b8', statusText: 'Reserva', pos: [2, 0, 0] },
  { id: 'BA-04', name: 'BA-04', flow: '0 L/s', pressure: '0.0 bar', temp: '81°C', hours: '4650 h', status: 'falla', color: '#ef4444', statusText: 'Falla', pos: [6, 0, 0] },
]

export default function InteriorBombeoView({ onClose, selectedPumpId, onSelectPump, onAskNexo }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [activePump, setActivePump] = useState<string | null>(selectedPumpId || null)
  const [screenCoords, setScreenCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({})
  const [sumpCoords, setSumpCoords] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false })

  useEffect(() => {
    if (selectedPumpId) setActivePump(selectedPumpId)
  }, [selectedPumpId])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene & Renderer - Studio Clay Aesthetic matching Image 1
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xedf2f7)
    scene.fog = new THREE.FogExp2(0xedf2f7, 0.015)

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(-3, 4.2, 13)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.target.set(0, 1.2, -0.5)
    controls.maxPolarAngle = Math.PI / 2 - 0.02
    controls.minDistance = 5
    controls.maxDistance = 24

    // High-Key Studio Lighting for Clean Clay Shading
    const ambLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdbeafe, 1.2)
    scene.add(hemiLight)

    const mainDir = new THREE.DirectionalLight(0xffffff, 1.6)
    mainDir.position.set(10, 16, 12)
    scene.add(mainDir)

    const fillDir = new THREE.DirectionalLight(0xe0f2fe, 0.8)
    fillDir.position.set(-12, 10, -6)
    scene.add(fillDir)

    // Overhead Industrial Lamps
    const lampPositions: [number, number, number][] = [
      [-4, 5.2, -1],
      [4, 5.2, -1],
    ]

    lampPositions.forEach((lPos) => {
      // Chain
      const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 6)
      const chainMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.2, roughness: 0.5 })
      const chain = new THREE.Mesh(chainGeo, chainMat)
      chain.position.set(lPos[0], lPos[1] + 1.2, lPos[2])
      scene.add(chain)

      // Lamp Shade Cone
      const coneGeo = new THREE.ConeGeometry(0.7, 0.5, 24, 1, true)
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.1, roughness: 0.35, side: THREE.DoubleSide })
      const cone = new THREE.Mesh(coneGeo, coneMat)
      cone.position.set(lPos[0], lPos[1], lPos[2])
      scene.add(cone)
    })

    // Room Geometry: Light Studio Clay Wall and Floor
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0xedf2f7,
      roughness: 0.65,
      metalness: 0.02,
    })

    // Back Wall
    const wallGeo = new THREE.BoxGeometry(32, 16, 0.4)
    const backWall = new THREE.Mesh(wallGeo, roomMat)
    backWall.position.set(0, 6, -5)
    scene.add(backWall)

    // Floor Platform Behind Sump
    const floorGeo = new THREE.BoxGeometry(32, 0.6, 10)
    const floor = new THREE.Mesh(floorGeo, roomMat)
    floor.position.set(0, -0.3, -2)
    scene.add(floor)

    // Front Floor in front of Sump
    const frontFloorGeo = new THREE.BoxGeometry(32, 0.6, 8)
    const frontFloor = new THREE.Mesh(frontFloorGeo, roomMat)
    frontFloor.position.set(0, -0.3, 6.5)
    scene.add(frontFloor)

    // Sump Pit Pit Water (Cyan Translucent Glass)
    const waterGeo = new THREE.BoxGeometry(32, 0.5, 4.5)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.3,
      transparent: true,
      opacity: 0.65,
    })
    const water = new THREE.Mesh(waterGeo, waterMat)
    water.position.set(0, -0.7, 1.8)
    scene.add(water)

    // Clay Material (Off-White Studio Clay matching Image 1)
    const clayMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.05,
    })

    // Overhead Header Manifold Pipe (spans all 4 pumps horizontally)
    const manifoldGeo = new THREE.CylinderGeometry(0.32, 0.32, 22, 32)
    const manifold = new THREE.Mesh(manifoldGeo, clayMat)
    manifold.rotation.z = Math.PI / 2
    manifold.position.set(0, 3.2, -1.2)
    scene.add(manifold)

    // Build 4 Pumping Trains with Off-White Clay + Blue Accent on BA-02 matching Image 1
    const pumpGroups: Record<string, THREE.Group> = {}
    const orbMeshes: Record<string, THREE.Mesh> = {}

    PUMPS.forEach((pump, pIdx) => {
      const g = new THREE.Group()
      g.position.set(...pump.pos)

      // Concrete Pedestal
      const pedGeo = new THREE.BoxGeometry(2.5, 0.45, 3.4)
      const pedMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.65 })
      const ped = new THREE.Mesh(pedGeo, pedMat)
      ped.position.set(0, 0.22, -0.2)
      g.add(ped)

      // Pump Impeller Casing (Off-white clay)
      const casingGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.65, 32)
      const casing = new THREE.Mesh(casingGeo, clayMat)
      casing.rotation.z = Math.PI / 2
      casing.position.set(-0.35, 1.0, -0.2)
      g.add(casing)

      // Casing Flange Ring
      const ringGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.1, 32)
      const ring = new THREE.Mesh(ringGeo, clayMat)
      ring.rotation.z = Math.PI / 2
      ring.position.set(-0.65, 1.0, -0.2)
      g.add(ring)

      // Electric Motor Cylinder: BA-02 (pIdx === 1) is Electric Blue matching Image 1!
      const isBlueAccent = pIdx === 1
      const motorMat = isBlueAccent
        ? new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            metalness: 0.35,
            roughness: 0.3,
          })
        : clayMat

      const motorGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.55, 32)
      const motor = new THREE.Mesh(motorGeo, motorMat)
      motor.rotation.z = Math.PI / 2
      motor.position.set(0.7, 1.0, -0.2)
      g.add(motor)

      // Vertical Discharge Pipe going up to overhead manifold
      const vPipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 24)
      const vPipe = new THREE.Mesh(vPipeGeo, clayMat)
      vPipe.position.set(-0.35, 2.1, -0.8)
      g.add(vPipe)

      // Forward Suction Pipe extending into sump pit with Valve Wheel
      const fPipeGeo = new THREE.CylinderGeometry(0.22, 0.22, 3.4, 24)
      const fPipe = new THREE.Mesh(fPipeGeo, clayMat)
      fPipe.rotation.x = 1.0
      fPipe.position.set(-0.35, 0.35, 1.0)
      g.add(fPipe)

      // Valve Handwheel on suction pipe
      const wheelGeo = new THREE.TorusGeometry(0.22, 0.03, 12, 24)
      const wheel = new THREE.Mesh(wheelGeo, clayMat)
      wheel.rotation.x = Math.PI / 2
      wheel.position.set(-0.35, 0.7, 0.5)
      g.add(wheel)

      // Glowing Indicator Orb on Pedestal front
      const orbGeo = new THREE.SphereGeometry(0.14, 16, 16)
      const orbMat = new THREE.MeshBasicMaterial({
        color: pump.color,
      })
      const orb = new THREE.Mesh(orbGeo, orbMat)
      orb.position.set(0, 0.5, 1.0)
      g.add(orb)
      orbMeshes[pump.id] = orb

      // Local Point Light from the Orb
      const orbLight = new THREE.PointLight(pump.color, 1.2, 2.8)
      orbLight.position.set(0, 0.6, 0.8)
      g.add(orbLight)

      pumpGroups[pump.id] = g
      scene.add(g)
    })

    // Also load the user's interior_bombeo.glb if available to augment background elements
    const gltfLoader = new GLTFLoader()
    const glbUrl = `${import.meta.env.BASE_URL}interior_bombeo.glb`
    gltfLoader.load(
      glbUrl,
      (gltf) => {
        const obj = gltf.scene
        // Position behind main pump stage
        obj.position.set(0, -0.2, -6)
        obj.scale.set(0.02, 0.02, 0.02)
        obj.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            c.castShadow = true
            c.receiveShadow = true
          }
        })
        scene.add(obj)
      },
      undefined,
      (err) => {
        console.warn('GLB secondary load notice:', err)
      }
    )

    // Raycasting for pump selection on click
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      let hitPumpId: string | null = null

      for (const p of PUMPS) {
        const group = pumpGroups[p.id]
        if (group) {
          const hits = raycaster.intersectObjects(group.children, true)
          if (hits.length > 0) {
            hitPumpId = p.id
            break
          }
        }
      }

      if (hitPumpId) {
        setActivePump(hitPumpId)
        onSelectPump?.(hitPumpId)
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    // Animation Loop with screen-coordinate badge projection
    let reqId: number
    let clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      controls.update()

      // Pulse red orb on BA-04
      if (orbMeshes['BA-04']) {
        const scale = 1 + Math.sin(elapsed * 5) * 0.25
        orbMeshes['BA-04'].scale.set(scale, scale, scale)
      }

      // Project 3D positions of pumps to 2D screen coordinates for badges
      const newCoords: Record<string, { x: number; y: number; visible: boolean }> = {}
      const width = container.clientWidth
      const height = container.clientHeight

      PUMPS.forEach((pump) => {
        const wp = new THREE.Vector3(pump.pos[0] - 0.35, pump.pos[1] + 2.5, pump.pos[2] - 0.5)
        wp.project(camera)

        const isBehind = wp.z > 1
        const x = (wp.x * 0.5 + 0.5) * width
        const y = (-(wp.y * 0.5) + 0.5) * height

        newCoords[pump.id] = {
          x,
          y,
          visible: !isBehind && x > 20 && x < width - 20 && y > 20 && y < height - 20,
        }
      })

      // Sump badge position
      const sumpPos = new THREE.Vector3(0, -0.4, 2.2)
      sumpPos.project(camera)
      const sumpBehind = sumpPos.z > 1
      setSumpCoords({
        x: (sumpPos.x * 0.5 + 0.5) * width,
        y: (-(sumpPos.y * 0.5) + 0.5) * height,
        visible: !sumpBehind,
      })

      setScreenCoords(newCoords)
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [onSelectPump])

  return (
    <div className="interior-bombeo-container" ref={mountRef}>
      {/* Top Left Navigation Header (Matching Reference Screenshot) */}
      <div className="bombeo-top-badge glass">
        <button
          className="bombeo-top-back-btn no-border"
          onClick={onClose}
          title="Volver"
          aria-label="Volver"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            marginRight: 6,
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <div className="bombeo-badge-sub">L5 · INTERIOR</div>
          <div className="bombeo-badge-title">
            <Droplets size={16} className="bombeo-badge-icon" />
            <span>Sala de bombeo SB-01</span>
          </div>
        </div>
      </div>

      {/* Top Nexo IA Pill */}
      <button
        className="bombeo-nexo-top-trigger glass"
        onClick={() => onAskNexo?.('¿Cómo mitigar la falla de BA-04 en Sala de bombeo SB-01?')}
        title="Consultar análisis de Nexo IA para esta sala"
      >
        <NexoLogo width={14} height={16} color="#ffffff" />
        <span>Nexo IA: 1 alerta en BA-04</span>
      </button>

      {/* Top Right Close Button */}
      <button
        className="bombeo-close-btn glass"
        onClick={onClose}
        title="Regresar a la mina"
        aria-label="Cerrar vista interior"
      >
        <X size={18} />
      </button>

      {/* In-Scene 3D Badges projected over pumps (Matching Reference Screenshot) */}
      {PUMPS.map((pump) => {
        const coord = screenCoords[pump.id]
        if (!coord || !coord.visible) return null
        const isSelected = activePump === pump.id
        return (
          <div
            key={pump.id}
            className={`bombeo-3d-badge ${pump.status} ${isSelected ? 'selected' : ''}`}
            style={{
              left: `${coord.x}px`,
              top: `${coord.y}px`,
            }}
            onClick={() => {
              setActivePump(pump.id)
              onSelectPump?.(pump.id)
            }}
            title={`Clic para inspeccionar ${pump.name}`}
          >
            <div className="badge-name">{pump.name}</div>
            {pump.status === 'marcha' && (
              <div className="badge-flow">{pump.flow}</div>
            )}
            {pump.status === 'falla' && (
              <div className="badge-alarm">
                <AlertTriangle size={12} />
                <span>ALARMA</span>
              </div>
            )}
          </div>
        )
      })}

      {/* Sump 3D Badge projected at bottom of pit */}
      {sumpCoords.visible && (
        <div
          className="bombeo-3d-sump-badge"
          style={{
            left: `${sumpCoords.x}px`,
            top: `${sumpCoords.y}px`,
          }}
        >
          <span>SUMIDERO 64%</span>
        </div>
      )}

      {/* Bottom Floating Telemetry Strip (Matching Reference Screenshot) */}
      <div className="bombeo-bottom-kpi-strip glass">
        <div className="bombeo-strip-item">
          <Droplets size={15} className="strip-icon cyan" />
          <div className="strip-text">
            <span className="strip-lbl">NIVEL SUMIDERO</span>
            <span className="strip-val">64%</span>
          </div>
        </div>

        <div className="bombeo-strip-divider" />

        <div className="bombeo-strip-item">
          <span className="strip-dot green" />
          <div className="strip-text">
            <span className="strip-lbl">EN MARCHA</span>
            <span className="strip-val">2 / 4</span>
          </div>
        </div>

        <div className="bombeo-strip-divider" />

        <div className="bombeo-strip-item">
          <div className="strip-text">
            <span className="strip-lbl">CAUDAL TOTAL</span>
            <span className="strip-val">152 <small style={{ fontSize: 10, fontWeight: 500 }}>L/s</small></span>
          </div>
        </div>

        <div className="bombeo-strip-divider" />

        <div
          className="bombeo-strip-item clickable"
          onClick={() => onAskNexo?.('¿Por qué está en falla la bomba BA-04?')}
          title="Ver diagnóstico y recomendación con Nexo IA"
        >
          <AlertTriangle size={15} className="strip-icon red" />
          <div className="strip-text">
            <span className="strip-lbl">EN FALLA</span>
            <span className="strip-val red">1</span>
          </div>
          <NexoLogo width={12} height={14} color="#dc2626" />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="bombeo-bottom-hint">
        Arrastra para girar · rueda para acercar · clic en una bomba para inspeccionar
      </div>

      {/* Quick In-Scene Pump Inspection Card when a pump is selected */}
      {activePump && (
        <div className="bombeo-pump-overlay-card glass">
          {(() => {
            const p = PUMPS.find((item) => item.id === activePump)
            if (!p) return null
            return (
              <>
                <div className="overlay-header">
                  <div className="overlay-title-row">
                    <span className="overlay-title">{p.name} · Bomba centrífuga multietapa</span>
                    <span className={`status-pill ${p.status}`}>{p.statusText}</span>
                  </div>
                  <button className="overlay-close" onClick={() => setActivePump(null)}>
                    <X size={15} />
                  </button>
                </div>

                <div className="overlay-metrics-grid">
                  <div className="overlay-metric">
                    <span className="m-label">Caudal</span>
                    <span className="m-val">{p.flow}</span>
                  </div>
                  <div className="overlay-metric">
                    <span className="m-label">Presión desc.</span>
                    <span className="m-val">{p.pressure}</span>
                  </div>
                  <div className="overlay-metric">
                    <span className="m-label">Temperatura</span>
                    <span className="m-val" style={{ color: p.status === 'falla' ? '#ef4444' : undefined }}>{p.temp}</span>
                  </div>
                  <div className="overlay-metric">
                    <span className="m-label">Horas servicio</span>
                    <span className="m-val">{p.hours}</span>
                  </div>
                </div>

                <button
                  className="ask-nexo-btn"
                  onClick={() => onAskNexo?.(`Analiza el estado y telemetría de ${p.name} en la Sala de bombeo SB-01`)}
                >
                  <NexoLogo width={14} height={16} color="#ffffff" />
                  <span>Preguntar a Nexo sobre {p.name}</span>
                </button>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

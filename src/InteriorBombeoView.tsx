import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { X, Sparkles, AlertTriangle, Droplets } from 'lucide-react'
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

    // Scene & Renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x18202c)
    scene.fog = new THREE.FogExp2(0x18202c, 0.02)

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 4.5, 14)

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

    // Ambient & Directional Lighting matching reference screenshot
    const ambLight = new THREE.AmbientLight(0x708090, 1.4)
    scene.add(ambLight)

    const mainDir = new THREE.DirectionalLight(0xdbeafe, 1.6)
    mainDir.position.set(5, 12, 8)
    scene.add(mainDir)

    // Overhead Industrial Lamps with warm illumination
    const lampPositions: [number, number, number][] = [
      [-4, 5.2, -1],
      [4, 5.2, -1],
    ]

    lampPositions.forEach((lPos) => {
      // Chain
      const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 6)
      const chainMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
      const chain = new THREE.Mesh(chainGeo, chainMat)
      chain.position.set(lPos[0], lPos[1] + 1.2, lPos[2])
      scene.add(chain)

      // Lamp Shade Cone
      const coneGeo = new THREE.ConeGeometry(0.7, 0.5, 16, 1, true)
      const coneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide })
      const cone = new THREE.Mesh(coneGeo, coneMat)
      cone.position.set(lPos[0], lPos[1], lPos[2])
      scene.add(cone)

      // Bulb glow
      const bulbGeo = new THREE.SphereGeometry(0.18, 12, 12)
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb })
      const bulb = new THREE.Mesh(bulbGeo, bulbMat)
      bulb.position.set(lPos[0], lPos[1] - 0.1, lPos[2])
      scene.add(bulb)

      const pLight = new THREE.PointLight(0xfff7ed, 2.8, 18, 1.2)
      pLight.position.set(lPos[0], lPos[1] - 0.2, lPos[2])
      scene.add(pLight)
    })

    // Room Geometry: Floor, Back Wall, Sump Pit
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x24303f,
      roughness: 0.85,
      metalness: 0.15,
    })

    // Back Wall
    const wallGeo = new THREE.BoxGeometry(26, 12, 0.4)
    const backWall = new THREE.Mesh(wallGeo, roomMat)
    backWall.position.set(0, 5, -5)
    scene.add(backWall)

    // Side Walls
    const sideWallGeo = new THREE.BoxGeometry(0.4, 12, 20)
    const leftWall = new THREE.Mesh(sideWallGeo, roomMat)
    leftWall.position.set(-13, 5, 2)
    scene.add(leftWall)

    const rightWall = new THREE.Mesh(sideWallGeo, roomMat)
    rightWall.position.set(13, 5, 2)
    scene.add(rightWall)

    // Floor Platform Behind Sump
    const floorGeo = new THREE.BoxGeometry(26, 0.6, 8)
    const floor = new THREE.Mesh(floorGeo, roomMat)
    floor.position.set(0, -0.3, -2)
    scene.add(floor)

    // Front Floor in front of Sump
    const frontFloorGeo = new THREE.BoxGeometry(26, 0.6, 6)
    const frontFloor = new THREE.Mesh(frontFloorGeo, roomMat)
    frontFloor.position.set(0, -0.3, 5.5)
    scene.add(frontFloor)

    // Sump Pit Pit Water (Cyan Translucent Glass)
    const waterGeo = new THREE.BoxGeometry(26, 0.5, 4.5)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75,
    })
    const water = new THREE.Mesh(waterGeo, waterMat)
    water.position.set(0, -0.7, 1.8)
    scene.add(water)

    // Overhead Header Manifold Pipe (spans all 4 pumps horizontally)
    const manifoldGeo = new THREE.CylinderGeometry(0.24, 0.24, 22, 24)
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.7,
      roughness: 0.35,
    })
    const manifold = new THREE.Mesh(manifoldGeo, pipeMat)
    manifold.rotation.z = Math.PI / 2
    manifold.position.set(0, 2.9, -1.2)
    scene.add(manifold)

    // Background Decorative Pipe Fittings (Left & Right)
    const createFlangeCluster = (x: number) => {
      const g = new THREE.Group()
      for (let i = 0; i < 3; i++) {
        const pGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 12)
        const p = new THREE.Mesh(pGeo, pipeMat)
        p.position.set(i * 0.45, 1, -4.2)
        g.add(p)

        const fGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12)
        const f = new THREE.Mesh(fGeo, pipeMat)
        f.position.set(i * 0.45, 1.8, -4.2)
        g.add(f)
      }
      g.position.x = x
      scene.add(g)
    }
    createFlangeCluster(-10)
    createFlangeCluster(9.2)

    // Build 4 Pumping Trains (BA-01, BA-02, BA-03, BA-04)
    const pumpGroups: Record<string, THREE.Group> = {}
    const orbMeshes: Record<string, THREE.Mesh> = {}

    PUMPS.forEach((pump) => {
      const g = new THREE.Group()
      g.position.set(...pump.pos)

      // Concrete Pedestal
      const pedGeo = new THREE.BoxGeometry(2.4, 0.4, 3.2)
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 })
      const ped = new THREE.Mesh(pedGeo, pedMat)
      ped.position.set(0, 0.2, -0.2)
      g.add(ped)

      // Pump Impeller Casing (Vibrant Blue/Cyan Cylinder)
      const casingGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.55, 32)
      const casingMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.4,
        roughness: 0.3,
      })
      const casing = new THREE.Mesh(casingGeo, casingMat)
      casing.rotation.z = Math.PI / 2
      casing.position.set(-0.35, 0.9, -0.2)
      g.add(casing)

      // Electric Motor Cylinder (Dark Gunmetal with heat sink rings)
      const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.4, 24)
      const motorMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.25,
      })
      const motor = new THREE.Mesh(motorGeo, motorMat)
      motor.rotation.z = Math.PI / 2
      motor.position.set(0.65, 0.9, -0.2)
      g.add(motor)

      // Vertical Discharge Pipe going up to overhead manifold
      const vPipeGeo = new THREE.CylinderGeometry(0.16, 0.16, 2.0, 16)
      const vPipe = new THREE.Mesh(vPipeGeo, pipeMat)
      vPipe.position.set(-0.35, 1.9, -0.7)
      g.add(vPipe)

      // Elbow connecting to manifold
      const elbowGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.6, 16)
      const elbow = new THREE.Mesh(elbowGeo, pipeMat)
      elbow.rotation.x = Math.PI / 2
      elbow.position.set(-0.35, 2.9, -0.95)
      g.add(elbow)

      // Forward Suction Pipe extending into sump pit
      const fPipeGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.2, 16)
      const fPipe = new THREE.Mesh(fPipeGeo, pipeMat)
      fPipe.rotation.x = 1.0
      fPipe.position.set(-0.35, 0.3, 0.9)
      g.add(fPipe)

      // Glowing Indicator Orb on Pedestal front
      const orbGeo = new THREE.SphereGeometry(0.14, 16, 16)
      const orbMat = new THREE.MeshBasicMaterial({
        color: pump.color,
      })
      const orb = new THREE.Mesh(orbGeo, orbMat)
      orb.position.set(0, 0.45, 0.8)
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
        <div className="bombeo-badge-sub">L5 · INTERIOR</div>
        <div className="bombeo-badge-title">
          <Droplets size={16} className="bombeo-badge-icon" />
          <span>Sala de bombeo SB-01</span>
        </div>
      </div>

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
                  <Sparkles size={14} />
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

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sliders, Copy, Check, RotateCcw, X, Move, Droplets, Activity, AlertTriangle } from 'lucide-react'
import type { Theme } from './Scene3D'

export interface Pump3D {
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

export interface WorkerData {
  id: string
  name: string
  tag: string
  role: string
  turno: string
  ingreso: string
  zona: string
  velocidad: string
  bateria: string
  ultimoPunto: string
  pos: [number, number, number]
  rotY: number
}

export const PUMPS: Pump3D[] = [
  { id: 'B-01', name: 'B-01', flow: '75 L/s', pressure: '12.4 bar', temp: '62°C', hours: '3120 h', status: 'marcha', color: '#00e676', statusText: 'En marcha', pos: [-6, 0, 0] },
  { id: 'B-02', name: 'B-02', flow: '75 L/s', pressure: '11.9 bar', temp: '59°C', hours: '2870 h', status: 'marcha', color: '#00e676', statusText: 'En marcha', pos: [-2, 0, 0] },
  { id: 'B-03', name: 'B-03', flow: '0 L/s', pressure: '0.0 bar', temp: '24°C', hours: '1490 h', status: 'reserva', color: '#94a3b8', statusText: 'En reserva', pos: [2, 0, 0] },
  { id: 'B-04', name: 'B-04', flow: '0 L/s', pressure: '0.0 bar', temp: '81°C', hours: '4650 h', status: 'falla', color: '#ef4444', statusText: 'Falla', pos: [6, 0, 0] },
]

export const WORKERS_DATA: WorkerData[] = [
  {
    id: 'W-01',
    name: 'Victor Navarro',
    tag: 'Trabajador',
    role: 'Operador',
    turno: 'Turno A (06:00 - 18:00)',
    ingreso: '06:15',
    zona: 'Sala de bombeo SB-01 (L5)',
    velocidad: '4 km/h',
    bateria: '78%',
    ultimoPunto: 'CP-07 (14:22)',
    pos: [-3.8, 0, 3.2],
    rotY: 0.35,
  },
  {
    id: 'W-02',
    name: 'Manuel Reyes',
    tag: 'Trabajador',
    role: 'Operador mecánico',
    turno: 'Turno A (06:00 - 18:00)',
    ingreso: '06:30',
    zona: 'Sala de bombeo SB-01 (L5)',
    velocidad: '3.6 km/h',
    bateria: '92%',
    ultimoPunto: 'CP-05 (14:18)',
    pos: [3.6, 0, 2.6],
    rotY: -0.5,
  },
]

export interface LightingConfig {
  bgColor: string
  fogDensity: number
  floorColor: string
  floorRoughness: number
  floorMetalness: number
  ambientColor: string
  ambientIntensity: number
  hemiSkyColor: string
  hemiGroundColor: string
  hemiIntensity: number
  dirColor: string
  dirIntensity: number
  dirX: number
  dirY: number
  dirZ: number
  fillColor: string
  fillIntensity: number
  lampIntensity: number
  orbEmissiveIntensity: number
  orbColor: string
  shadowRadius: number
  shadowBias: number
  exposure: number
  wallRoughness: number
  pipeRoughness: number
  pipeMetalness: number
  pipeColor: string
}

const DEFAULT_LIGHTING_DARK: LightingConfig = {
  bgColor: '#08111e',
  fogDensity: 0.016,
  floorColor: '#0b1626',
  floorRoughness: 0.82,
  floorMetalness: 0.12,
  ambientColor: '#8da2be',
  ambientIntensity: 1.4,
  hemiSkyColor: '#607d8b',
  hemiGroundColor: '#101827',
  hemiIntensity: 1.1,
  dirColor: '#f8fafc',
  dirIntensity: 1.6,
  dirX: 10,
  dirY: 16,
  dirZ: 12,
  fillColor: '#0284c7',
  fillIntensity: 0.9,
  lampIntensity: 1.5,
  orbEmissiveIntensity: 2.6,
  orbColor: '#10b981',
  shadowRadius: 3.5,
  shadowBias: -0.0005,
  exposure: 1.15,
  wallRoughness: 0.78,
  pipeRoughness: 0.35,
  pipeMetalness: 0.45,
  pipeColor: '#cbd5e1',
}

const DEFAULT_LIGHTING_LIGHT: LightingConfig = {
  bgColor: '#eef2f6',
  fogDensity: 0.022,
  floorColor: '#e2e8f0',
  floorRoughness: 0.8,
  floorMetalness: 0.65,
  ambientColor: '#ffffff',
  ambientIntensity: 1.8,
  hemiSkyColor: '#ffffff',
  hemiGroundColor: '#cbd5e1',
  hemiIntensity: 1.3,
  dirColor: '#ffffff',
  dirIntensity: 4,
  dirX: 10,
  dirY: 16,
  dirZ: 12,
  fillColor: '#38bdf8',
  fillIntensity: 0.8,
  lampIntensity: 1.8,
  orbEmissiveIntensity: 1.8,
  orbColor: '#10b981',
  shadowRadius: 4.0,
  shadowBias: -0.0005,
  exposure: 0.7,
  wallRoughness: 0.65,
  pipeRoughness: 0.3,
  pipeMetalness: 0.15,
  pipeColor: '#ffffff',
}

interface Props {
  roomId?: string | null
  theme?: Theme
  onClose?: () => void
  selectedPumpId?: string | null
  onSelectPump?: (id: string) => void
  onSelectWorker?: (worker: WorkerData) => void
  onAskNexo?: (query: string) => void
  onHelp?: (info: { title: string; desc: string } | null) => void
}

/**
 * Creates a procedural 3D construction worker figure matching reference screenshot.
 * Features yellow hard hat, flesh head, high-vis orange vest, dark pants & boots in walking step pose.
 */
function createConstructionWorker(worker: WorkerData): THREE.Group {
  const g = new THREE.Group()
  g.position.set(...worker.pos)
  g.rotation.y = worker.rotY
  g.userData = { isWorker: true, workerId: worker.id, workerData: worker }

  // 1. Hard Hat (Yellow with wide brim matching reference screenshot)
  const hatColor = 0xf59e0b
  const hatMat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.35, metalness: 0.1 })
  const hatDome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hatMat)
  hatDome.position.set(0, 1.52, 0)
  g.add(hatDome)

  const brimGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.035, 24)
  const brim = new THREE.Mesh(brimGeo, hatMat)
  brim.position.set(0, 1.50, 0)
  g.add(brim)

  // 2. Head (Flesh tone)
  const headMat = new THREE.MeshStandardMaterial({ color: 0xf5cba7, roughness: 0.6 })
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 20), headMat)
  head.position.set(0, 1.42, 0)
  g.add(head)

  // 3. Torso / High-Vis Safety Vest (Orange with silver reflective horizontal bands)
  const vestMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 })
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.23, 0.62, 20), vestMat)
  torso.position.set(0, 0.98, 0)
  g.add(torso)

  // Silver reflective stripes
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.5 })
  const stripeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.265, 0.06, 20), stripeMat)
  stripeTop.position.set(0, 1.08, 0)
  g.add(stripeTop)

  const stripeMid = new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.255, 0.06, 20), stripeMat)
  stripeMid.position.set(0, 0.92, 0)
  g.add(stripeMid)

  // Waist belt
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 20), beltMat)
  belt.position.set(0, 0.66, 0)
  g.add(belt)

  // 4. Arms (Walking swing pose)
  const armGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.52, 12)
  const handMat = headMat

  // Left arm forward
  const leftArmGroup = new THREE.Group()
  leftArmGroup.position.set(-0.32, 1.15, 0)
  leftArmGroup.rotation.x = -0.35
  const leftArm = new THREE.Mesh(armGeo, vestMat)
  leftArm.position.set(0, -0.22, 0)
  leftArmGroup.add(leftArm)
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), handMat)
  leftHand.position.set(0, -0.48, 0)
  leftArmGroup.add(leftHand)
  g.add(leftArmGroup)

  // Right arm back
  const rightArmGroup = new THREE.Group()
  rightArmGroup.position.set(0.32, 1.15, 0)
  rightArmGroup.rotation.x = 0.35
  const rightArm = new THREE.Mesh(armGeo, vestMat)
  rightArm.position.set(0, -0.22, 0)
  rightArmGroup.add(rightArm)
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), handMat)
  rightHand.position.set(0, -0.48, 0)
  rightArmGroup.add(rightHand)
  g.add(rightArmGroup)

  // 5. Legs (Navy blue trousers in natural walking step pose)
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
  const legGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.62, 14)

  // Left leg forward
  const leftLegGroup = new THREE.Group()
  leftLegGroup.position.set(-0.13, 0.62, 0)
  leftLegGroup.rotation.x = 0.32
  const leftLeg = new THREE.Mesh(legGeo, pantsMat)
  leftLeg.position.set(0, -0.28, 0)
  leftLegGroup.add(leftLeg)
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 })
  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), bootMat)
  leftBoot.position.set(0, -0.58, 0.04)
  leftLegGroup.add(leftBoot)
  g.add(leftLegGroup)

  // Right leg back
  const rightLegGroup = new THREE.Group()
  rightLegGroup.position.set(0.13, 0.62, 0)
  rightLegGroup.rotation.x = -0.32
  const rightLeg = new THREE.Mesh(legGeo, pantsMat)
  rightLeg.position.set(0, -0.28, 0)
  rightLegGroup.add(rightLeg)
  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), bootMat)
  rightBoot.position.set(0, -0.58, 0.04)
  rightLegGroup.add(rightBoot)
  g.add(rightLegGroup)

  return g
}

export default function InteriorBombeoView({
  theme = 'light',
  onClose: _onClose,
  selectedPumpId,
  onSelectPump,
  onSelectWorker,
  onHelp,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [activePump, setActivePump] = useState<string | null>(selectedPumpId || null)
  const [activeWorkerId, setActiveWorkerId] = useState<string | null>(null)
  const [selectedSump, setSelectedSump] = useState<boolean>(false)
  const [screenCoords, setScreenCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({})
  const [workerCoords, setWorkerCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({})
  const [sumpCoord, setSumpCoord] = useState<{ x: number; y: number; visible: boolean } | null>(null)

  // Draggable lighting editor state
  const isDark = theme === 'dark'
  const [editorOpen, setEditorOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cfg, setCfg] = useState<LightingConfig>(isDark ? DEFAULT_LIGHTING_DARK : DEFAULT_LIGHTING_LIGHT)
  const [editorPos, setEditorPos] = useState({ x: 20, y: 120 })
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    origX: 20,
    origY: 120,
  })

  // Three.js object references for real-time live updates
  const sceneRef = useRef<THREE.Scene | null>(null)
  const ambLightRef = useRef<THREE.AmbientLight | null>(null)
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null)
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null)
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null)
  const floorMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const clayMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const orbLightsRef = useRef<{ light: THREE.PointLight; pump: Pump3D }[]>([])
  const orbMaterialsRef = useRef<{ mat: THREE.MeshStandardMaterial; haloMat: THREE.MeshBasicMaterial; pump: Pump3D }[]>([])
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (selectedPumpId) setActivePump(selectedPumpId)
  }, [selectedPumpId])

  // Update theme defaults when theme prop changes
  useEffect(() => {
    setCfg(theme === 'dark' ? DEFAULT_LIGHTING_DARK : DEFAULT_LIGHTING_LIGHT)
  }, [theme])

  // Live update Three.js scene when config changes
  useEffect(() => {
    if (!sceneRef.current) return
    const sc = sceneRef.current

    // Background & Fog
    const bgCol = new THREE.Color(cfg.bgColor)
    sc.background = bgCol
    if (sc.fog) {
      sc.fog.color = bgCol
      ;(sc.fog as THREE.FogExp2).density = cfg.fogDensity
    }

    // Floor Material
    if (floorMatRef.current) {
      floorMatRef.current.color = new THREE.Color(cfg.floorColor)
      floorMatRef.current.roughness = cfg.floorRoughness
      floorMatRef.current.metalness = cfg.floorMetalness
    }

    // Pipe Clay Material
    if (clayMatRef.current) {
      clayMatRef.current.color = new THREE.Color(cfg.pipeColor)
      clayMatRef.current.roughness = cfg.pipeRoughness
      clayMatRef.current.metalness = cfg.pipeMetalness
    }

    // Lights
    if (ambLightRef.current) {
      ambLightRef.current.color = new THREE.Color(cfg.ambientColor)
      ambLightRef.current.intensity = cfg.ambientIntensity
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color = new THREE.Color(cfg.hemiSkyColor)
      hemiLightRef.current.groundColor = new THREE.Color(cfg.hemiGroundColor)
      hemiLightRef.current.intensity = cfg.hemiIntensity
    }
    if (dirLightRef.current) {
      dirLightRef.current.color = new THREE.Color(cfg.dirColor)
      dirLightRef.current.intensity = cfg.dirIntensity
      dirLightRef.current.position.set(cfg.dirX, cfg.dirY, cfg.dirZ)
      if (dirLightRef.current.shadow) {
        dirLightRef.current.shadow.radius = cfg.shadowRadius
        dirLightRef.current.shadow.bias = cfg.shadowBias
      }
    }
    if (fillLightRef.current) {
      fillLightRef.current.color = new THREE.Color(cfg.fillColor)
      fillLightRef.current.intensity = cfg.fillIntensity
    }

    // Pump Indicator Lights & Emissive Orbs
    orbLightsRef.current.forEach(({ light, pump }) => {
      light.intensity = cfg.lampIntensity
      const c = pump.status === 'marcha' ? cfg.orbColor : pump.color
      light.color.set(c)
    })
    orbMaterialsRef.current.forEach(({ mat, haloMat, pump }) => {
      const c = pump.status === 'marcha' ? cfg.orbColor : pump.color
      mat.color.set(c)
      mat.emissive.set(c)
      mat.emissiveIntensity = cfg.orbEmissiveIntensity
      haloMat.color.set(c)
    })
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = cfg.exposure
    }
  }, [cfg])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const bgCol = new THREE.Color(cfg.bgColor)
    scene.background = bgCol
    scene.fog = new THREE.FogExp2(bgCol, cfg.fogDensity)

    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 150)
    camera.position.set(0, 3.8, 12.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    rendererRef.current = renderer
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = cfg.exposure
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.target.set(0, 1.3, -0.2)
    controls.maxPolarAngle = Math.PI / 2 - 0.01 // Never dip below floor
    controls.minDistance = 4
    controls.maxDistance = 28

    // Lighting
    const ambLight = new THREE.AmbientLight(cfg.ambientColor, cfg.ambientIntensity)
    scene.add(ambLight)
    ambLightRef.current = ambLight

    const hemiLight = new THREE.HemisphereLight(cfg.hemiSkyColor, cfg.hemiGroundColor, cfg.hemiIntensity)
    scene.add(hemiLight)
    hemiLightRef.current = hemiLight

    const mainDir = new THREE.DirectionalLight(cfg.dirColor, cfg.dirIntensity)
    mainDir.position.set(cfg.dirX, cfg.dirY, cfg.dirZ)
    mainDir.castShadow = true
    mainDir.shadow.mapSize.width = 2048
    mainDir.shadow.mapSize.height = 2048
    mainDir.shadow.camera.near = 0.5
    mainDir.shadow.camera.far = 40
    mainDir.shadow.camera.left = -16
    mainDir.shadow.camera.right = 16
    mainDir.shadow.camera.top = 16
    mainDir.shadow.camera.bottom = -16
    mainDir.shadow.bias = cfg.shadowBias
    mainDir.shadow.radius = cfg.shadowRadius
    scene.add(mainDir)
    dirLightRef.current = mainDir

    const fillDir = new THREE.DirectionalLight(cfg.fillColor, cfg.fillIntensity)
    fillDir.position.set(-12, 10, -6)
    scene.add(fillDir)
    fillLightRef.current = fillDir

    // 1. INFINITE FLOOR (No back walls or studio enclosure)
    const floorGeo = new THREE.PlaneGeometry(160, 160, 32, 32)
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.floorColor),
      roughness: cfg.floorRoughness,
      metalness: cfg.floorMetalness,
    })
    floorMatRef.current = floorMat
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0
    floor.receiveShadow = true
    scene.add(floor)

    // Subtle floor safety demarcation yellow guide line
    const lineGeo = new THREE.PlaneGeometry(28, 0.12)
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    const guideLine = new THREE.Mesh(lineGeo, lineMat)
    guideLine.rotation.x = -Math.PI / 2
    guideLine.position.set(0, 0.005, 1.8)
    scene.add(guideLine)

    // 2. PIPE CLAY MATERIAL
    const clayMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.pipeColor),
      roughness: 0.42,
      metalness: 0.06,
    })
    clayMatRef.current = clayMat

    // Overhead Header Manifold Pipe (spans all 4 pumps horizontally)
    const manifoldGeo = new THREE.CylinderGeometry(0.32, 0.32, 22, 32)
    const manifold = new THREE.Mesh(manifoldGeo, clayMat)
    manifold.rotation.z = Math.PI / 2
    manifold.position.set(0, 3.2, -1.2)
    manifold.castShadow = true
    scene.add(manifold)

    // 3. BUILD 4 PUMP TRAINS
    const pumpGroups: Record<string, THREE.Group> = {}
    orbLightsRef.current = []
    orbMaterialsRef.current = []

    PUMPS.forEach((pump, pIdx) => {
      const g = new THREE.Group()
      g.position.set(...pump.pos)
      g.userData = { isPump: true, pumpId: pump.id }

      // Concrete Pedestal
      const pedGeo = new THREE.BoxGeometry(2.5, 0.42, 3.4)
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75 })
      const ped = new THREE.Mesh(pedGeo, pedMat)
      ped.position.set(0, 0.21, -0.2)
      ped.castShadow = true
      ped.receiveShadow = true
      g.add(ped)

      // Pump Impeller Casing (Off-white clay)
      const casingGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.65, 32)
      const casing = new THREE.Mesh(casingGeo, clayMat)
      casing.rotation.z = Math.PI / 2
      casing.position.set(-0.35, 1.0, -0.2)
      casing.castShadow = true
      g.add(casing)

      // Casing Flange Ring
      const ringGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.1, 32)
      const ring = new THREE.Mesh(ringGeo, clayMat)
      ring.rotation.z = Math.PI / 2
      ring.position.set(-0.65, 1.0, -0.2)
      ring.castShadow = true
      g.add(ring)

      // Electric Motor Cylinder: BA-02 has electric blue casing
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
      motor.castShadow = true
      g.add(motor)

      // Vertical Discharge Pipe going up to overhead manifold
      const vPipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 24)
      const vPipe = new THREE.Mesh(vPipeGeo, clayMat)
      vPipe.position.set(-0.35, 2.1, -0.8)
      vPipe.castShadow = true
      g.add(vPipe)

      // Forward Suction Pipe extending into sump area
      const fPipeGeo = new THREE.CylinderGeometry(0.22, 0.22, 3.4, 24)
      const fPipe = new THREE.Mesh(fPipeGeo, clayMat)
      fPipe.rotation.x = 1.0
      fPipe.position.set(-0.35, 0.35, 1.0)
      fPipe.castShadow = true
      g.add(fPipe)

      // Elevated Mounting Stand for Indicator Orb (prevents clipping with pipes & makes color fully visible)
      const activeColor = pump.status === 'marcha' ? cfg.orbColor : pump.color
      const postGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.46, 16)
      const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 })
      const post = new THREE.Mesh(postGeo, postMat)
      post.position.set(0, 0.65, 1.25)
      post.castShadow = true
      g.add(post)

      const collarGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 24)
      const collar = new THREE.Mesh(collarGeo, postMat)
      collar.position.set(0, 0.88, 1.25)
      collar.castShadow = true
      g.add(collar)

      // Glowing Indicator Orb elevated above pedestal and suction pipe
      const orbGeo = new THREE.SphereGeometry(0.16, 28, 28)
      const orbMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        emissive: new THREE.Color(activeColor),
        emissiveIntensity: cfg.orbEmissiveIntensity,
        roughness: 0.25,
        metalness: 0.05,
      })
      const orb = new THREE.Mesh(orbGeo, orbMat)
      orb.position.set(0, 0.98, 1.25)
      g.add(orb)

      // Translucent luminous bloom halo around the glowing orb
      const haloGeo = new THREE.SphereGeometry(0.25, 20, 20)
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(activeColor),
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      })
      const halo = new THREE.Mesh(haloGeo, haloMat)
      halo.position.set(0, 0.98, 1.25)
      g.add(halo)

      orbMaterialsRef.current.push({ mat: orbMat, haloMat, pump })

      // Local Point Light from the Orb
      const orbLight = new THREE.PointLight(activeColor, cfg.lampIntensity, 4.5)
      orbLight.position.set(0, 1.05, 1.25)
      g.add(orbLight)
      orbLightsRef.current.push({ light: orbLight, pump })

      pumpGroups[pump.id] = g
      scene.add(g)
    })

    // 4. ADD CONSTRUCTION WORKERS (Procedural Figures walking on the floor)
    const workerGroups: Record<string, THREE.Group> = {}
    WORKERS_DATA.forEach((w) => {
      const wg = createConstructionWorker(w)
      workerGroups[w.id] = wg
      scene.add(wg)
    })

    // 5. CONCRETE SUMP PIT & WATER SURFACE (Sumidero 85%)
    const sumpGroup = new THREE.Group()
    sumpGroup.position.set(4.6, 0, 2.6)
    const pitGeo = new THREE.BoxGeometry(3.2, 0.45, 2.8)
    const pitMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, metalness: 0.1 })
    const pitMesh = new THREE.Mesh(pitGeo, pitMat)
    pitMesh.position.set(0, 0.22, 0)
    pitMesh.receiveShadow = true
    sumpGroup.add(pitMesh)

    const waterGeo = new THREE.PlaneGeometry(2.9, 2.5)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.5,
      transparent: true,
      opacity: 0.85,
    })
    const waterMesh = new THREE.Mesh(waterGeo, waterMat)
    waterMesh.rotation.x = -Math.PI / 2
    waterMesh.position.set(0, 0.44, 0)
    sumpGroup.add(waterMesh)
    scene.add(sumpGroup)

    // Raycasting for pump & worker selection on click
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (evt: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(scene.children, true)
      if (intersects.length > 0) {
        // Check for worker hit first
        let cur: THREE.Object3D | null = intersects[0].object
        while (cur && cur !== scene) {
          if (cur.userData?.isWorker) {
            onSelectWorker?.(cur.userData.workerData)
            return
          }
          if (cur.userData?.isPump) {
            setActivePump(cur.userData.pumpId)
            onSelectPump?.(cur.userData.pumpId)
            return
          }
          cur = cur.parent
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    // Animation & Screen Coordinates Projection Loop
    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()

      const width = container.clientWidth
      const height = container.clientHeight

      // Project pump badge positions
      const newCoords: Record<string, { x: number; y: number; visible: boolean }> = {}
      PUMPS.forEach((pump) => {
        const wp = new THREE.Vector3(pump.pos[0] - 0.35, 2.7, pump.pos[2] - 0.2)
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
      setScreenCoords(newCoords)

      // Project worker badge positions
      const newWorkerCoords: Record<string, { x: number; y: number; visible: boolean }> = {}
      WORKERS_DATA.forEach((w) => {
        const wp = new THREE.Vector3(w.pos[0], 2.1, w.pos[2])
        wp.project(camera)
        const isBehind = wp.z > 1
        const x = (wp.x * 0.5 + 0.5) * width
        const y = (-(wp.y * 0.5) + 0.5) * height
        newWorkerCoords[w.id] = {
          x,
          y,
          visible: !isBehind && x > 20 && x < width - 20 && y > 20 && y < height - 20,
        }
      })
      setWorkerCoords(newWorkerCoords)

      // Project sump badge position (above sump pit at [4.6, 0.8, 2.6])
      const sumpWp = new THREE.Vector3(4.6, 0.9, 2.6)
      sumpWp.project(camera)
      const isBehindSump = sumpWp.z > 1
      const sx = (sumpWp.x * 0.5 + 0.5) * width
      const sy = (-(sumpWp.y * 0.5) + 0.5) * height
      setSumpCoord({
        x: sx,
        y: sy,
        visible: !isBehindSump && sx > 20 && sx < width - 20 && sy > 20 && sy < height - 20,
      })

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
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [theme])

  // Dragging logic for floating lighting editor
  const handleDragStart = (e: React.MouseEvent) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: editorPos.x,
      origY: editorPos.y,
    }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current.isDragging) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      setEditorPos({
        x: Math.max(10, Math.min(window.innerWidth - 320, dragRef.current.origX + dx)),
        y: Math.max(70, Math.min(window.innerHeight - 300, dragRef.current.origY + dy)),
      })
    }

    const onMouseUp = () => {
      dragRef.current.isDragging = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="interior-bombeo-container" ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 1. In-Scene 3D Badges projected over pumps (image 2) */}
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
              cursor: 'pointer',
            }}
            onClick={() => {
              setActivePump(pump.id)
              setActiveWorkerId(null)
              setSelectedSump(false)
              onSelectPump?.(pump.id)
            }}
            onMouseEnter={() => onHelp?.({
              title: `Bomba ${pump.name.toUpperCase()}`,
              desc: `Estado: ${pump.status === 'marcha' ? 'En marcha' : pump.status === 'reserva' ? 'En reserva' : 'En falla'} · Caudal: ${pump.flow} · Clic para ver telemetría`,
            })}
            onMouseLeave={() => onHelp?.(null)}
          >
            <div className="bombeo-badge-top-box">
              <span className={`callout-dot ${pump.status === 'marcha' ? 'green' : pump.status === 'reserva' ? 'yellow' : 'red'}`} />
              <span>{pump.name.toUpperCase()}</span>
            </div>
            {pump.status === 'marcha' && (
              <div className="bombeo-badge-bottom-box">{pump.flow}</div>
            )}
            {pump.status === 'reserva' && (
              <div className="bombeo-badge-bottom-box reserva">Reserva</div>
            )}
            {pump.status === 'falla' && (
              <div className="bombeo-badge-bottom-box falla">
                <span>Falla</span>
              </div>
            )}
          </div>
        )
      })}

      {/* Sump 3D Badge */}
      {sumpCoord && sumpCoord.visible && (
        <div
          className={`bombeo-3d-sump-badge ${selectedSump ? 'selected' : ''}`}
          style={{
            left: `${sumpCoord.x}px`,
            top: `${sumpCoord.y}px`,
            cursor: 'pointer',
          }}
          onClick={() => {
            setSelectedSump(!selectedSump)
            setActivePump(null)
            setActiveWorkerId(null)
          }}
          onMouseEnter={() => onHelp?.({
            title: 'Sumidero L5',
            desc: 'Cárcamo colector de drenaje minero · Nivel actual: 64% · Clic para inspeccionar',
          })}
          onMouseLeave={() => onHelp?.(null)}
          title="Clic para seleccionar sumidero"
        >
          <span className="callout-dot cyan" />
          <span>SUMIDERO 64%</span>
        </div>
      )}

      {/* 2. In-Scene 3D Badges projected over Construction Workers */}
      {WORKERS_DATA.map((w) => {
        const coord = workerCoords[w.id]
        if (!coord || !coord.visible) return null
        const isWorkerSelected = activeWorkerId === w.id

        return (
          <div
            key={w.id}
            className={`bombeo-worker-3d-badge ${isWorkerSelected ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 15,
            }}
            onClick={() => {
              setActiveWorkerId(w.id)
              setActivePump(null)
              setSelectedSump(false)
              onSelectWorker?.(w)
            }}
            onMouseEnter={() => onHelp?.({
              title: w.name,
              desc: `${w.role} · ${w.tag} · Personal activo en sala de bombeo`,
            })}
            onMouseLeave={() => onHelp?.(null)}
            title={`Clic para ver telemetría de ${w.name}`}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="callout-dot green" />
              <span>{w.name.toUpperCase()}</span>
            </div>
          </div>
        )
      })}

      {/* Bottom KPI strip */}
      <div className="bombeo-bottom-kpi-strip glass">
        <div
          className="bombeo-strip-item"
          onMouseEnter={() => onHelp?.({
            title: 'Nivel Sumidero',
            desc: 'Capacidad volumétrica actual del cárcamo colector: 64%',
          })}
          onMouseLeave={() => onHelp?.(null)}
        >
          <Droplets size={16} style={{ color: '#00b0ff' }} />
          <div className="strip-text">
            <span className="strip-lbl">NIVEL SUMIDERO</span>
            <span className="strip-val" style={{ color: '#0284c7' }}>64%</span>
          </div>
        </div>
        <div className="bombeo-strip-divider" />
        <div
          className="bombeo-strip-item"
          onMouseEnter={() => onHelp?.({
            title: 'Bombas en marcha',
            desc: '2 de 4 bombas activas desaguando la mina',
          })}
          onMouseLeave={() => onHelp?.(null)}
        >
          <span className="strip-dot green" />
          <div className="strip-text">
            <span className="strip-lbl">EN MARCHA</span>
            <span className="strip-val" style={{ color: '#00e676' }}>2 / 4</span>
          </div>
        </div>
        <div className="bombeo-strip-divider" />
        <div
          className="bombeo-strip-item"
          onMouseEnter={() => onHelp?.({
            title: 'Caudal Total',
            desc: 'Caudal de desagüe combinado en tiempo real: 150 L/s',
          })}
          onMouseLeave={() => onHelp?.(null)}
        >
          <Activity size={16} style={{ color: '#00b0ff' }} />
          <div className="strip-text">
            <span className="strip-lbl">CAUDAL TOTAL</span>
            <span className="strip-val">150 L/s</span>
          </div>
        </div>
        <div className="bombeo-strip-divider" />
        <div
          className="bombeo-strip-item clickable"
          onClick={() => onSelectPump?.('B-04')}
          onMouseEnter={() => onHelp?.({
            title: 'Bombas en falla',
            desc: '1 bomba en estado de falla (B-04 por sobrecalentamiento). Clic para ver detalle.',
          })}
          onMouseLeave={() => onHelp?.(null)}
        >
          <AlertTriangle size={16} style={{ color: '#ef4444' }} />
          <div className="strip-text">
            <span className="strip-lbl">EN FALLA</span>
            <span className="strip-val" style={{ color: '#ef4444' }}>1</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom-Left Trigger for Lighting & Color Editor */}
      {!editorOpen && (
        <button
          className="glass lighting-editor-trigger"
          onClick={() => setEditorOpen(true)}
          onMouseEnter={() => onHelp?.({
            title: 'Ajustar Iluminación',
            desc: 'Personaliza fuentes de luz, focos y materiales del recinto interior',
          })}
          onMouseLeave={() => onHelp?.(null)}
          style={{
            position: 'absolute',
            bottom: 94,
            left: 24,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid var(--line)',
            background: 'var(--panel-bg)',
            color: 'var(--text)',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
          }}
          title="Abrir editor de iluminación y render de la sala"
        >
          <Sliders size={16} />
          <span>Ajustar Iluminación</span>
        </button>
      )}

      {/* 4. Draggable Floating Lighting & Color Editor Window */}
      {editorOpen && (
        <div
          className="glass lighting-editor-window"
          style={{
            position: 'absolute',
            left: `${editorPos.x}px`,
            top: `${editorPos.y}px`,
            width: 310,
            maxHeight: 'calc(100vh - 140px)',
            zIndex: 60,
            borderRadius: 14,
            border: '1px solid var(--line)',
            background: 'var(--panel-bg)',
            color: 'var(--text)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Draggable Header */}
          <div
            onMouseDown={handleDragStart}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'grab',
              background: 'rgba(0,0,0,0.04)',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
              <Move size={14} style={{ color: 'var(--muted)' }} />
              <span>Iluminación & Render</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                className="icon-btn"
                onClick={copyConfig}
                title="Copiar configuración JSON"
                style={{ width: 26, height: 26 }}
              >
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              </button>
              <button
                className="icon-btn"
                onClick={() => setCfg(theme === 'dark' ? DEFAULT_LIGHTING_DARK : DEFAULT_LIGHTING_LIGHT)}
                title="Restablecer valores"
                style={{ width: 26, height: 26 }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setEditorOpen(false)}
                title="Cerrar editor"
                style={{ width: 26, height: 26 }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Controls Body */}
          <div style={{ padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Presets */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Presets Rápidos
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  className="user-action-btn"
                  style={{ padding: '6px 8px', fontSize: 11 }}
                  onClick={() =>
                    setCfg({
                      ...cfg,
                      bgColor: '#08111e',
                      floorColor: '#0b1626',
                      ambientIntensity: 1.4,
                      dirColor: '#f8fafc',
                      dirIntensity: 1.6,
                      fillColor: '#0284c7',
                    })
                  }
                >
                  Subterráneo Frío
                </button>
                <button
                  className="user-action-btn"
                  style={{ padding: '6px 8px', fontSize: 11 }}
                  onClick={() =>
                    setCfg({
                      ...cfg,
                      bgColor: '#141414',
                      floorColor: '#1c1917',
                      ambientIntensity: 1.2,
                      dirColor: '#fef08a',
                      dirIntensity: 1.8,
                      fillColor: '#f97316',
                    })
                  }
                >
                  Mina Cálida
                </button>
                <button
                  className="user-action-btn"
                  style={{ padding: '6px 8px', fontSize: 11 }}
                  onClick={() =>
                    setCfg({
                      ...cfg,
                      bgColor: '#111827',
                      floorColor: '#1f2937',
                      ambientIntensity: 1.6,
                      dirColor: '#ffffff',
                      dirIntensity: 1.5,
                      fillColor: '#38bdf8',
                    })
                  }
                >
                  Estudio Neutro
                </button>
                <button
                  className="user-action-btn"
                  style={{ padding: '6px 8px', fontSize: 11 }}
                  onClick={() =>
                    setCfg({
                      ...cfg,
                      bgColor: '#030712',
                      floorColor: '#090d16',
                      ambientIntensity: 0.9,
                      dirColor: '#e2e8f0',
                      dirIntensity: 1.2,
                      fillColor: '#0369a1',
                      fogDensity: 0.024,
                    })
                  }
                >
                  Oscuro Dramático
                </button>
              </div>
            </div>

            {/* Background & Fog */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Fondo & Niebla
              </div>
              <div className="row between" style={{ marginBottom: 6, fontSize: 12 }}>
                <span>Color fondo</span>
                <input
                  type="color"
                  value={cfg.bgColor}
                  onChange={(e) => setCfg({ ...cfg, bgColor: e.target.value })}
                  style={{ width: 28, height: 24, border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
              <div style={{ fontSize: 12 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Densidad niebla</span>
                  <b>{(cfg.fogDensity * 1000).toFixed(1)}</b>
                </div>
                <input
                  type="range"
                  min={0.002}
                  max={0.05}
                  step={0.002}
                  value={cfg.fogDensity}
                  onChange={(e) => setCfg({ ...cfg, fogDensity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Infinite Floor */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Piso Infinito
              </div>
              <div className="row between" style={{ marginBottom: 6, fontSize: 12 }}>
                <span>Color piso</span>
                <input
                  type="color"
                  value={cfg.floorColor}
                  onChange={(e) => setCfg({ ...cfg, floorColor: e.target.value })}
                  style={{ width: 28, height: 24, border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Rugosidad</span>
                  <b>{cfg.floorRoughness.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={cfg.floorRoughness}
                  onChange={(e) => setCfg({ ...cfg, floorRoughness: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Metalicidad</span>
                  <b>{cfg.floorMetalness.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={0.8}
                  step={0.05}
                  value={cfg.floorMetalness}
                  onChange={(e) => setCfg({ ...cfg, floorMetalness: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Lighting Intensities */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Luces & Reflejos
              </div>
              <div className="row between" style={{ marginBottom: 6, fontSize: 12 }}>
                <span>Color Luz Principal</span>
                <input
                  type="color"
                  value={cfg.dirColor}
                  onChange={(e) => setCfg({ ...cfg, dirColor: e.target.value })}
                  style={{ width: 28, height: 24, border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Luz Principal (Intensidad)</span>
                  <b>{cfg.dirIntensity.toFixed(1)}</b>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={4.0}
                  step={0.1}
                  value={cfg.dirIntensity}
                  onChange={(e) => setCfg({ ...cfg, dirIntensity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Luz Ambiente</span>
                  <b>{cfg.ambientIntensity.toFixed(1)}</b>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={3.0}
                  step={0.1}
                  value={cfg.ambientIntensity}
                  onChange={(e) => setCfg({ ...cfg, ambientIntensity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Luz de Bombas / Lámparas</span>
                  <b>{cfg.lampIntensity.toFixed(1)}</b>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={4.0}
                  step={0.2}
                  value={cfg.lampIntensity}
                  onChange={(e) => setCfg({ ...cfg, lampIntensity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Sombras & Desenfoque */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Sombras &amp; Desenfoque
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Desenfoque de Sombra (Blur)</span>
                  <b>{cfg.shadowRadius.toFixed(1)} px</b>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={10.0}
                  step={0.2}
                  value={cfg.shadowRadius}
                  onChange={(e) => setCfg({ ...cfg, shadowRadius: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Sesgo de Sombra (Bias)</span>
                  <b>{cfg.shadowBias.toFixed(4)}</b>
                </div>
                <input
                  type="range"
                  min={-0.002}
                  max={0.002}
                  step={0.0002}
                  value={cfg.shadowBias}
                  onChange={(e) => setCfg({ ...cfg, shadowBias: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Bolitas Luminosas & Exposición */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Bolitas Luminosas &amp; Exposición
              </div>
              <div className="row between" style={{ marginBottom: 6, fontSize: 12 }}>
                <span>Color Material Bolita (Marcha)</span>
                <input
                  type="color"
                  value={cfg.orbColor}
                  onChange={(e) => setCfg({ ...cfg, orbColor: e.target.value })}
                  style={{ width: 28, height: 24, border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Luminosidad Bolitas (Material Emissive)</span>
                  <b>{cfg.orbEmissiveIntensity.toFixed(1)}</b>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={6.0}
                  step={0.1}
                  value={cfg.orbEmissiveIntensity}
                  onChange={(e) => setCfg({ ...cfg, orbEmissiveIntensity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Luz Local de Bombas (Point Light)</span>
                  <b>{cfg.lampIntensity.toFixed(1)}</b>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={4.0}
                  step={0.2}
                  value={cfg.lampIntensity}
                  onChange={(e) => setCfg({ ...cfg, lampIntensity: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Exposición Render</span>
                  <b>{cfg.exposure.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={2.5}
                  step={0.05}
                  value={cfg.exposure}
                  onChange={(e) => setCfg({ ...cfg, exposure: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 12 }}>
                <div className="row between" style={{ color: 'var(--muted)', marginBottom: 2 }}>
                  <span>Metalicidad de Tuberías</span>
                  <b>{cfg.pipeMetalness.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={cfg.pipeMetalness}
                  onChange={(e) => setCfg({ ...cfg, pipeMetalness: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Piping Clay Tint */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div className="row between" style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>Tonalidad Tuberías</span>
                <input
                  type="color"
                  value={cfg.pipeColor}
                  onChange={(e) => setCfg({ ...cfg, pipeColor: e.target.value })}
                  style={{ width: 28, height: 24, border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Copy Configuration Button */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 4 }}>
              <button
                className="user-action-btn full"
                onClick={copyConfig}
                style={{
                  height: 36,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.06)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                }}
              >
                {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                <span>{copied ? '¡Configuración copiada!' : 'Copiar configuración'}</span>
              </button>
              <small style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 6, textAlign: 'center' }}>
                Copia los parámetros JSON para aplicarlos por defecto.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

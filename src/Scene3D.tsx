import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export type ViewMode = 'perspective' | 'isometric' | 'top'
export type Theme = 'dark' | 'light'

interface Props {
  mode: ViewMode
  zoom: number
  theme: Theme
  onZoomChange?: (newZoom: number) => void
}

const PALETTE = {
  dark: { bg: 0x0a1c30, floor: 0x0a1c30, fine: 0x0d2842, coarse: 0x071728, fineOp: 0.14, coarseOp: 0.24 },
  light: { bg: 0xdfe7ef, floor: 0xdfe7ef, fine: 0xd5dee8, coarse: 0xc2cdd9, fineOp: 0.30, coarseOp: 0.48 },
}

export default function Scene3D({ mode, zoom, theme, onZoomChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({ mode, zoom, theme, onZoomChange })
  state.current = { mode, zoom, theme, onZoomChange }
  const matsRef = useRef<{
    scene: THREE.Scene
    floorMat: THREE.MeshBasicMaterial
    fineMat: THREE.LineBasicMaterial
    coarseMat: THREE.LineBasicMaterial
  } | null>(null)

  useEffect(() => {
    const el = ref.current!
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const p = PALETTE[state.current.theme]
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(p.bg)
    scene.fog = new THREE.Fog(p.bg, 70, 320)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)

    const fine = new THREE.GridHelper(800, 400, p.fine, p.fine)
    const coarse = new THREE.GridHelper(800, 80, p.coarse, p.coarse)
    coarse.position.y = 0.01
    const fineMat = fine.material as THREE.LineBasicMaterial
    const coarseMat = coarse.material as THREE.LineBasicMaterial
    fineMat.transparent = true
    coarseMat.transparent = true
    fineMat.opacity = p.fineOp
    coarseMat.opacity = p.coarseOp
    scene.add(fine, coarse)

    const floorMat = new THREE.MeshBasicMaterial({ color: p.bg })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.02
    scene.add(floor)

    // Lighting for GLB 3D model materials
    const ambient = new THREE.AmbientLight(0xffffff, 1.3)
    const dir1 = new THREE.DirectionalLight(0xffffff, 1.6)
    dir1.position.set(100, 160, 100)
    const dir2 = new THREE.DirectionalLight(0xe8edf2, 0.7)
    dir2.position.set(-100, 100, -100)
    const hemi = new THREE.HemisphereLight(0xffffff, 0x475569, 1.0)
    scene.add(ambient, dir1, dir2, hemi)

    // Load scene.glb model
    const loader = new GLTFLoader()
    loader.load(
      `${import.meta.env.BASE_URL}scene.glb`,
      (gltf) => {
        const model = gltf.scene

        // Remove any flat giant background plane (Mesh 0 has span 2000x2000)
        const toRemove: THREE.Object3D[] = []
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (mesh.geometry) {
              mesh.geometry.computeBoundingBox()
              const sz = new THREE.Vector3()
              mesh.geometry.boundingBox?.getSize(sz)
              if (sz.x > 300 || sz.y > 300 || sz.z > 300) {
                toRemove.push(child)
                return
              }
            }
            mesh.castShadow = true
            mesh.receiveShadow = true
          }
        })
        toRemove.forEach((obj) => {
          if (obj.parent) obj.parent.remove(obj)
        })

        // Calculate bounding box of the visual mine network and equipment
        const box = new THREE.Box3().setFromObject(model)
        const size = new THREE.Vector3()
        const center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)

        // Scale to ~52 units so it fits gracefully within the 3D scene grid
        const maxDim = Math.max(size.x, size.z)
        const scale = maxDim > 0 ? 52 / maxDim : 1
        model.scale.setScalar(scale)

        // Center horizontally and rest on the grid floor
        model.position.x = -center.x * scale
        model.position.z = -center.z * scale - 6
        model.position.y = -box.min.y * scale + 0.1

        scene.add(model)
      },
      undefined,
      (err) => {
        console.error('Error loading scene.glb:', err)
      }
    )

    matsRef.current = { scene, floorMat, fineMat, coarseMat }

    // Look slightly below center so the horizon sits around ~42% from top, matching Figma
    const target = new THREE.Vector3(0, 2.5, -6)
    const camPos = new THREE.Vector3(0, 14, 38)
    let yaw = 0, pitchOff = 0, dragging = false, lx = 0, ly = 0

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const down = (e: PointerEvent) => { dragging = true; lx = e.clientX; ly = e.clientY }
    const up = () => { dragging = false }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      yaw -= (e.clientX - lx) * 0.005
      pitchOff = Math.max(-0.4, Math.min(0.5, pitchOff + (e.clientY - ly) * 0.003))
      lx = e.clientX; ly = e.clientY
    }
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.08
      const currentZoom = state.current.zoom
      const nextZoom = Math.max(10, Math.min(200, Math.round(currentZoom + delta)))
      if (state.current.onZoomChange && nextZoom !== currentZoom) {
        state.current.onZoomChange(nextZoom)
      }
    }

    el.addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    addEventListener('pointermove', move)
    el.addEventListener('wheel', wheel, { passive: false })

    let raf = 0
    const tick = () => {
      const { mode: m, zoom: z } = state.current
      const dist = 38 * (50 / z)
      let desired: THREE.Vector3
      if (m === 'perspective') desired = new THREE.Vector3(Math.sin(yaw) * dist, 12 + pitchOff * 24, Math.cos(yaw) * dist - 6)
      else if (m === 'isometric') desired = new THREE.Vector3(Math.sin(yaw + Math.PI / 4) * dist, dist * 0.85, Math.cos(yaw + Math.PI / 4) * dist - 6)
      else desired = new THREE.Vector3(0.001, dist * 1.5, -6)
      camPos.lerp(desired, 0.08)
      camera.position.copy(camPos)
      camera.lookAt(target)
      camera.fov = m === 'isometric' ? 25 : 45
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', down)
      removeEventListener('pointerup', up)
      removeEventListener('pointermove', move)
      el.removeEventListener('wheel', wheel)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const m = matsRef.current
    if (!m) return
    const p = PALETTE[theme]
    ;(m.scene.background as THREE.Color).setHex(p.bg)
    ;(m.scene.fog as THREE.Fog).color.setHex(p.bg)
    m.floorMat.color.setHex(p.floor)
    m.fineMat.color.setHex(p.fine)
    m.fineMat.opacity = p.fineOp
    m.coarseMat.color.setHex(p.coarse)
    m.coarseMat.opacity = p.coarseOp
  }, [theme])

  return <div ref={ref} className="scene" />
}

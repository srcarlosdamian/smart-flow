import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type ViewMode = 'perspective' | 'isometric' | 'top'
export type Theme = 'dark' | 'light'

interface Props {
  mode: ViewMode
  zoom: number
  theme: Theme
}

const PALETTE = {
  dark: { bg: 0x0a1c30, floor: 0x0b2036, fine: 0x0d2a45, coarse: 0x05111f, fineOp: 0.28, coarseOp: 0.45 },
  light: { bg: 0xdfe7ef, floor: 0xe6ecf2, fine: 0xd5dee8, coarse: 0xc2cdd9, fineOp: 0.30, coarseOp: 0.48 },
}

export default function Scene3D({ mode, zoom, theme }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({ mode, zoom, theme })
  state.current = { mode, zoom, theme }
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

    const floorMat = new THREE.MeshBasicMaterial({ color: p.floor })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.02
    scene.add(floor)

    matsRef.current = { scene, floorMat, fineMat, coarseMat }

    // Look slightly below center so the horizon sits around ~42% from top, matching Figma
    const target = new THREE.Vector3(0, -1.8, -10)
    const camPos = new THREE.Vector3(0, 7.5, 28)
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
    el.addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    addEventListener('pointermove', move)

    let raf = 0
    const tick = () => {
      const { mode: m, zoom: z } = state.current
      const dist = 28 * (50 / z)
      let desired: THREE.Vector3
      if (m === 'perspective') desired = new THREE.Vector3(Math.sin(yaw) * dist, 7.5 + pitchOff * 20, Math.cos(yaw) * dist)
      else if (m === 'isometric') desired = new THREE.Vector3(Math.sin(yaw + Math.PI / 4) * dist, dist * 0.8, Math.cos(yaw + Math.PI / 4) * dist)
      else desired = new THREE.Vector3(0.001, dist * 1.4, 0.001)
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

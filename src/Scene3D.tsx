import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type ViewMode = 'perspective' | 'isometric' | 'top'

interface Props {
  mode: ViewMode
  zoom: number // percentage
  zoomStep: number
}

const BG = 0x0a1c30

export default function Scene3D({ mode, zoom, zoomStep }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({ mode, zoom })
  state.current = { mode, zoom }
  const stepRef = useRef(zoomStep)
  stepRef.current = zoomStep

  useEffect(() => {
    const el = ref.current!
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BG)
    scene.fog = new THREE.Fog(BG, 40, 260)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)

    // Floor grid: fine + coarse lines
    const fine = new THREE.GridHelper(800, 400, 0x0d2a45, 0x0d2a45)
    const coarse = new THREE.GridHelper(800, 80, 0x02060d, 0x02060d)
    coarse.position.y = 0.01
    ;[fine, coarse].forEach((g) => {
      const m = g.material as THREE.LineBasicMaterial
      m.transparent = true
      m.opacity = g === fine ? 0.55 : 0.9
      scene.add(g)
    })

    // Floor plane with subtle gradient glow
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(800, 800),
      new THREE.MeshBasicMaterial({ color: 0x0b2036 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.02
    scene.add(floor)

    // Floating particles (dust)
    const N = 300
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = Math.random() * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const dust = new THREE.Points(
      pg,
      new THREE.PointsMaterial({ color: 0x4fc3f7, size: 0.15, transparent: true, opacity: 0.5 })
    )
    scene.add(dust)

    // Camera animation state
    const target = new THREE.Vector3()
    const camPos = new THREE.Vector3(0, 6, 30)
    let yaw = 0, pitchOff = 0, dragging = false, lx = 0, ly = 0
    let ortho = false

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
      pitchOff = Math.max(-0.5, Math.min(0.5, pitchOff + (e.clientY - ly) * 0.003))
      lx = e.clientX; ly = e.clientY
    }
    el.addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    addEventListener('pointermove', move)

    let raf = 0
    const t0 = performance.now()
    const tick = () => {
      const { mode: m, zoom: z } = state.current
      const dist = 30 * (50 / z)
      let desired: THREE.Vector3
      if (m === 'perspective') desired = new THREE.Vector3(Math.sin(yaw) * dist, 6 + pitchOff * 20, Math.cos(yaw) * dist)
      else if (m === 'isometric') desired = new THREE.Vector3(Math.sin(yaw + Math.PI / 4) * dist, dist * 0.8, Math.cos(yaw + Math.PI / 4) * dist)
      else desired = new THREE.Vector3(0.001, dist * 1.4, 0.001)
      camPos.lerp(desired, 0.08)
      camera.position.copy(camPos)
      camera.lookAt(target)
      camera.fov = m === 'isometric' ? 25 : 50
      camera.updateProjectionMatrix()
      ortho = m !== 'perspective'
      void ortho
      dust.rotation.y = (performance.now() - t0) * 0.00002
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

  return <div ref={ref} className="scene" />
}

import * as THREE from 'three'

/**
 * SMF - 3D Simulation Overlay Effects
 *
 * Implements real-time visual simulation layers on top of the neutral 3D mine model:
 * 1. Flujo de aire: Velocity vectors & blue-to-red gradients showing trajectories & wind dispersion.
 * 2. Mapa de calor: Continuous thermal chromatic scale (cold to warm) over equipment & machinery.
 * 3. Flujo de energía: Active voltage network lines & luminous electric pulses across the power grid.
 * 4. Flujo de red: Infrastructure graph with blinking AP nodes, links, and latency-colored packet hops.
 * 5. Geocercas: Translucent 3D virtual bounding volumes with bright perimeter line wireframes.
 * 6. Vibraciones sísmicas: Concentric dynamic deformation shockwave rings expanding through the rock.
 * 7. Movimiento de personal: Floating worker avatars with trailing displacement ribbons (estelas de desplazamiento).
 */

export interface SimulationsController {
  group: THREE.Group
  update: (time: number, activeSimulations: string[]) => void
  dispose: () => void
}

export function createSimulations(scene: THREE.Scene): SimulationsController {
  const masterGroup = new THREE.Group()
  masterGroup.name = 'simulations_master'
  scene.add(masterGroup)

  // -------------------------------------------------------------
  // 1. FLUJO DE AIRE
  // -------------------------------------------------------------
  const aireGroup = new THREE.Group()
  aireGroup.name = 'sim_aire'
  masterGroup.add(aireGroup)

  // 3 Curved tunnel trajectories for ventilation
  const airSplines = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-22, 12, 0),
      new THREE.Vector3(-14, 10, -4),
      new THREE.Vector3(-6, 7.5, -7),
      new THREE.Vector3(2, 5.5, -6),
      new THREE.Vector3(10, 3.5, -4),
      new THREE.Vector3(18, 1.8, -2),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, 9, -10),
      new THREE.Vector3(-4, 7, -9),
      new THREE.Vector3(5, 5, -11),
      new THREE.Vector3(14, 3, -8),
      new THREE.Vector3(22, 1.5, -5),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(16, 12, 4),
      new THREE.Vector3(8, 9, 1),
      new THREE.Vector3(0, 6, -2),
      new THREE.Vector3(-8, 4, -4),
      new THREE.Vector3(-16, 2, -6),
    ]),
  ]

  // Spline backbone lines with blue-to-red vertex color gradients
  airSplines.forEach((spline) => {
    const points = spline.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const colors: number[] = []
    const cBlue = new THREE.Color(0x00e5ff)
    const cRed = new THREE.Color(0xf44336)
    const cTemp = new THREE.Color()

    for (let i = 0; i <= 50; i++) {
      const t = i / 50
      cTemp.copy(cBlue).lerp(cRed, t)
      colors.push(cTemp.r, cTemp.g, cTemp.b)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      linewidth: 2,
    })
    const line = new THREE.Line(geometry, lineMat)
    aireGroup.add(line)
  })

  // Velocity flow vectors (arrows) that travel along the trajectories
  interface AirArrow {
    mesh: THREE.Mesh
    splineIndex: number
    offset: number
    speed: number
  }
  const airArrows: AirArrow[] = []
  const arrowGeo = new THREE.ConeGeometry(0.35, 1.1, 8)
  arrowGeo.rotateX(Math.PI / 2) // Point forward along trajectory

  airSplines.forEach((_, sIdx) => {
    for (let a = 0; a < 8; a++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.85,
      })
      const mesh = new THREE.Mesh(arrowGeo, mat)
      aireGroup.add(mesh)
      airArrows.push({
        mesh,
        splineIndex: sIdx,
        offset: a / 8,
        speed: 0.12 + Math.random() * 0.04,
      })
    }
  })

  // -------------------------------------------------------------
  // 2. MAPA DE CALOR
  // -------------------------------------------------------------
  const calorGroup = new THREE.Group()
  calorGroup.name = 'sim_calor'
  masterGroup.add(calorGroup)

  // Machinery hot spots with continuous chromatic thermal layers (cold cyan to hot red)
  const heatSpots = [
    { pos: new THREE.Vector3(10, 2.8, -5), radius: 5.2, label: 'Chancador N3' },
    { pos: new THREE.Vector3(-9, 6.8, -6.5), radius: 4.4, label: 'Taller Mecánico L2' },
    { pos: new THREE.Vector3(-3, 8.8, -4), radius: 3.8, label: 'Subestación Eléctrica' },
    { pos: new THREE.Vector3(16, 1.8, -3), radius: 4.0, label: 'Frente de Avance' },
    { pos: new THREE.Vector3(0, 5.2, -7), radius: 3.5, label: 'Sala de Bombeo' },
  ]

  interface HeatMesh {
    mesh: THREE.Mesh
    baseScale: number
    phase: number
  }
  const heatMeshes: HeatMesh[] = []

  heatSpots.forEach((spot, idx) => {
    // 3 concentric thermal gradient shells
    // Core: hot crimson/red
    const coreGeo = new THREE.SphereGeometry(spot.radius * 0.42, 16, 12)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    core.position.copy(spot.pos)
    calorGroup.add(core)
    heatMeshes.push({ mesh: core, baseScale: 1.0, phase: idx * 1.2 })

    // Mid: warm amber/yellow
    const midGeo = new THREE.SphereGeometry(spot.radius * 0.72, 16, 12)
    const midMat = new THREE.MeshBasicMaterial({
      color: 0xffab00,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const mid = new THREE.Mesh(midGeo, midMat)
    mid.position.copy(spot.pos)
    calorGroup.add(mid)
    heatMeshes.push({ mesh: mid, baseScale: 1.0, phase: idx * 1.2 + 0.8 })

    // Outer: dissipation cyan/blue
    const outGeo = new THREE.SphereGeometry(spot.radius, 16, 12)
    const outMat = new THREE.MeshBasicMaterial({
      color: 0x00b0ff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const out = new THREE.Mesh(outGeo, outMat)
    out.position.copy(spot.pos)
    calorGroup.add(out)
    heatMeshes.push({ mesh: out, baseScale: 1.0, phase: idx * 1.2 + 1.5 })
  })

  // -------------------------------------------------------------
  // 3. FLUJO DE ENERGÍA
  // -------------------------------------------------------------
  const energiaGroup = new THREE.Group()
  energiaGroup.name = 'sim_energia'
  masterGroup.add(energiaGroup)

  // High-voltage supply lines (cables) from surface feed to interior substations
  const powerCables = [
    [new THREE.Vector3(0, 14, -5), new THREE.Vector3(-4, 11, -5), new THREE.Vector3(-12, 10, -5)],
    [new THREE.Vector3(-4, 11, -5), new THREE.Vector3(-6, 8, -6), new THREE.Vector3(-9, 6.8, -6.5)],
    [new THREE.Vector3(0, 14, -5), new THREE.Vector3(4, 9, -5), new THREE.Vector3(10, 2.8, -5)],
    [new THREE.Vector3(-6, 8, -6), new THREE.Vector3(0, 5.2, -7), new THREE.Vector3(4, 1.8, -4)],
  ]

  powerCables.forEach((pts) => {
    const curve = new THREE.CatmullRomCurve3(pts)
    const geo = new THREE.TubeGeometry(curve, 32, 0.14, 8, false)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffd600,
      transparent: true,
      opacity: 0.75,
    })
    const tube = new THREE.Mesh(geo, mat)
    energiaGroup.add(tube)
  })

  // Active electrical supply pulses traveling along lines
  interface EnergyPulse {
    mesh: THREE.Mesh
    curve: THREE.CatmullRomCurve3
    t: number
    speed: number
  }
  const energyPulses: EnergyPulse[] = []
  const pulseGeo = new THREE.SphereGeometry(0.32, 8, 8)
  const pulseMat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  })

  powerCables.forEach((pts) => {
    const curve = new THREE.CatmullRomCurve3(pts)
    for (let i = 0; i < 3; i++) {
      const pMesh = new THREE.Mesh(pulseGeo, pulseMat)
      energiaGroup.add(pMesh)
      energyPulses.push({
        mesh: pMesh,
        curve,
        t: i / 3,
        speed: 0.35 + Math.random() * 0.15,
      })
    }
  })

  // Substation transformer glowing spark nodes
  const subNodes = [
    new THREE.Vector3(0, 14, -5),
    new THREE.Vector3(-12, 10, -5),
    new THREE.Vector3(-9, 6.8, -6.5),
    new THREE.Vector3(10, 2.8, -5),
    new THREE.Vector3(4, 1.8, -4),
  ]
  subNodes.forEach((pos) => {
    const ringGeo = new THREE.RingGeometry(0.5, 0.7, 16)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.copy(pos)
    ring.rotation.x = Math.PI / 2
    energiaGroup.add(ring)
  })

  // -------------------------------------------------------------
  // 4. FLUJO DE RED
  // -------------------------------------------------------------
  const redGroup = new THREE.Group()
  redGroup.name = 'sim_red'
  masterGroup.add(redGroup)

  const netNodes = [
    new THREE.Vector3(-14, 10, -4),
    new THREE.Vector3(-4, 8, -6),
    new THREE.Vector3(6, 8, -5),
    new THREE.Vector3(-8, 5, -8),
    new THREE.Vector3(4, 4, -7),
    new THREE.Vector3(12, 2.5, -5),
    new THREE.Vector3(-2, 1.5, -4),
  ]

  const netEdges: [number, number][] = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [3, 6], [4, 6]
  ]

  // Graph links
  const edgeLines: THREE.Line[] = []
  netEdges.forEach(([a, b]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([netNodes[a], netNodes[b]])
    const mat = new THREE.LineBasicMaterial({
      color: 0x7c4dff,
      transparent: true,
      opacity: 0.65,
      linewidth: 2,
    })
    const line = new THREE.Line(geo, mat)
    redGroup.add(line)
    edgeLines.push(line)
  })

  // AP Nodes (diamond spheres)
  interface NetNodeMesh {
    mesh: THREE.Mesh
    ring: THREE.Mesh
    phase: number
  }
  const netNodeMeshes: NetNodeMesh[] = []
  const nodeGeo = new THREE.OctahedronGeometry(0.45, 0)
  const nodeRingGeo = new THREE.RingGeometry(0.6, 0.8, 16)

  netNodes.forEach((pos, i) => {
    const mat = new THREE.MeshBasicMaterial({ color: 0x00e676 })
    const mesh = new THREE.Mesh(nodeGeo, mat)
    mesh.position.copy(pos)
    redGroup.add(mesh)

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7c4dff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    })
    const ring = new THREE.Mesh(nodeRingGeo, ringMat)
    ring.position.copy(pos)
    ring.rotation.x = Math.PI / 2
    redGroup.add(ring)

    netNodeMeshes.push({ mesh, ring, phase: i * 0.9 })
  })

  // Data packet hops
  interface DataPacket {
    mesh: THREE.Mesh
    edgeIdx: number
    t: number
    speed: number
  }
  const packets: DataPacket[] = []
  const packetGeo = new THREE.SphereGeometry(0.22, 8, 8)
  const packetMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff })

  for (let i = 0; i < 6; i++) {
    const mesh = new THREE.Mesh(packetGeo, packetMat)
    redGroup.add(mesh)
    packets.push({
      mesh,
      edgeIdx: i % netEdges.length,
      t: Math.random(),
      speed: 0.4 + Math.random() * 0.3,
    })
  }

  // -------------------------------------------------------------
  // 5. GEOCERCAS
  // -------------------------------------------------------------
  const geocercasGroup = new THREE.Group()
  geocercasGroup.name = 'sim_geocercas'
  masterGroup.add(geocercasGroup)

  const geofences = [
    { pos: new THREE.Vector3(12, 2.5, -4.5), size: new THREE.Vector3(10, 4.2, 8), color: 0xf44336 }, // Danger / Voladura
    { pos: new THREE.Vector3(-9, 6.8, -6.5), size: new THREE.Vector3(9, 4.5, 7.5), color: 0x00b0ff }, // Taller Mecánico
    { pos: new THREE.Vector3(0, 5.2, -6), size: new THREE.Vector3(6.5, 3.8, 6.5), color: 0x00e676 }, // Refugio R-01
    { pos: new THREE.Vector3(6, 2.8, -8), size: new THREE.Vector3(8, 4.2, 6.5), color: 0xff9800 }, // Chancador
  ]

  geofences.forEach((gf) => {
    // Translucent bounding volume
    const boxGeo = new THREE.BoxGeometry(gf.size.x, gf.size.y, gf.size.z)
    const boxMat = new THREE.MeshBasicMaterial({
      color: gf.color,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    })
    const box = new THREE.Mesh(boxGeo, boxMat)
    box.position.copy(gf.pos)
    geocercasGroup.add(box)

    // Bright perimeter line wireframe
    const edgesGeo = new THREE.EdgesGeometry(boxGeo)
    const edgesMat = new THREE.LineBasicMaterial({
      color: gf.color,
      transparent: true,
      opacity: 0.95,
      linewidth: 2,
    })
    const edges = new THREE.LineSegments(edgesGeo, edgesMat)
    edges.position.copy(gf.pos)
    geocercasGroup.add(edges)

    // Corner beacon lines
    const halfX = gf.size.x / 2
    const halfZ = gf.size.z / 2
    const corners = [
      new THREE.Vector3(gf.pos.x - halfX, gf.pos.y, gf.pos.z - halfZ),
      new THREE.Vector3(gf.pos.x + halfX, gf.pos.y, gf.pos.z - halfZ),
      new THREE.Vector3(gf.pos.x - halfX, gf.pos.y, gf.pos.z + halfZ),
      new THREE.Vector3(gf.pos.x + halfX, gf.pos.y, gf.pos.z + halfZ),
    ]
    corners.forEach((cPos) => {
      const beaconGeo = new THREE.CylinderGeometry(0.08, 0.08, gf.size.y, 8)
      const beaconMat = new THREE.MeshBasicMaterial({
        color: gf.color,
        transparent: true,
        opacity: 0.8,
      })
      const beacon = new THREE.Mesh(beaconGeo, beaconMat)
      beacon.position.copy(cPos)
      geocercasGroup.add(beacon)
    })
  })

  // -------------------------------------------------------------
  // 6. VIBRACIONES SÍSMICAS
  // -------------------------------------------------------------
  const sismicasGroup = new THREE.Group()
  sismicasGroup.name = 'sim_sismicas'
  masterGroup.add(sismicasGroup)

  const seismicCenter = new THREE.Vector3(4, 1.2, -6)

  // Concentric deformation rings expanding outward with variable magnitude
  const SEISMIC_RING_COUNT = 6
  interface SeismicRing {
    mesh: THREE.Mesh
    age: number
    speed: number
  }
  const seismicRings: SeismicRing[] = []

  for (let i = 0; i < SEISMIC_RING_COUNT; i++) {
    const ringGeo = new THREE.RingGeometry(0.9, 1.4, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe91e63,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const mesh = new THREE.Mesh(ringGeo, ringMat)
    mesh.position.copy(seismicCenter)
    mesh.rotation.x = Math.PI / 2
    sismicasGroup.add(mesh)
    seismicRings.push({
      mesh,
      age: i / SEISMIC_RING_COUNT,
      speed: 0.22,
    })
  }

  // Epicenter pulsing beacon
  const epicenterGeo = new THREE.SphereGeometry(0.8, 16, 16)
  const epicenterMat = new THREE.MeshBasicMaterial({
    color: 0xff1744,
    transparent: true,
    opacity: 0.9,
  })
  const epicenter = new THREE.Mesh(epicenterGeo, epicenterMat)
  epicenter.position.copy(seismicCenter)
  sismicasGroup.add(epicenter)

  // -------------------------------------------------------------
  // 7. MOVIMIENTO DE PERSONAL
  // -------------------------------------------------------------
  const personalGroup = new THREE.Group()
  personalGroup.name = 'sim_personal'
  masterGroup.add(personalGroup)

  // 5 Active worker trajectories with trailing displacement wakes (estelas de desplazamiento)
  const workerRoutes = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 10, -4),
      new THREE.Vector3(-8, 9, -5),
      new THREE.Vector3(-2, 7.5, -6),
      new THREE.Vector3(6, 6, -5),
      new THREE.Vector3(12, 4.5, -4),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(15, 2.5, -3),
      new THREE.Vector3(8, 2.5, -5),
      new THREE.Vector3(2, 2.5, -6),
      new THREE.Vector3(-4, 2.5, -6),
      new THREE.Vector3(-10, 2.5, -5),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9, 6.8, -6.5),
      new THREE.Vector3(-5, 6.8, -5),
      new THREE.Vector3(0, 6.8, -4),
      new THREE.Vector3(5, 6.8, -5),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5.2, -6),
      new THREE.Vector3(3, 4.5, -7),
      new THREE.Vector3(7, 3.5, -8),
      new THREE.Vector3(11, 2.8, -7),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, 1.8, -2),
      new THREE.Vector3(-12, 1.8, -4),
      new THREE.Vector3(-4, 1.8, -5),
      new THREE.Vector3(4, 1.8, -5),
    ]),
  ]

  interface WorkerAvatar {
    avatarMesh: THREE.Mesh
    haloMesh: THREE.Mesh
    trailLine: THREE.Line
    trailGeo: THREE.BufferGeometry
    route: THREE.CatmullRomCurve3
    t: number
    speed: number
    history: THREE.Vector3[]
  }
  const workerAvatars: WorkerAvatar[] = []

  const avatarGeo = new THREE.SphereGeometry(0.42, 12, 12)
  const avatarHaloGeo = new THREE.RingGeometry(0.55, 0.75, 16)

  workerRoutes.forEach((route, idx) => {
    // Floating avatar head
    const mat = new THREE.MeshBasicMaterial({ color: 0x00e676 })
    const avatar = new THREE.Mesh(avatarGeo, mat)
    personalGroup.add(avatar)

    // Pulsing halo disc under worker
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    })
    const halo = new THREE.Mesh(avatarHaloGeo, haloMat)
    halo.rotation.x = Math.PI / 2
    personalGroup.add(halo)

    // Trailing ribbon wake (estela de desplazamiento)
    const TRAIL_LENGTH = 20
    const history: THREE.Vector3[] = []
    const startPt = route.getPointAt(0)
    for (let k = 0; k < TRAIL_LENGTH; k++) {
      history.push(startPt.clone())
    }
    const trailGeo = new THREE.BufferGeometry().setFromPoints(history)
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x00e676,
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    })
    const trailLine = new THREE.Line(trailGeo, trailMat)
    personalGroup.add(trailLine)

    workerAvatars.push({
      avatarMesh: avatar,
      haloMesh: halo,
      trailLine,
      trailGeo,
      route,
      t: (idx * 0.22) % 1,
      speed: 0.08 + idx * 0.02,
      history,
    })
  })

  // -------------------------------------------------------------
  // MASTER UPDATE LOOP (Runs at 60 FPS in Scene3D tick)
  // -------------------------------------------------------------
  const update = (time: number, activeSimulations: string[]) => {
    // 1. Toggle visibility based on activeSimulations array
    const hasAire = activeSimulations.includes('aire')
    const hasCalor = activeSimulations.includes('calor')
    const hasEnergia = activeSimulations.includes('energia')
    const hasRed = activeSimulations.includes('red')
    const hasGeocercas = activeSimulations.includes('geocercas')
    const hasSismicas = activeSimulations.includes('sismicas')
    const hasPersonal = activeSimulations.includes('personal')

    aireGroup.visible = hasAire
    calorGroup.visible = hasCalor
    energiaGroup.visible = hasEnergia
    redGroup.visible = hasRed
    geocercasGroup.visible = hasGeocercas
    sismicasGroup.visible = hasSismicas
    personalGroup.visible = hasPersonal

    // 1. Update Air flow vectors
    if (hasAire) {
      const cBlue = new THREE.Color(0x00e5ff)
      const cRed = new THREE.Color(0xf44336)
      const cTemp = new THREE.Color()

      airArrows.forEach((arr) => {
        const spline = airSplines[arr.splineIndex]
        const currentT = (arr.offset + time * arr.speed) % 1
        const pos = spline.getPointAt(currentT)
        const tangent = spline.getTangentAt(currentT).normalize()

        arr.mesh.position.copy(pos)
        arr.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent)

        // Gradient color from blue to red according to distance/dispersion
        cTemp.copy(cBlue).lerp(cRed, currentT)
        ;(arr.mesh.material as THREE.MeshBasicMaterial).color.copy(cTemp)
      })
    }

    // 2. Update Heat Map pulsations
    if (hasCalor) {
      heatMeshes.forEach((hm) => {
        const pulse = 1 + 0.08 * Math.sin(time * 3 + hm.phase)
        hm.mesh.scale.setScalar(hm.baseScale * pulse)
      })
    }

    // 3. Update Energy pulses
    if (hasEnergia) {
      energyPulses.forEach((ep) => {
        const currT = (ep.t + time * ep.speed) % 1
        const pos = ep.curve.getPointAt(currT)
        ep.mesh.position.copy(pos)
      })
    }

    // 4. Update Network graph blinking & packets
    if (hasRed) {
      netNodeMeshes.forEach((nm) => {
        const blink = Math.sin(time * 4 + nm.phase)
        const isGood = blink > -0.2
        ;(nm.mesh.material as THREE.MeshBasicMaterial).color.setHex(isGood ? 0x00e676 : 0xd500f9)
        const ringScale = 1 + 0.3 * Math.abs(blink)
        nm.ring.scale.setScalar(ringScale)
      })

      packets.forEach((p) => {
        const [a, b] = netEdges[p.edgeIdx]
        const currT = (p.t + time * p.speed) % 1
        p.mesh.position.lerpVectors(netNodes[a], netNodes[b], currT)
      })
    }

    // 5. Update Geofence breathing borders
    if (hasGeocercas) {
      geocercasGroup.children.forEach((c) => {
        if ((c as THREE.Mesh).isMesh && c.type === 'Mesh') {
          const m = c as THREE.Mesh
          if (m.material && (m.material as THREE.MeshBasicMaterial).opacity !== undefined) {
            const baseOp = 0.18
            ;(m.material as THREE.MeshBasicMaterial).opacity = baseOp + 0.04 * Math.sin(time * 2)
          }
        }
      })
    }

    // 6. Update Seismic deformation waves
    if (hasSismicas) {
      seismicRings.forEach((sr) => {
        sr.age = (sr.age + 0.015) % 1.0
        const radiusScale = 1 + sr.age * 22
        sr.mesh.scale.set(radiusScale, radiusScale, 1)
        // Fade opacity as wave expands
        ;(sr.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.85 * (1 - sr.age))
      })
      epicenter.scale.setScalar(1 + 0.15 * Math.sin(time * 8))
    }

    // 7. Update Personnel movement avatars & trailing wakes
    if (hasPersonal) {
      workerAvatars.forEach((w) => {
        // Back-and-forth ping-pong movement along tunnel route
        const cycle = (time * w.speed + w.t) % 2
        const progress = cycle > 1 ? 2 - cycle : cycle
        const pos = w.route.getPointAt(progress)

        w.avatarMesh.position.copy(pos)
        w.haloMesh.position.set(pos.x, pos.y - 0.45, pos.z)
        w.haloMesh.scale.setScalar(1 + 0.15 * Math.sin(time * 5 + w.t))

        // Update trailing wake history
        w.history.unshift(pos.clone())
        w.history.pop()
        w.trailGeo.setFromPoints(w.history)
      })
    }
  }

  const dispose = () => {
    scene.remove(masterGroup)
  }

  return { group: masterGroup, update, dispose }
}

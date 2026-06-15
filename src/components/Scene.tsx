import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei'
import * as THREE from 'three'
import Machine from './Machine'
import ConveyorBelt from './ConveyorBelt'
import { MachineData, Status } from '../data/factoryData'

interface Props {
  machineStates: Record<string, Status>
  onMachineHover: (machine: MachineData | null, screenPos?: { x: number; y: number }) => void
  needsMaintenance: (m: MachineData) => boolean
}

const conveyorDefs: { pos: [number, number, number]; length: number }[] = [
  { pos: [-6.25, 0.15, 0], length: 2.5 },
  { pos: [-3.0, 0.15, 0], length: 2.0 },
  { pos: [0.0, 0.15, 0], length: 2.0 },
  { pos: [3.0, 0.15, 0], length: 2.0 },
  { pos: [5.75, 0.15, 0], length: 1.5 },
  { pos: [8.5, 0.15, 0], length: 2.0 },
]

// Raw machine list (same order as factoryData)
import { machines } from '../data/factoryData'

export default function Scene({ machineStates, onMachineHover, needsMaintenance }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 8, 14], fov: 50, near: 0.1, far: 200 }}
      shadows
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#0a0e1a']} />
      <fog attach="fog" args={['#0a0e1a', 20, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-6, 5, 4]} intensity={0.4} color="#4fc3f7" />
      <pointLight position={[6, 5, -4]} intensity={0.3} color="#80d8ff" />

      <Suspense fallback={null}>
        {/* Ground grid */}
        <Grid
          position={[0, -0.01, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1a2240"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#253050"
          fadeDistance={30}
          fadeStrength={1.5}
          infiniteGrid
        />

        {/* Floor plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#0d1220" roughness={0.95} />
        </mesh>

        {/* Conveyor belts between machines */}
        {conveyorDefs.map((c, i) => (
          <ConveyorBelt key={`cb${i}`} position={c.pos} length={c.length} speed={0.4} />
        ))}

        {/* Machines */}
        {machines.map((m) => (
          <Machine
            key={m.id}
            data={m}
            statusOverride={machineStates[m.id] ?? m.status}
            isMaintenance={needsMaintenance(m)}
            onHover={onMachineHover}
          />
        ))}

        {/* Contact shadows */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.4}
          scale={30}
          blur={2}
          far={10}
          color="#000020"
        />

        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        makeDefault
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={30}
        enablePan
        panSpeed={0.5}
        target={[1, 0.5, 0]}
      />
    </Canvas>
  )
}

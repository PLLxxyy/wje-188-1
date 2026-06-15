import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { MachineData, Status } from '../data/factoryData'
import StatusBubble from './StatusBubble'

interface Props {
  data: MachineData
  statusOverride?: Status
  isMaintenance?: boolean
  onHover: (machine: MachineData | null, screenPos?: { x: number; y: number }) => void
}

const statusColor: Record<Status, string> = {
  green: '#2e7d32',
  yellow: '#f9a825',
  red: '#c62828',
}

const machineBodyColor: Record<string, string> = {
  conveyor: '#3a4568',
  robot: '#455a7a',
  cnc: '#4a5c7a',
  press: '#5a4a6a',
  welder: '#6a5040',
  inspector: '#3a6a6a',
  packer: '#4a6a4a',
}

export default function Machine({ data, statusOverride, isMaintenance, onHover }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const status = statusOverride ?? data.status
  const isAlarm = status === 'red'

  useFrame(({ clock }) => {
    if (groupRef.current && isAlarm) {
      const s = 1 + Math.sin(clock.elapsedTime * 6) * 0.015
      groupRef.current.scale.set(s, s, s)
    } else if (groupRef.current && isMaintenance) {
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.01
      groupRef.current.scale.set(s, s, s)
    } else if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1)
    }
  })

  const handlePointerOver = useCallback(
    (e: any) => {
      e.stopPropagation()
      setHovered(true)
      const domEvent = e.nativeEvent as PointerEvent
      onHover(data, { x: domEvent.clientX, y: domEvent.clientY })
      document.body.style.cursor = 'pointer'
    },
    [data, onHover],
  )

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    onHover(null)
    document.body.style.cursor = 'default'
  }, [onHover])

  const handlePointerMove = useCallback(
    (e: any) => {
      const domEvent = e.nativeEvent as PointerEvent
      onHover(data, { x: domEvent.clientX, y: domEvent.clientY })
    },
    [data, onHover],
  )

  const bodyColor = isMaintenance ? '#8a6a20' : machineBodyColor[data.type] ?? '#4a5a7a'

  function renderShape() {
    switch (data.type) {
      case 'conveyor':
        return (
          <mesh>
            <boxGeometry args={[2.0, 0.35, 0.9]} />
            <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.4} />
          </mesh>
        )
      case 'robot':
        // base + arm
        return (
          <group>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.35, 0.4, 0.4, 8]} />
              <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.8, 6]} />
              <meshStandardMaterial color="#607090" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0.15, 1.1, 0]}>
              <boxGeometry args={[0.5, 0.12, 0.12]} />
              <meshStandardMaterial color="#7080a0" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        )
      case 'cnc':
        return (
          <group>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.4, 0.8, 1.1]} />
              <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0.5, 0.85, 0]}>
              <boxGeometry args={[0.15, 0.1, 0.6]} />
              <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )
      case 'press':
        return (
          <group>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.0, 1.0, 0.9]} />
              <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
              <meshStandardMaterial color="#607080" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        )
      case 'welder':
        return (
          <group>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 0.5, 6]} />
              <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.08, 0.1, 0.9, 6]} />
              <meshStandardMaterial color="#7a6a5a" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0.2, 1.2, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#90a0b0" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )
      case 'inspector':
        return (
          <group>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[1.2, 0.6, 0.8]} />
              <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.75, 0.2]}>
              <boxGeometry args={[0.3, 0.3, 0.15]} />
              <meshStandardMaterial color="#1a2a3a" metalness={0.3} roughness={0.1} />
            </mesh>
          </group>
        )
      case 'packer':
        return (
          <group>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[1.3, 0.7, 1.0]} />
              <meshStandardMaterial color={bodyColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[1.1, 0.08, 0.8]} />
              <meshStandardMaterial color="#5a7a5a" metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
        )
    }
  }

  return (
    <group ref={groupRef} position={data.position}>
      {/* Main body */}
      <group
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
      >
        {renderShape()}
        {/* Selection highlight */}
        {hovered && (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.2, 1.6, 1.4]} />
            <meshBasicMaterial color="#4fc3f7" transparent opacity={0.08} />
          </mesh>
        )}
      </group>

      {/* Status indicator ring at base */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.75, 24]} />
        <meshBasicMaterial color={isMaintenance ? '#ff9800' : statusColor[status]} transparent opacity={0.4} />
      </mesh>

      {/* Status bubble above */}
      <StatusBubble status={status} isMaintenance={isMaintenance} position={[0, 2.0, 0]} />

      {/* Billboard label */}
      <Billboard position={[0, 2.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={0.22}
          color="#b0c4ff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.015}
          outlineColor="#0a0e1a"
        >
          {data.name}
        </Text>
      </Billboard>

      {/* Alarm glow for red status */}
      {isAlarm && (
        <pointLight position={[0, 1.2, 0]} color="#ef5350" intensity={3} distance={4} />
      )}

      {/* Maintenance glow */}
      {isMaintenance && !isAlarm && (
        <pointLight position={[0, 1.2, 0]} color="#ff9800" intensity={2} distance={4} />
      )}
    </group>
  )
}

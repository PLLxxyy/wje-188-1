import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Status } from '../data/factoryData'

interface Props {
  status: Status
  isMaintenance?: boolean
  position: [number, number, number]
}

const colorMap: Record<string, string> = {
  green: '#4caf50',
  yellow: '#ffb74d',
  red: '#ef5350',
  maintenance: '#ff9800',
}

const emissiveMap: Record<string, string> = {
  green: '#2e7d32',
  yellow: '#f57f17',
  red: '#c62828',
  maintenance: '#e65100',
}

export default function StatusBubble({ status, isMaintenance, position }: Props) {
  const ref = useRef<THREE.Mesh>(null)
  const baseY = position[1]

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.08
      const scale = 1 + Math.sin(clock.elapsedTime * 3 + position[0] * 2) * 0.06
      ref.current.scale.setScalar(scale)
    }
  })

  const bubbleKey = isMaintenance ? 'maintenance' : status

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.22, 16, 16]} />
      <meshStandardMaterial
        color={colorMap[bubbleKey]}
        emissive={emissiveMap[bubbleKey]}
        emissiveIntensity={isMaintenance ? 1.0 : status === 'red' ? 1.2 : 0.6}
        transparent
        opacity={0.85}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  )
}

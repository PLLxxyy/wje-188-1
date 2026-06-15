import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  position: [number, number, number]
  length?: number
  speed?: number
}

export default function ConveyorBelt({ position, length = 4, speed = 0.3 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    // belt base
    ctx.fillStyle = '#2a3148'
    ctx.fillRect(0, 0, 256, 64)
    // grooves
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#353d56' : '#242b40'
      ctx.fillRect(i * 16, 0, 16, 64)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 1)
    return tex
  }, [])

  useFrame((_, delta) => {
    if (texture) {
      texture.offset.x += speed * delta
    }
  })

  return (
    <group position={position}>
      {/* Belt surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[length, 1.0]} />
        <meshStandardMaterial ref={matRef} map={texture} color="#3a4568" roughness={0.7} />
      </mesh>
      {/* Side rails */}
      {[-0.52, 0.52].map((z, i) => (
        <mesh key={i} position={[0, 0.1, z]}>
          <boxGeometry args={[length, 0.2, 0.06]} />
          <meshStandardMaterial color="#556080" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Rollers */}
      {Array.from({ length: Math.floor(length / 0.8) }, (_, i) => (
        <mesh key={`r${i}`} position={[-length / 2 + 0.4 + i * 0.8, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 8]} />
          <meshStandardMaterial color="#3d4660" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

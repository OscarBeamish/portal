import { shaderMaterial, Sparkles, Center, useTexture, useGLTF, OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { useRef } from 'react'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

// Floating Orb Component
function FloatingOrb({ position, color, size = 0.1 }) {
    const orbRef = useRef()
    
    useFrame((state) => {
        if (orbRef.current) {
            orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3
            orbRef.current.rotation.x = state.clock.elapsedTime * 0.5
            orbRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })
    
    return (
        <Sphere ref={orbRef} args={[size, 16, 16]} position={position}>
            <meshBasicMaterial color={color} transparent opacity={0.7} />
        </Sphere>
    )
}

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#000000')
    },
    portalVertexShader,
    portalFragmentShader
)

extend({ PortalMaterial })

export default function Experience()
{
    const { nodes } = useGLTF('./model/portal.glb')

    const bakedTexture = useTexture('./model/baked.jpg')
    bakedTexture.flipY = false
    
    const portalMaterial = useRef()
    const groupRef = useRef()

    useFrame((state, delta) =>
    {
        portalMaterial.current.uTime += delta
        
        // Subtle scene rotation
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
        }
    })

    return <>

        <OrbitControls makeDefault />

        {/* Enhanced ambient lighting */}
        <ambientLight intensity={0.3} color="#4040ff" />
        <pointLight position={[2, 3, 4]} intensity={0.5} color="#ff6040" />
        <pointLight position={[-2, 1, -1]} intensity={0.3} color="#40ff40" />

        <Center>
            <group ref={groupRef}>
                <mesh geometry={ nodes.baked.geometry }>
                    <meshBasicMaterial map={ bakedTexture } />
                </mesh>

                <mesh geometry={ nodes.poleLightA.geometry } position={ nodes.poleLightA.position }>
                    <meshBasicMaterial color="#ffffe5" />
                </mesh>

                <mesh geometry={ nodes.poleLightB.geometry } position={ nodes.poleLightB.position }>
                    <meshBasicMaterial color="#ffffe5" />
                </mesh>

                <mesh geometry={ nodes.portalLight.geometry } position={ nodes.portalLight.position } rotation={ nodes.portalLight.rotation }>
                    <portalMaterial ref={ portalMaterial } />
                </mesh>

                {/* Enhanced sparkles with multiple layers */}
                <Sparkles
                    size={ 1 }
                    scale={ [ 4, 2, 4 ] }
                    position-y={ 1 }
                    speed={ 0.2 }
                    count={ 40 }
                />
                
                <Sparkles
                    size={ 0.8 }
                    scale={ [ 6, 3, 6 ] }
                    position-y={ 1.5 }
                    speed={ 0.1 }
                    count={ 20 }
                    color="#ff40ff"
                />

                {/* Floating mystical orbs - tiny like sparkles */}
                <FloatingOrb position={[3, 2, 1]} color="#ff40ff" size={0.005} />
                <FloatingOrb position={[-2.5, 1.5, 2]} color="#40ffff" size={0.004} />
                <FloatingOrb position={[1.5, 3, -1.5]} color="#ffff40" size={0.003} />
                <FloatingOrb position={[-1, 2.8, -2]} color="#ff4040" size={0.004} />
                <FloatingOrb position={[2.8, 1.2, 2.5]} color="#8040ff" size={0.005} />
            </group>
        </Center>

    </>
}
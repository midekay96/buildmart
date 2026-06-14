import React, { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Html, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import styles from './Visualizer3D.module.css';

// --- CONSTANTS ---
const FLOOR_H = 3.4;
const SLAB_T  = 0.22;
const BASE_Y  = 0.3;

const WALL_COLOR_OVERRIDE = {
  brick:      '#8B4830',
  icf:        '#C8C4BC',
  sandcrete9: null,
  sandcrete6: null,
};

const ROOF_SWATCHES = {
  Charcoal:   '#374151',
  Terracotta: '#9B4E2A',
  Forest:     '#2D5A27',
  Ivory:      '#C8B89A',
};

const WALL_SWATCHES = {
  Cream: '#F2EDE4',
  White: '#F8F8F6',
  Sand:  '#E2D0B4',
  Slate: '#B0BEC5',
};

// 3 views only (aerial, interior, roof removed)
const CAMERA_VIEWS = [
  { id: 'front',    label: 'Front View', icon: '🏠' },
  { id: 'compound', label: 'Compound',   icon: '🔑' },
  { id: 'side',     label: 'Side View',  icon: '↔️' },
];

const BUILD_STAGES = [
  { id: 'foundation', label: 'Foundation', icon: '⬇️' },
  { id: 'walls',      label: 'Walls',      icon: '🧱' },
  { id: 'roofing',    label: 'Roofing',    icon: '🏠' },
  { id: 'finishing',  label: 'Finishing',  icon: '✨'        },
  { id: 'complete',   label: 'Completed',  icon: '✅'        },
];

const HOTSPOTS = [
  { id: 'roof',   label: 'Roof',        pos: [0, 9, 0],     icon: '🏠', mat: 'Stone-Coated Steel Tiles',  price: '₦850/m2',       spec: '50yr warranty - Class A fire', brand: 'Decra' },
  { id: 'door',   label: 'Main Door',   pos: [0, 3.2, 7.5], icon: '🚪', mat: 'Mahogany Security Door',    price: '₦185,000/unit', spec: '5-lever lock - Varnished',     brand: 'Hahn' },
  { id: 'window', label: 'Windows',     pos: [4, 3, 5.2],   icon: '🫟', mat: 'Aluminium Casement',        price: '₦48,000/unit',  spec: '6mm toughened - Powder-coated', brand: 'Japaul' },
  { id: 'wall',   label: 'Wall Finish', pos: [-5.6, 2, 0],  icon: '🧱', mat: 'Textured Plaster + Paint',  price: '₦4,500/m2',     spec: 'Dulux Weathershield',           brand: 'Dulux' },
  { id: 'fence',  label: 'Compound',    pos: [15.5, 2, 0],  icon: '🔑', mat: 'Reinforced Block Wall',     price: '₦13,500/m',     spec: '2.4m height - Sand-faced',      brand: 'Custom' },
  { id: 'floor',  label: 'Flooring',    pos: [0, 0.5, -4],  icon: '⬛',        mat: 'Italian Porcelain Tiles',   price: '₦7,800/m2',     spec: '60x60cm - R10 slip-resist',     brand: 'Ceramo' },
];

const PHASE_LABELS = {
  foundation: 'Foundation', blockwork: 'Walls', decking: 'Decking',
  roofing: 'Roofing', plastering: 'Plastering', flooring: 'Flooring',
  plumbing: 'Plumbing', electrical: 'Electrical', painting: 'Painting',
  fencing: 'Fencing', windows: 'Windows & Doors', staircase: 'Staircase', siteworks: 'Site Works',
};

// â”€â”€â”€ GEOMETRY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function GabledRoof({ w, d, h, color, overhang = 0.65 }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-(w / 2 + overhang), 0);
    shape.lineTo(0, h);
    shape.lineTo(w / 2 + overhang, 0);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: d + overhang * 2, bevelEnabled: false });
    g.translate(0, 0, -(d / 2 + overhang));
    g.computeVertexNormals();
    return g;
  }, [w, d, h, overhang]);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.06} />
    </mesh>
  );
}

function WindowMesh({ position, rotation, size, glowOn }) {
  const [w, h] = size || [1.4, 1.1];
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[w + 0.14, h + 0.14, 0.1]} />
        <meshStandardMaterial color="#2A2620" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[w, h, 0.05]} />
        <meshStandardMaterial color="#8CC8DC" roughness={0.05} metalness={0.1} transparent opacity={0.55}
          emissive={glowOn ? '#ffdd88' : '#000'} emissiveIntensity={glowOn ? 0.8 : 0} />
      </mesh>
      <mesh position={[0, 0, 0.07]}><boxGeometry args={[w, 0.055, 0.04]} /><meshStandardMaterial color="#1A1814" roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.07]}><boxGeometry args={[0.055, h, 0.04]} /><meshStandardMaterial color="#1A1814" roughness={0.5} /></mesh>
    </group>
  );
}

function DoorMesh({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stone/marble surround */}
      <mesh castShadow>
        <boxGeometry args={[2.0, 2.8, 0.18]} />
        <meshStandardMaterial color="#C8B89A" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[1.5, 2.5, 0.12]} />
        <meshStandardMaterial color="#3C2818" roughness={0.78} />
      </mesh>
      {[[-0.32, -0.1], [0.32, -0.1]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.17]}><boxGeometry args={[0.52, 1.05, 0.06]} /><meshStandardMaterial color="#4A3020" roughness={0.72} /></mesh>
      ))}
      <mesh position={[0, 0.92, 0.17]}><boxGeometry args={[1.14, 0.42, 0.04]} /><meshStandardMaterial color="#7BBCD8" transparent opacity={0.55} roughness={0.05} /></mesh>
      <mesh position={[0.22, 0.05, 0.22]}><cylinderGeometry args={[0.04, 0.04, 0.28, 8]} /><meshStandardMaterial color="#D4A840" metalness={0.9} roughness={0.12} /></mesh>
    </group>
  );
}

function Pillar({ position }) {
  return (
    <group position={position}>
      {/* Stone cladding base */}
      <mesh position={[0, -1.3, 0]}><boxGeometry args={[0.7, 0.6, 0.7]} /><meshStandardMaterial color="#B8A888" roughness={0.88} /></mesh>
      <mesh castShadow><cylinderGeometry args={[0.24, 0.28, 3.1, 14]} /><meshStandardMaterial color="#E8E0D2" roughness={0.7} /></mesh>
      {[1.48, -1.48].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}><boxGeometry args={[0.62, 0.14, 0.62]} /><meshStandardMaterial color="#D8D0C2" roughness={0.65} /></mesh>
      ))}
    </group>
  );
}

function Tree({ position, scale }) {
  const sc = scale || 1;
  return (
    <group position={position} scale={sc}>
      <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.17, 0.28, 2.4, 8]} /><meshStandardMaterial color="#5A3618" roughness={0.96} /></mesh>
      {[[3.0, 1.9, '#1a4d1a'], [4.2, 1.5, '#1e5c22'], [5.2, 1.1, '#226628']].map(([y, r, c], i) => (
        <mesh key={i} position={[0, y, 0]} castShadow><sphereGeometry args={[r, 10, 8]} /><meshStandardMaterial color={c} roughness={0.92} /></mesh>
      ))}
    </group>
  );
}

function PalmTree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.8, 0]} castShadow><cylinderGeometry args={[0.1, 0.2, 5.5, 8]} /><meshStandardMaterial color="#8B6914" roughness={0.96} /></mesh>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.sin(r) * 1.1, 5.2, Math.cos(r) * 1.1]} rotation={[0.45, r, 0]}>
            <boxGeometry args={[0.09, 0.05, 2.2]} /><meshStandardMaterial color="#2a7218" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function CarMesh({ position, color, rotation }) {
  const col = color || '#3A4A5A';
  const rot = rotation || [0, 0, 0];
  return (
    <group position={position} rotation={rot}>
      <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[2.05, 0.62, 4.5]} /><meshStandardMaterial color={col} roughness={0.22} metalness={0.72} /></mesh>
      <mesh position={[0, 1.07, -0.2]} castShadow><boxGeometry args={[1.85, 0.68, 2.65]} /><meshStandardMaterial color={col} roughness={0.22} metalness={0.72} /></mesh>
      <mesh position={[0, 1.07, 1.05]}><boxGeometry args={[1.65, 0.55, 0.06]} /><meshStandardMaterial color="#A8D8EC" transparent opacity={0.5} roughness={0.05} /></mesh>
      {[[-0.9, 0.3, 1.45], [0.9, 0.3, 1.45], [-0.9, 0.3, -1.45], [0.9, 0.3, -1.45]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.33, 0.33, 0.25, 16]} /><meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function WallLight({ position, on }) {
  return (
    <group position={position}>
      <mesh castShadow><boxGeometry args={[0.2, 0.35, 0.15]} /><meshStandardMaterial color="#888" roughness={0.6} metalness={0.5} /></mesh>
      <mesh position={[0, -0.12, 0.08]}>
        <boxGeometry args={[0.16, 0.1, 0.04]} />
        <meshStandardMaterial color={on ? '#FFF8D0' : '#666'} emissive={on ? '#FFF8D0' : '#000'} emissiveIntensity={on ? 3 : 0} />
      </mesh>
      {on && <pointLight position={[0, -0.2, 0.2]} color="#FFB060" intensity={1.5} distance={5} decay={2} />}
    </group>
  );
}

function CompoundLamp({ position, on }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[0.05, 0.07, 2.2, 8]} /><meshStandardMaterial color="#888" roughness={0.8} /></mesh>
      <mesh position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color={on ? '#FFF8D0' : '#888'} emissive={on ? '#FFF8D0' : '#000'} emissiveIntensity={on ? 3 : 0} />
      </mesh>
      {on && <pointLight position={[0, 1.18, 0]} color="#FFD080" intensity={1.8} distance={9} decay={2} />}
    </group>
  );
}

// â”€â”€â”€ ROOF MESH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RoofMesh({ roofType, y, w, d, color }) {
  if (roofType === 'flat') {
    const pw = w + 1.2, pd = d + 1.2;
    return (
      <group position={[0, y, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw, 0.3, pd]} /><meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        {[{ p: [0, 0.7, pd / 2], a: [pw, 0.9, 0.22] }, { p: [0, 0.7, -pd / 2], a: [pw, 0.9, 0.22] }, { p: [pw / 2, 0.7, 0], a: [0.22, 0.9, pd] }, { p: [-pw / 2, 0.7, 0], a: [0.22, 0.9, pd] }].map((v, i) => (
          <mesh key={i} position={v.p} castShadow><boxGeometry args={v.a} /><meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.82)} roughness={0.82} /></mesh>
        ))}
      </group>
    );
  }
  if (roofType === 'mansard') {
    return (
      <group position={[0, y, 0]}>
        <GabledRoof w={w + 1.4} d={d + 1.4} h={1.6} color={color} overhang={0} />
        <mesh position={[0, 1.6, 0]} castShadow><boxGeometry args={[w * 0.6, 0.22, d * 0.6]} /><meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.75)} roughness={0.8} /></mesh>
        <mesh position={[0, 2.96, 0]}><boxGeometry args={[0.28, 0.16, d + 1.4]} /><meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.6)} roughness={0.7} /></mesh>
      </group>
    );
  }
  return (
    <group position={[0, y, 0]}>
      <GabledRoof w={w + 1.4} d={d + 1.4} h={3.0} color={color} overhang={0} />
      {/* Ridge tile */}
      <mesh position={[0, 2.96, 0]}><boxGeometry args={[0.3, 0.2, d + 1.4]} /><meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.55)} roughness={0.72} /></mesh>
      {/* Gutters */}
      <mesh position={[0, -0.05, (d + 1.4) / 2]}><boxGeometry args={[w + 1.4 + 0.2, 0.1, 0.18]} /><meshStandardMaterial color="#888" roughness={0.5} metalness={0.4} /></mesh>
      <mesh position={[0, -0.05, -(d + 1.4) / 2]}><boxGeometry args={[w + 1.4 + 0.2, 0.1, 0.18]} /><meshStandardMaterial color="#888" roughness={0.5} metalness={0.4} /></mesh>
    </group>
  );
}

// â”€â”€â”€ FOUNDATION MESH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FoundationMesh({ foundationType, w, d }) {
  if (foundationType === 'pile') {
    return (
      <group>
        <mesh position={[0, 0.15, 0]} receiveShadow><boxGeometry args={[w, 0.3, d]} /><meshStandardMaterial color="#8A8278" roughness={0.92} /></mesh>
        {[[-w / 2 + 1, -0.5, -d / 2 + 1], [w / 2 - 1, -0.5, -d / 2 + 1], [-w / 2 + 1, -0.5, d / 2 - 1], [w / 2 - 1, -0.5, d / 2 - 1], [0, -0.5, 0]].map((p, i) => (
          <mesh key={i} position={p} castShadow><cylinderGeometry args={[0.3, 0.3, 1.0, 10]} /><meshStandardMaterial color="#706860" roughness={0.9} /></mesh>
        ))}
      </group>
    );
  }
  if (foundationType === 'raft') {
    return <mesh position={[0, 0.2, 0]} receiveShadow><boxGeometry args={[w + 1.2, 0.4, d + 1.2]} /><meshStandardMaterial color="#9E9080" roughness={0.92} /></mesh>;
  }
  return <mesh position={[0, 0.15, 0]} receiveShadow><boxGeometry args={[w, 0.3, d]} /><meshStandardMaterial color="#9E9080" roughness={0.92} /></mesh>;
}

// â”€â”€â”€ FLOOR LEVEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FloorLevel({ floorIndex, numFloors, yBase, w, d, wallColor, isGround, showWindows, showDoor, glowOn }) {
  const midY = FLOOR_H / 2;
  return (
    <group position={[0, yBase, 0]}>
      <mesh position={[0, midY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, FLOOR_H, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.84} />
      </mesh>

      {isGround && (
        <>
          {/* Porch */}
          <mesh position={[0, 1.6, d / 2 + 1.1]} castShadow receiveShadow>
            <boxGeometry args={[6.2, 3.1, 2.2]} /><meshStandardMaterial color={wallColor} roughness={0.84} />
          </mesh>
          <mesh position={[0, 3.15, d / 2 + 1.1]} receiveShadow>
            <boxGeometry args={[6.3, 0.14, 2.3]} /><meshStandardMaterial color="#D8D0C4" roughness={0.8} />
          </mesh>
          {/* Stone cladding strip */}
          <mesh position={[0, 0.7, d / 2 + 0.06]} castShadow>
            <boxGeometry args={[w, 1.4, 0.14]} /><meshStandardMaterial color="#B8A888" roughness={0.9} />
          </mesh>
          {[[-2.6, d / 2 + 1.9], [2.6, d / 2 + 1.9], [-2.6, d / 2 + 0.4], [2.6, d / 2 + 0.4]].map(([px, pz], i) => (
            <Pillar key={i} position={[px, 1.6, pz]} />
          ))}
          {[0.56, 0.34, 0.12].map((sy, i) => (
            <mesh key={i} position={[0, sy, d / 2 + 2.5 + i * 0.28]} receiveShadow>
              <boxGeometry args={[4.2, 0.22, 0.7]} /><meshStandardMaterial color="#C8B8A8" roughness={0.9} />
            </mesh>
          ))}
          {/* Fascia */}
          {[d / 2 + 0.06, -d / 2 - 0.06].map((fz, i) => (
            <mesh key={i} position={[0, FLOOR_H - 0.12, fz]} castShadow>
              <boxGeometry args={[w + 0.2, 0.3, 0.12]} /><meshStandardMaterial color="#2A2420" roughness={0.75} />
            </mesh>
          ))}
          {/* Wall lights beside door */}
          <WallLight position={[-1.2, 2.4, d / 2 + 2.32]} on={glowOn} />
          <WallLight position={[ 1.2, 2.4, d / 2 + 2.32]} on={glowOn} />
        </>
      )}

      {/* Balcony â€” upper floors */}
      {!isGround && (
        <>
          <mesh position={[0, -0.1, d / 2 + 0.5]} castShadow>
            <boxGeometry args={[w, 0.18, 1.0]} /><meshStandardMaterial color="#C8C0B4" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.55, d / 2 + 0.95]}>
            <boxGeometry args={[w, 0.08, 0.07]} /><meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
          {Array.from({ length: Math.ceil(w / 0.8) }, (_, i) => {
            const bx = -w / 2 + 0.4 + i * 0.8;
            return (
              <mesh key={i} position={[bx, 0.28, d / 2 + 0.95]}>
                <boxGeometry args={[0.06, 0.6, 0.06]} /><meshStandardMaterial color="#DDDDDD" roughness={0.45} />
              </mesh>
            );
          })}
        </>
      )}

      {showWindows && (
        <>
          <WindowMesh position={[-3.2, midY,  d / 2 + 0.06]} rotation={[0, 0, 0]} glowOn={glowOn} />
          <WindowMesh position={[ 3.2, midY,  d / 2 + 0.06]} rotation={[0, 0, 0]} glowOn={glowOn} />
          {isGround && (
            <>
              <WindowMesh position={[-3.4, midY + 1.0, d / 2 + 0.06]} rotation={[0, 0, 0]} size={[0.9, 0.6]} glowOn={glowOn} />
              <WindowMesh position={[ 3.4, midY + 1.0, d / 2 + 0.06]} rotation={[0, 0, 0]} size={[0.9, 0.6]} glowOn={glowOn} />
            </>
          )}
          <WindowMesh position={[ w / 2 + 0.06, midY,  1.6]} rotation={[0, Math.PI / 2, 0]} glowOn={glowOn} />
          <WindowMesh position={[ w / 2 + 0.06, midY, -1.6]} rotation={[0, Math.PI / 2, 0]} glowOn={glowOn} />
          <WindowMesh position={[-w / 2 - 0.06, midY,  1.6]} rotation={[0, Math.PI / 2, 0]} glowOn={glowOn} />
          <WindowMesh position={[-w / 2 - 0.06, midY, -1.6]} rotation={[0, Math.PI / 2, 0]} glowOn={glowOn} />
          <WindowMesh position={[-2, midY, -d / 2 - 0.06]} rotation={[0, Math.PI, 0]} glowOn={glowOn} />
          <WindowMesh position={[ 2, midY, -d / 2 - 0.06]} rotation={[0, Math.PI, 0]} glowOn={glowOn} />
          {glowOn && (
            <>
              <pointLight position={[-3.2, midY, d / 2 + 0.8]} color="#FFDD88" intensity={0.6} distance={4} decay={2} />
              <pointLight position={[ 3.2, midY, d / 2 + 0.8]} color="#FFDD88" intensity={0.6} distance={4} decay={2} />
              <pointLight position={[0, midY, -d / 2 - 0.8]} color="#FFDD88" intensity={0.4} distance={4} decay={2} />
            </>
          )}
        </>
      )}

      {isGround && showDoor && (
        <DoorMesh position={[0, 1.3, d / 2 + 2.27]} rotation={[0, 0, 0]} />
      )}
    </group>
  );
}

// â”€â”€â”€ HOUSE MODEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HouseModel({ wallColor, roofColor, stage, timeMode, selected, specs, floors }) {
  const glowOn    = timeMode === 'night' || timeMode === 'evening';
  const numFloors = Math.max(1, Math.min(10, Number(floors) || 1));
  const W = 10.2, D = 8.2;

  const stageFoundation = stage >= 0;
  const stageWalls      = stage >= 1;
  const stageRoof       = stage >= 2;
  const stageFinishing  = stage >= 3;

  const hasFoundation = selected.includes('foundation');
  const hasBlockwork  = selected.includes('blockwork');
  const hasRoofing    = selected.includes('roofing');
  const hasWindows    = selected.includes('windows');
  const hasDecking    = selected.includes('decking');

  const wallTypeOverride = WALL_COLOR_OVERRIDE[specs?.wallType];
  const effectiveWall    = wallTypeOverride || wallColor;
  const roofType         = specs?.roofType  || 'gable';
  const foundType        = specs?.foundation || 'strip';
  const roofY = BASE_Y + numFloors * FLOOR_H + Math.max(0, numFloors - 1) * SLAB_T;

  return (
    <group>
      {stageFoundation && hasFoundation && <FoundationMesh foundationType={foundType} w={W} d={D} />}

      {stageWalls && hasBlockwork && Array.from({ length: numFloors }, (_, i) => (
        <FloorLevel key={i} floorIndex={i} numFloors={numFloors}
          yBase={BASE_Y + i * (FLOOR_H + SLAB_T)} w={W} d={D}
          wallColor={effectiveWall} isGround={i === 0}
          showWindows={stageFinishing && hasWindows}
          showDoor={stageFinishing && hasWindows}
          glowOn={glowOn} />
      ))}

      {stageWalls && (hasBlockwork || hasDecking) && numFloors > 1 &&
        Array.from({ length: numFloors - 1 }, (_, i) => {
          const slabY = BASE_Y + (i + 1) * FLOOR_H + i * SLAB_T;
          return (
            <mesh key={i} position={[0, slabY + SLAB_T / 2, 0]} receiveShadow>
              <boxGeometry args={[W + 0.2, SLAB_T, D + 0.2]} />
              <meshStandardMaterial color="#C0B8B0" roughness={0.88} />
            </mesh>
          );
        })
      }

      {stageRoof && hasRoofing && <RoofMesh roofType={roofType} y={roofY} w={W} d={D} color={roofColor} />}

      {/* Porch overhead light at night */}
      {stageFinishing && glowOn && (
        <pointLight position={[0, 2.6, D / 2 + 2.4]} color="#FF9944" intensity={2.0} distance={10} decay={2} />
      )}
    </group>
  );
}

// â”€â”€â”€ COMPOUND â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CompoundEnvironment({ stage, timeMode, selected }) {
  const lightsOn = timeMode === 'night' || timeMode === 'evening';
  const complete  = stage >= 4;
  const hasFence  = selected.includes('fencing');
  const hasSite   = selected.includes('siteworks');

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} /><meshStandardMaterial color="#2A5018" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[29, 35]} /><meshStandardMaterial color="#316020" roughness={0.95} />
      </mesh>

      {/* Driveway */}
      {hasSite && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 11]}>
            <planeGeometry args={[8.5, 14]} /><meshStandardMaterial color="#A8987C" roughness={0.88} />
          </mesh>
          {[-3, -1, 1, 3].map(x => (
            <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, 11]}>
              <planeGeometry args={[0.04, 14]} /><meshStandardMaterial color="#887868" />
            </mesh>
          ))}
          {[6, 8, 10, 12, 14, 16].map(z => (
            <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, z]}>
              <planeGeometry args={[8.5, 0.04]} /><meshStandardMaterial color="#887868" />
            </mesh>
          ))}
        </>
      )}

      {/* Compound walls */}
      {hasFence && (
        <>
          {[
            { pos: [-15, 1.1, 0],  args: [0.42, 2.2, 36] },
            { pos: [15, 1.1, 0],   args: [0.42, 2.2, 36] },
            { pos: [0, 1.1, -18],  args: [30.42, 2.2, 0.42] },
            { pos: [-10, 1.1, 18], args: [10, 2.2, 0.42] },
            { pos: [10, 1.1, 18],  args: [10, 2.2, 0.42] },
          ].map((w, i) => (
            <mesh key={i} position={w.pos} castShadow receiveShadow>
              <boxGeometry args={w.args} /><meshStandardMaterial color="#D4C8B0" roughness={0.9} />
            </mesh>
          ))}
          {/* Decorative pillar caps on wall */}
          {[-14.5, -9.5, -4.5, 0.5, 5.5, 10.5, 14.5].map((x, i) => (
            <mesh key={i} position={[x, 2.4, 18]} castShadow>
              <boxGeometry args={[0.45, 0.4, 0.45]} /><meshStandardMaterial color="#E8D8C0" roughness={0.8} />
            </mesh>
          ))}
          {/* Gate posts */}
          {[-5.4, 5.4].map((x, i) => (
            <mesh key={i} position={[x, 1.6, 18]} castShadow>
              <boxGeometry args={[0.65, 3.2, 0.65]} /><meshStandardMaterial color="#C8B8A0" roughness={0.72} />
            </mesh>
          ))}
          {/* Gate panels */}
          {[-2.7, 2.7].map((x, i) => (
            <group key={i} position={[x, 1.15, 18]}>
              <mesh><boxGeometry args={[5.0, 2.3, 0.14]} /><meshStandardMaterial color="#2A2820" roughness={0.5} metalness={0.4} /></mesh>
              {[-2.2, -1.6, -1.0, -0.4, 0.2, 0.8, 1.4, 2.0].map(bx => (
                <mesh key={bx} position={[bx * 0.6, 0, 0.08]}>
                  <boxGeometry args={[0.07, 2.1, 0.07]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
                </mesh>
              ))}
            </group>
          ))}
          {/* Compound lights */}
          {[[-14.8, 12], [14.8, 12], [-14.8, -12], [14.8, -12], [-4.8, 18.8], [4.8, 18.8]].map(([x, z], i) => (
            <CompoundLamp key={i} position={[x, 0, z]} on={lightsOn} />
          ))}
        </>
      )}

      {/* Trees, hedges, cars */}
      {hasSite && complete && (
        <>
          <Tree position={[-12, 0, 8]} scale={1.2} />
          <Tree position={[12, 0, 8]} scale={1.1} />
          <Tree position={[-12, 0, -9]} scale={0.95} />
          <Tree position={[12, 0, -9]} scale={1.05} />
          <PalmTree position={[-7, 0, 14]} />
          <PalmTree position={[7, 0, 14]} />
          {[-5, -3, -1, 1, 3, 5].map(x => (
            <mesh key={x} position={[x, 0.55, 7.8]} castShadow>
              <sphereGeometry args={[0.85, 8, 6]} /><meshStandardMaterial color="#1a5218" roughness={0.92} />
            </mesh>
          ))}
          {/* Flower pots beside door */}
          {[-2, 2].map((x, i) => (
            <group key={i} position={[x, 0.6, 6.8]}>
              <mesh><cylinderGeometry args={[0.22, 0.18, 0.4, 8]} /><meshStandardMaterial color="#9A4A20" roughness={0.85} /></mesh>
              <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.28, 8, 8]} /><meshStandardMaterial color="#1a6a1a" roughness={0.9} /></mesh>
            </group>
          ))}
          <CarMesh position={[-2.2, 0.33, 13]} color="#3A4A5A" />
          <CarMesh position={[2.5, 0.33, 15.5]} color="#2A3020" rotation={[0, 0.25, 0]} />
        </>
      )}
    </group>
  );
}

// â”€â”€â”€ HOTSPOT MESH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HotspotMesh({ hotspot, active, onClick }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.8) * 0.14);
  });
  return (
    <group position={hotspot.pos}>
      <mesh ref={meshRef} onClick={e => { e.stopPropagation(); onClick(hotspot.id); }}>
        <sphereGeometry args={[0.28, 14, 14]} />
        <meshStandardMaterial color={active ? '#1D9E75' : '#ffffff'} emissive={active ? '#1D9E75' : '#ffffff'} emissiveIntensity={active ? 2 : 1} transparent opacity={0.92} />
      </mesh>
      <mesh><torusGeometry args={[0.42, 0.05, 8, 24]} /><meshStandardMaterial color={active ? '#1D9E75' : '#88DDBB'} emissive={active ? '#1D9E75' : '#44AA77'} emissiveIntensity={1.2} /></mesh>
      <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(4,16,10,0.94)', border: '1px solid rgba(29,158,117,0.7)', borderRadius: '7px', padding: '4px 10px', color: '#4ade80', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', backdropFilter: 'blur(12px)', transform: 'translateY(-36px)', letterSpacing: '0.02em', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
          {hotspot.icon} {hotspot.label}
        </div>
      </Html>
    </group>
  );
}

// â”€â”€â”€ LIGHTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneLights({ timeMode }) {
  const isNight = timeMode === 'night', isEvening = timeMode === 'evening';
  return (
    <>
      <ambientLight intensity={isNight ? 0.04 : isEvening ? 0.18 : 0.45} color={isNight ? '#0A1020' : '#ffffff'} />
      {!isNight && (
        <directionalLight position={isEvening ? [25, 6, 30] : [45, 55, 20]} intensity={isEvening ? 0.7 : 1.1}
          color={isEvening ? '#FF8833' : '#FFF5EE'} castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-near={0.5} shadow-camera-far={130}
          shadow-camera-left={-42} shadow-camera-right={42}
          shadow-camera-top={42} shadow-camera-bottom={-42}
          shadow-bias={-0.0005} />
      )}
      {!isNight && (
        <directionalLight position={isEvening ? [-20, 15, -15] : [-25, 20, -10]}
          intensity={isEvening ? 0.25 : 0.3} color={isEvening ? '#9966FF' : '#CCEEFF'} />
      )}
      {/* Warm fill from below at evening */}
      {isEvening && <pointLight position={[0, 1, 5]} color="#FF6622" intensity={0.15} distance={30} decay={2} />}
      {isNight && <directionalLight position={[-22, 32, -10]} intensity={0.05} color="#6677AA" castShadow />}
    </>
  );
}

// â”€â”€â”€ CAMERA CONTROLLER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getDynamicPresets(floors) {
  const n = Math.max(1, Math.min(10, Number(floors) || 1));
  const topH = BASE_Y + n * (FLOOR_H + SLAB_T);
  const look = [0, topH * 0.45, 0];
  return {
    front:    { pos: [0,  topH * 0.6 + 4,  topH * 1.4 + 14], target: look },
    aerial:   { pos: [4,  topH * 1.5 + 14, topH * 0.5 + 4],  target: look },
    interior: { pos: [0,  topH * 0.3 + 2,  topH * 0.2 + 2],  target: [0, topH * 0.3, 0] },
    roof:     { pos: [0,  topH * 1.2 + 4,  topH * 0.3 + 2],  target: [0, topH, 0] },
    compound: { pos: [-topH * 1.1 - 14, topH * 0.5 + 4, 6],  target: look },
    side:     { pos: [topH * 1.1 + 14,  topH * 0.5 + 4, 2],  target: look },
  };
}

function CameraController({ preset, orbitRef, floors }) {
  const { camera } = useThree();
  const presets = useMemo(() => getDynamicPresets(floors), [floors]);
  const tPos  = useMemo(() => new THREE.Vector3(...(presets[preset]?.pos    ?? [0, 5, 22])), [presets, preset]);
  const tLook = useMemo(() => new THREE.Vector3(...(presets[preset]?.target ?? [0, 2,  0])), [presets, preset]);
  useFrame(() => {
    camera.position.lerp(tPos, 0.05);
    if (orbitRef.current) orbitRef.current.target.lerp(tLook, 0.05);
  });
  return null;
}

function NightSky() {
  return (
    <>
      <Stars radius={80} depth={50} count={4000} factor={4} fade saturation={0.5} />
      <mesh><sphereGeometry args={[78, 16, 16]} /><meshBasicMaterial color="#010408" side={THREE.BackSide} /></mesh>
    </>
  );
}

// â”€â”€â”€ SCENE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Scene({ wallColor, roofColor, stage, timeMode, showHotspots, activeHotspot, onHotspot, cameraPreset, selected, specs, floors }) {
  const orbitRef = useRef();
  const isNight = timeMode === 'night', isEvening = timeMode === 'evening';
  return (
    <>
      <CameraController preset={cameraPreset} orbitRef={orbitRef} floors={floors} />
      {timeMode !== 'night' ? (
        <Sky sunPosition={isEvening ? [80, 5, 60] : [100, 80, 20]}
          rayleigh={isEvening ? 3.5 : 0.5} turbidity={isEvening ? 12 : 6}
          mieCoefficient={isEvening ? 0.018 : 0.005} mieDirectionalG={isEvening ? 0.94 : 0.8}
          azimuth={isEvening ? 0.12 : 0.25} />
      ) : <NightSky />}
      <fog attach="fog" args={isNight ? ['#010408', 40, 100] : isEvening ? ['#1A0A18', 60, 120] : ['#C8DCF0', 80, 140]} />
      <SceneLights timeMode={timeMode} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={70} blur={2.5} far={35} color={isNight ? '#000010' : '#000000'} />
      <HouseModel wallColor={wallColor} roofColor={roofColor} stage={stage} timeMode={timeMode}
        selected={selected} specs={specs} floors={floors} />
      <CompoundEnvironment stage={stage} timeMode={timeMode} selected={selected} />
      {showHotspots && HOTSPOTS.map(hs => (
        <HotspotMesh key={hs.id} hotspot={hs} active={activeHotspot === hs.id} onClick={onHotspot} />
      ))}
      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={isNight ? 1.2 : isEvening ? 0.8 : 0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.35} darkness={isNight ? 0.9 : 0.65} />
      </EffectComposer>
      <OrbitControls ref={orbitRef} enableDamping dampingFactor={0.06}
        minPolarAngle={0.08} maxPolarAngle={Math.PI / 2.05} minDistance={5} maxDistance={100} target={[0, 2, 0]} />
    </>
  );
}

function Loader() {
  return (
    <div className={styles.loaderWrap}>
      <div className={styles.loaderRing} />
      <div className={styles.loaderText}>Building your 3D scene...</div>
    </div>
  );
}

// â”€â”€â”€ MAIN EXPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Visualizer3D({ phases, grandTotal, phaseTotal, form, specs, selected, onBack, onNext }) {
  const gt  = grandTotal || 0;
  const sel = selected   || [];
  const fl  = form?.floors || 1;
  // Ensure all specs are present with fallback defaults
  const sp  = {
    foundation: specs?.foundation || 'strip',
    wallType: specs?.wallType || 'sandcrete9',
    slabType: specs?.slabType || 'hollow',
    roofType: specs?.roofType || 'gable'
  };

  const [timeMode,      setTimeMode]      = useState('evening');
  const [cameraPreset,  setCameraPreset]  = useState('front');
  const [stage,         setStage]         = useState(4);
  const [showHotspots,  setShowHotspots]  = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [wallColor,     setWallColor]     = useState('#F2EDE4');
  const [roofColor,     setRoofColor]     = useState('#374151');
  const containerRef = useRef();

  const handleHotspot = useCallback(id => setActiveHotspot(prev => prev === id ? null : id), []);
  const activeHotspotData = HOTSPOTS.find(h => h.id === activeHotspot);
  const toneExposure = timeMode === 'night' ? 0.4 : timeMode === 'evening' ? 0.78 : 1.0;
  const numFloors = Number(fl) || 1;
  const floorLabel = numFloors === 1 ? 'Bungalow' : `${numFloors}-Storey`;
  const wallLabel  = { sandcrete9: '9" Sandcrete', sandcrete6: '6" Sandcrete', brick: 'Face Brick', icf: 'RC Frame' }[sp.wallType] || sp.wallType;

  return (
    <div ref={containerRef} className={styles.root}>

      {/* â•â• TOP BAR (overlay) â•â• */}
      <div className={styles.topBar}>
        {/* Time of day */}
        <div className={styles.timePills}>
          {[{ id: 'day', icon: '☀️', label: 'Day' }, { id: 'evening', icon: '🌅', label: 'Evening' }, { id: 'night', icon: '🌙', label: 'Night' }].map(t => (
            <button key={t.id} className={`${styles.timePill} ${timeMode === t.id ? styles.timePillOn : ''}`} onClick={() => setTimeMode(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Info chips */}
        <div className={styles.infoChips}>
          <span className={styles.infoChip}>🏗️ {floorLabel}</span>
          <span className={styles.infoChip}>🧱 {wallLabel}</span>
          <span className={styles.infoChip}>🏠 {sp.roofType?.charAt(0).toUpperCase() + sp.roofType?.slice(1)}</span>
          <span className={styles.infoChip}>⬇️ {sp.foundation?.charAt(0).toUpperCase() + sp.foundation?.slice(1)}</span>
        </div>

        {/* Top right controls */}
        <div className={styles.topRight}>
          <div className={styles.topRightGroup}>
            <button className={`${styles.toolBtn} ${showHotspots ? styles.toolBtnOn : ''}`} onClick={() => setShowHotspots(p => !p)}> Hotspots</button>
            <button className={styles.toolBtn} onClick={() => { if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.(); else document.exitFullscreen?.(); }}> Fullscreen</button>
          </div>
        </div>
      </div>

      {/* â•â• CANVAS (full bleed) â•â• */}
      <div className={styles.canvasWrap}>
        <Suspense fallback={<Loader />}>
          <Canvas shadows camera={{ position: [0, 5, 22], fov: 50 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: toneExposure }}>
            <Scene wallColor={wallColor} roofColor={roofColor} stage={stage} timeMode={timeMode}
              showHotspots={showHotspots} activeHotspot={activeHotspot} onHotspot={handleHotspot}
              cameraPreset={cameraPreset} selected={sel} specs={sp} floors={fl} />
          </Canvas>
        </Suspense>

        {/* â•â• RIGHT CAMERA PANEL (overlay) â•â• */}
        <div className={styles.cameraPanel}>
          <div className={styles.cameraPanelTitle}>Views</div>
          {CAMERA_VIEWS.map(v => (
            <button key={v.id} className={`${styles.camBtn} ${cameraPreset === v.id ? styles.camBtnOn : ''}`} onClick={() => setCameraPreset(v.id)}>
              <span className={styles.camBtnIcon}>{v.icon}</span>
              <span className={styles.camBtnLabel}>{v.label}</span>
            </button>
          ))}

          <div className={styles.panelDivider} />

          {/* Roof swatches */}
          <div className={styles.swatchGroup}>
            <div className={styles.swatchGroupLabel}>🏠 Roof</div>
            <div className={styles.swatches}>
              {Object.entries(ROOF_SWATCHES).map(([name, hex]) => (
                <button key={name} title={name} className={`${styles.swatch} ${roofColor === hex ? styles.swatchOn : ''}`} style={{ background: hex }} onClick={() => setRoofColor(hex)} />
              ))}
            </div>
          </div>
          <div className={styles.swatchGroup}>
            <div className={styles.swatchGroupLabel}>🧱 Walls</div>
            <div className={styles.swatches}>
              {Object.entries(WALL_SWATCHES).map(([name, hex]) => (
                <button key={name} title={name} className={`${styles.swatch} ${wallColor === hex ? styles.swatchOn : ''}`} style={{ background: hex }} onClick={() => setWallColor(hex)} />
              ))}
            </div>
          </div>
        </div>

        {/* â•â• COST CARD (bottom-left overlay) â•â• */}
        {gt > 0 && (
          <div className={styles.costCard}>
            <div className={styles.costLabel}>Est. Total</div>
            <div className={styles.costVal}>{gt >= 1_000_000 ? `₦${(gt / 1_000_000).toFixed(1)}M` : `₦${(gt / 1_000).toFixed(0)}K`}</div>
            <div className={styles.costSub}>{sel.length} phase{sel.length !== 1 ? 's' : ''} · {numFloors} floor{numFloors !== 1 ? 's' : ''}</div>
          </div>
        )}

        {/* â•â• DRAG HINT â•â• */}

        {/* â•â• HOTSPOT INFO PANEL â•â• */}
        {activeHotspotData && (
          <div className={styles.hotspotPanel}>
            <button className={styles.hotspotClose} onClick={() => setActiveHotspot(null)}>✕</button>
            <div className={styles.hotspotIcon}>{activeHotspotData.icon}</div>
            <div className={styles.hotspotTitle}>{activeHotspotData.label}</div>
            <div className={styles.hotspotMat}>{activeHotspotData.mat}</div>
            <div className={styles.hotspotPrice}>{activeHotspotData.price}</div>
            <div className={styles.hotspotSpec}>{activeHotspotData.spec}</div>
            <div className={styles.hotspotBrand}>Brand: {activeHotspotData.brand}</div>
          </div>
        )}
      </div>

      {/* â•â• BUILD PROGRESS BAR â•â• */}
      <div className={styles.buildBar}>
        {onBack && <button className={styles.navBtn} onClick={onBack}>← Back</button>}

        <div className={styles.buildStages}>
          <div className={styles.buildTrack}>
            <div className={styles.buildFill} style={{ width: `${(stage / (BUILD_STAGES.length - 1)) * 100}%` }} />
          </div>
          {BUILD_STAGES.map((s, i) => (
            <button key={s.id}
              className={`${styles.buildStep} ${stage >= i ? styles.buildStepDone : ''} ${stage === i ? styles.buildStepActive : ''}`}
              onClick={() => setStage(i)}>
              <div className={styles.buildDot}>
                {stage >= i ? <span className={styles.buildDotCheck}>✓</span> : <span className={styles.buildDotIcon}>{s.icon}</span>}
              </div>
              <span className={styles.buildStepLabel}>{s.label}</span>
            </button>
          ))}
        </div>
        {/* Fullscreen */}
          <button className={styles.bottomTool} onClick={() => { if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.(); else document.exitFullscreen?.(); }} title="Fullscreen">⛶ <span>Fullscreen</span></button>
        </div>

        {onNext && <button className={styles.navBtnPrimary} onClick={onNext}>View BOQ →</button>}
      </div>
  );
}

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface HBlock3DProps {
  selectedFloor: number | null;
  onFloorSelect: (floor: number) => void;
  resetSignal: number;
}

/* =========================================================
   FLOOR
   ========================================================= */

function Floor({
  floorNumber,
  selectedFloor,
  onSelect,
}: {
  floorNumber: number;
  selectedFloor: number | null;
  onSelect: (floor: number) => void;
}) {
  const FLOOR_HEIGHT = 1.35;

  const height =
    FLOOR_HEIGHT / 2 +
    (floorNumber - 1) * FLOOR_HEIGHT;

  const isSelected = selectedFloor === floorNumber;

  const buildingColor = isSelected
    ? "#f59e0b"
    : "#e8cfa9";

  const connectorColor = isSelected
    ? "#f59e0b"
    : "#ead8bd";

  return (
    <group
      position={[0, height, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(floorNumber);
      }}
    >
      {/* =================================================
          LEFT WING
          ================================================= */}

      <mesh
        position={[-4, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, FLOOR_HEIGHT, 5]} />
        <meshStandardMaterial
          color={buildingColor}
          roughness={0.8}
        />
      </mesh>

      {/* =================================================
          RIGHT WING
          ================================================= */}

      <mesh
        position={[4, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, FLOOR_HEIGHT, 5]} />
        <meshStandardMaterial
          color={buildingColor}
          roughness={0.8}
        />
      </mesh>

      {/* =================================================
          CENTRE CONNECTING BLOCK
          ================================================= */}

      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, FLOOR_HEIGHT, 3.6]} />
        <meshStandardMaterial
          color={connectorColor}
          roughness={0.8}
        />
      </mesh>

      {/* =================================================
          FRONT FACADE
          ================================================= */}

      <mesh
        position={[-4, 0.35, 2.55]}
        castShadow
      >
        <boxGeometry args={[3.6, 0.22, 0.35]} />
        <meshStandardMaterial color="#b97852" />
      </mesh>

      <mesh
        position={[4, 0.35, 2.55]}
        castShadow
      >
        <boxGeometry args={[3.6, 0.22, 0.35]} />
        <meshStandardMaterial color="#b97852" />
      </mesh>

      {/* =================================================
          FRONT WINDOWS
          ================================================= */}

      {[-5.1, -4.0, -2.9].map((x) => (
        <mesh
          key={`front-left-${x}`}
          position={[x, 0.1, 2.56]}
        >
          <boxGeometry args={[0.65, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#4f7892"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}

      {[2.9, 4.0, 5.1].map((x) => (
        <mesh
          key={`front-right-${x}`}
          position={[x, 0.1, 2.56]}
        >
          <boxGeometry args={[0.65, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#4f7892"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* =================================================
          BACK WINDOWS
          ================================================= */}

      {[-5.1, -4.0, -2.9].map((x) => (
        <mesh
          key={`back-left-${x}`}
          position={[x, 0.1, -2.56]}
        >
          <boxGeometry args={[0.65, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#4f7892"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}

      {[2.9, 4.0, 5.1].map((x) => (
        <mesh
          key={`back-right-${x}`}
          position={[x, 0.1, -2.56]}
        >
          <boxGeometry args={[0.65, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#4f7892"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* =================================================
          LEFT SIDE WINDOWS
          ================================================= */}

      {[-1.5, 0, 1.5].map((z) => (
        <mesh
          key={`left-side-${z}`}
          position={[-6.01, 0.1, z]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[0.65, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#4f7892"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* =================================================
          RIGHT SIDE WINDOWS
          ================================================= */}

      {[-1.5, 0, 1.5].map((z) => (
        <mesh
          key={`right-side-${z}`}
          position={[6.01, 0.1, z]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[0.65, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#4f7892"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   ENTRANCE
   ========================================================= */

function Entrance() {
  return (
    <group position={[0, 1.7, 2.2]}>
      {/* Main entrance structure */}

      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 3.4, 0.8]} />

        <meshStandardMaterial color="#d9826b" />
      </mesh>

      {/* Entrance glass door */}

      <mesh
        position={[0, -0.5, 0.45]}
        castShadow
      >
        <boxGeometry args={[2.2, 1.8, 0.1]} />

        <meshStandardMaterial
          color="#4f91ad"
          metalness={0.3}
          roughness={0.25}
        />
      </mesh>

      {/* Entrance roof */}

      <mesh
        position={[0, 2.0, 0]}
        castShadow
      >
        <coneGeometry args={[1.9, 1.4, 4]} />

        <meshStandardMaterial color="#d9826b" />
      </mesh>

      {/* Entrance base */}

      <mesh
        position={[0, -1.68, 0]}
        receiveShadow
      >
        <boxGeometry args={[3.8, 0.15, 1.4]} />

        <meshStandardMaterial color="#d9826b" />
      </mesh>
    </group>
  );
}

/* =========================================================
   CENTRE CLASSROOMS
   ========================================================= */

function CentreClassrooms({
  floorNumber,
  selectedFloor,
}: {
  floorNumber: number;
  selectedFloor: number | null;
}) {
  const FLOOR_HEIGHT = 1.35;

  const height =
    FLOOR_HEIGHT / 2 +
    (floorNumber - 1) * FLOOR_HEIGHT;

  const isSelected =
    floorNumber === selectedFloor;

  const classroomColor = isSelected
    ? "#f4c46b"
    : "#d7bea0";

  return (
    <group position={[0, height, 0]}>
      {/* =================================================
          LEFT CENTRE CLASSROOM
          ================================================= */}

      <mesh
        position={[-1.05, 0.08, -0.35]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.7, 1.05, 1.7]} />
        <meshStandardMaterial
          color={classroomColor}
          roughness={0.8}
        />
      </mesh>

      {/* =================================================
          RIGHT CENTRE CLASSROOM
          ================================================= */}

      <mesh
        position={[1.05, 0.08, -0.35]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.7, 1.05, 1.7]} />
        <meshStandardMaterial
          color={classroomColor}
          roughness={0.8}
        />
      </mesh>

      {/* =================================================
          CLASSROOM DOORS
          ================================================= */}

      <mesh
        position={[-1.05, 0.02, 0.53]}
      >
        <boxGeometry args={[0.5, 0.85, 0.08]} />
        <meshStandardMaterial color="#65483a" />
      </mesh>

      <mesh
        position={[1.05, 0.02, 0.53]}
      >
        <boxGeometry args={[0.5, 0.85, 0.08]} />
        <meshStandardMaterial color="#65483a" />
      </mesh>

      {/* =================================================
          CLASSROOM WINDOWS
          ================================================= */}

      <mesh
        position={[-1.05, 0.2, -1.22]}
      >
        <boxGeometry args={[0.85, 0.45, 0.08]} />
        <meshStandardMaterial
          color="#4f7892"
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      <mesh
        position={[1.05, 0.2, -1.22]}
      >
        <boxGeometry args={[0.85, 0.45, 0.08]} />
        <meshStandardMaterial
          color="#4f7892"
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* =================================================
          CENTRE CORRIDOR
          ================================================= */}

      <mesh
        position={[0, 0.03, 0.85]}
        receiveShadow
      >
        <boxGeometry args={[3.4, 0.08, 0.45]} />
        <meshStandardMaterial color="#b99b7a" />
      </mesh>
    </group>
  );
}

/* =========================================================
   GROUND
   ========================================================= */

function Ground() {
  return (
    <group>
      {/* Main grass surface */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[35, 25]} />

        <meshStandardMaterial color="#7b9a68" />
      </mesh>

      {/* Main road */}

      <mesh
        position={[0, 0.02, 7]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 5]} />

        <meshStandardMaterial color="#3f4144" />
      </mesh>

      {/* Entrance pathway */}

      <mesh
        position={[0, 0.03, 4.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />

        <meshStandardMaterial color="#b7a99a" />
      </mesh>

      {/* Left side road */}

      <mesh
        position={[-9, 0.025, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 18]} />

        <meshStandardMaterial color="#45474a" />
      </mesh>

      {/* Right side road */}

      <mesh
        position={[9, 0.025, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 18]} />

        <meshStandardMaterial color="#45474a" />
      </mesh>
    </group>
  );
}

/* =========================================================
   UNDERGROUND WATER PIPELINES
   ========================================================= */

function UndergroundWaterPipes() {
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: "#3b82f6",
    transparent: true,
    opacity: 0.85,
    metalness: 0.15,
    roughness: 0.35,
  });

  return (
    <group>
      {/* Main underground water pipeline */}

      <mesh
        position={[0, -0.8, 5]}
        rotation={[0, 0, Math.PI / 2]}
        material={pipeMaterial}
      >
        <cylinderGeometry args={[0.18, 0.18, 18, 16]} />
      </mesh>

      {/* Pipeline entering the building */}

      <mesh
        position={[0, -0.8, 2.5]}
        rotation={[Math.PI / 2, 0, 0]}
        material={pipeMaterial}
      >
        <cylinderGeometry args={[0.15, 0.15, 5, 16]} />
      </mesh>

      {/* Left branch */}

      <mesh
        position={[-4, -0.8, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={pipeMaterial}
      >
        <cylinderGeometry args={[0.12, 0.12, 8, 16]} />
      </mesh>

      {/* Right branch */}

      <mesh
        position={[4, -0.8, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={pipeMaterial}
      >
        <cylinderGeometry args={[0.12, 0.12, 8, 16]} />
      </mesh>

      {/* Vertical water connection */}

      <mesh
        position={[0, -0.35, 0]}
        material={pipeMaterial}
      >
        <cylinderGeometry args={[0.14, 0.14, 0.9, 16]} />
      </mesh>
    </group>
  );
}

/* =========================================================
   TREE
   ========================================================= */

function Tree({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Trunk - bottom exactly at surface */}

      <mesh
        position={[0, 0.75, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.18, 0.25, 1.5, 8]}
        />

        <meshStandardMaterial color="#6b4b32" />
      </mesh>

      {/* Tree crown */}

      <mesh
        position={[0, 1.8, 0]}
        castShadow
      >
        <sphereGeometry args={[1.1, 16, 16]} />

        <meshStandardMaterial color="#3f7542" />
      </mesh>
    </group>
  );
}

function WaterTank() {
  const ROOF_Y = 5 * 1.35; // 6.75

  return (
    <group position={[4.5, ROOF_Y, 0]}>

      {/* ================================
          WATER TANK
          Directly attached to roof
         ================================ */}

      {/* Tank body */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.25, 1.5, 32]} />
        <meshStandardMaterial
          color="#d8dce0"
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>

      {/* Tank lid */}
      <mesh position={[0, 1.52, 0]} castShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.12, 32]} />
        <meshStandardMaterial color="#c5c9ce" />
      </mesh>

      {/* Water level */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.04, 32]} />
        <meshStandardMaterial
          color="#4f91ad"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ==================================
          TANK OUTLET
          Goes directly toward BACK
         ================================== */}

      <mesh
        position={[0, 0.25, -1.25]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.14, 0.14, 2.5, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

    </group>
  );
}

function WaterPipelineSystem() {

  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: "#3b82f6",
    metalness: 0.15,
    roughness: 0.35,
  });

  const undergroundMaterial = new THREE.MeshStandardMaterial({
    color: "#2563eb",
    metalness: 0.1,
    roughness: 0.4,
    transparent: true,
    opacity: 0.75,
  });

  const ROOF_Y = 5 * 1.35; // 6.75

  /*
   * ============================================
   * PIPE HELPERS
   * ============================================
   */

  const verticalPipe = (
    x: number,
    y: number,
    z: number,
    height: number,
    radius = 0.09,
    material = pipeMaterial
  ) => (
    <mesh
      position={[x, y, z]}
      material={material}
      castShadow
    >
      <cylinderGeometry
        args={[radius, radius, height, 16]}
      />
    </mesh>
  );

  const pipeX = (
    x: number,
    y: number,
    z: number,
    length: number,
    radius = 0.08,
    material = pipeMaterial
  ) => (
    <mesh
      position={[x, y, z]}
      rotation={[0, 0, Math.PI / 2]}
      material={material}
      castShadow
    >
      <cylinderGeometry
        args={[radius, radius, length, 16]}
      />
    </mesh>
  );

  const pipeZ = (
    x: number,
    y: number,
    z: number,
    length: number,
    radius = 0.08,
    material = pipeMaterial
  ) => (
    <mesh
      position={[x, y, z]}
      rotation={[Math.PI / 2, 0, 0]}
      material={material}
      castShadow
    >
      <cylinderGeometry
        args={[radius, radius, length, 16]}
      />
    </mesh>
  );

  return (
    <group>

      {/* ==================================================
          1. TANK → BACK OF BUILDING
         ================================================== */}

      /*
       * Tank is at x = 4.5
       * Right wing backside = z = -2.5
       *
       * This pipe goes from the tank outlet
       * all the way to the rear wall.
       */

      {pipeZ(
        4.5,
        ROOF_Y + 0.25,
        -1.25,
        2.5,
        0.14
      )}


      {/* ==================================================
          2. RIGHT BACKSIDE VERTICAL MAIN PIPE
             ROOF → GROUND
         ================================================== */}

      {verticalPipe(
        4.5,
        ROOF_Y / 2,
        -2.5,
        ROOF_Y,
        0.14
      )}


      {/* ==================================================
          3. ROOF MANIFOLD
             CONNECT RIGHT PIPE → CENTRE → LEFT PIPE
         ================================================== */}

      {pipeX(
        0,
        ROOF_Y,
        -2.5,
        9,
        0.12
      )}


      {/* ==================================================
          4. CONNECT BACK MANIFOLD TO BUILDING RISERS
         ================================================== */}

      {/* Left wing */}
      {pipeZ(
        -4.5,
        ROOF_Y,
        -2.125,
        0.75,
        0.10
      )}

      {/* Centre */}
      {pipeZ(
        0,
        ROOF_Y,
        -2.125,
        0.75,
        0.10
      )}

      {/* Right wing */}
      {pipeZ(
        4.5,
        ROOF_Y,
        -2.125,
        0.75,
        0.10
      )}


      {/* ==================================================
          5. MAIN VERTICAL RISERS
             THESE NOW REACH THE ROOF
         ================================================== */}

      {/* LEFT RISER */}
      {verticalPipe(
        -4.5,
        ROOF_Y / 2,
        -1.75,
        ROOF_Y,
        0.10
      )}

      {/* CENTRE RISER */}
      {verticalPipe(
        0,
        ROOF_Y / 2,
        -1.75,
        ROOF_Y,
        0.10
      )}

      {/* RIGHT RISER */}
      {verticalPipe(
        4.5,
        ROOF_Y / 2,
        -1.75,
        ROOF_Y,
        0.10
      )}


      {/* ==================================================
          6. RISER → ROOF CONNECTIONS
             ENSURES NO GAP AT THE TOP
         ================================================== */}

      {/* LEFT RISER → ROOF MANIFOLD */}
      {pipeZ(
        -4.5,
        ROOF_Y,
        -2.125,
        0.75,
        0.10
      )}

      {/* CENTRE RISER → ROOF MANIFOLD */}
      {pipeZ(
        0,
        ROOF_Y,
        -2.125,
        0.75,
        0.10
      )}

      {/* RIGHT RISER → ROOF MANIFOLD */}
      {pipeZ(
        4.5,
        ROOF_Y,
        -2.125,
        0.75,
        0.10
      )}


      {/* ==================================================
          7. FLOOR DISTRIBUTION PIPES
         ================================================== */}

      {/* FLOOR 1 */}
      {pipeX(
        0,
        0.45,
        -1.75,
        9,
        0.075
      )}

      {/* FLOOR 2 */}
      {pipeX(
        0,
        1.80,
        -1.75,
        9,
        0.075
      )}

      {/* FLOOR 3 */}
      {pipeX(
        0,
        3.15,
        -1.75,
        9,
        0.075
      )}

      {/* FLOOR 4 */}
      {pipeX(
        0,
        4.50,
        -1.75,
        9,
        0.075
      )}

      {/* FLOOR 5 */}
      {pipeX(
        0,
        5.85,
        -1.75,
        9,
        0.075
      )}


      {/* ==================================================
          8. LEFT WING BRANCHES
         ================================================== */}

      {/* Floor 1 */}
      {pipeZ(-4.5, 0.45, 0, 3.5, 0.055)}

      {/* Floor 2 */}
      {pipeZ(-4.5, 1.80, 0, 3.5, 0.055)}

      {/* Floor 3 */}
      {pipeZ(-4.5, 3.15, 0, 3.5, 0.055)}

      {/* Floor 4 */}
      {pipeZ(-4.5, 4.50, 0, 3.5, 0.055)}

      {/* Floor 5 */}
      {pipeZ(-4.5, 5.85, 0, 3.5, 0.055)}


      {/* ==================================================
          9. RIGHT WING BRANCHES
         ================================================== */}

      {/* Floor 1 */}
      {pipeZ(4.5, 0.45, 0, 3.5, 0.055)}

      {/* Floor 2 */}
      {pipeZ(4.5, 1.80, 0, 3.5, 0.055)}

      {/* Floor 3 */}
      {pipeZ(4.5, 3.15, 0, 3.5, 0.055)}

      {/* Floor 4 */}
      {pipeZ(4.5, 4.50, 0, 3.5, 0.055)}

      {/* Floor 5 */}
      {pipeZ(4.5, 5.85, 0, 3.5, 0.055)}


      {/* ==================================================
          10. UNDERGROUND CONNECTION
         ================================================== */}

      {/* Main pipe dropping underground */}
      {verticalPipe(
        4.5,
        -0.40,
        -2.5,
        1.6,
        0.16,
        undergroundMaterial
      )}


      {/* ==================================================
          11. UNDERGROUND MAIN PIPE
              RIGHT → LEFT
         ================================================== */}

      {pipeX(
        0,
        -0.8,
        -2.5,
        9,
        0.18,
        undergroundMaterial
      )}


      {/* ==================================================
          12. UNDERGROUND → LEFT WING
         ================================================== */}

      {pipeZ(
        -4.5,
        -0.8,
        -2.125,
        0.75,
        0.14,
        undergroundMaterial
      )}


      {/* ==================================================
          13. UNDERGROUND → CENTRE
         ================================================== */}

      {pipeZ(
        0,
        -0.8,
        -2.125,
        0.75,
        0.14,
        undergroundMaterial
      )}


      {/* ==================================================
          14. UNDERGROUND → RIGHT WING
         ================================================== */}

      {pipeZ(
        4.5,
        -0.8,
        -2.125,
        0.75,
        0.14,
        undergroundMaterial
      )}


      {/* ==================================================
          15. UNDERGROUND EXTERNAL CONNECTION
         ================================================== */}

      {pipeZ(
        4.5,
        -0.8,
        -5.0,
        5,
        0.16,
        undergroundMaterial
      )}

    </group>
  );
}

/* =========================================================
   H BLOCK MODEL
   ========================================================= */

function HBlockModel({
  selectedFloor,
  onFloorSelect,
  resetSignal,
}: HBlock3DProps) {
  const controlsRef = useRef<any>(null);

useEffect(() => {
  if (controlsRef.current) {
    controlsRef.current.reset();
    controlsRef.current.target.set(0, 3, 0);
    controlsRef.current.object.position.set(0, 8, 18);
    controlsRef.current.update();
  }
}, [resetSignal]);
  const floors = [1, 2, 3, 4, 5];

  const trees = useMemo(
    () => [
      [-10, 0, 5],
      [10, 0, 5],

      [-11, 0, -4],
      [11, 0, -4],

      [-7, 0, 9],
      [7, 0, 9],

      [-12, 0, 1],
      [12, 0, 1],

      [-6, 0, -7],
      [6, 0, -7],
    ] as [number, number, number][],
    []
  );

  return (
    <>
      {/* =====================================================
          LIGHTING
          ===================================================== */}

      <ambientLight intensity={1.8} />

      <directionalLight
        position={[10, 15, 10]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight
        position={[-10, 8, -5]}
        intensity={1.2}
      />

      {/* =====================================================
          GROUND
          ===================================================== */}

      <Ground />

      <WaterPipelineSystem />

      <WaterTank />

      <UndergroundWaterPipes />

      {/* =====================================================
          H BLOCK - 5 FLOORS
          ===================================================== */}

      {floors.map((floor) => (
        <Floor
          key={floor}
          floorNumber={floor}
          selectedFloor={selectedFloor}
          onSelect={onFloorSelect}
        />
      ))}

      {floors.map((floor) => (
       <CentreClassrooms
       key={`classrooms-${floor}`}
       floorNumber={floor}
       selectedFloor={selectedFloor}
      />
      ))}

      {/* =====================================================
          MAIN ENTRANCE
          ===================================================== */}

      <Entrance />

      {/* =====================================================
          TREES
          ===================================================== */}

      {trees.map((position, index) => (
        <Tree
          key={index}
          position={position}
        />
      ))}

      {/* =====================================================
          DEFAULT CAMERA CONTROLS
          ===================================================== */}

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={32}
        target={[0, 3, 0]}
      />
    </>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function HBlock3D({
  selectedFloor,
  onFloorSelect,
  resetSignal,
}: HBlock3DProps) {
  
  return (
    <div
      style={{
        width: "100%",
        height: "620px",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#dfe7ed",
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [14, 10, 16],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
        }}
      >
        <color
          attach="background"
          args={["#dfe7ed"]}
        />

        <HBlockModel
  selectedFloor={selectedFloor}
  onFloorSelect={onFloorSelect}
  resetSignal={resetSignal}
/>
      </Canvas>
    </div>
  );
}
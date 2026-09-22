import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";

export type BuildingKind =
  | "medical"
  | "hospital"
  | "engineering"
  | "administration"
  | "residential"
  | "commercial"
  | "industrial"
  | "sports"
  | "hostel"
  | "government";

export interface Building3DProps {
  selectedFloor?: number | null;
  onFloorSelect?: (floor: number) => void;
  resetSignal?: number;
}

type ModelProps = Building3DProps & {
  kind: BuildingKind;
  floors: number;
  selectedColor?: string;
};


const GLASS = "#4f7892";

const GROUND = "#7b9a68";
const ROAD = "#414348";

function Window({ position, rotation = [0, 0, 0], scale = [0.8, 0.6, 0.08] }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={GLASS} metalness={0.2} roughness={0.3} />
    </mesh>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 1.5, 8]} />
        <meshStandardMaterial color="#6b4b32" />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[1.05, 16, 16]} />
        <meshStandardMaterial color="#3f7542" />
      </mesh>
    </group>
  );
}

function Ground({ kind }: { kind: BuildingKind }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[34, 26]} />
        <meshStandardMaterial color={GROUND} />
      </mesh>
      <mesh position={[0, 0.02, 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 4.5]} />
        <meshStandardMaterial color={ROAD} />
      </mesh>
      {kind === "industrial" && (
        <mesh position={[0, 0.03, -7]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[26, 4]} />
          <meshStandardMaterial color="#77716b" />
        </mesh>
      )}
    </group>
  );
}

function FloorSlab({
  y, width, depth, selected, onClick
}: {
  y: number; width: number; depth: number; selected: boolean; onClick?: () => void;
}) {
  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}>
      <boxGeometry args={[width, 0.18, depth]} />
      <meshStandardMaterial color={selected ? "#f59e0b" : "#d0b18e"} />
    </mesh>
  );
}

function BasicFloor({
  floor, floorHeight, width, depth, selected, onSelect, kind
}: {
  floor: number; floorHeight: number; width: number; depth: number;
  selected: boolean; onSelect?: (floor: number) => void; kind: BuildingKind;
}) {
  const y = floorHeight / 2 + (floor - 1) * floorHeight;
  const body = selected ? "#f59e0b" : (
    kind === "hospital" ? "#d9e4ea" :
    kind === "medical" ? "#dce9ed" :
    kind === "residential" ? "#d9c1a7" :
    kind === "commercial" ? "#d4dce3" :
    kind === "industrial" ? "#b9b1a4" :
    "#e5c8a7"
  );

  return (
    <group position={[0, y, 0]} onClick={(e) => {
      e.stopPropagation();
      onSelect?.(floor);
    }}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, floorHeight - 0.08, depth]} />
        <meshStandardMaterial color={body} roughness={0.78} />
      </mesh>

      {/* front windows */}
      {Array.from({ length: Math.max(4, Math.floor(width / 2)) }).map((_, i) => {
        const x = -width / 2 + 1 + i * ((width - 2) / Math.max(1, Math.floor(width / 2) - 1));
        return <Window key={`f-${i}`} position={[x, 0.08, depth / 2 + 0.04]} />;
      })}

      {/* rear windows */}
      {Array.from({ length: Math.max(4, Math.floor(width / 2)) }).map((_, i) => {
        const x = -width / 2 + 1 + i * ((width - 2) / Math.max(1, Math.floor(width / 2) - 1));
        return <Window key={`b-${i}`} position={[x, 0.08, -depth / 2 - 0.04]} />;
      })}

      <Window position={[-width / 2 - 0.04, 0.08, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[-width / 2 - 0.04, 0.08, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[width / 2 + 0.04, 0.08, -1]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[width / 2 + 0.04, 0.08, 1]} rotation={[0, Math.PI / 2, 0]} />

      <FloorSlab
        y={-floorHeight / 2 + 0.03}
        width={width + 0.12}
        depth={depth + 0.12}
        selected={selected}
        onClick={() => onSelect?.(floor)}
      />
    </group>
  );
}

function MainEntrance({ width, y = 1.15 }: { width: number; y?: number }) {
  return (
    <group position={[0, y, width > 14 ? 3.2 : 2.7]}>
      <mesh castShadow>
        <boxGeometry args={[Math.min(5, width * 0.32), 2.3, 0.8]} />
        <meshStandardMaterial color="#e1e6e9" />
      </mesh>
      <mesh position={[0, -0.2, 0.45]}>
        <boxGeometry args={[2.6, 1.45, 0.1]} />
        <meshStandardMaterial color="#3b82a0" metalness={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[Math.min(5.5, width * 0.36), 0.28, 1.45]} />
        <meshStandardMaterial color="#c94f4f" />
      </mesh>
    </group>
  );
}

function RooftopTank({ x = 0, roofY }: { x?: number; roofY: number }) {
  return (
    <group position={[x, roofY, 0]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 1.5, 24]} />
        <meshStandardMaterial color="#c8cdd1" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.12, 24]} />
        <meshStandardMaterial color="#aeb5bb" />
      </mesh>
    </group>
  );
}

function HospitalWings({ floors, selectedFloor, onSelect }: {
  floors: number; selectedFloor?: number | null; onSelect?: (f: number) => void;
}) {
  const fh = 1.5;
  return (
    <>
      {Array.from({ length: floors }, (_, i) => i + 1).map((floor) => {
        const y = fh / 2 + (floor - 1) * fh;
        const selected = selectedFloor === floor;
        const color = selected ? "#f59e0b" : "#d9e4ea";
        return (
          <group key={floor} position={[0, y, 0]} onClick={(e) => {
            e.stopPropagation();
            onSelect?.(floor);
          }}>
            <mesh position={[-4.5, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, fh - 0.08, 5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[4.5, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, fh - 0.08, 5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0, -0.5]} castShadow receiveShadow>
              <boxGeometry args={[4, fh - 0.08, 4]} />
              <meshStandardMaterial color={selected ? "#f59e0b" : "#cbd9e2"} />
            </mesh>
            {[-5.5,-4,-2.5,2.5,4,5.5].map((x) =>
              <Window key={`front-${x}`} position={[x, 0.1, 2.53]} scale={[0.9,0.65,0.08]} />
            )}
            {[-5.5,-4,-2.5,2.5,4,5.5].map((x) =>
              <Window key={`rear-${x}`} position={[x, 0.1, -2.53]} scale={[0.9,0.65,0.08]} />
            )}
          </group>
        );
      })}
    </>
  );
}

function Model({ kind, floors, selectedFloor, onFloorSelect }: ModelProps) {
  const floorHeight = kind === "hospital" ? 1.5 : kind === "industrial" ? 1.8 : 1.35;
  const selected = selectedFloor ?? null;
  const width =
    kind === "residential" ? 11 :
    kind === "commercial" ? 14 :
    kind === "industrial" ? 15 :
    kind === "sports" ? 12 : 12;
  const depth =
    kind === "residential" ? 6 :
    kind === "commercial" ? 7 :
    kind === "industrial" ? 9 :
    kind === "sports" ? 8 : 6;

  const trees = useMemo(() => [
    [-10,0,5],[10,0,5],[-11,0,-4],[11,0,-4],[-7,0,9],[7,0,9]
  ] as [number,number,number][], []);

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[10,15,10]} intensity={2.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-10,8,-5]} intensity={1.2} />
      <Ground kind={kind} />

      {kind === "hospital" ? (
        <HospitalWings floors={floors} selectedFloor={selected} onSelect={onFloorSelect} />
      ) : kind === "engineering" ? (
        <>
          {Array.from({length:floors},(_,i)=>i+1).map(f => {
            const y=floorHeight/2+(f-1)*floorHeight;
            return (
              <group key={f} position={[0,y,0]} onClick={e=>{e.stopPropagation();onFloorSelect?.(f)}}>
                <mesh position={[-4,0,0]} castShadow receiveShadow>
                  <boxGeometry args={[7,floorHeight-0.08,5.5]}/>
                  <meshStandardMaterial color={selected===f ? "#f59e0b" : "#e5c8a7"}/>
                </mesh>
                <mesh position={[4,0,0]} castShadow receiveShadow>
                  <boxGeometry args={[7,floorHeight-0.08,5.5]}/>
                  <meshStandardMaterial color={selected===f ? "#f59e0b" : "#e5c8a7"}/>
                </mesh>
                <mesh position={[0,0,0]} castShadow receiveShadow>
                  <boxGeometry args={[4,floorHeight-0.08,3.8]}/>
                  <meshStandardMaterial color={selected===f ? "#f59e0b" : "#d7bea0"}/>
                </mesh>
                {[-6,-4.5,-3,3,4.5,6].map(x=><Window key={x} position={[x,0.1,2.78]}/>)}
              </group>
            );
          })}
        </>
      ) : (
        Array.from({length:floors},(_,i)=>i+1).map(f =>
          <BasicFloor
            key={f}
            floor={f}
            floorHeight={floorHeight}
            width={width}
            depth={depth}
            selected={selected===f}
            onSelect={onFloorSelect}
            kind={kind}
          />
        )
      )}

      {/* Architecture-specific details */}
      {kind === "hospital" && <MainEntrance width={12} />}
      {kind === "medical" && <MainEntrance width={12} />}
      {kind === "engineering" && <MainEntrance width={14} />}
      {kind === "administration" && <MainEntrance width={12} />}
      {kind === "residential" && <MainEntrance width={11} />}
      {kind === "commercial" && <MainEntrance width={14} />}
      {kind === "hostel" && <MainEntrance width={12} />}

      {kind === "hospital" && (
        <group position={[-7.4,0.75,0]}>
          <mesh castShadow><boxGeometry args={[0.6,1.5,3.2]}/><meshStandardMaterial color="#d94848"/></mesh>
          <mesh position={[0,0,1.65]}><boxGeometry args={[0.8,0.12,0.12]}/><meshStandardMaterial color="white"/></mesh>
          <mesh position={[0,0,1.65]} rotation={[0,Math.PI/2,0]}><boxGeometry args={[0.8,0.12,0.12]}/><meshStandardMaterial color="white"/></mesh>
        </group>
      )}

      {kind === "commercial" && (
        <group position={[0,0.35,3.55]}>
          <mesh><boxGeometry args={[9,0.6,0.2]}/><meshStandardMaterial color="#4b5563"/></mesh>
          {[-3,-1.5,0,1.5,3].map(x => <Window key={x} position={[x,0,0.13]} scale={[1.1,0.35,0.05]} />)}
        </group>
      )}

      {kind === "industrial" && (
        <group>
          <mesh position={[0,floors*floorHeight+0.5,0]} castShadow>
            <boxGeometry args={[16,0.5,10]}/>
            <meshStandardMaterial color="#6b7280"/>
          </mesh>
          <mesh position={[0,1,4.55]}><boxGeometry args={[4,2,0.15]}/><meshStandardMaterial color="#4b5563"/></mesh>
          <mesh position={[0,1,4.65]}><boxGeometry args={[3.2,1.5,0.08]}/><meshStandardMaterial color="#d1d5db"/></mesh>
        </group>
      )}

      {kind === "sports" && (
        <group>
          <mesh position={[0,0.05,-7]} rotation={[-Math.PI/2,0,0]}>
            <planeGeometry args={[18,8]}/><meshStandardMaterial color="#4f8b50"/>
          </mesh>
          {[-7,7].map(x => <mesh key={x} position={[x,1.6,-7]} castShadow>
            <boxGeometry args={[0.3,3.2,8]}/><meshStandardMaterial color="#b8bec5"/>
          </mesh>)}
        </group>
      )}

      {kind === "government" && (
        <group>
          <mesh position={[0,floors*floorHeight+0.35,0]} castShadow>
            <boxGeometry args={[width+0.4,0.5,depth+0.4]}/><meshStandardMaterial color="#c4b7a5"/>
          </mesh>
          {[ -4.5,-1.5,1.5,4.5 ].map(x =>
            <mesh key={x} position={[x,0.9,depth/2+0.15]} castShadow>
              <cylinderGeometry args={[0.16,0.16,1.8,16]}/><meshStandardMaterial color="#e7e2da"/>
            </mesh>
          )}
        </group>
      )}

      {kind === "hospital" && <RooftopTank x={4} roofY={floors * 1.5} />}
      {kind !== "industrial" && kind !== "sports" && kind !== "commercial" && kind !== "government" && (
        <RooftopTank x={width/3} roofY={floors * floorHeight} />
      )}

      {kind !== "industrial" && trees.map((p,i)=><Tree key={i} position={p}/>)}

      {/* entrance path */}
      <mesh position={[0,0.04,5]} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[6,6]}/><meshStandardMaterial color="#b7a99a"/>
      </mesh>
    </>
  );
}

export default function Building3D({ kind, floors, selectedFloor, onFloorSelect, resetSignal=0 }: ModelProps) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    controlsRef.current?.reset();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, Math.min(3, floors * 0.5), 0);
      controlsRef.current.object.position.set(14, 10, 16);
      controlsRef.current.update();
    }
  }, [resetSignal, floors]);

  return (
    <div style={{
      width:"100%", height:"620px", borderRadius:"16px", overflow:"hidden", background:"#dfe7ed"
    }}>
      <Canvas shadows camera={{position:[14,10,16], fov:45, near:0.1, far:1000}} gl={{antialias:true}}>
        <color attach="background" args={["#dfe7ed"]}/>
        <Model kind={kind} floors={floors} selectedFloor={selectedFloor} onFloorSelect={onFloorSelect}/>
        <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate minDistance={10} maxDistance={38} target={[0,3,0]}/>
      </Canvas>
    </div>
  );
}

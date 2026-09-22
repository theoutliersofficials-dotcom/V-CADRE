import Building3D, { type Building3DProps } from "./Building3D";

export default function EngineeringCollege3D(props: Building3DProps) {
  return <Building3D kind="engineering" floors={5} {...props} />;
}
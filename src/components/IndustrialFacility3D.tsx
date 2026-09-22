import Building3D, { type Building3DProps } from "./Building3D";

export default function IndustrialFacility3D(props: Building3DProps) {
  return <Building3D kind="industrial" floors={3} {...props} />;
}
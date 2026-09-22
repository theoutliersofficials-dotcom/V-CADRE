import Building3D, { type Building3DProps } from "./Building3D";

export default function GovernmentBuilding3D(props: Building3DProps) {
  return <Building3D kind="government" floors={4} {...props} />;
}
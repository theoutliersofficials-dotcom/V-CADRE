import Building3D, { type Building3DProps } from "./Building3D";

export default function ResidentialBlock3D(props: Building3DProps) {
  return <Building3D kind="residential" floors={5} {...props} />;
}
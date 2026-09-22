import Building3D, { type Building3DProps } from "./Building3D";

export default function Administration3D(props: Building3DProps) {
  return <Building3D kind="administration" floors={4} {...props} />;
}
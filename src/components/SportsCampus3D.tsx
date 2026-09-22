import Building3D, { type Building3DProps } from "./Building3D";

export default function SportsCampus3D(props: Building3DProps) {
  return <Building3D kind="sports" floors={2} {...props} />;
}
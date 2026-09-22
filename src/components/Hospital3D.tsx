import Building3D, { type Building3DProps } from "./Building3D";

export default function Hospital3D(props: Building3DProps) {
  return <Building3D kind="hospital" floors={4} {...props} />;
}
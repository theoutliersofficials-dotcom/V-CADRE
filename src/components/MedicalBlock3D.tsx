import Building3D, { type Building3DProps } from "./Building3D";

export default function MedicalBlock3D(props: Building3DProps) {
  return <Building3D kind="medical" floors={4} {...props} />;
}
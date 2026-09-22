import Building3D, { type Building3DProps } from "./Building3D";

export default function GuestHostel3D(props: Building3DProps) {
  return <Building3D kind="hostel" floors={5} {...props} />;
}
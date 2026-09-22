import Building3D, { type Building3DProps } from "./Building3D";

export default function CommercialComplex3D(props: Building3DProps) {
  return <Building3D kind="commercial" floors={4} {...props} />;
}
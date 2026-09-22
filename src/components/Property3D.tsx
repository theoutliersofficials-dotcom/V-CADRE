import HBlock3D from "./HBlock3D";
import MedicalBlock3D from "./MedicalBlock3D";
import Hospital3D from "./Hospital3D";
import EngineeringCollege3D from "./EngineeringCollege3D";
import Administration3D from "./Administration3D";
import ResidentialBlock3D from "./ResidentialBlock3D";
import CommercialComplex3D from "./CommercialComplex3D";
import IndustrialFacility3D from "./IndustrialFacility3D";
import SportsCampus3D from "./SportsCampus3D";
import GuestHostel3D from "./GuestHostel3D";
import GovernmentBuilding3D from "./GovernmentBuilding3D";

import type { Building3DProps } from "./Building3D";

interface Property3DProps extends Building3DProps {
  property: any;
  selectedFloor?: number | null;
  onFloorSelect?: (floor: number) => void;
  resetSignal?: number;
}

export default function Property3D({
  property,
  selectedFloor,
  onFloorSelect,
  resetSignal,
  ...buildingProps
}: Property3DProps) {
  const common: Building3DProps = {
    ...buildingProps,
    selectedFloor: selectedFloor ?? null,
    onFloorSelect: onFloorSelect ?? (() => {}),
    resetSignal: resetSignal ?? 0,
  };

  switch (property?.id) {
    case "VC-001":
  return (
    <HBlock3D
      {...common}
      selectedFloor={common.selectedFloor ?? null}
      onFloorSelect={common.onFloorSelect ?? (() => {})}
      resetSignal={common.resetSignal ?? 0}
    />
  );

    case "VC-002":
      return <MedicalBlock3D {...common} />;

    case "VC-003":
      return <Hospital3D {...common} />;

    case "VC-004":
      return <EngineeringCollege3D {...common} />;

    case "VC-005":
      return <Administration3D {...common} />;

    case "VC-006":
    case "VC-007":
      return <ResidentialBlock3D {...common} />;

    case "VC-008":
      return <CommercialComplex3D {...common} />;

    case "VC-009":
      return <IndustrialFacility3D {...common} />;

    case "VC-010":
      return <SportsCampus3D {...common} />;

    case "VC-011":
      return <GuestHostel3D {...common} />;

    default:
      return <GovernmentBuilding3D {...common} />;
  }
}
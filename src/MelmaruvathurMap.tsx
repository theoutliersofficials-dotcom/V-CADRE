import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const melmaruvathurCenter: [number, number] = [
  12.435557,
  79.821518,
];

const properties = [
  {
    id: "VC-001",
    name: "Adhiparasakthi Engineering College",
    type: "Educational Institution",
    floors: 5,
    position: [12.435557, 79.821518] as [number, number],
    buildingType: "college",
  },
];

type Property = (typeof properties)[number];

type Props = {
  onPropertySelect: (property: Property) => void;
};

function createBuildingIcon(_property: Property) {
  return L.divIcon({
    className: "custom-building-marker",
    iconSize: [100, 100],
    iconAnchor: [50, 100],
    html: `
      <div
        style="
          width:60px;
          height:80px;
          background:#64748b;
          border:2px solid #1e293b;
        "
      ></div>
    `,
  });
}

function BuildingMarker({
  property,
  onPropertySelect,
}: {
  property: Property;
  onPropertySelect: (property: Property) => void;
}) {
  const map = useMap();

  return (
    <Marker
      position={property.position}
      icon={createBuildingIcon(property)}
      eventHandlers={{
        click: () => {
          map.flyTo(property.position, 19, {
            duration: 1.2,
          });

          onPropertySelect(property);
        },
      }}
    />
  );
}

export default function MelmaruvathurMap({
  onPropertySelect,
}: Props) {
  return (
    <MapContainer
      center={melmaruvathurCenter}
      zoom={16}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {properties.map((property) => (
        <BuildingMarker
          key={property.id}
          property={property}
          onPropertySelect={onPropertySelect}
        />
      ))}
    </MapContainer>
  );
}
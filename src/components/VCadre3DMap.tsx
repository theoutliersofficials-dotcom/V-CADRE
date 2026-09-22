import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";

import {
  Map,
  NavigationControl,
  Popup,
  LngLatBounds,
  setWorkerUrl,
} from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import "maplibre-gl/dist/maplibre-gl.css";

setWorkerUrl(workerUrl);

interface Property {
  id: string;
  name: string;
  type: string;
  floors: number;
  height: number;
  coordinates: [number, number];
}

interface VCadre3DMapProps {
  onPropertySelect?: (property: Property) => void;
}

const properties: Property[] = [
  {
    id: "VC-001",
    name: "Adhiparasakthi Engineering College",
    type: "Educational Institution",
    floors: 5,
    height: 18,
    coordinates: [79.821518, 12.435557],
  },
  {
    id: "VC-002",
    name: "Melmaruvathur General Hospital",
    type: "Healthcare",
    floors: 4,
    height: 15,
    coordinates: [79.8202, 12.4372],
  },
  {
    id: "VC-003",
    name: "Melmaruvathur Commercial Complex",
    type: "Commercial",
    floors: 4,
    height: 12,
    coordinates: [79.8231, 12.4346],
  },
  {
    id: "VC-004",
    name: "Residential Block A",
    type: "Residential",
    floors: 5,
    height: 14,
    coordinates: [79.8209, 12.4339],
  },
  {
    id: "VC-005",
    name: "Residential Block B",
    type: "Residential",
    floors: 4,
    height: 11,
    coordinates: [79.823, 12.4365],
  },
  {
    id: "VC-006",
    name: "Community School",
    type: "Educational Institution",
    floors: 5,
    height: 8,
    coordinates: [79.8218, 12.438],
  },
  {
    id: "VC-007",
    name: "Public Administration Building",
    type: "Government",
    floors: 5,
    height: 11,
    coordinates: [79.8195, 12.4349],
  },
  {
    id: "VC-008",
    name: "Industrial Facility",
    type: "Industrial",
    floors: 4,
    height: 9,
    coordinates: [79.8238, 12.4329],
  },

];

function createBuildingFootprint(property: Property) {
  const [lng, lat] = property.coordinates;

  const width = 0.00028;
  const depth = 0.00020;

  const coordinates = [
    [lng - width, lat - depth],
    [lng + width, lat - depth],
    [lng + width, lat + depth],
    [lng - width, lat + depth],
    [lng - width, lat - depth],
  ];

  return {
    type: "Feature" as const,
    id: property.id,

    properties: {
      id: property.id,
      name: property.name,
      type: property.type,
      floors: property.floors,
      height: property.height,
    },

    geometry: {
      type: "Polygon" as const,
      coordinates: [coordinates],
    },
  };
}

function createVCadreBuildingsGeoJSON() {
  return {
    type: "FeatureCollection" as const,
    features: properties.map(createBuildingFootprint),
  };
}

export default function VCadre3DMap({
  onPropertySelect,
}: VCadre3DMapProps): ReactElement {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<Map | null>(null);

  const onPropertySelectRef = useRef(onPropertySelect);

  const [hoveredProperty, setHoveredProperty] =
    useState<Property | null>(null);

  const selectedPropertyIdRef = useRef<string | null>(null);

  useEffect(() => {
    onPropertySelectRef.current = onPropertySelect;
  }, [onPropertySelect]);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map = new Map({
      container: mapContainerRef.current,

      style: "https://tiles.openfreemap.org/styles/liberty",

      center: [79.821518, 12.435557],

      zoom: 15,

      pitch: 60,

      bearing: -20,

      attributionControl: {},
    });

    mapRef.current = map;

    map.addControl(
      new NavigationControl({
        visualizePitch: true,
      }),
      "top-right",
    );

    map.on("load", () => {
      console.log("V-CADRE 3D MAP READY");

      console.log(
        `Adding ${properties.length} V-CADRE buildings...`,
      );

      /*
       * =====================================================
       * SOURCE
       * =====================================================
       */

      map.addSource("vcadre-buildings", {
        type: "geojson",
        data: createVCadreBuildingsGeoJSON(),
      });

      /*
       * =====================================================
       * 3D BUILDINGS
       * =====================================================
       */

      map.addLayer({
        id: "vcadre-buildings-3d",

        type: "fill-extrusion",

        source: "vcadre-buildings",

        paint: {
          "fill-extrusion-color": [
            "case",

            ["==", ["get", "id"], "VC-001"],

            "#2563eb",

            "#64748b",
          ],

          "fill-extrusion-height": [
            "get",
            "height",
          ],

          "fill-extrusion-base": 0,

          "fill-extrusion-opacity": 0.92,

          "fill-extrusion-vertical-gradient": true,
        },
      });

      /*
       * =====================================================
       * DEBUG FOOTPRINT
       * =====================================================
       */

      map.addLayer({
        id: "vcadre-buildings-debug",

        type: "fill",

        source: "vcadre-buildings",

        paint: {
          "fill-color": "#ef4444",

          "fill-opacity": 0.05,
        },
      });

      /*
       * =====================================================
       * LABELS
       * =====================================================
       */

      map.addLayer({
        id: "vcadre-building-labels",

        type: "symbol",

        source: "vcadre-buildings",

        layout: {
          "text-field": ["get", "name"],

          "text-size": 11,

          "text-anchor": "top",

          "text-offset": [0, 1],

          "text-allow-overlap": false,
        },

        paint: {
          "text-color": "#172b46",

          "text-halo-color": "#ffffff",

          "text-halo-width": 1.5,
        },
      });

      /*
       * =====================================================
       * INITIAL MAP VIEW
       * =====================================================
       */

      const bounds = new LngLatBounds();

      properties.forEach((property) => {
        bounds.extend(property.coordinates);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 100,

          pitch: 60,

          bearing: -20,

          duration: 1000,
        });
      }

      console.log(
        "V-CADRE BUILDING COUNT:",
        properties.length,
      );

      /*
       * =====================================================
       * HOVER
       * =====================================================
       */

      map.on(
        "mousemove",
        "vcadre-buildings-3d",
        (event) => {
          map.getCanvas().style.cursor = "pointer";

          /*
           * If a building is already selected,
           * do NOT show hover information.
           */

          if (selectedPropertyIdRef.current) {
            setHoveredProperty(null);
            return;
          }

          const feature = event.features?.[0];

          if (!feature) {
            setHoveredProperty(null);
            return;
          }

          const propertyId = String(
            feature.properties?.id ?? "",
          );

          const property = properties.find(
            (item) => item.id === propertyId,
          );

          if (property) {
            setHoveredProperty(property);
          }
        },
      );

      /*
       * =====================================================
       * HOVER LEAVE
       * =====================================================
       */

      map.on(
        "mouseleave",
        "vcadre-buildings-3d",
        () => {
          map.getCanvas().style.cursor = "";

          setHoveredProperty(null);
        },
      );

      /*
       * =====================================================
       * CLICK
       * =====================================================
       */

      map.on(
        "click",
        "vcadre-buildings-3d",
        (event) => {
          const feature = event.features?.[0];

          if (!feature) {
            return;
          }

          const propertyId = String(
            feature.properties?.id ?? "",
          );

          const property = properties.find(
            (item) => item.id === propertyId,
          );

          if (!property) {
            return;
          }

          /*
           * Mark this building as selected.
           */

          selectedPropertyIdRef.current =
            property.id;

          /*
           * Immediately remove hover information.
           */

          setHoveredProperty(null);

          /*
           * Tell App.tsx.
           *
           * App.tsx owns the Property Information panel.
           */

          onPropertySelectRef.current?.(property);

          /*
           * Clear previous selections.
           */

          properties.forEach((item) => {
            map.setFeatureState(
              {
                source: "vcadre-buildings",

                id: item.id,
              },

              {
                selected: false,
              },
            );
          });

          /*
           * Highlight selected building.
           */

          map.setFeatureState(
            {
              source: "vcadre-buildings",

              id: property.id,
            },

            {
              selected: true,
            },
          );

          /*
           * Move camera toward building.
           */

          map.flyTo({
            center: property.coordinates,

            zoom: 16,

            pitch: 65,

            bearing: -20,

            duration: 900,
          });

          /*
           * Small map popup.
           *
           * This is NOT the Property Information panel.
           */

          new Popup({
            closeButton: true,

            closeOnClick: true,

            offset: 20,

            className: "vcadre-map-popup",
          })
            .setLngLat(event.lngLat)

            .setHTML(`
              <div style="
                min-width: 190px;
                font-family: Arial, sans-serif;
              ">
                <div style="
                  font-size: 14px;
                  font-weight: 700;
                  margin-bottom: 6px;
                  color: #172b46;
                ">
                  ${property.name}
                </div>

                <div style="
                  font-size: 11px;
                  color: #52657a;
                  line-height: 1.6;
                ">
                  Latitude:
                  ${property.coordinates[1].toFixed(6)}
                  <br />

                  Longitude:
                  ${property.coordinates[0].toFixed(6)}
                </div>
              </div>
            `)

            .addTo(map);
        },
      );

      /*
       * =====================================================
       * CLICK EMPTY MAP
       * =====================================================
       */

      map.on("click", (event) => {
        const features = map.queryRenderedFeatures(
          event.point,
          {
            layers: ["vcadre-buildings-3d"],
          },
        );

        if (features.length > 0) {
          return;
        }

        if (selectedPropertyIdRef.current) {
          map.setFeatureState(
            {
              source: "vcadre-buildings",

              id: selectedPropertyIdRef.current,
            },

            {
              selected: false,
            },
          );
        }

        selectedPropertyIdRef.current = null;

        setHoveredProperty(null);
      });
    });

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
     */

    return () => {
      map.remove();

      mapRef.current = null;
    };
  }, []);

  return (
    <div className="vcadre-map-shell">
      {/* ===================================================
          MAP
      =================================================== */}

      <div
        ref={mapContainerRef}
        className="vcadre-3d-map"
      />

      {/* ===================================================
          MAP BADGE
      =================================================== */}

      <div className="vcadre-map-badge">
        <span className="vcadre-map-badge-dot" />

        V-CADRE 3D MAP
      </div>

      {/* ===================================================
          HOVER INFORMATION
      =================================================== */}

      {hoveredProperty && (
        <div className="vcadre-hover-card">
          <div className="vcadre-hover-title">
            {hoveredProperty.name}
          </div>

          <div className="vcadre-hover-location">
            <div>
              <span>Latitude:</span>{" "}
              {hoveredProperty.coordinates[1].toFixed(6)}
            </div>

            <div>
              <span>Longitude:</span>{" "}
              {hoveredProperty.coordinates[0].toFixed(6)}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          BOTTOM HELP
      =================================================== */}

      <div className="vcadre-map-help">
        Hover over a building for location • Click to view
        property
      </div>
    </div>
  );
}


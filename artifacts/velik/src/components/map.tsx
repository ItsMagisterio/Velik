import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const LAT = 54.305444;
const LNG = 26.839944;

export default function StoreMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: import("leaflet").Map;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      map = L.map(containerRef.current, {
        center: [LAT, LNG],
        zoom: 17,
        zoomControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
        attributionControl: false,
      });

      mapRef.current = map;

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
        }
      ).addTo(map);


      const icon = L.divIcon({
        className: "",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="
              width: 44px;
              height: 44px;
              background: #ef4444;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid #fff;
              box-shadow: 0 4px 20px rgba(239,68,68,0.5);
            "></div>
            <div style="
              background: #fff;
              color: #111;
              font-weight: 700;
              font-size: 13px;
              padding: 2px 8px;
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              white-space: nowrap;
              font-family: sans-serif;
            ">Велiк</div>
          </div>
        `,
        iconSize: [44, 70],
        iconAnchor: [22, 50],
        popupAnchor: [0, -48],
      });

      L.marker([LAT, LNG], { icon }).addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 480 }}
    />
  );
}

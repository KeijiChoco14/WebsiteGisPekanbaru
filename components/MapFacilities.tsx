"use client";

import { useEffect, useRef } from "react";
import { getFacilities } from "@/lib/facilitiesService";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";

export default function MapFacilities() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null); // ⬅️ PENTING

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return; // ⬅️ CEGAH DUPLIKASI

    async function initMap() {
      const { data } = await getFacilities();

      const features =
        data?.map(
          (f) =>
            new Feature({
              geometry: new Point(
                fromLonLat([f.longitude, f.latitude])
              ),
            })
        ) || [];

      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features }),
        style: new Style({
          image: new Icon({
            src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            scale: 0.05,
          }),
        }),
      });

      mapInstance.current = new Map({
        target: mapRef.current!,
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([101.437, 0.5085]),
          zoom: 14,
        }),
      });
    }

    initMap();

    // 🔥 CLEANUP (INI KUNCI UTAMA)
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px", borderRadius: 10 }}
    />
  );
}

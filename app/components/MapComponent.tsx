"use client";

import { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Icon, Style } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";


export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  const [showPolygon, setShowPolygon] = useState(true);
  const [showBanjir, setShowBanjir] = useState(true);
  const [showTrash, setShowTrash] = useState(true);
  const [selectedKelurahan, setSelectedKelurahan] = useState("all");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    // Create overlay untuk popup
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });

    // Layer Polygon Riau - Path diperbaiki sesuai struktur folder Anda
    const riauLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "/data/polygon_riau.json", // File ada di app/data/, tapi Next.js serve dari public/
      }),
      style: {
        "fill-color": "rgba(145, 255, 131, 0.3)",
        "stroke-color": "#91ff83",
        "stroke-width": 2,
      },
      visible: showPolygon,
    });

    // Layer Titik Banjir
    const banjirLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "/data/banjir.json",
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjM0I4MkY2Ij48cGF0aCBkPSJNMTIgMmMtNC45NyAwLTkgNC4wMy05IDlzNCA5IDkgOSA5LTQuMDMgOS05LTQuMDMtOS05LTl6bTAgMTZjLTMuODcgMC03LTMuMTMtNy03czMuMTMtNyA3LTcgNyAzLjEzIDcgNy0zLjEzIDctNyA3eiIvPjwvc3ZnPg==",
          scale: 1.2,
        }),
      }),
      visible: showBanjir,
    });

    // Layer Titik Sampah - Menggunakan icon SVG karena icon folder belum ada
    const trashLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "/data/trash_points.json",
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRUYzNDM0Ij48cGF0aCBkPSJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eiIvPjwvc3ZnPg==",
          scale: 1.2,
        }),
      }),
      visible: showTrash,
    });

    // Buat Map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        riauLayer,
        banjirLayer,
        trashLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]), // Center di Pekanbaru
        zoom: 12,
      }),
    });

    // Feature Overlay untuk highlight
    const featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: map,
      style: {
        "stroke-color": "rgba(255, 255, 255, 0.9)",
        "stroke-width": 3,
      },
    });

    let highlight: Feature<Geometry> | null = null;

    const highlightFeature = (pixel: number[]) => {
      const feature = map.forEachFeatureAtPixel(pixel, (feat) => {
        if (feat instanceof Feature) {
          return feat;
        }
      }) as Feature<Geometry> | undefined;

      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource()?.removeFeature(highlight);
        }
        if (feature) {
          featureOverlay.getSource()?.addFeature(feature);
        }
        highlight = feature ?? null;
      }
    };


    // Click event untuk popup
    map.on("singleclick", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
        return feat;
      });

      if (feature) {
        let coordinates = evt.coordinate;

        if (feature instanceof Feature) {
          const geometry = feature.getGeometry();
          if (geometry instanceof Point) {
            coordinates = geometry.getCoordinates();
          }
        }

        const properties = feature.getProperties();

        let content = "<div class='p-4'>";
        content += "<h3 class='font-bold text-lg mb-2 text-gray-800'>Informasi Lokasi</h3>";

        // Data Banjir
        if (properties.Nama_Pemetaan) {
          content += `<p class='mb-1'><strong>Nama Daerah:</strong> ${properties.Nama_Pemetaan}</p>`;
        }
        if (properties.Jumlah_Korban) {
          content += `<p class='mb-1'><strong>Jumlah Korban:</strong> ${properties.Jumlah_Korban}</p>`;
        }

        // Data Polygon
        if (properties.DESA) {
          content += `<p class='mb-1'><strong>Desa:</strong> ${properties.DESA}</p>`;
        }
        if (properties.OBJECTID) {
          content += `<p class='mb-1'><strong>ID:</strong> ${properties.OBJECTID}</p>`;
        }

        // Data RT/RW & Sampah
        if (properties.kelurahan) {
          content += `<p class='mb-1'><strong>Kelurahan:</strong> ${properties.kelurahan}</p>`;
        }
        if (properties.rt) {
          content += `<p class='mb-1'><strong>RT:</strong> ${properties.rt}</p>`;
        }
        if (properties.rw) {
          content += `<p class='mb-1'><strong>RW:</strong> ${properties.rw}</p>`;
        }
        if (properties.type) {
          content += `<p class='mb-1'><strong>Tipe:</strong> ${properties.type}</p>`;
        }
        if (properties.status) {
          content += `<p class='mb-1'><strong>Status:</strong> <span class='text-${properties.status === 'Aktif' ? 'green' : 'red'}-600 font-semibold'>${properties.status}</span></p>`;
        }

        content += "</div>";

        const popupContent = popupRef.current?.querySelector("#popup-content");
        if (popupContent) {
          popupContent.innerHTML = content;
        }

        // Show popup
        if (popupRef.current) {
          popupRef.current.style.display = "block";
        }
        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
        if (popupRef.current) {
          popupRef.current.style.display = "none";
        }
      }
    });

    // Pointer move untuk highlight dan info
    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        overlay.setPosition(undefined);
        if (popupRef.current) {
          popupRef.current.style.display = "none";
        }
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      highlightFeature(pixel);

      // Display info on hover
      const feature = map.forEachFeatureAtPixel(pixel, function (feat) {
        return feat;
      });
      const info = document.getElementById("info");
      if (info) {
        if (feature) {
          const props = feature.getProperties();
          info.innerHTML = props.DESA || props.kelurahan || props.Nama_Pemetaan || "Hover pada fitur";
          info.style.display = "block";
        } else {
          info.style.display = "none";
        }
      }

      // Change cursor
      map.getTargetElement().style.cursor = feature ? 'pointer' : '';
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    // Log untuk debugging
    console.log("Map initialized");

    // Check if layers loaded
    riauLayer.getSource()?.on('change', function () {
      console.log("Riau layer status:", riauLayer.getSource()?.getState());
    });
    banjirLayer.getSource()?.on('change', function () {
      console.log("Banjir layer status:", banjirLayer.getSource()?.getState());
    });
    trashLayer.getSource()?.on('change', function () {
      console.log("Trash layer status:", trashLayer.getSource()?.getState());
    });

    // Cleanup
    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Update layer visibility saat checkbox berubah
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      const layers = mapInstanceRef.current.getLayers().getArray();
      if (layers[1]) layers[1].setVisible(showPolygon); // Riau polygon
      if (layers[2]) layers[2].setVisible(showBanjir);  // Banjir points
      if (layers[3]) layers[3].setVisible(showTrash);   // Trash points
    }
  }, [showPolygon, showBanjir, showTrash, mapReady]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Filter */}
      <div className="w-80 bg-white shadow-2xl p-6 overflow-y-auto z-10 border-r border-gray-200">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Filter Layer</h3>
          <p className="text-sm text-gray-500">Pilih layer yang ingin ditampilkan</p>
        </div>

        {/* Checkbox Layers */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showPolygon}
                onChange={(e) => setShowPolygon(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <div>
                <span className="font-semibold text-gray-800 block">Polygon Kelurahan</span>
                <span className="text-xs text-gray-500">Batas wilayah Riau</span>
              </div>
            </label>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showBanjir}
                onChange={(e) => setShowBanjir(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-gray-800 block">Titik Banjir</span>
                <span className="text-xs text-gray-500">Lokasi rawan banjir</span>
              </div>
            </label>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200 hover:border-red-400 transition">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showTrash}
                onChange={(e) => setShowTrash(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <div>
                <span className="font-semibold text-gray-800 block">Titik Tempat Sampah</span>
                <span className="text-xs text-gray-500">TPS & Kontainer</span>
              </div>
            </label>
          </div>
        </div>

        {/* Filter Kelurahan */}
        <div className="mb-8">
          <h4 className="font-semibold mb-3 text-gray-700">Filter Kelurahan</h4>
          <select
            value={selectedKelurahan}
            onChange={(e) => setSelectedKelurahan(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="all">📍 Semua Kelurahan</option>
            <option value="Sukajadi">🏘️ Kelurahan Sukajadi</option>
            <option value="Tampan">🏘️ Kelurahan Tampan</option>
            <option value="Sidomulyo">🏘️ Kelurahan Sidomulyo</option>
          </select>
        </div>

        {/* Legend */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h4 className="font-semibold mb-4 text-gray-700">Legenda</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-400 rounded border-2 border-green-600 shadow-sm"></div>
              <span className="text-sm text-gray-700 font-medium">Polygon Kelurahan</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-sm text-gray-700 font-medium">Titik Banjir</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-sm text-gray-700 font-medium">Tempat Sampah</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-blue-700">💡 Tips:</strong><br />
            Klik pada marker atau polygon untuk melihat informasi detail
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Status:</strong> {mapReady ? "✅ Map Ready" : "⏳ Loading..."}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Buka Console (F12) untuk info loading
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Popup */}
        <div
          ref={popupRef}
          className="absolute bg-white rounded-xl shadow-2xl border-2 border-gray-300 min-w-[280px] hidden"
          style={{ transform: "translate(-50%, -100%)", marginBottom: "10px" }}
        >
          <button
            id="popup-closer"
            onClick={() => {
              if (popupRef.current) {
                popupRef.current.style.display = "none";
              }
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center font-bold shadow-lg transition z-10"
          >
            ×
          </button>
          <div id="popup-content" className="text-sm"></div>
        </div>

        {/* Info Display on Hover */}
        <div
          id="info"
          className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-gray-700 border border-gray-200 hidden"
        ></div>

        {/* Back Button */}
        <a
          href="/"
          className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold flex items-center gap-2"
        >
          <span>←</span>
          Kembali ke Profil
        </a>

        {/* Loading Indicator */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading Map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
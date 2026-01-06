"use client";

import { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Icon, Style, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { supabase } from "@/lib/supabase"; // Pastikan path ini sesuai

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  // State visibility layer
  const [showKelurahan, setShowKelurahan] = useState(true);
  const [showRTRW, setShowRTRW] = useState(true);
  const [showTrash, setShowTrash] = useState(true);
  
  const [mapReady, setMapReady] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fungsi helper untuk mengambil data dari Supabase
  const fetchSupabaseLayer = async (category: string, source: VectorSource) => {
    try {
      const { data, error } = await supabase
        .from('database_gis')
        .select('data_json')
        .eq('kategori', category);

      if (error) {
        console.error(`Error fetching ${category}:`, error);
        return;
      }

      if (data && data.length > 0) {
        const geoJsonFormat = new GeoJSON();
        
        data.forEach((row) => {
          if (row.data_json) {
            const features = geoJsonFormat.readFeatures(row.data_json, {
              featureProjection: 'EPSG:3857'
            });
            source.addFeatures(features);
          }
        });
        console.log(`Success loading ${category}: ${source.getFeatures().length} features`);
      }
    } catch (err) {
      console.error(`Unexpected error loading ${category}:`, err);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !popupRef.current || mapInstanceRef.current) return;

    setIsLoadingData(true);

    // 1. Setup Overlay Popup
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: { animation: { duration: 250 } },
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });

    // 2. Setup Sources
    const kelurahanSource = new VectorSource();
    const rtrwSource = new VectorSource();
    const trashSource = new VectorSource();

    // 3. Setup Layers
    // Layer Kelurahan (Polygon)
    const kelurahanLayer = new VectorLayer({
      source: kelurahanSource,
      style: new Style({
        fill: new Fill({ color: "rgba(145, 255, 131, 0.3)" }),
        stroke: new Stroke({ color: "#91ff83", width: 2 }),
      }),
      visible: showKelurahan,
      zIndex: 1,
    });

    // Layer RTRW (Point) - DIUBAH: Menggunakan Ikon Rumah
    const rtrwLayer = new VectorLayer({
      source: rtrwSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          // SVG Ikon Rumah (warna biru tua #3F51B5)
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjMyIiBmaWxsPSIjM0Y1MUI1Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDIwdi02aDR2Nmg1di04aDNMMTIgMyAyIDEyaDN2OHoiLz48L3N2Zz4=",
          scale: 1.2,
        }),
      }),
      visible: showRTRW,
      zIndex: 2,
    });

    // Layer Sampah (Point)
    const trashLayer = new VectorLayer({
      source: trashSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRUYzNDM0Ij48cGF0aCBkPSJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eiIvPjwvc3ZnPg==",
          scale: 1.2,
        }),
      }),
      visible: showTrash,
      zIndex: 3,
    });

    // 4. Inisialisasi Map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        kelurahanLayer,
        rtrwLayer,
        trashLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]), // Pekanbaru
        zoom: 12,
      }),
    });

    // 5. Fetch Data dari Supabase
    // 5. Fetch Data dari Supabase & Auto-Zoom
    Promise.all([
      fetchSupabaseLayer('kelurahan', kelurahanSource),
      fetchSupabaseLayer('rtrw', rtrwSource),
      fetchSupabaseLayer('sampah', trashSource)
    ]).then(() => {
      setIsLoadingData(false);
      console.log("All data fetched from Supabase");

      // --- LOGIKA AUTO ZOOM KE POLIGON ---
      // Kita ambil extent (batas kotak terluar) dari source Kelurahan
      const extent = kelurahanSource.getExtent();

      // Cek apakah extent valid (tidak kosong/infinity)
      // Ini mencegah error jika database kosong
      if (extent && extent.length === 4 && !extent.some(val => !isFinite(val))) {
        map.getView().fit(extent, {
          padding: [50, 50, 50, 50], // Memberi jarak 50px dari tepi layar agar tidak mepet
          duration: 1000,            // Animasi zoom selama 1 detik (opsional)
          maxZoom: 16                // Mencegah zoom terlalu dekat jika poligonnya sangat kecil
        });
      }
    });

    // 6. Interaction Logic (Highlight & Popup)
    const featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: map,
      style: new Style({
        stroke: new Stroke({ color: "rgba(255, 255, 255, 0.9)", width: 3 }),
        fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" })
      }),
      zIndex: 4
    });

    let highlight: Feature<Geometry> | null = null;

    const highlightFeature = (pixel: number[]) => {
      const feature = map.forEachFeatureAtPixel(pixel, (feat) => feat) as Feature<Geometry> | undefined;

      if (feature !== highlight) {
        if (highlight) featureOverlay.getSource()?.removeFeature(highlight);
        if (feature) featureOverlay.getSource()?.addFeature(feature);
        highlight = feature ?? null;
      }
    };

    map.on("pointermove", function (evt) {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      highlightFeature(pixel);
      map.getTargetElement().style.cursor = map.hasFeatureAtPixel(pixel) ? 'pointer' : '';
    });

    map.on("singleclick", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);

      if (feature) {
        const properties = feature.getProperties();
        let coordinates = evt.coordinate;
        
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          coordinates = geometry.getCoordinates();
        }

        let content = "<div class='p-4 min-w-[200px]'>";
        content += "<h3 class='font-bold text-lg mb-2 text-gray-800 border-b pb-1'>Detail Objek</h3>";

        Object.keys(properties).forEach(key => {
          if (key !== 'geometry' && typeof properties[key] !== 'object') {
             content += `<p class='mb-1 text-sm'><strong class='capitalize'>${key.replace(/_/g, ' ')}:</strong> ${properties[key]}</p>`;
          }
        });

        content += "</div>";

        const popupContent = popupRef.current?.querySelector("#popup-content");
        if (popupContent) popupContent.innerHTML = content;
        if (popupRef.current) popupRef.current.style.display = "block";
        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
        if (popupRef.current) popupRef.current.style.display = "none";
      }
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // Update visibility saat checkbox berubah
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const layers = mapInstanceRef.current.getLayers().getArray();
    
    if (layers[1]) layers[1].setVisible(showKelurahan);
    if (layers[2]) layers[2].setVisible(showRTRW);
    if (layers[3]) layers[3].setVisible(showTrash);
  }, [showKelurahan, showRTRW, showTrash]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Filter */}
      <div className="w-80 bg-white shadow-2xl p-6 overflow-y-auto z-10 border-r border-gray-200 flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">WebGIS Dashboard</h3>
          <p className="text-sm text-gray-500">Data bersumber dari Supabase</p>
        </div>

        {/* Checkbox Layers */}
        <div className="space-y-4 mb-8 flex-1">
          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showKelurahan}
                onChange={(e) => setShowKelurahan(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="font-semibold text-gray-800 block">Area Kelurahan</span>
                <span className="text-xs text-gray-500">Layer Polygon</span>
              </div>
            </label>
          </div>

          {/* DIUBAH: Label untuk RTRW */}
          <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showRTRW}
                onChange={(e) => setShowRTRW(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-gray-800 block">Titik RTRW</span>
                {/* Deskripsi diubah */}
                <span className="text-xs text-gray-500">Layer Point (Zonasi/Perumahan)</span>
              </div>
            </label>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showTrash}
                onChange={(e) => setShowTrash(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="font-semibold text-gray-800 block">Titik Sampah</span>
                <span className="text-xs text-gray-500">Layer Point</span>
              </div>
            </label>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
          <p><strong>Status Map:</strong> {mapReady ? "✅ Ready" : "⏳ Init..."}</p>
          <p><strong>Status Data:</strong> {isLoadingData ? "⏳ Fetching..." : "✅ Loaded"}</p>
        </div>
        
         <a href="/" className="mt-4 block w-full text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition">
          Kembali ke Home
        </a>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Popup */}
        <div
          ref={popupRef}
          className="absolute bg-white rounded-xl shadow-2xl border-2 border-gray-300 min-w-[280px] hidden"
          style={{ marginBottom: "15px" }}
        >
          <button
            onClick={() => { if (popupRef.current) popupRef.current.style.display = "none"; }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition"
          >
            ×
          </button>
          <div id="popup-content" className="text-sm text-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
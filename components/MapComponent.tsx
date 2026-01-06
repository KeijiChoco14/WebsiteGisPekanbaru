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
import Point from "ol/geom/Point";
import { supabase } from "@/lib/supabase";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  const [showKelurahan, setShowKelurahan] = useState(true);
  const [showRTRW, setShowRTRW] = useState(true);
  const [showSampah, setShowSampah] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // FETCH SAMPAH (Column: keterangan, alamat, lat, long)
  const fetchSampah = async (source: VectorSource) => {
    const { data } = await supabase.from('lokasi_sampah').select('*');
    if (data) {
      data.forEach(item => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.longitude, item.latitude])),
          nama: item.keterangan, // Gunakan keterangan sebagai judul popup
          alamat: item.alamat,   // Tampilkan alamat
          tipe: 'Sampah'
        });
        source.addFeature(feature);
      });
    }
  };

  // FETCH RTRW (Column: keterangan, alamat, lat, long)
  const fetchRTRW = async (source: VectorSource) => {
    const { data } = await supabase.from('lokasi_rtrw').select('*');
    if (data) {
      data.forEach(item => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.longitude, item.latitude])),
          nama: item.keterangan, // Gunakan keterangan sebagai judul popup
          alamat: item.alamat,
          tipe: 'RTRW'
        });
        source.addFeature(feature);
      });
    }
  };

  // FETCH KELURAHAN (Format GeoJSON)
  const fetchKelurahan = async (source: VectorSource) => {
    const { data } = await supabase.from('area_kelurahan').select('*');
    if (data) {
      const geoJsonFormat = new GeoJSON();
      data.forEach(item => {
        if (item.data_geojson) {
          const features = geoJsonFormat.readFeatures(item.data_geojson, { featureProjection: 'EPSG:3857' });
          features.forEach(f => {
            f.set('nama', item.nama_kelurahan);
            f.set('tipe', 'Kelurahan');
          });
          source.addFeatures(features);
        }
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current || !popupRef.current || mapInstanceRef.current) return;
    setIsLoadingData(true);

    const sampahSource = new VectorSource();
    const rtrwSource = new VectorSource();
    const kelurahanSource = new VectorSource();

    // SETUP LAYER
    const kelurahanLayer = new VectorLayer({
      source: kelurahanSource,
      style: new Style({
        fill: new Fill({ color: "rgba(145, 255, 131, 0.4)" }),
        stroke: new Stroke({ color: "#2E7D32", width: 2 }),
      }),
      visible: showKelurahan,
    });

    const rtrwLayer = new VectorLayer({
      source: rtrwSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjMyIiBmaWxsPSIjM0Y1MUI1Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDIwdi02aDR2Nmg1di04aDNMMTIgMyAyIDEyaDN2OHoiLz48L3N2Zz4=",
          scale: 1.2,
        }),
      }),
      visible: showRTRW,
    });

    const sampahLayer = new VectorLayer({
      source: sampahSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRUYzNDM0Ij48cGF0aCBkPSJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eiIvPjwvc3ZnPg==",
          scale: 1.2,
        }),
      }),
      visible: showSampah,
    });

    // INIT MAP
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: { animation: { duration: 250 } },
      positioning: "bottom-center",
      offset: [0, -10],
    });

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), kelurahanLayer, rtrwLayer, sampahLayer],
      overlays: [overlay],
      view: new View({ center: fromLonLat([101.438, 0.510]), zoom: 12 }),
    });

    // LOAD DATA
    Promise.all([fetchSampah(sampahSource), fetchRTRW(rtrwSource), fetchKelurahan(kelurahanSource)]).then(() => {
      setIsLoadingData(false);
      const extent = kelurahanSource.getExtent();
      if (extent && extent.length === 4 && !extent.some(val => !isFinite(val))) {
        map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 1000, maxZoom: 16 });
      }
    });

    // INTERACTION
    map.on("pointermove", function (evt) {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (feat) => feat);
      map.getTargetElement().style.cursor = feature ? 'pointer' : '';
    });

    map.on("singleclick", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
      if (feature) {
        const props = feature.getProperties();
        const geometry = feature.getGeometry();
        let coordinates = evt.coordinate;
        if (geometry instanceof Point) coordinates = geometry.getCoordinates();

        // KONTEN POPUP DINAMIS
        let content = `<div class="p-3 min-w-[200px]">`;
        content += `<h3 class="font-bold text-gray-800 border-b pb-1 mb-2">${props.nama || 'Tanpa Keterangan'}</h3>`;
        if (props.alamat) content += `<p class="text-sm text-gray-600 mb-1">📍 ${props.alamat}</p>`;
        content += `<p class="text-xs text-blue-600 font-bold mt-2 uppercase">${props.tipe}</p>`;
        content += `</div>`;

        if (popupRef.current) {
          const contentDiv = popupRef.current.querySelector("#popup-content");
          if(contentDiv) contentDiv.innerHTML = content;
          popupRef.current.style.display = "block";
        }
        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
        if (popupRef.current) popupRef.current.style.display = "none";
      }
    });

    mapInstanceRef.current = map;
    return () => { map.setTarget(undefined); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const layers = mapInstanceRef.current.getLayers().getArray();
    if(layers[1]) layers[1].setVisible(showKelurahan);
    if(layers[2]) layers[2].setVisible(showRTRW);
    if(layers[3]) layers[3].setVisible(showSampah);
  }, [showKelurahan, showRTRW, showSampah]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white shadow-xl p-6 z-10 flex flex-col h-full border-r">
        <h2 className="text-2xl font-bold mb-6">GIS Dashboard</h2>
        <div className="space-y-4 flex-1">
          <label className="flex items-center gap-3 p-3 bg-green-50 rounded cursor-pointer">
            <input type="checkbox" checked={showKelurahan} onChange={e => setShowKelurahan(e.target.checked)} className="w-5 h-5"/>
            <span className="font-bold text-gray-700">Area Kelurahan</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-blue-50 rounded cursor-pointer">
            <input type="checkbox" checked={showRTRW} onChange={e => setShowRTRW(e.target.checked)} className="w-5 h-5"/>
            <span className="font-bold text-gray-700">Zonasi RTRW</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-red-50 rounded cursor-pointer">
            <input type="checkbox" checked={showSampah} onChange={e => setShowSampah(e.target.checked)} className="w-5 h-5"/>
            <span className="font-bold text-gray-700">Titik Sampah</span>
          </label>
        </div>
        <div className="mt-auto pt-4 border-t">
            <p className="text-xs text-center mb-2 text-gray-500">{isLoadingData ? "Loading..." : "Ready"}</p>
            <a href="/admin/dashboard" className="block w-full py-2 bg-gray-800 text-white text-center rounded font-bold">Masuk Admin</a>
        </div>
      </div>
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        <div ref={popupRef} className="absolute bg-white rounded shadow-lg border hidden" style={{marginBottom: '15px'}}>
             <div id="popup-content"></div>
             <button onClick={() => {if(popupRef.current) popupRef.current.style.display = 'none'}} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full font-bold shadow">X</button>
        </div>
      </div>
    </div>
  );
}
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
import { asArray } from 'ol/color';
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Layers, Home, Loader2, Trash2, Map as MapIcon } from "lucide-react";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  const [showKelurahan, setShowKelurahan] = useState(true);
  const [showRTRW, setShowRTRW] = useState(true);
  const [showSampah, setShowSampah] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // --- Fetch Logic (Tetap sama) ---
  const fetchSampah = async (source: VectorSource) => {
    const { data } = await supabase.from('lokasi_sampah').select('*');
    if (data) {
      data.forEach(item => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.longitude, item.latitude])),
          nama: item.keterangan,
          alamat: item.alamat,
          tipe: 'Sampah'
        });
        source.addFeature(feature);
      });
    }
  };

  const fetchRTRW = async (source: VectorSource) => {
    const { data } = await supabase.from('lokasi_rtrw').select('*');
    if (data) {
      data.forEach(item => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.longitude, item.latitude])),
          nama: item.keterangan,
          alamat: item.alamat,
          tipe: 'RTRW'
        });
        source.addFeature(feature);
      });
    }
  };

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
            f.set('warna', item.warna_fill);
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

    const kelurahanLayer = new VectorLayer({
      source: kelurahanSource,
      style: (feature) => {
        const rawColor = feature.get('warna') || "#10b981"; // Default Emerald
        let colorArray = asArray(rawColor);
        colorArray[3] = 0.4; // Lebih transparan agar elegan
        return new Style({
          fill: new Fill({ color: colorArray }),
          stroke: new Stroke({ color: rawColor, width: 2 }),
        });
      },
      visible: showKelurahan,
    });

    const rtrwLayer = new VectorLayer({
      source: rtrwSource,
      style: new Style({
        image: new Icon({ anchor: [0.5, 1], src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjMyIiBmaWxsPSIjM0Y1MUI1Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDIwdi02aDR2Nmg1di04aDNMMTIgMyAyIDEyaDN2OHoiLz48L3N2Zz4=", scale: 1 }),
      }),
      visible: showRTRW,
    });

    const sampahLayer = new VectorLayer({
      source: sampahSource,
      style: new Style({
        image: new Icon({ anchor: [0.5, 1], src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRUYzNDM0Ij48cGF0aCBkPSJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eiIvPjwvc3ZnPg==", scale: 1 }),
      }),
      visible: showSampah,
    });

    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: { animation: { duration: 250 } },
      positioning: "bottom-center",
      offset: [0, -15],
    });

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), kelurahanLayer, rtrwLayer, sampahLayer],
      overlays: [overlay],
      view: new View({ center: fromLonLat([101.438, 0.510]), zoom: 12 }),
    });

    Promise.all([fetchSampah(sampahSource), fetchRTRW(rtrwSource), fetchKelurahan(kelurahanSource)]).then(() => {
      setIsLoadingData(false);
      const extent = kelurahanSource.getExtent();
      if (extent && extent.length === 4 && !extent.some(val => !isFinite(val))) {
        map.getView().fit(extent, { padding: [100, 100, 100, 100], duration: 1500 });
      }
    });

    map.on("singleclick", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
      if (feature) {
        const props = feature.getProperties();
        const geometry = feature.getGeometry();
        let coordinates = evt.coordinate;
        if (geometry instanceof Point) coordinates = geometry.getCoordinates();

        setSelectedFeature(props);
        overlay.setPosition(coordinates);
      } else {
        setSelectedFeature(null);
        overlay.setPosition(undefined);
      }
    });

    mapInstanceRef.current = map;
    return () => { map.setTarget(undefined); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const layers = mapInstanceRef.current.getLayers().getArray();
    layers[1]?.setVisible(showKelurahan);
    layers[2]?.setVisible(showRTRW);
    layers[3]?.setVisible(showSampah);
  }, [showKelurahan, showRTRW, showSampah]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[340px] bg-white/80 backdrop-blur-xl z-20 flex flex-col h-full border-r border-emerald-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        <div className="p-8">
          {/* Header Branding */}
          <div className="flex items-center gap-4 mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <MapPin size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-800 leading-none">WebGIS</h2>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">Pekanbaru Smart City</p>
            </div>
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Layers size={12} />
            Layer Kontrol
          </p>
          
          {/* Layer Controls */}
          <div className="space-y-4">
            {[
              { id: 'kelurahan', label: 'Area Kelurahan', state: showKelurahan, setter: setShowKelurahan, color: 'text-emerald-600', activeBg: 'bg-emerald-50 border-emerald-200', icon: MapIcon },
              { id: 'rtrw', label: 'Zonasi RTRW', state: showRTRW, setter: setShowRTRW, color: 'text-blue-600', activeBg: 'bg-blue-50 border-blue-200', icon: Home },
              { id: 'sampah', label: 'Titik Sampah', state: showSampah, setter: setShowSampah, color: 'text-rose-600', activeBg: 'bg-rose-50 border-rose-200', icon: Trash2 },
            ].map((layer) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={layer.id} 
                className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${layer.state ? `${layer.activeBg} shadow-sm` : 'bg-white border-slate-100 text-slate-400'}`}
                onClick={() => layer.setter(!layer.state)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${layer.state ? 'bg-white' : 'bg-slate-50'}`}>
                    <layer.icon size={18} className={layer.state ? layer.color : 'text-slate-400'} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${layer.state ? 'text-slate-800' : 'text-slate-400'}`}>{layer.label}</span>
                    <span className="text-[9px] font-bold uppercase opacity-60">{layer.state ? 'Ditampilkan' : 'Disembunyikan'}</span>
                  </div>
                </div>
                
                {/* Modern Toggle Switch */}
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${layer.state ? 'bg-slate-800' : 'bg-slate-200'}`}>
                   <motion.div 
                    animate={{ x: layer.state ? 18 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                   />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/50">
          {/* Status Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
             <div className="flex items-center justify-between mb-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Sistem</span>
               <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold uppercase">Online</span>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isLoadingData ? '60%' : '100%' }}
                    className="h-full bg-emerald-500 rounded-full"
                 />
               </div>
               {isLoadingData ? (
                 <Loader2 size={12} className="animate-spin text-emerald-500" />
               ) : (
                 <span className="text-[10px] font-mono text-slate-400 font-bold">100%</span>
               )}
             </div>
          </div>
          
          <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white hover:bg-emerald-600 rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-emerald-200 active:scale-95 group">
            <span>Login Administrator</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </motion.aside>

      {/* --- MAP AREA --- */}
      <main className="flex-1 relative overflow-hidden">
        {/* Map Container dengan sedikit filter agar OSM tidak terlalu mencolok */}
        <div ref={mapRef} className="w-full h-full grayscale-[0.1] contrast-[1.05]" />
        
        {/* Floating Home Button */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 right-6 z-20"
        >
          <Link 
              href="/" 
              className="px-5 py-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 font-bold text-slate-700 hover:text-emerald-600 hover:bg-white transition-all flex items-center gap-3 border border-white active:scale-95 group"
          >
              <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                <Home size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">Kembali ke Beranda</span>
          </Link>
        </motion.div>

        {/* --- CUSTOM POPUP (Light Theme) --- */}
        <div ref={popupRef} className="pointer-events-auto">
          <AnimatePresence>
            {selectedFeature && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                className="bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl border border-white/50 min-w-[280px] relative text-slate-800"
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md">
                      {selectedFeature.tipe}
                    </span>
                    <button 
                      onClick={() => setSelectedFeature(null)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors font-bold text-xs"
                    >✕</button>
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">
                    {selectedFeature.nama || 'Aset Tanpa Nama'}
                  </h3>
                  
                  {selectedFeature.alamat && (
                    <div className="flex gap-2 items-start mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {selectedFeature.alamat}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Live Data</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  </div>
                </div>

                {/* Arrow Pointer */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-slate-100"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
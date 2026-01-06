"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link"; // <--- TAMBAHAN IMPORT

// Tipe data disesuaikan dengan database baru
type Sampah = { id: number; keterangan: string; alamat: string; latitude: number; longitude: number };
type RTRW = { id: number; keterangan: string; alamat: string; latitude: number; longitude: number };
type Kelurahan = { id: number; nama_kelurahan: string; data_geojson: any };

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sampah" | "rtrw" | "kelurahan">("sampah");

  // State Data List
  const [listSampah, setListSampah] = useState<Sampah[]>([]);
  const [listRTRW, setListRTRW] = useState<RTRW[]>([]);
  const [listKelurahan, setListKelurahan] = useState<Kelurahan[]>([]);

  // State Form Input
  const [formSampah, setFormSampah] = useState({ keterangan: "", alamat: "", lat: "", long: "" });
  const [formRTRW, setFormRTRW] = useState({ keterangan: "", alamat: "", lat: "", long: "" });
  const [formKelurahan, setFormKelurahan] = useState({ nama: "", geojson: "" });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else fetchData();
    };
    checkSession();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const { data: sampah } = await supabase.from("lokasi_sampah").select("*").order("id", { ascending: false });
    if (sampah) setListSampah(sampah);

    const { data: rtrw } = await supabase.from("lokasi_rtrw").select("*").order("id", { ascending: false });
    if (rtrw) setListRTRW(rtrw);

    const { data: kel } = await supabase.from("area_kelurahan").select("*").order("id", { ascending: false });
    if (kel) setListKelurahan(kel);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "sampah") {
        const { error } = await supabase.from("lokasi_sampah").insert({
          keterangan: formSampah.keterangan,
          alamat: formSampah.alamat,
          latitude: parseFloat(formSampah.lat),
          longitude: parseFloat(formSampah.long)
        });
        if (error) throw error;
        setFormSampah({ keterangan: "", alamat: "", lat: "", long: "" });
      } 
      else if (activeTab === "rtrw") {
        const { error } = await supabase.from("lokasi_rtrw").insert({
          keterangan: formRTRW.keterangan,
          alamat: formRTRW.alamat,
          latitude: parseFloat(formRTRW.lat),
          longitude: parseFloat(formRTRW.long)
        });
        if (error) throw error;
        setFormRTRW({ keterangan: "", alamat: "", lat: "", long: "" });
      }
      else if (activeTab === "kelurahan") {
        let parsedJson;
        try { parsedJson = JSON.parse(formKelurahan.geojson); } catch (err) { alert("GeoJSON Invalid"); return; }
        const { error } = await supabase.from("area_kelurahan").insert({
          nama_kelurahan: formKelurahan.nama,
          data_geojson: parsedJson
        });
        if (error) throw error;
        setFormKelurahan({ nama: "", geojson: "" });
      }
      alert("Data berhasil disimpan!");
      fetchData();
    } catch (err: any) {
      alert("Gagal: " + err.message);
    }
  };

  const handleDelete = async (table: string, id: number) => {
    if (!confirm("Hapus data ini?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading && listSampah.length === 0) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* --- BAGIAN HEADER DIPERBARUI --- */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Tombol Kembali ke Peta Utama */}
            <Link 
              href="/map" 
              className="text-gray-600 hover:text-blue-600 text-sm font-semibold flex items-center gap-1 transition"
            >
              ← Lihat Peta
            </Link>

            <div className="h-5 w-px bg-gray-300"></div> {/* Garis Pemisah */}

            {/* Tombol Logout */}
            <button 
              onClick={handleLogout} 
              className="text-red-600 hover:text-red-800 text-sm font-bold transition"
            >
              Logout
            </button>
          </div>
        </div>
        {/* ------------------------------- */}

        {/* Tabs */}
        <div className="flex border-b">
          <button onClick={() => setActiveTab("sampah")} className={`flex-1 p-4 font-bold ${activeTab === "sampah" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>🗑️ Sampah</button>
          <button onClick={() => setActiveTab("rtrw")} className={`flex-1 p-4 font-bold ${activeTab === "rtrw" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>🏠 RTRW</button>
          <button onClick={() => setActiveTab("kelurahan")} className={`flex-1 p-4 font-bold ${activeTab === "kelurahan" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>🗺️ Kelurahan</button>
        </div>

        {/* Input Form */}
        <div className="p-6 bg-blue-50 border-b">
          <h2 className="font-bold mb-4 text-gray-700">Input Data Baru ({activeTab.toUpperCase()})</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {activeTab === "sampah" && (
              <>
                <input required placeholder="Keterangan (Contoh: TPS Pasar)" className="p-2 border rounded" value={formSampah.keterangan} onChange={e => setFormSampah({...formSampah, keterangan: e.target.value})} />
                <input required placeholder="Alamat" className="p-2 border rounded" value={formSampah.alamat} onChange={e => setFormSampah({...formSampah, alamat: e.target.value})} />
                <input required type="number" step="any" placeholder="Latitude" className="p-2 border rounded" value={formSampah.lat} onChange={e => setFormSampah({...formSampah, lat: e.target.value})} />
                <input required type="number" step="any" placeholder="Longitude" className="p-2 border rounded" value={formSampah.long} onChange={e => setFormSampah({...formSampah, long: e.target.value})} />
              </>
            )}

            {activeTab === "rtrw" && (
              <>
                <input required placeholder="Keterangan (Contoh: Zona Industri)" className="p-2 border rounded" value={formRTRW.keterangan} onChange={e => setFormRTRW({...formRTRW, keterangan: e.target.value})} />
                <input required placeholder="Alamat" className="p-2 border rounded" value={formRTRW.alamat} onChange={e => setFormRTRW({...formRTRW, alamat: e.target.value})} />
                <input required type="number" step="any" placeholder="Latitude" className="p-2 border rounded" value={formRTRW.lat} onChange={e => setFormRTRW({...formRTRW, lat: e.target.value})} />
                <input required type="number" step="any" placeholder="Longitude" className="p-2 border rounded" value={formRTRW.long} onChange={e => setFormRTRW({...formRTRW, long: e.target.value})} />
              </>
            )}

            {activeTab === "kelurahan" && (
              <div className="col-span-2 space-y-3">
                <input required placeholder="Nama Kelurahan" className="w-full p-2 border rounded" value={formKelurahan.nama} onChange={e => setFormKelurahan({...formKelurahan, nama: e.target.value})} />
                <textarea required rows={5} placeholder="Paste GeoJSON Polygon di sini" className="w-full p-2 border rounded font-mono text-sm" value={formKelurahan.geojson} onChange={e => setFormKelurahan({...formKelurahan, geojson: e.target.value})} />
              </div>
            )}

            <button type="submit" className="col-span-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition shadow">Simpan Data</button>
          </form>
        </div>

        {/* Table List */}
        <div className="p-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b"><th className="pb-2 text-gray-600">ID</th><th className="pb-2 text-gray-600">Keterangan</th><th className="pb-2 text-gray-600">Alamat / Detail</th><th className="pb-2 text-right text-gray-600">Aksi</th></tr>
            </thead>
            <tbody>
              {activeTab === "sampah" && listSampah.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-gray-500">#{item.id}</td>
                  <td className="font-bold text-gray-800">{item.keterangan}</td>
                  <td>{item.alamat}<br/><span className="text-gray-400 text-xs">{item.latitude}, {item.longitude}</span></td>
                  <td className="text-right"><button onClick={() => handleDelete("lokasi_sampah", item.id)} className="text-red-500 font-bold hover:underline">Hapus</button></td>
                </tr>
              ))}
              {activeTab === "rtrw" && listRTRW.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-gray-500">#{item.id}</td>
                  <td className="font-bold text-gray-800">{item.keterangan}</td>
                  <td>{item.alamat}<br/><span className="text-gray-400 text-xs">{item.latitude}, {item.longitude}</span></td>
                  <td className="text-right"><button onClick={() => handleDelete("lokasi_rtrw", item.id)} className="text-red-500 font-bold hover:underline">Hapus</button></td>
                </tr>
              ))}
              {activeTab === "kelurahan" && listKelurahan.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-gray-500">#{item.id}</td>
                  <td className="font-bold text-gray-800">{item.nama_kelurahan}</td>
                  <td className="truncate max-w-xs text-gray-400">Polygon GeoJSON...</td>
                  <td className="text-right"><button onClick={() => handleDelete("area_kelurahan", item.id)} className="text-red-500 font-bold hover:underline">Hapus</button></td>
                </tr>
              ))}
              
              {/* State Kosong */}
              {((activeTab === "sampah" && listSampah.length === 0) || 
                (activeTab === "rtrw" && listRTRW.length === 0) || 
                (activeTab === "kelurahan" && listKelurahan.length === 0)) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 italic">Belum ada data. Silakan tambah data baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, XCircle, Save, PlusCircle } from "lucide-react"; // Import icon tambahan

// Types
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

  // --- STATE EDITING ---
  const [editingId, setEditingId] = useState<number | null>(null); // Null = Mode Tambah, Number = Mode Edit

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Form Input
  const [formSampah, setFormSampah] = useState({ keterangan: "", alamat: "", lat: "", long: "" });
  const [formRTRW, setFormRTRW] = useState({ keterangan: "", alamat: "", lat: "", long: "" });
  const [formKelurahan, setFormKelurahan] = useState({ nama: "", geojson: "" });

  // Reset halaman & Editing saat pindah tab
  useEffect(() => {
    setCurrentPage(1);
    resetForm();
  }, [activeTab]);

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

  // --- LOGIC PAGINATION ---
  const activeList = useMemo(() => {
    if (activeTab === "sampah") return listSampah;
    if (activeTab === "rtrw") return listRTRW;
    return listKelurahan;
  }, [activeTab, listSampah, listRTRW, listKelurahan]);

  const totalPages = Math.ceil(activeList.length / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return activeList.slice(firstIndex, lastIndex);
  }, [activeList, currentPage]);

  // --- LOGIC FORM HANDLING ---

  const resetForm = () => {
    setEditingId(null);
    setFormSampah({ keterangan: "", alamat: "", lat: "", long: "" });
    setFormRTRW({ keterangan: "", alamat: "", lat: "", long: "" });
    setFormKelurahan({ nama: "", geojson: "" });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    
    // Scroll ke atas agar user melihat form
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (activeTab === "sampah") {
      setFormSampah({
        keterangan: item.keterangan || "",
        alamat: item.alamat || "",
        lat: item.latitude?.toString() || "",
        long: item.longitude?.toString() || ""
      });
    } else if (activeTab === "rtrw") {
      setFormRTRW({
        keterangan: item.keterangan || "",
        alamat: item.alamat || "",
        lat: item.latitude?.toString() || "",
        long: item.longitude?.toString() || ""
      });
    } else if (activeTab === "kelurahan") {
      setFormKelurahan({
        nama: item.nama_kelurahan || "",
        geojson: JSON.stringify(item.data_geojson, null, 2) // Pretty print JSON
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let error;

      // 1. LOGIC UNTUK TAB SAMPAH
      if (activeTab === "sampah") {
        const payload = {
          keterangan: formSampah.keterangan,
          alamat: formSampah.alamat,
          latitude: parseFloat(formSampah.lat),
          longitude: parseFloat(formSampah.long)
        };

        if (editingId) {
          // MODE UPDATE
          ({ error } = await supabase.from("lokasi_sampah").update(payload).eq("id", editingId));
        } else {
          // MODE INSERT
          ({ error } = await supabase.from("lokasi_sampah").insert(payload));
        }
      } 
      
      // 2. LOGIC UNTUK TAB RTRW
      else if (activeTab === "rtrw") {
        const payload = {
          keterangan: formRTRW.keterangan,
          alamat: formRTRW.alamat,
          latitude: parseFloat(formRTRW.lat),
          longitude: parseFloat(formRTRW.long)
        };

        if (editingId) {
            ({ error } = await supabase.from("lokasi_rtrw").update(payload).eq("id", editingId));
        } else {
            ({ error } = await supabase.from("lokasi_rtrw").insert(payload));
        }
      }
      
      // 3. LOGIC UNTUK TAB KELURAHAN
      else if (activeTab === "kelurahan") {
        let parsedJson;
        try { parsedJson = JSON.parse(formKelurahan.geojson); } catch (err) { alert("GeoJSON Invalid"); return; }
        
        const payload = {
          nama_kelurahan: formKelurahan.nama,
          data_geojson: parsedJson
        };

        if (editingId) {
            ({ error } = await supabase.from("area_kelurahan").update(payload).eq("id", editingId));
        } else {
            ({ error } = await supabase.from("area_kelurahan").insert(payload));
        }
      }

      if (error) throw error;
      
      alert(editingId ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
      resetForm();
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

  if (loading && activeList.length === 0) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 font-bold animate-pulse">
      Memuat Data Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Admin Control</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/map" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2">
            <span>🗺️</span> Lihat Peta
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
            <span>🚪</span> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-2">
            {[
              { id: 'sampah', label: 'Titik Sampah', icon: '🗑️' },
              { id: 'rtrw', label: 'Zonasi RTRW', icon: '🏠' },
              { id: 'kelurahan', label: 'Area Kelurahan', icon: '🗺️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all z-10 flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-lg" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
              
              {/* HEADER FORM DINAMIS */}
              <div className={`p-6 text-white transition-colors duration-300 ${editingId ? 'bg-amber-500' : 'bg-slate-900'}`}>
                <h2 className="font-bold text-lg flex items-center gap-2">
                  {editingId ? <Pencil size={20} /> : <PlusCircle size={20} />} 
                  {editingId ? "Edit Data" : "Tambah Data"}
                </h2>
                {editingId && <p className="text-xs text-amber-100 mt-1">Sedang mengedit ID: #{editingId}</p>}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 {activeTab === "sampah" && (
                  <>
                    <InputGroup label="Keterangan" value={formSampah.keterangan} onChange={(e:any) => setFormSampah({...formSampah, keterangan: e.target.value})} placeholder="Contoh: TPS Pasar Bawah" />
                    <InputGroup label="Alamat" value={formSampah.alamat} onChange={(e:any) => setFormSampah({...formSampah, alamat: e.target.value})} placeholder="Jl. Jendral Sudirman..." />
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Latitude" type="number" value={formSampah.lat} onChange={(e:any) => setFormSampah({...formSampah, lat: e.target.value})} placeholder="-0.51..." />
                      <InputGroup label="Longitude" type="number" value={formSampah.long} onChange={(e:any) => setFormSampah({...formSampah, long: e.target.value})} placeholder="101.44..." />
                    </div>
                  </>
                )}
                {activeTab === "rtrw" && (
                  <>
                    <InputGroup 
                      label="Keterangan Lokasi" 
                      required={true}
                      value={formRTRW.keterangan} 
                      onChange={(e:any) => setFormRTRW({...formRTRW, keterangan: e.target.value})} 
                      placeholder="Contoh: Ketua RT/RW..." 
                    />
                    <InputGroup label="Detail Lokasi" value={formRTRW.alamat} onChange={(e:any) => setFormRTRW({...formRTRW, alamat: e.target.value})} placeholder="Jl. Durian Gg. Pepaya..." />
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Latitude" type="number" value={formRTRW.lat} onChange={(e:any) => setFormRTRW({...formRTRW, lat: e.target.value})} />
                      <InputGroup label="Longitude" type="number" value={formRTRW.long} onChange={(e:any) => setFormRTRW({...formRTRW, long: e.target.value})} />
                    </div>
                  </>
                )}
                {activeTab === "kelurahan" && (
                  <>
                    <InputGroup label="Nama Kelurahan" value={formKelurahan.nama} onChange={(e:any) => setFormKelurahan({...formKelurahan, nama: e.target.value})} placeholder="Contoh: Simpang Baru" />
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">GeoJSON Polygon</label>
                      <textarea required rows={6} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs" placeholder='{"type":"Feature", ...}' value={formKelurahan.geojson} onChange={e => setFormKelurahan({...formKelurahan, geojson: e.target.value})} />
                    </div>
                  </>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 pt-2">
                  <button type="submit" className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-500'}`}>
                    <Save size={18} />
                    {editingId ? "Update Data" : "Simpan Data"}
                  </button>
                  
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={resetForm}
                      className="px-4 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition-all"
                      title="Batal Edit"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>

              </form>
            </motion.div>
          </div>

          {/* Right Column: Table with Pagination */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-lg uppercase tracking-tight">Records</h3>
              <span className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                Total: {activeList.length} items
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400">
                      <th className="p-4 font-black">ID</th>
                      <th className="p-4 font-black">Informasi</th>
                      <th className="p-4 font-black">Detail</th>
                      <th className="p-4 font-black text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence mode='popLayout'>
                      {currentItems.map((item: any) => (
                        <TableRow 
                          key={item.id} 
                          id={item.id} 
                          title={item.keterangan || item.nama_kelurahan} 
                          subtitle={item.alamat || "Data Polygon GeoJSON"} 
                          coords={item.latitude ? `${item.latitude}, ${item.longitude}` : "Geometry Area"} 
                          onDelete={() => handleDelete(activeTab === "kelurahan" ? "area_kelurahan" : (activeTab === "sampah" ? "lokasi_sampah" : "lokasi_rtrw"), item.id)}
                          onEdit={() => handleEdit(item)} // Props Edit ditambahkan
                        />
                      ))}
                    </AnimatePresence>

                    {activeList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-20 text-center opacity-30">
                          <p className="font-bold text-slate-400 uppercase tracking-widest">Kosong</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- PAGINATION CONTROLS --- */}
              {totalPages > 1 && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">
                    Halaman <span className="text-slate-900">{currentPage}</span> dari <span className="text-slate-900">{totalPages}</span>
                  </p>
                  <div className="flex gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                    >
                      ← Prev
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// COMPONENTS
function InputGroup({ label, type = "text", value, onChange, placeholder, required = true }: any) {
    return (
      <div className="mb-2">
        <label className="block text-[10px] font-black text-slate-400 mb-1 ml-1 uppercase tracking-widest">
          {label} {required ? "" : <span className="text-slate-300 font-normal">(Opsional)</span>}
        </label>
        <input 
          required={required} 
          type={type} 
          step="any"
          placeholder={placeholder}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm font-medium text-slate-800" 
          value={value} 
          onChange={onChange} 
        />
      </div>
    )
  }
  
  function TableRow({ id, title, subtitle, coords, onDelete, onEdit }: any) {
    return (
      <motion.tr 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="hover:bg-blue-50/30 transition-colors group"
      >
        <td className="p-4 text-slate-400 font-mono text-[10px]">#{id}</td>
        <td className="p-4">
          <p className="font-bold text-slate-800 text-xs uppercase tracking-tight">{title || <span className="italic text-slate-400">Tanpa Keterangan</span>}</p>
        </td>
        <td className="p-4">
          <p className="text-xs text-slate-500 line-clamp-1">{subtitle}</p>
          <p className="text-[9px] text-slate-300 font-mono mt-0.5">{coords}</p>
        </td>
        <td className="p-4 text-right flex justify-end gap-2">
          {/* TOMBOL EDIT */}
          <button 
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-500 rounded-lg shadow-sm hover:bg-amber-500 hover:text-white transition-all active:scale-90"
            title="Edit Data"
          >
            <Pencil size={14} />
          </button>
          
          {/* TOMBOL HAPUS */}
          <button 
            onClick={onDelete} 
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-rose-500 rounded-lg shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-90"
            title="Hapus Data"
          >
            <Trash2 size={14} />
          </button>
        </td>
      </motion.tr>
    )
  }

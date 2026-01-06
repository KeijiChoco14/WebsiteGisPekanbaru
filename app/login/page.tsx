"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user?.email) {
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("email")
          .eq("email", data.user.email)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          throw new Error("Akses ditolak. Email Anda tidak terdaftar sebagai admin.");
        }

        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10 p-4"
      >
        {/* LOGO AREA */}
        <div className="text-center mb-8">
            <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-block p-4 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl mb-4"
            >
                <span className="text-4xl">🛡️</span>
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin <span className="text-blue-500 italic">Access</span></h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">Geo-Vision Management System</p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 border border-white/10 relative">
          
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-2xl flex items-center gap-3">
                  <span className="text-lg">⚠️</span> {errorMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="admin@geovision.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full relative group mt-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all" />
              <div className="relative py-4 text-white font-black text-sm tracking-widest flex items-center justify-center gap-2">
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>MASUK DASHBOARD <span>→</span></>
                )}
              </div>
            </motion.button>
          </form>
        </div>

        {/* FOOTER LINK */}
        <div className="mt-10 text-center">
            <a 
                href="/" 
                className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold text-sm"
            >
                <span className="group-hover:-translate-x-1 transition-transform italic">←</span> 
                Kembali ke Peta Utama
            </a>
        </div>
      </motion.div>
    </div>
  );
}
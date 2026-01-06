"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Pastikan path ini benar
import { useRouter } from "next/navigation";

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
      // 1. Coba Login ke Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. Cek apakah email ini ada di tabel admins (Whitelist check)
      if (data.user?.email) {
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("email")
          .eq("email", data.user.email)
          .single();

        // Jika tidak ketemu di tabel admins, atau error
        if (adminError || !adminData) {
          // Logout paksa karena dia bukan admin
          await supabase.auth.signOut();
          throw new Error("Anda tidak memiliki akses admin.");
        }

        // 3. Jika sukses & terdaftar admin, lempar ke Dashboard
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 text-sm">Masuk untuk mengelola data GIS</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-800">← Kembali ke Peta Utama</a>
        </div>
      </div>
    </div>
  );
}
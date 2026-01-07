"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Trash2,
  Home,
  Users,
  BarChart3,
  Map,
  Info,
  ChevronRight,
  Building2,
  Leaf,
  ArrowRight,
  Target,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleMapTransition = () => {
    setIsLoading(true);
  };

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "data"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // Data Gabungan
  const allKelurahan = [
    {
      name: "Kelurahan Sukajadi",
      rt: 19,
      rw: 5,
      population: "10.417",
      area: "4.87",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Kantor_Lurah_Sukajadi%2C_Kecamatan_Sukajadi.jpg",
      description: "Pusat administrasi dengan kepadatan penduduk tinggi dan aksesibilitas utama.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      name: "Kelurahan Kp. Melayu",
      rt: 16,
      rw: 8,
      population: "9.454",
      area: "0.99",
      image: "https://www.pekanbaru.go.id/berkas_file/news/24052022/50298-news-lpm-kampung-melayu-o.jpeg",
      description: "Kawasan bersejarah dengan tata kelola lingkungan berbasis komunitas.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "Kelurahan Kota Baru",
      rt: 21,
      rw: 6,
      population: "3.082",
      area: "0.19",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Kelurahan_Kota_Baru%2C_Kecamatan_Pekanbaru_Kota.jpg",
      description: "Area komersial dan hunian yang sedang berkembang pesat.",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Kelurahan Sukaramai",
      rt: 22,
      rw: 7,
      population: "5.096",
      area: "0.21",
      image: "https://celotehriau.com/a450d92cb6be01b3b3669c18bfca7901/content_upload/images/IMG-20200927-WA0008.jpg",
      description: "Pusat perdagangan dengan mayoritas penduduk berwiraswasta.",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Kelurahan P. Karomah",
      rt: 13,
      rw: 3,
      population: "3.646",
      area: "0.44",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7FDoUsa_v_ydkhOvySNgC82Xn9BsimQilgQ&s",
      description: "Transformasi kawasan dari rawan banjir menjadi permukiman tertata.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      name: "Kelurahan Tanah Datar",
      rt: 26,
      rw: 7,
      population: "6.652",
      area: "0.23",
      image: "https://riaucrimenews.com/assets/berita/original/54997950552-screenshot_2023-06-08-07-28-38-75_6012fa4d4ddec268fc5c7112cbb265e7.jpg",
      description: "Kawasan padat penduduk dengan semangat gotong royong yang tinggi.",
      color: "from-rose-500 to-red-500"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* --- LOADING OVERLAY --- */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl transition-all">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-emerald-600 animate-spin" />
            <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-30 animate-pulse"></div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 font-bold text-emerald-900 text-lg tracking-widest uppercase"
          >
            Memuat Peta Digital...
          </motion.p>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 p-2.5 rounded-xl shadow-lg text-white">
                   <MapPin size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  WebGIS<span className="text-emerald-600">Sampah</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pekanbaru Smart City</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-md">
              {["home", "about", "data"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => scrollTo(e, item)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeSection === item
                      ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100"
                      : "text-slate-500 hover:text-emerald-600 hover:bg-white/50"
                  }`}
                >
                  {item === "home" ? "Beranda" : item === "about" ? "Tentang" : "Data Wilayah"}
                </a>
              ))}
            </div>

            {/* Action Button */}
            <Link
              href="/map"
              onClick={handleMapTransition}
              className="hidden md:flex group items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl hover:bg-emerald-600 transition-all active:scale-95"
            >
              <span>Buka Peta</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistem Informasi Geografis 2025
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight"
          >
            Pemetaan Cerdas <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Kelurahan Kota Pekanbaru
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Platform digital terintegrasi untuk memantau distribusi titik sampah dan data kependudukan RT/RW di Kota Pekanbaru demi lingkungan yang lebih bersih.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: MapPin, val: "6", label: "Kelurahan", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Home, val: "117", label: "Total RT", color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: Users, val: "36", label: "Total RW", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Trash2, val: "8+", label: "Titik Sampah", color: "text-rose-600", bg: "bg-rose-50" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform duration-300">
                <div className={`p-3 rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-2xl font-black text-slate-800">{stat.val}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
               <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
               <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                 Mengapa WebGIS Ini <br/><span className="text-emerald-600">Penting?</span>
               </h2>
               <p className="text-slate-600 text-lg leading-relaxed mb-6">
                 WebGIS ini digunakan sebagai media informasi titik lokasi persebaran RT/RW dan juga titik sampah yang ada di Kota Pekanbaru, Riau
               </p>
               
               <div className="space-y-4">
                 {[
                   "Visualisasi real-time lokasi pembuangan sampah ilegal & legal.",
                   "Database lengkap kependudukan level RT/RW.",
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 transition-colors">
                     <div className="bg-emerald-500 rounded-full p-1">
                       <Leaf size={14} className="text-white" />
                     </div>
                     <span className="font-medium text-slate-700">{item}</span>
                   </div>
                 ))}
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 mt-8">
                 <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl">
                    <Target size={32} className="mb-4 text-emerald-400" />
                    <h3 className="font-bold text-xl mb-2">Akurasi</h3>
                    <p className="text-sm text-slate-400">Data diambil langsung melalui survei lapangan tervalidasi.</p>
                 </div>
                 <div className="bg-emerald-100 p-6 rounded-3xl">
                    <div className="h-20 bg-emerald-200/50 rounded-xl mb-3"></div>
                    <div className="h-4 w-2/3 bg-emerald-200/50 rounded-full"></div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="bg-blue-50 p-6 rounded-3xl">
                    <div className="h-4 w-full bg-blue-200/50 rounded-full mb-3"></div>
                    <div className="h-4 w-1/2 bg-blue-200/50 rounded-full mb-6"></div>
                    <div className="h-24 bg-blue-200/50 rounded-xl"></div>
                 </div>
                 <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl">
                    <BarChart3 size={32} className="mb-4 text-blue-600" />
                    <h3 className="font-bold text-xl mb-2">Analitik</h3>
                    <p className="text-sm text-slate-500">Dashboard interaktif untuk monitoring wilayah.</p>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- DATA KELURAHAN (MERGED) --- */}
      <section id="data" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">Area Survei</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">Profil Wilayah</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allKelurahan.map((kel, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
              >
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${kel.color} to-transparent opacity-60 z-10`}></div>
                  <Image
                    src={kel.image}
                    alt={kel.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Kelurahan</p>
                    <h3 className="text-2xl font-bold leading-none">{kel.name.replace("Kelurahan ", "")}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">{kel.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="block text-xs text-slate-400 font-bold uppercase">Populasi</span>
                      <span className="block text-lg font-black text-slate-800">{kel.population}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="block text-xs text-slate-400 font-bold uppercase">Luas (km²)</span>
                      <span className="block text-lg font-black text-slate-800">{kel.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex gap-4 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1"><Home size={14} className="text-emerald-500"/> {kel.rt} RT</span>
                      <span className="flex items-center gap-1"><Users size={14} className="text-blue-500"/> {kel.rw} RW</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-slate-900 z-0 opacity-80"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Jelajahi Data Spasial Sekarang</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Akses peta interaktif lengkap dengan fitur filtering, popup informasi detail, dan analisis zonasi wilayah secara gratis.
          </p>
          
          <Link
            href="/map"
            onClick={handleMapTransition}
            className="inline-flex items-center gap-3 px-8 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-900/50"
          >
            <span>Buka WebGIS Interactive</span>
            <Map size={20} />
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <Trash2 size={24} className="text-emerald-500" />
                </div>
                <h4 className="text-xl font-bold text-white">WebGIS Sampah</h4>
              </div>
              <p className="leading-relaxed text-sm max-w-sm">
                Proyek Tugas Akhir Sistem Informasi Geografis yang bertujuan memetakan infrastruktur kebersihan dan lokasi RT/RW kota Pekanbaru demi masa depan yang berkelanjutan.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Navigasi</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#home" className="hover:text-emerald-400 transition-colors">Beranda Utama</a></li>
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">Tentang Proyek</a></li>
                <li><a href="#data" className="hover:text-emerald-400 transition-colors">Data Wilayah</a></li>
                <li><Link href="/map" className="hover:text-emerald-400 transition-colors">Peta Interaktif</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Tim Pengembang</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> FFAC 3TIC</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Politeknik Caltex Riau</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Angkatan 2023</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
            <p>&copy; 2025 WebGIS Pekanbaru. All rights reserved.</p>
            <p className="mt-2 md:mt-0 opacity-50">Dibuat dengan ❤️ untuk Kota Bertuah</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

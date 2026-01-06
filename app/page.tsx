import Image from "next/image";
import { MapPin, Trash2, Home, Users, BarChart3, Map, Info, ChevronRight, Building2, TreePine } from "lucide-react";

export default function HomePage() {
  const kelurahanData = [
    {
      name: "Kelurahan Sukajadi",
      rt: 19,
      rw: 5,
      population: "10.417 jiwa",
      area: "4.87 km²",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Kantor_Lurah_Sukajadi%2C_Kecamatan_Sukajadi.jpg",
      description: "Kelurahan Sukajadi merupakan salah satu kelurahan di Kecamatan Sukajadi, Kota Pekanbaru, Provinsi Riau, dengan kode pos 28156."
    },
    {
      name: "Kelurahan Kampung Melayu",
      rt: 16,
      rw: 8,
      population: "9.454 jiwa",
      area: "0.99 km²",
      image: "https://www.pekanbaru.go.id/berkas_file/news/24052022/50298-news-lpm-kampung-melayu-o.jpeg",
      description: "Kelurahan Kampung Melayu adalah salah satu kelurahan di Kecamatan Sukajadi, Kota Pekanbaru, Provinsi Riau, dengan kode pos 28124."
    },
    {
      name: "Kelurahan Kota Baru",
      rt: 21,
      rw: 6,
      population: "3.082 jiwa",
      area: "0.19 km²",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Kelurahan_Kota_Baru%2C_Kecamatan_Pekanbaru_Kota.jpg",
      description: "Kelurahan Kota Baru adalah salah satu kelurahan yang terletak di Kecamatan Pekanbaru Kota, Kota Pekanbaru, Provinsi Riau."
    }
  ];

  const kelurahanData2 = [
    {
      name: "Kelurahan Sukaramai",
      rt: 22,
      rw: 7,
      population: "5.096 jiwa",
      area: "0.21 km²",
      image: "https://celotehriau.com/a450d92cb6be01b3b3669c18bfca7901/content_upload/images/IMG-20200927-WA0008.jpg",
      description: "Kelurahan Sukaramai adalah kelurahan di Kecamatan Pekanbaru Kota, Kota Pekanbaru, Riau, yang terdiri dari 7 RW, mayoritas penduduknya pedagang/wiraswasta, memiliki fasilitas pendidikan dasar (TK, SD, MI), dan berbatasan dengan Kelurahan Sago (Utara), Tanah Datar (Selatan), Kota Tinggi (Timur), serta Kota Baru (Barat). Kelurahan ini merupakan bagian dari wilayah administrasi Kota Pekanbaru yang lebih luas. "
    },
    {
      name: "Kelurahan Pulau Karomah",
      rt: 13,
      rw: 3,
      population: "3.646 jiwa",
      area: "0.44 km²",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7FDoUsa_v_ydkhOvySNgC82Xn9BsimQilgQ&s",
      description: "Kelurahan Pulau Karomah adalah kelurahan di Kecamatan Sukajadi, Kota Pekanbaru, Riau (kode pos 28127), yang sebelumnya bernama Pulau Karam. Terletak di Jalan Teratai/Kamboja, wilayah ini bertransformasi dari daerah rawan genangan air menjadi permukiman padat penduduk dengan keberagaman suku dan agama, didominasi pekerjaan wiraswasta dan karyawan swasta. "
    },
    {
      name: "Kelurahan Tanah Datar",
      rt: 26,
      rw: 7,
      population: "6.652 jiwa",
      area: "0.23 km²",
      image: "https://riaucrimenews.com/assets/berita/original/54997950552-screenshot_2023-06-08-07-28-38-75_6012fa4d4ddec268fc5c7112cbb265e7.jpg",
      description: "Kelurahan Tanah Datar adalah salah satu kelurahan di Kecamatan Pekanbaru Kota, Kota Pekanbaru, Riau, dengan kode pos 28115."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-xl shadow-lg">
                <Trash2 className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  WebGIS Pengelolaan Sampah
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} />
                  Pekanbaru, Riau
                </p>
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="flex items-center space-x-2 px-3 py-2 text-green-700 font-medium hover:bg-green-50 rounded-lg transition">
                <Home size={18} />
                <span>Beranda</span>
              </a>
              <a href="#about" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                <Info size={18} />
                <span>Tentang</span>
              </a>
              <a href="#data" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                <BarChart3 size={18} />
                <span>Data</span>
              </a>
              <a href="/map" className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md">
                <Map size={18} />
                <span>Lihat Peta</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full">
              <span className="text-green-700 text-sm font-semibold">🌍 Proyek WebGIS 2025</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
              Sistem Informasi Geografis
            </h2>
            <h3 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              Pengelolaan Sampah Berbasis WebGIS
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Platform digital untuk pemetaan dan monitoring lokasi rumah RT/RW serta titik tempat pembuangan sampah di tiga kelurahan Kota Pekanbaru
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <MapPin className="text-white" size={28} />
                </div>
                <span className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">6</span>
              </div>
              <h4 className="text-gray-600 font-semibold text-lg">Kelurahan</h4>
              <p className="text-gray-400 text-sm mt-1">Wilayah survei</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <Home className="text-white" size={28} />
                </div>
                <span className="text-4xl font-bold bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-transparent">37</span>
              </div>
              <h4 className="text-gray-600 font-semibold text-lg">RT Total</h4>
              <p className="text-gray-400 text-sm mt-1">Rukun Tetangga</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Users className="text-white" size={28} />
                </div>
                <span className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">12</span>
              </div>
              <h4 className="text-gray-600 font-semibold text-lg">RW Total</h4>
              <p className="text-gray-400 text-sm mt-1">Rukun Warga</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                  <Trash2 className="text-white" size={28} />
                </div>
                <span className="text-4xl font-bold bg-gradient-to-br from-red-600 to-red-700 bg-clip-text text-transparent">45</span>
              </div>
              <h4 className="text-gray-600 font-semibold text-lg">Titik Sampah</h4>
              <p className="text-gray-400 text-sm mt-1">Lokasi TPS</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-green-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fitur Utama Platform</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-xl transition duration-300 border border-blue-200">
                <div className="bg-white p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition duration-300 shadow-md">
                  <Map className="text-blue-600" size={36} />
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-xl">Peta Interaktif</h4>
                <p className="text-gray-600 leading-relaxed">Visualisasi lokasi RT/RW dan tempat sampah dengan peta digital yang dapat difilter berdasarkan kategori</p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-xl transition duration-300 border border-green-200">
                <div className="bg-white p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition duration-300 shadow-md">
                  <BarChart3 className="text-green-600" size={36} />
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-xl">Analisis Data</h4>
                <p className="text-gray-600 leading-relaxed">Dashboard statistik dan analisis distribusi fasilitas pengelolaan sampah per kelurahan</p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-xl transition duration-300 border border-purple-200">
                <div className="bg-white p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition duration-300 shadow-md">
                  <Info className="text-purple-600" size={36} />
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-xl">Informasi Detail</h4>
                <p className="text-gray-600 leading-relaxed">Akses informasi lengkap mengenai setiap lokasi dengan popup dan detail data spasial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Tentang Proyek</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                  <Building2 size={28} />
                  Latar Belakang
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Pengelolaan sampah merupakan salah satu tantangan utama dalam pembangunan kota berkelanjutan.
                  Kota Pekanbaru, khususnya di enam kelurahan target (Sukajadi, Sukaramai, Kota Baru, Pulau Karomah, Tanah Datar, dan Kampung Melayu), memerlukan
                  sistem informasi yang terintegrasi untuk memantau distribusi fasilitas pengelolaan sampah dan
                  lokasi permukiman RT/RW.
                </p>

                <h3 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                  <TreePine size={28} />
                  Visi & Misi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Mewujudkan sistem pengelolaan sampah yang efektif dan berkelanjutan melalui pemanfaatan teknologi
                  informasi geografis untuk mendukung Pekanbaru sebagai kota hijau dan bersih.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-green-600 mb-4">Tujuan Proyek</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="bg-green-500 p-1 rounded-full mt-1">
                      <ChevronRight className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 flex-1">Memetakan lokasi rumah RT/RW dan titik tempat pembuangan sampah secara digital</span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="bg-blue-500 p-1 rounded-full mt-1">
                      <ChevronRight className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 flex-1">Menyediakan platform berbasis web untuk akses informasi spasial yang mudah</span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="bg-purple-500 p-1 rounded-full mt-1">
                      <ChevronRight className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 flex-1">Memfasilitasi analisis distribusi fasilitas pengelolaan sampah</span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="bg-orange-500 p-1 rounded-full mt-1">
                      <ChevronRight className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 flex-1">Mendukung pengambilan keputusan dalam perencanaan pengelolaan sampah</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kelurahan Data Section */}
      <section id="data" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Profil Kelurahan</h2>
            <p className="text-xl text-gray-600">
              Data tiga kelurahan yang menjadi fokus area survei
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {kelurahanData.map((kel, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-gray-100">
                <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-500">
                  <Image
                    src={kel.image}
                    alt={kel.name}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <MapPin className="mb-2" size={32} />
                    <h3 className="text-2xl font-bold">{kel.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{kel.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Jumlah RT</span>
                      <span className="text-xl font-bold text-green-600">{kel.rt}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Jumlah RW</span>
                      <span className="text-xl font-bold text-blue-600">{kel.rw}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Populasi</span>
                      <span className="text-xl font-bold text-purple-600">{kel.population}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Luas Wilayah</span>
                      <span className="text-xl font-bold text-orange-600">{kel.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {kelurahanData2.map((kel, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300 border border-gray-100">
                <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-500">
                  <Image
                    src={kel.image}
                    alt={kel.name}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <MapPin className="mb-2" size={32} />
                    <h3 className="text-2xl font-bold">{kel.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{kel.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Jumlah RT</span>
                      <span className="text-xl font-bold text-green-600">{kel.rt}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Jumlah RW</span>
                      <span className="text-xl font-bold text-blue-600">{kel.rw}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Populasi</span>
                      <span className="text-xl font-bold text-purple-600">{kel.population}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Luas Wilayah</span>
                      <span className="text-xl font-bold text-orange-600">{kel.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Statistics */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-10 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Ringkasan Data Keseluruhan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-blue-100">
                <Users className="mx-auto mb-3 text-blue-600" size={36} />
                <p className="text-gray-500 text-sm mb-2 font-medium">Total Populasi</p>
                <p className="text-3xl font-bold text-blue-600">38.347</p>
                <p className="text-gray-400 text-xs mt-1">jiwa</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-green-100">
                <MapPin className="mx-auto mb-3 text-green-600" size={36} />
                <p className="text-gray-500 text-sm mb-2 font-medium">Total Luas</p>
                <p className="text-3xl font-bold text-green-600">6.93</p>
                <p className="text-gray-400 text-xs mt-1">km²</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-purple-100">
                <Home className="mx-auto mb-3 text-purple-600" size={36} />
                <p className="text-gray-500 text-sm mb-2 font-medium">Total RT 6 Kelurahan</p>
                <p className="text-3xl font-bold text-purple-600">117</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-purple-100">
                <Home className="mx-auto mb-3 text-purple-600" size={36} />
                <p className="text-gray-500 text-sm mb-2 font-medium">Total RW 6 Kelurahan</p>
                <p className="text-3xl font-bold text-purple-600">36</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Menjelajahi Data Spasial?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Akses peta interaktif untuk melihat distribusi lengkap RT/RW dan titik pembuangan sampah
          </p>
          <a
            href="/map"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <Map size={24} />
            Buka Peta Interaktif
            <ChevronRight size={24} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-xl">
                  <Trash2 size={24} />
                </div>
                <h4 className="text-xl font-bold">WebGIS Sampah</h4>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform digital untuk monitoring dan analisis distribusi RT & RW di Kota Pekanbaru
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Kontak</h4>
              <p className="text-gray-400 mb-2">📧 FFAC 3 TI C</p>
              <p className="text-gray-400">📍 Pekanbaru, Riau, Indonesia</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Wilayah Survei</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 flex items-center gap-2">
                  <ChevronRight size={16} className="text-green-500" />
                  Kelurahan Sukajadi
                </li>
                <li className="text-gray-400 flex items-center gap-2">
                  <ChevronRight size={16} className="text-green-500" />
                  Kelurahan Kampung Melayu
                </li>
                <li className="text-gray-400 flex items-center gap-2">
                  <ChevronRight size={16} className="text-green-500" />
                  Kelurahan Kota baru
                </li>
                <li className="text-gray-400 flex items-center gap-2">
                  <ChevronRight size={16} className="text-green-500" />
                  Kelurahan Sukaramai
                </li>
                <li className="text-gray-400 flex items-center gap-2">
                  <ChevronRight size={16} className="text-green-500" />
                  Kelurahan Pulau Karomah
                </li>
                <li className="text-gray-400 flex items-center gap-2">
                  <ChevronRight size={16} className="text-green-500" />
                  Kelurahan Tanah Datar
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 WebGIS Pengelolaan Sampah Pekanbaru
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Presentasi Proyek: 7 Januari 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
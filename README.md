# 🗺️ WebGIS Sampah - Pekanbaru Smart City

![Project Status](https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge)
![Framework](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Styling](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)
![Backend](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)

> **Sistem Informasi Geografis Pemetaan Titik Sampah & Zonasi Wilayah**
> Sebuah platform digital terintegrasi untuk memantau distribusi titik sampah, zonasi RTRW, dan data kependudukan RT/RW di Kota Pekanbaru demi lingkungan yang lebih bersih dan tertata.

---

## 👥 Tim Pengembang (Group Members)

Proyek ini dikembangkan oleh **Kelompok FFAC** (Kelas 3 TI C - Politeknik Caltex Riau):

| No | Nama Anggota | Role |
| :--- | :--- | :--- |
| 1. | **Albert Christian** | Fullstack Developer |
| 2. | **Cristiano** | Dataset |
| 3. | **Farizy Rahman Hidayat** | Backend & Database Specialist |
| 4. | **Febriana** | GIS Analyst & Researcher |

---

## ✨ Fitur Utama

### 🌍 Peta Interaktif (Public)
* **Multi-Layer Map:** Visualisasi layer Titik Sampah, Zonasi RTRW, dan Polygon Area Kelurahan.
* **Smart Popup:** Informasi detail muncul saat aset diklik.
* **Filter Layer:** Toggle untuk menyembunyikan/menampilkan layer tertentu.
* **Fly-to Animation:** Navigasi otomatis ke lokasi saat data dipilih dari sidebar.

### ⚙️ Dashboard Admin
* **CRUD Management:** Tambah, Edit, dan Hapus data spasial dengan mudah.
* **Pagination:** Menampilkan data dalam format tabel terpaginasi (10 data/halaman).
* **Secure Login:** Autentikasi aman menggunakan Supabase Auth.
* **GeoJSON Support:** Input area poligon menggunakan format GeoJSON.

### 🎨 UI/UX Modern
* **Landing Page:** Desain responsif dengan animasi halus (*Framer Motion*).
* **Glassmorphism:** Elemen antarmuka transparan dan elegan.
* **Responsive:** Optimal di Desktop dan Mobile.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), React
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Maps:** [LeaFlet](https://leafletjs.com/)
* **Backend & Auth:** [Supabase](https://supabase.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Instalasi & Cara Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### 1. Clone Repository
```bash
git clone [https://github.com/username-anda/webgis-pekanbaru.git](https://github.com/username-anda/webgis-pekanbaru.git)
cd webgis-pekanbaru

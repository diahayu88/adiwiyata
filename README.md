# Eco-Gazebo Raudhah

**Ruang 3D Adiwiyata di browser**: lapor sampah (botol, kertas, Kompos MBG dengan foto yang dikenali AI), persetujuan kader/guru, catat timbangan, papan poin rombel, ringkasan Kompos MBG, dan rekap CSV. Aplikasi pendamping **Kelas Raudhah**, dipisah menjadi aplikasi sendiri pada 31/10/2026.

![Versi](https://img.shields.io/badge/versi-v0.1.2-2f6f4f)
![Platform](https://img.shields.io/badge/platform-web%20(tanpa%20instal)-8ecae6)
![Hosting](https://img.shields.io/badge/hosting-GitHub%20Pages-181717)
![Backend](https://img.shields.io/badge/backend-Google%20Apps%20Script%20(bersama%20Kelas%20Raudhah)-4285F4)

## Tentang
- Siswa dan guru masuk dengan **akun Kelas Raudhah yang sama** (Google, akun sandi, kode kelas, atau Menu Juri).
- Bila dibuka dari Kelas Raudhah (butir menu **Eco-Gazebo ↗**) di tab yang sama, siswa **tidak perlu masuk ulang**.
- Di dalam ruang 3D: ketuk tanah untuk berjalan, ketuk tong di Recycling Hub untuk melapor, masuk **gerbang bambu** (atau menu ☰ → *Kembali ke Kelas Raudhah*) untuk kembali.

## Arsitektur
| Bagian | Isi |
|---|---|
| Halaman | GitHub Pages, A-Frame 1.5.0 (berkas sendiri, tanpa CDN) |
| Server | **Apps Script yang sama** dengan Kelas Raudhah (aksi Adiwiyata yang sudah ada) |
| Data | **Spreadsheet yang sama** ("Kelas Raudhah - Data" / "Kelas Raudhah - Data Uji") |
| Masuk | `GOOGLE_CLIENT_ID` sama, token sesi sama |
| Foto AI | Cloudflare Workers AI lewat server (foto tidak disimpan) |

## Struktur repositori
```
index.html               ← halaman ringan: layar masuk + menu + panel (dari index_uji_eco_vX.Y.Z.html, DIGANTI NAMA)
eco_vX.Y.Z.js            ← kode Eco: menu/panel (sama dengan Kelas Raudhah), panel Adiwiyata, adegan 3D
aframe-v1.5.0.min.js     ← mesin 3D, dimuat setelah layar masuk tampil, di-cache browser
privasi.html, syarat.html, README.md
```
Nama `eco_vX.Y.Z.js` memuat versi supaya browser tidak menyajikan berkas lama.

## Pemasangan
Lihat `PANDUAN_PASANG_ECO_vX.Y.Z.md` di arsip versi. Tidak ada rahasia di repositori ini; kunci (Google, Cloudflare, Gemini) hanya di Script Properties Apps Script.

## Privasi
Sama dengan Kelas Raudhah: lihat `privasi.html` dan `syarat.html` (berlaku untuk kedua aplikasi karena server dan datanya sama).

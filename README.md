# Eco-Gazebo Raudhah

**Ruang 3D Adiwiyata di browser**: lapor sampah (botol, kertas, Kompos MBG dengan foto yang dikenali AI), persetujuan kader/guru, catat timbangan, papan poin rombel, ringkasan Kompos MBG, dan rekap CSV. Aplikasi pendamping **Kelas Raudhah**, dipisah menjadi aplikasi sendiri pada 31/10/2026.

![Versi](https://img.shields.io/badge/versi-v0.4.0-2f6f4f)
![Platform](https://img.shields.io/badge/platform-web%20(tanpa%20instal)-8ecae6)
![Hosting](https://img.shields.io/badge/hosting-GitHub%20Pages-181717)
![Backend](https://img.shields.io/badge/backend-Google%20Apps%20Script%20(bersama%20Kelas%20Raudhah)-4285F4)

## Tentang
- Siswa dan guru masuk dengan **akun Kelas Raudhah yang sama** (Google, akun sandi, kode kelas, atau Menu Juri).
- Bila dibuka dari Kelas Raudhah (butir menu **Eco-Gazebo ↗**) di tab yang sama, siswa **tidak perlu masuk ulang**.
- Di dalam ruang 3D: ketuk tanah untuk berjalan, ketuk tong di **Bank Sampah** untuk melapor, ketuk **bedeng** untuk Kebun Simulasi, gunakan menu ☰ → *Beranda* untuk kembali ke halaman beranda.

## Baru di v0.4.0
- **Kebun Simulasi tanam–panen** di bedeng depan: ketuk bedeng (atau papan *Kebun Simulasi*), pilih benih (kangkung, sawi/pakcoy, bayam, cabai rawit, tomat), lalu rawat dengan **Siram**, **Pupuk NPK**, dan **Kompos MBG**. Air, hara, garam, kesehatan, dan bahan organik berubah menurut aturan sebab-akibat yang bersumber (zona air 60–80 %, tanah jenuh, kekeringan, pupuk berlebih, kompos belum matang). Tanaman 3D ikut berubah: sehat, terlalu basah (kuning + genangan), kering (terkulai + tanah retak), pupuk berlebih (ujung cokelat), berbunga/berbuah, mati. Panen memberi nilai A/B/C dan lencana.
- Waktu berjalan sendiri: **1 siklus kangkung = 15 menit** (1 hari = 36 detik), ada tombol **Jeda**; waktu berhenti saat panel ditutup. Kemajuan tersimpan **di perangkat siswa** (per akun), tanpa server.
- Di HP tegak: kamera turun setinggi tanaman dan panel tampil ringkas, sehingga tanaman terlihat di atas panel.
- **Denah baru**: Recycling Hub menjadi bangunan **Bank Sampah** (tong pilah tetap = Lapor sampah), **rumah hidroponik NFT** di belakang Taman TOGA, **sumur resapan** + talang di belakang gazebo, **kotak panel PLTS** di dinding kanan gazebo, dudukan **galeri karya** di 3 meja. Isi interaktif fitur-fitur ini menyusul di versi berikutnya.
- Tanpa perubahan server (Code.gs) maupun spreadsheet.

## Baru di v0.3.2
- Butir menu **Kembali ke Kelas Raudhah** dihapus; tombol **Beranda** tetap.

## Baru di v0.3.1
- Perbaikan teknis: aturan tampilan laci untuk HP mendatar dipindah ke luar blok gaya bersama (tampilan sama dengan v0.3.0).

## Baru di v0.3.0
- **Kelola rombel di Eco** (guru: butir menu ☰ **Kelola rombel**; pemilik: tombol di **Atur Adiwiyata**): daftar rombel + kode kelas, buat rombel, buat akun sandi siswa, siswa per rombel (pindah rombel, aktif/nonaktif, atur ulang sandi), ganti/nonaktifkan kode kelas. Guru melihat rombel buatannya; pemilik melihat semua.
- **Atur Adiwiyata (pemilik)** kini juga: aktifkan/nonaktifkan guru, tambah guru (Google), akun sandi guru, dan **Log aktivitas** (dengan saringan).
- **Halaman ringkas**: gapura "Ke Kelas Raudhah" dan bekas halaman Kelas Raudhah dihapus; jalan melingkar gazebo, kolam dan bedeng sayur di depan, gerbang depan segaris gazebo, gedung sekolah sebagai latar. (v0.3.2: butir pindah ke Kelas Raudhah juga dihapus.)
- Tanpa perubahan server (Code.gs) maupun spreadsheet.

## Baru di v0.2.0
- **Gazebo realistis**: atap lengkung rusuk bambu laminasi, kaca depan, dinding bilah bambu, lantai kayu, meja-bangku, pot; atap hijau bercorak bunga + 2 panel surya (gaya ringan, tanpa tekstur).
- **Papan laporan Adiwiyata** di dinding dalam gazebo: peringkat 5 rombel bulan ini + Kompos MBG sekolah, dari data yang sudah diambil setelah masuk (tanpa panggilan server tambahan). Ketuk papan = panel Adiwiyata.
- **Taman TOGA** di sisi kiri gazebo (sereh, jahe, kunyit, lidah buaya, mint).
- Jalan setapak di kanan gazebo kini lapang (pohon dan rumpun bambu dipindah).
- Tulisan papan nama gazebo menyesuaikan lebar bingkai.
- Muat bertahap: siswa sudah bisa berjalan, gazebo detail menyusul sesaat kemudian. Tekstur dilukis di perangkat (tanpa unduhan tambahan).

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

# Eco-Gazebo Raudhah

**Ruang 3D Adiwiyata di browser**: lapor sampah (botol, kertas, Kompos MBG dengan foto yang dikenali AI), persetujuan kader/guru, catat timbangan, papan poin rombel, ringkasan Kompos MBG, dan rekap CSV. Aplikasi pendamping **Kelas Raudhah**, dipisah menjadi aplikasi sendiri pada 31/10/2026.

![Versi](https://img.shields.io/badge/versi-v0.9.1-2f6f4f)
![Platform](https://img.shields.io/badge/platform-web%20(tanpa%20instal)-8ecae6)
![Hosting](https://img.shields.io/badge/hosting-GitHub%20Pages-181717)
![Backend](https://img.shields.io/badge/backend-Google%20Apps%20Script%20(bersama%20Kelas%20Raudhah)-4285F4)

## Tentang
- Masuk dengan **akun Google (Gmail)**. Setiap Gmail otomatis menjadi **murid**; saat pertama masuk, murid **memilih kelasnya** sendiri.
- Guru Adiwiyata = **admin** (mengatur kelas & murid, menyetujui laporan, rekap). Eco memakai **server dan spreadsheet sendiri**, terpisah dari Kelas Raudhah.
- Saat pertama masuk, kamu berdiri **di depan gapura** halaman Eco; ketuk tanah di dalam halaman untuk berjalan masuk lewat gerbang.
- Di dalam ruang 3D: ketuk tanah untuk berjalan, ketuk **meja timbang** atau **papan nilai poin** di Bank Sampah untuk Buku Tabungan, ketuk tong di **Bank Sampah** untuk melapor, ketuk **papan petak** di bedeng untuk Kebun Simulasi, **tutup sumur** untuk Sumur Resapan, **kotak panel** di dinding kanan gazebo untuk PLTS, **rumah hidroponik** untuk Hidroponik NFT, **bedeng/papan Taman TOGA** untuk mengenal tanaman obat keluarga, gunakan menu ☰ → *Beranda* untuk kembali ke halaman beranda.

## Baru di v0.9.1
- **Galeri 3 meja**: meja kiri, tengah, dan kanan gazebo masing-masing memamerkan satu karya, dengan papan nama karya (judul + pembuat) di tepi meja.
- **Pameran pilihan guru**: admin memilih karya untuk tiap meja; karya itu muncul otomatis untuk semua pengunjung saat mendekati gazebo.
- Pengunjung tetap bisa **menaruh karya lain** di meja mana pun (hanya di layarnya) dan kembali ke pameran guru kapan saja.
- Batas karya baru: **≤ 5 MB dan ≤ 100 ribu segitiga** supaya tiga karya tetap lancar di HP. Berkas karya disimpan di peramban setelah diunduh pertama kali (hemat kuota).

## Baru di v0.9.0
- **Galeri karya 3D + AR**: papan **GALERI KARYA 3D** di meja tengah gazebo. Murid memindai karya daur ulangnya dengan aplikasi HP gratis (KIRI Engine, RealityScan, Polycam), mengekspor **.glb** (≤ 8 MB, ≤ 300 ribu segitiga), lalu mengunggahnya. Guru menyetujui di tab **Tinjau**.
- Setiap pengunjung memilih karya: **Tampilkan di meja** (model muncul di meja gazebo, di layarnya sendiri) atau **Lihat di AR** (Chrome Android dengan ARCore, Safari iPhone).
- Model terkompresi Draco didukung (dekoder di folder `draco/`, tanpa CDN). Server Eco v1.2.0 menyimpan berkas di Google Drive sekolah.

## Baru di v0.8.2
- **Kebun bersama 3 petak**: papan **"Ditanam oleh … · kelas · tanaman"** di tiap petak. Satu murid satu petak; petak terkunci sampai panen atau mati; murid lain hanya melihat. Alat ukur kelembapan di setiap petak.
- Admin: **Durasi tanam** (15 / 30 / 60 menit per siklus kangkung, atau harian nyata) dan **Kosongkan petak** di menu Admin & pengaturan.

## Baru di v0.8.1
- **Layar masuk baru** yang lebih rapi (logo, ringkasan fitur, satu tombol Google).
- **Pendaftaran murid**: masuk dengan Gmail, lalu tulis **nama panggilan** dan pilih **kelas** dari daftar (mis. *Ken*, *kelas 7a*). Nama panggilan tampil di Eco-Gazebo.
- Server Eco v1.0.1: menyimpan nama panggilan; impor data mengenali nama kelas "kelas 7a".

## Baru di v0.8.0
- **Server Eco sendiri** (Google Apps Script `Code_eco v1.0.0` + spreadsheet *Eco-Gazebo Data*). Data Adiwiyata lama (kelas, laporan, timbangan, kader, jenis sampah) disalin sekali dari Kelas Raudhah.
- **Masuk hanya dengan Gmail**: tidak ada lagi akun sandi, kode kelas, daftar manual, maupun Menu Juri.
- **Murid memilih kelas** saat pertama masuk; pindah kelas dilakukan admin.
- Menu admin baru: **Kelola kelas & murid** (buat kelas, sembunyikan kelas, pindah/nonaktifkan murid) dan **Admin & pengaturan** (tambah/lepas admin, log, takaran kompos).

## Baru di v0.7.2
- **Monumen Adiwiyata Mandiri kini model 3D asli** (hasil pindaian, berkas `model/monumen_adiwiyata_v1.glb`), berdiri di samping kebun sayur (bekas tempat komposter), menghadap gerbang. Ketuk monumen atau plakatnya untuk mengenal jenjang Adiwiyata. Bila model gagal dimuat, monumen sederhana tetap tampil.
- **Komposter EM4 dipindah** ke belakang gazebo.

## Baru di v0.7.1
- Papan gapura kini bertuliskan **ECO GAZEBO · MTs Negeri 7 Kediri**.
- **Monumen Adiwiyata Mandiri** di pelataran depan gapura; ketuk plakatnya untuk mengenal jenjang penghargaan Adiwiyata.
- **Alat ukur kelembapan tanah** di Kebun Simulasi: jarum dengan 5 zona warna (kering, kurang, pas, basah, tergenang), angka persen, saran berapa gayung perlu disiram atau berapa hari menunda, riwayat 7 hari, dan alat ukur 3D di bedeng yang berubah warna. Pilihan siram menampilkan hasilnya (mis. "1 gayung → 80 %").

## Baru di v0.7.0
- **Mulai di depan gapura**: saat pertama masuk, siswa berdiri di pelataran depan gapura (papan nama *Eco-Gazebo Raudhah*) seakan akan memasuki halaman. Ketuk titik di dalam halaman: avatar berjalan otomatis lewat gerbang.
- **Bank Sampah tahap 1 (Buku Tabungan)**: ketuk meja timbang, papan *Nilai Poin* di dinding, atau papan BANK SAMPAH. Alur Pilah → Timbang → Catat → Tabung poin, dan 3 tab:
  - **Tabungan**: poin, kg, dan peringkat rombelmu bulan ini, kader petugas timbang, 10 besar rombel.
  - **Nilai poin**: poin per jenis sampah + kalkulator perkiraan poin.
  - **Riwayatku**: setoranmu 30 hari terakhir dan statusnya.
  - Tombol **Setor / lapor sampah** membuka form lapor yang sudah ada.
- Tanpa perubahan server (Code.gs) maupun spreadsheet; tabungan rupiah per siswa = tahap 2 (menunggu persetujuan).

## Baru di v0.6.0
- **Hidroponik NFT** (ketuk lantai/rak rumah hidroponik atau papan *HIDROPONIK NFT*): pilih selada, kangkung, atau pakcoy; atur **ppm** (AB mix / air baku), **pH** (pH up / pH down), dan **timer pompa** (0 / 6 / 12 / 24 jam); majukan waktu dengan tombol *Lanjut 1 hari / 3 hari* sampai panen. Pesan menjelaskan larutan terlalu encer/pekat, pH di luar zona, pompa mati. Listrik pompa 8 W dibandingkan dengan produksi PLTS gazebo. Tabel pembanding kebun tanah vs hidroponik. Lencana panen tersimpan di perangkat.
- **Panel info Taman TOGA** (ketuk bedeng TOGA atau papan namanya, yang kini menghadap jalan barat): kartu sereh, jahe, kunyit, lidah buaya, mint (bagian yang dipakai, pemanfaatan tradisional, cara memperbanyak, perawatan), catatan aman, dan kuis 3 soal.
- **Pohon lebih realistis**: batang lancip, dahan, 5 gumpal daun tidak rata dengan gradasi warna, bayangan di tanah; 9 pohon digabung menjadi satu objek (lebih ringan di HP).
- Tanpa perubahan server (Code.gs) maupun spreadsheet.

## Baru di v0.5.0
- **Sumur Resapan** (ketuk tutup sumur atau papannya, di belakang kanan gazebo): pilih hujan ringan 10 / sedang 30 / lebat 75 mm, bandingkan *dengan* dan *tanpa sumur*. Potongan melintang menunjukkan talang → pipa → sumur terisi, meluap ke kolam, atau menggenang. Tabel volume dari atap gazebo 53 m², syarat SNI 8456:2017, dan tantangan hitung jumlah sumur.
- **PLTS & Panel Listrik** (ketuk kotak panel yang kini **terbuka**: SCC, inverter, MCB DC/AC, meteran kWh, baterai, arde):
  - **Daya & cuaca**: jam (pagi/siang/sore/malam), cuaca, beban (lampu, kipas, pompa hidroponik, pengisi HP) → daya panel, baterai mengisi/dipakai, kWh hari ini, CO₂ yang dihindari. Malam + lampu menyala → **3 lampu gazebo menyala**.
  - **Rakit instalasi**: 3 tantangan menyusun panel surya → MCB DC → SCC → baterai → (inverter → MCB AC → meteran kWh) → lampu + arde; setiap kesalahan dijelaskan. Lencana tersimpan di perangkat.
  - **Keselamatan & perawatan**: fungsi MCB dan arde, membersihkan panel, menghindari bayangan; simulasi saja, instalasi nyata oleh teknisi.
- Tanpa perubahan server (Code.gs) maupun spreadsheet.

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

# Journals Toolkit

Kumpulan aplikasi web statis untuk membantu pengelola jurnal memeriksa OAI-PMH, memperbaiki XML DOI Crossref, menjalankan simulasi penilaian ARJUNA, melakukan pemeriksaan awal DOAJ, dan menyusun roadmap evaluasi diri jurnal. Toolkit dapat dipasang pada GitHub Pages atau server web biasa tanpa backend, database, akun pengguna, maupun proses build.

Toolkit ini dikembangkan oleh Ikhwan Arief (ikhwan[at]unand.ac.id)

## URL Publik

```text
https://ikhwan-arief.github.io/Journals_ToolKit/
```

## Aplikasi

| Aplikasi | URL | Fungsi utama |
| --- | --- | --- |
| Validator OAI-PMH Jurnal OJS | `/oai-pmh/` | Validasi endpoint OAI-PMH, metadata publik, dan rekomendasi teknis untuk harvester. |
| DOI XML Repair | `/doi-xml-repair/` | Perbaikan XML Crossref dengan mempertahankan DOI artikel lama, mapping artikel, copy, dan download XML hasil. |
| Simulasi Penilaian Arjuna 2021 | `/arjuna-2021/` | Simulasi skor total, subtotal manajemen/substansi, peringkat, reset, dan cetak/PDF. |
| Simulasi Penilaian Arjuna 2026 | `/arjuna-2026/` | Pemeriksaan awal, kelayakan, simulasi skor tata kelola dan mutu artikel berdasarkan Juknis 2026. |
| DOAJ Precheck | `/doaj-precheck/` | Checklist required/recommended, status kesiapan, reset, dan print. |
| Evaluasi Diri Jurnal | `/evaluasi-diri-jurnal/` | Kuesioner mandiri, skor kapasitas, prioritas roadmap, rencana kerja 12 bulan, salin hasil, TXT, dan cetak. |

## Struktur Publik

```text
docs/
├── index.html
├── assets/
│   └── toolkit.css
├── oai-pmh/
│   └── index.html
├── doi-xml-repair/
│   ├── index.html
│   ├── doi_xml_repair.py
│   └── assets/
│       ├── app.js
│       └── styles.css
├── arjuna-2021/
│   └── index.html
├── arjuna-2026/
│   └── index.html
├── doaj-precheck/
│   └── index.html
└── evaluasi-diri-jurnal/
    └── index.html
```

## Desain Antarmuka

Antarmuka di folder `docs/` memakai design system ringan yang terinspirasi dari Cal.com: kanvas putih, CTA hitam, kartu abu-abu lembut, border halus, radius 8-12px, whitespace lega, dan footer gelap. Font utama menggunakan Inter dari Google Fonts dengan fallback system font.

## Pengembangan Lokal

```bash
cd docs
python3 -m http.server 8765
```

Buka `http://127.0.0.1:8765/`.

Jangan membuka `docs/index.html` langsung melalui `file://`. Beberapa aplikasi membaca aset lokal dengan `fetch()` dan harus dijalankan melalui HTTP atau HTTPS.

## Instalasi pada Server

Toolkit tidak memerlukan PHP, Node.js, database, atau proses build. Gunakan isi folder `docs/` sebagai document root server web.

Persyaratan minimum:

- Nginx, Apache HTTP Server, Caddy, atau static hosting yang setara;
- JavaScript aktif pada browser pengguna;
- dukungan penyajian file `.html`, `.css`, `.js`, `.json`, dan `.py` sebagai file statis;
- HTTPS sangat disarankan;
- akses internet dari browser untuk fitur yang memakai Crossref, endpoint OAI-PMH, Google Fonts, Pyodide, dan ikon CDN.

Contoh pengujian lokal sebelum deployment:

```bash
python3 -m http.server 8765 --directory docs
```

Panduan lengkap untuk Nginx, Apache, Caddy, GitHub Pages, instalasi pada subpath, pembaruan, verifikasi, keamanan, cache, dan troubleshooting tersedia di [Panduan Instalasi Server](DEPLOYMENT.md).

## Deploy GitHub Pages

Repository ini disiapkan untuk GitHub Pages dengan source:

```text
Branch: main
Folder: /docs
```

Jika Pages belum aktif, buka **Settings > Pages**, pilih branch `main`, folder `/docs`, lalu simpan.

## Catatan Teknis

- Semua aplikasi di folder `docs/` adalah aplikasi statis HTML/CSS/JavaScript.
- Tidak ada backend, database, login, atau secret bawaan. ARJUNA 2026 menggunakan `localStorage` browser untuk menyimpan isian sementara.
- Folder repo lama `OAI_PMH/` tidak menjadi bagian operasional repo induk ini dan sudah dikeluarkan dari root repo. Jika folder tersebut ditempatkan kembali di root, `.gitignore` tetap mengabaikannya.
- Validator OAI-PMH versi statis berjalan dari browser. Akses endpoint tertentu dapat dipengaruhi kebijakan CORS server jurnal.
- DOI XML Repair memuat Pyodide dari CDN dan mengambil metadata dari Crossref bila pengguna memilih mode DOI.
- Publikasikan hanya isi folder `docs/`; jangan menempatkan secret atau data privat di dalam folder tersebut.

## Privasi

- File yang dipilih pengguna diproses di browser dan tidak diunggah ke server toolkit oleh aplikasi ini.
- Permintaan OAI-PMH dan Crossref dikirim dari browser ke layanan tujuan atau proxy yang digunakan aplikasi.
- Seluruh file dalam document root dapat diakses publik; jangan menyimpan kredensial, token, atau konfigurasi privat di dalam `docs/`.

## Pengembang

Toolkit ini dikembangkan oleh Ikhwan Arief (ikhwan[at]unand.ac.id)

Seluruh aplikasi di dalam toolkit ini dikembangkan oleh Ikhwan Arief.

## Verifikasi

Smoke test lokal yang disarankan:

```bash
cd docs
python3 -m http.server 8765
```

Lalu buka root portal dan subfolder aplikasi di bawah `docs/`.

Pemeriksaan HTTP dasar:

```bash
curl -I http://127.0.0.1:8765/
curl -I http://127.0.0.1:8765/arjuna-2026/
curl -I http://127.0.0.1:8765/doi-xml-repair/doi_xml_repair.py
```

Setiap URL seharusnya mengembalikan status `200`.

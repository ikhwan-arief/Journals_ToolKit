# Journals_ToolKit

Kumpulan aplikasi statis untuk membantu pengelola jurnal melakukan pemeriksaan awal terkait OAI-PMH, Arjuna, dan DOAJ. Toolkit ini dibuat untuk akses publik melalui GitHub Pages dan dapat dijalankan tanpa server backend.

## URL Publik

```text
https://ikhwan-arief.github.io/Journals_ToolKit/
```

## Aplikasi

| Aplikasi | URL | Fungsi utama |
| --- | --- | --- |
| Validator OAI-PMH Jurnal OJS | `/oai-pmh/` | Validasi endpoint OAI-PMH, metadata publik, dan rekomendasi teknis untuk harvester. |
| Simulasi Penilaian Arjuna 2021 | `/arjuna-2021/` | Simulasi skor total, subtotal manajemen/substansi, peringkat, reset, dan cetak/PDF. |
| Pra Nilai Arjuna | `/pra-nilai-arjuna/` | Form ringkasan data awal akreditasi, URL edisi, 3 PDF per edisi, salin clipboard, unduh TXT, dan buka alat bantu eksternal. |
| DOAJ Precheck | `/doaj-precheck/` | Checklist required/recommended, status kesiapan, reset, dan print. |

## Struktur Publik

```text
docs/
├── index.html
├── assets/
│   └── toolkit.css
├── oai-pmh/
│   └── index.html
├── arjuna-2021/
│   └── index.html
├── pra-nilai-arjuna/
│   └── index.html
└── doaj-precheck/
    └── index.html
```

## Pengembangan Lokal

```bash
cd docs
python3 -m http.server 8765
```

Buka `http://127.0.0.1:8765/`.

## Deploy GitHub Pages

Repository ini disiapkan untuk GitHub Pages dengan source:

```text
Branch: main
Folder: /docs
```

Jika Pages belum aktif, buka **Settings > Pages**, pilih branch `main`, folder `/docs`, lalu simpan.

## Catatan Teknis

- Semua aplikasi di folder `docs/` adalah aplikasi statis HTML/CSS/JavaScript.
- Tidak ada backend, database, login, secret, atau penyimpanan histori input.
- Folder `OAI_PMH/` adalah repo lama/sumber terpisah dan sengaja diabaikan oleh `.gitignore` repo ini.
- Validator OAI-PMH versi statis berjalan dari browser. Akses endpoint tertentu dapat dipengaruhi kebijakan CORS server jurnal.

## Catatan Lisensi dan Atribusi

Toolkit ini mengadaptasi halaman dari `ejournal.unand.ac.id` dengan izin pemilik. Lisensi masing-masing aplikasi dipertahankan di halaman terkait:

- Simulasi Arjuna 2021: catatan asli CC BY.
- DOAJ Precheck: copyright Ikhwan Arief, CC BY-NC-ND, dengan izin adaptasi.
- Pra Nilai Arjuna: atribusi sumber `ejournal.unand.ac.id`.
- OAI-PMH: mengikuti catatan lisensi dari proyek `ojs-oai-pmh-checker`.

Kode integrasi toolkit dan layout bersama menggunakan MIT License sesuai `LICENSE`, dengan tetap menghormati catatan lisensi konten aplikasi di atas.

## Verifikasi

Smoke test lokal yang disarankan:

```bash
cd docs
python3 -m http.server 8765
```

Lalu buka:

- `http://127.0.0.1:8765/`
- `http://127.0.0.1:8765/oai-pmh/`
- `http://127.0.0.1:8765/arjuna-2021/`
- `http://127.0.0.1:8765/pra-nilai-arjuna/`
- `http://127.0.0.1:8765/doaj-precheck/`

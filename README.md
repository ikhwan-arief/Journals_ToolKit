# Journals_ToolKit

Kumpulan aplikasi statis untuk membantu pengelola jurnal melakukan pemeriksaan awal terkait OAI-PMH, Arjuna, DOAJ, dan roadmap evaluasi diri jurnal. Toolkit ini dibuat untuk akses publik melalui GitHub Pages dan dapat dijalankan tanpa server backend.

Toolkit ini dikembangkan oleh Ikhwan Arief (ikhwan[at]unand.ac.id)

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
| Evaluasi Diri Jurnal | `/evaluasi-diri-jurnal/` | Kuesioner mandiri, skor kapasitas, prioritas roadmap, rencana kerja 12 bulan, salin hasil, TXT, dan cetak. |

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

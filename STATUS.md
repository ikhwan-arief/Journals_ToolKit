# Status Journals_ToolKit

Terakhir diperbarui: 2026-07-04 19:04 WIB

## Ringkasan

Repository `ikhwan-arief/Journals_ToolKit` saat ini sudah publik, sudah disinkronkan ke GitHub, dan GitHub Pages sudah berhasil dibangun dari branch `main` folder `/docs`.

URL publik utama:

```text
https://ikhwan-arief.github.io/Journals_ToolKit/
```

Status umum:

| Komponen | Status |
| --- | --- |
| Repository GitHub | Publik |
| Default branch | `main` |
| Remote | `https://github.com/ikhwan-arief/Journals_ToolKit.git` |
| GitHub Pages | `built` |
| Pages source | `main` / `/docs` |
| HTTPS | Aktif dan enforced |
| Working tree repo induk setelah push DOI XML Repair | Bersih sebelum pembaruan dokumen status ini |
| Perubahan lokal setelah dokumen ini dibuat | Tidak ada perubahan aplikasi; dokumen ini diperbarui setelah verifikasi publik |
| Commit aplikasi DOI XML Repair | `8c1043c Add DOI XML Repair to toolkit` |

## Status Repo GitHub

Metadata GitHub saat pengecekan:

| Field | Nilai |
| --- | --- |
| Repo | `ikhwan-arief/Journals_ToolKit` |
| Visibility | Public |
| Description | `Static journal toolkit for OAI-PMH validation, Arjuna preparation, DOAJ precheck, and journal self-assessment` |
| Homepage | `https://ikhwan-arief.github.io/Journals_ToolKit/` |
| Topics | `arjuna`, `doaj`, `oai-pmh`, `ojs`, `journals-toolkit`, `roadmap`, `evaluasi-diri-jurnal`, `journal-evaluation` |

Riwayat commit terakhir:

```text
8c1043c Add DOI XML Repair to toolkit
5cd32bd Apply Cal.com inspired toolkit redesign
54cf273 Add evaluation self-assessment tool
d93fec6 Remove license and attribution section from README
f21c5bd Fix Pra Nilai Arjuna button contrast
9db8461 Create Journals Toolkit GitHub Pages
```

## Status GitHub Pages

GitHub Pages API melaporkan:

| Field | Nilai |
| --- | --- |
| Status | `built` |
| Build type | `legacy` |
| Public | `true` |
| Source branch | `main` |
| Source path | `/docs` |
| HTTPS enforced | `true` |
| Custom domain | Tidak ada |

Catatan: GitHub Pages memakai cache HTTP `max-age=600`, sehingga perubahan bisa tampak terlambat beberapa menit pada browser tertentu.

## Status URL Publik

Semua URL berikut sudah diverifikasi dengan request HEAD dan mengembalikan `HTTP/2 200`.

| Aplikasi | URL | HTTP |
| --- | --- | --- |
| Portal | `https://ikhwan-arief.github.io/Journals_ToolKit/` | `200` |
| Validator OAI-PMH | `https://ikhwan-arief.github.io/Journals_ToolKit/oai-pmh/` | `200` |
| Simulasi Arjuna 2021 | `https://ikhwan-arief.github.io/Journals_ToolKit/arjuna-2021/` | `200` |
| Pra Nilai Arjuna | `https://ikhwan-arief.github.io/Journals_ToolKit/pra-nilai-arjuna/` | `200` |
| DOAJ Precheck | `https://ikhwan-arief.github.io/Journals_ToolKit/doaj-precheck/` | `200` |
| DOI XML Repair | `https://ikhwan-arief.github.io/Journals_ToolKit/doi-xml-repair/` | `200` |
| Evaluasi Diri Jurnal | `https://ikhwan-arief.github.io/Journals_ToolKit/evaluasi-diri-jurnal/` | `200` |

## Daftar Aplikasi

### 1. Portal Journals Toolkit

| Item | Status |
| --- | --- |
| Path | `docs/index.html` |
| URL | `/` |
| Fungsi | Halaman utama yang menghubungkan semua tool |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 |
| Desain | Sudah memakai gaya Cal.com-inspired |

Konten utama:

- Link ke semua aplikasi toolkit.
- Hero dengan ringkasan fungsi toolkit.
- Card aplikasi dengan CTA hitam.
- Footer gelap dengan teks pengembang.

### 2. Validator OAI-PMH Jurnal OJS

| Item | Status |
| --- | --- |
| Path | `docs/oai-pmh/index.html` |
| URL | `/oai-pmh/` |
| Fungsi | Validasi endpoint OAI-PMH jurnal OJS langsung dari browser |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 |
| Desain | Sudah memakai gaya Cal.com-inspired |

Fungsi yang dipertahankan:

- Input URL jurnal atau endpoint OAI-PMH.
- Submit dengan tombol dan Enter keyboard.
- Reset form.
- Discovery kandidat endpoint OAI-PMH.
- Validasi Identify, ListMetadataFormats, dan ListRecords.
- Dukungan CORS proxy publik untuk GitHub Pages.
- Tab hasil: ringkasan, endpoint, repository, metadata format, publikasi, kualitas metadata, rekomendasi, detail teknis.
- Download publikasi CSV, rekomendasi CSV, ringkasan Markdown, dan laporan TXT.

Status smoke test terakhir:

- Submit dengan input `localhost` menampilkan pesan validasi `URL lokal tidak diizinkan.`
- Reset mengosongkan input.
- Tidak ada console error pada smoke test.
- Tidak ada horizontal overflow pada desktop dan mobile.

### 3. DOI XML Repair

| Item | Status |
| --- | --- |
| Path | `docs/doi-xml-repair/index.html` |
| URL | `/doi-xml-repair/` |
| Fungsi | Perbaikan XML Crossref dengan mempertahankan DOI artikel lama |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 setelah deploy commit `8c1043c` |
| Desain | Sudah disiapkan memakai gaya Cal.com-inspired |

Fungsi yang dipertahankan:

- Upload XML Crossref lama.
- Mode input DOI lama dan fetch metadata Crossref REST API.
- Upload XML Crossref baru.
- Pilihan URL artikel dari XML baru atau URL manual.
- Mapping artikel baru ke DOI lama.
- Generate ulang XML output.
- Copy XML output.
- Download XML output.
- Pemrosesan berjalan di browser melalui Pyodide.

### 4. Simulasi Penilaian Arjuna 2021

| Item | Status |
| --- | --- |
| Path | `docs/arjuna-2021/index.html` |
| URL | `/arjuna-2021/` |
| Fungsi | Simulasi skor Arjuna 2021 |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 |
| Desain | Sudah memakai gaya Cal.com-inspired |

Fungsi yang dipertahankan:

- Input identitas jurnal.
- Render indikator penilaian.
- Perhitungan skor total.
- Subtotal manajemen dan substansi.
- Rentang peringkat.
- Reset pilihan.
- Cetak/unduh PDF via print browser.

Status smoke test terakhir:

- Terdeteksi 39 select indikator.
- Perubahan pilihan indikator mengubah skor.
- Tombol reset dan cetak/PDF terlihat.
- Tidak ada console error pada smoke test.
- Tidak ada horizontal overflow pada desktop dan mobile.

### 5. Pra Nilai Arjuna

| Item | Status |
| --- | --- |
| Path | `docs/pra-nilai-arjuna/index.html` |
| URL | `/pra-nilai-arjuna/` |
| Fungsi | Form ringkasan data awal akreditasi jurnal |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 |
| Desain | Sudah memakai gaya Cal.com-inspired |

Fungsi yang dipertahankan:

- Form identitas dan akses jurnal.
- Tambah/hapus edisi.
- Tiga URL PDF artikel per edisi.
- Validasi format URL.
- Preview/ringkasan.
- Salin ringkasan.
- Unduh TXT.
- Buka alat bantu eksternal.
- Reset isian.

Status smoke test terakhir:

- Jumlah `.issue` bertambah dari 1 ke 2 setelah klik `Tambah Edisi`.
- Preview ringkasan tampil setelah klik `Buat Ringkasan`.
- Tombol `Tambah Edisi` memiliki background hitam dan teks putih setelah redesign.
- Tidak ada console error pada smoke test.
- Tidak ada horizontal overflow pada desktop dan mobile.

### 6. DOAJ Precheck

| Item | Status |
| --- | --- |
| Path | `docs/doaj-precheck/index.html` |
| URL | `/doaj-precheck/` |
| Fungsi | Checklist kesiapan DOAJ |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 |
| Desain | Sudah memakai gaya Cal.com-inspired |

Fungsi yang dipertahankan:

- Checklist required dan recommended.
- Status readiness.
- Ringkasan jumlah jawaban required/recommended.
- Daftar isu core.
- Reset all answers.
- Print.

Status smoke test terakhir:

- Terdeteksi 72 radio input.
- Radio checklist bisa dipilih.
- Reset all answers berjalan.
- Tidak ada console error pada smoke test.
- Tidak ada horizontal overflow pada desktop dan mobile.

### 7. Evaluasi Diri Jurnal

| Item | Status |
| --- | --- |
| Path | `docs/evaluasi-diri-jurnal/index.html` |
| URL | `/evaluasi-diri-jurnal/` |
| Fungsi | Evaluasi mandiri kapasitas jurnal dan roadmap pengembangan |
| Status akses publik | Aktif |
| Verifikasi terakhir | HTTP 200 |
| Desain | Sudah memakai gaya Cal.com-inspired |

Fungsi yang dipertahankan:

- Pilihan bidang `SosHum` dan `SainTek`.
- Render pertanyaan sesuai bidang.
- Progres pengisian.
- Hitung rekomendasi.
- Skor kesiapan dari 4.0.
- Prioritas roadmap.
- Rencana 12 bulan.
- Salin hasil.
- Simpan hasil TXT.
- Cetak.
- Reset.

Status smoke test terakhir:

- Pilihan `SosHum` memunculkan 36 pertanyaan.
- Progress awal tampil `0 dari 36 terisi`.
- Tombol submit terlihat.
- Tidak ada console error pada smoke test.
- Tidak ada horizontal overflow pada desktop dan mobile.

## Status Desain

Redesign terbaru memakai acuan `calcom-design.md` sebagai sumber utama dan `cal.com-DESIGN.md` sebagai referensi pelengkap.

Status desain saat ini:

| Area | Status |
| --- | --- |
| Font | Google Fonts Inter dengan fallback system font |
| Warna utama | Hitam `#111111` untuk CTA utama |
| Canvas | Putih |
| Card | Abu-abu lembut / putih dengan border halus |
| Radius | 8-12px dominan |
| Footer | Gelap `#101010` |
| Navigasi | Pill navigation |
| Responsif | Desktop dan mobile sudah dicek |
| File design system | `docs/assets/toolkit.css` |
| Referensi desain | `calcom-design.md`, `cal.com-DESIGN.md` |

Footer semua halaman memakai teks:

```text
Toolkit ini dikembangkan oleh Ikhwan Arief (ikhwan[at]unand.ac.id)
```

## Struktur File Publik

File publik yang aktif di GitHub Pages:

```text
docs/
├── .nojekyll
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
├── pra-nilai-arjuna/
│   └── index.html
├── doaj-precheck/
│   └── index.html
└── evaluasi-diri-jurnal/
    └── index.html
```

File referensi desain yang ikut tersimpan di repo:

```text
calcom-design.md
cal.com-DESIGN.md
```

## Verifikasi Lokal Terakhir

Verifikasi lokal yang sudah dilakukan sebelum deploy DOI XML Repair:

- `git diff --check`: passed.
- Local static server: `python3 -m http.server 8765 --directory docs`.
- Playwright desktop smoke test untuk semua halaman.
- Playwright mobile smoke test lebar 390px untuk semua halaman.
- Cek tidak ada console error pada semua halaman.
- Cek tidak ada horizontal overflow pada semua halaman.
- Cek fungsi inti tiap aplikasi.

Hasil ringkas:

| Skenario | Status |
| --- | --- |
| Desktop smoke | Lulus |
| Mobile smoke | Lulus |
| Console error | Tidak ditemukan pada smoke test |
| Horizontal overflow | Tidak ditemukan pada smoke test |
| CTA utama | Hitam pada halaman utama dan tombol utama aplikasi |
| Footer | Gelap dan seragam |

## Verifikasi Publik Setelah DOI XML Repair

Verifikasi setelah commit `8c1043c` dipush ke `main`:

- GitHub Pages API: `built`.
- Portal publik: `https://ikhwan-arief.github.io/Journals_ToolKit/` mengembalikan `HTTP/2 200`.
- DOI XML Repair: `https://ikhwan-arief.github.io/Journals_ToolKit/doi-xml-repair/` mengembalikan `HTTP/2 200`.
- Portal publik sudah memuat link `DOI XML Repair`.
- Halaman DOI XML Repair publik sudah memuat markup aplikasi, termasuk tombol `generateButton` dan script lokal aplikasi.

## Status Repo Lama `OAI_PMH`

Folder `OAI_PMH/` adalah repo lama/sumber terpisah dan bukan bagian dari repo induk `Journals_ToolKit` yang dipakai GitHub Pages toolkit.

Status `OAI_PMH` saat pengecekan:

| Item | Status |
| --- | --- |
| Lokasi | `Journals_ToolKit/OAI_PMH` |
| Status kerja | Ada perubahan lokal belum di-commit |
| Commit terbaru | `2573a05 Trigger Pages deployment` |

Perubahan lokal yang belum di-commit di `OAI_PMH`:

```text
M app.py
M docs/index.html
M docs/screenshot.png
```

Catatan penting:

- Perubahan lokal di `OAI_PMH` tidak dihapus dan tidak direvert.
- Repo induk `Journals_ToolKit` sudah disinkronkan ke GitHub; dokumen status ini ikut dipush sebagai pembaruan dokumentasi deploy.
- GitHub Pages toolkit memakai repo induk dan folder `/docs`, bukan folder `OAI_PMH/`.

## Catatan Operasional

Untuk menjalankan lokal:

```bash
cd '/Users/ikhwanarief/Documents/VS Code Projects/Journals_ToolKit'
python3 -m http.server 8765 --directory docs
```

Lalu buka:

```text
http://127.0.0.1:8765/
```

Untuk mengecek Pages:

```bash
gh api repos/ikhwan-arief/Journals_ToolKit/pages
```

Untuk mengecek status Git:

```bash
git status --short
git log --oneline -5
```

## Risiko dan Catatan Lanjutan

- GitHub Pages dapat men-cache halaman sampai beberapa menit. Jika tampilan lama muncul, lakukan hard refresh.
- GitHub Actions Pages sempat memberi annotation bahwa Node.js 20 deprecated dan dipaksa ke Node.js 24 untuk action internal. Deployment tetap sukses.
- Validator OAI-PMH versi GitHub Pages berjalan di browser. Beberapa endpoint jurnal bisa gagal karena CORS atau kebijakan server target, walaupun aplikasi sudah menyediakan opsi/proxy untuk membantu akses browser.
- Dokumen ini mencatat status pada waktu pengecekan di atas; status publik dapat berubah jika ada commit, perubahan Pages settings, atau gangguan GitHub/server target.

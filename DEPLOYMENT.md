# Panduan Instalasi Journals Toolkit pada Server

Journals Toolkit adalah situs statis. Server hanya perlu menyajikan isi folder `docs/` melalui HTTP atau HTTPS. Tidak diperlukan backend, database, PHP, Node.js, atau proses build.

## 1. Arsitektur

```text
Browser pengguna
  ├── membaca HTML, CSS, JavaScript, JSON, dan Python statis dari server
  ├── menghubungi Crossref ketika pengguna mengambil metadata DOI
  ├── menghubungi endpoint OAI-PMH jurnal atau proxy CORS
  └── memuat font, ikon, dan Pyodide dari CDN
```

Kode Python DOI XML Repair dijalankan oleh Pyodide di browser, bukan oleh server. Server tidak menerima upload aplikasi dan tidak menyimpan hasil formulir.

## 2. Persyaratan

### Server

- Nginx, Apache HTTP Server, Caddy, GitHub Pages, atau static hosting setara.
- HTTPS dengan sertifikat valid sangat disarankan.
- Server dapat menyajikan `.html`, `.css`, `.js`, `.json`, dan `.py` sebagai file statis.
- Directory index diarahkan ke `index.html`.

### Browser pengguna

- Browser modern dengan JavaScript aktif.
- `localStorage` aktif untuk penyimpanan sementara ARJUNA 2026.
- Akses jaringan ke layanan eksternal yang diperlukan.

### Tidak diperlukan

- database;
- PHP atau PHP-FPM;
- Node.js atau npm;
- virtual environment Python;
- API key atau secret bawaan.

## 3. Mengambil source code

```bash
cd /opt
sudo git clone https://github.com/ikhwan-arief/Journals_ToolKit.git journals-toolkit
```

Alternatifnya, unduh arsip repository dan ekstrak folder `docs/`.

Publikasikan hanya isi `docs/`. Jangan menjadikan root repository sebagai document root karena file dokumentasi dan pengembangan lain tidak perlu tersedia melalui web.

## 4. Menyiapkan document root

```bash
sudo mkdir -p /var/www/journals-toolkit
sudo cp -R /opt/journals-toolkit/docs/. /var/www/journals-toolkit/
sudo find /var/www/journals-toolkit -type d -exec chmod 755 {} \;
sudo find /var/www/journals-toolkit -type f -exec chmod 644 {} \;
```

Proses server web hanya memerlukan akses baca. Sesuaikan kepemilikan file dengan kebijakan sistem Anda; izin tulis untuk proses web tidak diperlukan.

## 5. Nginx

Buat `/etc/nginx/sites-available/journals-toolkit`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name toolkit.example.org;

    root /var/www/journals-toolkit;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(?:css|js|json|py|svg|png|jpg|jpeg|webp|ico)$ {
        try_files $uri =404;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

Aktifkan konfigurasi:

```bash
sudo ln -s /etc/nginx/sites-available/journals-toolkit /etc/nginx/sites-enabled/journals-toolkit
sudo nginx -t
sudo systemctl reload nginx
```

Pasang HTTPS menggunakan mekanisme sertifikat yang berlaku pada server Anda, lalu arahkan HTTP ke HTTPS.

### Nginx pada subpath

Untuk `https://example.org/journals-toolkit/`:

```nginx
location /journals-toolkit/ {
    root /var/www;
    index index.html;
    try_files $uri $uri/ =404;
}
```

Konfigurasi ini memetakan `/journals-toolkit/...` ke `/var/www/journals-toolkit/...`. Gunakan trailing slash. Tautan internal toolkit memakai path relatif sehingga dapat bekerja pada root domain maupun subpath selama struktur folder dipertahankan.

## 6. Apache HTTP Server

Buat `/etc/apache2/sites-available/journals-toolkit.conf`:

```apache
<VirtualHost *:80>
    ServerName toolkit.example.org
    DocumentRoot /var/www/journals-toolkit

    <Directory /var/www/journals-toolkit>
        Options -Indexes
        AllowOverride None
        Require all granted
        DirectoryIndex index.html
    </Directory>

    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    ErrorLog ${APACHE_LOG_DIR}/journals-toolkit-error.log
    CustomLog ${APACHE_LOG_DIR}/journals-toolkit-access.log combined
</VirtualHost>
```

Aktifkan konfigurasi:

```bash
sudo a2enmod headers
sudo a2ensite journals-toolkit.conf
sudo apachectl configtest
sudo systemctl reload apache2
```

Untuk subpath:

```apache
Alias /journals-toolkit/ /var/www/journals-toolkit/

<Directory /var/www/journals-toolkit>
    Options -Indexes
    AllowOverride None
    Require all granted
    DirectoryIndex index.html
</Directory>
```

## 7. Caddy

Tambahkan ke `Caddyfile`:

```caddyfile
toolkit.example.org {
    root * /var/www/journals-toolkit
    file_server

    header {
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

Periksa dan muat ulang:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy dapat mengelola HTTPS otomatis jika DNS dan port server sudah sesuai.

## 8. GitHub Pages

Pada repository fork:

1. Buka **Settings → Pages**.
2. Pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/docs`.
4. Simpan dan tunggu workflow Pages selesai.

URL biasanya berbentuk:

```text
https://USERNAME.github.io/NAMA-REPOSITORY/
```

File `docs/.nojekyll` mencegah pemrosesan Jekyll.

## 9. MIME type

| Ekstensi | MIME type yang diterima |
| --- | --- |
| `.html` | `text/html` |
| `.css` | `text/css` |
| `.js` | `text/javascript` atau `application/javascript` |
| `.json` | `application/json` |
| `.py` | tipe teks seperti `text/plain` atau `text/x-python` |

`doi_xml_repair.py` harus disajikan sebagai teks. Jangan mengaktifkannya sebagai CGI atau aplikasi server-side.

## 10. Layanan eksternal

| Tujuan | Fungsi |
| --- | --- |
| `fonts.googleapis.com`, `fonts.gstatic.com` | Font Inter; tersedia fallback system font. |
| `cdn.jsdelivr.net` | Pyodide untuk DOI XML Repair. |
| `unpkg.com` | Ikon Lucide pada DOI XML Repair. |
| `api.crossref.org` | Pengambilan metadata DOI. |
| Endpoint jurnal OJS | Pemeriksaan OAI-PMH. |
| Proxy CORS yang digunakan aplikasi | Membaca endpoint yang menolak akses lintas origin. |

Jika organisasi menerapkan firewall, proxy, ad blocker, atau Content Security Policy, izinkan hanya origin yang diperlukan. Uji kembali setelah perubahan CSP karena aturan terlalu ketat dapat memblokir script CDN, font, WebAssembly, atau `fetch()`.

## 11. CORS dan mixed content

Validator OAI-PMH berjalan di browser. Endpoint jurnal dapat menolak request lintas origin meskipun URL dapat dibuka secara manual. Dalam kondisi tersebut, aplikasi dapat memakai proxy CORS atau menampilkan kegagalan koneksi.

Jika toolkit menggunakan HTTPS, browser akan memblokir request aktif ke endpoint jurnal yang hanya memakai HTTP. Gunakan endpoint HTTPS yang valid; jangan menonaktifkan perlindungan mixed content pada browser pengguna.

## 12. Verifikasi deployment

Ganti domain contoh berikut:

```bash
curl -I https://toolkit.example.org/
curl -I https://toolkit.example.org/assets/toolkit.css
curl -I https://toolkit.example.org/oai-pmh/
curl -I https://toolkit.example.org/doi-xml-repair/
curl -I https://toolkit.example.org/doi-xml-repair/doi_xml_repair.py
curl -I https://toolkit.example.org/arjuna-2021/
curl -I https://toolkit.example.org/arjuna-2026/
curl -I https://toolkit.example.org/doaj-precheck/
curl -I https://toolkit.example.org/evaluasi-diri-jurnal/
```

Semua URL HTTPS seharusnya mengembalikan `200`. Redirect dari HTTP ke HTTPS dapat mengembalikan `301` atau `308`.

Pemeriksaan browser:

1. Buka portal dan setiap aplikasi melalui menu.
2. Pastikan aset tidak menghasilkan `404`.
3. Periksa Developer Tools → Console.
4. Uji layout desktop dan mobile.
5. Jalankan satu interaksi utama pada setiap aplikasi.
6. Uji cetak/PDF pada aplikasi yang mendukungnya.

## 13. Memperbarui toolkit

Untuk clone Git:

```bash
cd /opt/journals-toolkit
git status --short
git pull --ff-only origin main
sudo cp -R docs/. /var/www/journals-toolkit/
```

Periksa status sebelum menarik pembaruan. Jangan menjalankan `git pull` jika clone produksi memiliki perubahan lokal yang belum diamankan.

Untuk instalasi manual:

1. Cadangkan document root dan kustomisasi lokal.
2. Unduh source terbaru.
3. Salin ulang isi `docs/`.
4. Pertahankan konfigurasi virtual host dan sertifikat TLS.
5. Jalankan verifikasi kembali.

Salinan biasa tidak menghapus file lama. Bandingkan document root dengan `docs/` baru sebelum membersihkan file usang.

## 14. Cache

Gunakan cache pendek untuk HTML agar perubahan navigasi cepat terlihat. Aset CSS, JavaScript, dan gambar dapat memakai cache lebih panjang.

Setelah pembaruan:

- bersihkan cache CDN atau reverse proxy;
- lakukan hard refresh browser;
- gunakan query sementara seperti `?v=COMMIT` untuk mendiagnosis cache;
- pastikan virtual host melayani document root yang benar.

## 15. Keamanan

- Publikasikan hanya isi `docs/`.
- Jangan menyimpan `.env`, token, kredensial, private key, atau data privat di document root.
- Nonaktifkan directory listing.
- Gunakan HTTPS dan `X-Content-Type-Options: nosniff`.
- Berikan proses server web akses baca minimum.
- Perbarui server web dan sistem operasi secara berkala.
- Jangan mengeksekusi file `.py` sebagai CGI.

## 16. Troubleshooting

### Aplikasi menghasilkan 404

- Pastikan seluruh subfolder `docs/` sudah disalin.
- Pastikan `index.html` menjadi directory index.
- Pertahankan struktur folder.
- Pada subpath, periksa trailing slash dan pemetaan `alias`.

### Tampilan tanpa CSS

- Periksa request `assets/toolkit.css` di tab Network.
- Pastikan MIME type adalah `text/css`.
- Periksa base path dan konfigurasi subpath.

### DOI XML Repair tidak memuat mesin

- Pastikan jsDelivr tidak diblokir.
- Pastikan `doi-xml-repair/doi_xml_repair.py` mengembalikan `200`.
- Periksa error CSP, MIME type, JavaScript, atau WebAssembly pada console.

### Crossref tidak dapat diakses

- Pastikan browser dapat mengakses `https://api.crossref.org`.
- Periksa rate limit; coba lagi kemudian jika menerima `429`.

### OAI-PMH gagal meskipun URL dapat dibuka

- Periksa validitas XML endpoint.
- Periksa CORS, mixed content, firewall, dan proxy.
- Gunakan endpoint HTTPS.
- Uji endpoint dari terminal untuk membedakan masalah endpoint dan browser.

### Perubahan belum terlihat

- Pastikan file tersalin ke document root yang benar.
- Periksa timestamp atau hash file yang disajikan.
- Bersihkan cache CDN/reverse proxy dan lakukan hard refresh.
- Pastikan virtual host tidak menunjuk ke document root lama.

### Permission denied

- Direktori umumnya menggunakan mode `755` dan file `644`.
- Pastikan proses server dapat membaca seluruh path induk.
- Periksa log error Nginx, Apache, atau Caddy.

## 17. Rollback

Jika deployment baru bermasalah:

1. Hentikan penyalinan berikutnya.
2. Pulihkan document root dari cadangan versi sebelumnya.
3. Muat ulang server hanya jika konfigurasi berubah.
4. Bersihkan cache yang relevan.
5. Jalankan kembali verifikasi pada Bagian 12.

Gunakan arsip atau commit yang telah diuji. Hindari rollback destruktif pada clone yang memiliki perubahan lokal belum diamankan.

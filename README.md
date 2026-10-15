📈 Tickr – Financial News & Market Tracker

Tickr adalah platform agregator berita keuangan dan pelacak pasar modern berbasis web. Didesain dengan antarmuka yang bersih, responsif, dan elegan untuk memberikan pemantauan pasar saham, kripto, forex, serta berita finansial secara real-time.

✨ Fitur Utama

🔴 Live Running Ticker: Bar Running Text harga pasar (S&P 500, Nasdaq, BTC, ETH, USD/IDR, dll) dengan pergerakan simulasi real-time.

📰 Agregator Berita Finansial:

Filter kategori berita (Stocks, Crypto, Macroeconomy, Personal Finance).

Filter sentimen (Bullish, Bearish, Neutral).

Pencarian pintar berbasis kata kunci (didukung debounce).

Modal baca artikel lengkap dengan kesimpulan ringkas (Executive Takeaway).

🔖 Bookmark & Saved Articles: Simpan artikel favorit Anda ke penyimpanan lokal (LocalStorage) dan akses kapan saja melalui drawer khusus.

📊 Grafik Pasar Interaktif: Visualisasi pergerakan indeks S&P 500 dengan pilihan rentang waktu (1D, 1W, 1M, 1Y) menggunakan Chart.js.

💱 Konverter Kripto & Mata Uang Dunia:

Crypto Converter: Konversi langsung BTC/ETH ke USD atau IDR.

World Currency Converter: Integrasi API nilai tukar mata uang global secara live (ExchangeRate-API).

📉 Market Movers & Sentiment Index: Informasi penggerak pasar teratas dan indeks Fear & Greed.

🌙 Dukungan Mode Gelap (Dark Mode): Peralihan tema otomatis dan manual sesuai kenyamanan mata pengguna.

📱 Desain Responsif & Aksesibel: Optimasi tata letak penuh untuk perangkat seluler, tablet, hingga desktop, dilengkapi dengan pintasan keyboard (tombol / untuk fokus pencarian dan Esc untuk menutup modal).

🛠️ Teknologi yang Digunakan

Proyek ini dibangun secara modular tanpa kebergantungan framework berat (Vanilla Tech Stack):

HTML5 – Struktur halaman semantik.

Tailwind CSS (via CDN) – Penataan gaya UI yang fleksibel & modern.

JavaScript (ES6+) – Logika aplikasi, pengolahan data, interaktivitas, dan integrasi API.

Chart.js – Rendering grafik pasar interaktif.

Lucide Icons – Set ikon vektor minimalis.

ExchangeRate-API – Data kurs mata uang dunia live.

📁 Struktur Proyek

tickr/
├── index.html              # Halaman utama aplikasi
├── web-app-manifest-512x512.png # Logo / Icon aplikasi
├── favicon.svg             # Favicon web
├── js/
│   ├── app.js             # Logika utama aplikasi, pemroses data, & state
│   └── tailwind-config.js # Konfigurasi custom warna & tema Tailwind CSS
└── css/
    ├── base.css           # Styling dasar, font, & kustomisasi scrollbar
    ├── ticker.css         # Animasi running text ticker
    ├── theme.css          # Efek visual glassmorphism & background glow
    ├── responsive.css     # Penyesuaian tata letak responsif
    └── animations.css     # Efek animasi UI & indikator live pulse


📄 Lisensi

Proyek ini bersifat open-source dan dilindungi di bawah lisensi MIT.

Dislaimer: Data harga pasar dan berita pada proyek ini disediakan untuk tujuan simulasi dan demonstrasi portofolio. Bukan merupakan nasihat keuangan.

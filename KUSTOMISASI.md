# EverLetter — Panduan Kustomisasi

Panduan lengkap untuk mengkustomisasi template EverLetter sesuai pesanan buyer.

---

## Daftar Isi

1. [Cara Kerja](#cara-kerja)
2. [Struktur Config](#struktur-config)
3. [Kustomisasi per Template](#kustomisasi-per-template)
4. [Menambah Foto](#menambah-foto)
5. [Pilihan Theme](#pilihan-theme)
6. [Menambah Musik](#menambah-musik)
7. [Deploy ke Vercel](#deploy-ke-vercel)
8. [Contoh Copywriting](#contoh-copywriting)
9. [Troubleshooting](#troubleshooting)

---

## Cara Kerja

```
Buyer Order (WhatsApp)
       ↓
Developer Edit config.json
       ↓
Developer Tambah Foto
       ↓
Push to GitHub
       ↓
Vercel Auto-Deploy
       ↓
Kirim Link + QR ke Buyer
```

**Target waktu:**
- Premium: 15-30 menit
- Ultra Premium: 30-60 menit

---

## Struktur Config

Setiap template menggunakan `public/config.json` sebagai satu-satunya sumber data.

```json
{
  "recipient": "Nama Penerima",
  "sender": "Nama Pengirim",
  "title": "Judul Ucapan",
  "message": "Pesan personal\n\nParagraf kedua\n\nParagraf ketiga",
  "photos": ["foto1.jpg", "foto2.jpg", "foto3.jpg"],
  "theme": "pink",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "template": "premium-03",
  "captions": ["Caption foto 1", "Caption foto 2", "Caption foto 3"],
  "closing": "Penutup singkat"
}
```

### Field Penting

| Field | Wajib | Deskripsi |
|-------|-------|-----------|
| `recipient` | ✅ | Nama penerima (muncul di halaman) |
| `sender` | ✅ | Nama pengirim |
| `title` | ✅ | Judul utama |
| `message` | ✅ | Pesan personal (pisahkan paragraf dengan `\n\n`) |
| `photos` | ✅ | Array nama file foto |
| `theme` | ✅ | Warna tema |
| `music` | ❌ | File musik (opsional) |
| `captions` | ❌ | Caption per foto |
| `closing` | ❌ | Pesan penutup |

---

## Kustomisasi per Template

### Premium 01 — Countdown Reveal

**Mekanisme:** Loading → Countdown 3-2-1 → Halaman utama

**Config khusus:**
```json
{
  "template": "premium-01",
  "recipient": "Nabila",
  "sender": "Rizky",
  "title": "Selamat Ulang Tahun",
  "message": "3... 2... 1...\n\nAda sesuatu yang ingin aku tunjukkan untukmu.\n\nSelamat membuka halaman kecil yang kubuat khusus untukmu.",
  "photos": ["1.jpg", "2.jpg"],
  "theme": "pink",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "captions": ["Momen pertama", "Senyummu"],
  "closing": "Selamat ulang tahun, sayangku."
}
```

**Yang bisa dikustomisasi:**
- Warna loading screen (mengikuti theme)
- Teks loading (edit di `pages/index.tsx` bagian `LoadingScreen`)
- Durasi countdown (default: 1 detik per angka)
- Urutan section setelah reveal

---

### Premium 02 — Gift Box Open

**Mekanisme:** Gift box animasi → Klik untuk buka → Reveal

**Config khusus:**
```json
{
  "template": "premium-02",
  "recipient": "Nabila",
  "sender": "Rizky",
  "title": "Hadiah Untukmu",
  "message": "Buka hadiahnya ya.\n\nAku harap ini bisa bikin kamu senyum.\n\nHadiah ini mungkin sederhana, tapi niatnya besar.",
  "photos": ["1.jpg", "2.jpg"],
  "theme": "lavender",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "captions": ["Kenangan kita", "Untukmu"],
  "closing": "Dengan cinta, untukmu."
}
```

**Yang bisa dikustomisasi:**
- Warna gift box (mengikuti theme)
- Animasi opening (spring physics)
- Efek cahaya saat buka

---

### Premium 03 — Love Letter Scroll

**Mekanisme:** Scroll → Section muncul satu per satu

**Config khusus:**
```json
{
  "template": "premium-03",
  "recipient": "Nabila",
  "sender": "Rizky",
  "title": "Terima Kasih Sudah Hadir",
  "message": "Aku cuma mau bilang satu hal.\n\nTerima kasih sudah hadir di hidupku.\n\nKalau boleh jujur, kamu adalah bagian paling indah dari hariku.\n\nAku sangat bersyukur memiliki kamu sebagai pasanganku.",
  "photos": ["1.jpg", "2.jpg", "3.jpg"],
  "theme": "warm-white",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "captions": ["Foto 1", "Foto 2", "Foto 3"],
  "closing": "Terima kasih sudah menjadi bagian dari hidupku."
}
```

**Yang bisa dikustomisasi:**
- Urutan section (edit di `pages/index.tsx`)
- Animasi scroll (fade, slide, scale)
- Layout foto (grid vs masonry)
- Background per section

---

### Premium 04 — Photo Story Card

**Mekanisme:** Carousel foto dengan caption → Final wish

**Config khusus:**
```json
{
  "template": "premium-04",
  "recipient": "Nabila",
  "sender": "Rizky",
  "title": "Setiap Foto Punya Cerita",
  "message": "Dan setiap cerita selalu kembali ke kamu.\n\nTerima kasih sudah jadi bagian dari kenanganku.",
  "photos": ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
  "theme": "pink",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "captions": ["Pertemuan", "Tawa", "Pelukan", "Selamanya"],
  "closing": "Terima kasih sudah menjadi bagian dari hidupku."
}
```

**Yang bisa dikustomisasi:**
- Speed carousel (default: 5 detik)
- Layout: carousel vs grid
- Caption position
- Transisi antar foto

---

### Ultra 01 — Cinematic Letter

**Mekanisme:** Chapter-based cinematic scroll + music

**Config khusus:**
```json
{
  "template": "ultra-01",
  "recipient": "Nabila",
  "sender": "Rizky",
  "title": "Untuk Seseorang yang Mengubah Hidupku",
  "message": "Untuk seseorang yang mengubah hidupku tanpa banyak bicara.\n\nSetiap momen bersamamu terasa seperti adegan yang layak diingat.\n\nTerima kasih sudah menjadi rumah.",
  "photos": ["1.jpg", "2.jpg", "3.jpg"],
  "theme": "dark-luxury",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "chapters": [
    {"title": "Pertemuan", "text": "Aku ingat pertama kali kita bertemu. Waktu itu..."},
    {"title": "Perjalanan", "text": "Bersamamu, setiap hari menjadi petualangan baru."}
  ],
  "captions": ["Momen 1", "Momen 2", "Momen 3"],
  "closing": "Terima kasih sudah menjadi rumahku."
}
```

**Yang bisa dikustomisasi:**
- Jumlah chapter (tambah di array `chapters`)
- Urutan chapter
- Background per chapter
- Animasi Ken Burns pada foto
- Durasi transition

---

### Ultra 02 — Signature Memory

**Mekanisme:** Fully custom layout berdasarkan request customer

**Config khusus:**
```json
{
  "template": "ultra-02",
  "recipient": "Nabila",
  "sender": "Rizky",
  "title": "Halaman Ini Dibuat Khusus Untukmu",
  "message": "Halaman ini dibuat khusus untukmu.\n\nSemua detailnya menyesuaikan cerita kalian.\n\nKarena beberapa perasaan memang terlalu penting untuk dibuat biasa saja.",
  "photos": ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
  "theme": "gold-accent",
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu",
  "sections": [
    {"type": "hero", "title": "Untuk Nabila", "subtitle": "Dari Rizky"},
    {"type": "story", "title": "Cerita Kita", "text": "Setiap perjalanan dimulai dari satu langkah kecil..."},
    {"type": "photos", "title": "Moments"},
    {"type": "message", "title": "Pesan Untukmu", "text": "Kamu adalah alasan aku tersenyum setiap hari."},
    {"type": "closing", "title": "Selamanya"}
  ],
  "captions": ["Foto 1", "Foto 2", "Foto 3", "Foto 4"],
  "closing": "Dengan cinta, selamanya."
}
```

**Yang bisa dikustomisasi:**
- Urutan sections (ubah array `sections`)
- Type sections: `hero`, `story`, `photos`, `message`, `closing`
- Layout per section
- Animasi per section
- Warna dan typography

---

## Menambah Foto

### Langkah

1. **Siapkan foto** dalam format JPG/PNG
2. **Rename** file foto sesuai keinginan (contoh: `foto1.jpg`, `foto2.jpg`)
3. **Copy** ke folder `public/` di dalam project
4. **Update** array `photos` di `config.json`:

```json
{
  "photos": ["foto1.jpg", "foto2.jpg", "foto3.jpg"]
}
```

### Tips

- **Ukuran ideal:** 1200x1200px untuk square, 1920x1080px untuk landscape
- **Format:** JPG lebih kecil dari PNG
- **Kompres:** Gunakan [TinyPNG](https://tinypng.com/) atau [Squoosh](https://squoosh.app/)
- **Maksimal:** 5-8 foto per template untuk performa optimal

### Path Foto

| Template | Path |
|----------|------|
| P1-P4 | `public/[nama-file]` |
| U1-U2 | `public/[nama-file]` |

---

## Pilihan Theme

### Premium Themes

| Theme | Warna | Cocok Untuk |
|-------|-------|-------------|
| `pink` | Pink soft, rose accent | Romantis, anniversary |
| `rose` | Rose bold, warm | Birthday, confession |
| `lavender` | Ungu lembut | Elegant, anniversary |
| `warm-white` | Putih hangat | Minimalis, intimate |

### Ultra Premium Themes

| Theme | Warna | Cocok Untuk |
|-------|-------|-------------|
| `dark-luxury` | Hitam + gold | Premium, cinematic |
| `gold-accent` | Gold highlight | Flagship, mewah |

### Contoh Penggunaan

```json
{
  "theme": "dark-luxury"
}
```

---

## Menambah Musik

### Langkah

1. **Siapkan file musik** (MP3, max 5MB recommended)
2. **Copy** ke folder `public/` di dalam project
3. **Update** config.json:

```json
{
  "music": "lagu.mp3",
  "musicTitle": "Judul Lagu"
}
```

### Tips

- **Format:** MP3 (paling kompatibel)
- **Ukuran:** Max 5MB untuk load cepat
- **Loop:** Musik akan otomatis loop
- **Volume:** Default 30%, bisa diatur di code

---

## Deploy ke Vercel

### Otomatis (Recommended)

1. Push changes ke GitHub:
   ```bash
   git add -A
   git commit -m "Update: [keterangan]"
   git push origin main
   ```
2. Vercel otomatis build dan deploy
3. URL deployment: `https://[nama-project]-[hash]-everletter.vercel.app`

### Manual

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel --prod
   ```

---

## Contoh Copywriting

### Good Copy (Singkat, Hangat, Romantis)

- "Aku buatkan ini khusus untukmu."
- "Karena kamu pantas dapat sesuatu yang lebih dari sekadar chat."
- "Semoga halaman kecil ini bisa membuatmu tersenyum."
- "Terima kasih sudah menjadi bagian dari hidupku."
- "Aku cuma mau bilang satu hal."
- "Terima kasih sudah hadir di hidupku."
- "Kalau boleh jujur, kamu adalah bagian paling indah dari hariku."
- "Buka hadiahnya ya."
- "Aku harap ini bisa bikin kamu senyum."
- "Hadiah ini mungkin sederhana, tapi niatnya besar."
- "Setiap foto punya cerita."
- "Dan setiap cerita selalu kembali ke kamu."
- "Untuk seseorang yang mengubah hidupku tanpa banyak bicara."
- "Setiap momen bersamamu terasa seperti adegan yang layak diingat."
- "Halaman ini dibuat khusus untukmu."
- "Semua detailnya menyesuaikan cerita kalian."
- "Karena beberapa perasaan memang terlalu penting untuk dibuat biasa saja."

### Bad Copy (Hindari!)

- Terlalu marketing
- Terlalu formal
- Terlalu panjang
- Terlalu alay
- Terlalu umum

---

## Troubleshooting

### Error: "Failed to load config"

**Penyebab:** `config.json` tidak ditemukan atau format salah

**Solusi:**
- Pastikan file ada di `public/config.json`
- Pastikan format JSON valid (gunakan [jsonlint.com](https://jsonlint.com/))
- Pastikan tidak ada trailing comma

### Error: Foto tidak muncul

**Penyebab:** Path foto salah atau file tidak ada

**Solusi:**
- Pastikan nama file di `photos` cocok dengan nama file di `public/`
- Periksa case sensitivity: `Foto1.jpg` ≠ `foto1.jpg`
- Pastikan file ada di folder yang benar

### Error: Build gagal

**Penyebab:** Syntax error di code

**Solusi:**
- Jalankan `npm run dev` untuk cek error
- Periksa terminal untuk error message
- Pastikan semua import benar

### Deploy lambat

**Penyebab:** Foto terlalu besar atau banyak

**Solusi:**
- Kompres foto sebelum upload
- Gunakan JPG bukan PNG
- Maksimal 5-8 foto per deploy

---

## Quick Reference

### Copy-Paste Config Template

**Premium (P1-P4):**
```json
{
  "recipient": "",
  "sender": "",
  "title": "",
  "message": "",
  "photos": [],
  "theme": "pink",
  "music": "",
  "musicTitle": "",
  "template": "premium-01",
  "captions": [],
  "closing": ""
}
```

**Ultra Premium (U1):**
```json
{
  "recipient": "",
  "sender": "",
  "title": "",
  "message": "",
  "photos": [],
  "theme": "dark-luxury",
  "music": "",
  "musicTitle": "",
  "template": "ultra-01",
  "chapters": [
    {"title": "", "text": ""},
    {"title": "", "text": ""}
  ],
  "captions": [],
  "closing": ""
}
```

**Ultra Premium (U2):**
```json
{
  "recipient": "",
  "sender": "",
  "title": "",
  "message": "",
  "photos": [],
  "theme": "gold-accent",
  "music": "",
  "musicTitle": "",
  "template": "ultra-02",
  "sections": [
    {"type": "hero", "title": "", "subtitle": ""},
    {"type": "story", "title": "", "text": ""},
    {"type": "photos", "title": ""},
    {"type": "message", "title": "", "text": ""},
    {"type": "closing", "title": ""}
  ],
  "captions": [],
  "closing": ""
}
```

---

## FAQ

**Q: Bisa ganti font?**
A: Bisa, edit `styles/globals.css` dan `tailwind.config.js`.

**Q: Bisa tambah section baru?**
A: Buka, edit `pages/index.tsx` dan tambah component baru.

**Q: Bisa ganti warna selain theme yang ada?**
A: Buka, edit `tailwind.config.js` dan tambah warna baru.

**Q: Berapa lama deploy selesai?**
A: Biasanya 1-3 menit, tergantung kompleksitas kode dan ukuran file.

**Q: Bisa custom domain?**
A: Buka, tambah domain di Vercel dashboard → Settings → Domains.

---

*Terakhir diperbarui: 2026-06-18*

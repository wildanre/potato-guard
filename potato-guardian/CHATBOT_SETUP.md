# Panduan Konfigurasi Chatbot Gemini

## Langkah-langkah untuk mengaktifkan fitur chatbot:

### 1. Dapatkan API Key Gemini

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Pilih project atau buat project baru
5. Copy API key yang dihasilkan

### 2. Konfigurasi Environment Variable

1. Buka file `.env` di root folder project
2. Tambahkan atau update line berikut:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Ganti `your_actual_api_key_here` dengan API key yang Anda dapatkan dari langkah 1

### 3. Restart Development Server

Setelah menambahkan API key, restart development server:
```bash
npm run dev
```

### 4. Uji Chatbot

1. Buka aplikasi di browser
2. Klik tombol chat (ikon pesan) di pojok kanan bawah
3. Coba tanyakan sesuatu tentang penyakit kentang

## Contoh Pertanyaan untuk Chatbot:

- "Apa itu Early Blight pada kentang?"
- "Bagaimana cara mencegah Late Blight?"
- "Tips merawat tanaman kentang agar sehat"
- "Apa perbedaan Early Blight dan Late Blight?"
- "Bagaimana cara mengobati penyakit daun kentang?"

## Troubleshooting:

### Error: "Layanan chatbot belum dikonfigurasi"
- Pastikan API key sudah ditambahkan ke file `.env`
- Pastikan nama variable adalah `VITE_GEMINI_API_KEY`
- Restart development server setelah menambahkan API key

### Error: "API key tidak valid"
- Periksa kembali API key yang Anda masukkan
- Pastikan API key masih aktif di Google AI Studio
- Coba generate API key baru jika diperlukan

### Error: "Model AI tidak tersedia"
- Aplikasi menggunakan model Gemini 1.5 Flash yang terbaru
- Pastikan API key mendukung model ini
- Jika masih error, coba lagi setelah beberapa saat

### Error: "Kuota API telah habis"
- Gemini API memiliki batasan penggunaan gratis
- Tunggu sampai kuota reset atau upgrade ke plan berbayar

## Fitur Chatbot:

✅ **Respons dalam Bahasa Indonesia**
✅ **Konteks Penyakit Kentang**
✅ **Reset Percakapan**
✅ **UI Responsif**
✅ **Dark/Light Mode Support**
✅ **Error Handling**
✅ **Loading States**

## Catatan Keamanan:

⚠️ **Jangan commit file `.env` ke repository**
⚠️ **Jangan share API key secara publik**
⚠️ **Monitor penggunaan API key di Google Console**

# OpenMusic API

OpenMusic API adalah layanan backend yang digunakan untuk mengelola data musik, seperti lagu, album, dan playlist. API ini juga mendukung fitur ekspor playlist, upload cover album, serta caching untuk meningkatkan performa.

## 📌 Fitur

### **✅ OpenMusic API v1**
- **CRUD Lagu**: Tambah, baca, ubah, dan hapus lagu.
- **CRUD Album**: Tambah, baca, ubah, dan hapus album.
- **CRUD Playlist**: Buat, baca, dan hapus playlist.
- **Autentikasi & Autorisasi**: Menggunakan JWT untuk autentikasi.

### **🚀 OpenMusic API v2**
- **Kolaborasi Playlist**: Membolehkan pengguna berbagi playlist.
- **Server-side caching**: Menggunakan Redis untuk mempercepat respons data yang sering diakses.

### **⚡ OpenMusic API v3**
- **Ekspor Playlist**: Menggunakan RabbitMQ untuk mengirim playlist ke email.
- **Upload Cover Album**: Menggunakan AWS S3 untuk menyimpan gambar cover album.
- **Like & Unlike Album**: Pengguna dapat menyukai album favorit mereka.
- **Peningkatan Performa**: Optimasi caching dan query database.

## 💡 Teknologi yang Digunakan
- **Node.js** dengan framework **Hapi.js** sebagai backend utama.
- **PostgreSQL** sebagai database.
- **Redis** untuk caching data.
- **RabbitMQ** untuk message queue pada fitur ekspor playlist.
- **AWS S3** untuk menyimpan cover album.
- **Joi** untuk validasi request payload.
- **JWT (JSON Web Token)** untuk autentikasi pengguna.
- **Nodemailer** untuk mengirim email hasil ekspor playlist.

## 🔧 Cara Menjalankan

### **1️⃣ Clone Repository**
```sh
git clone https://github.com/user/openmusic-api.git
cd openmusic-api
```

### **2️⃣ Konfigurasi Environment (.env)**
Buat file `.env` di root proyek dan isi dengan konfigurasi berikut:
```sh
# Database
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGHOST=your_db_host
PGPORT=5432

# JWT
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# Redis
REDIS_SERVER=localhost

# AWS S3
AWS_BUCKET_NAME=your_s3_bucket
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_s3_region

# SMTP (Email Service)
SMTP_HOST=smtp.your-email.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

### **3️⃣ Install Dependencies**
```sh
npm install
```

### **4️⃣ Jalankan Server**
```sh
npm start
```

## 🏗️ Struktur Proyek
```sh
openmusic-api/
├── producer/   # Aplikasi utama (backend API)
├── consumer/   # Worker untuk RabbitMQ
├── migrations/ # Skrip database
├── src/
│   ├── api/
│   ├── services/
│   ├── db/
│   ├── utils/
├── .env
├── package.json
└── README.md
```

## 📫 Kontribusi
Jika ingin berkontribusi, silakan buat **Pull Request** atau laporkan masalah pada **Issues**.

---
🚀 OpenMusic API dikembangkan untuk memenuhi kebutuhan pengelolaan data musik dengan fitur lengkap dan performa yang optimal. Selamat mencoba! 🎵


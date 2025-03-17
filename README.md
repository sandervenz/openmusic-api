# OpenMusic API

## 📌 Deskripsi
OpenMusic API adalah sebuah layanan backend untuk mengelola data album dan lagu. API ini dibuat menggunakan **Hapi.js** dan menyimpan data ke dalam **PostgreSQL**.

## 🛠️ Teknologi yang Digunakan
- **Node.js**
- **Hapi.js**
- **PostgreSQL**
- **node-pg-migrate**
- **dotenv**
- **ESLint** untuk code style
- **Jest** untuk unit testing

## 🚀 Cara Menjalankan Proyek
### 1. Clone Repository
```sh
git clone https://github.com/sander-0/openmusic-api.git
cd openmusic-api
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Buat File `.env`
Buat file `.env` di root folder dengan isi:
```sh
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGHOST=localhost
PGPORT=5432
HOST=localhost
PORT=5000
ACCESS_TOKEN_KEY=token_key
ACCESS_TOKEN_AGE=1800  # (30 menit)
REFRESH_TOKEN_KEY=token_key
```

### 4. Setup Database
Jalankan perintah berikut untuk melakukan migrasi database:
```sh
npm run migrate:up
```

### 5. Jalankan Server
```sh
npm run start
```
Server akan berjalan di `http://localhost:5000`

## 📚 Endpoint API
### 1⃣ **Album**
#### ➕ Tambah Album
**POST** `/albums`
```json
{
  "name": "Viva la Vida",
  "year": 2008
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "albumId": "album-123"
  }
}
```

#### 🔍 Get Detail Album (termasuk daftar lagu)
**GET** `/albums/{albumId}`
Response:
```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-123",
      "name": "Viva la Vida",
      "year": 2008,
      "songs": [
        {
          "id": "song-456",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

#### ❌ Hapus Album
**DELETE** `/albums/{albumId}`

---

### 2⃣ **Song**
#### ➕ Tambah Lagu
**POST** `/songs`
```json
{
  "title": "Life in Technicolor",
  "year": 2008,
  "genre": "Indie",
  "performer": "Coldplay",
  "duration": 120,
  "albumId": "album-123"
}
```

#### 🔍 Get Semua Lagu (Mendukung Query Parameter `?title` & `?performer`)
**GET** `/songs`
Response:
```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "id": "song-456",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      }
    ]
  }
}
```

#### 🔍 Get Detail Lagu
**GET** `/songs/{songId}`

#### ✏️ Edit Lagu
**PUT** `/songs/{songId}`

#### ❌ Hapus Lagu
**DELETE** `/songs/{songId}`

---

### 3⃣ **Authentication** (Fitur Baru ✨)
#### 🔑 Login
**POST** `/authentications`
```json
{
  "username": "user123",
  "password": "password123"
}
```
Response:
```json
{
  "status": "success",
  "message": "Authentication berhasil",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### ⏳ Refresh Token
**PUT** `/authentications`
```json
{
  "refreshToken": "refresh_token"
}
```
Response:
```json
{
  "status": "success",
  "message": "Access token diperbarui",
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

#### ❌ Logout
**DELETE** `/authentications`
```json
{
  "refreshToken": "refresh_token"
}
```
Response:
```json
{
  "status": "success",
  "message": "Refresh token berhasil dihapus"
}
```

## 🔍 Testing API dengan Postman
- Import **collection Postman** (bisa dibuat manual atau export dari Postman).
- Gunakan **PostgreSQL** aktif untuk menyimpan data.
- Pastikan **server berjalan** (`npm run start`).

## 🐝 Lisensi
Proyek ini dibuat untuk latihan dalam kursus **Belajar Fundamental Aplikasi Back-End - Dicoding**.

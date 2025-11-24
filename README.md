# OpenMusic API

OpenMusic API is a backend service used to manage music data, such as songs, albums, and playlists. This API also supports playlist export features, album cover uploads, and caching to improve performance.

## 📌 Features

### **✅ OpenMusic API v1**
- **CRUD Songs**: Add, read, update, and delete songs.
- **CRUD Albums**: Add, read, update, and delete albums.
- **CRUD Playlists**: Create, read, and delete playlists.
- **Authentication & Authorization**: Using JWT for authentication.

### **🚀 OpenMusic API v2**
- **Playlist Collaboration**: Allows users to share playlists.
- **Server-side caching**: Using Redis to speed up responses for frequently accessed data.

### **⚡ OpenMusic API v3**
- **Playlist Export**: Using RabbitMQ to send playlists to email.
- **Album Cover Upload**: Using AWS S3 to store album cover images.
- **Like & Unlike Album**: Users can like their favorite albums.
- **Performance Improvements**: Optimization of caching and database queries.

## 💡 Technologies Used
- **Node.js** with **Hapi.js** framework as the main backend.
- **PostgreSQL** as the database.
- **Redis** for data caching.
- **RabbitMQ** for message queue in playlist export feature.
- **AWS S3** for storing album covers.
- **Joi** for request payload validation.
- **JWT (JSON Web Token)** for user authentication.
- **Nodemailer** for sending playlist export result emails.

## 🔧 How to Run

### **1️⃣ Clone Repository**
```sh
git clone https://github.com/user/openmusic-api.git
cd openmusic-api
```

### **2️⃣ Environment Configuration (.env)**
Create a `.env` file in the project root and fill it with the following configuration:
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

### **4️⃣ Run Server**
```sh
npm start
```

## 🏗️ Project Structure
```sh
openmusic-api/
├── producer/   # Main application (backend API)
├── consumer/   # Worker for RabbitMQ
├── migrations/ # Database scripts
├── src/
│   ├── api/
│   ├── services/
│   ├── db/
│   ├── utils/
├── .env
├── package.json
└── README.md
```

## 📫 Contribution
If you want to contribute, please create a **Pull Request** or report issues on **Issues**.

---
🚀 OpenMusic API was developed to meet the needs of music data management with comprehensive features and optimal performance. Happy trying! 🎵


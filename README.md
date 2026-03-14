# Install Dependencies

Project ini menggunakan **Node.js** dan **npm** untuk mengelola dependencies.

## 1. Clone Repository

```bash
git clone https://github.com/username/repository-name.git
```

Masuk ke folder project:

```bash
cd server
```

## 2. Install Dependencies

Jalankan perintah berikut untuk menginstall semua dependencies yang terdapat pada `package.json`.

```bash
npm install
```

Perintah ini akan menginstall semua package berikut secara otomatis:

* express
* sequelize
* mysql2
* bcrypt
* jsonwebtoken
* axios
* cors
* cookie-parser
* dotenv
* nodemon

## 3. Jalankan Server (Development)

```bash
npm run dev
```

Server akan berjalan menggunakan **nodemon** sehingga otomatis restart ketika ada perubahan pada file.

## 4. Jalankan Server (Production)

```bash
npm start
```

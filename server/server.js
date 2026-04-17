    import express from "express";
    import dotenv from "dotenv";
    import cookieParser from "cookie-parser";
    import cors from "cors";

    // Import Config Database
    import db from "./config/Database.js";

    // Import Middleware Error Handler
    import { errorHandler } from "./middleware/errorHandler.js";

    // Import Routes
    import router from "./routes/index.js"; 
    import chatbotRoutes from "./routes/chatbotRoutes.js"; // Cukup satu kali import

    // Import Models 
    // PERHATIAN: Pastikan path ini sesuai dengan file tempat kamu mendefinisikan relasi (seperti dibahas sebelumnya)
    import { Users, Roles } from "./models/index.js"; 

    dotenv.config();
    const app = express();

    // 1. Koneksi Database
    try {
        await db.authenticate();
        console.log("Database connected successfully");
        // Gunakan db.sync() jika kamu ingin sequelize otomatis menyesuaikan tabel (opsional)
        // await db.sync(); 
    } catch (error) {
        console.error("Connection error:", error);
    }

    // 2. Relasi Tabel (Jika belum dilakukan di dalam models/index.js)
    // Users.belongsTo(Roles, { foreignKey: "roles_id" });
    // Roles.hasMany(Users, { foreignKey: "roles_id" });

    // 3. Middleware
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000' // Pastikan ini sesuai dengan port React-mu
    }));
    app.use(cookieParser()); 
    app.use(express.json());

    // 4. Routing
    app.use(router); 
    app.use("/api", chatbotRoutes); // Akses AI akan menjadi http://localhost:5000/api/chat

    // 5. Error Handler (Harus paling bawah setelah rute)
    app.use(errorHandler);

    // 6. Jalankan Server
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
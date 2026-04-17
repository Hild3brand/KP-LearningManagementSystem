// Import menggunakan index.js karena kita sudah pakai model baru yang berelasi
import { Users, Roles } from "../models/index.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";

// ==========================================
// 1. FUNGSI GET USERS (Gaya Temanmu - Lebih Canggih)
// ==========================================
export const getUsers = async (req, res) => {
    try {
        // DB Get All Users (Sekarang bisa menampilkan nama Role-nya berkat fitur relasi temanmu)
        const response = await Users.findAll({
            attributes: ['id', 'name', 'status', 'url_photo', 'roles_id', 'level_id', 'xp', 'last_daily_xp'],
            include: [{
                model: Roles,
                as: 'Role', // Pastikan alias ini sama dengan di models/index.js
                attributes: ["name"]
            }]
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// ==========================================
// 2. FUNGSI REGISTER (Milikmu - Sudah disesuaikan dengan Level_ID berupa angka)
// ==========================================
export const Register = async (req, res) => {
    const { id, name, password, status, roles_id } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            id: id,
            name: name,
            password: hashPassword,
            status: status,
            roles_id: roles_id,
            level_id: 1, // Menggunakan angka sesuai model baru
            xp: 0
        });

        res.json({ msg: "Register Success" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// ==========================================
// 3. FUNGSI CREATE USER KHUSUS ADMIN (Dari Temanmu)
// ==========================================
export const createUser = async (req, res) => {
    try {
        // Check Auth & Role Admin
        if (req.roles_id !== 1) { // Disesuaikan dengan middleware milikmu (req.roles_id)
            return res.status(403).json({ msg: "Access denied, admin only" });
        }

        const { id, name, password, status, roles_id } = req.body;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.create({
            id: id,
            name: name,
            password: hashPassword,
            status: status,
            roles_id: roles_id,
            level_id: 1, // Beri nilai default agar tidak error database
            xp: 0
        });

        res.status(201).json({ msg: "User Created by Admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// ==========================================
// 4. FUNGSI LOGIN (Milikmu - UTUH)
// ==========================================
export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: { id: req.body.id }
        });

        if (user.length === 0) return res.status(404).json({ msg: "User ID Not Found" });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        
        const userId = user[0].id;
        const name = user[0].name;
        const status = user[0].status;
        const roles_id = user[0].roles_id;
        
        // Logika Level_ID
        const level_id = user[0].level_id !== null ? user[0].level_id : 1;
        let xp = user[0].xp !== null ? Number(user[0].xp) : 0;
        const lastDailyXp = user[0].last_daily_xp;

        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        if (lastDailyXp !== today) {
            xp += 10;
            await Users.update({ xp: xp, last_daily_xp: today }, { where: { id: userId } });
            console.log(`[BONUS] User ${name} mendapat 10 XP login harian! Total XP: ${xp}`);
        }

        // Token
        const accessToken = jwt.sign({ userId, name, status, roles_id, level_id, xp }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
        const refreshToken = jwt.sign({ userId, name, status, roles_id, level_id, xp }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        await Users.update({ refresh_token: refreshToken }, { where: { id: userId } });
        
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });

    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    };
}

// ==========================================
// 5. FUNGSI LAINNYA (Milikmu - UTUH)
// ==========================================

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({ where: { refresh_token: refreshToken } });
    if (!user[0]) return res.sendStatus(204);
    
    await Users.update({ refresh_token: null }, { where: { id: user[0].id } });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const deleteUser = async (req, res) => { /*... (Kode lamamu utuh) ...*/ 
    try {
        const user = await Users.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        await Users.destroy({ where: { id: user.id } });
        res.status(200).json({ msg: "User Berhasil Dihapus" });
    } catch (error) { res.status(400).json({ msg: error.message }); }
}

export const updateUser = async (req, res) => { /*... (Kode lamamu utuh) ...*/
    try {
        const user = await Users.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        await Users.update({ name: req.body.name, status: req.body.status }, { where: { id: user.id } });
        res.status(200).json({ msg: "User Berhasil Diupdate" });
    } catch (error) { res.status(400).json({ msg: error.message }); }
}

export const getUserProgress = async (req, res) => { /*... (Kode lamamu utuh) ...*/
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({msg: "Token tidak ada"});
        const user = await Users.findAll({ where: { refresh_token: refreshToken } });
        if(!user[0]) return res.status(404).json({msg: "User tidak ditemukan"});

        const progress = await db.query(
            `SELECT ld.name AS level_code 
             FROM user_progress up 
             JOIN level_detail ld ON up.level_detail_id = ld.id 
             WHERE up.users_id = :userId AND up.status = 'completed'`,
            { replacements: { userId: user[0].id }, type: QueryTypes.SELECT }
        );
        res.status(200).json({ completedLevels: progress.map(p => p.level_code) });
    } catch (error) { res.status(500).json({ msg: "Error server" }); }
};

export const finishLevel = async (req, res) => { /*... (Kode lamamu utuh) ...*/
    const { levelId, addedXP } = req.body; 
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({msg: "Token tidak ada"});
        const user = await Users.findAll({ where: { refresh_token: refreshToken } });
        if(!user[0]) return res.status(404).json({msg: "User tidak ditemukan"});

        const levelDetail = await db.query('SELECT id FROM level_detail WHERE name = :levelName', { replacements: { levelName: levelId }, type: QueryTypes.SELECT });
        if (levelDetail.length === 0) return res.status(404).json({ msg: "Level tidak valid di database" });

        const targetId = levelDetail[0].id;
        const existing = await db.query('SELECT * FROM user_progress WHERE users_id = :userId AND level_detail_id = :targetId', { replacements: { userId: user[0].id, targetId: targetId }, type: QueryTypes.SELECT });
        
        if (existing.length > 0) return res.status(200).json({ msg: "Level sudah pernah diselesaikan" });

        await db.query(`INSERT INTO user_progress (users_id, level_detail_id, status, score, createdAt, updatedAt) VALUES (:userId, :targetId, 'completed', :score, NOW(), NOW())`, { replacements: { userId: user[0].id, targetId: targetId, score: addedXP }, type: QueryTypes.INSERT });
        await db.query('UPDATE users SET xp = xp + :addedXP WHERE id = :userId', { replacements: { addedXP: addedXP, userId: user[0].id }, type: QueryTypes.UPDATE });

        res.status(200).json({ msg: "Progress tersimpan!" });
    } catch (error) { res.status(500).json({ msg: "Server error", error: error.message }); }
};
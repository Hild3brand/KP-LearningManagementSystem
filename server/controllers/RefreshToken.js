import { Users } from "../models/index.js"; // PERBAIKAN: Import dari index.js model baru
import jwt from "jsonwebtoken";

export const RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403);
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            
            const userId = user[0].id;
            const name = user[0].name;
            const status = user[0].status;
            const roles_id = user[0].roles_id;
            
            // PERBAIKAN: Sesuaikan dengan model baru (level_id berupa angka)
            const level_id = user[0].level_id !== null ? user[0].level_id : 1;
            const xp = user[0].xp !== null ? Number(user[0].xp) : 0;

            // PERBAIKAN: Payload token disamakan dengan fungsi Login (pakai level_id)
            const accessToken = jwt.sign({ userId, name, status, roles_id, level_id, xp }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            });
            
            res.json({ accessToken });
        });
    } catch (error) {
        console.log("RefreshToken Error:", error.message);
        res.sendStatus(500);
    }
}
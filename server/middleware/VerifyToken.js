import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Pakai gaya temanmu (lebih informatif untuk frontend)
    if (!token) return res.status(401).json({ msg: "Akses Ditolak: Token tidak ditemukan" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // Pakai gaya temanmu
        if (err) return res.status(403).json({ msg: "Sesi Berakhir: Token tidak valid atau kedaluwarsa" });

        // Pakai gaya kamu (karena ini yang sesuai dengan sistem Login-mu)
        req.userId = decoded.userId;
        req.name = decoded.name;
        req.status = decoded.status;
        req.roles_id = decoded.roles_id;
        
        // Opsional: Karena di fungsi Login kamu juga menyimpan level dan xp, 
        // kamu bisa menambahkannya di sini jika butuh dipakai di controller lain
        req.level = decoded.level;
        req.xp = decoded.xp;

        next();
    });
};
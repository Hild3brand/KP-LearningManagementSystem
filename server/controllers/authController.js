import { Users, Levels, Roles, LevelDetail, PromptTech } from "../models/Relation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req,res)=>{
    try {
        const user = await Users.findOne({
            where: { id: req.body.id },
            include: [
                {
                    model: Levels,
                    as: "Level",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: LevelDetail,
                            as: "level_details",
                            attributes: ["id", "name"]
                        }
                    ]
                },
                {
                    model: Roles,
                    as: "Role",
                    attributes: ["id", "name"]
                }
            ]
        });

        if(!user) return res.status(404).json({msg:"User not found"});

        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg:"Wrong Password"});

        const accessToken = jwt.sign(
        {
            userId: user.id,
            name: user.name,
            xp: user.xp,

            role_id: user.roles_id,
            role: user.Role?.name || "Unknown",

            level: user.Level?.name || "Unknown",
            level_detail: user.Level?.level_details?.[0]?.name || "Unknown",
            level_detail_id: user.Level?.level_details?.[0]?.id || "Unknown"
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
        );
        
        res.json({accessToken});
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
};
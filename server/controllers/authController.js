import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req,res)=>{
    try {
        const user = await Users.findOne({
            where:{ id: req.body.id }
        });

        if(!user) return res.status(404).json({msg:"User not found"});

        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg:"Wrong Password"});

        const accessToken = jwt.sign(
            {userId: user.id, role: user.roles_id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        res.json({accessToken});
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
};
import Users from "../models/userModel.js";
import Roles from "../models/roleModel.js";
import bcrypt from "bcrypt";

export const getUsers = async (req,res)=>{
    try {
        // Check Auth
        if (!req.userId) {
            return res.status(401).json({ msg: "Login required" });
        }

        // DB Get All Users
        const response = await Users.findAll({
            attributes:["id","name","status","url_photo"],
            include:[{
                model: Roles,
                attributes:["name"]
            }]
        });

        // Response
        res.json(response);

    } catch (error) {
        res.status(500).json({msg:error.message});
    }
};

export const createUser = async (req, res) => {
    try {
        // Check Auth
        if (!req.userId) {
            return res.status(401).json({ msg: "Login required" });
        }

        // Check Role
        if (req.role !== 1) {
            return res.status(403).json({ msg: "Access denied, admin only" });
        }

        // Check attribute
        const { id, name, password, status, roles_id } = req.body;

        // Hash Password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // DB Insert Create User
        await Users.create({
            id: id,
            name: name,
            password: hashPassword,
            status: status,
            roles_id: roles_id
        });

        // Response
        res.status(201).json({ msg: "User Created" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
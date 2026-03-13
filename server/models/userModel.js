import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define("users", {
    id: {
        type: DataTypes.STRING(7),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false
    },
    url_photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    roles_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    freezeTableName: true
});

export default Users;
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING
    },
    url_photo: {
        type: DataTypes.STRING
    },
    roles_id: {
        type: DataTypes.STRING
    },
    level_id: {
        type: DataTypes.STRING,
        defaultValue: 'Beginner 1'
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    last_daily_xp: {
        type: DataTypes.DATEONLY
    }
    
}, {
    freezeTableName: true
});

(async () => {
    await db.sync(); 
})();

export default Users;
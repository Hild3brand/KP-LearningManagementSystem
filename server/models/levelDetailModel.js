import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const LevelDetail = db.define("level_detail", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    levels_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    prompt_tech_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    freezeTableName: true
});

export default LevelDetail;
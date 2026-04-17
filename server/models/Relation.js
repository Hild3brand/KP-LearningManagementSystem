import Users from "./userModel.js";
import Levels from "./levelModel.js";
import Roles from "./roleModel.js";
import LevelDetail from "./levelDetailModel.js";
import PromptTech from "./promptTechModel.js";

Users.belongsTo(Levels, { foreignKey: "level_id", as: "Level" });
Levels.hasMany(Users, { foreignKey: "level_id" });

Users.belongsTo(Roles, { foreignKey: "roles_id", as: "Role" });
Roles.hasMany(Users, { foreignKey: "roles_id" });

LevelDetail.belongsTo(Levels, { foreignKey: "levels_id", as: "Level" });
Levels.hasMany(LevelDetail, { foreignKey: "levels_id" });

LevelDetail.belongsTo(PromptTech, { foreignKey: "prompt_tech_id", as: "PromptTech" });
PromptTech.hasMany(LevelDetail, { foreignKey: "prompt_tech_id" });

export { Users, Levels, Roles, LevelDetail, PromptTech };
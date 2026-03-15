// Import Packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Config
import db from "./config/Database.js";

// Import Middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Import Routes
import AuthRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

// Import Models
import Users from "./models/userModel.js";
import Roles from "./models/roleModel.js";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Database Connected");
} catch (error) {
    console.log(error);
}

app.use(cors());
app.use(express.json());
app.use(AuthRoute);
app.use(userRoute);
app.use("/api", chatbotRoutes);
app.use(errorHandler);


// Relations
Users.belongsTo(Roles,{
    foreignKey:"roles_id"
});

Roles.hasMany(Users,{
    foreignKey:"roles_id"
});

app.listen(5000, ()=> console.log("Server running"));
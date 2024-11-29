const express = require("express");
const app = express();
require("dotenv").config();
const { mongooseCon } = require("./Config/mongooseCon");
const ErrorHandlerBlock = require("./Utils/ErrorHandler");
const cors = require("cors");

const UserRoutes = require("./Modules/Common/Routes/User.router");
const ProjectRoutes = require("./Modules/ProjectManager/Routers/Project.router");
const TaskRoutes = require("./Modules/TeamLeader/Routes/Task.routers");

mongooseCon();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/user", UserRoutes);
app.use("/api/projectManager", ProjectRoutes);
app.use("/api", TaskRoutes);

app.use(ErrorHandlerBlock);

app.listen(process.env.PORT, () => {
  console.log("server running...");
});

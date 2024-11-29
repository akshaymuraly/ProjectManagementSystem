const express = require("express");
const Router = express.Router();
const {
  SignIn,
  userSignup,
  cookieValidation,
  getTeamMembers,
  getAllUsers,
  editUserEmail,
  deleteUser,
} = require("../Controllers/User.controllers");

Router.post("/signin", SignIn);
Router.post("/signup", userSignup);
Router.get("/check", cookieValidation(["mm"]));
Router.get(
  "/all-members",
  cookieValidation(["ProjectManager"]),
  getTeamMembers
);
Router.get("/all-users", cookieValidation(["ProjectManager"]), getAllUsers);
Router.put("/edit", cookieValidation(["ProjectManager"]), editUserEmail);
Router.delete("/delete", cookieValidation(["ProjectManager"]), deleteUser);

module.exports = Router;

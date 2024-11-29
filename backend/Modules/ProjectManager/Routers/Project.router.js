const Router = require("express").Router();
const {
  cookieValidation,
} = require("../../Common/Controllers/User.controllers");
const {
  addProject,
  addProjectMember,
  deleteProject,
  editProject,
  getAllProjects,
  getUserProjects,
  removeProjectMember,
  getProjectMembers,
} = require("../Controllers/Project.controller");

Router.post("/project/add", cookieValidation(["TeamLeader"]), addProject);
Router.post(
  "/project/add-member/:projectId",
  cookieValidation(["ProjectManager"]),
  addProjectMember
);
Router.delete(
  "/project/delete-project/:projectId",
  cookieValidation(["TeamLeader"]),
  deleteProject
);
Router.put(
  "/project/edit-project/:projectId",
  cookieValidation(["TeamLeader"]),
  editProject
);
Router.get(
  "/project/get-all-projects",
  cookieValidation(["TeamLeader"]),
  getAllProjects
);
Router.get(
  "/project/get-all-user-projects/:userId",
  cookieValidation(["TeamMember"]),
  getUserProjects
);
Router.delete(
  "/project/remove-member/:projectId/:memberId",
  cookieValidation(["ProjectManager"]),
  removeProjectMember
);
Router.get(
  "/project/get-all-members/:projectId",
  cookieValidation(["TeamLeader"]), // Adjust according to role permissions
  getProjectMembers
);

module.exports = Router;

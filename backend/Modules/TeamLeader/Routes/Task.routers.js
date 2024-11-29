const Router = require("express").Router();
const {
  cookieValidation,
} = require("../../Common/Controllers/User.controllers");
const {
  addTask,
  deleteTask,
  editTask,
  getAllTasks,
  getProjectTasks,
  addTaskMember,
  getUserTasks,
  removeTaskMember,
  updateTaskStatus,
} = require("../Controllers/Task.controller");

// Add a new task
Router.post("/task/add", cookieValidation(["TeamLeader"]), addTask);

// Delete a task
Router.delete(
  "/task/delete-task/:taskId",
  cookieValidation(["TeamLeader"]),
  deleteTask
);

// Edit a task
Router.put(
  "/task/edit-task/:taskId",
  cookieValidation(["TeamLeader"]),
  editTask
);

// Get all tasks
Router.get(
  "/task/get-all-tasks",
  cookieValidation(["TeamLeader"]),
  getAllTasks
);

// Get tasks for a specific project
Router.get(
  "/task/get-project-tasks/:projectId",
  cookieValidation(["TeamLeader"]),
  getProjectTasks
);

// Add a team member to a task
Router.post(
  "/task/add-member/:taskId",
  cookieValidation(["TeamLeader"]),
  addTaskMember
);
Router.delete(
  "/task/remove-member/:taskId/:memberId",
  cookieValidation(["TeamLeader"]),
  removeTaskMember
);
Router.get("/task/user", cookieValidation(["TeamMember"]), getUserTasks);
Router.put(
  "/task/update-status/:taskId",
  cookieValidation(["TeamMember"]),
  updateTaskStatus
); // Update task status

module.exports = Router;

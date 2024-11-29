const Task = require("../Models/Task.model");
const AsyncHandler = require("../../../Utils/AsyncHandler");
const { CustomError } = require("../../../Utils/CustomError");

// Add a new task
const addTask = AsyncHandler(async (req, res, next) => {
  const { Task: TaskName, Project, TeamMembers } = req.body;

  const TaskContents = { Task: TaskName, Project };
  if (TeamMembers && TeamMembers.length > 0) {
    TaskContents.TeamMembers = [TeamMembers];
  }

  const task = new Task(TaskContents);
  await task.save();

  return res.status(200).json({
    message: "Task created successfully!",
    status: true,
    task,
  });
});

// Delete a task
const deleteTask = AsyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  return res.status(200).json({
    message: "Task deleted successfully!",
    status: true,
  });
});

// Edit the Task field
const editTask = AsyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { Task: TaskName } = req.body;

  if (!TaskName) {
    throw new CustomError("Task field is required for update", 400);
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    { Task: TaskName },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  return res.status(200).json({
    message: "Task updated successfully!",
    status: true,
    task,
  });
});

// Get all tasks
const getAllTasks = AsyncHandler(async (req, res, next) => {
  const tasks = await Task.find()
    .populate({
      path: "Project", // Populate the Project field
      populate: { path: "Members" }, // Populate the TeamMembers field inside Project
    })
    .populate("TeamMembers");

  if (!tasks || tasks.length === 0) {
    throw new CustomError("No tasks found", 404);
  }

  return res.status(200).json({
    message: "Tasks retrieved successfully!",
    status: true,
    tasks,
  });
});

// Get tasks for a specific project
const getProjectTasks = AsyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ Project: projectId }).populate("TeamMembers");

  if (!tasks || tasks.length === 0) {
    throw new CustomError("No tasks found for this project", 404);
  }

  return res.status(200).json({
    message: "Tasks retrieved for the project successfully!",
    status: true,
    tasks,
  });
});

// Add a team member to a task
const addTaskMember = AsyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { MemberId } = req.body;

  if (!MemberId) {
    throw new CustomError("MemberId is required", 400);
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  if (task.TeamMembers.includes(MemberId)) {
    throw new CustomError("Member already exists in the task", 400);
  }

  task.TeamMembers.push(MemberId);
  await task.save();
  const updatedTask = await Task.findById(taskId).populate("TeamMembers");

  return res.status(200).json({
    message: "Team member added to the task successfully!",
    status: true,
    task: updatedTask,
  });
});

const getUserTasks = AsyncHandler(async (req, res, next) => {
  // Find tasks where the user is a member (userId exists in the TeamMembers array)
  const tasks = await Task.find({ TeamMembers: { $in: [req.id] } }).populate(
    "Project",
    "ProjectName ProjectDetails"
  ); // Populate Project details

  if (!tasks || tasks.length === 0) {
    throw new CustomError("No tasks found for this user", 404);
  }

  return res.status(200).json({
    message: "Tasks retrieved successfully for the user",
    status: true,
    tasks,
  });
});

const removeTaskMember = AsyncHandler(async (req, res, next) => {
  const { taskId, memberId } = req.params;

  // Validate the memberId and taskId
  if (!taskId || !memberId) {
    throw new CustomError("Task ID and Member ID are required", 400);
  }

  // Find the task by its ID
  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  // Check if the user is part of the task's TeamMembers array
  if (!task.TeamMembers.includes(memberId)) {
    throw new CustomError("Member not found in the task", 404);
  }

  // Remove the member from the TeamMembers array
  task.TeamMembers.pull(memberId);

  // Save the task with the updated TeamMembers array
  await task.save();
  const updatedTask = await Task.findById(taskId).populate("TeamMembers");

  return res.status(200).json({
    message: "Team member removed from the task successfully!",
    status: true,
    task: updatedTask,
  });
});

const updateTaskStatus = AsyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { status } = req.body; // Assuming status is passed in the body

  // Validate input
  if (!status) {
    throw new CustomError("Status is required", 400);
  }

  // Find the task by taskId
  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  // Check if the user is a member of the task (use req.id to check the logged-in user's ID)
  if (!task.TeamMembers.includes(req.id)) {
    throw new CustomError("User is not a team member of this task", 403);
  }

  // Update the task status
  task.Status = status; // Assuming the task has a 'Status' field

  await task.save();

  return res.status(200).json({
    message: "Task status updated successfully!",
    status: true,
    task,
  });
});

module.exports = {
  addTask,
  deleteTask,
  editTask,
  getAllTasks,
  getProjectTasks,
  addTaskMember,
  getUserTasks,
  removeTaskMember,
  updateTaskStatus,
};

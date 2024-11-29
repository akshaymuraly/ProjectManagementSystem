const Project = require("../Models/Project.model");
const AsyncHandler = require("../../../Utils/AsyncHandler");
const { CustomError } = require("../../../Utils/CustomError");

const addProject = AsyncHandler(async (req, res, next) => {
  const { ProjectName, ProjectDetails, Members } = req.body;
  const ProjectContents = {
    ProjectName,
    ProjectDetails,
  };
  if (Members && Members.length > 0) {
    ProjectContents.Members = [Members];
  }
  const project = Project(ProjectContents);
  await project.save();
  return res
    .status(200)
    .json({ message: "Project saved!", status: true, project });
});

const addProjectMember = AsyncHandler(async (req, res, next) => {
  const { projectId } = req.params; // Get projectId from route parameters
  const { MemberId } = req.body; // Assuming MemberId is passed in the request body

  // Validate input
  if (!MemberId) {
    throw new CustomError("MemberId is required", 400);
  }

  // Find the project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new CustomError("Project not found", 404);
  }

  // Check if the MemberId is already in the Members array
  if (project.Members.includes(MemberId)) {
    throw new CustomError("Member already exists in the project", 400);
  }

  // Add the new member's ObjectId to the Members array
  project.Members.push(MemberId);

  // Save the updated project
  await project.save();
  const updatedProject = await Project.findById(projectId).populate("Members");

  return res.status(200).json({
    message: "Member added successfully!",
    status: true,
    project: updatedProject,
  });
});

const deleteProject = AsyncHandler(async (req, res, next) => {
  const { projectId } = req.params; // Get projectId from route parameters

  // Delete the project
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new CustomError("Project not found", 404);
  }

  return res.status(200).json({
    message: "Project deleted successfully!",
    status: true,
    project,
  });
});

const editProject = AsyncHandler(async (req, res, next) => {
  const { projectId } = req.params; // Get projectId from route parameters
  const { Payload } = req.body; // New ProjectDetails from request body

  // Validate input
  if (!Payload) {
    throw new CustomError("Payload is required", 400);
  }

  // Find and update the project
  const project = await Project.findByIdAndUpdate(
    projectId,
    Payload,
    { new: true, runValidators: true } // Return the updated document and run validations
  );

  if (!project) {
    throw new CustomError("Project not found", 404);
  }

  return res.status(200).json({
    message: "Project updated successfully!",
    status: true,
    project,
  });
});

const getAllProjects = AsyncHandler(async (req, res, next) => {
  // Fetch all projects
  const projects = await Project.find().populate("Members");

  if (!projects || projects.length === 0) {
    throw new CustomError("No projects found", 404);
  }

  return res.status(200).json({
    message: "Projects retrieved successfully!",
    status: true,
    projects,
  });
});

const getUserProjects = AsyncHandler(async (req, res, next) => {
  const { userId } = req.params; // Get userId from route parameters

  // Find all projects where the userId is in the Members array
  const projects = await Project.find({ Members: { $in: [userId] } });

  if (!projects || projects.length === 0) {
    throw new CustomError("No projects found for this user", 404);
  }

  return res.status(200).json({
    message: "Projects found for the user",
    status: true,
    projects,
  });
});

const removeProjectMember = AsyncHandler(async (req, res, next) => {
  const { projectId, memberId } = req.params;

  // Validate the projectId and memberId
  if (!projectId || !memberId) {
    throw new CustomError("Project ID and Member ID are required", 400);
  }

  // Find the project by its ID
  const project = await Project.findById(projectId);

  if (!project) {
    throw new CustomError("Project not found", 404);
  }

  // Check if the user is part of the project's Members array
  if (!project.Members.includes(memberId)) {
    throw new CustomError("Member not found in the project", 404);
  }

  // Remove the member from the Members array
  project.Members.pull(memberId);

  // Save the project with the updated Members array
  await project.save();

  const updatedProject = await Project.findById(projectId).populate("Members");

  return res.status(200).json({
    message: "Member removed from the project successfully!",
    status: true,
    project: updatedProject,
  });
});

const getProjectMembers = AsyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  // Validate the projectId
  if (!projectId) {
    throw new CustomError("Project ID is required", 400);
  }

  // Find the project by projectId and populate the members
  const project = await Project.findById(projectId).populate("Members");

  if (!project) {
    throw new CustomError("Project not found", 404);
  }

  // Respond with the project and its populated members
  return res.status(200).json({
    message: "Project members retrieved successfully!",
    status: true,
    project,
    members: project.Members,
  });
});

module.exports = {
  addProject,
  addProjectMember,
  deleteProject,
  editProject,
  getAllProjects,
  getUserProjects,
  removeProjectMember,
  getProjectMembers,
};

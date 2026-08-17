import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/ProjectMember.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProjects = asyncHandler(async (req, res) => {
  //Test
});

const getProjectById = asyncHandler(async (req, res) => {
  //Test
});

const createProject = asyncHandler(async (req, res) => {
  //Test
});

const updateProject = asyncHandler(async (req, res) => {});

const deleteProject = asyncHandler(async (req, res) => {});

const addMembersToProject = asyncHandler(async (req, res) => {
  //Test
});

const getProjectMembers = asyncHandler(async (req, res) => {
  //Test
});

const updateMemberRole = asyncHandler(async (req, res) => {
  //Test
});

const deleteMemberRole = asyncHandler(async (req, res) => {
  //Test
});

export {
addMembersToProject,
createProject,
deleteProject,
getProjects,
getProjectById,
getProjectMembers,
updateProject,
updateMemberRole,
deleteMemberRole,
};


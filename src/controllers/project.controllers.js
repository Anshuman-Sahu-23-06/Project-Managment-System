import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/ProjectMember.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
    //Test
});

const getProjectById = asyncHandler(async (req, res) => {
  //Test
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: project._id,
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            project,
            "Project created successfully"
        ));
});

const updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const {projectId} = req.params

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        {
            new: true
        }
    )

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project updated successfully"
        )
    )
});

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params

    const project = await Project.findByIdAndDelete(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project deleted successfully"
        )
    )
});

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

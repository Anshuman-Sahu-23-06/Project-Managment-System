import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.model.js";
import { SubTask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { ProjectId } = req.params;
  const project = await Project.findById(ProjectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(ProjectId),
  }).populate("assignedTo", "avatar username fullname");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { ProjectId } = req.params;
  const project = await Project.findById(ProjectId);

  if (!project) {
    throw new ApiError(404, "project not found");
  }
  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
      originalName: file.originalname,
      localPath: file.path,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(ProjectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user?._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task Created Succesfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline:[
                {
                  $project:
                  {
                    _id:1,
                    username:1,
                    fullName:1,
                    avatar:1
                }
                }
              ]
            },
          },
          {
            $addFields:{
                createdBy: {
                    $arratElemAt: ["$$createdBy", 0]
                }
            }
          }
        ],
      },
    },
    {
        $addFields:{
            assignedTo: {
                $arratElemAt: ["$$assignedTo", 0]
            },
        }
    }
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "task not found")
  }
  return res
    .status(200)
    .json(new ApiResponse(200,task[0],"Task Fatched Successfully"))
});

const updateTask = asyncHandler(async (req, res) => {
  //Chai
});

const deleteTask = asyncHandler(async (req, res) => {
  //Chai
});

const createSubTask = asyncHandler(async (req, res) => {
  //Chai
});

const updateSubTask = asyncHandler(async (req, res) => {
  //Chai
});

const deleteSubTask = asyncHandler(async (req, res) => {
  //Chai
});

export {
  createTask,
  createSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
  updateTask,
  updateSubTask,
};

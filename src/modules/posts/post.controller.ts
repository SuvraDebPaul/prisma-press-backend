import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await postService.createPostIntoDB(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Created Successfully",
      data: result,
    });
  },
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allPosts = await postService.getAllPostFromDB;

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Fetched Successfully",
      data: allPosts,
    });
  },
);

const getPostStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatusFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Status Fetched Successfully",
      data: result,
    });
  },
);

const getMyPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post id is Reqired");
    }

    const result = await postService.getPostByIdFromDB(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Fetched Successfully",
      data: result,
    });
  },
);
const updatePostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const UpdatedPayload = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const updatedPost = await postService.updatePostByIdIntoDB(
      postId as string,
      UpdatedPayload,
      userId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Updated Successfully",
      data: updatedPost,
    });
  },
);
const deletePostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const deletedPost = await postService.deletePostByIdFromDB(
      postId as string,
      userId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Deleted Successfully",
      data: deletedPost,
    });
  },
);

export const postController = {
  createPost,
  getAllPost,
  getPostStatus,
  getMyPost,
  getPostById,
  updatePostById,
  deletePostById,
};

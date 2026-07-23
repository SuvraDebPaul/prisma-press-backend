import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getCommentByAuthodId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getCommentBycommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  createComment,
  getCommentByAuthodId,
  getCommentBycommentId,
  updateCommentByCommentId,
  deleteCommentByCommentId,
  moderateComment,
};

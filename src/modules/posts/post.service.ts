import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPostFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

const getPostStatusFromDB = async () => {
  const transectionResult = await prisma.$transaction(async (tx) => {
    const totalPosts = await tx.post.count();
    const totalPublishedPosts = await tx.post.count({
      where: { status: PostStatus.PUBLISHED },
    });
    const totalDraftPosts = await tx.post.count({
      where: { status: PostStatus.DRAFT },
    });
    const totalArchivedPosts = await tx.post.count({
      where: { status: PostStatus.ARCHIVE },
    });
    const totalComments = await tx.comment.count();
    const totalApprovedComments = await tx.comment.count({
      where: { status: CommentStatus.APPROVED },
    });
    const totalRejectedComments = await tx.comment.count({
      where: { status: CommentStatus.REJECT },
    });
    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
    };
  });
  return transectionResult;
};

const getMyPostFromDB = async () => {};

const getPostByIdFromDB = async (postId: string) => {
  // await prisma.post.update({
  //   where: { id: postId },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: { id: postId },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  const transectionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: { id: postId },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transectionResult;
};

const updatePostByIdIntoDB = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorised");
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: payload,
  });

  return updatedPost;
};
const deletePostByIdFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorised");
  }
  const result = await prisma.post.delete({ where: { id: postId } });
  return result;
};

export const postService = {
  createPostIntoDB,
  getAllPostFromDB,
  getPostStatusFromDB,
  getMyPostFromDB,
  getPostByIdFromDB,
  updatePostByIdIntoDB,
  deletePostByIdFromDB,
};

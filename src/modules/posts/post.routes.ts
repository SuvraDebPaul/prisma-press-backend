import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.createPost,
);

router.get("/", postController.getAllPost);

router.get("/stats", auth(Role.ADMIN), postController.getPostStatus);

router.get(
  "/my-posts",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.getMyPost,
);

router.get("/:postId", postController.getPostById);

router.patch(
  "/:postId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.updatePostById,
);

router.delete(
  "/:postId",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.deletePostById,
);

export const postRoutes = router;

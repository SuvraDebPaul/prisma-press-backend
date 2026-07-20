import { Request, NextFunction, Response } from "express";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, email, name, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("Forbidden");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        email,
      },
    });

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account is Blocked Please Contact admin");
    }

    req.user = {
      id,
      email,
      name,
      role,
    };

    next();
  });
};

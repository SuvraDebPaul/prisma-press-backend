import jwt, { SignOptions } from "jsonwebtoken";
import { IjwtPayload } from "../modules/auth/auth.interface";

const createToken = (
  jwtPayload: IjwtPayload,
  secret: string,
  options: SignOptions,
) => {
  return jwt.sign(jwtPayload, secret, options);
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = { createToken, verifyToken };

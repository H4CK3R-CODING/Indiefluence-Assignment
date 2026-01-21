// ============================================
// src/config/jwt.js
// ============================================
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "./constants.js";

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "JWT_SECRET is not defined",
    );
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token has expired");
    }
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID);
  }
};

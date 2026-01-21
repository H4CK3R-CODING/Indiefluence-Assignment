// ============================================
// src/controllers/user.controller.js
// ============================================
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const { name, bio, interests, contactInfo } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      bio,
      interests,
      contactInfo,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    },
  );

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  res.json(
    new ApiResponse(HTTP_STATUS.OK, user, "Profile updated successfully"),
  );
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  res.json(new ApiResponse(HTTP_STATUS.OK, user));
});

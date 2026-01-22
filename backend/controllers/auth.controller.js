// ============================================
// src/controllers/auth.controller.js
// ============================================
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../config/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, rounds);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);
  console.log(`New user registered: ${email}`);

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        { token, userId: user._id },
        "User registered successfully",
      ),
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for user: ${email}`);

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.INVALID_CREDENTIALS,
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.INVALID_CREDENTIALS,
    );
  }

  const token = generateToken(user._id);
  console.log("token generated for user:", token);

  res.json(
    new ApiResponse(
      HTTP_STATUS.OK,
      { token, userId: user._id },
      "Login successful",
    ),
  );
});

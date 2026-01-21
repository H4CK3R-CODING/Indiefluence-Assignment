// ============================================
// src/middleware/auth.middleware.js
// ============================================
import { verifyToken } from '../config/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { asyncHandler } from './asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_MISSING);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  req.user = { id: decoded.userId };
  next();
});
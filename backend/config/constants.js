// ============================================
// src/config/constants.js
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Validation error",
  UNAUTHORIZED: "Unauthorized access",
  USER_NOT_FOUND: "User not found",
  PET_NOT_FOUND: "Pet not found",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_EXISTS: "User already exists",
  TOKEN_MISSING: "Authorization token missing",
  TOKEN_INVALID: "Invalid or expired token",
  INTERNAL_ERROR: "Internal server error",
};

export const PET_GENDERS = ["Male", "Female"];

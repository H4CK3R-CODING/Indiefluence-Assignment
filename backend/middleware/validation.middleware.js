// ============================================
// src/middleware/validation.middleware.js
// ============================================
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      throw new ApiError(HTTP_STATUS.BAD_REQUEST, errorMessage);
    }

    req.body = value;
    next();
  };
};

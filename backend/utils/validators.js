// ============================================
// src/utils/validators.js
// ============================================
import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userProfileSchema = Joi.object({
  name: Joi.string().trim().max(100),
  bio: Joi.string().max(300),
  interests: Joi.array().items(Joi.string().trim()),
  contactInfo: Joi.string().trim(),
});

export const petSchema = Joi.object({
  petName: Joi.string().trim().required().messages({
    "any.required": "Pet name is required",
  }),
  breed: Joi.string().trim().allow(""),
  gender: Joi.string().valid("Male", "Female"),
  age: Joi.number().min(0),
  weight: Joi.number().min(0),
  vaccinated: Joi.boolean(),
  imageUrl: Joi.string().uri().allow(""),
});

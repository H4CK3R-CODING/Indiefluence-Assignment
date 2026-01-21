// ============================================
// src/controllers/pet.controller.js
// ============================================
import Pet from "../models/Pet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createPet = asyncHandler(async (req, res) => {
  const { petName, breed, gender, age, weight, vaccinated, imageUrl } = req.body;

  const pet = await Pet.create({
    userId: req.user.id,
    petName,
    breed,
    gender,
    age,
    weight,
    vaccinated,
    imageUrl
  });

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        pet,
        "Pet profile created successfully",
      ),
    );
});

export const getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findOne({ userId: req.user.id }).populate(
    "userId",
    "name email",
  );

  if (!pet) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PET_NOT_FOUND);
  }

  res.json(new ApiResponse(HTTP_STATUS.OK, pet));
});

export const getAllPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ userId: req.user.id });

  res.json(
    new ApiResponse(HTTP_STATUS.OK, pets, `Found ${pets.length} pet(s)`),
  );
});

export const updatePet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  const pet = await Pet.findOneAndUpdate(
    { _id: petId, userId: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!pet) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PET_NOT_FOUND);
  }

  res.json(new ApiResponse(HTTP_STATUS.OK, pet, "Pet updated successfully"));
});

export const deletePet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  const pet = await Pet.findOneAndDelete({
    _id: petId,
    userId: req.user.id,
  });

  if (!pet) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PET_NOT_FOUND);
  }

  res.json(new ApiResponse(HTTP_STATUS.OK, null, "Pet deleted successfully"));
});

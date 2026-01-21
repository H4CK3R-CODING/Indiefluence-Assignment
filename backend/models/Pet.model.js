
// ============================================
// src/models/Pet.model.js
// ============================================
import mongoose from 'mongoose';
import { PET_GENDERS } from '../config/constants.js';

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    petName: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxlength: [50, 'Pet name cannot exceed 50 characters']
    },
    breed: {
      type: String,
      trim: true,
      index: true
    },
    gender: {
      type: String,
      enum: {
        values: PET_GENDERS,
        message: 'Gender must be either Male or Female'
      }
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      // max: [50, 'Age seems unrealistic']
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      // max: [500, 'Weight seems unrealistic']
    },
    vaccinated: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound index for userId and breed searches
petSchema.index({ userId: 1, breed: 1 });

export default mongoose.model('Pet', petSchema);

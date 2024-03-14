import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 80,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
    },
    preferredLanguage: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const termCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const savedTermSchema = new mongoose.Schema(
  {
    termCollectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "TermCollection",
    },
    targetCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const TermCollection =
  mongoose.models.TermCollection ||
  mongoose.model("TermCollection", termCollectionSchema);
export const SavedTerm =
  mongoose.models.SavedTerm || mongoose.model("SavedTerm", savedTermSchema);

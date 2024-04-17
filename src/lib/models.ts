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
      default: "0",
    },
    providerId: {
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
    shared: {
      type: Boolean,
      default: false,
    },
    noDelete: {
      type: Boolean,
    },
    lastReview: {
      type: Date,
      default: Date.now,
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
    easiness: {
      type: Number,
      default: 2.5,
    },
    interval: {
      type: Number,
      default: 0,
    },
    repititions: {
      type: Number,
      default: 0,
    },
    nextReview: {
      type: Date,
      default: Date.now,
    },
    completedForSession: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    postContent: {
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
export const BlogPost =
  mongoose.models?.BlogPost || mongoose.model("BlogPost", blogPostSchema);

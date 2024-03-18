"use server";

import { signIn, signOut } from "./auth";
import { connectDB } from "./utils";
import { SavedTerm, TermCollection, User } from "./models";
import bcrypt from "bcryptjs";
import { CredentialsSignin } from "@auth/core/errors";
import { revalidatePath } from "next/cache";

// export const handleSearch = (formData: FormData) => {
//   console.log(formData);
//   const { searchTerm } = Object.fromEntries(formData);
//   redirect(`/search/${searchTerm}?translation=true&transLang=1`);
// };

export const handleGitHubLogin = async () => {
  await signIn("github");
};

export const handleLogout = async () => {
  await signOut();
};

export const registerUser = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const { username, email, password, passwordConfirmation } =
    Object.fromEntries(formData);

  if (!username || !email || !password || !passwordConfirmation) {
    return { error: true, errorMsg: "Must inclue all fields" };
  }

  if (password !== passwordConfirmation) {
    return { error: true, errorMsg: "Passwords do not match" };
  }

  try {
    connectDB();

    const user = await User.findOne({ username });

    if (user) {
      return { error: true, errorMsg: "Username already in use." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    const myTermsList = new TermCollection({
      userId: createdUser._id,
      name: "My Terms",
    });

    myTermsList.save();

    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("E11000")) {
      return { error: true, errorMsg: "Email already in use." };
    }
    return { error: true, errorMsg: "Something went wrong." };
  }
};

export const credentialsLogin = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const { username, password } = Object.fromEntries(formData);

  if (!username || !password) {
    return { error: true, errorMsg: "Please input username and password." };
  }

  try {
    await signIn("credentials", { username, password });
    return { success: true };
  } catch (err) {
    if (err instanceof CredentialsSignin && err?.code === "credentials") {
      return { error: true, errorMsg: "Invalid username or password" };
    }
    throw err;
  }
};

export const addTermToList = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  //Keep error messages short as they will appear on one line on front end.
  const { userId, targetCode } = Object.fromEntries(formData);

  if (!userId || !targetCode) {
    return {
      error: true,
      errorMsg: "Must submit userId and target_code.",
    };
  }

  const termCollection = await TermCollection.findOne({ userId });
  let termCollectionId = termCollection?._id || "";

  if (!termCollection) {
    const newCollection = await TermCollection.create({
      userId: userId,
      name: "My Terms",
    });
    termCollectionId = newCollection._id;
  }

  const existingTermCheck = await SavedTerm.findOne({
    termCollectionId,
    targetCode,
  });

  if (existingTermCheck) {
    return {
      error: true,
      errorMsg: "Already in collection",
    };
  }

  await SavedTerm.create({
    termCollectionId,
    targetCode,
  });

  return { success: true };
};

export const removeTermFromList = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  console.log(formData);

  const { termCollectionId, targetCode } = Object.fromEntries(formData);

  if (!termCollectionId || !targetCode) {
    throw new Error("Must submit termCollectionId and target_code");
  }

  const deletedTerm = await SavedTerm.findOneAndDelete({
    termCollectionId,
    targetCode,
  });

  if (!deletedTerm) {
    return {
      error: true,
      errorMsg: "Term not found",
    };
  }

  revalidatePath(`/userpage/collection/${termCollectionId}`);

  return { success: true };
};

"use server";

import { signIn, signOut } from "./auth";
import { connectDB } from "./dbUtils";
import { SavedTerm, TermCollection, User } from "./models";
import bcrypt from "bcryptjs";
import { CredentialsSignin } from "@auth/core/errors";
import { revalidatePath } from "next/cache";
import { addIntervalToDate } from "./utils";
import {
  startNewStudySession,
  updateManySavedTerms,
  updateSavedTerm,
  updateTermCollection,
} from "./dbData";

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
      noDelete: true,
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
  try {
    connectDB();
    //Keep error messages short as they will appear on one line on front end.
    const { userId, targetCode, termCollectionId } =
      Object.fromEntries(formData);

    if (!userId || !targetCode || !termCollectionId) {
      return {
        error: true,
        errorMsg: "Must submit userId, target code, and term collection ID.",
      };
    }

    const termCollection = await TermCollection.findOne({
      _id: termCollectionId,
    });

    if (!termCollection) {
      return {
        error: true,
        errorMsg: "Collection not found",
      };
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

    revalidatePath(`/userpage/collection/${termCollectionId}`);

    return { success: true };
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const removeTermFromList = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  try {
    connectDB();

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
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const createNewTermCollection = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  try {
    connectDB();

    const { userId, collectionName } = Object.fromEntries(formData);

    console.log(collectionName);

    if (!collectionName) {
      return {
        error: true,
        errorMsg: "Must submit name.",
      };
    }

    if (!userId) {
      return {
        error: true,
        errorMsg: "Must submit user ID.",
      };
    }

    const createdList = await TermCollection.create({
      userId,
      name: collectionName,
    });

    if (!createdList) {
      return {
        error: true,
        errorMsg: "Failed to create List",
      };
    }
    revalidatePath("/userpage");

    return { success: true };
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const deleteCollection = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  try {
    connectDB();

    const { termCollectionId, userId } = Object.fromEntries(formData);

    if (!termCollectionId) {
      return {
        error: true,
        errorMsg: "Must submit collection ID",
      };
    }

    if (!userId) {
      return {
        error: true,
        errorMsg: "Must user ID",
      };
    }

    const termCollection = await TermCollection.findById(termCollectionId);

    if (!termCollection) {
      return {
        error: true,
        errorMsg: "Error. Collection not found.",
      };
    }

    if (termCollection?.noDelete) {
      return {
        error: true,
        errorMsg: "Error. This collection cannot be deleted.",
      };
    }

    if (termCollection.userId.toString() !== userId) {
      return {
        error: true,
        errorMsg: "Error. Cannot delete another user's collection.",
      };
    }

    const deletedCollection = await TermCollection.findByIdAndDelete(
      termCollectionId
    );

    if (!deletedCollection) {
      return {
        error: true,
        errorMsg: "Something went wrong.",
      };
    }

    revalidatePath("/userpage");

    return { success: true };
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const startNewStudySessionAction = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const termCollectionId = formData.get("termCollectionId") as string;

  await startNewStudySession(termCollectionId);

  return { success: true };
};

export const assessUserStudyResponse = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const { formTerm, formResponseQuality } = Object.fromEntries(formData);

  const term: SavedTermResponse = JSON.parse(formTerm as string);
  const responseQuality = parseInt(formResponseQuality as string);

  //Increase the number of times a flashcard has been viewed
  term.repititions += 1;

  //Create repition interval for n-th repetition in days
  let interval;
  if (term.repititions === 1) {
    interval = 1;
  } else if (term.repititions === 2) {
    interval = 6;
  } else {
    //If interval is a fraction, round it up to the nearest integer.
    interval = Math.ceil(term.interval * term.easiness);
  }

  //Calculate updated easiness
  let updatedEasiness =
    term.easiness +
    (0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.2));

  //Min allowable easiness is 1.3
  if (updatedEasiness < 1.3) {
    updatedEasiness = 1.3;
  }

  //If response lower than 3, start repiritions from beginning without changing easiness
  //Else modify the easiness to updated
  if (responseQuality < 3) {
    interval = 1;
    term.repititions = 1;
  } else {
    term.easiness = updatedEasiness;
  }

  term.interval = interval;
  //Update review date
  term.nextReview = addIntervalToDate(interval);
  term.completedForSession = responseQuality > 4;

  //Update db
  const updatedTerm = await updateSavedTerm(term._id, term);

  //Check for successful update
  if (!updatedTerm) {
    return {
      error: true,
      errorMsg: "Something went wrong.",
    };
  }

  return { success: true };
};

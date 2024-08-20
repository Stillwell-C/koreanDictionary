"use server";

import { signIn, signOut } from "./auth";
import { connectDB } from "./dbUtils";
import { SavedTerm, TermCollection, User } from "./models";
import bcrypt from "bcryptjs";
import { CredentialsSignin } from "@auth/core/errors";
import { revalidatePath } from "next/cache";
import { addIntervalToDate } from "./utils";
import {
  addTermToCollection,
  createFirstTermCollection,
  createNewUserWithCredentials,
  createTermCollection,
  deleteTermCollection,
  getSavedTermFromCollection,
  getTermCollection,
  getUserByUsername,
  increaseTodaysCards,
  removeAllTermsFromCollection,
  removeTermFromCollection,
  startNewStudySession,
  updateManySavedTerms,
  updateSavedTerm,
  updateTermCollection,
} from "./dbData";
import { redirect } from "next/navigation";

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

/**
 * Register a new user
 * @param {FormStateType} prevState
 * @param {username: string, email: string, password: string, passwordConfirmation: string} formData
 * @returns {FormStateType}
 */
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
    const user = await getUserByUsername(username as string);

    if (user) {
      return { error: true, errorMsg: "Username already in use." };
    }

    const createdUser = await createNewUserWithCredentials(
      username as string,
      email as string,
      password as string
    );

    await createFirstTermCollection(createdUser._id);

    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("E11000")) {
      return { error: true, errorMsg: "Email already in use." };
    }
    return { error: true, errorMsg: "Something went wrong." };
  }
};

/**
 * Sign in user with username and password
 * @param {FormStateType} prevState
 * @param {username: string, password: string} formData
 * @returns {FormStateType}
 */
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

/**
 * Add term to one of user's collections
 * TODO: Possibly add function to check if target code is valid.
 * @param {FormStateType} prevState
 * @param { userId: string, targetCode: string, termCollectionId:string } formData
 * @returns {FormStateType}
 */
export const addTermToList = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  try {
    //Keep error messages short as they will appear on one line on front end.
    const { userId, targetCode, termCollectionId } =
      Object.fromEntries(formData);

    if (!userId || !targetCode || !termCollectionId) {
      return {
        error: true,
        errorMsg: "Must submit userId, target code, and term collection ID.",
      };
    }

    const termCollection = await getTermCollection(termCollectionId as string);

    if (!termCollection) {
      return {
        error: true,
        errorMsg: "Collection not found",
      };
    }

    const existingTermCheck = await getSavedTermFromCollection(
      termCollectionId as string,
      targetCode as string
    );

    if (existingTermCheck) {
      return {
        error: true,
        errorMsg: "Already in collection",
      };
    }

    await addTermToCollection(termCollectionId as string, targetCode as string);

    revalidatePath(`/userpage/collection/${termCollectionId}`);

    return { success: true };
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

/**
 * Remove term from user's collection
 * @param {FormStateType} prevState
 * @param { termCollectionId: string, targetCode: string } formData
 * @returns {FormStateType}
 */
export const removeTermFromList = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  try {
    const { termCollectionId, targetCode } = Object.fromEntries(formData);

    if (!termCollectionId || !targetCode) {
      throw new Error("Must submit termCollectionId and target_code");
    }

    const deletedTerm = await removeTermFromCollection(
      termCollectionId as string,
      targetCode as string
    );

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

/**
 * Create a new user collection
 * @param {FormStateType} prevState
 * @param { userId: string, collectionName: string } formData
 * @returns {FormStateType}
 */
export const createNewTermCollection = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  try {
    const { userId, collectionName } = Object.fromEntries(formData);

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

    const createdList = await createTermCollection(
      userId as string,
      collectionName as string
    );

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

/**
 * Remove a term collection
 * @param {FormStateType} prevState
 * @param { termCollectionId: string, userId: string } formData
 * @returns {FormStateType}
 */
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

    //Delete collection
    const deletedCollection = await deleteTermCollection(
      termCollectionId as string,
      userId as string
    );

    if (!deletedCollection) {
      return {
        error: true,
        errorMsg: "Something went wrong.",
      };
    }

    //Delete all terms from collection
    await removeAllTermsFromCollection(termCollectionId as string);

    revalidatePath("/userpage");

    return { success: true };
  } catch (err) {
    //The following error messages originate from deleteTermCollection in @/lib/dbData.ts
    if (err instanceof Error && err.message === "collection not found") {
      return {
        error: true,
        errorMsg: "Error. Collection not found.",
      };
    } else if (
      err instanceof Error &&
      err.message === "collection cannot be deleted"
    ) {
      return {
        error: true,
        errorMsg: "Error. This collection cannot be deleted.",
      };
    } else if (err instanceof Error && err.message === "unauthorized request") {
      return {
        error: true,
        errorMsg: "Error. Unauthorized request.",
      };
    } else {
      return {
        error: true,
        errorMsg: "Error. Unauthorized request.",
      };
    }
  }
};

export const increaseTodaysCardsAction = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const termCollectionId = formData.get("termCollectionId") as string;

  await increaseTodaysCards(termCollectionId);

  return { success: true };
};

export const assessUserStudyResponse = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const { formTerm, formResponseQuality } = Object.fromEntries(formData);

  const term: SavedTermResponse = JSON.parse(formTerm as string);
  const responseQuality = parseInt(formResponseQuality as string);

  //Create repetition interval for n-th repetition in days
  let interval: number;

  if (responseQuality >= 3) {
    //Calculate & update updated easiness
    //Min allowable easiness is 1.3
    let updatedEasiness =
      term.easiness +
      (0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.2));

    if (updatedEasiness < 1.3) {
      updatedEasiness = 1.3;
    }

    term.easiness = updatedEasiness;

    //Increase the number of times a flashcard has been viewed
    term.repititions += 1;

    //Calculate updated card interval
    if (term.repititions === 1) {
      interval = 1;
    } else if (term.repititions === 2) {
      interval = 2;
    } else {
      //If interval is a fraction, round it up to the nearest integer.
      interval = Math.ceil(term.interval * term.easiness);
    }
  } else {
    //If response quality is lower than 3, start repetitions from beginning without changing easiness
    interval = 0;
    term.repititions = 0;
  }

  term.interval = interval;
  //Update review date
  term.nextReview = addIntervalToDate(interval);
  //Continue reviewing card if quality lower than 4
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

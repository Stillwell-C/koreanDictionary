import { connectDB } from "./dbUtils";
import { FailedToFetchError } from "./exceptions";
import { BlogPost, SavedTerm, TermCollection, User } from "./models";
import bcrypt from "bcryptjs";

//USERS & AUTHENTICATION

/**
 * Find user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
export const getUserByUsername = async (username: string) => {
  connectDB();

  return await User.findOne({ username });
};

/**
 * Encrypt password with Bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password as string, salt);
};

/**
 * Creates new user with the following credentials
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const createNewUserWithCredentials = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    connectDB();

    const hashedPassword = await encryptPassword(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

//TERM COLLECTIONS

/**
 * Creates a user's initial term collection called "My Terms",
 * which cannot be deleted
 * @param {string} userId
 * @returns {Promise<TermCollection>}
 */
export const createFirstTermCollection = async (userId: string) => {
  try {
    connectDB();

    const myTermsList = new TermCollection({
      userId,
      name: "My Terms",
      noDelete: true,
    });

    await myTermsList.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

/**
 * Create a user term collection
 * @param {string} userId
 * @param {string} name
 * @returns
 */
export const createTermCollection = async (userId: string, name: string) => {
  if (!userId || !name) {
    throw new Error("Must provide a user ID and collection name.");
  }

  try {
    connectDB();

    return await TermCollection.create({
      userId,
      name,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

/**
 * Get single term collection by its ID
 * @param {string} termCollectionId
 * @returns
 */
export const getTermCollection = async (termCollectionId: string) => {
  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  try {
    connectDB();

    const termCollection = await TermCollection.findOne({
      _id: termCollectionId,
    });

    return termCollection;
  } catch (err) {
    throw new FailedToFetchError();
  }
};

/**
 * Get a multiple collections for a user
 * Returns a paginated list
 * Start dictates start of page
 * Results dictates number of results per page
 * @param {string} userId
 * @param {string} start
 * @param {string} results
 * @returns
 */
export const getTermCollections = async (
  userId: string,
  start: string = "1",
  results: string = "10"
) => {
  const startNum = parseInt(start);
  const resultsNum = parseInt(results);
  const skipNum = (startNum - 1) * resultsNum;

  if (!userId) {
    throw new Error("User ID must be provided");
  }

  try {
    connectDB();

    const termCollections = await TermCollection.find({ userId })
      .limit(resultsNum)
      .skip(skipNum)
      .select("_id name")
      .sort("-updatedAt");

    const termCollectionsTotal = await TermCollection.countDocuments({
      userId,
    });

    return {
      results: termCollections,
      searchData: {
        total: termCollectionsTotal.toString(),
        start,
        num: results,
      },
    };
  } catch (err) {
    throw new FailedToFetchError();
  }
};

/**
 * Delete a user's term collection
 * Function checks to confirm that requesting user is the owner before deletion
 * @param {string} termCollectionId
 * @param {string} userId
 * @returns
 */
export const deleteTermCollection = async (
  termCollectionId: string,
  userId: string
) => {
  try {
    connectDB();

    const termCollection = await getTermCollection(termCollectionId);

    /**
     * ! - DO NOT CHANGE THE FOLLOWING ERROR MESSAGES UNLESS ALSO UPDATING FUNCTIONS USING THIS FUNCTION.
     * This is to ensure error messages are handled correctly
     */
    if (!termCollection) {
      throw new Error("collection not found");
    }

    if (termCollection?.noDelete) {
      throw new Error("collection cannot be deleted");
    }

    if (termCollection.userId.toString() !== userId) {
      throw new Error("unauthorized request");
    }

    return await TermCollection.findByIdAndDelete(termCollectionId);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

//TERMS

/**
 * Returns a saved term from a given collection
 * @param {string} termCollectionId
 * @param {string} targetCode
 * @returns {SavedTermResponse || Null}
 */
export const getSavedTermFromCollection = async (
  termCollectionId: string,
  targetCode: string
) => {
  connectDB();

  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  if (!targetCode) {
    throw new Error("Term target code must be provided");
  }

  try {
    return await SavedTerm.findOne({
      termCollectionId,
      targetCode,
    });
  } catch (err) {
    throw new FailedToFetchError();
  }
};

/**
 * Adds target code to specified term collection
 * @param {string} termCollectionId
 * @param {string} targetCode
 * @returns
 */
export const addTermToCollection = async (
  termCollectionId: string,
  targetCode: string
) => {
  connectDB();

  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  if (!targetCode) {
    throw new Error("Term target code must be provided");
  }

  try {
    return await SavedTerm.create({
      termCollectionId,
      targetCode,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

/**
 * Removes target code from specified term collection
 * @param {string} termCollectionId
 * @param {string} targetCode
 * @returns
 */
export const removeTermFromCollection = async (
  termCollectionId: string,
  targetCode: string
) => {
  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  if (!targetCode) {
    throw new Error("Term target code must be provided");
  }

  try {
    connectDB();
    return await SavedTerm.findOneAndDelete({
      termCollectionId,
      targetCode,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

/**
 * Remove all terms saved under specified termCollectionId from database
 * @param {string} termCollectionId
 * @returns
 */
export const removeAllTermsFromCollection = async (
  termCollectionId: string
) => {
  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  try {
    connectDB();

    return await SavedTerm.deleteMany({ termCollectionId });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    return err;
  }
};

export const getSavedTerms = async (
  termCollectionId: string,
  start: string = "1",
  results: string = "10"
) => {
  connectDB();
  const startNum = parseInt(start);
  const resultsNum = parseInt(results);
  const skipNum = (startNum - 1) * resultsNum;

  if (!termCollectionId) {
    throw new Error("term collection ID must be provided");
  }

  try {
    const savedTerms: SavedTermResponse[] = await SavedTerm.find({
      termCollectionId,
    })
      .limit(resultsNum)
      .skip(skipNum)
      .select("_id targetCode")
      .sort("-createdAt")
      .populate("termCollectionId", "name -_id");

    const savedTermsTotal = await SavedTerm.countDocuments({
      termCollectionId,
    });

    return {
      results: savedTerms,
      searchData: {
        total: savedTermsTotal.toString(),
        start,
        num: results,
      },
    };
  } catch (err) {
    throw new FailedToFetchError();
  }
};

export const getAllSavedTerms = async (termCollectionId: string) => {
  if (!termCollectionId) {
    throw new Error("term collection ID must be provided");
  }

  try {
    connectDB();
    const savedTerms = await SavedTerm.find({
      termCollectionId,
    })
      .select("_id targetCode")
      .sort("-createdAt");
    const savedTermsTotal = await SavedTerm.countDocuments({
      termCollectionId,
    });

    return savedTerms;
  } catch (err) {
    throw new Error("Failed to fetch terms");
  }
};

export const getSavedTermForStudy = async (
  termCollectionId: string,
  start: string
) => {
  connectDB();
  const startNum = parseInt(start);
  const skipNum = startNum - 1;

  if (!termCollectionId) {
    throw new Error("term collection ID must be provided");
  }

  try {
    const savedTerm: SavedTermResponse = await SavedTerm.findOne({
      termCollectionId,
      completedForSession: false,
    })
      .sort("nextReview")
      .limit(1);

    const savedTermsTotal = await SavedTerm.countDocuments({
      termCollectionId,
      completedForSession: false,
    });

    return {
      results: savedTerm,
      searchData: {
        total: savedTermsTotal.toString(),
        start,
        num: 1,
      },
    };
  } catch (err) {
    throw new FailedToFetchError();
  }
};

export const updateTermCollection = async (
  termCollectionId: string,
  updatedCollectionData: TermCollection | Partial<TermCollection>
) => {
  try {
    connectDB();

    return await TermCollection.findOneAndUpdate(
      { _id: termCollectionId },
      updatedCollectionData
    );
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const updateSavedTerm = async (
  termId: string,
  updatedTermData: SavedTermResponse | Partial<SavedTermResponse>
) => {
  //Update db
  try {
    connectDB();

    return await SavedTerm.findOneAndUpdate({ _id: termId }, updatedTermData);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const updateManySavedTerms = async (
  termData: SavedTermResponse | Partial<SavedTermResponse>,
  updatedTermData: SavedTermResponse | Partial<SavedTermResponse>
) => {
  //Update db
  try {
    connectDB();

    return await SavedTerm.updateMany(termData, updatedTermData);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const updateTodaysStudyTerms = async (termCollectionId: string) => {
  //Get date corresponding to the next 24 hours
  const fullDayTime = new Date().getTime() + 24 * 60 * 60 * 1000;

  try {
    connectDB();

    //Will only apply to cards due within the next 24 hours
    return await SavedTerm.updateMany(
      { termCollectionId, nextReview: { $lte: fullDayTime } },
      { completedForSession: false }
    );
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const checkStudySession = async (
  termCollectionId: string,
  timeZone?: string
) => {
  try {
    connectDB();

    const { lastReview } = await TermCollection.findById(
      termCollectionId
    ).select("lastReview");

    const currentDate = new Date();

    //Check if last review occurred more than 24 hours ago
    if (currentDate.getTime() - lastReview > 24 * 60 * 60 * 1000) {
      await startNewStudySession(termCollectionId);
    } else if (timeZone) {
      //If less than 24 hours, check to see if day has changed for user
      const userLocalDate = new Date(
        currentDate.toLocaleString("en-US", { timeZone })
      );
      const lastReviewLocalDate = new Date(
        currentDate.toLocaleString("en-US", { timeZone })
      );

      const dateDiff = lastReviewLocalDate.getDate() - userLocalDate.getDate();
      const monthDiff =
        lastReviewLocalDate.getMonth() > userLocalDate.getMonth();

      // If session happened less than 24 hours ago, but date/month is different & it is past 3 a.m. on following date, start new session
      if ((dateDiff || monthDiff) && userLocalDate.getHours() >= 3) {
        await startNewStudySession(termCollectionId);
      }
    }

    //If a timezone has been submitted, see if session was from previous day
    if (timeZone) {
    } else {
      //If no timezone is submitted fallback to this
    }
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const startNewStudySession = async (termCollectionId: string) => {
  //Update last review to current time
  const currentDate = new Date().getTime();
  const updatedCollection = await updateTermCollection(termCollectionId, {
    lastReview: currentDate,
  });

  //clear all terms from past sessions
  await updateManySavedTerms(
    { termCollectionId, completedForSession: false },
    { completedForSession: true }
  );

  await updateTodaysStudyTerms(termCollectionId);
};

//TODO make separate function to increase review number to specific number of cards
export const increaseTodaysCards = async (
  termCollectionId: string,
  cardLimit: number = 50
) => {
  //clear all terms from past sessions
  await updateManySavedTerms(
    { termCollectionId, completedForSession: false },
    { completedForSession: true }
  );

  try {
    connectDB();

    await SavedTerm.updateMany(
      { termCollectionId },
      { completedForSession: false }
    )
      .sort("-nextReview")
      .limit(cardLimit);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

//Get title, thumbnail, and id for each blog post
//Allows for pagination, but not currently implemented on blog page
export const getBlogPostsInfo = async (
  start: string = "1",
  results: string = "10"
) => {
  connectDB();
  const startNum = parseInt(start);
  const resultsNum = parseInt(results);
  const skipNum = (startNum - 1) * resultsNum;
  try {
    const blogPostsInfo: BlogPostData[] = await BlogPost.find()
      .limit(resultsNum)
      .skip(skipNum)
      .select("_id thumbnail title updatedAt")
      .sort("-updatedAt");
    const blogPostTotal = await BlogPost.countDocuments();

    return {
      results: blogPostsInfo,
      searchData: {
        total: blogPostTotal.toString(),
        start,
        num: results,
      },
    };
  } catch (err) {
    throw new FailedToFetchError();
  }
};

export const getAllBlogPostIds = async () => {
  connectDB();
  try {
    const blogPostIds: { _id: string }[] = await BlogPost.find()
      .select("_id")
      .sort("-updatedAt");

    return blogPostIds;
  } catch (err) {
    throw new FailedToFetchError();
  }
};

//Get all data from single blog post
export const getBlogPost = async (id: string) => {
  connectDB();

  try {
    const blogPost: BlogPost | null = await BlogPost.findById(id);

    return blogPost;
  } catch (err) {
    throw new FailedToFetchError();
  }
};

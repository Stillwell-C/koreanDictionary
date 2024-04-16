import { connectDB } from "./dbUtils";
import { FailedToFetchError } from "./exceptions";
import { BlogPost, SavedTerm, TermCollection } from "./models";
import { addIntervalToDate } from "./utils";

export const getTermCollection = async (termCollectionId: string) => {
  connectDB();
  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  try {
    const termCollection = await TermCollection.findOne({
      _id: termCollectionId,
    });

    return termCollection;
  } catch (err) {
    throw new FailedToFetchError();
  }
};

export const getTermCollections = async (
  userId: string,
  start: string = "1",
  results: string = "10"
) => {
  connectDB();
  const startNum = parseInt(start);
  const resultsNum = parseInt(results);
  const skipNum = (startNum - 1) * resultsNum;

  if (!userId) {
    throw new Error("User ID must be provided");
  }

  try {
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
    // return {
    //   results: [],
    //   searchData: {
    //     total: "0",
    //     start: "1",
    //     num: "0",
    //   },
    // };
    throw new FailedToFetchError();
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
    const savedTerms: SavedTermResponse[] = await SavedTerm.find({
      termCollectionId,
      completedForSession: false,
    })
      .limit(1)
      .skip(skipNum)
      .select("_id targetCode")
      .sort("-createdAt")
      .populate("termCollectionId", "name -_id");

    const savedTermsTotal = await SavedTerm.countDocuments({
      termCollectionId,
      completedForSession: false,
    });

    return {
      results: savedTerms[0],
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

export const createTermCollection = async (userId: string, name: string) => {
  if (!userId || !name) {
    throw new Error("Must provide a user ID and collection name.");
  }

  return await TermCollection.create({
    userId,
    name,
  });
};

export const updateSavedTerm = async (
  term: SavedTermResponse,
  responseQuality: number
) => {
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
  try {
    connectDB();

    await SavedTerm.findOneAndUpdate({ _id: term._id }, term);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const checkStudySession = async (termCollectionId: string) => {
  try {
    connectDB();

    const currentDate = new Date().getDate();
    const { lastReview } = await TermCollection.findById(
      termCollectionId
    ).select("lastReview");

    // if (currentDate - lastReview > 86400000) {
    //   startNewStudySession(termCollectionId);
    // }
    startNewStudySession(termCollectionId);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const startNewStudySession = async (termCollectionId: string) => {
  try {
    connectDB();

    //update last review to current time
    const currentDate = new Date();
    await TermCollection.findOneAndUpdate(
      { _id: termCollectionId },
      { lastReview: currentDate }
    );

    //clear all terms from past sessions
    await SavedTerm.updateMany(
      { termCollectionId, completedForSession: false },
      { completedForSession: true }
    );

    //Select terms for new session
    //TODO: add way to select length for this
    await SavedTerm.updateMany(
      { termCollectionId },
      { completedForSession: false }
    );
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

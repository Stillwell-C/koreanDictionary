import { connectDB } from "./dbUtils";
import { FailedToFetchError } from "./exceptions";
import { BlogPost, SavedTerm, TermCollection } from "./models";

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
    const savedTerms = await SavedTerm.find({
      termCollectionId,
    })
      .limit(resultsNum)
      .skip(skipNum)
      .select("_id targetCode")
      .sort("-createdAt");
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

export const createTermCollection = async (userId: string, name: string) => {
  if (!userId || !name) {
    throw new Error("Must provide a user ID and collection name.");
  }

  return await TermCollection.create({
    userId,
    name,
  });
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

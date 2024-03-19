import * as cheerio from "cheerio";
import { SavedTerm, TermCollection } from "./models";

export const searchWord = async (
  word: string,
  translation?: string,
  transLanguage?: string,
  start?: string
) => {
  const res = await fetch(
    `https://krdict.korean.go.kr/api/search?key=${
      process.env.API_KEY
    }&q=${word}${
      translation ? `&translated=y&trans_lang=${transLanguage}` : ""
    }${start ? `&start=${start}` : ""}`
  );

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  const resText = await res.text();

  const results: SearchResultItem[] = [];

  const $ = cheerio.load(resText, { xmlMode: true });
  const total = $("total").text();
  const startPos = $("start").text();
  const num = $("num").text();
  const items = $("item");
  items.each((i, item) => {
    const targetCode = $(item).find("target_code").text();
    const word = $(item).find("word").text();
    const origin = $(item).find("origin").text();
    const pronunciation = $(item).find("pronunciation").text();
    const wordGrade = $(item).find("word_grade").text();
    const pos = $(item).find("pos").text();
    const link = $(item).find("link").text();
    const sense = $(item).find("sense");
    const definitions: SearchDefinition[] = [];
    sense.each((i, senseEntry) => {
      const korean = $(senseEntry).find("definition").text();
      const transLang = $(item)
        .find("translation trans_lang")
        .first()
        .text()
        .trim();
      const transWord = $(senseEntry).find("translation trans_word").text();
      const transDfn = $(senseEntry).find("translation trans_dfn").text();
      definitions.push({
        korean,
        translation: { transWord, transDfn, transLang },
      });
    });
    results.push({
      word,
      targetCode,
      definitions,
      origin,
      pronunciation,
      wordGrade,
      pos,
      link,
    });
  });

  return { results, searchData: { total, start: startPos, num } };
};

export const getTermData = async (
  target_code: string,
  translation?: string,
  transLanguage?: string
) => {
  const res = await fetch(
    `https://krdict.korean.go.kr/api/view?key=${
      process.env.API_KEY
    }&method=target_code&q=${target_code}${
      translation ? `&translated=y&trans_lang=${transLanguage}` : ""
    }`
  );

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  const resText = await res.text();

  const $ = cheerio.load(resText, { xmlMode: true });
  const targetCode = $("target_code").text();
  const wordInfo = $("word_info");
  const word = $(wordInfo).find("word").first().text();
  const wordUnit = $(wordInfo).find("word_unit").text();
  const pos = $(wordInfo).find("pos").first().text();
  const wordType = $(wordInfo).find("word_type").text();
  const wordGrade = $(wordInfo).find("word_grade").text();
  const originalLanguage = {
    originalLanguage: $(wordInfo)
      .find("original_language_info > original_language")
      .text(),
    originalLanguageType: $(wordInfo)
      .find("original_language_info > language_type")
      .text(),
  };
  const pronunciationInfo = {
    pronunciation: $(wordInfo)
      .find("pronunciation_info > pronunciation")
      .first()
      .text(),
    pronunciationLink: $(wordInfo).find("pronunciation_info > link").text(),
  };
  const derivatives = $(wordInfo).find("der_info");
  const derivativesData: TermDataDerivativeType[] = [];
  derivatives.each((i, item) => {
    const word = $(item).find("word").text();
    const targetCode = $(item).find("link_target_code").text();
    const link = $(item).find("link").text();
    derivativesData.push({ word, targetCode, link });
  });
  const categoryInfo = {
    type: $(wordInfo).find("category_info > type").text(),
    written_form: $(wordInfo).find("category_info > written_form").text(),
  };
  const senseInfo = $(wordInfo).find("sense_info");
  const definitionAndExamples: TermDataDefinitionAndExamples[] = [];
  senseInfo.each((i, item) => {
    const definition = $(item).find("definition").text();
    const translation = {
      transLang: $(item).find("translation > trans_lang").text().trim(),
      transWord: $(item).find("translation > trans_word").text(),
      transDfn: $(item).find("translation > trans_dfn").text(),
    };
    const examples: TermDataExampleType[] = [];
    const exampleInfo = $(item).find("example_info");
    exampleInfo.each((i, item) => {
      const type = $(item).find("type").text();
      const example = $(item).find("example").text();
      examples.push({ type, example });
    });
    definitionAndExamples.push({ definition, translation, examples });
  });

  return {
    targetCode,
    word,
    wordUnit,
    pos,
    wordType,
    wordGrade,
    originalLanguage,
    pronunciationInfo,
    derivativesData,
    categoryInfo,
    definitionAndExamples,
  };
};

export const getTermCollection = async (termCollectionId: string) => {
  if (!termCollectionId) {
    throw new Error("Term collection ID must be provided");
  }

  try {
    const termCollection = await TermCollection.findOne({
      _id: termCollectionId,
    });

    return termCollection;
  } catch (err) {
    throw new Error("Failed to fetch collection");
  }
};

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
    throw new Error("Failed to fetch collections");
  }
};

export const getSavedTerms = async (
  termCollectionId: string,
  start: string = "1",
  results: string = "10"
) => {
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
    throw new Error("Failed to fetch terms");
  }
};

export const getAllSavedTerms = async (termCollectionId: string) => {
  if (!termCollectionId) {
    throw new Error("term collection ID must be provided");
  }

  try {
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

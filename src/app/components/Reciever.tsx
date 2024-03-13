"use client";
import { parse } from "node-html-parser";
import * as cheerio from "cheerio";

type Props = {
  data: TermDataResult;
};

const Reciever = ({ data }: Props) => {
  console.log(data);
  // const parsedData = new DOMParser().parseFromString(html, "text/xml");
  // console.log(parsedData);

  // const $ = cheerio.load(html, { xmlMode: true });
  // const targetCode = $("target_code").text();
  // const wordInfo = $("word_info");
  // const word = $(wordInfo).find("word").first().text();
  // const wordUnit = $(wordInfo).find("word_unit").text();
  // const pos = $(wordInfo).find("pos").first().text();
  // const wordType = $(wordInfo).find("word_type").text();
  // const wordGrade = $(wordInfo).find("word_grade").text();
  // const originalLanguage = {
  //   originalLanguage: $(wordInfo)
  //     .find("original_language_info > original_language")
  //     .text(),
  //   originalLanguageType: $(wordInfo)
  //     .find("original_language_info > language_type")
  //     .text(),
  // };
  // const pronunciationInfo = {
  //   pronunciation: $(wordInfo)
  //     .find("pronunciation_info > pronunciation")
  //     .text(),
  //   pronunciationLink: $(wordInfo).find("pronunciation_info > link").text(),
  // };
  // const derivatives = $(wordInfo).find("der_info");
  // const derivativesData = [];
  // derivatives.each((i, item) => {
  //   const word = $(item).find("word").text();
  //   const targetCode = $(item).find("link_target_code").text();
  //   const link = $(item).find("link").text();
  //   derivativesData.push({ word, targetCode, link });
  // });
  // const categoryInfo = {
  //   type: $(wordInfo).find("category_info > type").text(),
  //   written_form: $(wordInfo).find("category_info > written_form").text(),
  // };
  // const senseInfo = $(wordInfo).find("sense_info");
  // const definitionAndExamples = [];
  // senseInfo.each((i, item) => {
  //   const definition = $(item).find("definition").text();
  //   const translation = {
  //     transLang: $(item).find("translation > trans_lang").text().trim(),
  //     transWord: $(item).find("translation > trans_word").text(),
  //     transDfn: $(item).find("translation > trans_dfn").text(),
  //   };
  //   const examples = [];
  //   const exampleInfo = $(item).find("example_info");
  //   exampleInfo.each((i, item) => {
  //     const type = $(item).find("type").text();
  //     const example = $(item).find("example").text();
  //     examples.push({ type, example });
  //   });
  //   definitionAndExamples.push({ definition, translation, examples });
  // });

  // console.log({
  //   targetCode,
  //   word,
  //   wordUnit,
  //   pos,
  //   wordType,
  //   wordGrade,
  //   originalLanguage,
  //   pronunciationInfo,
  //   derivativesData,
  //   categoryInfo,
  //   definitionAndExamples,
  // });

  //   const items = parsedData.getElementsByTagName("item");
  //   for (const item in items) {
  //     console.log(items[item]);
  //   }

  // const itemsData = [];

  // const $ = cheerio.load(html, { xmlMode: true });
  // const items = $("item");
  // items.each((i, item) => {
  //   const targetCode = $(item).find("target_code").text();
  //   const word = $(item).find("word").text();
  //   const origin = $(item).find("origin").text();
  //   const pronunciation = $(item).find("pronunciation").text();
  //   const wordGrade = $(item).find("word_grade").text();
  //   const pos = $(item).find("pos").text();
  //   const link = $(item).find("link").text();
  //   const sense = $(item).find("sense");
  //   const definitions = [];
  //   sense.each((i, senseEntry) => {
  //     const korean = $(senseEntry).find("definition").text();
  //     const englishWord = $(senseEntry).find("translation trans_word").text();
  //     const englishDfn = $(senseEntry).find("translation trans_dfn").text();
  //     definitions.push({ korean, english: { englishWord, englishDfn } });
  //   });
  //   itemsData.push({
  //     word,
  //     targetCode,
  //     definitions,
  //     origin,
  //     pronunciation,
  //     wordGrade,
  //     pos,
  //     link,
  //   });
  // });
  // console.log(itemsData);
  return <div>Reciever</div>;
};

export default Reciever;

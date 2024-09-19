import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const template = `Your job is to add context to parsed Korean sentences.

You will be given an array of words from a parsed sentence that includes the text and its part of speech.
Parsed Sentence: {parsedSentence}

You will also be given a translation of the sentence.
Translated Sentence: {translatedSentence}

For each entry in the parsed sentence array, add a field called meaning_in_english and give a meaning in English. 

Return as valid JSON, not a code block. Only use 1 set of quotations. The JSON should contain an array with the key of "parsed" which includes all of the data you parsed.

`;

//Removed, but can add in if issues with creating dictionary_form
//Then add a field called dictionary_form and provide the dictionary form for each word.

export const POST = async (req: Request) => {
  try {
    const { translatedSentence, parsedSentence } = await req.json();

    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.5,
    });

    const parser = new StringOutputParser();

    const chain = RunnableSequence.from([
      {
        translatedSentence: () => translatedSentence,
        parsedSentence: () => parsedSentence,
      },
      prompt,
      model,
      parser,
    ]);

    const result = await chain.invoke({
      parsedSentence: parsedSentence,
      translatedSentence: translatedSentence,
    });

    const parsedResult = JSON.parse(result);

    try {
      return NextResponse.json(parsedResult);
    } catch (e: any) {
      return NextResponse.json(result);
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
};

import { NextResponse } from "next/server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  try {
    const { sentenceQuery, grammarArray } = await req.json();

    const prompt = `
    I am going to give you a sentence in Korean and an array of possible grammar points that may or may not be in the sentence. 
    
    Look at the sentence and the list of grammars and return an array of booleans showing whether or not the grammar points exist. Use the description field of each grammar point to help inform whether the grammar is in the sentence.
    
    It is okay if the grammar has another type of grammar added on to it. For instance, -에는 can match with -에

    Here is the sentence it is from: ${sentenceQuery}

    Here is the grammar array: ${JSON.stringify(grammarArray)}

    Do not wrap in quotation marks.
    `;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.1,
    });

    return NextResponse.json({ grammar: text });
  } catch (e: any) {
    console.log(e.message);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
};

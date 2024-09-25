import { NextResponse } from "next/server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  try {
    const { component, sentenceQuery } = await req.json();

    if (!component || !sentenceQuery) {
      return NextResponse.json({ meaning: "" });
    }

    const prompt = `I need you to translate something from a Korean sentence.

    Here is the sentence it is from: ${sentenceQuery}

    The text I want you to translate is ${component.text}. It's starting index in the Korean sentence is ${component.start} and it's ending index is ${component.end}. Here is it's part of speech ${component.detailed_POS}.

    Please give me a short translation. Do not give an explanation. In the case of grammar such as a particle or sentence ending, you can give a few word explanation. E.g. Topic Particle for 는 or Formal Sentence Ending for 습니다. Do not wrap in quotation marks. Never return Korean in your response.
    `;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.1,
    });

    return NextResponse.json({ meaning: text });
  } catch (e: any) {
    console.log(e.message);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
};

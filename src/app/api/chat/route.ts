import {
  Message as ChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const dynamic = "force-dynamic";

const template = `You are designed to help people with the Korean language. Please respond to users questions about the Korean language to the best of your ability.

The user may ask about a sentence they have had translated. If so, it is listed here as Sentence Query. 

Sentence Query: {sentenceQuery}

If they have recieved a translation, it will be given as reference and listed as Sentence Translation. This was done through machine translation, so it may not be perfect. Use your best judgement with using this translation to assist the user.

Sentence Translation: {translatedSentence}

If the user asks to translate any word, try to provide a translation for the word. Also, give them a link to the following. Replace [QUERY_WORD_HERE] with a URI Encoded form of the word they asked for. Please format the link so the user can click on it and it will load in a new tab.

https://korean-dictionary.vercel.app/search/[QUERY_WORD_HERE]?translation=true&transLang=1

Current conversation: {chat_history}

user: {question}
assistant:`;

const formatMessage = (message: ChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export const POST = async (req: Request) => {
  try {
    const { messages, sentenceQuery, translatedSentence } = await req.json();
    const formattedMessageHistory = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      streaming: true,
    });

    const parser = new HttpResponseOutputParser();

    const chain = prompt.pipe(model).pipe(parser);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedMessageHistory.join("\n"),
      question: currentMessageContent,
      sentenceQuery: sentenceQuery,
      translatedSentence: translatedSentence,
    });

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    console.log(e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
};

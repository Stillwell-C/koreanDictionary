import {
  Message as ChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

//partsOfSpeech borrowed form this project https://github.com/l337Rooster/Korean-language-parser

const partsOfSpeech = {
  //  POS-tag    [Wiktionary POS, Khaiii class,         POS Detail,                          Korean POS]
  NNG: ["Noun", "Substantive", "General noun", "체언: 일반 명사"],
  NNP: ["Proper Noun", "Substantive", "Proper noun", "체언: 고유 명사"],
  NNB: ["Noun", "Substantive", "Bound noun, e.g. 것", "체언: 의존 명사"],
  NP: ["Pronoun", "Substantive", "Pronoun", "체언	: 대명사"],
  NR: ["Noun", "Substantive", "Number", "체언	: 수사"],
  VV: ["Verb", "Inflectional", "Verb", "용언	: 동사"],
  VA: [
    "Adjective",
    "Inflectional",
    "Descriptive verb / Adjective",
    "용언	: 형용사",
  ],
  VX: [
    "Verb",
    "Inflectional",
    "Auxiliary or supplimental verb",
    "용언: 보조 용언",
  ],
  VCP: [
    "Adjective",
    "Inflectional",
    "The positive copula - 이다",
    "용언: 긍정 지정사",
  ],
  VCN: [
    "Adjective",
    "Inflectional",
    "The negative copula - 아니다",
    "용언: 부정 지정사",
  ],
  MM: ["Determiner", "Modifier", "Determiner", "수식언: 관형사"],
  MAG: ["Adverb", "Modifier", "General adverb", "수식언: 일반 부사"],
  MAJ: [
    "Adverb",
    "Modifier",
    "Joining adverb, e.g. 그래서",
    "수식언: 접속 부사",
  ],
  IC: [
    "Interjection",
    "Independent",
    "Interjection e.g. 야!",
    "독립언: 감탄사",
  ],
  JKS: [
    "Particle",
    "Post-position",
    "Subject-marking particle",
    "관계언: 주격 조사",
  ],
  JKC: [
    "Particle",
    "Post-position",
    "Subject-marker for complement words",
    "관계언: 보격 조사",
  ],
  JKG: [
    "Particle",
    "Post-position",
    "Possessive-marker 의",
    "관계언: 관형격 조사",
  ],
  JKO: [
    "Particle",
    "Post-position",
    "Object-marking particle",
    "관계언: 목적격 조사",
  ],
  JKB: [
    "Particle",
    "Post-position",
    "Adverbial particle",
    "관계언: 부사격 조사",
  ],
  JKV: [
    "Particle",
    "Post-position",
    "Vocative case marker",
    "관계언: 호격 조사",
  ],
  JKQ: ["Particle", "Post-position", "Quotation marker", "관계언: 인용격 조사"],
  JX: ["Particle", "Post-position", "Auxiliary particle", "관계언: 보조사"],
  JC: ["Particle", "Post-position", "Connecting particle", "관계언: 보조사"],
  EP: [
    "Suffix",
    "Dependent form",
    "Suffix-head, e.g. 었 or 시",
    "의존 형태	: 선어말 어미",
  ],
  EF: [
    "Suffix",
    "Dependent form",
    "Predicate-closing suffix",
    "의존 형태	: 종결 어미",
  ],
  EC: [
    "Suffix",
    "Dependent form",
    "Verb/Auxiliary connecting suffix",
    "의존 형태	: 연결 어미",
  ],
  ETN: [
    "Suffix",
    "Dependent form",
    "Verb-nominalizing suffix, e.g. 기",
    "의존 형태: 명사형 전성 어미",
  ],
  ETM: [
    "Suffix",
    "Dependent form",
    "Verb-to-adjective transforming suffix, e.g. 은",
    "의존 형태: 관형형 전성 어미",
  ],
  XPN: [
    "Prefix",
    "Dependent form",
    "Substantive prefix",
    "의존 형태	: 체언 접두사",
  ],
  XSN: [
    "Suffix",
    "Dependent form",
    "Noun-modifying suffix, e.g. 들, 님",
    "의존 형태: 명사 파생 접미사",
  ],
  XSV: [
    "Suffix",
    "Dependent form",
    "Verb-forming suffix, e.g. ~하다",
    "의존 형태: 동사 파생 접미사",
  ],
  XSA: [
    "Suffix",
    "Dependent form",
    "Adjective-forming suffix",
    "의존 형태: 형용사 파생 접미사",
  ],
  XR: [
    "Noun",
    "Dependent form",
    "Noun root for formed verb or adjective",
    "의존 형태: 어근",
  ],
  SF: [
    "Punctuation",
    "Mark",
    "Period, question mark, exclamation mark",
    "기호; 마침표, 물음표, 느낌표",
  ],
  SP: [
    "Punctuation",
    "Mark",
    "Comma, colon, semicolon, slash",
    "기호: 쉼표, 가운뎃점, 콜론, 빗금",
  ],
  SS: [
    "Punctuation",
    "Mark",
    "Quotes, parentheses, dash",
    "기호: 따옴표, 괄호표, 줄표",
  ],
  SE: ["Punctuation", "Mark", "Ellipsis", "기호: 줄임표"],
  SO: [
    "Punctuation",
    "Mark",
    "Hyphen, tilde",
    "기호: 붙임표(물결, 숨김, 빠짐)",
  ],
  SL: [
    "Foreign",
    "Mark",
    "Word in foreign language (non-Hangul)",
    "기호: 외국어",
  ],
  SH: ["Chinese", "Mark", "Chinese characters", "기호: 한자"],
  SW: [
    "Symbol",
    "Mark",
    "Other symbols (logics, math symbols, currency symbols, etc.)",
    "기호: 기타 기호(논리, 수학 기호, 화폐 기호 등)",
  ],
  SWK: ["Letter", "Mark", "Hangul character (자모)", "기호: 한글 자소"],
  SN: ["Numeral", "Mark", "Numeral", "기호: 숫자"],
  ZN: [
    "Guess",
    "Guess",
    "Unknown, guessing noun",
    "추정: 분석 불능(명사 추정)",
  ],
  ZV: [
    "Guess",
    "Guess",
    "Unknown, guessing possessive",
    "추정: 분석 불능(용언 추정)",
  ],
  ZZ: ["Unknown", "Guess", "Unknown", "추정: 분석 불능(기타)"],
  // note that synthetic tags defined below include a mapping to one of the above basic POS or the additional labeling tags below

  // extra synthetic POS, mostly to label suffix phrases built from the mapping rules
  AVS: ["Adverbial\nsuffix", "Post-position", "Adverbial suffix", ""],
  VMS: ["Verb-modifying\nsuffix", "Post-position", "Verb-modifying suffix", ""],
};

const outputJSON = {
  parsed: [
    {
      text: "[Word]",
      POS: "[POS]",
      explanation: {
        Wiktionary_POS: "[Wiktionary POS]",
        POS_Detail: "[Detail]",
        Korean_POS: "[Korean class:POS]",
      },
      meaning_in_english: "[English meaning]",
      dictionary_form: "[Dictionary form]",
      link: "[URL for reference]",
      components: [
        {
          text: "[Component text]",
          POS: "[Component POS]",
          explanation: {
            Wiktionary_POS: "[Component Wiktionary POS]",
            POS_Detail: "[Component Detail]",
            Korean_POS: "[Component Korean class:POS]",
          },
          meaning_in_english: "[Component English meaning]",
          dictionary_form: "[Component dictionary form]",
          link: "[URL for reference]",
        },
      ],
    },
  ],
};

const template = ` Your job is to parse Korean setences.

    Below is the partsOfSpeech Context. Break down sentences into individual words and label each word according to its grammatical structure based on this context.

    partsOfSpeechContext: {partsOfSpeech}

    You will be given a sentence in Korean that will be listed here as Sentence Query.

    Sentence Query: {sentenceQuery}

    The translation for the query is the sentence translation. This was done through machine translation, so it may not be perfect. Please use this to inform the meaning_in_english, but you may add more context or description. If a word's POS is "SL" please do your best to provide additional description for the word in meaning_in_english in your repsonse.

    Sentence Translation: {translatedSentence}

    Please parse the following Korean sentence into its individual words and grammatical structures using the provided key. For each word, break it down into as many parts as possible (do not split common short words such but do split grammar such as -고, -어/아서, -면서, -은/는 etc.), including the base term. Include each part in a components array, where each component should have its own dictionary form and meaning in English. If a word has no components beyond itself, the components array should be left empty.Format the output as JSON.

    Output JSON format:

    ${outputJSON}

    Instructions:

    1. Fill in each placeholder within the parsed array with the parsed details for each word and its components.
    
    2. If a word can be broken down into parts, parse each part and include text, POS, explanation, meaning_in_english, dictionary_form, link fields for each part in the components array. If a word cannot be broken down further, leave the components array empty. Only provide a entries into the components array if you can break down a word into multiple parts. Make a maximum of 2 levels of parsed data.
    
    3. ALWAYS PROVIDE A LINK. 
    The link field should follow the following instructions:
    Default link: "/search/[DICTIONARY_FORM_HERE]?translation=true&transLang=1"
    Put the dictionary_form in the DICTIONARY_FORM_HERE area of the link. If there is no dictionary_form, replace DICTIONARY_FORM_HERE area with the text field. ONLY if the POS is SL, provide a Google search link that includes a search for the word "Korea" along with the word from the meaning_in_english instead of the link format above. NEVER LEAVE THE LINK FIELD BLANK EXCEPT FOR NUMERALS and PUNCTUATION.

    4. The explanation field should follow the following instructions:
    A JavaScript object with the fields Wiktionary_POS, POS_Detail, Korean_POS from the partsOfSpeechContext

    5. The dictionary_form field should show the dictionary form for each word.

    6. Return as valid JSON, not a code block. Only use 1 set of quotations. The JSON should contain an array with the key of "parsed" which includes all of the data you parsed.
  `;

//Leave the link field blank only if the POS is NR, SF, SP, SS, SE, SO, SW, SN, ZN, ZV, or ZZ.

export const POST = async (req: Request) => {
  try {
    const { sentenceQuery, translatedSentence } = await req.json();

    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.5,
    });

    const parser = new StringOutputParser();

    const chain = RunnableSequence.from([
      {
        sentenceQuery: () => sentenceQuery,
        translatedSentence: () => translatedSentence,
        partsOfSpeech: () => JSON.stringify(partsOfSpeech),
      },
      prompt,
      model,
      parser,
    ]);

    const result = await chain.invoke({
      sentenceQuery: sentenceQuery,
      translatedSentence: translatedSentence,
      partsOfSpeech: partsOfSpeech,
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

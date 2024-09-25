import { explode, implode } from "korean-regexp";

type parsedEntry = {
  text: string;
  components: SentenceData[];
  start: number;
  end: number;
};

type posKey = keyof typeof partsOfSpeech;

//TODO: REORGNIZE FILE FOR MORE CLARITY

//Split sentence into individual words with components array & stop & end indexes
const createSentenceArray = (sentence: string) => {
  let sentenceArr = [];
  let currWord: parsedEntry = { text: "", components: [], start: -1, end: -1 };
  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i].match(/\s/)) {
      if (currWord.text.length) {
        currWord.end = i;
        sentenceArr.push(currWord);
      }

      currWord = { text: "", components: [], start: -1, end: -1 };
    } else {
      if (currWord.start === -1) {
        currWord.start = i;
      }
      currWord.text += sentence[i];
    }
  }
  currWord.end = sentence.length;
  sentenceArr.push(currWord);

  return sentenceArr;
};

const generateComponentLink = (component: SentenceData) => {
  //Add link
  //Add google link if foreign term
  //Do not add link for punctuation, numerals, etc.
  const noLink = [
    "SF",
    "SP",
    "SS",
    "SE",
    "SO",
    "SW",
    "SN",
    "UNKNOWN",
    "SSO",
    "SSC",
  ];
  if (component.POS === "SL") {
    return `https://www.google.com/search?q=${component.dictionary_form}%20Korean`;
  } else if (component.POS && noLink.includes(component.POS)) {
    return "";
  } else {
    return `/search/${component.dictionary_form}?translation=true&transLang=1`;
  }
};

//Similar is also used in text translate, maybe use that here
const translateWithGoogle = async (
  component: SentenceData,
  target: string = "en"
) => {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: component.dictionary_form, target }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (err) {
    return err;
  }
};

const translateWithGPT = async (
  component: SentenceData,
  sentenceQuery: string
) => {
  try {
    const response = await fetch("/api/sentenceParser", {
      method: "POST",
      body: JSON.stringify({
        component,
        sentenceQuery,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    return json.meaning;
  } catch (err) {
    return err;
  }
};

export const handleRemainingTranslation = async (
  parsedSentence: parsedEntry[],
  sentenceQuery: string
) => {
  for (const wordEntry of parsedSentence) {
    for (const componentEntry of wordEntry.components) {
      if (!componentEntry?.meaning_in_english) {
        try {
          componentEntry.meaning_in_english = await translateWithGPT(
            componentEntry,
            sentenceQuery
          );
        } catch (err) {
          componentEntry.meaning_in_english = "";
        }
      }
    }
  }

  return parsedSentence;
};

export const matchingGrammarCheck = async (
  sentenceQuery: string,
  grammarArray: MatchingGammarElement[]
): Promise<MatchingGammarElement[]> => {
  try {
    const response = await fetch("/api/grammarParser", {
      method: "POST",
      body: JSON.stringify({
        sentenceQuery,
        grammarArray,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    const resArr: Boolean[] = JSON.parse(json.grammar);

    const confirmedMatches: MatchingGammarElement[] = [];

    for (let i = 0; i < resArr.length; i++) {
      if (resArr[i] && grammarArray[i]?.link?.length) {
        confirmedMatches.push(grammarArray[i]);
      }
    }

    return confirmedMatches;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchParsedSentence = async (sentenceQuery: string) => {
  const parsedResponse = await fetch(
    "https://mecabparseapi-production.up.railway.app/parse",
    {
      body: JSON.stringify({ sentence: sentenceQuery }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await parsedResponse.json();
};

export const formatParsedSentence = async ({
  sentenceQuery,
  parsedArr,
}: {
  sentenceQuery: string;
  parsedArr: SentenceData[];
}) => {
  let sentenceArr = createSentenceArray(sentenceQuery);

  for (let i = 0; i < parsedArr?.length; i++) {
    const component = parsedArr[i];
    const verbPOSTypes = ["VV", "VA", "VX", "VCP", "VCN", "XSA", "XSV"];

    //If there are expressions, multiple grammar structures are sent together
    if (
      component.expression &&
      (component.expression !== "None" || component.expression !== null)
    ) {
      //If there are components, they will be split into their two parts
      const componentPartsArr = component.expression
        .replace(/(\/\*)/g, "")
        .split("+")
        .map((el) => el.split("/"));

      //Update current component with first entry in array
      component.dictionary_form = componentPartsArr[0][0];
      component.POS = componentPartsArr[0][1];

      //The maximum may be 2, but to handle any edge cases, loop over rest of array
      //Fill out extra infor for additional component & push to components array
      for (let j = 1; j < componentPartsArr.length; j++) {
        const additionalComponent = {
          text: "",
          meaning_in_english: "",
          POS: "",
          start: component.end || 0 - 1,
          end: component.end || -1,
          dictionary_form: "",
        };

        let additionalComponentText = componentPartsArr[j][0];
        const additionalComponentPOS = componentPartsArr[j][1];

        //Replace any Syllable-Initial-Peak-Final Encoding at beginning with standard hangul
        if (partialConsonantsMap.hasOwnProperty(additionalComponentText[0])) {
          additionalComponentText =
            partialConsonantsMap[additionalComponentText[0]] +
            additionalComponentText.slice(1);
        }

        const exploded = explode(additionalComponentText || "").join("");

        additionalComponent.text = additionalComponentText;
        additionalComponent.dictionary_form = additionalComponentText;
        additionalComponent.POS = additionalComponentPOS;
        additionalComponent.meaning_in_english =
          partsOfSpeech[additionalComponentPOS as posKey][0];

        if (additionalComponentPOS === "ETM") {
          additionalComponent.text = "-" + additionalComponent.text;
        } else if (additionalComponentPOS === "EC") {
          //additionalComponent.meaning_in_english = "Sentence ending";
          additionalComponent.text = "-" + additionalComponent.text;
        } else if (additionalComponentPOS === "EF") {
          additionalComponent.text = "-" + additionalComponent.text;
        } else if (additionalComponentPOS === "EP") {
          if (additionalComponentText.match(/[었았]/g)) {
            additionalComponent.meaning_in_english = "Past tense suffix";
          }
        }

        if (additionalComponent?.text?.length)
          parsedArr.splice(i + j, 0, additionalComponent);
      }
    } else {
      component.dictionary_form = component.text;
    }

    if (component.POS && verbPOSTypes.includes(component.POS))
      component.dictionary_form += "다";

    //Determine POS
    //Split if there are multiple
    //Add detailed_POS
    const posArr = component.POS?.split("+") || [];
    const posKey = posArr[0]?.slice(0, 3) || "ZZ";
    component.detailed_POS = partsOfSpeech[posKey as posKey] || [];

    //Create link
    component.link = generateComponentLink(component);

    //Maybe remove nnb
    const googleTranslatePOS = [
      "NNG",
      "NNP",
      "NNB",
      "NP",
      "NR",
      "VV",
      "VA",
      "VX",
      "VCP",
      "VCN",
      "MM",
      "MAG",
      "MAJ",
      "IC",
      "XR",
      "XSV",
      "SF",
      "SP",
      "SS",
      "SE",
      "SO",
      "SL",
      "SW",
      "SWK",
      "SN",
    ];
    if (googleTranslatePOS.includes(posKey)) {
      component.meaning_in_english = await translateWithGoogle(component);
    }

    //Add to the components array of sentenceArr at location in sentence
    for (const word of sentenceArr) {
      if (
        component.start !== undefined &&
        component.end !== undefined &&
        component.start >= word.start &&
        component.end <= word.end
      ) {
        word.components.push(component);
        break;
      }
    }
  }

  return sentenceArr;
};

const partialConsonantsMap: { [char: string]: string } = {
  ᆨ: "ㄱ",
  ᄀ: "ㄱ",
  ᆩ: "ㄲ",
  ᄁ: "ㄲ",
  ᆫ: "ㄴ",
  ᄂ: "ㄴ",
  ᆮ: "ㄷ",
  ᄃ: "ㄷ",
  ퟍ: "ㄸ",
  ᄄ: "ㄸ",
  ᆯ: "ㄹ",
  ᄅ: "ㄹ",
  ᆷ: "ㅁ",
  ᄆ: "ㅁ",
  ᆸ: "ㅂ",
  ᄇ: "ㅂ",
  ퟦ: "ㅃ",
  ᄈ: "ㅃ",
  ᆺ: "ㅅ",
  ᄉ: "ㅅ",
  ᄼ: "ㅅ",
  ᄾ: "ㅅ",
  ᆻ: "ㅆ",
  ᄊ: "ㅆ",
  ᄽ: "ㅆ",
  ᄿ: "ㅆ",
  ᆼ: "ㅇ",
  ᄋ: "ㅇ",
  ᅌ: "ㅇ",
  ᆽ: "ㅈ",
  ᄌ: "ㅈ",
  ᅎ: "ㅈ",
  ᅐ: "ㅈ",
  ᆾ: "ㅊ",
  ᄎ: "ㅊ",
  ᅔ: "ㅊ",
  ᅕ: "ㅊ",
  ퟹ: "ㅉ",
  ᅏ: "ㅉ",
  ᅑ: "ㅉ",
  ᆿ: "ㅋ",
  ᄏ: "ㅋ",
  ᇀ: "ㅌ",
  ᄐ: "ㅌ",
  ᇁ: "ㅍ",
  ᄑ: "ㅍ",
  ᇂ: "ㅎ",
  ᄒ: "ㅎ",
};

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
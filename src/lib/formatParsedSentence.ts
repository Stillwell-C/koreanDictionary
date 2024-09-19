import { SentenceData } from "../../types/next-auth";
import { explode, implode } from "korean-regexp";

type PropType = {
  sentenceQuery: string;
  parsedArr: SentenceData[];
};

type parsedEntry = {
  text: string;
  components: SentenceData[];
  start: number;
  end: number;
};

const formatparsedSentence = ({ sentenceQuery, parsedArr }: PropType) => {
  let sentenceArr = [];
  let currWord: parsedEntry = { text: "", components: [], start: -1, end: -1 };
  for (let i = 0; i < sentenceQuery.length; i++) {
    if (sentenceQuery[i].match(/\s/)) {
      if (currWord.text.length) {
        currWord.end = i;
        sentenceArr.push(currWord);
      }

      currWord = { text: "", components: [], start: -1, end: -1 };
    } else {
      if (currWord.start === -1) {
        currWord.start = i;
      }
      currWord.text += sentenceQuery[i];
    }
  }
  currWord.end = sentenceQuery.length;
  sentenceArr.push(currWord);

  for (let i = 0; i < parsedArr.length; i++) {
    const component = parsedArr[i];

    //Split POS since some may have 2
    const posArr = component.POS?.split("+") || [];

    /**
     * This area of the code is still under development
     * This should generate dictionary forms without AI assistance
     * TODO: Continue to develop for all verb contingencies
     */

    const verbPOSTypes = ["VV", "VA", "VX", "VCP", "VCN"];
    //For all verbs
    if (posArr[0] !== "" && verbPOSTypes.includes(posArr[0])) {
      //For Verb-to-adjective transforming suffixes
      if (posArr[1] === "ETM") {
        //Remove final consonant and add ending 다
        const fullWord = component.text || "";
        const finalCharRemove = implode(explode(fullWord).slice(0, -1));
        component.dictionary_form = finalCharRemove + "다";

        //Add new array element for final consonant
        const finalChar = "-" + explode(fullWord).slice(-1);
        const finalCharData: SentenceData = {
          text: finalChar,
          meaning_in_english: "Suffix",
          POS: "ETM",
          start: component.end || 0 - 1,
          end: component.end || -1,
          dictionary_form: finalChar,
        };

        if (finalCharData?.text?.length)
          parsedArr.splice(i + 1, 0, finalCharData);
      } else if (posArr[1] === "EC") {
        //This section may only be relevant for VCP+EC & 'VV+EC'

        const endingData: SentenceData = {
          text: "",
          meaning_in_english: "Sentence ending",
          POS: "ETM",
          start: component.end || 0 - 1,
          end: component.end || -1,
          dictionary_form: "",
        };

        const exploded = explode(component.text || "").join("");

        //Match with ending
        //Remove ending and add 다
        //Add relevent data to ending data object
        if (
          exploded.match("ㅇㅡㅂㄴㅣㄷㅏ") ||
          exploded.match("ㅅㅡㅂㄴㅣㄷㅏ")
        ) {
          component.dictionary_form = implode(exploded.slice(0, -7)) + "다";
          endingData.text = "-" + implode(exploded.slice(-7));
          endingData.dictionary_form = "-" + implode(exploded.slice(-7));
        } else if (exploded.match("ㅂㄴㅣㄷㅏ")) {
          component.dictionary_form = implode(exploded.slice(0, -5)) + "다";
          endingData.text = "-ㅂ니다";
          endingData.dictionary_form = "-ㅂ니다";
        } else if (exploded.match("ㄴㄷㅏ")) {
          component.dictionary_form = implode(exploded.slice(0, -3)) + "다";
          endingData.text = "-ㄴ다";
          endingData.dictionary_form = "-ㄴ다";
        }

        //If something has been added to text field, push to arr
        if (endingData?.text?.length) parsedArr.splice(i + 1, 0, endingData);
      } else if (posArr[1] === "EF") {
        //For 'VV+EF' like '이겨요'
        const endingData: SentenceData = {
          text: "",
          meaning_in_english: "Sentence ending",
          POS: "EF",
          start: component.end || 0 - 1,
          end: component.end || -1,
          dictionary_form: "",
        };

        const exploded = explode(component.text || "").join("");

        if (exploded.match("ㅇㅓㅇㅛ")) {
          component.dictionary_form = implode(exploded.slice(0, -4)) + "다";
          endingData.text = "-어요";
          endingData.dictionary_form = "-어요";
          endingData.meaning_in_english = "Polite sentence ending";
        } else if (exploded.match("ㅇㅏㅇㅛ")) {
          component.dictionary_form = implode(exploded.slice(0, -4)) + "다";
          endingData.text = "-아요";
          endingData.dictionary_form = "-아요";
          endingData.meaning_in_english = "Polite sentence ending";
        } else if (exploded.match("ㅇㅛ")) {
          component.dictionary_form = implode(exploded.slice(0, -2));
          endingData.meaning_in_english = "Polite sentence ending";
          if (exploded.slice(-3).match(/[ㅏㅑ]/)) {
            endingData.text = "-아요";
            endingData.dictionary_form = "-아요";
          } else if (exploded.slice(-3).match(/[ㅓㅕ]/)) {
            endingData.text = "-어요";
            endingData.dictionary_form = "-어요";
          } else {
            endingData.text = "-아/어요";
            endingData.dictionary_form = "-어요";
          }
        }
        //If something has been added to text field, push to arr
        if (endingData?.text?.length) parsedArr.splice(i + 1, 0, endingData);
      } else {
        component.dictionary_form = component.text + "다";
      }
    } else if (
      posArr[0] === "XSA" ||
      (posArr[0] === "XSV" && posArr.length > 0)
    ) {
      const exploded = explode(component.text || "").join("");

      const suffixData: SentenceData = {
        text: "",
        meaning_in_english: partsOfSpeech[posArr[1] as posKey][0] || "",
        POS: posArr[1],
        start: component.end || 0 - 1,
        end: component.end || -1,
        dictionary_form: "",
      };

      //Match with ending
      //Remove ending and add 다
      //Add relevent data to ending data object
      if (exploded.match("ㅅㅣㅋㅣ") || exploded.match("ㅅㅣㅋㅕ")) {
        const index = exploded.lastIndexOf("ㅅㅣㅋ");
        component.dictionary_form = implode(exploded.slice(0, index));
        suffixData.text = "-" + implode(exploded.slice(index));
        suffixData.dictionary_form = "-" + implode(exploded.slice(index));
      } else if (exploded.slice(-3).match("ㄴㅡ ㄴ")) {
        component.dictionary_form = implode(exploded.slice(0, -3));
        suffixData.text = "-는";
        suffixData.dictionary_form = "-는";
      } else if (exploded.slice(-1).match("ㄴ")) {
        component.dictionary_form = implode(exploded.slice(0, -1));
        suffixData.text = "-ㄴ";
        suffixData.dictionary_form = "-ㄴ";
      }

      //If something has been added to text field, push to arr
      if (suffixData?.text?.length) parsedArr.splice(i + 1, 0, suffixData);
    } else {
      component.dictionary_form = component.text;
    }

    //Determine primary POS & use to add detailed_POS
    const posKey = posArr[0].slice(0, 3) || "ZZ";
    component.detailed_POS = partsOfSpeech[posKey as posKey] || [];

    //Add link
    //Add google link if foreign term
    //Do not add link for punctuation, numerals, etc.
    const noLink = ["SF", "SP", "SS", "SE", "SO", "SW", "SN"];
    if (component.POS === "SL") {
      component.link = `https://www.google.com/search?q=${component.dictionary_form}%20Korean`;
    } else if (component.POS && noLink.includes(component.POS)) {
      component.link = "";
    } else {
      component.link = `/search/${component.dictionary_form}?translation=true&transLang=1`;
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

type posKey = keyof typeof partsOfSpeech;

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

export default formatparsedSentence;

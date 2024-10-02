import { hangulLetters } from "@/data/hangulLetters";
import { partialConsonantsMap } from "@/data/partialConsonantsMap";
import { partsOfSpeech } from "@/data/partsOfSpeech";
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
    "SC",
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
    const punctuationPOSTypes = [
      "SF",
      "SP",
      "SS",
      "SE",
      "SO",
      "SC",
      "SW",
      "SN",
      "SY",
      "SSO",
      "SSC",
    ];

    // HANDLE ANY ELEMENTS WITH EXPRESSION FIELDS
    //Expressions mean that multiple grammar structures are sent together
    //and need to be split
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

    //HANDLE ADDITIONAL PROCESSING FOR INVIDIDUAL ELEMENTS
    //Add end for dictionary_forms of verbs as this is not included
    if (component.POS && verbPOSTypes.includes(component.POS)) {
      component.dictionary_form += "다";
    }
    //Make meaning_in_english Punctuation for all punctuation types
    //This avoids weird translation errors
    if (component.POS && punctuationPOSTypes.includes(component.POS)) {
      component.meaning_in_english = "Punctuation";
    }
    //This will set meaning & POS for single hangul Characters
    if (
      (component.POS && component.POS === "NNG") ||
      component.POS === "UNKNOWN"
    ) {
      if (
        component?.text?.length === 1 &&
        hangulLetters.includes(component?.text)
      ) {
        component.POS = "SWK";
        component.meaning_in_english = "Hangul Letter";
      }
    }

    //HANDLE POS
    //Determine POS
    //Split if there are multiple
    //Add detailed_POS
    const posArr = component.POS?.split("+") || [];
    const posKey = posArr[0]?.slice(0, 3) || "ZZ";
    component.detailed_POS = partsOfSpeech[posKey as posKey] || [];

    //GENERATE LINK
    component.link = generateComponentLink(component);

    //INITIAL TRANSLATION WITH GOOGLE TRANSLATE
    const googleTranslatePOS = [
      "NNG",
      "NNP",
      //Maybe remove nnb
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
      "SL",
      "SWK",
    ];

    if (googleTranslatePOS.includes(posKey) && !component.meaning_in_english) {
      component.meaning_in_english = await translateWithGoogle(component);
    }

    //INSERT ELEMENT INTO COMPONENTS ARRAY AT PROPER POSITION IN THE SENTENCE ARRAY
    //This insures that it will display below parent word
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

  console.log(parsedArr);
  return sentenceArr;
};

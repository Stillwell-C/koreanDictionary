import { getAllSavedTerms, getTermCollection } from "@/lib/dbData";
import { getTermData } from "@/lib/apiData";
import { organizeExamples } from "@/lib/utils";
import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

type Params = {
  params: {
    termCollectionId: string;
  };
};

export const GET = async (
  request: NextRequest,
  { params: { termCollectionId } }: Params
) => {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format");
  const language = searchParams.get("language");

  try {
    if (!termCollectionId) {
      throw new Error("Must submit termCollectionId");
    }

    //Check that collection exists & get name
    const termCollection = await getTermCollection(termCollectionId);

    if (!termCollection) {
      throw new Error("Collection not found");
    }

    //Get all terms in db
    const savedTerms = await getAllSavedTerms(termCollectionId);

    //Get data for each term
    const savedTermData = [];
    for (const term of savedTerms) {
      const translation = language ? "true" : "";
      const transLanguage = language ? language : "";
      const wordData = await getTermData(
        term.targetCode,
        translation,
        transLanguage
      );
      const front = wordData.word;
      const back = wordData.definitionAndExamples
        .map((item) =>
          [item?.translation?.transWord, item.definition]
            .filter((el) => el.length)
            .join("<br>")
        )
        .join("<br><br>");
      const origin = wordData?.originalLanguage?.originalLanguage;
      const displayNumber = wordData.definitionAndExamples.length > 1;
      const examples = wordData.definitionAndExamples
        .map((item, i) =>
          [
            //These two lines will provide a number on first definition line for multi-entry cards
            `${
              displayNumber && item?.translation?.transWord ? `${i + 1}. ` : ""
            }${item?.translation?.transWord}`,
            item?.translation?.transWord
              ? item.definition
              : `${displayNumber ? `${i + 1}. ` : ""}${item.definition}`,
            //This will provide single return between word/def and examples
            " ",
            organizeExamples(item.examples, {
              word: wordData.word,
              origin: wordData?.originalLanguage?.originalLanguageType,
              pos: wordData?.pos,
            }),
          ]
            .filter((el) => el.length)
            .join("<br>")
        )
        .join("<br><br>");

      const cardContent = [origin, examples]
        .filter((el) => el.length)
        .join("<br><br>");

      savedTermData.push({
        front,
        back,
        cardContent,
      });
    }
    const cardData = JSON.parse(JSON.stringify(savedTermData));

    const ws = XLSX.utils.json_to_sheet(cardData);

    const csv = XLSX.utils.sheet_to_csv(ws);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=${termCollection.name}`,
        "Content-Type": "text/csv",
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return new Response(e.message, {
        status: 400,
      });
    }
  }
};

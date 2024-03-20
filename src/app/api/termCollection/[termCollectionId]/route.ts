import {
  getAllSavedTerms,
  getTermCollection,
  getTermData,
} from "@/lib/apiData";
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
          [item.translation.transWord, item.definition].join("<br>")
        )
        .join("<br><br>");
      const origin = wordData?.originalLanguage?.originalLanguage;
      const examples = wordData.definitionAndExamples
        .map((item) =>
          [
            item.translation.transWord,
            item.definition,
            //This will provide single return between word/def and examples
            "",
            organizeExamples(item.examples, {
              word: wordData.word,
              origin: wordData?.originalLanguage?.originalLanguageType,
              pos: wordData?.pos,
            }),
          ].join("<br>")
        )
        .join("<br><br>");

      const cardContent = [origin, examples].join("<br>");

      savedTermData.push({
        front,
        back,
        cardContent,
      });
    }
    const cardData = JSON.parse(JSON.stringify(savedTermData));

    // console.log(cardData);

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

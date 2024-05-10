import { NextResponse, type NextRequest } from "next/server";
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

export const POST = async (req: NextRequest) => {
  try {
    const { text, target } = await req.json();

    let [translations] = await translate.translate(text, target);

    translations = Array.isArray(translations) ? translations : [translations];

    return Response.json(translations);
  } catch (err) {
    console.log("err: ", err);
  }
};

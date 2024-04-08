import { getTermCollections } from "@/lib/dbData";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    userId: string;
  };
};

export const GET = async (
  request: NextRequest,
  { params: { userId } }: Params
) => {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get("start") || "1";
  const results = searchParams.get("results") || "10";

  if (!userId) {
    throw new Error("Unauthorized request. Please log in.");
  }

  const termCollections = await getTermCollections(userId, start, results);

  return NextResponse.json(termCollections.results);
};

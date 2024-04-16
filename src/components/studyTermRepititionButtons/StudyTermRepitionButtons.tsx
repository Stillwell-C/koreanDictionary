"use client";

import { updateSavedTerm } from "@/lib/dbData";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

type Props = {
  term: SavedTermResponse;
};

const StudyTermRepitionButtons = ({ term }: Props) => {
  const router = useRouter();

  //Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCard = searchParams.get("card") || "1";
  const nextCard = parseInt(currentCard) + 1;

  const params = new URLSearchParams(searchParams.toString());
  params.delete("reveal");
  params.delete("card");
  params.set("card", nextCard.toString());
  const paramString = params.toString();
  const advanceUrl = `${pathname}?${paramString}`;

  //Update card with response quality and advance card
  //TODO create action for this
  const handleUpdateCard = (responseQuality: number) => {
    updateSavedTerm(term, responseQuality);
    router.push(advanceUrl);
  };

  return (
    <div>
      <button onClick={() => handleUpdateCard(0)}>Repeat</button>
      <button onClick={() => handleUpdateCard(1)}>Hard</button>
      <button onClick={() => handleUpdateCard(3)}>Good</button>
      <button onClick={() => handleUpdateCard(5)}>Easy</button>
    </div>
  );
};

export default StudyTermRepitionButtons;

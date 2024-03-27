"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./viewNextTermButton.module.css";

const ViewNextTermButton = () => {
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

  const handleRouting = () => router.push(advanceUrl);

  return (
    <button className={styles.button} onClick={handleRouting}>
      View next card
    </button>
  );
};

export default ViewNextTermButton;

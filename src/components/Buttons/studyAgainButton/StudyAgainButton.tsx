"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./studyAgainButton.module.css";

const StudyAgainButton = () => {
  const router = useRouter();

  //Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  params.delete("reveal");
  params.set("card", "1");
  const paramString = params.toString();
  const studyUrl = `${pathname}?${paramString}`;

  const handleRouting = () => router.push(studyUrl);

  return (
    <button className={styles.purpleBtn} onClick={handleRouting}>
      Study Collection Again
    </button>
  );
};

export default StudyAgainButton;

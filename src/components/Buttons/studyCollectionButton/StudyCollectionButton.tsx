"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./studyCollectionButton.module.css";

type Props = {
  collectionName?: string;
};

const StudyCollectionButton = ({ collectionName }: Props) => {
  const router = useRouter();

  //Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  if (collectionName) params.set("collectionName", collectionName);
  params.set("card", "1");
  const paramString = params.toString();
  const studyUrl = `${pathname}/study?${paramString}`;

  const handleRouting = () => router.push(studyUrl);

  return (
    <button className={styles.button} onClick={handleRouting}>
      Study Collection
    </button>
  );
};

export default StudyCollectionButton;

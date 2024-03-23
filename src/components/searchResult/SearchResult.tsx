import Link from "next/link";
import React from "react";
import styles from "./searchResult.module.css";
import AddTermButton from "../Buttons/AddTermButton/AddTermButton";
import { auth } from "@/lib/auth";

type Props = {
  resultData: SearchResultItem;
  termLinkGenerator: (targetCode: string) => string;
  openModalLinkGenerator: (targetCode: string) => string;
};

const SearchResult = async ({
  resultData,
  termLinkGenerator,
  openModalLinkGenerator,
}: Props) => {
  const termLink = termLinkGenerator(resultData.targetCode);
  const session = await auth();
  const userId = session?.user?.id;

  const openModalLink = openModalLinkGenerator(resultData.targetCode);

  return (
    <div>
      <div className={styles.topLine}>
        <Link href={termLink}>
          <p className={styles.entryTerm}>{resultData.word}</p>
        </Link>
        {resultData?.origin && <span>({resultData?.origin})</span>}
        {resultData?.pos && <span>「{resultData?.pos}」</span>}
        {resultData?.pronunciation && (
          <span>[{resultData?.pronunciation}]</span>
        )}
        {resultData?.wordGrade && <span>등급: {resultData?.wordGrade}</span>}
        <AddTermButton userId={userId || ""} openModalLink={openModalLink} />
      </div>

      <ol className={styles.list}>
        {resultData.definitions?.map((definition) => (
          <li key={definition.korean}>
            <p>{definition.translation?.transWord}</p>
            <p>{definition.korean}</p>
            <p>{definition.translation?.transDfn}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SearchResult;

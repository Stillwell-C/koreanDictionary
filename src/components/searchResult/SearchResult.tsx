import Link from "next/link";
import React from "react";
import styles from "./searchResult.module.css";
import AddTermButton from "../Buttons/AddTermButton/AddTermButton";
import { auth } from "@/lib/auth";
import TermDefinitions from "../termDefinitions/TermDefinitions";

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
        <div className={styles.wordLine}>
          <Link href={termLink}>
            <p className={styles.entryTerm}>{resultData.word}</p>
          </Link>
          <div className={styles.addBtnMobile}>
            <AddTermButton
              userId={userId || ""}
              openModalLink={openModalLink}
            />
          </div>
        </div>
        <div className={styles.wordData}>
          {resultData?.origin && <span>({resultData?.origin})</span>}
          {resultData?.pos && <span>「{resultData?.pos}」</span>}
          {resultData?.pronunciation && (
            <span>[{resultData?.pronunciation}]</span>
          )}
          {resultData?.wordGrade && <span>등급: {resultData?.wordGrade}</span>}
          <div className={styles.addBtnDesktop}>
            <AddTermButton
              userId={userId || ""}
              openModalLink={openModalLink}
            />
          </div>
        </div>
      </div>
      <TermDefinitions definitions={resultData.definitions} />
    </div>
  );
};

export default SearchResult;

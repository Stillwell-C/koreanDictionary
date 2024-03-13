import Link from "next/link";
import React from "react";
import styles from "./searchResult.module.css";

type Props = {
  resultData: SearchResultItem;
  transLang?: string;
  translation?: string;
};

const SearchResult = ({ resultData, transLang, translation }: Props) => {
  const termLink =
    translation === "true"
      ? `/term/${resultData.targetCode}?translation=true&transLang=${transLang}`
      : `/term/${resultData.targetCode}`;

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

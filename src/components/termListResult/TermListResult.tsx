import React from "react";
import styles from "./termListResult.module.css";
import { getTermData } from "@/lib/apiData";
import Link from "next/link";
import RemoveTermContainer from "../removeTermContainer/RemoveTermContainer";

type Props = {
  resultData: {
    _id: string;
    targetCode: string;
  };
  translation?: string;
  transLang?: string;
  collectionId: string;
};

const TermListResult = async ({
  resultData,
  translation,
  transLang,
  collectionId,
}: Props) => {
  const data = await getTermData(
    resultData?.targetCode,
    translation,
    transLang
  );

  const termLink =
    translation === "true"
      ? `/term/${resultData.targetCode}?translation=true&transLang=${transLang}`
      : `/term/${resultData.targetCode}`;

  return (
    <div>
      <div className={styles.topLine}>
        <div className={styles.wordLine}>
          <Link href={termLink}>
            <p className={styles.entryTerm}>{data.word}</p>
          </Link>
          <div className={styles.rmvTermMobile}>
            <RemoveTermContainer
              targetCode={data.targetCode}
              termCollectionId={collectionId}
            />
          </div>
        </div>
        <div className={styles.wordData}>
          {data?.originalLanguage?.originalLanguage && (
            <span>({data?.originalLanguage?.originalLanguage})</span>
          )}
          {data?.pos && <span>「{data?.pos}」</span>}
          {data?.pronunciationInfo?.pronunciation && (
            <span>[{data.pronunciationInfo.pronunciation}]</span>
          )}
          {data?.wordGrade && data?.wordGrade !== "없음" && (
            <span>등급: {data?.wordGrade}</span>
          )}
          <div className={styles.rmvTermDesktop}>
            <RemoveTermContainer
              targetCode={data.targetCode}
              termCollectionId={collectionId}
            />
          </div>
        </div>
      </div>

      <ol className={styles.list}>
        {data.definitionAndExamples?.map((item) => (
          <li key={item.definition}>
            <p>{item?.translation?.transWord}</p>
            <p>{item?.definition}</p>
            <p>{item?.translation?.transDfn}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TermListResult;

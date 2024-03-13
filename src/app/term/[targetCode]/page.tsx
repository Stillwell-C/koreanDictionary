import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import { getTermData } from "@/lib/apiData";
import React from "react";
import styles from "./singleTermPage.module.css";
import Image from "next/image";
import SingleTermExamples from "@/components/singleTermExamples/SingleTermExamples";

type Props = {
  params: {
    targetCode: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
  };
};

const SingleTermPage = async ({
  params: { targetCode },
  searchParams: { translation, transLang },
}: Props) => {
  const data = await getTermData(targetCode, translation, transLang);

  // console.log(data);

  console.log(data.definitionAndExamples[0].examples);

  const content = (
    <div>
      <SearchLanguageToggle />
      <div className={styles.topLine}>
        <p className={styles.entryTerm}>{data.word}</p>
        {data?.originalLanguage?.originalLanguage && (
          <span>({data?.originalLanguage?.originalLanguage})</span>
        )}
        {data?.originalLanguage?.originalLanguageType && (
          <span>Origin: {data.originalLanguage.originalLanguageType}</span>
        )}
        {data?.pos && <span>「{data?.pos}」</span>}
        <div className={styles.pronunciation}>
          {data?.pronunciationInfo?.pronunciation && (
            <span>[{data.pronunciationInfo.pronunciation}]</span>
          )}
          {data?.pronunciationInfo?.pronunciationLink && (
            <a
              href={data.pronunciationInfo.pronunciationLink}
              target='_blank'
              className={styles.link}
            >
              <Image height={20} width={20} src={"/audio.svg"} alt='' />
            </a>
          )}
        </div>
        {data?.wordGrade && <span>등급: {data?.wordGrade}</span>}
      </div>
      <ol className={styles.definitionList}>
        {data?.definitionAndExamples?.map((item, i) => (
          <li key={item.definition}>
            <div>
              <p>{item.translation.transWord}</p>
              <p>{item.definition}</p>
              <p>{item.translation.transDfn}</p>
            </div>
            <ul className={styles.exampleList}>
              <SingleTermExamples examples={item.examples} />
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );

  return content;
};

export default SingleTermPage;

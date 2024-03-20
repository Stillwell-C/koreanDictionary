import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import { getTermData } from "@/lib/apiData";
import React from "react";
import styles from "./singleTermPage.module.css";
import Image from "next/image";
import SingleTermExamples from "@/components/singleTermExamples/SingleTermExamples";
import AddTermContainer from "@/components/addTermContainer/AddTermContainer";
import SmallSearchForm from "@/components/smallSearchForm/smallSearchForm";
import { Metadata } from "next";

type Props = {
  params: {
    targetCode: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
  };
};

export const generateMetadata = async ({
  params: { targetCode },
  searchParams: { translation, transLang },
}: Props): Promise<Metadata> => {
  const data = await getTermData(targetCode, translation, transLang);

  return {
    title: `Definition for ${data.word}`,
    description: `Definition, information, and examples for ${data.word}`,
  };
};

const SingleTermPage = async ({
  params: { targetCode },
  searchParams: { translation, transLang },
}: Props) => {
  const data = await getTermData(targetCode, translation, transLang);
  console.log(data);

  const content = (
    <div>
      <SmallSearchForm />
      <SearchLanguageToggle />
      <div className={styles.topLine}>
        <p className={styles.entryTerm}>{data.word}</p>
        {/* Word Origin */}
        {data?.originalLanguage?.originalLanguage && (
          <span>({data?.originalLanguage?.originalLanguage})</span>
        )}
        {data?.originalLanguage?.originalLanguageType && (
          <span>Origin: {data.originalLanguage.originalLanguageType}</span>
        )}
        {/* Part of Speech */}
        {data?.pos && <span>「{data?.pos}」</span>}
        {/* Pronunciation */}
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
        {/* Word Level */}
        {data?.wordGrade && data?.wordGrade !== "없음" && (
          <span>등급: {data?.wordGrade}</span>
        )}
        <AddTermContainer targetCode={targetCode} />
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
              <SingleTermExamples
                examples={item.examples}
                wordInfo={{
                  word: data.word,
                  pos: data?.pos,
                  origin: data?.originalLanguage?.originalLanguageType,
                }}
              />
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );

  return content;
};

export default SingleTermPage;

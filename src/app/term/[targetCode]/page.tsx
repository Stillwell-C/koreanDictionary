import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import { getTermData } from "@/lib/apiData";
import React from "react";
import styles from "./singleTermPage.module.css";
import Image from "next/image";
import SingleTermExamples from "@/components/singleTermExamples/SingleTermExamples";
import AddTermContainer from "@/components/addTermContainer/AddTermContainer";
import SmallSearchForm from "@/components/smallSearchForm/smallSearchForm";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import AddTermButton from "@/components/Buttons/AddTermButton/AddTermButton";
import AddTermDialog from "@/components/AddTermDialog/AddTermDialog";

type Props = {
  params: {
    targetCode: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    modal?: string;
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
  searchParams: { translation, transLang, modal },
}: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  const modalOpen = modal === "true";

  const data = await getTermData(targetCode, translation, transLang);

  const searchParamObj = { translation, transLang };
  let searchParamString = "";
  for (const [key, value] of Object.entries(searchParamObj)) {
    if (value) {
      searchParamString += searchParamString.length
        ? `&${key}=${value}`
        : `?${key}=${value}`;
    }
  }

  const openModalLink = searchParamString.length
    ? `/term/${targetCode}${searchParamString}&modal=true&modalTarget=${targetCode}`
    : `/term/${targetCode}?modal=true&modalTarget=${targetCode}`;

  const closeModalLink = `/term/${targetCode}${searchParamString}`;

  const content = (
    <div>
      <SmallSearchForm />
      <SearchLanguageToggle />
      <div className={styles.topLine}>
        <div className={styles.wordLine}>
          <p className={styles.entryTerm}>{data.word}</p>
          <div className={styles.addBtnMobile}>
            <AddTermButton
              userId={userId || ""}
              openModalLink={openModalLink}
            />
          </div>
        </div>
        <div className={styles.wordData}>
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
          <div className={styles.addBtnDesktop}>
            <AddTermButton
              userId={userId || ""}
              openModalLink={openModalLink}
            />
          </div>
        </div>
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
      {userId && modalOpen && (
        <AddTermDialog
          isOpen={modalOpen}
          closeLink={closeModalLink}
          userId={userId}
        />
      )}
    </div>
  );

  return content;
};

export default SingleTermPage;

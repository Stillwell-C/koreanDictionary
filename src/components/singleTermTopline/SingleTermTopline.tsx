import Image from "next/image";
import AddTermButton from "../Buttons/AddTermButton/AddTermButton";
import styles from "./singleTermTopline.module.css";
import { auth } from "@/lib/auth";

type Props = {
  data: TermDataResult;
  openModalLink?: string;
};

const SingleTermTopline = async ({ data, openModalLink }: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className={styles.topLine}>
      <div className={styles.wordLine}>
        <p className={styles.entryTerm}>{data.word}</p>
        {openModalLink && (
          <div className={styles.addBtnMobile}>
            <AddTermButton
              userId={userId || ""}
              openModalLink={openModalLink}
            />
          </div>
        )}
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
        {openModalLink && (
          <div className={styles.addBtnDesktop}>
            <AddTermButton
              userId={userId || ""}
              openModalLink={openModalLink}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTermTopline;

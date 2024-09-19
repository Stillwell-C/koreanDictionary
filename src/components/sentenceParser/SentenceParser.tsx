"use client";

import { useEffect, useState } from "react";
import styles from "./sentenceParser.module.css";
import btnStyles from "../../styles/buttons.module.css";
import { SentenceData } from "../../../types/next-auth";
import Link from "next/link";
import formatparsedSentence from "@/lib/formatParsedSentence";
import BounceLoader from "react-spinners/BounceLoader";

type PropType = {
  sentenceQuery?: string;
  translatedSentence?: string;
};

const SentenceParser = ({ sentenceQuery, translatedSentence }: PropType) => {
  const [allowParse, setAllowParse] = useState(true);
  const [parsedSentenceData, setParasedSentenceData] = useState<SentenceData[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleParse = async () => {
    if (!sentenceQuery?.length) return;
    setAllowParse(false);
    setParasedSentenceData([]);
    setLoading(true);
    setError(false);
    try {
      const parsedResponse = await fetch(
        "https://mecabparseapi-production.up.railway.app/parse",
        {
          body: JSON.stringify({ sentence: sentenceQuery }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedJSON = await parsedResponse.json();

      const response = await fetch("/api/sentenceParser", {
        method: "POST",
        body: JSON.stringify({
          translatedSentence,
          parsedSentence: parsedJSON.results,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      const formattedParsedSentence = formatparsedSentence({
        sentenceQuery,
        parsedArr: json?.parsed,
      });
      setParasedSentenceData(formattedParsedSentence);
      setLoading(false);
    } catch (err) {
      setAllowParse(true);
      setError(true);
      setParasedSentenceData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    setAllowParse(true);
  }, [sentenceQuery]);

  const componentDisplay = (component: SentenceData) => {
    const displayDetail =
      component?.detailed_POS && component?.detailed_POS[0] === "Suffix";

    const componentDiv = (
      <div className={styles.singleComponent}>
        <span className={styles.componentHeader}>
          {component?.dictionary_form || component?.text}
        </span>
        <span className={styles.componentMeaning}>
          {component?.meaning_in_english}
        </span>
        <span className={styles.componentPOS}>
          {component?.detailed_POS ? component?.detailed_POS[0] : ""}
        </span>
        {displayDetail && (
          <span className={styles.componentPOS}>
            {component?.detailed_POS ? component?.detailed_POS[2] : ""}
          </span>
        )}
      </div>
    );

    if (component?.link?.length && component.link.startsWith("/search")) {
      return (
        <Link
          className={styles.componentLink}
          href={component.link}
          target='_blank'
        >
          {componentDiv}
        </Link>
      );
    } else if (component?.link?.length) {
      return (
        <a
          className={styles.componentLink}
          href={component.link}
          target='_blank'
        >
          {componentDiv}
        </a>
      );
    } else {
      return componentDiv;
    }
  };

  const parseSentenceBtn = (
    <button className={btnStyles.btn} onClick={handleParse}>
      Parse sentence
    </button>
  );

  const loadingDiv = (
    <div className={styles.loadingDiv}>
      <BounceLoader color='white' size={30} />
      <p>Parsing...</p>
      <p>This may take a moment.</p>
    </div>
  );

  const errorDiv = (
    <div className={styles.errorDiv}>
      <p>An error occurred.</p>
      <p>If this persists, try a shorter sentence.</p>
      <p>
        Your sentence may require an api call too long for the free hosting used
        by this website.
      </p>
      <p>
        무료 호스팅 서비스를 이용하여 긴 문장 분석은 불가능합니다. 짧은 문장으로
        분석해 보세요
      </p>
    </div>
  );

  const parsedSentence = (
    <div className={styles.sentenceContainer}>
      <div className={styles.sentenceWrapper}>
        {parsedSentenceData?.map((word, index) => (
          <div key={`word${word}${index}`}>
            <div className={styles.wordHeader}>
              <span>{word?.text}</span>
            </div>
            {!word?.components?.length ? (
              <div className={styles.componentsWrapper}>
                <div className={styles.singleComponentWrapper}>
                  {componentDisplay(word)}
                </div>
              </div>
            ) : (
              <div className={styles.componentsWrapper}>
                {word.components.map((component, index) => (
                  <div
                    className={styles.singleComponentWrapper}
                    key={`component${component.text}${index}${word?.text}`}
                  >
                    {componentDisplay(component)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {allowParse && parseSentenceBtn}
      {loading && loadingDiv}
      {error && errorDiv}
      {parsedSentenceData.length > 0 && parsedSentence}
    </div>
  );
};

export default SentenceParser;

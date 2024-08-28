"use client";

import { useEffect, useState } from "react";
import styles from "./sentenceParser.module.css";
import btnStyles from "../../styles/buttons.module.css";
import { SentenceData } from "../../../types/next-auth";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";

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
      const response = await fetch("/api/sentenceParser", {
        method: "POST",
        body: JSON.stringify({ sentenceQuery, translatedSentence }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setParasedSentenceData(json?.parsed);
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
    const displayDetail = component?.explanation?.Wiktionary_POS === "Suffix";

    const componentDiv = (
      <div className={styles.singleComponent}>
        <span className={styles.componentHeader}>
          {component?.dictionary_form || component?.text}
        </span>
        <span className={styles.componentMeaning}>
          {component?.meaning_in_english}
        </span>
        <span className={styles.componentPOS}>
          {component?.explanation?.Wiktionary_POS}
        </span>
        {displayDetail && (
          <span className={styles.componentPOS}>
            {component?.explanation?.POS_Detail}
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
      <ClipLoader color='white' speedMultiplier={0.7} />
      <p>Parsing...</p>
      <p>This may take a moment.</p>
    </div>
  );

  const errorDiv = (
    <div className={styles.errorDiv}>
      <p>An error occurred.</p>
      <p>Please try again</p>
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

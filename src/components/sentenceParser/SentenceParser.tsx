"use client";

import { useEffect, useState } from "react";
import styles from "./sentenceParser.module.css";
import btnStyles from "../../styles/buttons.module.css";
import Link from "next/link";
import {
  handleRemainingTranslation,
  matchingGrammarCheck,
  formatParsedSentence,
  fetchParsedSentence,
} from "@/lib/parseSentence";
import BounceLoader from "react-spinners/BounceLoader";
import { Disclosure } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

type PropType = {
  sentenceQuery?: string;
};

const SentenceParser = ({ sentenceQuery }: PropType) => {
  const [allowParse, setAllowParse] = useState(true);
  const [parsedSentenceData, setParasedSentenceData] = useState<SentenceData[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [matchingGrammar, setMatchingGrammar] = useState<
    MatchingGammarElement[]
  >([]);
  const [parsingGrammar, setParsingGrammar] = useState(false);
  const [error, setError] = useState(false);

  const handleParse = async () => {
    if (!sentenceQuery?.length) return;
    //Reset all data & loading states
    setAllowParse(false);
    setParasedSentenceData([]);
    setMatchingGrammar([]);
    setLoading(true);
    setTranslating(true);
    setParsingGrammar(true);
    setError(false);
    try {
      const trimmedSentenceQuery = sentenceQuery.trim();
      //Get parsed sentence
      const parsedJSON = await fetchParsedSentence(trimmedSentenceQuery);
      //Format for display
      const formattedParsedSentence = await formatParsedSentence({
        sentenceQuery: trimmedSentenceQuery,
        parsedArr: parsedJSON?.results,
      });
      setParasedSentenceData(formattedParsedSentence);
      setLoading(false);
      //Translate any remaining words with GPT
      const translatedSentence = await handleRemainingTranslation(
        formattedParsedSentence,
        trimmedSentenceQuery
      );
      setParasedSentenceData(translatedSentence);
      setTranslating(false);
      //Check matching grammars with GPT
      const matchingGrammar = await matchingGrammarCheck(
        trimmedSentenceQuery,
        parsedJSON.possibleGrammarMatches
      );
      setParsingGrammar(false);
      setMatchingGrammar(matchingGrammar);
    } catch (err) {
      console.log(err);
      //Reset all data & loading states
      setAllowParse(true);
      setError(true);
      setParasedSentenceData([]);
      setLoading(false);
      setTranslating(false);
      setParsingGrammar(false);
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
        <div className={styles.componentHeader}>
          <span>{component?.dictionary_form || component?.text}</span>
        </div>
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

  const matchingGrammarLink = (matchingGrammar: MatchingGammarElement) => {
    return (
      <a
        className={styles.matchingGrammarLink}
        href={matchingGrammar?.link}
        target='_blank'
      >
        {matchingGrammar?.grammarForm}
      </a>
    );
  };

  const parseSentenceBtn = (
    <button className={btnStyles.btn} onClick={handleParse}>
      Parse sentence
    </button>
  );

  const loadingDiv = (
    <div className={styles.loadingDiv}>
      <BounceLoader color='white' size={30} />
      {loading && <p>Parsing...</p>}
      {!loading && translating && <p>Finishing translation...</p>}
      {!loading && !translating && parsingGrammar && (
        <p>Looking for grammar points...</p>
      )}
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

  const grammarMatches = (
    <div className={styles.matchingGrammarContainer}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.matchingGrammarButton}>
              <div className={styles.matchingGrammarTitle}>
                <span>Grammar Help</span>
                <div className={styles.matchingGrammarChevron} data-open={open}>
                  <FiChevronDown></FiChevronDown>
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className={styles.matchingGrammarPanel}>
              <p className={styles.matchingGrammarWarning}>
                *The following grammar may be in your sentence.
              </p>
              <div className={styles.matchingGrammarResults}>
                {matchingGrammar?.map((grammar, index) => (
                  <div key={`${index}${grammar?.link}`}>
                    {matchingGrammarLink(grammar)}
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );

  return (
    <div className={styles.container}>
      {allowParse && parseSentenceBtn}
      {(loading || translating || parsingGrammar) && loadingDiv}
      {error && errorDiv}
      {parsedSentenceData.length > 0 && parsedSentence}
      {matchingGrammar.length > 0 && grammarMatches}
    </div>
  );
};

export default SentenceParser;

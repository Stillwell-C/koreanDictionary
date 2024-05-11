"use client";

import React, { useState } from "react";
import styles from "./textTranslation.module.css";
import { MdOutlineGTranslate } from "react-icons/md";
import ChatInterface from "../chatInterface/ChatInterface";

const TextTranslation = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");

  const handleTranslate = async (text: string, target: string = "en") => {
    if (!text.length) return;
    text = text.slice(0, 250);
    const response = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text, target }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    const json = await response.json();
    setTranslation(json);
  };

  const googleTranslateLink = `https://translate.google.com/?sl=ko&tl=en&text=${encodeURI(
    text
  )}&op=translate`;

  const papagoTranslateLink = `https://papago.naver.com/?sk=ko&tk=en&st=${encodeURI(
    text
  )}`;

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            maxLength={250}
            onChange={(e) => setText(e.target.value)}
            placeholder='Enter text here to translate'
          />
          <div className={styles.lengthCounter}>
            <span>{text.length} / 250</span>
          </div>
        </div>
        <button
          className={styles.formButton}
          type='button'
          onClick={() => handleTranslate(text, "en")}
        >
          Translate
        </button>
      </form>
      <div>
        {translation && (
          <div className={styles.translationWrapper}>
            <div className={styles.translationTextWrapper}>
              <span
                className={styles.translationIcon}
                title='Translation provided by Google Translate'
              >
                <MdOutlineGTranslate />
              </span>
              <span>{translation}</span>
            </div>
            <div className={styles.linkWrapper}>
              <a
                target='_blank'
                href={googleTranslateLink}
                title='Translate with Google Translate'
                className={styles.linkButton}
              >
                Google
              </a>
              <a
                target='_blank'
                href={papagoTranslateLink}
                title='Translate with Papago Translation'
                className={styles.linkButton}
              >
                Papago
              </a>
            </div>
          </div>
        )}
      </div>
      <ChatInterface sentenceQuery={text} translatedSentence={translation} />
    </div>
  );
};

export default TextTranslation;

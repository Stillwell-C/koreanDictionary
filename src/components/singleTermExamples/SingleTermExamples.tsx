import React from "react";
import styles from "./singleTermExamples.module.css";

type Props = {
  examples: TermDataExampleType[];
  wordInfo: { word: string; origin: string; pos: string };
};

const SingleTermExamples = ({
  examples,
  wordInfo: { word, origin, pos },
}: Props) => {
  const phrases = examples.filter((item) => item.type === "구");
  const sentences = examples.filter((item) => item.type === "문장");
  const dialog = examples.filter((item) => item.type === "대화");

  const formatSentence = (sentence: string) => {
    if (pos === "명사" || pos === "관형사") {
      //Add return for dialog sentences not containing word
      if (!sentence.includes(word)) return sentence;

      const location = sentence.split(word);
      return (
        <>
          <span>{location[0]}</span>
          <span className={styles.bold}>{word}</span>
          <span>{location[1]}</span>
        </>
      );
    }

    //Find word root
    if (origin === "한자고유어") {
      let wordRoot = word;
      //Remove verb ending
      const verbEndings = ["하다", "되다", "시키다"];
      for (const ending of verbEndings) {
        if (wordRoot.includes(ending))
          wordRoot = wordRoot.slice(0, word.lastIndexOf(ending));
      }

      //Create regex for whole word from determined root
      const wordRegex = new RegExp(
        `(${wordRoot}[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]+)`
      );

      //Check for term & return for sentences not containing word
      const wordInSentence = sentence.match(wordRegex);
      if (!wordInSentence?.length) return sentence;

      const location = sentence.split(wordInSentence[0]);
      return (
        <>
          <span>{location[0]}</span>
          <span className={styles.bold}>{wordInSentence[0]}</span>
          <span>{location[1]}</span>
        </>
      );
    }

    if (pos === "형용사" || pos === "동사") {
      let wordRoot = word.slice(0, word.lastIndexOf("다"));

      //Create regex for whole word from determined root
      const wordRegex = new RegExp(
        `(${wordRoot}[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]+)`
      );

      //Check for term & return for sentences not containing word
      const wordInSentence = sentence.match(wordRegex);
      if (!wordInSentence?.length) return sentence;

      const location = sentence.split(wordInSentence[0]);
      return (
        <>
          <span>{location[0]}</span>
          <span className={styles.bold}>{wordInSentence[0]}</span>
          <span>{location[1]}</span>
        </>
      );
    }

    return sentence;
  };

  const formattedDialog = [];
  for (const item in dialog) {
    const itemInt = parseInt(item);
    const marker = itemInt === 0 || itemInt % 2 === 0 ? "가: " : "나: ";
    formattedDialog.push(
      <li key={dialog[itemInt].example}>
        {marker}
        {formatSentence(dialog[itemInt].example)}
      </li>
    );
  }

  return (
    <>
      {phrases.map((example) => (
        <li key={example.example}>{formatSentence(example.example)}</li>
      ))}
      {sentences.map((example) => (
        <li key={example.example}>{formatSentence(example.example)}</li>
      ))}
      {formattedDialog}
    </>
  );
};

export default SingleTermExamples;

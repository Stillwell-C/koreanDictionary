import React from "react";
import styles from "./singleTermDefinitionExamples.module.css";
import SingleTermExamples from "../singleTermExamples/SingleTermExamples";

type Props = {
  definitionAndExamples: TermDataDefinitionAndExamples[];
  wordInfo: { word: string; origin: string; pos: string };
};

const SingleTermDefinitionExamples = ({
  definitionAndExamples,
  wordInfo,
}: Props) => {
  return (
    <ol className={styles.definitionList}>
      {definitionAndExamples?.map((item, i) => (
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
                word: wordInfo.word,
                pos: wordInfo?.pos,
                origin: wordInfo?.origin,
              }}
            />
          </ul>
        </li>
      ))}
    </ol>
  );
};

export default SingleTermDefinitionExamples;

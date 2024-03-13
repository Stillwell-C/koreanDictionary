import React from "react";

type Props = {
  examples: TermDataExampleType[];
};

const SingleTermExamples = ({ examples }: Props) => {
  const phrases = examples.filter((item) => item.type === "구");
  const sentences = examples.filter((item) => item.type === "문장");
  const dialog = examples.filter((item) => item.type === "대화");

  const formattedDialog = [];
  for (const item in dialog) {
    const itemInt = parseInt(item);
    const marker = itemInt === 0 || itemInt % 2 === 0 ? "가: " : "나: ";
    formattedDialog.push(
      <li key={dialog[itemInt].example}>
        {marker}
        {dialog[itemInt].example}
      </li>
    );
  }

  return (
    <>
      {phrases.map((example) => (
        <li key={example.example}>{example.example}</li>
      ))}
      {sentences.map((example) => (
        <li key={example.example}>{example.example}</li>
      ))}
      {formattedDialog}
    </>
  );
};

export default SingleTermExamples;

export const organizeExamples = (
  examples: TermDataExampleType[],
  wordInfo: { word: string; origin?: string; pos?: string }
) => {
  const phrases = [];
  const sentences = [];
  const dialog = [];

  const formatSentence = (sentence: string) => {
    if (wordInfo?.pos === "명사" || wordInfo?.pos === "관형사") {
      //Add return for dialog sentences not containing word
      if (!sentence.includes(wordInfo.word)) return sentence;

      const location = sentence.split(wordInfo.word);
      return `<span>${location[0]}</span> <strong>${wordInfo.word}</strong><span>${location[1]}</span>`;
    }

    //Find word root
    if (wordInfo.origin === "한자고유어") {
      let wordRoot = wordInfo.word;
      //Remove verb ending
      const verbEndings = ["하다", "되다", "시키다"];
      for (const ending of verbEndings) {
        if (wordRoot.includes(ending))
          wordRoot = wordRoot.slice(0, wordRoot.lastIndexOf(ending));
      }

      //Add return for dialog sentences not containing word
      if (!sentence.includes(wordRoot)) return sentence;

      const location = sentence.split(wordRoot);
      return `<span>${location[0]}</span> <strong>${wordRoot}</strong><span>${location[1]}</span>`;
    }

    if (wordInfo?.pos === "형용사" || wordInfo?.pos === "동사") {
      let wordRoot = wordInfo.word.slice(0, wordInfo.word.lastIndexOf("다"));

      //Add return for dialog sentences not containing word
      if (!sentence.includes(wordRoot)) return sentence;

      const location = sentence.split(wordRoot);
      return `<span>${location[0]}</span> <strong>${wordRoot}</strong><span>${location[1]}</span>`;
    }

    return sentence;
  };

  for (const example of examples) {
    if (example.type === "구") phrases.push(formatSentence(example.example));
    if (example.type === "문장")
      sentences.push(formatSentence(example.example));
    if (example.type === "대화") dialog.push(example);
  }

  const formattedDialog = [];
  for (const item in dialog) {
    const itemInt = parseInt(item);
    const marker = itemInt === 0 || itemInt % 2 === 0 ? "가: " : "나: ";
    formattedDialog.push(
      `${marker} ${formatSentence(dialog[itemInt].example)}`
    );
  }

  return [...phrases, ...sentences, ...formattedDialog].join("<br>");
};

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
    new Date(dateString)
  );
};

export const organizeExamples = (
  examples: TermDataExampleType[],
  wordInfo: { word: string; origin?: string; pos?: string }
) => {
  const phrases = [];
  const sentences = [];
  const dialog = [];

  const formatSentence = (sentence: string) => {
    if (wordInfo?.pos === "접사") {
      return `<strong>${sentence}</strong>`;
    }

    if (wordInfo?.pos === "조사" || wordInfo?.pos === "어미") {
      const parsedWord = wordInfo.word.replace(/-ㄴ|-ㄹ|-으|-/, "");

      //Add return for dialog sentences not containing word
      if (!sentence.includes(parsedWord)) return sentence;

      //Create regex for whole word from determined root
      const wordRegex = new RegExp(
        `([\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]+${parsedWord})`
      );

      //Check for term & return for sentences not containing word
      const wordInSentence = sentence.match(wordRegex);
      if (!wordInSentence?.length) return sentence;

      const location = sentence.split(wordInSentence[0]);
      return `<span>${location[0]}</span> <strong>${wordInSentence}</strong><span>${location[1]}</span>`;
    }

    if (
      wordInfo?.pos === "명사" ||
      wordInfo?.pos === "관형사" ||
      wordInfo?.pos === "부사" ||
      wordInfo?.pos === "대명사" ||
      wordInfo?.pos === "수사" ||
      wordInfo?.pos === "관형사" ||
      wordInfo?.pos === "감탄사" ||
      wordInfo?.pos === "의존 명사"
    ) {
      //Add return for dialog sentences not containing word
      if (!sentence.includes(wordInfo.word)) return sentence;

      const location = sentence.split(wordInfo.word);
      return `<span>${location[0]}</span> <strong>${wordInfo.word}</strong><span>${location[1]}</span>`;
    }

    //Find word root
    if (
      wordInfo?.pos === "형용사" ||
      wordInfo?.pos === "동사" ||
      wordInfo?.pos === "보조 형용사" ||
      wordInfo?.pos === "보조 동사"
    ) {
      let wordRoot = wordInfo.word;

      //Remove verb ending
      if (wordInfo?.origin === "한자고유어") {
        const verbEndings = ["하다", "되다", "시키다"];
        for (const ending of verbEndings) {
          if (wordRoot.includes(ending))
            wordRoot = wordRoot.slice(0, wordRoot.lastIndexOf(ending));
        }
      } else {
        wordRoot = wordInfo?.word.slice(0, wordInfo?.word.lastIndexOf("다"));
      }

      //Create regex for whole word from determined root
      const wordRegex = new RegExp(
        `(${wordRoot}[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]+)`
      );

      //Check for term & return for sentences not containing word
      const wordInSentence = sentence.match(wordRegex);
      if (!wordInSentence?.length) return sentence;

      const location = sentence.split(wordInSentence[0]);
      return `<span>${location[0]}</span> <strong>${wordInSentence[0]}</strong><span>${location[1]}</span>`;
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
    34;
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

export const addIntervalToDate = (interval: number) => {
  //Add number of days in interval to the date
  let updatedDate = new Date();
  updatedDate.setDate(updatedDate.getDate() + interval);
  return updatedDate.getTime();
};

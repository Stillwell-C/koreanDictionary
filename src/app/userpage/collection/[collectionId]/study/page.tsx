import { getTermData } from "@/lib/apiData";
import { getSavedTerms } from "@/lib/dbData";
import styles from "./studyPage.module.css";
import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import SingleTermDefinitionExamples from "@/components/singleTermDefinitionExamples/SingleTermDefinitionExamples";
import TermDefinitions from "@/components/termDefinitions/TermDefinitions";
import SingleTermTopline from "@/components/singleTermTopline/SingleTermTopline";
import RevealCardBackButton from "@/components/Buttons/revealCardBackButton/RevealCardBackButton";
import ViewNextTermButton from "@/components/Buttons/viewNextTermButton/ViewNextTermButton";
import StudyAgainButton from "@/components/Buttons/studyAgainButton/StudyAgainButton";
import MoveToCollectionsButton from "@/components/Buttons/moveToCollectionsButton/MoveToCollectionsButton";

type Props = {
  params: {
    collectionId: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    collectionName?: string;
    card: string;
    reveal: string;
  };
};

export const generateMetadata = async ({
  params: { collectionId },
  searchParams: { card, reveal, translation, transLang, collectionName },
}: Props) => {
  const cardInfo = await getSavedTerms(collectionId, card, "1");
  const cardData = await getTermData(
    cardInfo?.results[0]?.targetCode,
    translation,
    transLang
  );

  if (!cardData?.word) {
    return {
      title: collectionName ? collectionName : "User Flashcards",
      description: collectionName
        ? `Flashcards for ${collectionName}`
        : "User Flashcards",
    };
  }

  return {
    title: `${cardData.word} | ${
      collectionName ? collectionName : "User Flashcards"
    }`,
    description: `Flashcard for word ${cardData.word}${
      collectionName ? ` in collection ${collectionName}` : ""
    }`,
  };
};

const page = async ({
  params: { collectionId },
  searchParams: { card, reveal, translation, transLang, collectionName },
}: Props) => {
  const revealBack = reveal === "true";

  const cardInfo = await getSavedTerms(collectionId, card, "1");
  const cardData = await getTermData(
    cardInfo?.results[0]?.targetCode,
    translation,
    transLang
  );

  //Term has no terms
  if (!parseInt(cardInfo?.searchData.total)) {
    //TODO: add link somehwer
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {collectionName && `${collectionName} - `}Flashcards
        </h2>
        <div className={styles.textDiv}>
          <h3>Empty Collection</h3>
          <p>To study, you need to add terms to this collection.</p>
        </div>
        <div className={styles.buttonDiv}>
          <MoveToCollectionsButton />
        </div>
      </div>
    );
  }

  if (parseInt(card) > parseInt(cardInfo?.searchData.total)) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {collectionName && `${collectionName} - `}Flashcards
        </h2>
        <div className={styles.textDiv}>
          <h3>Congratulations!</h3>
          <p>You finished studying this collection.</p>
        </div>
        <div className={styles.buttonDiv}>
          <StudyAgainButton />
          <MoveToCollectionsButton />
        </div>
      </div>
    );
    //Add link to start & elsewhere
  }

  if (!revealBack) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {collectionName && `${collectionName} - `}Flashcards
        </h2>
        <SearchLanguageToggle />
        <p className={styles.entryTerm}>{cardData.word}</p>
        <RevealCardBackButton />
      </div>
    );
  }

  if (revealBack) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {collectionName && `${collectionName} - `}Flashcards
        </h2>
        <SearchLanguageToggle />
        <SingleTermTopline data={cardData} />
        <div className={styles.topDefinitions}>
          <TermDefinitions definitions={cardData.definitionAndExamples} />
        </div>
        <SingleTermDefinitionExamples
          definitionAndExamples={cardData.definitionAndExamples}
          wordInfo={{
            word: cardData.word,
            pos: cardData?.pos,
            origin: cardData?.originalLanguage?.originalLanguageType,
          }}
        />
        <div className={styles.buttonDiv}>
          <ViewNextTermButton />
        </div>
      </div>
    );
  }
};

export default page;

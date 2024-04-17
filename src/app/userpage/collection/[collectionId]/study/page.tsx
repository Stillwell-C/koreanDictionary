import { getTermData } from "@/lib/apiData";
import {
  checkStudySession,
  getSavedTermForStudy,
  getTermCollection,
} from "@/lib/dbData";
import styles from "./studyPage.module.css";
import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import SingleTermDefinitionExamples from "@/components/singleTermDefinitionExamples/SingleTermDefinitionExamples";
import TermDefinitions from "@/components/termDefinitions/TermDefinitions";
import SingleTermTopline from "@/components/singleTermTopline/SingleTermTopline";
import RevealCardBackButton from "@/components/Buttons/revealCardBackButton/RevealCardBackButton";
import StudyAgainButton from "@/components/Buttons/studyAgainButton/StudyAgainButton";
import MoveToCollectionsButton from "@/components/Buttons/moveToCollectionsButton/MoveToCollectionsButton";
import { notFound } from "next/navigation";
import StudyTermRepitionForm from "@/components/studyTermRepititionForm/StudyTermRepitionForm";

type Props = {
  params: {
    collectionId: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    card: string;
    reveal: string;
  };
};

export const generateMetadata = async ({
  params: { collectionId },
  searchParams: { card, translation, transLang },
}: Props) => {
  const collection = await getTermCollection(collectionId);
  const cardInfo = await getSavedTermForStudy(collectionId, card);
  const cardData = await getTermData(
    cardInfo?.results?.targetCode,
    translation,
    transLang
  );

  const collectionName = collection?.name;

  if (!collectionName) {
    return {
      title: "Collection not found",
      description:
        "The collection for the flashcard you requested could not be located.",
    };
  }

  if (!cardData?.word) {
    return {
      title: collectionName,
      description: `Flashcards for ${collectionName}`,
    };
  }

  return {
    title: `${cardData.word} | ${collectionName}`,
    description: `Flashcard for word ${cardData.word} in collection ${collectionName}`,
  };
};

const page = async ({
  params: { collectionId },
  searchParams: { card, reveal, translation, transLang },
}: Props) => {
  const revealBack = reveal === "true";

  //TODO: Move this somewhere before this page
  if (card === "1") {
    await checkStudySession(collectionId);
  }

  const collection = await getTermCollection(collectionId);
  const cardInfo = await getSavedTermForStudy(collectionId, card);
  const cardData = await getTermData(
    cardInfo?.results?.targetCode,
    translation,
    transLang
  );

  const collectionName = collection?.name;

  if (!collectionName) {
    notFound();
  }

  //Maybe readd this
  // //Term has no terms
  // if (!parseInt(cardInfo?.searchData.total)) {
  //   //TODO: add link somehwer
  //   return (
  //     <div className={styles.container}>
  //       <h2 className={styles.heading}>{collectionName} - Flashcards</h2>
  //       <div className={styles.textDiv}>
  //         <h3>Empty Collection</h3>
  //         <p>To study, you need to add terms to this collection.</p>
  //       </div>
  //       <div className={styles.buttonDiv}>
  //         <MoveToCollectionsButton />
  //       </div>
  //     </div>
  //   );
  // }

  if (!parseInt(cardInfo?.searchData.total)) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>{collectionName} - Flashcards</h2>
        <div className={styles.textDiv}>
          <h3>Congratulations!</h3>
          <p>You finished studying this collection.</p>
        </div>
        <div className={styles.buttonDiv}>
          <StudyAgainButton termCollectionId={collectionId} />
          <MoveToCollectionsButton />
        </div>
      </div>
    );
    //Add link to start & elsewhere
  }

  if (!revealBack) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>{collectionName} - Flashcards</h2>
        <SearchLanguageToggle />
        <div className={styles.cardCounter}>
          <p>Review cards remaining: {cardInfo.searchData.total}</p>
        </div>
        <div className={styles.cardContentWrapper}>
          <div className={styles.cardContent}>
            <p className={styles.entryTerm}>{cardData.word}</p>
            <RevealCardBackButton />
          </div>
        </div>
      </div>
    );
  }

  if (revealBack) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>{collectionName} - Flashcards</h2>
        <SearchLanguageToggle />
        <div className={styles.cardCounter}>
          <p>Review cards remaining: {cardInfo.searchData.total}</p>
        </div>
        <div className={styles.cardContentWrapper}>
          <div className={styles.cardContent}>
            <div className={styles.topLine}>
              <SingleTermTopline data={cardData} />
            </div>
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
          </div>
        </div>
        <StudyTermRepitionForm term={JSON.stringify(cardInfo.results)} />
      </div>
    );
  }
};

export default page;

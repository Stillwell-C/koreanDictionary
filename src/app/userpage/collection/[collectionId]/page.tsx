import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import TermListResult from "@/components/termListResult/TermListResult";
import { getSavedTerms } from "@/lib/apiData";
import styles from "./collectionPage.module.css";
import { Suspense } from "react";

type Props = {
  params: {
    collectionId: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
  };
};

const CollectionPage = async ({
  params: { collectionId },
  searchParams: { translation, transLang },
}: Props) => {
  const data: { _id: string; targetCode: string }[] = await getSavedTerms(
    collectionId
  );

  const terms =
    data?.length &&
    data.map((term) => (
      <TermListResult
        key={term._id}
        resultData={term}
        collectionId={collectionId}
        translation={translation}
        transLang={transLang}
      />
    ));

  return (
    <div className={styles.container}>
      <Suspense fallback={<p>Retrieving terms...</p>}>
        <div>
          <span>Translation language: </span>
          <SearchLanguageToggle />
        </div>
        <div className={styles.results}>
          {!data?.length && <p>No terms found</p>}
          {terms}
        </div>
      </Suspense>
    </div>
  );
};

export default CollectionPage;

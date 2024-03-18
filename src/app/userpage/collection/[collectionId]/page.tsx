import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import TermListResult from "@/components/termListResult/TermListResult";
import { getSavedTerms } from "@/lib/apiData";
import styles from "./collectionPage.module.css";
import { Suspense } from "react";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";

type Props = {
  params: {
    collectionId: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    start?: string;
  };
};

const CollectionPage = async ({
  params: { collectionId },
  searchParams: { translation, transLang, start },
}: Props) => {
  const data = await getSavedTerms(collectionId, start);

  const terms =
    data?.results?.length &&
    data.results.map((term) => (
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
          {!data?.results?.length && <p>No terms found</p>}
          {terms}
        </div>
        <SearchResultPaginationMenu searchData={data.searchData} />
      </Suspense>
    </div>
  );
};

export default CollectionPage;

import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import TermListResult from "@/components/termListResult/TermListResult";
import { getSavedTerms, getTermCollection } from "@/lib/apiData";
import styles from "./collectionPage.module.css";
import { Suspense } from "react";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/lib/auth";

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

export const generateMetadata = async ({
  params: { collectionId },
  searchParams: { translation, transLang, start },
}: Props): Promise<Metadata> => {
  const collection = await getTermCollection(collectionId);
  const session = await auth();

  return {
    title: `${collection?.name}`,
    description: `User ${session?.user?.username}'s collection ${collection?.name}`,
  };
};

const CollectionPage = async ({
  params: { collectionId },
  searchParams: { translation, transLang, start },
}: Props) => {
  const collection = await getTermCollection(collectionId);
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
        <div className={styles.collectionTop}>
          <h2>{collection.name}</h2>
          <div>
            <span>Download List: </span>
            <Link
              className={styles.link}
              href={`/api/termCollection/${collectionId}?format=csv${
                transLang ? `language=${transLang}` : ""
              }`}
            >
              CSV
            </Link>
          </div>
          <div>
            <SearchLanguageToggle />
          </div>
          <p>
            {`This list has ${data.searchData.total} ${
              data.searchData.total !== "1" ? "terms" : "term"
            }.`}
          </p>
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

import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import TermListResult from "@/components/termListResult/TermListResult";
import { getSavedTerms } from "@/lib/dbData";
import styles from "./collectionPage.module.css";
import { Suspense } from "react";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import DeleteCollectionDialog from "@/components/deleteCollectionDialog/DeleteCollectionDialog";
import DeleteCollectionButton from "@/components/Buttons/deleteCollectionButton/DeleteCollectionButton";
import StudyCollectionButton from "@/components/Buttons/studyCollectionButton/StudyCollectionButton";
import { notFound } from "next/navigation";

type Props = {
  params: {
    collectionId: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    start?: string;
    modal?: string;
  };
};

export const generateMetadata = async ({
  params: { collectionId },
  searchParams: { start },
}: Props): Promise<Metadata> => {
  const data = await getSavedTerms(collectionId, start);
  const session = await auth();

  const collectionName = data?.results[0]?.termCollectionId?.name;

  if (!collectionName) {
    return {
      title: "Collection not found.",
      description: "The collection you requested could not be found.",
    };
  }

  return {
    title: `${collectionName}`,
    description: `User ${session?.user?.username}'s collection ${collectionName}`,
  };
};

const CollectionPage = async ({
  params: { collectionId },
  searchParams: { translation, transLang, start, modal },
}: Props) => {
  const session = await auth();
  const data = await getSavedTerms(collectionId, start);
  const showModal = modal === "true";

  const collectionName = data?.results[0]?.termCollectionId?.name;

  if (!collectionName) {
    notFound();
  }

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

  const searchParamObj = { translation, transLang, start };
  let searchParamString = "";
  for (const [key, value] of Object.entries(searchParamObj)) {
    if (value) {
      searchParamString += searchParamString.length
        ? `&${key}=${value}`
        : `?${key}=${value}`;
    }
  }

  const openModalLink = searchParamString.length
    ? `/userpage/collection/${collectionId}${searchParamString}&modal=true`
    : `/userpage/collection/${collectionId}?modal=true`;
  const closeModalLink = `/userpage/collection/${collectionId}${searchParamString}`;

  return (
    <div className={styles.container}>
      <Suspense fallback={<p>Retrieving terms...</p>}>
        <div className={styles.collectionTop}>
          <h2>{collectionName}</h2>
          <div className={styles.btnContainer}>
            <StudyCollectionButton />
            <DeleteCollectionButton deleteCollectionLink={openModalLink} />
          </div>
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
      <DeleteCollectionDialog
        isOpen={showModal}
        closeLink={closeModalLink}
        collectionId={collectionId}
        userId={session?.user?.id || ""}
      />
    </div>
  );
};

export default CollectionPage;

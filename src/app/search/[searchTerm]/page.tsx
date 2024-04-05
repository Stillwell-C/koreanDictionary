import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import SearchResult from "@/components/searchResult/SearchResult";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";
import styles from "./wordSearch.module.css";
import { searchWord } from "@/lib/apiData";
import { Suspense } from "react";
import SmallSearchForm from "@/components/smallSearchForm/smallSearchForm";
import { Metadata } from "next";
import AddTermDialog from "@/components/AddTermDialog/AddTermDialog";
import { auth } from "@/lib/auth";

type Props = {
  params: {
    searchTerm: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    start?: string;
    modal?: string;
  };
};

export const generateMetadata = async ({
  params: { searchTerm },
  searchParams: { translation, transLang, start },
}: Props): Promise<Metadata> => {
  const data = await searchWord(
    decodeURI(searchTerm),
    translation,
    transLang,
    start
  );

  return {
    title: `Results for ${decodeURI(searchTerm)}`,
    description: `${data.searchData.total} search results found for ${decodeURI(
      searchTerm
    )}`,
  };
};

const WordSearch = async ({
  params: { searchTerm },
  searchParams: { translation, transLang, start, modal },
}: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  const modalOpen = modal === "true";

  const data = await searchWord(
    decodeURI(searchTerm),
    translation,
    transLang,
    start
  );

  const termLinkGenerator = (targetCode: string) => {
    return translation === "true"
      ? `/term/${targetCode}?translation=true&transLang=${transLang}`
      : `/term/${targetCode}`;
  };

  const searchParamObj = { translation, transLang, start };
  let searchParamString = "";
  for (const [key, value] of Object.entries(searchParamObj)) {
    if (value) {
      searchParamString += searchParamString.length
        ? `&${key}=${value}`
        : `?${key}=${value}`;
    }
  }

  const openModalLinkGenerator = (targetCode: string) => {
    return searchParamString.length
      ? `/search/${searchTerm}${searchParamString}&modal=true&modalTarget=${targetCode}`
      : `/search/${searchTerm}?modal=true&modalTarget=${targetCode}`;
  };

  const closeModalLink = `/search/${searchTerm}${searchParamString}`;

  return (
    <div className={styles.container}>
      <SmallSearchForm />
      <Suspense fallback={<p>Searching for: {decodeURI(searchTerm)}...</p>}>
        <div>
          <p className={styles.resultData}>
            Results for {decodeURI(searchTerm)}. {data.searchData.total} results
            found.
          </p>
        </div>
        <div>
          <SearchLanguageToggle />
        </div>
        <div className={styles.results}>
          {data.results.map((searchResult) => (
            <SearchResult
              key={searchResult.targetCode}
              resultData={searchResult}
              termLinkGenerator={termLinkGenerator}
              openModalLinkGenerator={openModalLinkGenerator}
            />
          ))}
        </div>
        {<SearchResultPaginationMenu searchData={data.searchData} />}
      </Suspense>
      {userId && modalOpen && (
        <AddTermDialog
          isOpen={modalOpen}
          closeLink={closeModalLink}
          userId={userId}
        />
      )}
    </div>
  );
};

export default WordSearch;

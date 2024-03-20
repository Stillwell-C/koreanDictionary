import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import SearchResult from "@/components/searchResult/SearchResult";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";
import styles from "./wordSearch.module.css";
import { searchWord } from "@/lib/apiData";
import { Suspense } from "react";
import SmallSearchForm from "@/components/smallSearchForm/smallSearchForm";
import { Metadata } from "next";

type Props = {
  params: {
    searchTerm: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    start?: string;
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
    title: `Search results for ${decodeURI(searchTerm)}`,
    description: `${data.searchData.total} search results found`,
  };
};

const WordSearch = async ({
  params: { searchTerm },
  searchParams: { translation, transLang, start },
}: Props) => {
  const data = await searchWord(
    decodeURI(searchTerm),
    translation,
    transLang,
    start
  );

  console.log(data);

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
              translation={translation}
              transLang={transLang}
            />
          ))}
        </div>
        {<SearchResultPaginationMenu searchData={data.searchData} />}
      </Suspense>
    </div>
  );
};

export default WordSearch;

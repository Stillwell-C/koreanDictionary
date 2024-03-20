import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import SearchResult from "@/components/searchResult/SearchResult";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";
import styles from "./wordSearch.module.css";
import { searchWord } from "@/lib/apiData";
import { Suspense } from "react";
import SmallSearchForm from "@/components/smallSearchForm/smallSearchForm";

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

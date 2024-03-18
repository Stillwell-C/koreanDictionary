"use client";

import { usePathname, useSearchParams } from "next/navigation";
import SearchResultPaginationButton from "./components/SearchResultPaginationButton";
import Link from "next/link";
import styles from "./SearchResultPaginationMenu.module.css";

type Props = {
  searchData: SearchResultSearchData;
};

const SearchResultPaginationMenu = ({
  searchData: { total, start, num },
}: Props) => {
  const totalNum = parseInt(total);
  const queriedNum = parseInt(num);
  const currentPageNum = parseInt(start);

  //Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  let currentURL = pathname;
  const searchParamsString = useSearchParams().toString();
  const editableSearchParams = new URLSearchParams(searchParamsString);
  editableSearchParams.delete("start");
  const currentSearchParamStringWithoutPage = editableSearchParams.toString();
  if (currentSearchParamStringWithoutPage.length)
    currentURL += `?${currentSearchParamStringWithoutPage}`;
  console.log(decodeURI(currentURL));

  if (totalNum <= 10) return;

  const totalPages = Math.ceil(totalNum / queriedNum);

  const menuButtons = [];

  const generatePaginationButton = (key: number, pageNum: number) => (
    <SearchResultPaginationButton
      key={key}
      pageNum={pageNum}
      currentPageNum={currentPageNum}
      currentURL={currentURL}
    />
  );

  if (totalPages <= 10 || currentPageNum <= 6) {
    const displayCount = totalPages > 10 ? 10 : totalPages;
    for (let i = 1; i <= displayCount; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  } else if (totalPages - currentPageNum <= 9) {
    for (let i = totalPages - 9; i <= totalPages; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  } else {
    for (let i = currentPageNum - 4; i <= currentPageNum + 5; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  }

  const paginationMenu = (
    <nav
      className={styles.container}
      aria-label='Search Results Pagination Navigation'
    >
      <Link href={currentURL}>
        <button
          type='button'
          disabled={currentPageNum <= 1 ? true : false}
          aria-disabled={currentPageNum <= 1 ? true : false}
          aria-label='Skip to page 1.'
        >
          &laquo;
        </button>
      </Link>
      <Link
        href={
          currentPageNum <= 2
            ? currentURL
            : `${currentURL}&start=${currentPageNum - 1}`
        }
      >
        <button
          type='button'
          disabled={currentPageNum <= 1 ? true : false}
          aria-disabled={currentPageNum <= 1 ? true : false}
          aria-label={`Move one page back ${
            currentPageNum !== 1 ? `to page ${currentPageNum - 1}` : ""
          }`}
        >
          &lsaquo;
        </button>
      </Link>
      {menuButtons}
      <Link href={`${currentURL}&start=${currentPageNum + 1}`}>
        <button
          type='button'
          disabled={currentPageNum === totalPages ? true : false}
          aria-disabled={currentPageNum === totalPages ? true : false}
          aria-label={`Move one page forward ${
            currentPageNum !== totalPages ? `to page ${currentPageNum + 1}` : ""
          }`}
        >
          &rsaquo;
        </button>
      </Link>
      <Link href={`${currentURL}&start=${totalPages}`}>
        <button
          type='button'
          disabled={currentPageNum === totalPages ? true : false}
          aria-disabled={currentPageNum === totalPages ? true : false}
          aria-label={`Skip to last page, page ${totalPages}`}
        >
          &raquo;
        </button>
      </Link>
    </nav>
  );

  return paginationMenu;
};

export default SearchResultPaginationMenu;

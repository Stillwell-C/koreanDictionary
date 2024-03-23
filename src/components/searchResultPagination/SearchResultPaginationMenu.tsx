"use client";

import { usePathname, useSearchParams } from "next/navigation";
import SearchResultPaginationButton from "./components/SearchResultPaginationButton";
import styles from "./SearchResultPaginationMenu.module.css";
import SkipToFirstBtn from "./components/SkipToFirstBtn";
import SkipToLastBtn from "./components/SkipToLastPage";
import MoveBackBtn from "./components/MoveBackBtn";
import MoveForwardBtn from "./components/MoveForwardBtn";
import { useCallback } from "react";

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
  const searchParams = useSearchParams();

  const pageUrlGenerator = useCallback(
    (start: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("start");
      if (start !== 1) params.set("start", start.toString());

      const paramString = params.toString();

      return paramString.length ? `${pathname}?${paramString}` : pathname;
    },
    [searchParams]
  );

  if (totalNum <= 10) return;

  const totalPages = Math.ceil(totalNum / queriedNum);

  const menuButtons = [];

  const generatePaginationButton = (key: number, pageNum: number) => (
    <SearchResultPaginationButton
      key={key}
      pageNum={pageNum}
      currentPageNum={currentPageNum}
      pageUrlGenerator={pageUrlGenerator}
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
      <SkipToFirstBtn
        currentPageNum={currentPageNum}
        pageUrlGenerator={pageUrlGenerator}
      />
      <MoveBackBtn
        currentPageNum={currentPageNum}
        pageUrlGenerator={pageUrlGenerator}
      />
      {menuButtons}
      <MoveForwardBtn
        currentPageNum={currentPageNum}
        pageUrlGenerator={pageUrlGenerator}
        totalPages={totalPages}
      />
      <SkipToLastBtn
        currentPageNum={currentPageNum}
        pageUrlGenerator={pageUrlGenerator}
        totalPages={totalPages}
      />
    </nav>
  );

  return paginationMenu;
};

export default SearchResultPaginationMenu;

"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  pageNum: number;
  currentPageNum: number;
  pageUrlGenerator: (page: number) => string;
};

const SearchResultPaginationButton = ({
  pageNum,
  currentPageNum,
  pageUrlGenerator,
}: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    const url = pageUrlGenerator(pageNum);
    router.push(url);
  };

  return (
    <button
      type='button'
      className={`posts-pagination-btn basic-button ${
        currentPageNum === pageNum && "highlighted-btn"
      }`}
      disabled={currentPageNum === pageNum ? true : false}
      aria-current={currentPageNum === pageNum ? true : false}
      aria-label={
        currentPageNum === pageNum
          ? `Current Page, Page ${pageNum}`
          : `Page ${pageNum}`
      }
      onClick={handleRoute}
    >
      {pageNum}
    </button>
  );
};

export default SearchResultPaginationButton;

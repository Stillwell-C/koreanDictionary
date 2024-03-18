import Link from "next/link";
import React from "react";

type Props = {
  pageNum: number;
  currentPageNum: number;
  currentURL: string;
};

const SearchResultPaginationButton = ({
  pageNum,
  currentPageNum,
  currentURL,
}: Props) => {
  const linkURL = pageNum <= 1 ? currentURL : `${currentURL}&start=${pageNum}`;

  return (
    <Link href={linkURL}>
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
        //   onClick={() => setCurrentPage(pageNum)}
      >
        {pageNum}
      </button>
    </Link>
  );
};

export default SearchResultPaginationButton;

import React from "react";

type Props = {
  pageNum: number;
  currentPageNum: number;
};

const SearchResultPaginationButton = ({ pageNum, currentPageNum }: Props) => {
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
      //   onClick={() => setCurrentPage(pageNum)}
    >
      {pageNum}
    </button>
  );
};

export default SearchResultPaginationButton;

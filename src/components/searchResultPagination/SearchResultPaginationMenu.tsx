import React from "react";
import SearchResultPaginationButton from "./components/SearchResultPaginationButton";

type Props = {
  searchData: SearchResultSearchData;
};

const SearchResultPaginationMenu = ({
  searchData: { total, start, num },
}: Props) => {
  const totalNum = parseInt(total);
  const queriedNum = parseInt(num);
  const currentPageNum = parseInt(start);

  if (totalNum <= 10) return;

  const totalPages = Math.ceil(totalNum / queriedNum);

  const menuButtons = [];

  const generatePaginationButton = (key: number, pageNum: number) => (
    <SearchResultPaginationButton
      key={key}
      pageNum={pageNum}
      currentPageNum={currentPageNum}
    />
  );

  if (totalPages <= 5 || currentPageNum <= 3) {
    const displayCount = totalPages > 5 ? 5 : totalPages;
    for (let i = 1; i <= displayCount; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  } else if (totalPages - currentPageNum === 1) {
    for (let i = currentPageNum - 3; i <= totalPages; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  } else if (totalPages === currentPageNum) {
    for (let i = currentPageNum - 4; i <= totalPages; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  } else {
    for (let i = currentPageNum - 2; i <= currentPageNum + 2; i++) {
      menuButtons.push(generatePaginationButton(i, i));
    }
  }

  const paginationMenu = (
    <nav
      className='post-pagination-nav gap-5p flex-container margin-top-1 margin-btm-2'
      aria-label='Search Results Pagination Navigation'
    >
      <button
        type='button'
        className='posts-pagination-btn posts-pagination-btn-small basic-button'
        disabled={currentPageNum <= 1 ? true : false}
        aria-disabled={currentPageNum <= 1 ? true : false}
        aria-label='Skip to page 1.'
        // onClick={() => setCurrentPage(1)}
      >
        &laquo;
      </button>
      <button
        type='button'
        className='posts-pagination-btn posts-pagination-btn-small basic-button'
        disabled={currentPageNum <= 1 ? true : false}
        aria-disabled={currentPageNum <= 1 ? true : false}
        aria-label={`Move one page back ${
          currentPageNum !== 1 ? `to page ${currentPageNum - 1}` : ""
        }`}
        // onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        &lsaquo;
      </button>
      {menuButtons}
      <button
        type='button'
        className='posts-pagination-btn posts-pagination-btn-small basic-button'
        disabled={currentPageNum === totalPages ? true : false}
        aria-disabled={currentPageNum === totalPages ? true : false}
        aria-label={`Move one page forward ${
          currentPageNum !== totalPages ? `to page ${currentPageNum + 1}` : ""
        }`}
        // onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        &rsaquo;
      </button>
      <button
        type='button'
        className='posts-pagination-btn posts-pagination-btn-small basic-button'
        disabled={currentPageNum === totalPages ? true : false}
        aria-disabled={currentPageNum === totalPages ? true : false}
        aria-label={`Skip to last page, page ${totalPages}`}
        // onClick={() => setCurrentPage(totalPages)}
      >
        &raquo;
      </button>
    </nav>
  );

  return paginationMenu;
};

export default SearchResultPaginationMenu;

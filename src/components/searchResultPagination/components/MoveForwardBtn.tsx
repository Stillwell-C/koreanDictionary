"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  pageUrlGenerator: (page: number) => string;
  currentPageNum: number;
  totalPages: number;
};

const MoveForwardBtn = ({
  pageUrlGenerator,
  currentPageNum,
  totalPages,
}: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(pageUrlGenerator(currentPageNum + 1));
  };

  return (
    <button
      type='button'
      disabled={currentPageNum === totalPages ? true : false}
      aria-disabled={currentPageNum === totalPages ? true : false}
      aria-label={`Move one page forward ${
        currentPageNum !== totalPages ? `to page ${currentPageNum + 1}` : ""
      }`}
      onClick={handleRoute}
    >
      &rsaquo;
    </button>
  );
};

export default MoveForwardBtn;

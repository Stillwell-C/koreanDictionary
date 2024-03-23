"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  pageUrlGenerator: (page: number) => string;
  currentPageNum: number;
};

const MoveBackBtn = ({ pageUrlGenerator, currentPageNum }: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(pageUrlGenerator(currentPageNum - 1));
  };

  return (
    <button
      type='button'
      disabled={currentPageNum <= 1 ? true : false}
      aria-disabled={currentPageNum <= 1 ? true : false}
      aria-label={`Move one page back ${
        currentPageNum !== 1 ? `to page ${currentPageNum - 1}` : ""
      }`}
      onClick={handleRoute}
    >
      &lsaquo;
    </button>
  );
};

export default MoveBackBtn;

"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  pageUrlGenerator: (page: number) => string;
  currentPageNum: number;
};

const SkipToFirstBtn = ({ pageUrlGenerator, currentPageNum }: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(pageUrlGenerator(1));
  };

  return (
    <button
      type='button'
      disabled={currentPageNum <= 1 ? true : false}
      aria-disabled={currentPageNum <= 1 ? true : false}
      aria-label='Skip to page 1.'
      onClick={handleRoute}
    >
      &laquo;
    </button>
  );
};

export default SkipToFirstBtn;

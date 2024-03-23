"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  pageUrlGenerator: (page: number) => string;
  currentPageNum: number;
  totalPages: number;
};

const SkipToLastBtn = ({
  pageUrlGenerator,
  currentPageNum,
  totalPages,
}: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(pageUrlGenerator(totalPages));
  };

  return (
    <button
      type='button'
      disabled={currentPageNum === totalPages ? true : false}
      aria-disabled={currentPageNum === totalPages ? true : false}
      aria-label={`Skip to last page, page ${totalPages}`}
      onClick={handleRoute}
    >
      &raquo;
    </button>
  );
};

export default SkipToLastBtn;

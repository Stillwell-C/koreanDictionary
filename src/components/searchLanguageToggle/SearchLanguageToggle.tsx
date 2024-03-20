"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LanguageSelect from "../LanguageSelect/LanguageSelect";

const SearchLanguageToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const transLang = parseInt(searchParams.get("transLang") || "0");
  const start = searchParams.get("start");

  const handleChangeLanguage = (e: number) => {
    if (e === transLang) return;
    //Change site language preference to new language
    localStorage.setItem("langPreference", e.toString());
    //Change url to fulfill new query
    router.push(
      `${pathname}${e !== 0 ? `?translation=true&transLang=${e}` : ""}${
        start ? `&start=${start}` : ""
      }`
    );
  };

  return (
    <LanguageSelect
      currentLanguage={transLang}
      handleChangeLanguage={handleChangeLanguage}
    />
  );
};

export default SearchLanguageToggle;

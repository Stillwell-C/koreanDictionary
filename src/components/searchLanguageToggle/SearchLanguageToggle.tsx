"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LanguageSelect from "../LanguageSelect/LanguageSelect";

const SearchLanguageToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const transLang = parseInt(searchParams.get("transLang") || "0");

  const handleChangeLanguage = (e: number) => {
    if (e === transLang) return;
    //Change site language preference to new language
    localStorage.setItem("langPreference", e.toString());
    //Change url to fulfill new query
    const params = new URLSearchParams(searchParams.toString());
    //If e is 0, no need to use search params
    if (!e) {
      params.delete("translation");
      params.delete("transLang");
    }
    if (e) {
      params.set("translation", "true");
      params.set("transLang", e.toString());
    }
    const paramString = params.toString();
    router.push(paramString.length ? `${pathname}?${paramString}` : pathname);
  };

  return (
    <LanguageSelect
      currentLanguage={transLang}
      handleChangeLanguage={handleChangeLanguage}
    />
  );
};

export default SearchLanguageToggle;

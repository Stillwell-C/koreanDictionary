"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchLanguageToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const translation = searchParams.get("translation");
  const transLang = searchParams.get("transLang");
  const start = searchParams.get("start");

  const languages = [
    { display: "한국어", value: 0 },
    { display: "English", value: 1 },
    { display: "日本語", value: 2 },
    { display: "Français", value: 3 },
    { display: "Español", value: 4 },
    { display: "العربية", value: 5 },
    { display: "монгол", value: 6 },
    { display: "Tiếng Việt", value: 7 },
    { display: "ไทย", value: 8 },
    { display: "Indonesia", value: 9 },
    { display: "русский", value: 10 },
    { display: "中文", value: 11 },
  ];

  const options = languages.map((language) => (
    <option key={language.value} value={language.value}>
      {language.display}
    </option>
  ));

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === transLang) return;
    //Change site language preference to new language
    localStorage.setItem("langPreference", e.target.value);
    //Change url to fulfill new query
    router.push(
      `${pathname}${
        e.target.value !== "0"
          ? `?translation=true&transLang=${e.target.value}`
          : ""
      }${start ? `&start=${start}` : ""}`
    );
  };

  console.log(translation, transLang, start);
  return (
    <select onChange={handleChangeLanguage} value={transLang || "0"}>
      {options}
    </select>
  );
};

export default SearchLanguageToggle;

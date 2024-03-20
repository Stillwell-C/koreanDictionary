"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./searchForm.module.css";
import LanguageSelect from "../LanguageSelect/LanguageSelect";

const SearchForm = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectValue, setSelectValue] = useState(0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.length) return;
    router.push(
      `/search/${searchTerm}${
        selectValue !== 0 ? `?translation=true&transLang=${selectValue}` : ""
      }`
    );
  };

  useEffect(() => {
    const languagePreference = localStorage.getItem("langPreference");
    if (languagePreference) setSelectValue(parseInt(languagePreference));
  }, []);

  const handleChangeLanguage = (e: number) => {
    setSelectValue(e);
    localStorage.setItem("langPreference", e.toString());
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <div className={styles.label}>
          <label htmlFor='searchTerm'>Search</label>
        </div>
        <div>
          <input
            id='searchTerm'
            name='searchTerm'
            type='text'
            autoComplete='off'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
          />
          <button className={styles.button} type='submit'>
            Submit
          </button>
        </div>
        <div className={styles.select}>
          <LanguageSelect
            currentLanguage={selectValue}
            handleChangeLanguage={handleChangeLanguage}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchForm;

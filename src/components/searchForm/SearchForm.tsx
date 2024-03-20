"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import styles from "./searchForm.module.css";
import { FiCheck, FiChevronDown } from "react-icons/fi";

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
    // <option key={language.value} value={language.value}>
    //   {language.display}
    // </option>
    <Listbox.Option
      className={({ active }) =>
        active ? `${styles.option} ${styles.optionActive}` : styles.option
      }
      key={language.value}
      value={language.value}
    >
      <span className={styles.optionCheck}>
        {language.value === selectValue && <FiCheck />}
      </span>
      <span>{language.display}</span>
    </Listbox.Option>
  ));

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
          {/* <select value={selectValue || "0"} onChange={handleChangeLanguage}>
            {options}
          </select> */}
          <Listbox value={selectValue} onChange={handleChangeLanguage}>
            <div className={styles.listboxContent}>
              <Listbox.Button className={styles.listboxButton}>
                <span>{languages[selectValue].display}</span>
                <span className={styles.listboxButtonIcon}>
                  <FiChevronDown />
                </span>
              </Listbox.Button>
              <Listbox.Options className={styles.listboxOptions}>
                {options}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;

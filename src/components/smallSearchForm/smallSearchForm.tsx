"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./smallSearchForm.module.css";

type Props = {};

const SmallSearchForm = (props: Props) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const transLang = useSearchParams().get("transLang");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.length) return;

    router.push(
      `/search/${searchTerm}${
        transLang?.length ? `?translation=true&transLang=${transLang}` : ""
      }`
    );
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <div className={styles.label}>
          <label htmlFor='searchTerm'>Search</label>
        </div>
        <div className={styles.inputContainer}>
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
      </form>
    </div>
  );
};

export default SmallSearchForm;

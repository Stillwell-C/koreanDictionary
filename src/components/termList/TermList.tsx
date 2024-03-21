"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./termList.module.css";

type Props = {
  collectionId: string;
  name: string;
};

const TermList = ({ collectionId, name }: Props) => {
  const [languagePreference, setLanguagePreference] = useState("");

  useEffect(() => {
    const languagePreference = localStorage.getItem("langPreference");
    if (languagePreference) setLanguagePreference(languagePreference);
  }, []);

  const collectionLink =
    languagePreference !== "0" && languagePreference !== ""
      ? `/userpage/collection/${collectionId}?translation=true&transLang=${languagePreference}`
      : `/userpage/collection/${collectionId}`;

  return (
    <div>
      <Link className={styles.collection} href={collectionLink}>
        {name}
      </Link>
    </div>
  );
};

export default TermList;

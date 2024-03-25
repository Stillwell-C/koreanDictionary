import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import styles from "./aboutPage.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Korean Dictionary About Page",
};

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textWrapper}>
        <h2>About</h2>
        <div className={styles.paragraphWrapper}>
          <p>
            <Link href={"/term/40655"}>꼬박꼬박</Link> [/k̕obakk̕obak/] is a
            mimetic adverb used in Korean to describe an action done regularly
            or continually. I hope this project can help motivate Korean
            learners to use flashcards more regularly by automating often
            time-consuming process of making them one by one.
          </p>
          <p>This project was made with Next.js.</p>
          <p>
            Using the open dictionary API provided by the{" "}
            <a href='https://krdict.korean.go.kr/openApi/openApiInfo'>
              National Institute of Korean Language
            </a>
            , users can search words in multiple languages and, after creating
            an account, save words to their word lists. They can then download
            this data - words, definitions, example sentences, etc. - as a CSV
            file which can be imported into flash card applications like{" "}
            <a href='https://apps.ankiweb.net/'>Anki</a>. This currently works,
            but I will continue to work on improving this feature. I will add
            more detailed information on importing this into Anki in a future
            blog posts. I may also add some kind of built-in flashcard feature
            in the future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

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
          <p>
            This project was made with Next.js and uses an{" "}
            <a
              href='https://krdict.korean.go.kr/openApi/openApiInfo'
              target='_blank'
            >
              open dictionary API
            </a>{" "}
            provided by the National Institute of Korean Language. Users can
            search words for Korean words only, but are able to get results in
            11 different languages. After creating an account and logging in,
            you can save words to term collections. These collections can be
            viewed on a user&apos;s profile page and can be studied as
            flashcards in this app or downloaded as a CSV file which can be
            imported into flash card applications like{" "}
            <a href='https://apps.ankiweb.net/' target='_blank'>
              Anki
            </a>
            . This currently works, but I am still working on improving this
            feature. I will add more detailed information on importing this into
            Anki in a future blog posts.
          </p>
          <p>
            Visit the GitHub repo for this project{" "}
            <a
              href='https://github.com/Stillwell-C/koreanDictionary'
              target='_blank'
            >
              here
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

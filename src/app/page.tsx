import styles from "./page.module.css";
import WordSearch from "./components/WordSearch";
import SearchForm from "../components/searchForm/SearchForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dictionary Homepage",
  description: "Korean Dictionary Homepage",
};

export default function Home() {
  return (
    <main className={styles.main}>
      <SearchForm />
      {/* <WordSearch /> */}
    </main>
  );
}

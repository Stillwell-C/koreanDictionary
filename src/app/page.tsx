import styles from "./page.module.css";
import WordSearch from "./components/WordSearch";
import SearchForm from "../components/searchForm/SearchForm";

export default function Home() {
  return (
    <main className={styles.main}>
      <SearchForm />
      {/* <WordSearch /> */}
    </main>
  );
}

import styles from "./page.module.css";
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
    </main>
  );
}

"use client";

import { Metadata } from "next";
import styles from "./error.module.css";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page your requested was not found",
};

const NotFound = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2>Page Not Found</h2>
        <p>The page your requested could not be found</p>
      </div>
      <div className={styles.buttonDiv}>
        <button className={styles.purpleBtn} onClick={() => router.push("/")}>
          Take me home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

"use client";

import styles from "./error.module.css";
import { useRouter } from "next/navigation";

type Props = {};

const NotFound = (props: Props) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2>Page Not Found</h2>
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

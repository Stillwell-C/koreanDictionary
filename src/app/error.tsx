"use client";

import styles from "./error.module.css";
import { useRouter } from "next/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  const router = useRouter();

  console.log(error.message);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p className={styles.bold}>There was a problem.</p>
        <h2>{error.message || "Something went wrong!"}</h2>
        <p>Please try again later and contact us if the problem persists.</p>
      </div>
      <div className={styles.buttonDiv}>
        <button className={styles.purpleBtn} onClick={reset}>
          Try again
        </button>
        <button className={styles.greyBtn} onClick={() => router.push("/")}>
          Take me home
        </button>
      </div>
    </div>
  );
};

export default Error;

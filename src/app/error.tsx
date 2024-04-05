"use client";

import { Metadata } from "next";
import styles from "./error.module.css";
import { useRouter } from "next/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const metadata: Metadata = {
  title: "Error",
  description: "An error occurred",
};

const Error = ({ error, reset }: Props) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>There was a problem.</p>
        <h2>{"Something went wrong :("}</h2>
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

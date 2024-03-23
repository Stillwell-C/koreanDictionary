"use client";

import { useRouter } from "next/navigation";
import styles from "./addTermButton.module.css";

type Props = {
  userId: string;
  openModalLink: string;
};

const AddTermButton = ({ userId, openModalLink }: Props) => {
  const router = useRouter();

  const unauthorizedUserButton = (
    <button className={styles.button} onClick={() => router.push("/login")}>
      Save Term
    </button>
  );

  const authorizedUserButton = (
    <button
      className={styles.button}
      onClick={() => router.push(openModalLink)}
    >
      Save Term
    </button>
  );

  return userId ? authorizedUserButton : unauthorizedUserButton;
};

export default AddTermButton;

"use client";

import { useRouter } from "next/navigation";
import styles from "./moveToCollectionsButton.module.css";

const MoveToCollectionsButton = () => {
  const router = useRouter();

  const handleRouting = () => {
    router.push("/userpage");
  };

  return (
    <button className={styles.greyBtn} onClick={handleRouting}>
      Back to Collections
    </button>
  );
};

export default MoveToCollectionsButton;

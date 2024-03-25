"use client";

import { useRouter } from "next/navigation";
import styles from "./deleteCollectionButton.module.css";

type Props = {
  deleteCollectionLink: string;
};

const DeleteCollectionButton = ({ deleteCollectionLink }: Props) => {
  const router = useRouter();

  const handleRouting = () => {
    router.push(deleteCollectionLink);
  };

  return (
    <button className={styles.deleteCollectionLink} onClick={handleRouting}>
      Delete Collection
    </button>
  );
};

export default DeleteCollectionButton;

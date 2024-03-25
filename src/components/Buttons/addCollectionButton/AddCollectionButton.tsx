"use client";

import { useRouter } from "next/navigation";
import styles from "./addCollectionButton.module.css";

type Props = {
  addCollectionLink: string;
};

const AddCollectionButton = ({ addCollectionLink }: Props) => {
  const router = useRouter();

  const handleRouting = () => {
    router.push(addCollectionLink);
  };

  return (
    <button className={styles.newCollectionLink} onClick={handleRouting}>
      Add Collection
    </button>
  );
};

export default AddCollectionButton;

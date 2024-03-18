"use client";

import { removeTermFromList } from "@/lib/action";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import styles from "./removeTermForm.module.css";

type Props = {
  targetCode: string;
  termCollectionId: string;
};

const RemoveTermForm = ({ targetCode, termCollectionId }: Props) => {
  const router = useRouter();
  const messageRef = useRef<HTMLParagraphElement>(null);

  const [state, formAction] = useFormState(removeTermFromList, null);
  const [displayMessage, setDisplayMessage] = useState(false);

  useEffect(() => {
    if (state?.error || state?.success) {
      setDisplayMessage(true);
      messageRef?.current?.focus();
      const displayTimeout = setTimeout(() => {
        setDisplayMessage(false);
      }, 5000);

      return () => clearTimeout(displayTimeout);
    }
  }, [state]);

  const message = state?.success
    ? "Removed from List"
    : state?.errorMsg || "Error. Try again.";

  return (
    <form className={styles.form} action={formAction}>
      <input type='text' value={targetCode} name='targetCode' hidden readOnly />
      <input
        type='text'
        value={termCollectionId}
        name='termCollectionId'
        hidden
        readOnly
      />
      <button className={styles.button} disabled={state?.success} type='submit'>
        Delete
      </button>
      <div
        className={`${styles.message} ${
          displayMessage ? styles.displayMessage : ""
        }`}
      >
        <p ref={messageRef}>{message}</p>
      </div>
    </form>
  );
};

export default RemoveTermForm;

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./collectionResult.module.css";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { addTermToList } from "@/lib/action";

type Props = {
  result: {
    _id: string;
    name: string;
  };
  userId: string;
};

const CollectionResult = ({ result: { _id, name }, userId }: Props) => {
  const messageRef = useRef<HTMLParagraphElement>(null);
  const targetCode = useSearchParams().get("modalTarget");

  const [state, formAction] = useFormState(addTermToList, null);
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
    ? "Added to List"
    : state?.errorMsg || "Error. Try again.";

  return (
    <div className={styles.container}>
      <div className={styles.topLine}>
        <span className={styles.listname}>{name}</span>
        <div className={styles.formContainer}>
          {/* <AddTermForm userId={userId} termCollectionId={_id} /> */}
          <form action={formAction}>
            <input
              type='text'
              value={targetCode || ""}
              name='targetCode'
              hidden
              readOnly
            />
            <input type='text' value={userId} name='userId' hidden readOnly />
            <input
              type='text'
              value={_id}
              name='termCollectionId'
              hidden
              readOnly
            />
            <button
              className={styles.button}
              disabled={state?.success}
              type='submit'
            >
              {state?.success ? "Saved" : "Save Term"}
            </button>
            {/* <div
              className={`${styles.message} ${
                displayMessage ? styles.displayMessage : ""
              }`}
              className={`${styles.message} ${styles.displayMessage}`}
              aria-hidden={!displayMessage}
            >
              <p ref={messageRef}>{message}</p>
            </div> */}
          </form>
        </div>
      </div>
      <div
        aria-hidden={!displayMessage}
        className={`${styles.bottomLine} ${
          displayMessage ? styles.displayMessage : ""
        }`}
        // className={`${styles.bottomLine} ${styles.displayMessage}`}
      >
        <div
          className={`${styles.messageDiv} ${
            displayMessage ? styles.displayMessage : ""
          }`}
          ref={messageRef}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default CollectionResult;

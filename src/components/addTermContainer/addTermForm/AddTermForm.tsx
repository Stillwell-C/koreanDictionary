"use client";

import { addTermToList } from "@/lib/action";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import styles from "./addTermForm.module.css";

type Props = {
  targetCode: string;
  userSession: Session | null;
};

const AddTermForm = ({ targetCode, userSession }: Props) => {
  const router = useRouter();
  const messageRef = useRef<HTMLParagraphElement>(null);

  const [state, formAction] = useFormState(addTermToList, null);
  const [displayMessage, setDisplayMessage] = useState(false);

  const unauthorizedUserButton = (
    <button className={styles.button} onClick={() => router.push("/login")}>
      Save Term
    </button>
  );

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

  const addTermForm = (
    <form className={styles.form} action={formAction}>
      <input type='text' value={targetCode} name='targetCode' hidden readOnly />
      <input
        type='text'
        value={userSession?.user?.id}
        name='userId'
        hidden
        readOnly
      />
      <button className={styles.button} disabled={state?.success} type='submit'>
        {state?.success ? "Saved" : "Save Term"}
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

  return userSession ? addTermForm : unauthorizedUserButton;
};

export default AddTermForm;

"use client";

import { assessUserStudyResponse } from "@/lib/action";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import styles from "./studyTermRepititionForm.module.css";

type Props = {
  term: string;
};

const StudyTermRepitionForm = ({ term }: Props) => {
  const router = useRouter();

  const [state, formAction] = useFormState(assessUserStudyResponse, null);

  // Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCard = searchParams.get("card") || "1";
  const nextCard = parseInt(currentCard) + 1;

  const params = new URLSearchParams(searchParams.toString());
  params.delete("reveal");
  params.delete("card");
  params.set("card", nextCard.toString());
  const paramString = params.toString();
  const advanceUrl = `${pathname}?${paramString}`;

  // Advance card upon successful form action
  useEffect(() => {
    if (state?.success) {
      router.push(advanceUrl);
    }
  }, [state]);

  // const stringifiedTerm = JSON.stringify(term);

  // return <div>Button</div>;

  return (
    <form className={styles.container} action={formAction}>
      <input type='text' value={term} name='formTerm' hidden readOnly />
      <button
        className={styles.btnRepeat}
        type='submit'
        name='formResponseQuality'
        value='0'
      >
        Repeat
      </button>
      <button
        className={styles.btnHard}
        type='submit'
        name='formResponseQuality'
        value='1'
      >
        Hard
      </button>
      <button
        className={styles.btnGood}
        type='submit'
        name='formResponseQuality'
        value='3'
      >
        Good
      </button>
      <button
        className={styles.btnEasy}
        type='submit'
        name='formResponseQuality'
        value='5'
      >
        Easy
      </button>
    </form>
  );
};

export default StudyTermRepitionForm;

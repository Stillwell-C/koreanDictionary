"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./studyAgainButton.module.css";
import { increaseTodaysCardsAction } from "@/lib/action";
import { useFormState } from "react-dom";
import { useEffect } from "react";

type Props = {
  termCollectionId: string;
};

const StudyAgainButton = ({ termCollectionId }: Props) => {
  const router = useRouter();

  const [state, formAction] = useFormState(increaseTodaysCardsAction, null);

  //Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  params.delete("reveal");
  params.set("card", "1");
  const paramString = params.toString();
  const studyUrl = `${pathname}?${paramString}`;

  useEffect(() => {
    if (state?.success) {
      router.push(studyUrl);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input
        type='text'
        name='termCollectionId'
        value={termCollectionId}
        hidden
        readOnly
      />
      <button className={styles.purpleBtn} type='submit'>
        Increase today&apos;s terms
      </button>
    </form>
  );
};

export default StudyAgainButton;

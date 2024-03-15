"use client";

import { addTermToList } from "@/lib/action";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormState } from "react-dom";

type Props = {
  targetCode: string;
  userSession: Session | null;
};

const AddTermForm = ({ targetCode, userSession }: Props) => {
  const router = useRouter();

  const [state, formAction] = useFormState(addTermToList, null);

  const unauthorizedUserButton = (
    <button onClick={() => router.push("/login")}>Save Term</button>
  );

  const addTermForm = (
    <form action={formAction}>
      <input type='text' value={targetCode} name='targetCode' hidden />
      <input type='text' value={userSession?.user?.id} name='userId' hidden />
      <button type='submit'>Save Term</button>
    </form>
  );

  return userSession ? addTermForm : unauthorizedUserButton;
};

export default AddTermForm;

import { auth } from "@/lib/auth";
import React from "react";
import AddTermForm from "./addTermForm/AddTermForm";

type Props = {
  targetCode: string;
};

const AddTermContainer = async ({ targetCode }: Props) => {
  const userSession = await auth();

  return <AddTermForm targetCode={targetCode} userSession={userSession} />;
};

export default AddTermContainer;

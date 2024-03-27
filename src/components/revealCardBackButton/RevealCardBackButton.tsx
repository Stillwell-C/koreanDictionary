"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./revealCardBackButton.module.css";

const RevealCardBackButton = () => {
  const router = useRouter();

  //Get string of pathname & searchparams without start searchparam
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  params.set("reveal", "true");
  const paramString = params.toString();
  const revealUrl = `${pathname}?${paramString}`;

  const handleRouting = () => router.push(revealUrl);

  return (
    <button className={styles.button} onClick={handleRouting}>
      Show
    </button>
  );
};

export default RevealCardBackButton;

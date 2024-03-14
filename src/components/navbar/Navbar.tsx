import Link from "next/link";
import React from "react";
import Links from "./links/Links";
import styles from "./navbar.module.css";
import { auth } from "@/lib/auth";

const Navbar = async () => {
  const userSession = await auth();
  console.log(userSession);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <Link href='/'>Korean Dictionary</Link>
      </h1>
      <div>
        <Links userSession={userSession} />
      </div>
    </div>
  );
};

export default Navbar;

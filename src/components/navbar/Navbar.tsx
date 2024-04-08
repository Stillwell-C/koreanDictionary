import Link from "next/link";
import React from "react";
import Links from "./links/Links";
import styles from "./navbar.module.css";
import { auth } from "@/lib/auth";
import Image from "next/image";

const Navbar = async () => {
  const userSession = await auth();

  return (
    <div className={styles.container}>
      <div>
        <Link className={styles.headerLink} href='/'>
          <div className={styles.imgDiv}>
            <Image src='/Taegeuk.svg' alt='' height='40' width='40' />
          </div>
          <div className={styles.headingText}>
            <h1 className={styles.heading}>
              <span>꼬</span>
              <span>박</span>
              <span>꼬</span>
              <span>박</span>
            </h1>

            <div className={styles.subheading}>
              <span>사전 & 플래시카드</span>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Links userSession={userSession} />
      </div>
    </div>
  );
};

export default Navbar;

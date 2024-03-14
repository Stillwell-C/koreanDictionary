import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.information}>
        <span>Stillwell-C</span>
        <span> | </span>
        <a
          href='https://github.com/Stillwell-C'
          target='_blank'
          aria-label='github'
        >
          <Image src='/github.svg' width='20' height='20' alt='' />
        </a>
      </div>
    </div>
  );
};

export default Footer;

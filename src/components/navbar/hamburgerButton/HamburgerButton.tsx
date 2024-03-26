"use client";

import styles from "./hamburgerButton.module.css";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HamburgerButton = ({ mobileOpen, setMobileOpen }: Props) => {
  return (
    <button
      className={styles.menuBtn}
      onClick={() => setMobileOpen((prev) => !prev)}
      aria-label={`${mobileOpen ? "Open" : "Close"} mobile menu`}
    >
      <div
        className={`${styles.menuLine} ${
          mobileOpen ? `${styles.menuLine1}` : ""
        }`}
      ></div>
      <div
        className={`${styles.menuLine} ${
          mobileOpen ? `${styles.menuLine2}` : ""
        }`}
      ></div>
      <div
        className={`${styles.menuLine} ${
          mobileOpen ? `${styles.menuLine3}` : ""
        }`}
      ></div>
    </button>
  );
};

export default HamburgerButton;

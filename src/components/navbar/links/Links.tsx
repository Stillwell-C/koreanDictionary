"use client";

import React, { useState } from "react";
import NavLink from "./navLink/NavLink";
import styles from "./links.module.css";

const Links = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linksList = [
    {
      name: "Homepage",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const links = (
    <>
      {linksList.map((link) => (
        <NavLink linkData={link} key={link.name} />
      ))}
      <NavLink linkData={{ name: "Login", path: "/login" }} />
    </>
  );

  return (
    <>
      <nav className={styles.links}>{links}</nav>
      <div>
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
      </div>
      {mobileOpen && (
        <nav aria-label='mobile menu' className={styles.mobileLinks}>
          {links}
        </nav>
      )}
    </>
  );
};

export default Links;

"use client";

import React, { useState } from "react";
import NavLink from "./navLink/NavLink";
import styles from "./links.module.css";
import { Session } from "next-auth";
import { handleLogout } from "@/lib/action";
import HamburgerButton from "../hamburgerButton/HamburgerButton";

type Props = {
  userSession: Session | null;
};

const Links = ({ userSession }: Props) => {
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
      name: "Blog",
      path: "/blog",
    },
  ];

  const authenticatedUserLinks = userSession ? (
    <>
      <NavLink
        linkData={{ name: "Profile", path: "/userpage" }}
        setMobileOpen={setMobileOpen}
      />
      <form action={handleLogout}>
        <button onClick={() => setMobileOpen(false)} className={styles.logout}>
          Logout
        </button>
      </form>
    </>
  ) : (
    <NavLink
      linkData={{ name: "Login", path: "/login" }}
      setMobileOpen={setMobileOpen}
    />
  );

  const links = (
    <>
      {linksList.map((link) => (
        <NavLink
          linkData={link}
          key={link.name}
          setMobileOpen={setMobileOpen}
        />
      ))}
      {authenticatedUserLinks}
    </>
  );

  return (
    <div className={styles.container}>
      <nav className={styles.links}>{links}</nav>
      <div className={styles.buttonContainer}>
        <HamburgerButton
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      <nav
        aria-label='mobile menu'
        aria-hidden={!mobileOpen}
        className={`${styles.mobileMenu} ${
          mobileOpen && `${styles.mobileMenuOpen}`
        }`}
      >
        <div className={styles.mobileMenuContent}>{links}</div>
      </nav>
    </div>
  );
};

export default Links;

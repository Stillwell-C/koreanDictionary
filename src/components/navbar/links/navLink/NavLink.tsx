"use client";

import Link from "next/link";
import styles from "./navLink.module.css";
import { usePathname } from "next/navigation";

type Props = {
  linkData: {
    path: string;
    name: string;
  };
};

const NavLink = ({ linkData: { path, name } }: Props) => {
  const pathName = usePathname();
  const addActiveClass =
    (path === "/" && pathName === "/") ||
    (path !== "/" && pathName.startsWith(path));

  return (
    <Link
      href={path}
      className={`${styles.container} ${addActiveClass && styles.active}`}
    >
      {name}
    </Link>
  );
};

export default NavLink;

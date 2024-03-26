"use client";

import Link from "next/link";
import styles from "./navLink.module.css";
import { usePathname } from "next/navigation";

type Props = {
  linkData: {
    path: string;
    name: string;
  };
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavLink = ({ linkData: { path, name }, setMobileOpen }: Props) => {
  const pathName = usePathname();
  const addActiveClass =
    (path === "/" && pathName === "/") ||
    (path !== "/" && pathName.startsWith(path));

  return (
    <Link
      href={path}
      className={`${styles.container} ${addActiveClass && styles.active}`}
      onClick={() => setMobileOpen(false)}
    >
      {name}
    </Link>
  );
};

export default NavLink;

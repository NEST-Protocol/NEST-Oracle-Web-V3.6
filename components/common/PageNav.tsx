import React from "react";
import styles from "./PageNav.module.scss";
import Icon from "../ui/Icon";
import Link from "next/link";
export declare interface PageNavProps {
  title: string;
}
export default function PageNav({ title }: PageNavProps) {
  return (
    <div className={`titleBold center ${styles.container}`}>
      <Link href="/">
        <button className={styles.iconButton}>
          <Icon name={"iconBack"} />
        </button>
      </Link>
      {title}
    </div>
  );
}

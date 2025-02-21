import React from "react";
import { TbDna2 } from "react-icons/tb";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderOverlay}>
      <TbDna2 className={styles.loaderIcon} />
      <p className={styles.loaderText}>載入中...</p>
    </div>
  );
}

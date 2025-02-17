import React from "react";
import { AiOutlineVerticalAlignTop } from "react-icons/ai";
import styles from "./ScrollUpTop.module.css";

export default function ScrollUpTop() {
  return (
    <div className={styles.scrollUpBox}>
      <a href="#pageTop" className={styles.scrollUpIcon}>
        <AiOutlineVerticalAlignTop />
      </a>
    </div>
  );
}

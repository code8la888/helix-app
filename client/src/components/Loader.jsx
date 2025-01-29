import React from "react";
import { TbDna2 } from "react-icons/tb";

export default function Loader({ content }) {
  return (
    <div className="loader-overlay">
      <TbDna2 className="loader-icon" />
      <p className="loader-text">{content}</p>
    </div>
  );
}

import React, { ReactElement } from "react";
import Spinner from "../Spinner/Spinner";
import styles from "./Button.module.scss";

interface Props {
  text: string;
  className?: string;
  loading?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button(props: Props): ReactElement {
  const { text, className, loading, onClick, disabled } = props;

  return (
    <button disabled={disabled} className={`${className} ${styles.button} ${loading ? "loading" : ""}`} onClick={onClick}>
        {loading ? <Spinner /> : ""}
      <span>
        {text}
      </span>
    </button>
  );
}

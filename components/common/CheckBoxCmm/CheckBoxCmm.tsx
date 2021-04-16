import React, { ReactElement } from "react";
import styles from "./CheckBoxCmm.module.scss";

interface Props {
  text: string;
  className?: string;
  onChange: () => void;
  disabled?: boolean;
  checkedVal?: boolean;
}

export default function CheckBoxCmm(props: Props): ReactElement {
  const { text, className, onChange, disabled,checkedVal } = props;

  return (
      <div>
      <input type="checkbox" className={`${className} ${styles.checkbox}`} disabled={disabled} checked={checkedVal}   onChange={onChange} />
      <span className={styles.checkboxTxt}>{text}</span>
      </div>
  );
}

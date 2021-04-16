import React from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import styles from "./input.module.scss";
import cls from "classnames";

interface Props extends NumberFormatProps {
  value: number | string | undefined;
  onChange: any;
  placeholder?: string;
  decimal?: number;
  focus?: any;
  disabled?: boolean;
  className?: string;
  textHelper?: string;
  errorMessage?: any;
}

const InputNumber = (props: Props) => {
  const {
    value,
    onChange,
    decimal,
    placeholder,
    focus,
    disabled,
    className,
    textHelper,
    errorMessage,
  } = props;

  return (
    <div>
      <div className={cls({ [styles.withTextHelper]: textHelper })}>
        <NumberFormat
          className={className}
          value={value}
          onValueChange={(value) => onChange(value.formattedValue)}
          placeholder={placeholder}
          decimalScale={decimal ?? 18}
          onFocus={focus}
          disabled={disabled}
        />
        <span className={styles.textHelper}>{textHelper}</span>
      </div>
      <div className={styles.errorMessage}>{errorMessage}</div>
    </div>
  );
};

export default InputNumber;

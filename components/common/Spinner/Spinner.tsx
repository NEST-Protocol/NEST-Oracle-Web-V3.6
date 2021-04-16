import React, { ReactElement } from "react";
import styles from "../Spinner/Spinner.module.scss";
import { ClapSpinner } from "react-spinners-kit";

interface Props {
  color?: string;
}

export default function Spinner(props: Props): ReactElement {
  return <ClapSpinner size={30} frontColor="#ffffff" loading={true} {...props} />;
}

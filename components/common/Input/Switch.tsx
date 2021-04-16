import React, { ReactElement } from "react";
import ReactSwitch, { ReactSwitchProps } from "react-switch";

interface Props extends ReactSwitchProps {
}

export default function Switch(props: ReactSwitchProps): ReactElement {
  return <ReactSwitch 
    uncheckedIcon={false}
    checkedIcon={false}
    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
    onColor="#52CCA3"
    {...props}

  />;
}

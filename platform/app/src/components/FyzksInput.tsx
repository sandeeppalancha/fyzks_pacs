import { Input } from "antd";
import React, { useState } from "react";

const FyzksInput = (props) => {
  const [focus, setFocus] = useState(false);
  const { children, label, value, onEnter } = props;

  const labelClass = focus || value ? "label label-float" : "label";

  return (
    <Input onPressEnter={() => { onEnter && onEnter() }} {...props} style={{ width: "200px" }} />
  );
};

export default FyzksInput;
